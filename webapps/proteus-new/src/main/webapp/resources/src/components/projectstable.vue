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

<v-card id="tablecard">
  
  <v-toolbar dark color="primary">
     <v-toolbar-title class="white--text">Projects</v-toolbar-title>
  </v-toolbar>
  <section class="projectstable">
    <v-text-field
      id="projectsearch"
      v-model="projectsearch"
      append-icon="search"
      solo
      label="Search"
      single-line
      hide-details>
    </v-text-field>
    <v-data-table id="ttx"
      :headers="headers"
      :items="docs"
      :search="projectsearch"
      :filter="filterProjects"
      :custom-filter="customfilterprojects"
      :rows-per-page-items="rowsPerPageItemsforProjects"
      class="elevation-1"
    >
    <template slot="items" slot-scope="props">
        <td class="text-xs-left" >{{props.index+1+count.start}}</td>
        <td class="text-xs-left">{{ props.item.repo }}</td>
        <td class="text-xs-left">{{ props.item.name }}</td>
        <td class="text-xs-left">{{ props.item.description }}</td>
        <td >
          <v-btn @click="moreClicked(props.item)">
          <v-icon medium 
          
          >description</v-icon>
          </v-btn>
        </td>
      </template>
      </v-data-table>
  </section>
  <section class="fulldialog">
    <v-layout row justify-center>
      <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
        
        <v-card>
          <v-toolbar dark color="primary">
            <v-btn icon dark @click.native="dialog = false">
              <v-icon>close</v-icon>
            </v-btn>
            <v-toolbar-title>{{selectedItem.name}}</v-toolbar-title>
            <v-spacer></v-spacer>
            <!-- <v-toolbar-items>
              <v-btn dark flat @click.native="dialog = false">Save</v-btn>
            </v-toolbar-items> -->
          </v-toolbar>
          <v-layout row justify-space-between>
            <v-flex xs10 offset-xs1>
              <v-card  >
                <v-card id="projectdetails" color="grey lighten-3">
                     <v-layout  align-center justify-space-between row>
                      <v-flex xs6 >
                        <p class="text-sm-left">Project Name</p>
                        
                      </v-flex>
                      <v-flex xs6>
                        <v-text-field
                          solo
                          uneditable
                          :value="selectedItem.name"
                          readonly
                        ></v-text-field>
                      </v-flex>
                    </v-layout>
                    
                    <v-layout  justify-space-between row>
                      <v-flex xs6 >
                        <p class="text-sm-left"> Project Description</p>
                       
                      </v-flex>
                      <v-flex xs6>
                        <v-text-field
                          name="input-7-1"
                          solo
                          textarea
                          :value="selectedItem.description"
                          flat
                        ></v-text-field>
                        
                      </v-flex>
                    </v-layout>
                    <v-layout  align-center justify-space-between row>
                      <v-flex xs6 >
                        <p class="text-sm-left">Project Repository</p>
                        
                      </v-flex>
                      <v-flex xs6>
                        <v-text-field
                          label="Solo"
                         
                          solo  
                          uneditable
                          :value="selectedItem.repo"
                          readonly
                        ></v-text-field>
                      </v-flex>
                    </v-layout>
                    <v-layout  align-center justify-space-between row>
                      <v-flex xs6 >
                        <p class="text-sm-left">Project Location</p>
                      </v-flex>
                      <v-flex xs6>
                        <v-text-field
                          label="Solo"
                         
                          solo
                          uneditable
                          :value="selectedItem.loc_url"
                          readonly
                        ></v-text-field>
                      </v-flex>
                    </v-layout>
                </v-card>
              </v-card>
            </v-flex>
            
           
          </v-layout>
          <v-layout row >
            <v-flex xs10  offset-xs1>
              <v-card color="grey lighten-3" id="licenselist">
               
                 <br/>
                <v-chip close v-model="license.standard">
                  <v-avatar class="teal">{{license.docs.license_Standards}}</v-avatar>
                  Standard
                </v-chip>
                <v-chip close v-model="license.unknown">
                  <v-avatar class="teal">{{license.docs.license_Unknown}}</v-avatar>
                  Unknown
                </v-chip>
                <v-chip close v-model="license.apache">
                  <v-avatar class="teal">{{license.docs.license_Apache}}</v-avatar>
                  Apache
                </v-chip>
                 <v-chip close v-model="license.binaries">
                  <v-avatar class="teal">{{license.docs.license_Binaries}}</v-avatar>
                  Binaries
                </v-chip>
                 <v-chip close v-model="license.generated">
                  <v-avatar class="teal">{{license.docs.license_Generated}}</v-avatar>
                  Generated
                </v-chip>
                <v-chip close v-model="license.notes">
                  <v-avatar class="teal">{{license.docs.license_Notes}}</v-avatar>
                  Notes
                </v-chip>
                 <v-chip close v-model="license.archives">
                  <v-avatar class="teal">{{license.docs.license_Archives}}</v-avatar>
                  Archives
                </v-chip>
                <br/>
                <v-btn float color="primary"
                    @click="license.unknown =true,license.standard=true,license.apache=true
                    ,license.binaries=true,license.generated=true,license.notes=true,license.archives=true"
                  >Reset</v-btn>
               
              </v-card>
            </v-flex>
          </v-layout>
          <v-card id="licensefiletable">
            <v-layout>
              <v-flex xs10 offset-xs1>
                <v-text-field
                  v-model="search"
                  append-icon="search"
                  label="Search"
                  single-line
                  hide-details>
                </v-text-field>
               
                <v-data-table
                  :headers="license.headers"
                  :items="sortedfiles"
                  :search="search"
                >
                  <template slot="items" slot-scope="props">
                    <td class="text-xs-left">{{props.index+1 }}</td>
                    <td class="text-xs-left">{{ props.item.id }}</td>
                    <td class="text-xs-left">{{ props.item.mimetype }}</td>
                    <td class="text-xs-left">{{ props.item.license }}</td>
                    <td class="text-xs-left" id="headercell">{{ props.item.header }}</td>
                  </template>
                   <v-alert slot="no-results" :value="true" color="error" icon="warning">
                    Your search for "{{ search }}" found no results.
                  </v-alert>
                </v-data-table>
              </v-flex>
            </v-layout>
          </v-card> 
        </v-card>
        
      </v-dialog>
    </v-layout>
  </section>
