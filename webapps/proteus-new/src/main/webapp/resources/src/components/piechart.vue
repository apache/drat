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

  <section class="piechart">
    <v-card id="piecard">
    <v-toolbar height="50" color="primary" dark>
      <v-toolbar-title>Mime Type Breakdown</v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>
    <svg id="piesvg" width="400" height="300"></svg>
    <svg id="pielegend"/>
    </v-card>
  </section>

</template>

<script lang="js">
import * as d3 from 'd3';
import axios from 'axios';
import store from './../store/store';
  export default  {
    name: 'piechart',
    store,
    props: [],
    mounted() {
        this.timerClearVar = setInterval(function () {
          if(this.currentState=="INDEX")this.loadData();
        }.bind(this), 1000);
    },
    beforeDestroy(){
      clearInterval(this.timerClearVar);
    },
    data() {
      return {
          data:[]
      }
    },
    methods: {
      translateLegend(d,i){
          var x = 0;
          var y = 0;
          var legend = d3.select("#piesvg");
          for(var j=0;j<i;j++){
            x += (this.data[j].type.length) * 5 + 50;
            if(x>250){
              x = 0;
              y+=25;
            }
          }
          return "translate("+x+"," + y + ")";
      },
      init(){
        
        var svg = d3.select("#piesvg");
          svg.selectAll("*").remove();
        var width = +svg.attr("width"),
            height = +svg.attr("height"),
            radius = Math.min(width, height) / 2,
            g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

        var color = d3.scaleOrdinal(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

        var pie = d3.pie()
            .sort(null)
            .value(function(d) { return d.weight; });

        var path = d3.arc()
            .outerRadius(radius - 10)
            .innerRadius(0);

        
        var arc = g.selectAll(".arc")
            .data(pie(this.data))
            .enter().append("g")
              .attr("class", "arc");

          arc.append("path")
              .attr("d", path)
              .attr("style", function(d) { return "fill:"+color(d.data.type) });

        var legend = d3.select("#pielegend")
                  .attr("class", "legend")
                  .selectAll("g")
                  .data(pie(this.data))//setting the data as we know there are only two set of data[programmar/tester] as per the nest function you have written
                  .enter().append("g")
                  .attr("transform", this.translateLegend);

              legend.append("rect")
                  .attr("width", 18)
                  .attr("height", 18)
                  .style("fill", function(d) {
                      return color(d.data.type);
                    });

              legend.append("text")
                  .attr("x", 24)
                  .attr("y", 9)
                  .attr("dy", ".35em")
                  .text(function(d) { return d.data.type; });
        
      },
      loadData(){
        axios.get(this.origin+"/proteus/service/repo/breakdown/mime?limit=5")
            .then(response=>{
              this.$log.info(response.data);
              this.data=response.data;
              this.init();
            })
            .catch(error=>{
              
              throw error;
            })
      }
    },
    computed: {
      origin(){
        return store.state.origin;
      },
      currentState(){
        return store.state.currentActionStep;
      }
    }
}
</script>

<style>
  .piechart {

  }
    .arc text {
    font: 10px sans-serif;
    text-anchor: middle;
  }

.arc path {
  stroke: transparent
  
}

#piecard {
    margin-top: 5%;
    margin-bottom :5%;
    margin-left:5%
  }
</style>
