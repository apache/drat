<template lang="html">

  <section class="barchartcomp">
    <v-card id = "barchart">
    <h1>Liecense Breakdown</h1>
     {{emptynote}}<br>
    <svg id="barsvg" width="400" height="270">
     
    </svg>
    
    </v-card>
  </section>

</template>

<script lang="js">
import * as d3 from 'd3';
import axios from 'axios';
import store from './../store/store'
// const props={
//   width:500,
//   hieght:270
// };
// const graphData = [10,20,40,30];

  
  export default  {
    name: 'barchartcomp',
    props: [],
    store,
    mounted() {
        this.loadData();
        setInterval(function () {
          this.loadData();
        }.bind(this), 1000);
        
    },
    data() {
      return {
        licenseTypes : [], 
        emptynote : '',
        // licenseTypes : [{"type":"Binaries","numberOfObjects":139,"weight":0.40406976744186046},{"type":"Apache Licensed","numberOfObjects":96,"weight":0.27906976744186046},{"type":"Generated Documents","numberOfObjects":0,"weight":0.0},{"type":"Archives","numberOfObjects":0,"weight":0.0},{"type":"Notes","numberOfObjects":1,"weight":0.0029069767441860465},{"type":"Standards","numberOfObjects":108,"weight":0.313953488372093}]
        // dts : [{letter:'A',frequency:0.9167},{letter:'B',frequency:0.4503},{letter:'C',frequency:0.4503}],
      }
    },
    watch:{
     
    },
    methods: {
        loadData(){
          // var config = {
          //   headers: {'Access-Control-Allow-Origin': '*'}
          // };
          axios.get(this.origin+"/proteus/service/repo/breakdown/license")
            .then(response=>{
              this.$log.info(response.data);
              this.licenseTypes=response.data;
              this.init();
            })
            .catch(error=>{
              this.emptynote = error.toString();
              throw error;
            })
          // this.init();
            
        },
        init(){
          
           this.$log.info("c0");
          var  svg = d3.select("#barsvg"),
              margin = {top: 20, right: 20, bottom: 50, left: 40},
              width = +svg.attr("width") - margin.left - margin.right,
              height = +svg.attr("height") - margin.top - margin.bottom;

              svg.selectAll("*").remove();

          var x = d3.scaleBand().rangeRound([0, width]).padding(0.1),
              y = d3.scaleLinear().rangeRound([height, 0]);

          var g = svg.append("g")
              .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

          
          
          var dataval = this.dts;
          if(dataval.length!=0){
            this.emptynote='';
            //x.domain(d3.extent(dataval,function(d) { return d.letter; }));
            x.domain(dataval.map(function(d) { return d.letter; }));
            y.domain([0, d3.max(dataval, function(d) { return d.frequency; })]);

            g.append("g")
                .attr("class", "axis axis--x")
                .attr("transform", "translate(0," + height + ")")
                
                .call(d3.axisBottom(x))
              .selectAll("text")
              .attr("transform", "rotate(15)")
                .style("text-anchor", "start");


            

            g.append("g")
                .attr("class", "axis axis--y")
                .call(d3.axisLeft(y).ticks(10, "%"))
              .append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", "0.71em")
                .attr("text-anchor", "end")
                
                .text("Frequency");
            

            g.selectAll(".bar") 
                .data(dataval)
              .enter()                 
                .append("rect")
                .attr("class", "bar")
                .attr("x", function(d) { return x(d.letter); })
                .attr("y", function(d) { return y(d.frequency); })
                .attr("width", x.bandwidth())
                .attr("height", function(d) { return height - y(d.frequency); });

          }else{
            this.emptynote = "Retrieving Data...";
          }
          
        },
        

        
    },
    computed: {
      dts:function (){
        var out = [];
        for(var item in this.licenseTypes){
          out.push({letter:this.licenseTypes[item].type,frequency:this.licenseTypes[item].weight});
        }
        return out;
      },
      origin(){
        return store.state.origin;
      }
    }
}
</script>

<style>
.bar {
  fill: steelblue;
}

.bar:hover {
  fill: brown;
}



 #barchart {
    margin-top: 5%;
    margin-bottom :5%;
    padding-top:5%;
    margin-left:5%
  }
</style>
