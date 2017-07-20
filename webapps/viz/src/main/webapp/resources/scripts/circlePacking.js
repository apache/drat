function refreshCircle(){

  var margin = 20,
    diameter = 960;

  var color = d3.scale.linear()
      .domain([-1, 5])
      .range(["hsl(152,80%,80%)", "hsl(228,30%,40%)"])
      .interpolate(d3.interpolateHcl);

  var pack = d3.layout.pack()
      .padding(2)
      .size([diameter - margin, diameter - margin])
      .value(function(d) { return d.size; })

  var svg = d3.select("#circlePacking .panel-body").append("svg")
      .attr("width", diameter)
      .attr("height", diameter)
    .append("g")
      .attr("transform", "translate(" + diameter / 2 + "," + diameter / 2 + ")");

  d3.json(SOLR_URL + '/select?q=type:software&rows=220&fl=mime_*,id&sort=id+asc&wt=json', function(error, root) {
    if (error) throw error;

    var docs = root.response.docs;
    var resultingData = [];
    mime = {};

    for(var i = 0; i < docs.length; i++) {
      doc = docs[i];
      var parent = {};
      var repo = doc.id.split("/");

      children = [];
      for(var key in doc) {
        if(key != "id") {
          var jsonObj = {};
          jsonObj["name"] = key.split("mime_")[1];
          jsonObj["size"] = doc[key];
          children.push(jsonObj);
        }
      }
      var reponame = repo[repo.length - 1];
      if (reponame.indexOf("part") == 0)
        reponame = repo[repo.length - 2];
      
      if(i != 0 && resultingData[resultingData.length - 1]["name"] == reponame) {
        old_children = resultingData[resultingData.length - 1]["children"];
        for(var j = 0; j < children.length; j++) {
          jsonObj = children[0];
          for(var k = 0; k < old_children.length; k++){
            if(old_children[k]["name"] == jsonObj["name"]) {
              old_children[k]["size"] += jsonObj["size"];
              break;
            }
          }
          resultingData[resultingData.length - 1]["children"] = old_children;
        }
      }
      else {
        parent["name"] = reponame;
        parent["children"] = children;
        resultingData.push(parent);
      }
    }

    mime["name"] = "Apache SVN";
    mime["children"] = resultingData;
    root = mime;

    var focus = root,
        nodes = pack.nodes(root),
        view;

    var circle = svg.selectAll("circle")
        .data(nodes)
      .enter().append("circle")
        .attr("class", function(d) { return d.parent ? d.children ? "node" : "node node--leaf" : "node node--root"; })
        .style("fill", function(d) { return d.children ? color(d.depth) : null; })
        .on("click", function(d) { if (focus !== d) zoom(d), d3.event.stopPropagation(); });

    var text = svg.selectAll("text")
        .data(nodes)
      .enter().append("text")
        .attr("class", "label")
        .style("fill-opacity", function(d) { return d.parent === root ? 1 : 0; })
        .style("display", function(d) { return d.parent === root ? "inline" : "none"; })
        .text(function(d) { return d.name; });

    var node = svg.selectAll("circle,text");

    d3.select("#circlePacking .panel-body")
        .style("background", color(-1))
        .on("click", function() { zoom(root); });

    zoomTo([root.x, root.y, root.r * 2 + margin]);

    function zoom(d) {
      var focus0 = focus; focus = d;

      var transition = d3.transition()
          .duration(d3.event.altKey ? 7500 : 750)
          .tween("zoom", function(d) {
            var i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2 + margin]);
            return function(t) { zoomTo(i(t)); };
          });

      transition.selectAll("text")
        .filter(function(d) { return d.parent === focus || this.style.display === "inline"; })
          .style("fill-opacity", function(d) { return d.parent === focus ? 1 : 0; })
          .each("start", function(d) { if (d.parent === focus) this.style.display = "inline"; })
          .each("end", function(d) { if (d.parent !== focus) this.style.display = "none"; });
    }

    function zoomTo(v) {
      var k = diameter / v[2]; view = v;
      node.attr("transform", function(d) { return "translate(" + (d.x - v[0]) * k + "," + (d.y - v[1]) * k + ")"; });
      circle.attr("r", function(d) { return d.r * k; });
    }
  });

  d3.select(self.frameElement).style("height", diameter + "px");

}
