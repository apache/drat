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
<template>
  <div id="app">
    <v-app >
     
    <controllbar />
    <v-navigation-drawer
      :mini-variant.sync="mini"
      v-model="drawer"
      hide-overlay
      absolute
      stateless
    >
      
      <v-toolbar flat class="transparent">

        <v-list class="pa-0">
          <v-list-tile avatar>
            <v-list-tile-avatar>
              <img width=10px height=10px src="leaf-logo.png">
            </v-list-tile-avatar>
  
            <v-list-tile-content>
              <v-list-tile-title>Proteus</v-list-tile-title>
            </v-list-tile-content>
  
            <v-list-tile-action>
              <v-btn
                icon
                @click.stop="mini = !mini"
              >
                <v-icon>chevron_left</v-icon>
              </v-btn>
            </v-list-tile-action>
          </v-list-tile>
        </v-list>
      </v-toolbar>
      <v-spacer/>
      <v-list class="pt-0" dense>
        <v-divider></v-divider>
  
        <v-list-tile
          v-for="item in items"
          :key="item.title"
          @click="selectmenu(item)"
        >
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
  
          <v-list-tile-content>
            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <div id="contentpane" >
       
      <v-layout row wrap v-if="progress">
        <v-flex xs3>
          <filelistcomp/>
        </v-flex>
        
        <v-flex xs3>
          <statisticscomp/>
          <progresscomp/>
        </v-flex>
        <v-flex xs6>
          <section >
          <barchartcomp />
          <piechart/>
          </section>
        </v-flex>
       
      </v-layout>
      <section v-else-if="stateView=='summary'">
      <projectstable  />
       <v-flex xs12>
          <section>
            <bublechartcomp/>
          </section>
        </v-flex>
      <v-spacer />
      
      <v-layout row>
       
          <licencepiecomp/>
          <v-spacer/>
          <topmimepiecomp/>
        
      </v-layout>

      </section>
      <auditsummarycomp v-else/>
      <v-snackbar
        v-model="snackbar"
        top
        right
        :timeout="6000"
        
      >
        <v-badge left center>
        <span slot="badge">{{snackbarmessageindex}}</span>
        
      </v-badge>
      <v-icon
      @click="snackbarmessageindex--"
          color="grey lighten-1"
        >
          navigate_before
        </v-icon>
        {{snackbarmessages[snackbarmessageindex]}}

        <v-icon
          color="grey lighten-1"
          @click="snackbarmessageindex++;
          if(snackbarmessageindex>=snackbarmessages.length)snackbarmessageindex=snackbarmessages.length-1"
        >
          navigate_next
        </v-icon>
        <v-icon
          color="red lighten-1"
          @click="removeelement(snackbarmessageindex);"
        >
          clear
        </v-icon>
        <v-btn
          color="pink"
          flat
          @click="snackbar = false"
        >
          Close
        </v-btn>
      </v-snackbar>  
    </div>
    
    <v-spacer/>
    <v-card >
      <img hieght="40px" width="150px" src="logo.png">
    </v-card>
       
    </v-app>
  </div>
</template>
<script>


import controllbar from './components/controll_bar.vue'
import projectstable from './components/projectstable.vue'
import barchartcomp from './components/barchartcomp.vue'
import piechart from './components/piechart.vue'
import filelistcomp from './components/filelistcomp.vue'
import statisticscomp from './components/statisticscomp.vue'
import progresscomp from './components/progresscomp.vue'
import bublechartcomp from './components/bublechartcomp.vue'
import licencepiecomp from './components/licencepiecomp.vue'
import topmimepiecomp from './components/topmimepiecomp.vue'
import auditsummarycomp from './components/auditsummarycomp.vue'
import store from './store/store'
export default {
  name: 'app',
  store,
  components: {
   
    controllbar,
    projectstable,
    barchartcomp,
    filelistcomp,
    statisticscomp,
    piechart,
    progresscomp,
    bublechartcomp,
    licencepiecomp,
    topmimepiecomp,
    auditsummarycomp
  },
  data(){
    return{
      snackbar:false,
      snackbarmessage:'',
      snackbarmessageindex:0,
      snackbarmessages:[],
      drawer: true,
      items: [
        { title: 'Summary', icon: 'dashboard' },
        { title: 'Audit', icon: 'question_answer' }
      ],
      mini: true,
      right: null
    }
  },
  methods:{
    setHost(){
      this.$log.info(location.origin)
      store.commit("setOrigin",location.origin);
    },
    selectmenu(menu){
      if(menu.title=="Summary"){
        store.commit("setView","summary");
        this.addsnackbarmessage("Summary View Loaded");
      }else if(menu.title=="Audit"){
        this.addsnackbarmessage("Audit View Loaded");
        store.commit("setView","audit");
      }
      this.showsnackbar();
    },
    showsnackbar(){
      this.snackbarmessageindex = this.snackbarmessages.length-1;
      if(this.snackbarmessageindex>-1) this.snackbar=true;
    },
    addsnackbarmessage(message){
      if(this.snackbarmessages.length==10){
        this.snackbarmessages.shift();
      }
       this.snackbarmessages.push(message);
      
    },
    removeelement(position){
      this.snackbarmessages.splice(position,1);
      if(this.snackbarmessageindex!=0)this.snackbarmessageindex--;
    }
  
  },
  computed:{
    progress (){
      return store.state.progress;
    },
    stateView(){
      return store.state.view;
    } 
  },
  mounted(){
   this.setHost();
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 0px;
}

#contentpane{
  padding-left: 10%;
  padding-right: 10%;
}
#footercard{
  background-color: #2c3e50;
  width: 100%;
}

#logospace{
  width: 80%;
}
</style>
