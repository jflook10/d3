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

        vis.xLabel = vis.svg.append('text')
            .attr('x', WIDTH / 2)
            .attr('y', HEIGHT + 50)
            .attr('text-anchor', 'middle')

        Promise.all([
            d3.json(urlMen),
            d3.json(urlWomen)
        ]).then((datasets) => {
            vis.menData = datasets[0]
            vis.womenData = datasets[1]
            vis.update('men')
        })
    }
 update(gender){
     const vis = this

     vis.data = (gender === 'men') ? vis.menData : vis.womenData
     vis.xLabel.text(`The world's tallest ${gender}`)

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
     vis.xAxisGroup
         .transition().duration(500)
         .call(xAxisCall)

     const yAxisCall = d3.axisLeft(y)
     vis.yAxisGroup
         .transition().duration(500)
         .call(yAxisCall)

     // DATA JOIN
        const rects = vis.svg.selectAll('rect')
            .data(vis.data)

     // EXIT
        rects.exit()
            .transition().duration(500)
                .attr('height', 0)
                .attr('y', HEIGHT)
                .remove()

     // UPDATE, data changes and rects on screen, need to change the attributes
        rects
            .transition().duration(500)
            .attr('x', d => x(d.name)) //starting location, each bar spaced per name
            .attr('y', d => y(d.height)) //starting location top 0, pushes bars to the base of svg
            .attr('width', x.bandwidth()) //method for generating bar width, factors in padding
            .attr('height', d => HEIGHT - y(d.height)) //use y linear scale to generate height


     //ENTER, does exist on data but not on screen
        rects.enter()
            .append('rect')
            .attr('x', d => x(d.name)) //starting location, each bar spaced per name
            .attr('width', x.bandwidth()) //method for generating bar width, factors in padding
            .attr('fill', 'grey')
            .attr('y', HEIGHT)
            .transition().duration(500)
                .attr('y', d => y(d.height)) //starting location top 0, pushes bars to the base of svg
                .attr('height', d => HEIGHT - y(d.height)) //use y linear scale to generate height

 }
}