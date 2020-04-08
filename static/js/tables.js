// Get the corona virus data and start plotting:
// TO DO - Later replace d3.csv with d3.json
d3.csv("../../data/coronadata.csv", function(Cases_table) {
    var parsedCSV = d3.csvParseRows(Cases_table);

    var container = d3.select("body")
        .append("table")
        .selectAll("tr")
            .Cases_table(parsedCSV).enter()
            .append("tr")
        .selectAll("td")
            .Cases_table(function(d) {return d;}).enter()
            .append("td")
            .csv(function(d) {return d;});
})