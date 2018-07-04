<template lang="html">

  <section class="statisticscomp">
    <v-card id="statisticscard">
    <v-toolbar height="50" color="primary" dark>
      <v-toolbar-title>Statistics</v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>
    <v-expansion-panel
        v-model="panel"
        expand
      >
        <v-expansion-panel-content id="header"
        >
          <div  slot="header"><b>Repository</b></div>
          <v-card>
            <v-card-text>
            <p style="text-align:left;">In-Memory Size  : <span style="float:right;">    <strong> {{stat.size}} MB</strong> <br></span></p>
            <p style="text-align:left;">Number of files :<span style="float:right;">  <strong>{{stat.numOfFiles}} </strong><br></span></p>
            </v-card-text>
          </v-card>

        </v-expansion-panel-content>
        <v-expansion-panel-content id="header"
        >
          <div slot="header"><b>Drat</b></div>
          <v-card>
            <v-card-text>
                <strong>{{stat.runningRatInstances}}</strong> Rat Instances <strong>Running</strong><br>
                <strong>{{stat.finishedRatInstances}}</strong> Rat Instances <strong> Finished</strong>
            </v-card-text>
          </v-card>
          
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-card>
  </section>

</template>

<script lang="js">
 import store from './../store/store'
  import axios from 'axios'
  export default  {
    name: 'statisticscomp',
    store,
    props: [],
    mounted() {
      this.loadSizeData();
        setInterval(function () {
          this.loadSizeData();
        }.bind(this), 30000);
    },
    data() {
      return {
          stat:{
            size:0,
            numOfFiles:0,
            runningRatInstances:0,
            finishedRatInstances:0,
          },
          panel:[false,true,true]

      }
    },
    methods: {
      loadSizeData(){
        axios.get(this.origin+"/proteus/service/repo/size?dir="+this.currentRepo)
        .then(response=>{
          this.stat.size = (response.data.memorySize / (1024*1024)).toFixed(2);
          this.stat.numOfFiles = response.data.numberOfFiles;
        })
        .catch(error=>{
          throw error;
        })
      }
    },
    computed: {
      currentRepo (){
          return store.state.currentRepo;
      },
      origin(){
        return store.state.origin;
      }
    }
}
</script>

<style scoped>
  #statisticscard{
    margin-top:10%;
    margin-left:10%;
  }
  #header{
    background-color:lightgray
  }
</style>
