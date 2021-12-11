// Define SVG area dimensions
var svgWidth = 1000;
var svgHeight = 600;

//Define the margins for the chart as an object
var chartMargin = {
    top: 30,
    right: 30,
    bottom: 80,
    left: 100
};

//Define the dimensions of the chart area
var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;

//Select body, append SVG area to it and set the dimensions to create a wrapper
var svg = d3
    .select('#scatter')
    .append('svg')
    .attr('height', svgHeight)
    .attr('width', svgWidth);
var chartGroup = svg.append('g')
    .attr('transform', `translate(${chartMargin.left}, ${chartMargin.top})`)

//load data from csv
d3.csv("assets/data/data.csv").then(function(realData) {
    console.log(realData);
    realData.forEach(function(data) {
        data.healthcare = +data.healthcare;
        data.poverty = +data.poverty;
    });

//configure a scale for x and y axis
var xLinearScale = d3.scaleLinear()
    .domain([d3.min(realData, d => d.poverty)*.9, d3.max(realData, d => d.poverty)*1.2])
    .range([0, chartWidth]);
    
var yLinearScale = d3.scaleLinear()
    .domain([2, d3.max(realData, d => d.healthcare)])
    .range([chartHeight, 0]);

//create chart axes and append them to the chart
var bottomAxis = d3.axisBottom(xLinearScale);
var leftAxis = d3.axisLeft(yLinearScale);

chartGroup.append("g")
    .attr("transform", `translate(0, ${chartHeight})`)
    .call(bottomAxis);

chartGroup.append("g")
    .call(leftAxis);

//create the circles and add the labels
var circles = chartGroup.selectAll("circle")
    .data(realData)
    .enter()
    .append("circle")
    .attr("x", d => xLinearScale(d.poverty))
    .attr("y", d => yLinearScale(d.healthcare))

var clabels = chartGroup.selectAll(null).data(realData).enter().append("text");

clabels
    .attr("x", function(d) {
        return xLinearScale(d.poverty);
    })
    .attr("y", function(d) {
        return yLinearScale(d.healthcare);
    })
    .text(function(d) {
        return d.abbr;
    });

chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", 0 - (chartHeight/2))
    .attr("y", 0 - chartMargin.left + 50)
    .attr("class", "axisText")
    .text("Lacks Healthcare (%)");

chartGroup.append("text")
    .attr("transform", `translate(${chartWidth/2}, ${chartHeight + chartMargin.top + 30})`)
    .attr("class", "axisText")
    .text("In Poverty (%)");

}).catch (function(error) {
    console.log(error);
});
