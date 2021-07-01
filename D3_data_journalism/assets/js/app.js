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
var width = 820; 
var height = 400;

var svg = d3
	.select("#scatter")
	.append("svg")
	.attr("width", 960)
	.attr("height", 500);

var charts = svg.append("g")
	.attr("transform", `translate(${100}, ${20})`);

function get_xScale(censusData, currXAxis) {
    return d3.scaleLinear()
        .domain([d3.min(censusData, d => d[currXAxis]) * (1 - 0.2),
        d3.max(censusData, d => d[currXAxis]) * (1 + 0.2)])
        .range([0, width]);
}

function get_yScale(censusData, currYAxis) {
	return d3.scaleLinear()
		.domain([0, d3.max(censusData, d => d[currYAxis]) * (1 + 0.2)])
		.range([height, 0]);
}

function renderXAxis(newXAxis, xAxis) {
	var bottomAxis = d3.axisBottom(newXAxis);
	xAxis.transition()
		.duration(1000)
		.call(bottomAxis);
	//
	return xAxis;
}

// function used for updating yAxis var upon click on axis label
function renderYAxis(newYAxis, yAxis) {
	var leftAxis = d3.axisLeft(newYAxis);
	// shift axis
	yAxis.transition()
		.duration(1000)
		.call(leftAxis);
	//
	return yAxis;
}

function renderCircles(circles, newXAxis, newYAxis, currXAxis, currYAxis){
	circles.selectAll("circle")
		.transition()
		.duration(1000)
		.attr("cx", d => newXAxis(d[currXAxis]))
		.attr("cy", d => newYAxis(d[currYAxis]));
	// use a transition to shift the circles' text
	circles.selectAll("text")
		.transition()
		.duration(1000)
		.attr("x", d => newXAxis(d[currXAxis]))
		.attr("y", d => newYAxis(d[currYAxis]));
	//
	return circles;
}

function formatToolTipText(label, number) {
	var line = `${label.split(" (")[0]}: `;
	if (label.includes("%")) {
		line += `${number}%`
    }
	else if (label.includes("USD")) {
		line += `$${number.toLocaleString()}`;
    }
	else {
        line += number;
    }
	return line;
}

function updateCircles(currXAxis, currYAxis, circles) {
	var xLabel = "";
	var yLabel = "";
	// loop thru the x axes to get the matching option
	for (var i = 0; i < xAxes.length; i++)
		if (currXAxis == xAxes[i].option)
			xLabel = xAxes[i].label;
	// loop thru the y axes to get the matching option
	for (var i = 0; i < yAxes.length; i++)
		if (currYAxis == yAxes[i].option)
			yLabel = yAxes[i].label;
	// add a tooltip
	var toolTip = d3.tip()
		.attr("class", "tooltip")
		.offset([110, 0])
		.html(d => [
			d.state,
			formatToolTipText(xLabel, d[currXAxis]),
			formatToolTipText(yLabel, d[currYAxis])
		].join("<br>"));
	// add the callback
	circles.call(toolTip);
	// add the mouse over event
	circles
		.on("mouseover", (data, index, element) => toolTip.show(data, element[index]))
		.on("mouseout", (data, index, element) => toolTip.hide(data, element[index]));
	//
	return circles;
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

	var xScale = get_xScale(censusData, currXAxis);
	var yScale = get_yScale(censusData, currYAxis)

	var leftAxis = d3.axisLeft(yScale);
	var bottomAxis = d3.axisBottom(xScale);

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
    .attr("cx", d => xScale(d[currXAxis]))
    .attr("cy", d => yScale(d[currYAxis]))
    .attr("r", 10)
    .attr("fill", "#E6E6FA");

    circles.append("text")
    .attr("x", d => xScale(d[currXAxis]))
    .attr("y", d => yScale(d[currYAxis]))
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "middle")
    .attr("font-size", `${10}px`)
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

    for (var i = 0; i < yAxes.length; i++)
		yLabels.push(labels.append("text")
			.attr("transform", "rotate(-90)")
			.attr("x", height * 0.5)
			.attr("y", -width * 0.5 - (i + 2) * 17)
			.attr("value", yAxes[i].option)
			.classed("active", yAxes[i].option === currYAxis)
			.classed("inactive", yAxes[i].option !== currYAxis)
			.text(yAxes[i].label));

    var circles = updateCircles(currXAxis, currYAxis, circles);

    labels.selectAll("text")
    .on("click", function () {
        // get selection
        var value = d3.select(this).attr("value");
        var isXAxis = false;
        // update value
        for (var i = 0; i < xAxes.length; i++)
            if (xAxes[i].option === value) {
                isXAxis = true;
                break;
            }
        // dont do unless it actually changed
        if ((isXAxis && value !== currXAxis) || (isXAxis === false && value !== currYAxis)) {

            if (isXAxis) {
                currXAxis = value
            }
            else {
                currYAxis = value;
            }
            //refresh the x and y scales
            xScale = get_xScale(censusData, currXAxis);
            yScale = get_yScale(censusData, currYAxis);

            // re-render x and y scales
            xAxis = renderXAxis(xScale, xAxis);
            yAxis = renderYAxis(yScale, yAxis);

            // updates circles with new x and y values
            circles = renderCircles(circles, xScale, yScale, currXAxis, currYAxis);

            // updates tooltips with new info
            circles = updateCircles(currXAxis, currYAxis, circles);

            // switch up classes to emphasize active x and y
            for (var i = 0; i < xAxes.length; i++)
                xLabels[i]
                    .classed("active", currXAxis === xAxes[i].option)
                    .classed("inactive", currXAxis !== xAxes[i].option);
            for (var i = 0; i < yAxes.length; i++)
                yLabels[i]
                    .classed("active", currYAxis === yAxes[i].option)
                    .classed("inactive", currYAxis !== yAxes[i].option);
        }
    });

}).catch(function (error) {
	console.log(error);
});
