<template lang="html">

  <section class="progresscomp">
    <v-card id="progresscard">
    <h1>Progress</h1>
     <v-progress-circular
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
  export default  {
    name: 'progresscomp',
    props: [],
    mounted() {
        this.loaddata();
        setInterval(function () {
          this.loaddata();
        }.bind(this), 5000);
    },
    data() {
      return {
          value:0,
          status:"IDLE"
      }
    },
    methods: {
      loaddata(){
        axios.get("http://localhost:8080/proteus/service/status/drat")
        .then(response=>{
            if(response.data=="CRAWL"){
              this.status="Crawling...";
              this.value=0;
            }else if(response.data=="INDEX"){
              this.status="Indexing...";
              this.value=25;
            }else if(response.data=="MAP"){
              this.status="Mapping...";
              this.value=50;
            }else if(response.data=="REDUCE"){
              this.status="Reducing...";
              this.value=75;
            }else if(response.data=="IDLE"){
              this.status="Finished"
              this.value=100;
            }
        })
        .catch(error=>{
          throw error;
        })
        
      }
    },
    computed: {

    }
}
</script>

<style scoped >
  #progresscard {
    margin-left: 10%;
    margin-top: 10%
  }
</style>
