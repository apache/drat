<template>
  <div id="app">
    <v-app >
    <controllbar />
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
      
      <projectstable  v-else/>
      <v-spacer />
      
         
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
import Barchart from './components/Barchart'
import testii from './components/testii.vue'
import barchartcomp from './components/barchartcomp.vue'
import piechart from './components/piechart.vue'
import filelistcomp from './components/filelistcomp.vue'
import statisticscomp from './components/statisticscomp.vue'
import progresscomp from './components/progresscomp.vue'
import store from './store/store'
export default {
  name: 'app',
  store,
  components: {
   
    controllbar,
    projectstable,
    Barchart,
    testii,
    barchartcomp,
    filelistcomp,
    statisticscomp,
    piechart,
    progresscomp
  },
  data(){
    return{
     
    }
  },
  methods:{
    setHost(){
      this.$log.info(location.origin)
      store.commit("setOrigin",location.origin);
    }
  },
  computed:{
    progress (){
      return store.state.progress;
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
