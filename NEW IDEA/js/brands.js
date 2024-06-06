document.addEventListener('DOMContentLoaded', function () {
    const stateSelect = d3.select("#state-select");
    const dateSelect = d3.select("#date-select");

    let motorVehicleDeathsData;
    const svgObject = document.getElementById("usa-map");

    d3.json("data/most-popular-car-by-state-2024.json").then(function(data) {
        const states = data.map(d => d.state);
        stateSelect.selectAll("option")
            .data(states)
            .enter().append("option")
            .text(d => d)
            .attr("value", d => d);

        stateSelect.on("change", function() {
            const selectedState = stateSelect.node().value;
            const stateData = data.find(d => d.state === selectedState);
            if (stateData) {
                updateTable(stateData);
                highlightState(stateAbbreviations[selectedState]);
            }
        });

        updateTable(data[0]);
        highlightState(stateAbbreviations[data[0].state]);
    }).catch(error => {
        console.error("Error loading JSON data:", error);
    });

    d3.json("data/motor_deaths_state.json").then(function(data) {
        motorVehicleDeathsData = data.motorVehicleDeaths;
        const dates = motorVehicleDeathsData.map(d => d.Year);
        dateSelect.selectAll("option")
            .data(dates)
            .enter().append("option")
            .text(d => d)
            .attr("value", d => d);

        dateSelect.on("change", function() {
            updateMapColors(dateSelect.node().value);
        });

        updateMapColors(dates[0]);
    }).catch(error => {
        console.error("Error loading motor deaths JSON data:", error);
    });

    if (svgObject) {
        svgObject.addEventListener("load", function () {
            const svgDoc = svgObject.contentDocument;
            if (svgDoc) {
                const svgElements = svgDoc.querySelectorAll("path, rect, circle, ellipse, polygon, polyline, line");
                svgElements.forEach(element => {
                    element.addEventListener("mouseover", function () {
                        const stateId = element.id;
                        const stateName = Object.keys(stateAbbreviations).find(key => stateAbbreviations[key] === stateId);
                        if (stateName) {
                            stateSelect.property("value", stateName);
                            stateSelect.dispatchEvent(new Event('change'));
                        }
                    });
                });
            } else {
                console.error("SVG contentDocument is null");
            }
        });
    } else {
        console.error("SVG object with ID 'usa-map' is not found");
    }
});

function updateTable(stateData) {
    const table = d3.select("#brand-table");
    table.selectAll("*").remove();

    const brands = [
        { rank: 1, brand: stateData.MostPopularCarMostPopular2022 },
        { rank: 2, brand: stateData.MostPopularCar2ndMostPopular },
        { rank: 3, brand: stateData.MostPopularCar3rdMostPopular },
        { rank: 4, brand: stateData.MostPopularCar4thMostPopular },
        { rank: 5, brand: stateData.MostPopularCar5thMostPopular }
    ];

    const rows = table.append("tbody")
        .selectAll("tr")
        .data(brands)
        .enter()
        .append("tr")
        .style("background-color", (d, i) => d3.schemeCategory10[i]);

    rows.append("td").text(d => d.rank);
    rows.append("td").text(d => d.brand);
}

function highlightState(state) {
    d3.selectAll("path").classed("highlight", false);
    const stateElement = d3.select(`#${state}`);
    if (!stateElement.empty()) {
        stateElement.classed("highlight", true);
    }
}

function updateMapColors(selectedYear) {
    const selectedData = motorVehicleDeathsData.find(d => d.Year == selectedYear).Data;
    const colorScale = d3.scaleSequential(d3.interpolateBlues)
        .domain([0, d3.max(selectedData, d => d.MotorVehicleDeathsPer100000Population)]);

    d3.select("#usa-map").selectAll("path").each(function() {
        const stateAbbr = this.id.toLowerCase();
        const stateData = selectedData.find(d => stateAbbreviations[d.State] === stateAbbr);
        if (stateData) {
            d3.select(this).style("fill", colorScale(stateData.MotorVehicleDeathsPer100000Population));
        }
    });
}
