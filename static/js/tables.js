// Get the corona virus data and start plotting:

// get table references
const tbody = d3.select("tbody");

// TO DO - Later replace d3.csv with d3.json
d3.csv("../static/data/coronadata.csv").then(function(data) {
    console.log(data);
    // var parsedCSV = d3.csvParseRows(data);

    // Next, loop through each object in the data
    // and append a row and cells for each value in the row
    data.forEach((dataRow) => {
        // Append a row to the table body
        const row = tbody.append("tr");
        
        // Loop through each field in the dataRow and add
        // each value as a table cell (td)
        Object.values(dataRow).forEach((val) => {
            let cell = row.append("td");
            cell.text(val);
            }
        );
    });
})