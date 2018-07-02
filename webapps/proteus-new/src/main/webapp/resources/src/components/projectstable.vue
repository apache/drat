<template lang="html">

<v-card id="tablecard">
  <section class="projectstable">
    <!-- <h1>Projects</h1> -->
    <v-data-table id="ttx"
      :headers="headers"
      :items="desserts"
      hide-actions
      class="elevation-1"
    >
    <template slot="items" slot-scope="props">
        <td class="text-xs-left" >{{ props.item.num }}</td>
        <td class="text-xs-left">{{ props.item.repository }}</td>
        <td class="text-xs-left">{{ props.item.name }}</td>
        <td class="text-xs-left">{{ props.item.description }}</td>
        <td >
          <v-icon medium 
          @click="moreClicked()"
          >description</v-icon>
        </td>
      </template>
      </v-data-table>
  </section>
</v-card>
</template>

<script lang="js">
  export default  {
    name: 'projectstable',
    props: [],
    mounted() {

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
      desserts: [
        {
          num: 1,
          repository: 'cdm1',
          name: 'Repository Name',
          description : 'Description',
          audit: 'a'
        },

        {
          num: 1,
          repository: 'cdm1',
          name: 'Repository Name',
          description : 'Description',
          audit: 'a'
        },
        {
          num: 1,
          repository: 'cdm1',
          name: 'Repository Name',
          description : 'Description',
          audit: 'a'
        },
        {
          num: 1,
          repository: 'cdm1',
          name: 'Repository Name',
          description : 'Description',
          audit: 'a'
        },
        {
          num: 1,
          repository: 'cdm1',
          name: 'Repository Name',
          description : 'Description',
          audit: 'a'
        }

      ]
      }
    },
    methods: {
      moreClicked :function(){
        this.$log.info("as")      
      }
    },
    computed: {

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

  {
    color: white;
  }

  #tablecard{
    margin-top: 20px;
    padding : 10px;
  }
</style>
