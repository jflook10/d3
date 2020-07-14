import React from "react";
import * as d3 from 'd3';

const urlMen = 'https://udemy-react-d3.firebaseio.com/tallest_men.json'
const urlWomen = 'https://udemy-react-d3.firebaseio.com/tallest_women.json'
const MARGIN={TOP: 10, BOTTOM: 50, LEFT: 70, RIGHT: 10}
const WIDTH = 800 - MARGIN.LEFT - MARGIN.RIGHT
const HEIGHT = 500 - MARGIN.TOP - MARGIN.BOTTOM

export default class D3Chart {
    constructor(element) {
        const vis = this //rename for clarification
        vis.svg = d3.select(element)
            .append('svg')
            .attr('width', WIDTH + MARGIN.LEFT + MARGIN.RIGHT) //add vals back in to get the full size
            .attr('height', HEIGHT + MARGIN.TOP + MARGIN.BOTTOM)
            .append('g')
            .attr('transform', `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`)

        //pulling the g append up so that it isnt rendered each run of update
        vis.yAxisGroup = vis.svg.append('g')
        vis.xAxisGroup = vis.svg.append('g')
            .attr('transform', `translate(0, ${HEIGHT})`)


        vis.svg.append('text')
            .attr('x', -HEIGHT / 2)
            .attr('y', -40)
            .attr('text-anchor', 'middle')
            .attr('transform', 'rotate(-90)') //rotate flips the x and y axis, also had to incr the margin for more space
            .text("Height in cm")

        vis.svg.append('text')
            .attr('x', WIDTH / 2)
            .attr('y', HEIGHT + 50)
            .attr('text-anchor', 'middle')
            .text("The World's Tallest Men")

        Promise.all([
            d3.json(urlMen),
            d3.json(urlWomen)
        ]).then((datasets) => {
            const [men, women] = datasets
            let flag = true
            vis.data = men

            vis.update()

            d3.interval(() => {
                vis.data = flag ? men : women
                vis.update()
                flag =! flag
            }, 5000)
        })
    }
 update(){
     const vis = this
     const max = d3.max(vis.data, d => d.height) //method to return max value
     const y = d3.scaleLinear()
         .domain([
             d3.min(vis.data, d => d.height * 0.95),
             max
          ]) //adjusting the min to highlight differences in height
         .range([HEIGHT, 0])

     const x = d3.scaleBand()
         .domain(vis.data.map(d => d.name))
         .range([0, WIDTH])
         .padding(0.4)

     const xAxisCall = d3.axisBottom(x)
     vis.xAxisGroup.call(xAxisCall)

     const yAxisCall = d3.axisLeft(y)
     vis.yAxisGroup.call(yAxisCall)

     // DATA JOIN
        const rects = vis.svg.selectAll('rect')
            .data(vis.data)

     // EXIT
        rects.exit().remove()

     // UPDATE, data changes and rects on screen, need to change the attributes
        rects
            .attr('x', d => x(d.name)) //starting location, each bar spaced per name
            .attr('y', d => y(d.height)) //starting location top 0, pushes bars to the base of svg
            .attr('width', x.bandwidth()) //method for generating bar width, factors in padding
            .attr('height', d => HEIGHT - y(d.height)) //use y linear scale to generate height
            .attr('fill', 'grey')

     //ENTER, does exist on data but not on screen
        rects.enter()
            .append('rect')
            .attr('x', d => x(d.name)) //starting location, each bar spaced per name
            .attr('y', d => y(d.height)) //starting location top 0, pushes bars to the base of svg
            .attr('width', x.bandwidth()) //method for generating bar width, factors in padding
            .attr('height', d => HEIGHT - y(d.height)) //use y linear scale to generate height
            .attr('fill', 'grey')

 }
}