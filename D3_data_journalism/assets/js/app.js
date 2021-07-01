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


d3.csv("assets/data/data.csv").then(function (censusData, err) {
	if (err) throw err;

	censusData.forEach(function (data) {
		data.id = +data.id;
		data.poverty = +data.poverty;
		data.age = +data.age;
		data.income = +data.income;
		data.healthcare = +data.healthcare;
		data.obesity = +data.obesity;
		data.smokes = +data.smokes;
	});

}).catch(function (error) {
	console.log(error);
});
