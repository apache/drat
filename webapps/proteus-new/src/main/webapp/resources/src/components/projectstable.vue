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
          <v-btn @click="moreClicked()">
          <v-icon medium 
          
          >description</v-icon>
          </v-btn>
        </td>
      </template>
      </v-data-table>
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
        
          headers: [
        {
          text: '#',
          align: 'left',
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

        docs:[{"description":"Default DRAT repo.",
        "text":["Default DRAT repo.","DRAT"],
        "repo":"/home/xelvias/drat/src",
        "loc_url":"http://github.com/chrismattmann/drat.git",
        "type":"project","id":"http://github.com/chrismattmann/drat.git","name":"DRAT"},
        {"description":"Default DRAT repo.",
        "text":["Default DRAT repo.","DRAT"],
        "repo":"/home/xelvias/drat/src",
        "loc_url":"http://github.com/chrismattmann/drat.git",
        "type":"project","id":"http://github.com/chrismattmann/drat.git","name":"DRAT"}]
      }
    },
    methods: {
      moreClicked :function(){
        this.$log.info("as")      
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
      }
    },
    computed: {
      origin(){
        return store.state.origin;
      }
    }
}
</script>

<style>
  .projectstable {
    padding-top:10px;
    padding-bottom: 10px;
  }

  tr:nth-child(even){background-color :#f2f2f2}
  tr{background-color :#ddd}
  th{background-color: #2196F3}

  

  #tablecard{
    margin-top: 20px;
    padding : 10px;
  }
</style>
