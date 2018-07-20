<template lang="html">

<v-card id="tablecard">
  <section class="projectstable">
    <!-- <h1>Projects</h1> -->
    <v-data-table id="ttx"
      :headers="headers"
      :items="docs"
      hide-actions
      class="elevation-1"
    >
    <template slot="items" slot-scope="props">
        <td class="text-xs-left" >{{props.index+1+count.start}}</td>
        <td class="text-xs-left">{{ props.item.repo }}</td>
        <td class="text-xs-left">{{ props.item.name }}</td>
        <td class="text-xs-left">{{ props.item.description }}</td>
        <td >
          <v-btn @click="moreClicked(props.index)">
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
              <v-card color="grey lighten-3" id="licencelist">
               
                 <br/>
                <v-chip close v-model="licence.standard">
                  <v-avatar class="teal">{{licence.docs.license_Standards}}</v-avatar>
                  Standard
                </v-chip>
                <v-chip close v-model="licence.unknown">
                  <v-avatar class="teal">{{licence.docs.license_Unknown}}</v-avatar>
                  Unknown
                </v-chip>
                <v-chip close v-model="licence.apache">
                  <v-avatar class="teal">{{licence.docs.license_Apache}}</v-avatar>
                  Apache
                </v-chip>
                 <v-chip close v-model="licence.binaries">
                  <v-avatar class="teal">{{licence.docs.license_Binaries}}</v-avatar>
                  Binaries
                </v-chip>
                 <v-chip close v-model="licence.generated">
                  <v-avatar class="teal">{{licence.docs.license_Generated}}</v-avatar>
                  Generated
                </v-chip>
                <v-chip close v-model="licence.notes">
                  <v-avatar class="teal">{{licence.docs.license_Notes}}</v-avatar>
                  Notes
                </v-chip>
                 <v-chip close v-model="licence.archives">
                  <v-avatar class="teal">{{licence.docs.license_Archives}}</v-avatar>
                  Archives
                </v-chip>
                <br/>
                <v-btn float color="primary"
                    @click="licence.unknown =true,licence.standard=true,licence.apache=true
                    ,licence.binaries=true,licence.generated=true,licence.notes=true,licence.archives=true"
                  >Reset</v-btn>
               
              </v-card>
            </v-flex>
          </v-layout>
          <v-card>
            <v-layout>
              <v-flex xs10 offset-xs1>
                <v-text-field
                  v-model="search"
                  append-icon="search"
                  label="Search"
                  single-line
                  hide-details
                ></v-text-field>
                </v-card-title>
                <v-data-table
                  :headers="licence.headers"
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
        setInterval(function () {
          this.loadData();
        }.bind(this), 30000);
    },
    data() {
      return {
        search:'',
        licence:{
          files:[],
          unknown:true,
          standard:true,
          apache:true,
          binaries:true,
          generated:true,
          notes:true,
          archives:true,
          docs:[''],
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
        { text: 'Audit',sortable: false, value: 'audit' }
      ],
      count:{
          numFound :0,
          start:0
        },

        docs:[]
      }
    },
    methods: {
      moreClicked :function(index){
        this.$log.info("as");
        this.dialog =true;     
        this.selectedItem = this.docs[index];
        this.loadLicenceData();
        this.loadFileDetails();
      },
      loadData(){
        
        axios.get(this.origin+"/solr/statistics/select?q=type:project&rows=220&wt=json")
            .then(response=>{
              this.$log.info(response.data);
              this.docs=response.data.response.docs;
              this.count.numFound = response.data.response.numFound;
              this.count.start = response.data.response.start;
            })
            .catch(error=>{
              
              throw error;
            })
      },
      loadLicenceData(){
        axios.get(this.origin+"/solr/statistics/select?q=id:\""+this.selectedItem.repo+"\"&fl=license_*&wt=json")
          .then(response=>{
            this.$log.info(response.data);
            this.licence.docs=response.data.response.docs[0];
          })
       },
      loadFileDetails(){
        axios.get(this.origin+"/solr/statistics/select?q=parent:\""+this.selectedItem.repo+"\"&rows=5000&wt=json")
        .then(response=>{
          this.sortedfiles  = response.data.response.docs;
        })
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
        
            if(this.licence.files){
              this.licence.files.forEach(file => {
                
                switch(file.license){
                  case "Apache":
                    if(this.licence.apache) listToReturn.push(file);
                    break;

                  case "Unknown":
                    if(this.licence.unknown) listToReturn.push(file);
                    break;

                  case "Standard":
                      if(this.licence.standard) listToReturn.push(file);
                      break;
                  case "Binaries":
                      if(this.licence.binaries) listToReturn.push(file);
                      break;

                  case "Generated":
                      if(this.licence.generated) listToReturn.push(file);
                      break; 
                  case "Notes":
                      if(this.licence.notes) listToReturn.push(file);
                      break;   
                  case "Archives":
                      if(this.licence.archives) listToReturn.push(file);
                      break;
                }
              });

            }
            
            return listToReturn;
        },

        set:function(docs){
          this.licence.files = docs;
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

  #licencelist{
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
</style>
