<template>
  <div class=user-screen>
    <div class="user-bio">
      <h1>User ID {{user.name}}</h1>
      <h2>MAC {{user.mac}}</h2>
      <p>{{user.bio}}</p>
      <div>
        <label>Oi</label><input type="text" name="text">
      </div>
    </div>
    <div class="user-stats">
      <chartjs-line class="user-chart" :labels="labels" :datasets="dataset" :bind="true" :option="graphOpt"></chartjs-line>
      <chartjs-bar class="user-chart" :labels="labels" :dataset="dataset" :bind="true" :option="graphOpt"></chartjs-bar>
    </div>
  </div>
</template>

<script>
import baseURL, {HTTP} from '../http-constants'
import io from 'socket.io-client'
export default {
  data () {
    return {
      user: '',
      photo: '',
      labels: [0, 0, 0, 0, 0],
      dataset: [{
        label: 'Temperatura',
        yAxisID: 'Temp',
        backgroundColor: 'rgba(192,80,80,0.4)',
        borderColor: 'rgba(192,80,80,1)',
        data: [0, 0, 0, 0, 0]
      },
      {
        label: 'Batimentos',
        yAxisID: 'Freq',
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
        data: [0, 0, 0, 0, 0]
      }],
      socket: io(baseURL),
      show: true,
      graphOpt: {
        responsive: true,
        // maintainAspectRatio: false,
        animation: {
          duration: 0
        },
        scales: {
          yAxes: [{
            id: 'Freq',
            type: 'linear',
            position: 'left',
            scalePositionLeft: true
          },
          {
            id: 'Temp',
            type: 'linear',
            position: 'right',
            scalePositionLeft: false
          }]
        }
      }
    }
  },
  methods: {
    getUsers: function () {
      HTTP.get('/getUser/' + this.$route.params.id)
        .then(response => {
          this.user = response.data.user[0]
          this.updateValue(this.user.name)
          // this.photo = baseURL + '/' + response.data.user.photo
          // this.labels = response.data.user.graph.labels
          // this.dataset = response.data.user.graph.data
          console.log(response.data)
        })
        .catch(e => {
          this.errors = e
        })
    },
    updateValue: function (name) {
      this.$emit('input', name)
    }
  },
  created () {
    this.getUsers()
  },
  mounted () {
    this.socket.on('TEMP', (data) => {
      var pack = data.split(':')
      console.log(pack)
      console.log(this.user.mac)
      if (pack[0] === this.user.mac) {
        if (this.dataset[0].data.length > 10) {
          this.dataset[0].data.shift()
          this.dataset[1].data.shift()
          this.labels.shift()
        }
        this.dataset[0].data.push(pack[1])
        this.dataset[1].data.push(pack[1] / 10)
        this.labels.push(pack[1])
      }
    })
  }
}
</script>
