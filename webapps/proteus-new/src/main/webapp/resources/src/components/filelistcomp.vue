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

  <section class="filelistcomp" >
    <v-card id="filelistcard">
    <v-toolbar height="50" color="primary" dark>
      <v-toolbar-title>Files List</v-toolbar-title>
       <v-spacer></v-spacer>
    </v-toolbar>
    <strong v-if="fileslist.length==0">Empty List of files</strong>
    <v-list >
    <template v-for="(file) in fileslist">
      <v-list-tile id="tile"
        :key="file.link"
        avatar
        ripple
      >
        <v-list-tile-content>
          <v-list-tile-title>{{file.title}}</v-list-tile-title>
        </v-list-tile-content> 
      </v-list-tile>
      <v-divider :key="file.link"/>
    </template>
    </v-list>
    </v-card>
  </section>
  
</template>

<script lang="js">
import axios from 'axios';
import store from './../store/store';
  export default  {
    name: 'filelistcomp',
    store,
    props: [],
    mounted() {
        this.timerClearVar = setInterval(function () {
          if(this.currentState=="CRAWL")this.loadData();
        }.bind(this), 1000);
      
    },
    beforeDestroy(){
      clearInterval(this.timerClearVar);
    },
    data() {
      return {
        data:[],
        fileslist:[],
        timerClearVar:'',
      }
    },
    methods: {
        loadData(){
            if(this.currentRepo.indexOf("http")>=0){
              axios.get(this.origin+"/proteus/drat/currentrepo")
              .then(response=>{
                store.commit("setCurrentRepo",response.data);
              });
            }
            if(this.currentRepo!=''){
                axios.get(this.origin+"/proteus/service/products?topn=10")
                .then(response=>{
                  
                  response.data.forEach((v, i) => {
                       const val = (typeof v === 'object') ? Object.assign({}, v) : v;
                      this.fileslist.splice(i,1,val)
                  });
                        
                })
                .catch(error=>{
                  this.$log.info(error.toString()+"Progress");
                })
        
            }
            
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
      }

    }
}
</script>

<style >
  #filelistcard{
    margin-top:10%
  }
  #tile{
    height: 35px;
    
  }
</style>
