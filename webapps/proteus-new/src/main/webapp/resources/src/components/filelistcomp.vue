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
          // this.fileslist.splice(0);
            // this.fileslist = [
                  // var a =  [ {
                  //       "title": Math.random(),
                  //       "description": "RatAggregateLog",
                  //       "link": "http://localhost:8080/opsui/data?productID=922ba582-7cc7-11e8-81ea-373255ec0c7a",
                  //       "casSource": "RatAggregateLog",
                  //       "source": "RatAggregateLog",
                  //       "pubDate": "Sun, 01 Jul 2018 06:12:02 IST"
                  //   },{
                  //       "title": Math.random(),
                  //       "description": "RatAggregateLog",
                  //       "link": "http://localhost:8080/opsui/data?productID=922ba582-7cc7-11e8-81ea-373255ec0c7a",
                  //       "casSource": "RatAggregateLog",
                  //       "source": "RatAggregateLog",
                  //       "pubDate": "Sun, 01 Jul 2018 06:12:02 IST"
                  //   },{
                  //       "title": Math.random(),
                  //       "description": "RatAggregateLog",
                  //       "link": "http://localhost:8080/opsui/data?productID=922ba582-7cc7-11e8-81ea-373255ec0c7a",
                  //       "casSource": "RatAggregateLog",
                  //       "source": "RatAggregateLog",
                  //       "pubDate": "Sun, 01 Jul 2018 06:12:02 IST"
                  //   },{
                  //       "title": Math.random(),
                  //       "description": "RatAggregateLog",
                  //       "link": "http://localhost:8080/opsui/data?productID=922ba582-7cc7-11e8-81ea-373255ec0c7a",
                  //       "casSource": "RatAggregateLog",
                  //       "source": "RatAggregateLog",
                  //       "pubDate": "Sun, 01 Jul 2018 06:12:02 IST"
                  //   },{
                  //       "title": Math.random(),
                  //       "description": "RatAggregateLog",
                  //       "link": "http://localhost:8080/opsui/data?productID=922ba582-7cc7-11e8-81ea-373255ec0c7a",
                  //       "casSource": "RatAggregateLog",
                  //       "source": "RatAggregateLog",
                  //       "pubDate": "Sun, 01 Jul 2018 06:12:02 IST"
                  //   },{
                  //       "title": Math.random(),
                  //       "description": "RatAggregateLog",
                  //       "link": "http://localhost:8080/opsui/data?productID=922ba582-7cc7-11e8-81ea-373255ec0c7a",
                  //       "casSource": "RatAggregateLog",
                  //       "source": "RatAggregateLog",
                  //       "pubDate": "Sun, 01 Jul 2018 06:12:02 IST"
                  //   },{
                  //       "title": Math.random(),
                  //       "description": "RatAggregateLog",
                  //       "link": "http://localhost:8080/opsui/data?productID=922ba582-7cc7-11e8-81ea-373255ec0c7a",
                  //       "casSource": "RatAggregateLog",
                  //       "source": "RatAggregateLog",
                  //       "pubDate": "Sun, 01 Jul 2018 06:12:02 IST"
                  //   },{
                  //       "title": Math.random(),
                  //       "description": "RatAggregateLog",
                  //       "link": "http://localhost:8080/opsui/data?productID=922ba582-7cc7-11e8-81ea-373255ec0c7a",
                  //       "casSource": "RatAggregateLog",
                  //       "source": "RatAggregateLog",
                  //       "pubDate": "Sun, 01 Jul 2018 06:12:02 IST"
                  //   },{
                  //       "title": Math.random(),
                  //       "description": "RatAggregateLog",
                  //       "link": "http://localhost:8080/opsui/data?productID=922ba582-7cc7-11e8-81ea-373255ec0c7a",
                  //       "casSource": "RatAggregateLog",
                  //       "source": "RatAggregateLog",
                  //       "pubDate": "Sun, 01 Jul 2018 06:12:02 IST"
                  //   },{
                  //       "title": Math.random(),
                  //       "description": "RatAggregateLog",
                  //       "link": "http://localhost:8080/opsui/data?productID=922ba582-7cc7-11e8-81ea-373255ec0c7a",
                  //       "casSource": "RatAggregateLog",
                  //       "source": "RatAggregateLog",
                  //       "pubDate": "Sun, 01 Jul 2018 06:12:02 IST"
                  //   },]
            //     ];
            // a.forEach((v, i) => {
            //            const val = (typeof v === 'object') ? Object.assign({}, v) : v;
                    
            //           this.fileslist.push(val);
            //       });
            
            if(this.currentRepo!=''){
                axios.get(this.origin+"/proteus/service/products?topn=10")
                .then(response=>{
                  // this.fileslist.splice(0,this.fileslist.length);
                  
                  response.data.forEach((v, i) => {
                       const val = (typeof v === 'object') ? Object.assign({}, v) : v;
                      //  this.fileslist.push(val);
                      // this.fileslist.push(val);
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
      // fileslist(){
      //   var temp = [];
      //   this.data.forEach((v, i) => {
      //       const val = (typeof v === 'object') ? Object.assign({}, v) : v;
      //     temp.push(val);
      //   });
        
      //   return temp;
      // },
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
