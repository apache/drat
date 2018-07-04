<template lang="html">

  <section class="piechart">
    <v-card id="piecard">
    <h1>Mime Type Breakdown</h1>
    <svg id="piesvg" width="400" height="300"></svg>
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
        this.loadData();
        setInterval(function () {
          this.loadData();
        }.bind(this), 10000);
    },watch:{
     
    },
    data() {
      return {
          data:[]
      }
    },
    methods: {
      init(){
        var svg = d3.select("#piesvg"),
            width = +svg.attr("width"),
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

        var label = d3.arc()
            .outerRadius(radius - 40)
            .innerRadius(radius - 40);

        // d3.csv("data.csv", function(d) {
        //   d.population = +d.population;
        //   return d;
        // }, function(error, data) {
        //   if (error) throw error;
        //var data = [{age:"<5",population:2704659},{age:"5-13",population:4499890},{age:"14-16",population:100000}]
          var arc = g.selectAll(".arc")
            .data(pie(this.data))
            .enter().append("g")
              .attr("class", "arc");

          arc.append("path")
              .attr("d", path)
              .attr("style", function(d) { return "fill:"+color(d.data.type) });

          arc.append("text")
              .attr("transform", function(d) { return "translate(" + label.centroid(d) + ")"; })
              .attr("dy", "0.35em")
              .text(function(d) { return d.data.type; });
        // });
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
    padding-top:5%;
    margin-left:5%
  }
</style>
