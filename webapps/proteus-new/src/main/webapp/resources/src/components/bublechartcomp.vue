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

  <section class="bublechartcomp">
    <v-card id="bublecard">
      <v-toolbar dark color="primary">
        <v-toolbar-title class="white--text">All MIME Types</v-toolbar-title>
      </v-toolbar>

      <svg id="bublesvg" width="400" height="300"></svg>
    </v-card>

  </section>

</template>

<script lang="js">
  import * as d3 from 'd3';
  import axios from 'axios';
  import tinycolor from 'tinycolor2';
  import store from './../store/store';

  export default  {
    name: 'bublechartcomp',
    store,
    props: [],
    mounted() {
      this.init();
      this.timerClearVar = setInterval(function(){
        this.init();
      }.bind(this),30000);
    },
    data() {
      return {
        data:[],
        timerClearVar:'',
      }
    },
    beforeDestroy(){
      clearInterval(this.timerClearVar)
    },
    methods: {
      init(){

        var diameter = 860,
            format = d3.format(",d"),
            color = d3.scaleOrdinal(d3.schemeBrBG[11]);



        var bubble = d3.pack()
            .size([diameter, diameter])
            .padding(1.5);


        var svg = d3.select("#bublesvg")
            .attr("width", diameter)
            .attr("height", diameter)
            .attr("class", "bubble");


        axios.get(this.origin + '/solr/statistics/select?q=type:software&fl=mime_*&wt=json')
        .then(response2=>{
          if(response2.data.response.numFound!=null){
              axios.get(this.origin + '/solr/statistics/select?q=type:software&rows='+response2.data.response.numFound+'&fl=mime_*&wt=json')
            .then(response=>{


              var docs = response.data.response.docs;
              var resultingData = [];
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



              var test = {}
              test["name"] = "flare"
              test["children"] = resultingData

              var range = d3.schemeBrBG[11];
              range = range.concat(d3.schemePRGn[11]);

              color = d3.scaleOrdinal(range);

              var root = d3.hierarchy(classes(test))
                .sum(function(d){
                  return d.value;
                  })


              bubble(root);

              if(resultingData.length >0){
                  var node = svg.selectAll(".node")
                      .data(root.children)

                      .enter().append("g")
                      .attr("class", "node")
                      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

                  node.append("title")
                      .text(function(d) {
                          return d.data.className + ": " + format(d.value);
                      });

                  node.append("circle")
                      .attr("r", function(d) { return d.r; })
                      .attr("style",function(d){

                          return "fill:"+color(d.data.className);});

                  node.append("text")
                      .attr("dy", ".3em")
                      .attr('style', d => {
                      return `fill: ${
                          tinycolor(color(d.data.className)).isLight()
                              ? '#000000'
                              : '#ffffff'
                          }`;
              })
              .style("text-anchor", "middle")
                      .text(function(d) { return d.data.className.substring(0, d.r / 3); });
              }


            });
          }

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
      },


    },




    computed: {
      origin(){
        return store.state.origin;
      }
    }
}
</script>

<style scoped>
  .bublechartcomp {
    margin-top: 5%;
    margin-bottom: 5%;
  }
</style>
