document.addEventListener('DOMContentLoaded', function () {
    const margin = {top: 40, right: 30, bottom: 60, left: 60};
    const width = 1200 - margin.left - margin.right;
    const height = 600 - margin.top - margin.bottom;

    const svg = d3.select("#chart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .style("border", "1px solid black")
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    const legend = d3.select("#legend").append("svg")
        .attr("width", 400)
        .attr("height", 100);

    Promise.all([
        d3.json("data/car_crashes.json"),
        d3.json("data/population.json")
    ]).then(function([carCrashesData, populationData]) {
        const x = d3.scaleLinear()
            .domain([Math.min(d3.min(carCrashesData, d => d.Year), d3.min(populationData, d => d.Year)),
                     Math.max(d3.max(carCrashesData, d => d.Year), d3.max(populationData, d => d.Year))])
            .range([0, width]);

        const yCarCrashes = d3.scaleLinear()
            .domain([0, d3.max(carCrashesData, d => d.Deaths)])
            .range([height, 0]);

        const yPopulation = d3.scaleLinear()
            .domain([0, d3.max(populationData, d => d.Population)])
            .range([height, 0]);

        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x).tickFormat(d3.format("d")));

        svg.append("g")
            .call(d3.axisLeft(yCarCrashes));

        svg.append("path")
            .datum(carCrashesData)
            .attr("class", "line car-crashes-line")
            .attr("d", d3.line().x(d => x(d.Year)).y(d => yCarCrashes(d.Deaths)))
            .attr("stroke", "red");

        svg.append("path")
            .datum(populationData)
            .attr("class", "line population-line")
            .attr("d", d3.line().x(d => x(d.Year)).y(d => yPopulation(d.Population)))
            .attr("stroke", "green");

        addBestFitLine(svg, carCrashesData, x, yCarCrashes, "Deaths", "darkred", "car-crashes-best-fit");
        addBestFitLine(svg, populationData, x, yPopulation, "Population", "darkgreen", "population-best-fit");
        addLegend(svg, legend);
    });

    function addBestFitLine(svg, data, x, y, yValue, color, className) {
        const n = data.length;
        const sumX = d3.sum(data, d => d.Year);
        const sumY = d3.sum(data, d => d[yValue]);
        const sumXY = d3.sum(data, d => d.Year * d[yValue]);
        const sumX2 = d3.sum(data, d => d.Year * d.Year);
        const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
        const intercept = (sumY - slope * sumX) / n;
        const bestFitLine = d3.line()
            .x(d => x(d.Year))
            .y(d => y(slope * d.Year + intercept));

        svg.append("path")
            .datum(data.map(d => ({Year: d.Year})))
            .attr("class", "best-fit-line " + className)
            .attr("d", bestFitLine)
            .style("stroke", color)
            .style("stroke-width", 2)
            .style("fill", "none");
    }

    function addLegend(svg, legend) {
        const legendItems = [
            { color: "red", text: "Car Crashes" },
            { color: "darkred", text: "Car Crashes Best Fit Line" },
            { color: "green", text: "Population" },
            { color: "darkgreen", text: "Population Best Fit Line" }
        ];

        const legendGroup = legend.selectAll(".legend")
            .data(legendItems)
            .enter()
            .append("g")
            .attr("class", "legend")
            .attr("transform", (d, i) => `translate(0, ${i * 20})`);

        legendGroup.append("rect")
            .attr("x", 10)
            .attr("y", 0)
            .attr("width", 20)
            .attr("height", 10)
            .style("fill", d => d.color);

        legendGroup.append("text")
            .attr("x", 40)
            .attr("y", 10)
            .text(d => d.text)
            .style("font-size", "12px");
    }
});
