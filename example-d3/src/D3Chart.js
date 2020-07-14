import React from "react";
import * as d3 from 'd3';

const url = 'https://udemy-react-d3.firebaseio.com/tallest_men.json'
const MARGIN={TOP: 10, BOTTOM: 50, LEFT: 70, RIGHT: 10}
const WIDTH = 800 - MARGIN.LEFT - MARGIN.RIGHT
const HEIGHT = 500 - MARGIN.TOP - MARGIN.BOTTOM

export default class D3Chart {
    constructor(element) {
        const svg = d3.select(element)
            .append('svg')
                .attr('width', WIDTH + MARGIN.LEFT + MARGIN.RIGHT) //add vals back in to get the full size
                .attr('height', HEIGHT + MARGIN.TOP + MARGIN.BOTTOM)
            .append('g')
                .attr('transform', `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`)

        d3.json(url).then(data => {
            //determine y axis, requires domain and range. use this for the height
            const max = d3.max(data, d => d.height) //method to return max value
            const y = d3.scaleLinear()
                // .domain([0, max])  if we want standard, starting from 0
                .domain([
                    d3.min(data, d => d.height * 0.95),
                    max
                ]) //adjusting the min to highlight differences in height
                .range([HEIGHT, 0])

            //determine x axis, requires domain, range, and padding (interval btw bars). Domain are the bars/labels
            const x = d3.scaleBand()
                .domain(data.map(d => d.name))
                .range([0, WIDTH])
                .padding(0.4)

            const xAxisCall = d3.axisBottom(x)
            svg.append('g')
                .attr('transform', `translate(0, ${HEIGHT})`)
                .call(xAxisCall)

            svg.append('text')
                .attr('x', WIDTH/2)
                .attr('y', HEIGHT + 50)
                .attr('text-anchor', 'middle')
                .text("The World's Tallest Men")

            const yAxisCall = d3.axisLeft(y)
            svg.append('g')
                .call(yAxisCall)

            svg.append('text')
                .attr('x', -HEIGHT/2)
                .attr('y', -40)
                .attr('text-anchor', 'middle')
                .attr('transform', 'rotate(-90)') //rotate flips the x and y axis, also had to incr the margin for more space
                .text("Height in cm")

            const rects = svg.selectAll('rect')
                .data(data)

            rects.enter()
                .append('rect')
                .attr('x', d => x(d.name)) //starting location, each bar spaced per name
                .attr('y', d => y(d.height)) //starting location top 0, pushes bars to the base of svg
                .attr('width', x.bandwidth()) //method for generating bar width, factors in padding
                .attr('height', d => HEIGHT - y(d.height)) //use y linear scale to generate height
                .attr('fill', 'grey')
        })
 }
}

//for barchart, want a linear scale for y-axis that proportionally correlates the data including max/min to the UI max/min
// x-axis needs a band-scale which (UI-wise) computes the available widths and tics