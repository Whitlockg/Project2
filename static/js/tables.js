// Get the corona virus data and start plotting:
// SMTODO - Later replace d3.csv with d3.json
// d3.csv("../../Final_Dataset/Cases_table.csv", function(Cases_table) {
//     var parsedCSV = d3.csvParseRows(Cases_table);

//     var container = d3.select("body")
//         .append("table")
//         .selectAll("tr")
//             .Cases_table(parsedCSV).enter()
//             .append("tr")
//         .selectAll("td")
//             .Cases_table(function(d) {return d;}).enter()
//             .append("td")
//             .csv(function(d) {return d;});
// })


$(document).ready(function(){
    $('#load_data').click(function(){
     $.ajax({
      url:"../../Final_Dataset/Cases_table.csv",
      dataType:"text",
      success:function(data)
      {
       var cases_data = data.split(/\r?\n|\r/);
       var table_data = '<table class="table table-striped table-inverse table-dark">';
       for(var count = 0; count<cases_data.length; count++)
       {
        var cell_data = cases_data[count].split(",");
        table_data += '<tr>';
        for(var cell_count=0; cell_count<cell_data.length; cell_count++)
        {
         if(count === 0)
         {
          table_data += '<th>'+cell_data[cell_count]+'</th>';
         }
         else
         {
          table_data += '<td>'+cell_data[cell_count]+'</td>';
         }
        }
        table_data += '</tr>';
       }
       table_data += '</table>';
       $('#cases_table').html(table_data);
      }
     });
    });
    
   });