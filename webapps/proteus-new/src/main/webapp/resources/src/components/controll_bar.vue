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
  <section class="controll-bar">
    <v-card id="controllbarcard">
      <v-layout row wrap>
        <v-text-field
        solo
          name="input"
          label="Repository to search or add to DRAT"
          single-line
          v-model="url"
          prepend-icon="search"
        />
        <v-btn v-on:click="search" color="info">Search</v-btn>
        <v-btn v-on:click="go" color="primary" medium> Run </v-btn>
        
      </v-layout>         
    </v-card>   
  </section>

</template>

<script lang="js">
  import store from './../store/store'
  import axios from 'axios'
  
  export default  {
    name: 'controllbar',
    store,
    props: [],
    mounted() {

    },
    data() {
      return {
        msg: 'null for now',
        url: ''
      }
    },
    methods: {
        run: function(){
            console.log("test"+this.url);
            store.commit("invert");
            store.commit("setCurrentRepo",this.url);
        },
        search:function(){
          store.commit("setprogress",false);
        },
        go: function(){
          let options = {
              html: false, // set to true if your message contains HTML tags. eg: "Delete <b>Foo</b> ?"
              loader: false, // set to true if you want the dailog to show a loader after click on "proceed"
              reverse: true, // switch the button positions (left to right, and vise versa)
              okText: 'Ok',
              cancelText: 'Close',
              animation: 'zoom', // Available: "zoom", "bounce", "fade"
              type: 'basic', // coming soon: 'soft', 'hard'
              verification: 'continue', // for hard confirm, user will be prompted to type this to enable the proceed button
              verificationHelp: 'Type "[+:verification]" below to confirm', // Verification help text. [+:verification] will be matched with 'options.verification' (i.e 'Type "continue" below to confirm')
              clicksCount: 3, // for soft confirm, user will be asked to click on "proceed" btn 3 times before actually proceeding
              backdropClose: false // set to true to close the dialog when clicking outside of the dialog window, i.e. click landing on the mask 
          };
          
          if(this.url.length==0){
                    this.$dialog.alert({title:"Invalid input",body:'Please enter valid path continue'},options)
            .then(function () {
                console.log('Clicked on proceed')
            })
            .catch(function () {
                console.log('Clicked on cancel')
            });
          }else{
              store.commit("setprogress",true);
              store.commit("setCurrentRepo",this.url);
            axios.post(this.origin+"/proteus/drat/go",{
            dirPath:this.url
          })
            .then(response=>{
              this.$log.info(response.data);              
            })
            .catch(error=>{
              throw error;
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
        }

    }
}
</script>

<style scoped>
  

  #controllbarcard{
    padding: 1%;
    padding-left: 10%;
    padding-right: 10%;
  }
</style>
run