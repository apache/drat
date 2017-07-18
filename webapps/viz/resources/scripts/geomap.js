    var width  = 800;
    var height = 400;
    var drag = false;
    // using natural earth projection
    // https://github.com/mbostock/d3/wiki/Geo-Projections
    // http://bl.ocks.org/mbostock/4479477
    var projection = d3.geo.naturalEarth()
        .translate([width / 2, height / 2])
        .precision(0.1)
        .scale(140);
    // used to scale mouse domain to rotation range
    var scale_angle = d3.scale.linear()
        .domain([-width, width])
        .range([-180, 180]);
    // tracks previous values
    var prev_x = 0;
    var prev_a = 0;
    // geographic path generator (use instead of scales
    // to map longitude, latitude points to pixel points)
    var geo_path = d3.geo.path().projection(projection);
    function draw_map() {
        // generate svg image
        var svg = d3.select("#map")
            .append("svg")
            .attr("width", width)
            .attr("height", height);
        var grid = d3.geo.graticule();
        // create map background area
        // https://github.com/mbostock/d3/wiki/Geo-Paths
        svg.append("path")
            .datum({type: "Sphere"})
            .attr("d", geo_path)
            .style("fill", "#93C2FF");
        // create map grid
        // https://github.com/mbostock/d3/wiki/Geo-Paths#wiki-graticule
        // graticule: grid of intersecting latitude and longitude lines
        svg.append("path")
            .datum(d3.geo.graticule())
            .attr("d", geo_path)
            .style("fill", "none")
            .style("stroke", "#ffffff")
            .style("stroke-width", "0.5px");
        // add ability to update projection
        svg.on("mousedown", function() {
            drag = true;
            prev_x = d3.mouse(this)[0];
        });
        svg.on("mouseup", function() {
            drag = false;
        });
        svg.on("mousemove", function() {
            if (drag) {
                curr_x = d3.mouse(this)[0];
                curr_a = prev_a + scale_angle(curr_x - prev_x);
                prev_x = curr_x;
                prev_a = curr_a;
                projection.rotate([curr_a, 0]);
                update();
            }
        });
    }
    function draw_regions(data) {
        // get pointer to svg image
        var svg = d3.select("#map").select("svg"); //d3.select("svg")
        // draw land masses
        svg.append("path")
            .datum(topojson.object(data, data.objects.land))
            .attr("d", geo_path)
            .style("fill", "#eeeeee")
            .style("stroke", "none");
        // draw region mesh, filter prevents drawing outer regions
        // https://github.com/mbostock/topojson/wiki/Client-API-Reference#wiki-topojson_mesh
        svg.append("path")
            .datum(topojson.mesh(data, data.objects.countries, function(a, b) { return a !== b; }))
            .attr("d", geo_path)
            .style("fill", "none")
            .style("stroke", "#999999")
            .style("stroke-width", "0.5px");
        // place map outline on top of map grid and regions
        svg.append("path")
            .datum({type: "Sphere"})
            .attr("d", geo_path)
            .style("fill", "none")
            .style("stroke", "#444444")
            .style("stroke-width", "1.5px");
    }
    function getColor(val, max){
        factor = val / max;
        if (factor < 0.1) {
            return "rgb(165,0,38)"
        } else if (factor < 0.2) {
            return "rgb(215,48,39)"
        } else if (factor < 0.3) {
            return "rgb(244,109,67)"
        } else if (factor < 0.4) {
            return "rgb(253,174,97)"
        } else if (factor < 0.5) {
            return "rgb(254,224,139)"
        } else if (factor < 0.6) {
            return "rgb(255,255,191)"
        } else if (factor < 0.7) {
            return "rgb(217,225,139)"
        } else if (factor < 0.8) {
            return "rgb(166,225,106)"
        } else if (factor < 0.9) {
            return "rgb(102,225,99)"
        } else {
            return "rgb(26,225,80)";
            //rgb(0,104,55)
        }
    }
    // must be named this way to match earthquake feed
    function show_geo_points(data) {
        // get pointer to svg image
        var svg = d3.select("#map").select("svg");
        // handling updates are difficult
        // http://bost.ocks.org/mike/join/
        // http://bl.ocks.org/mbostock/3808234
        //Assumption : max value is in first item
        max = data[0].count;
        //console.log(JSON.stringify(data));
        // get any existing circles
        var quakes = svg.selectAll("circle")
                .data(data);
        var radius = d3.scale.pow()
                .range([2, 12])
                .domain([0, 10]);
        // add new circles for new earthquakes
        quakes.enter()
                .append("circle")
                .attr("cx", function(d) {
                    var longitude = d.lon;
                    var latitude = d.lat;
                    return projection([longitude, latitude])[0];
                })
                .attr("cy", function(d) {
                    var longitude = d.lon;
                    var latitude = d.lat;
                    return projection([longitude, latitude])[1];
                })
                .attr("r", function(d) {
                    return 0;
                })
                .style("fill", function(d){
                    return getColor(d.count, max);
                })
                .style("fill-opacity", 0)
                .style("stroke", 'rgb(255, 0, 0)')
                .style("stroke-width", "0.5px")
                .style("stroke-opacity", 1)
                .transition()
                .delay(function(d, i) {
                    return i / data.length * 100;
                })
                .duration(100)
                .attr("r", function(d) {
                    return radius(0.01 + Math.log(d.count)/2);
                    //return radius(d.count);
                })
                .style("fill-opacity", 0.25);
        // remove circles for old earthquakes no longer in data
        quakes.exit()
                .transition()
                .attr("r", 0)
                .style("fill-opacity", 0)
                .remove();
    }
    function update() {
        var svg = d3.select("#map").select("svg")
        svg.selectAll("path").attr("d", geo_path);
        svg.selectAll("circle")
            .attr("cx", function(d) {
                var longitude = d.lon;
                var latitude = d.lat;
                return projection([longitude, latitude])[0];
            })
            .attr("cy", function(d) {
                var longitude = d.lon;
                var latitude = d.lat;
                return projection([longitude, latitude])[1];
            });
    }
    function refreshGeomap(qry, topN, dtRange){
        console.log(">Search Q=" + qry + "topN:"+ topN + ", date:" + dtRange);
        if (!qry) {
            qry = "*:*"
        }
        if (topN<0){
            topN=1
        }else{
        topN++;
        }
       // var myString = "/q=<strong>"+ qry + "</strong>&fq=dates:<strong>"+ dtRange + "</strong>&facet=true&facet.mincount=1&facet.field=location_latlons&facet.field=cities&facet.limit=<strong>"+ topN + "</strong>&rows=0";
       // $("#queryString").html(myString);
        d3.json(SOLR_URL + "/query?q="+ qry + "&fq=dates:"+ dtRange + "&facet=true&facet.mincount=1&facet.field=location_latlons&facet.field=cities&facet.limit="+ topN + "&rows=0",
            function(error, json) {
                if (error) { return console.warn(error) }
                facets = getSolrFacet(json, 'location_latlons', geoPointTransform);
                places = getSolrFacet(json, 'cities');
                list = $('#locationnames');
                list.empty();
                if (places.length  == 0 ) {
                    console.log("No results found")
                    return
                }
                if (facets.length > 0 && places[0].term == 'Etc Hotel') {
                    places.splice(0, 1);
                    facets.splice(0, 1);
                }
                show_geo_points(facets);
                for(var i=0; i<places.length && i < 40; i++) {
                    list.append("<li>" + places[i].term + "(" + places[i].count + ")</li>")
                }
            })
    }
