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
            <p style="text-align:left;">In-Memory Size  : <span style="float:right;">    <strong> {{stat.size}}</strong> <br></span></p>
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
          if (!(isNaN(parseFloat(response.data.memorySize)) || !isFinite(response.data.memorySize))){
          var units = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'],
          number = Math.floor(Math.log(response.data.memorySize) / Math.log(1024)) | 0;
            this.stat.size = (response.data.memorySize / Math.pow(1024, Math.floor(number))).toFixed(1) +  ' ' + units[number];
            this.stat.numOfFiles = response.data.numberOfFiles;
          }
        })
        .catch(error=>{
          throw error;
        });
        axios.get(this.origin+"/proteus/service/status/oodt/raw")
        .then(response=> {
            var temp = response.data.report.jobHealth;
            this.stat.runningRatInstances=-1;
            for (var i = 0; i < temp.length; i++) {
                if (temp[i].state == "PGE EXEC") {
                    this.stat.runningRatInstances = temp[i].numJobs;
                } else if (temp[i].state == "FINISHED") {
                    this.stat.finishedRatInstances = temp[i].numJobs;
                }
            }
        });
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