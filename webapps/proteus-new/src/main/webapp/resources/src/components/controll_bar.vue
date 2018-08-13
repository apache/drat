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
          name="url"
          label="Repository to add to DRAT"
          single-line
          v-model="url"
        />
        <v-btn v-on:click="dialog=true" color="primary" medium> Run </v-btn>
        <v-dialog v-model="dialog" persistent max-width="500px">
          <v-card id="repodetailscard">
            <v-text-field
              solo
                name="url"
                label="Repository to add to DRAT"
                single-line
                v-model="url"
              />
              <hr>
              <v-text-field
              solo
                name="name"
                label="Name of the repository"
                single-line
                v-model="reponame"
              />
              
              <v-spacer/>
              <hr/>
              <v-text-field
              solo
                name="description"
                label="Description about the repository"
                
                v-model="repodesc"
              />
              <hr/>
            
            <v-select xs1
              v-model="selectedAction"
              :items="dratoptions"
              label="Action"
              required
              dense
              nudge-width
              @change="$v.select.$touch()"
              @blur="$v.select.$touch()"
            />
            <v-btn v-on:click="dialog=false">Close</v-btn>
            <v-btn v-on:click="go" color="primary">Run</v-btn>
          </v-card>  
        </v-dialog>
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
    watch:{
      progress:function(newVal){
        if(newVal==false){
          this.clearRepoDetails();
        }
      }
    },
    data() {
      return {
        dialog:false,
        msg: 'null for now',
        url: '',
        repo:'',
        repodesc:'',
        repoloc:'',
        reponame:'',
        dratoptions:["Go","Crawl","Index","Map","Reduce","Reset"],
        selectedAction:'Go'
      }
    },
    methods: {
        clearRepoDetails:function(){
          this.url="";
          this.repo="";
          this.repodesc="";
          this.repoloc="";
          this.reponame="";
        },
        run: function(){
           
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
          var action = "go";
          switch(this.selectedAction){
            case "Go":
              action = "go";
              break;
            case "Index":
              action = "index";
              break;
            case "Crawl":
              action= "crawl";
              break;

            case "Map":
              action = "map";
              break;

            case "Reduce":
              action = "reduce";
              break;
            case "Reset":
              action = "reset";
              break;

          }
          
          if(this.url.length==0 ){
                    this.$dialog.alert({title:"Invalid input",body:'Please enter valid path and location, then continue'},options)
            .then(function () {
                
            })
            .catch(function () {
                
            });
          }else{
            if(action==="reset"){
              axios.post(this.origin+"/proteus/drat/reset","")
              .then(response=>{
                this.$log.info(response.data);              
              })
            }else{
              store.commit("setCurrentActionRequest",action.toUpperCase()); 
              store.commit("setprogress",true);
              store.commit("setCurrentRepo",this.url);
              this.dialog = false;
              var body = {
                id:this.repoloc,
                repo:this.url,
                name:this.reponame,
                loc_url:this.repoloc,
                description:this.repodesc
              };
              axios.post(this.origin+"/proteus/drat/"+action,body)
              .then(response=>{
                this.$log.info(response.data);              
              })
              .catch(error=>{
                throw error;
              })
            }
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
        progress(){
          return store.state.progress;
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

  #repodetailscard{
    padding: 2%;
  }
</style>
run