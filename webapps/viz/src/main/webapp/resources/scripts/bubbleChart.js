function refreshBubble(){

  var diameter = 860,
      format = d3.format(",d"),
      color = d3.scale.category20c();

  var bubble = d3.layout.pack()
      .sort(null)
      .size([diameter, diameter])
      .padding(1.5);

  var svg = d3.select("#bubbleChart .panel-body").append("svg")
      .attr("width", diameter)
      .attr("height", diameter)
      .attr("class", "bubble");


  d3.json(SOLR_URL + '/select?q=type:software&rows=220&fl=mime_*&wt=json', function(error, root) {
    if (error) throw error;

    var docs = root.response.docs;
    var resultingData = [];
    var result = [];
    mime = {};

    for(var i = 0; i < docs.length; i++) {
      doc = docs[i];
      for(var x in doc) {
        key = x.split("mime_")[1];
        value = doc[x];
        if(typeof mime[key] === 'undefined') {
          mime[key] = value;
        }
        else {
          mime[key] += value;
        }
      }
    }

    for(var x in mime) {
      var obj = {};
      var jsonObject = {};
      var child = [];
      obj["name"] = x;
      jsonObject["name"] = x;
      jsonObject["size"] = mime[x];
      child.push(jsonObject);
      obj["children"] = child;
      resultingData.push(obj);
    }

    test = {}
    test["name"] = "flare"
    test["children"] = resultingData
    /*
    test = JSON.stringify(resultingData).substring(1);
    test = test.substring(0, test.length - 1)
    root = "{" + test + "}"
    */
    console.log(test);

    var node = svg.selectAll(".node")
        .data(bubble.nodes(classes(test))
        .filter(function(d) { return !d.children; }))
      .enter().append("g")
        .attr("class", "node")
        .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

    node.append("title")
        .text(function(d) { return d.className + ": " + format(d.value); });

    node.append("circle")
        .attr("r", function(d) { return d.r; })
        .style("fill", function(d) { return color(d.packageName); });

    node.append("text")
        .attr("dy", ".3em")
        .style("text-anchor", "middle")
        .text(function(d) { return d.className.substring(0, d.r / 3); });
  });

  // Returns a flattened hierarchy containing all leaf nodes under the root.
  function classes(root) {
    var classes = [];

    function recurse(name, node) {
      if (node.children) node.children.forEach(function(child) { recurse(node.name, child); });
      else classes.push({packageName: name, className: node.name, value: node.size});
    }

    recurse(null, root);
    return {children: classes};
  }

  d3.select(self.frameElement).style("height", diameter + "px");

}
