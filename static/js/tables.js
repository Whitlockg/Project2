// Get the corona virus data and start plotting:
// get table references
const tbody = d3.select("tbody");
function country_data(data, colVal) {
    // console.log(data);    
    // Next, loop through each object in the data
    // and append a row and cells for each value in the row
    data.forEach((dataRow) => {
        // console.log(dataRow);
        // Append a row to the table body
        const row = tbody.append("tr");
        // Go through relevant columns and add
        let cell1 = row.append("td");
        cell1.text(dataRow.country_name);
        // if function doesn't work:
        // if colVal == 'num_cases'
        let cell2 = row.append("td");
        cell2.text(dataRow.colVal.sort(d3.descending));
});

function handleClick(data) {
    const colVal = d3.select("#countries_table").property("value");
    country_data(data, colVal);
}

// TO DO - Later replace d3.csv with d3.json
d3.csv("../static/data/coronadata.csv").then((data) => {

    // will this work???
    country_data(data, num_cases);

    // TO DO - change to respond to dropdown selection
    // event listener part
    d3.selectAll("#filter-btn").on("click", handleClick(data));
});