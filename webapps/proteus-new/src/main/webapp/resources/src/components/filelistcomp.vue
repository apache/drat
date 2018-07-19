<template lang="html">

  <section class="filelistcomp" >
    <v-card id="filelistcard">
    <v-toolbar height="50" color="primary" dark>
      <v-toolbar-title>Files List</v-toolbar-title>
       <v-spacer></v-spacer>
    </v-toolbar>
    <strong v-if="fileslist.length==0">Empty List of files</strong>
    <v-list >
    <template v-for="(file,index) in fileslist">
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
        this.loadData();
        setInterval(function () {
          this.loadData();
        }.bind(this), 1000);
      
    },
    data() {
      return {
        data:[],
        fileslist:[]
      }
    },
    methods: {
        loadData(){
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
