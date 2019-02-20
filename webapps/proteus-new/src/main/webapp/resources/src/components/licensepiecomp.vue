<!--
Licensed to the Apache Software Foundation (ASF) under one or more contributor
license agreements.  See the NOTICE.txt file distributed with this work for
additional information regarding copyright ownership.  The ASF licenses this
file to you under the Apache License, Version 2.0 (the "License"); you may not
use this file except in compliance with the License.  You may obtain a copy of
the License at
     http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.  See the
License for the specific language governing permissions and limitations under
the License.
-->

<template lang="html">

  <section class="licensepiecomp">
    <v-card id="licensecard">
      <v-toolbar dark color="primary">
         <v-toolbar-title class="white--text">License Types</v-toolbar-title>
      </v-toolbar>

      <svg id="pielicensesvg" width="420" height="600"></svg>
    </v-card>
  </section>

</template>

<script lang="js">
  import * as d3 from 'd3';
  import axios from 'axios';
  import tinycolor from 'tinycolor2';
  import store from './../store/store';

  export default  {
    name: 'licensepiecomp',
    store,
    props: [],
    mounted() {
      this.init();
    },
    data() {
      return {

      }
    },
    methods: {
      init(){
        axios.get(this.origin + '/solr/statistics/select?q=type:software&fl=license_*&wt=json')
        .then(response2=>{
          if(response2.data.response.numFound!=null){
              axios.get(this.origin + '/solr/statistics/select?q=type:software&rows='+response2.data.response.numFound+'&fl=license_*&wt=json')
              .then(function(response) {

                console.log(response.data);
                var docs = response.data.response.docs;
                var resultingData = [];
                var result = [];
                var license = {};

                for(var i = 0; i < docs.length; i++) {
                  var doc = docs[i];
                  for(var x in doc) {
                    var key = x.split("license_")[1];
                    var value = doc[x];
                    if(typeof license[key] === 'undefined') {
                      license[key] = value;
                    }
                    else {
                      license[key] += value;
                    }
                  }
                }

                for(x in license) {
                  var jsonObject = {};
                  jsonObject["key"] = x;
                  jsonObject["y"] = license[x];
                  resultingData.push(jsonObject);
                }

                resultingData.sort(function(a, b) {
                    return b.y - a.y;
                });

                for( i = 0; i < resultingData.length; i++) {
                  if(resultingData[i]["y"] == 0)
                    break;
                  result[i] = resultingData[i];
                }

                var svg = d3.select("#pielicensesvg"),
                  width = +svg.attr("width"),
                  height = +svg.attr("height"),
                  radius = Math.min(width, height) / 2,
                  g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

                var color = d3.scaleOrdinal(d3.schemeSet3);

                var pie = d3.pie()
                    .sort(null)
                    .value(function(d) { return d.y; });

                var path = d3.arc()
                    .outerRadius(radius - 10)
                    .innerRadius(0);

                var label = d3.arc()
                    .outerRadius(radius - 40)
                    .innerRadius(radius - 40);
                var arc = g.selectAll(".arc")
                    .data(pie(result))
                    .enter().append("g")
                      .attr("class", "arc");

                  arc.append("path")
                      .attr("d", path)
                      .attr("style", function(d) { return "fill:"+color(d.data.key) });

                  arc.append("text")
                      .attr("transform", function(d) { return "translate(" + label.centroid(d) + ")"; })
                      .attr("dy", "0.35em")
                      .attr('style', d => {
                        return `fill: ${
                          tinycolor(color(d.data.key)).isLight()
                            ? '#000000'
                            : '#ffffff'
                        }`;
                      })
                      .text(function(d) { return d.data.key; });

                var legend = d3.select("#pielicensesvg").append("svg")
                          .attr("class", "legend")
                          .selectAll("g")
                          .data(pie(result))//setting the data as we know there are only two set of data[programmar/tester] as per the nest function you have written
                          .enter().append("g")
                          .attr("transform", function(d, i) { return "translate(0," + ((i + 1)* 20) + ")"; });

                      legend.append("rect")
                          .attr("width", 18)
                          .attr("height", 18)
                          .style("fill", function(d, i) {
                              return color(d.data.key);
                            });

                      legend.append("text")
                          .attr("x", 24)
                          .attr("y", 9)
                          .attr("dy", ".35em")
                          .text(function(d) { return d.data.key; });

                  console.log(result);
                });
          }

        });

      }
    },
    computed: {
      origin(){
        return store.state.origin;
      }
    }
}
</script>

<style>

    .arc text {
    font: 10px sans-serif;
    text-anchor: middle;
  }

.arc path {
  stroke: transparent

}

#licensecard {
    /* margin-top: 5%; */
    margin-bottom :5%;
    padding: 5%;
  }
</style>
