<template lang="html">
<v-card id="barchart">
  <section class="barchart">
    <GChart type="ColumnChart"
    :data="barChartData"
    :options="chartOptions"/>
    <GChart type="PieChart"
    :data="chartData"
    :options="chartOptions"/>
  </section>
</v-card>
</template>

<script lang="js">
  
  export default  {
    name: 'barchart',
    props: [],
    mounted() {

    },
    data() {
      return {
        barChartData:[
          ['Year','Sales','Expenses','Profit'],
          ['2014',1000,400,200],
          
          
        ],
        chartOptions:{
          chart:{
            width:400,
            height:240,
            title:'Title',
            subtitle:'subtitle'
          }
        },
        chartData:[
          ['Task','Hours per day'],
          ['work',22],
          ['Eat',11],
          ['Commute',2]
        ]

      }
    },
    methods: {

    },
    computed: {

    }
}
</script>

<style scoped>
  #barchart {
    margin-top: 5%;
    margin-bottom :5%
  }
</style>
