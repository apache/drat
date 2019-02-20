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

  <section class="topmimepiecomp">
    <v-card id="topmimecard">
      <v-toolbar dark color="primary">
         <v-toolbar-title class="white--text">Top MIME Types</v-toolbar-title>
      </v-toolbar>
      <v-layout>
        <v-spacer/>
        <v-flex xs3>
          <v-btn @click="count--;if(count<0)count=0">-</v-btn>
        </v-flex>
        <v-flex xs3 >

          <v-text-field label="Count" :value="count"></v-text-field>
        </v-flex>
        <v-flex xs3>
          <v-btn @click="count++;if(count>50)count=25">+</v-btn>
        </v-flex>
        <v-spacer/>
      </v-layout>

      <svg id="pietopmimesvg" width="420" height="525"></svg>
    </v-card>
  </section>

</template>

<script lang="js">
  import * as d3 from 'd3';
  import axios from 'axios';
  import tinycolor from 'tinycolor2';
  import store from './../store/store';

  export default  {
    name: 'topmimepiecomp',
    store,
    props: [],
    mounted() {
      this.init(this.count);
    },
    watch:{
      count:function(val) {
        this.init(val);
      }
    },
    data() {
      return {
        count:10,
      }
    },
    methods: {
        init(rows){
          axios.get(this.origin + '/solr/statistics/select?q=type:software&fl=mime_*&wt=json')
          .then(response2=>{
            if(response2.data.response.numFound!=null){
                axios.get(this.origin + '/solr/statistics/select?q=type:software&rows='+response2.data.response.numFound+'&fl=mime_*&wt=json')
                .then(function(response) {

                console.log(response.data);
                  var docs = response.data.response.docs;
                  var resultingData = [];
                  var result = [];
                  var mime = {};

                  for(var i = 0; i < docs.length; i++) {
                    var doc = docs[i];
                    for(var x in doc) {
                      var key = x.split("mime_")[1];
                      var value = doc[x];
                      if(typeof mime[key] === 'undefined') {
                        mime[key] = value;
                      }
                      else {
                        mime[key] += value;
                      }
                    }
                  }

                  for(x in mime) {
                    var jsonObject = {};
                    jsonObject["key"] = x;
                    jsonObject["y"] = mime[x];
                    resultingData.push(jsonObject);
                  }

                  resultingData.sort(function(a, b) {
                      return b.y - a.y;
                  });
                  if(rows > resultingData.length)rows=resultingData.length;
                  for( i = 1; i <= rows; i++) {
                    result[i-1] = resultingData[i-1];
                  }

                  console.log(result);

                var svg = d3.select("#pietopmimesvg");
                  svg.selectAll("*").remove();
                  var width = +svg.attr("width"),
                  height = +svg.attr("height"),
                  radius = Math.min(width, height) / 4,
                  pieposx = (width / 2)+90,
                  pieposy = (height / 2)-140,
                  g = svg.append("g").attr("transform", "translate(" +pieposx  + "," +pieposy + ")");

                  var color = d3.scaleOrdinal(d3.schemePiYG[11]);

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

                  var legend = d3.select("#pietopmimesvg").append("svg")
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

<style scoped >
  #topmimecard {
    padding:5%;
  }
</style>
