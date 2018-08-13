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
    
    <v-card id="crawlingprogress">
       <v-progress-linear height="10" v-model="crawlingprogress"></v-progress-linear>
      <strong>{{stat.crawledfiles}}</strong> of <strong>{{stat.numOfFiles}}</strong> files Crawled
     
    </v-card>
    <v-card id="indexingprogress">
       <v-progress-linear height="10" v-model="indexingprogress"></v-progress-linear>
      <strong>{{stat.indexedfiles}}</strong> of <strong>{{stat.numOfFiles}}</strong> files Indexed
     
    </v-card>
  
    <v-toolbar height="50" color="primary" dark>
      <v-toolbar-title>Statistics</v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>
    <hr>
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
        this.timerClearVar = setInterval(function () {
          if(this.currentState!="IDLE") this.loadSizeData();
          if(this.currentState=="MAP" || this.currentState=="REDUCE")this.loadInstanceCount()
          if(this.currentState=="CRAWL") this.loadCrawledFiles();
          if(this.currentState=="INDEX" || this.currentState=="MAP")this.loadIndexedFiles();
        }.bind(this), 1000);
    },
    beforeDestroy(){
        clearInterval(this.timerClearVar);
    },
    data() {
      return {
          timerClearVar:'',
          stat:{
            size:0,
            numOfFiles:0,
            runningRatInstances:0,
            finishedRatInstances:0,
            crawledfiles:0,
            indexedfiles:0,
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

      },
      loadInstanceCount(){
        axios.get(this.origin+"/proteus/service/status/oodt/raw")
        .then(response=> {
            var temp = response.data.report.jobHealth;
            for (var i = 0; i < temp.length; i++) {
                if (temp[i].state == "PGE EXEC") {
                    this.stat.runningRatInstances = temp[i].numJobs;
                } else if (temp[i].state == "FINISHED") {
                    this.stat.finishedRatInstances = temp[i].numJobs;
                }
            }
        });
      },
      loadCrawledFiles(){
        axios.get(this.origin+"/proteus/filemanager/progress")
        .then(response=> {
            this.stat.crawledfiles = response.data.crawledFiles;
        });
      },
      loadIndexedFiles(){
        axios.get(this.origin+"/solr/drat/select?q=producttype:GenericFile&fl=numFound&wt=json&indent=true")
        .then(response=>{
          this.stat.indexedfiles = response.data.response.numFound;
        });
      }

    },
    computed: {
      currentRepo (){
          return store.state.currentRepo;
      },
      origin(){
        return store.state.origin;
      },
      currentState(){
        return store.state.currentActionStep;
      },
      crawlingprogress(){
        return this.stat.crawledfiles/this.stat.numOfFiles *100;
      },
      indexingprogress(){
        return this.stat.indexedfiles/this.stat.numOfFiles * 100;
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
  #indexingprogress{
    margin-bottom: 5%;
  }
</style>
