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

  <section class="progresscomp">
    <v-card id="progresscard">
    <h1>Progress</h1>
    <hr>

     <v-progress-circular
      id="progresscircle"
        :rotate="-90"
        :size="100"
        :width="15"
        :value="value"
        color="primary"
      >
        {{ value }}
      </v-progress-circular><br/>
      {{status}}
    </v-card>
  </section>

</template>

<script lang="js">
  import axios from 'axios';
  import store from './../store/store';
  export default  {
    name: 'progresscomp',
    props: [],
    mounted() {
        this.loaddata();
        this.timerClearVar = setInterval(function () {
          this.loaddata();
        }.bind(this), 5000);
    },
    beforeDestroy(){
      clearInterval(this.timerClearVar);
    },
    data() {
      return {
          value:0,
          status:"IDLE",
          crawled:false,
          indexed:false,
          maped:false,
          reduced:false,
          completed:false,
          timerClearVar:''
      }
    },
    methods: {
      loaddata(){
        axios.get(this.origin+"/proteus/service/status/drat")
        .then(response=>{
            if(response.data=="CRAWL"){
              this.status="Crawling...";
              this.crawled=true;
              store.commit("setCurrentActionStep","CRAWL");
              this.value=0;
            }else if(response.data=="INDEX"){
              this.status="Indexing...";
              this.indexed=true
              store.commit("setCurrentActionStep","INDEX");
              this.value=25;
            }else if(response.data=="MAP"){
              this.status="Mapping...";
              this.mapped=true;
              store.commit("setCurrentActionStep","MAP");
              this.value=50;
            }else if(response.data=="REDUCE" ){
              this.status="Reducing...";
              this.reduced = true;
              store.commit("setCurrentActionStep","REDUCE");
              this.value=75;
            }else if(response.data=="IDLE"){
              if(this.currentActionRequest=="GO" && this.reduced){
                this.completed=true;
              }else if(this.currentActionRequest=="INDEX" && this.indexed){
                this.completed = true;

              }else if(this.currentActionRequest=="CRAWL" && this.crawled){
                this.completed = true;
                
              }else if(this.currentActionRequest=="MAP" && this.mapped){
                this.completed = true;
                
              }else if(this.currentActionRequest=="REDUCE" && this.reduced){
                this.completed = true;
              }
              if(this.status!="Completed" && this.completed ){
                  this.status="Completed"
                  store.commit("setCurrentActionStep","DONE");
                  this.completed=true;
                  this.value=100;
                  let options = {
                    html: false, // set to true if your message contains HTML tags. eg: "Delete <b>Foo</b> ?"
                    loader: false, // set to true if you want the dailog to show a loader after click on "proceed"
                    reverse: false, // switch the button positions (left to right, and vise versa)
                    okText: 'Yes',
                    cancelText: 'No',
                    animation: 'zoom', // Available: "zoom", "bounce", "fade"
                    type: 'basic', // coming soon: 'soft', 'hard'
                    verification: 'continue', // for hard confirm, user will be prompted to type this to enable the proceed button
                    verificationHelp: 'Type "[+:verification]" below to confirm', // Verification help text. [+:verification] will be matched with 'options.verification' (i.e 'Type "continue" below to confirm')
                    clicksCount: 3, // for soft confirm, user will be asked to click on "proceed" btn 3 times before actually proceeding
                    backdropClose: false // set to true to close the dialog when clicking outside of the dialog window, i.e. click landing on the mask 
                  };
                  this.$dialog.confirm({title:"Done",body:'Progress Completed.Click yes to close'},options)
                  .then(function () {
                      store.commit("setprogress",false);
                  })
                  .catch(function () {
                      
                  });
              }

            }
        })
        .catch(error=>{
          throw error;
        })
        
      },

    },
    computed: {
      origin(){
        return store.state.origin;
      },
      currentActionRequest(){
        return store.state.currentActionRequest;
      }
    }
}
</script>

<style scoped >
  #progresscard {
    margin-left: 10%;
    margin-top: 10%;
    padding:4%;
    background: lightgray
  }

  #progresscircle{
    margin-top: 4%;
  }
</style>
