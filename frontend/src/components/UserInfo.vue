<template>
  <div class=user-screen>
    <div class="user-bio">
      <div style="width: 100%; flex-grow: 1; flex-direction: column;">
        <h1>User ID {{user.name}}</h1>
        <h2>MAC {{user.mac}}</h2>
        <p>{{user.bio}}</p>
      </div>
      <div style="width: 100%">
        <button type="submit">Notificar Usuário</button>
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

<style scoped>

  button {
    margin-top: 10px;
    background-color: #AF4C50;
    color: white;
    width: 100%;
    padding: 12px 20px;
    border: none;
    border-radius: 4px;
  }

  .user-bio {
    box-shadow-right: 10px;
    min-width: 300px;
    box-sizing: border-box;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
    display: flex;
    vertical-align: middle;
    text-align: center;
    flex-direction: column;
    flex-grow: 2;
  }

  .user-stats {
    height: 100%;
    min-width: 300px;
    box-sizing: border-box;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
    display: inline-block;
    flex-wrap: wrap;
    align-items: center;
    text-align: center;
    flex-direction: row;
    flex-grow: 1;
  }

  .user-chart {
    margin: 10px;
    box-sizing: border-box;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
    vertical-align: middle;
    text-align: center;
    flex-direction: column;
    flex-grow: 1;
    max-width: 40vw;
    min-width: 300px;
  }

  @media only screen and (max-device-width : 600px) {
    .user-chart {
      max-width: 100vw;
    }
  }

</style>
