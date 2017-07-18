// Visualization Script
function refreshCalendarView(query, startDate, endDate){

  var width = 960,
      height = 136,
      cellSize = 17; // cell size
  var percent = d3.format(".1%"),
      format = d3.time.format("%Y-%m-%d");
  var color = d3.scale.quantize()
      .domain([-.05, .05])
      .range(d3.range(11).map(function(d) { return "q" + d + "-11"; }));

  var rangeStart = parseInt(startDate.split("-")[0]);
  var rangeEnd = parseInt(endDate.split("-")[0]);
  if(rangeStart == rangeEnd)
    rangeEnd += 1;
  
  var svg = d3.select("#calendarView .panel-body").selectAll("svg")
      .data(d3.range(rangeStart, rangeEnd))
    .enter().append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("class", "RdYlGn")
    .append("g")
      .attr("transform", "translate(" + ((width - cellSize * 53) / 2) + "," + (height - cellSize * 7 - 1) + ")");
  svg.append("text")
      .attr("transform", "translate(-6," + cellSize * 3.5 + ")rotate(-90)")
      .style("text-anchor", "middle")
      .text(function(d) { return d; });
  var rect = svg.selectAll(".day")
      .data(function(d) { return d3.time.days(new Date(d, 0, 1), new Date(d + 1, 0, 1)); })
    .enter().append("rect")
      .attr("class", "day")
      .attr("width", cellSize)
      .attr("height", cellSize)
      .attr("x", function(d) { return d3.time.weekOfYear(d) * cellSize; })
      .attr("y", function(d) { return d.getDay() * cellSize; })
      .datum(format);
  rect.append("title")
      .text(function(d) { return d; });
  svg.selectAll(".month")
      .data(function(d) { return d3.time.months(new Date(d, 0, 1), new Date(d + 1, 0, 1)); })
    .enter().append("path")
      .attr("class", "month")
      .attr("d", monthPath);


  //console.log("Q: " + query + " rows: " + rows + " startDate: " + startDate + " endDate: " + endDate);

  if(!query)
    query = "*:*";

  $.ajax({ url: SOLR_URL + '/query?q=' + query + '&facet=true&facet.date=dates&facet.date.start=' + startDate + '&facet.date.end=' + endDate + '&rows=0&facet.date.gap=%2B1DAY&facet.mincount=1&facet.field.dates.sort=count',dataType: "jsonp", jsonp: 'json.wrf',
  success: function(data1)
  {
    console.log(data1);
   var jsonData = [];
   var csvArray = [];
   datesData = data1.facet_counts.facet_dates.dates;
   tempCSV = csvArray.push('Date,value');
   $.each(datesData, function(k, value)
    {
      if(/^[0-9]{4}-[0-9]{2}-[0-9]{2}T.*/.test(k)){
        tempDate = k.split('T')[0] + ',' + value;
        csvArray.push(tempDate);
      } else {
        return true
      }
    });
   var headers = csvArray[0].split(',');
   
   for ( var i = 1, length = csvArray.length; i < length; i++ )
   {
    var row = csvArray[i].split(',');
    var data1 = {};
    for ( var x = 0; x < row.length; x++ )
    {
     data1[headers[x]] = row[x];
    }
    jsonData.push(data1);
   }
     
   var data = d3.nest()
      .key(function(d) { return d.Date; })
      .rollup(function(d) { return d[0].value/65000; })
      .map(jsonData);
    rect.filter(function(d) { return d in data; })
        .attr("class", function(d) { return "day " + color(data[d]); })
      .select("title")
        .text(function(d) { return d + ": " + data[d] * 65000; });
  }});
  
  function monthPath(t0) {
    var t1 = new Date(t0.getFullYear(), t0.getMonth() + 1, 0),
        d0 = t0.getDay(), w0 = d3.time.weekOfYear(t0),
        d1 = t1.getDay(), w1 = d3.time.weekOfYear(t1);
    return "M" + (w0 + 1) * cellSize + "," + d0 * cellSize
        + "H" + w0 * cellSize + "V" + 7 * cellSize
        + "H" + w1 * cellSize + "V" + (d1 + 1) * cellSize
        + "H" + (w1 + 1) * cellSize + "V" + 0
        + "H" + (w0 + 1) * cellSize + "Z";
  }
  d3.select(self.frameElement).style("height", "2500px");
  
}