</v-card>
</template>

<script lang="js">
import axios from 'axios';
import store from './../store/store';
  export default  {
    name: 'projectstable',
    store,
    props: [],
    mounted() {
        this.loadData();
    },
    beforeDestroy(){
      clearInterval(this.timerClearVar);
    },
    data() {
      return {
        projectsearch:'',
        search:'',
        timerClearVar:'',
        license:{
          files:[],
          unknown:true,
          standard:true,
          apache:true,
          binaries:true,
          generated:true,
          notes:true,
          archives:true,
          docs:[],
          headers:[
            { text: '#',sortable: true, value: 'num' },
            { text: 'Location',sortable: false, value: 'loc' },
            { text: 'Mime Type',sortable: true, value: 'mtype' },
            { text: 'License',sortable: true, value: 'license' },
            { text: 'Header',sortable:false,value:'header',width:'20px'}
          ]
        },
        dialog:false,
        selectedItem:'',
          headers: [
        {
          text: '#',
          align: 'center',
          sortable: false,
          value: 'num'
        },
        { text: 'Repository',sortable: false, value: 'repository' },
        { text: 'Name',sortable: false, value: 'name' },
        { text: 'Description',sortable: false, value: 'description' },
        { text: 'Audit',sortable: false, value: 'audit' },
        ],
        count:{
          numFound :0,
          start:0
        },

        docs:[],
        rowsPerPageItemsforProjects: [50,100,200,500,1000,3000,5000,{"text":"$vuetify.dataIterator.rowsPerPageAll","value":-1}]
      }
      
    },
    methods: {
      customfilterprojects(items,search,filter){
        if(search!=undefined){
          search = search.toString().toLowerCase()
          return items.filter(row=>filter(row,search))
        }else{
          return items;
        }
        
      },
      filterProjects(inputObject,search){
        if(inputObject.repo.toLowerCase().includes(search)){
          return true;
        }
        if(inputObject.name.toLowerCase().includes(search)){
          return true;
        }
        if(inputObject.description.toLowerCase().includes(search)){
          return true;
        }
        return false;
      },
      moreClicked :function(item){
        this.$log.info("as");
        this.dialog =true;     
        //this.selectedItem = this.docs[index];
        this.selectedItem = item;
        this.loadLicenseData();
        this.loadFileDetails();
      },
      loadData(){
          axios.get(this.origin+"/solr/statistics/select?q=type:project&wt=json")
            .then(response=>{
              this.$log.info(response.data);
              this.docs=response.data.response.docs;
              this.count.numFound = response.data.response.numFound;
              this.count.start = response.data.response.start;
              if(response.data.response.numFound != null && response.data.response.numFound>10){
                axios.get(this.origin+"/solr/statistics/select?q=type:project&rows="+this.count.numFound+"&wt=json")
                  .then(response=>{
                    this.docs= response.data.response.docs;
                    this.count.numFound = response.data.response.numFound;
                    this.count.start = response.data.response.start;
                  })
                  .catch(error=>{

                  })
              }

            })
            .catch(error=>{

              throw error;
            })
      },
      loadLicenseData(){
        axios.get(this.origin+"/solr/statistics/select?q=id:\""+this.selectedItem.repo+"\"&fl=license_*&wt=json")
          .then(response2=>{
            if(response2.data.response.numFound!=null){
                axios.get(this.origin+"/solr/statistics/select?q=id:\""+this.selectedItem.repo+"\"&fl=license_*&rows="+response2.data.response.numFound+"&wt=json")
                .then(response=>{
                    this.$log.info(response.data);
                    this.license.docs=response.data.response.docs[0];
                });
            }
             
            
          })
       },
      loadFileDetails(){
        axios.get(this.origin+"/solr/statistics/select?q=parent:\""+this.selectedItem.repo+"\"&rows=5000&wt=json")
        .then(response2=>{
            axios.get(this.origin+"/solr/statistics/select?q=parent:\""+this.selectedItem.repo+"\"&rows="+response2.data.response.numFound+"&wt=json")
            .then(response=>{
              this.sortedfiles  = response.data.response.docs;
            });
        });
        
      }

    },
    computed: {
      origin(){
        return store.state.origin;
      },
      currentrepo(){
        return store.state.currentRepo;
      },
      sortedfiles:{

        get:function(){
            var listToReturn = [];
        
            if(this.license.files){
              this.license.files.forEach(file => {
                
                switch(file.license){
                  case "Apache":
                    if(this.license.apache) listToReturn.push(file);
                    break;

                  case "Unknown":
                    if(this.license.unknown) listToReturn.push(file);
                    break;

                  case "Standard":
                      if(this.license.standard) listToReturn.push(file);
                      break;
                  case "Binaries":
                      if(this.license.binaries) listToReturn.push(file);
                      break;

                  case "Generated":
                      if(this.license.generated) listToReturn.push(file);
                      break; 
                  case "Notes":
                      if(this.license.notes) listToReturn.push(file);
                      break;   
                  case "Archives":
                      if(this.license.archives) listToReturn.push(file);
                      break;
                }
              });

            }
            
            return listToReturn;
        },

        set:function(docs){
          this.license.files = docs;
        }
        
      }
    },
    filters:{
      
    }
}
</script>

<style>
  .projectstable {
    padding-top:10px;
    padding-bottom: 10px;
  }

  .row{
    margin:2%
  }

  #projectdetails .row{
    margin:1%;
  }

  tr:nth-child(even){background-color :#f2f2f2}
  tr{background-color :#ddd}
  th{background-color: #2196F3}

  #projectdetails{
    padding: 2%;
    padding-left:10%;
    padding-right:10%;
  }  

  #licenselist{
    padding: 2%;
    margin-top: 2%;
  }

  #headercell{
    max-width: 400px;
    overflow: hidden;
    white-space: nowrap;
  }

  #tablecard{
    margin-top: 20px;
    padding : 10px;
  }

  #licensefiletable{
    margin-bottom: 80px;
    z-index: 950;
  }
  #projectsearch{
    
  }
</style>
