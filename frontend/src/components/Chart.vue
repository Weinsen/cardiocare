<template>
  <section class="container">
    <h1>Demo examples of vue-charts</h1>
    <div class="columns">
      <div class="column">
        <h3>Line Chart</h3>
        <chartjs-line></chartjs-line>
      </div>
      <div class="column">
        <h3>Bar Chart</h3>
        <chartjs-bar></chartjs-bar>
      </div>
    </div>
    <div class="columns">
      <div class="column">
        <h3>Radar Chart</h3>
        <chartjs-radar></chartjs-radar>
      </div>
      <div class="column">
        <h3>Data Binding Line Chart</h3>
        <form @submit.prevent="addData">
          <input placeholder="Add a Data" v-model="dataentry">
          <input placeholder="Add a Label" v-model="datalabel">
          <button type="submit">Submit</button>
        </form>
        <button @click="getA">Push</button>
        <!-- <canvas id="mixchart" count=""></canvas> -->
        <chartjs-line :labels="labels" :data="dataset" :bind="true"></chartjs-line>
        <!-- <chartjs-line target="mixchart" :labels="labels" :data="[9, 5]" :bind="true"></chartjs-line> -->
      </div>
    </div>
  </section>
</template>

<script>

import {HTTP} from '../http-constants'

export default {
  name: 'VueCharts',
  data () {
    return {
      errors: '',
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      dataset: [65, 59, 80, 81, 56, 55, 40]
    }
  },
  created () {
    this.show = true
    setInterval(this.getA, 2000)
  },
  methods: {
    addData () {
      this.dataset.push(this.dataentry)
      this.labels.push(this.datalabel)
      this.datalabel = ''
      this.dataentry = ''
    },
    getA: function () {
      HTTP.get('/list')
        .then(response => {
          // this.dataset.push(response.data.b)
          // this.labels.push(response.data.a)
          // this.dataset.shift()
          // this.labels.shift()
          this.dataset = response.data.b
          this.labels = response.data.a
        })
        .catch(e => {
          this.errors = e
        })
    }
  }
}
</script>
