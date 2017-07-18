function refreshHzBarChart(){
    var label_names = [];
    var Standards = [];
    var Apache = [];
    var Binaries = [];
    var Generated = [];
    var Unknown = [];
    var Archives = [];
    var Notes = [];


    d3.json(SOLR_URL + '/select?q=type:software&rows=220&fl=license_*,id&sort=id+asc&wt=json', function(error, root) {
    if (error) throw error;

        var docs = root.response.docs;

        for(var i = 0; i < docs.length; i++) {
            var doc = docs[i];
            var repo = doc.id.split("/");
            var reponame = repo[repo.length - 1];
            if (reponame.indexOf("part") == 0)
                reponame = repo[repo.length - 2];

            if (label_names[label_names.length - 1] == reponame) {
                Standards[Standards.length - 1] += doc["license_Standards"];
                Apache[Apache.length - 1] += doc["license_Apache"];
                Binaries[Binaries.length - 1] += doc["license_Binaries"];
                Generated[Generated.length - 1] += doc["license_Generated"];
                Unknown[Unknown.length - 1] += doc["license_Unknown"];
                Archives[Archives.length - 1] += doc["license_Archives"];
                Notes[Notes.length - 1] += doc["license_Notes"];
                continue;
            }

            label_names.push(reponame);
            Standards.push(doc["license_Standards"]);
            Apache.push(doc["license_Apache"]);
            Binaries.push(doc["license_Binaries"]);
            Generated.push(doc["license_Generated"]);
            Unknown.push(doc["license_Unknown"]);
            Archives.push(doc["license_Archives"]);
            Notes.push(doc["license_Notes"]);
            
            //if(i == 10)
            //    break;
        }

        /*

        for(var i = 0; i < docs.length; i++) {
            var doc = docs[i];
            Standards.push(doc["license_Standards"]);
            Apache.push(doc["license_Apache"]);
            Binaries.push(doc["license_Binaries"]);
            Generated.push(doc["license_Generated"]);
            Unknown.push(doc["license_Unknown"]);
            Archives.push(doc["license_Archives"]);
            Notes.push(doc["license_Notes"]);
            //if(i == 10)
            //    break;
        }
        */

    var data = {
      "labels": label_names,
      "series": [
        {
          label: 'Standards',
          values: Standards
        },
        {
          label: 'Apache',
          values: Apache
        },
        {
          label: 'Binaries',
          values: Binaries
        },
        {
          label: 'Generated',
          values: Generated
        },
        {
          label: 'Unknown',
          values: Unknown
        },
        {
          label: 'Archives',
          values: Archives
        },
        {
          label: 'Notes',
          values: Notes
        }]
    };

    //data = JSON.parse(data);

    //data = JSON.stringify(data);

    console.log(data);

    //alert(data["labels"]);

    var chartWidth       = 600,
        barHeight        = 25,
        groupHeight      = barHeight * data.series.length,
        gapBetweenGroups = 25,
        spaceForLabels   = 150,
        spaceForLegend   = 150;

    // Zip the series data together (first values, second values, etc.)
    var zippedData = [];
    for (var i=0; i<data.labels.length; i++) {
      for (var j=0; j<data.series.length; j++) {
        zippedData.push(data.series[j].values[i]);
      }
    }

    // Color scale
    var color = d3.scale.category20();
    var mylabels = ["Standards", "Apache", "Binaries", "Generated", "Unknown", "Archives", "Notes"];
    var chartHeight = barHeight * zippedData.length + gapBetweenGroups * data.labels.length;

    var x = d3.scale.linear()
        .domain([0, d3.max(zippedData)])
        .range([0, chartWidth]);

    var y = d3.scale.linear()
        .range([chartHeight + gapBetweenGroups, 0]);

    var yAxis = d3.svg.axis()
        .scale(y)
        .tickFormat('')
        .tickSize(0)
        .orient("left");

    // Specify the chart area and dimensions
    var chart = d3.select("#hzBarChart .panel-body").append("svg")
        .attr("width", spaceForLabels + chartWidth + spaceForLegend)
        .attr("height", chartHeight);

    // Create bars
    var bar = chart.selectAll("g")
        .data(zippedData)
        .enter().append("g")
        .attr("transform", function(d, i) {
          return "translate(" + spaceForLabels + "," + (i * barHeight + gapBetweenGroups * (0.5 + Math.floor(i/data.series.length))) + ")";
        });

    // Create rectangles of the correct width
    bar.append("rect")
        .attr("fill", function(d,i) { return color(i % data.series.length); })
        .attr("class", "bar")
        .attr("width", x)
        .attr("height", barHeight - 1);

    bar.append('rect')
        .attr("x", function(d) { if(x(d) < 10) return x(d) + 10; else if(x(d) < 75) return x(d) - 77; else return x(d) - 83; })
        .attr("y", 7)
        .attr('width', 80)
        .attr('height', barHeight - 15)
        .attr('fill', 'white')

    // Add text label in bar
    bar.append("text")
        .attr("x", function(d) { if(x(d) < 80) return 80; else return x(d) - 3; })
        .attr("y", barHeight / 2)
        .attr("fill", function(d,i) { return color(i % data.series.length); })
        .attr("dy", ".35em")
        .text(function(d, i) { return d + " " + mylabels[i % data.series.length]; });


    // Draw labels
    bar.append("text")
        .attr("class", "label")
        .attr("x", function(d) { return - 10; })
        .attr("y", groupHeight / 2)
        .attr("dy", ".35em")
        .text(function(d,i) {
          if (i % data.series.length === 0)
            return data.labels[Math.floor(i/data.series.length)];
          else
            return ""});

    chart.append("g")
          .attr("class", "y axis")
          .attr("transform", "translate(" + spaceForLabels + ", " + -gapBetweenGroups/2 + ")")
          .call(yAxis);

    // Draw legend
    var legendRectSize = 18,
        legendSpacing  = 4;

    var legend = chart.selectAll('.legend')
        .data(data.series)
        .enter()
        .append('g')
        .attr('transform', function (d, i) {
            var height = legendRectSize + legendSpacing;
            var offset = -gapBetweenGroups/2;
            var horz = spaceForLabels + chartWidth + 40 - legendRectSize;
            var vert = i * height - offset;
            return 'translate(' + horz + ',' + vert + ')';
        });

    legend.append('rect')
        .attr('width', legendRectSize)
        .attr('height', legendRectSize)
        .style('fill', function (d, i) { return color(i); })
        .style('stroke', function (d, i) { return color(i); });

    legend.append('text')
        .attr('class', 'legend')
        .attr('x', legendRectSize + legendSpacing)
        .attr('y', legendRectSize - legendSpacing)
        .text(function (d) { return d.label; });

        });
}
