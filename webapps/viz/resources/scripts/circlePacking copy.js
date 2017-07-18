function refreshCircle(query){

  var diameter = 960,
    format = d3.format(",d");

  var pack = d3.layout.pack()
      .size([diameter - 4, diameter - 4])
      .value(function(d) { return d.size; });

  var svg = d3.select("#circlePacking .panel-body").append("svg")
      .attr("width", diameter)
      .attr("height", diameter)
    .append("g")
      .attr("transform", "translate(2,2)");

  d3.json(SOLR_URL + '/query?q=*:*&rows=191&fl=mime_*,id&wt=json', function(error, root) {
    if (error) throw error;

    var docs = root.response.docs;
    var resultingData = [];
    mime = {};

    for(var i = 0; i < docs.length; i++) {
      doc = docs[i];
      var parent = {};
      parent["name"] = doc.id;
      children = [];
      for(var key in doc) {
        if(key != "id") {
          var jsonObj = {};
          jsonObj["name"] = key.split("mime_")[1];
          jsonObj["size"] = doc[key];
          children.push(jsonObj);
        }
      }
      parent["children"] = children;
      resultingData.push(parent);
    }

    mime["name"] = "Apache SVN";
    mime["children"] = resultingData;

    var node = svg.datum(mime).selectAll(".node")
        .data(pack.nodes)
      .enter().append("g")
        .attr("class", function(d) { return d.children ? "node" : "leaf node"; })
        .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

    node.append("title")
        .text(function(d) { return d.name + (d.children ? "" : ": " + format(d.size)); });

    node.append("circle")
        .attr("r", function(d) { return d.r; });

    node.filter(function(d) { return !d.children; }).append("text")
        .attr("dy", ".3em")
        .style("text-anchor", "middle")
        .text(function(d) { return d.name.substring(0, d.r / 3); });
  });

  d3.select(self.frameElement).style("height", diameter + "px");

}