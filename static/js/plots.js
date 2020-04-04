
async function ebola_data() {
    const cases = {}
    const response = await fetch('../data/final_ebola.csv');
    const data = await response.text();
    const table = data.split(/\n/).slice(1);
    table.map((row) => {
        const columns = row.split(',');
        const date = columns[0];
        const thing = parseInt(columns[2]);
        // if cases does not contain the date, insert into
        // cases an entry where the "date", is the key, and the
        // cases are the number
        if (!cases[date]) {
            cases[date] = thing;
        } else {
            cases[date] = cases[date] + thing;
        }
    })
    console.log(ebola_data)

    const ctx = document.getElementById('ebolachart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: Object.keys(cases),
            datasets: [{
                label: 'Number of Ebola Cases',
                backgroundColor: '',
                
                borderColor: 'rgb(255, 99, 132)',
                data: Object.values(cases)
            }]
        },
    });
}
ebola_data();

async function sars(){
    const sarscases = {};
    const response = await fetch('final_sars.csv');
    const data2 = await response.text();
    const row2 = data2.split(/\n/).slice(1);
    table.map(row2 => {
        const columns2 = elt.split(',');
        const date2 = row2[0];
        const cases2 = row2[1];
        console.log(sars);

// Sars chart 

    const ctx = document.getElementById('sarschart').getContext('2d');
    new Chart(ctx, {
        type: 'line', 
        data: {
            labels: Object.keys(cases2), 
            datasets: [{
                label: 'Number of Sars Cases', 
                backgroundColor: ',', 
                borderColor: 'rgb(255, 99, 132)', 
                data: Object.values(cases2)
            }],
        },
    })
})

}

function plotCoronavirus(){
    Plotly.d3.csv('corona_virus_timeseries.csv', (data) => {
        formatData(data);
        console.log("--Data", data);
        stackGraphForCoronavirus(data);
      
    })
}
plotCoronavirus();


function formatData(data) {

   let newData = data.map(data => {
       return {
           x: [data.report_date],
           y: [data.num_cases],
           name: data.country_name,
           type: "scatter"
       }
   })


var layout = {
 title: 'Time series for coronavirus',
 xaxis: {
   title: 'Report Date'
 },
 yaxis: {
   title: 'Number of Cases'
 }
};
   Plotly.newPlot('myDiv', newData, layout);

}


function stackGraphForCoronavirus(data) {

   let total = data.reduce((prev, curr) => {
   prev.confirmed = prev.confirmed + parseInt(curr.num_cases, 10)
   prev.recovered = prev.recovered + parseInt(curr.num_recovered, 10)
   prev.deaths =  prev.deaths + parseInt(curr.num_deaths, 10)
   return prev;
   }, {confirmed: 0, recovered: 0, deaths: 0});


   console.log("--Total", total);

}


