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
  import store from './../store/store';
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
        axios.get(this.origin+"/proteus/service/status/drat")
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
      origin(){
        return store.state.origin;
      }
    }
}
</script>

<style scoped >
  #progresscard {
    margin-left: 10%;
    margin-top: 10%
  }
</style>
