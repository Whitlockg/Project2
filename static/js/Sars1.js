
async function sars_data() {
    const cases = {}
    const response = await fetch('../static/data/final_sars.csv');
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
    console.log(sars_data)

    const ctx = document.getElementById('sarschart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: Object.keys(cases),
            datasets: [{
                label: 'Number of Sars Cases',
                backgroundColor: '',
                
                borderColor: 'rgb(255, 99, 132)',
                data: Object.values(cases)
            }]
        },
    });
}
sars_data();



