var xAxes = [
	{
		option: "poverty",
		label: "In Poverty (%)"
	},
	{
		option: "age",
		label: "Age (Median)"
	},
	{
		option: "income",
		label: "Household Income (USD Median)"
	}
];
var yAxes = [
	{
		option: "healthcare",
		label: "Lacks Healthcare (%)"
	},
	{
		option: "smokes",
		label: "Smokes (%)"
	},
	{
		option: "obesity",
		label: "Obese (%)"
	}
];

var currXAxis = xAxes[0].option;
var currYAxis = yAxes[0].option;

var width = 960 - 100 - 40;
var height = 500 - 20 - 80;

var svg = d3
	.select("#scatter")
	.append("svg")
	.attr("width", 960)
	.attr("height", 500);

var charts = svg.append("g")
	.attr("transform", `translate(${100}, ${20})`);

function get_xScale(censusData, currXAxis) {
    return null
}

// function used for updating y-scale var upon click on axis label
function get_yScale(censusData, currYAxis) {
    return null
}

function updateCircles(currXAxis, currYAxis, circles) {
    return null
}

d3.csv("assets/data/data.csv").then(function (censusData, err) {
	if (err) throw err;
    //get data
	censusData.forEach(function (data) {
		data.id = +data.id;
		data.poverty = +data.poverty;
		data.age = +data.age;
		data.income = +data.income;
		data.healthcare = +data.healthcare;
		data.obesity = +data.obesity;
		data.smokes = +data.smokes;
	});

	// stubbed out for now
	var xScale = get_xScale(censusData, currXAxis);
	var yScale = get_yScale(censusData, currYAxis)

	var leftAxis = d3.axisLeft(yLinearScale);
	var bottomAxis = d3.axisBottom(xLinearScale);

	var xAxis = charts.append("g").classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

	var yAxis = charts.append("g").classed("y-axis", true).call(leftAxis);
    var circles = charts.selectAll("g>circle").data(censusData).enter().append("g");

    var labels = charts.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);

    var xLabels = [];
	var yLabels = [];

    circles.append("circle")
    .attr("cx", d => xLinearScale(d[currXAxis]))
    .attr("cy", d => yLinearScale(d[currYAxis]))
    .attr("r", svgCirclesRadius)
    .attr("fill", svgCirclesColor);

    circles.append("text")
    .attr("x", d => xLinearScale(d[currXAxis]))
    .attr("y", d => yLinearScale(d[currYAxis]))
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "middle")
    .attr("font-size", `${svgCirclesRadius}px`)
    .attr("fill", "white")
    .text(d => d.abbr);

    for (var i = 0; i < xAxes.length; i++)
    xLabels.push(labels.append("text")
        .attr("x", 0)
        .attr("y", (i + 1) * 17)
        .attr("value", xAxes[i].option)
        .classed("active", xAxes[i].option === currXAxis)
        .classed("inactive", xAxes[i].option !== currXAxis)
        .text(xAxes[i].label));

    var circles = updateCircles(currXAxis, currYAxis, circles);

}).catch(function (error) {
	console.log(error);
});
