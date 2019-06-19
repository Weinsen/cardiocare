<template>
  <div class=user-screen>
    <div class="user-bio">
      <div style="width: 100%; flex-grow: 1; flex-direction: column;">
        <div class="card">
          <h1>{{user.name}}</h1>
          <p style="font-weight: bold">MAC: {{user.mac}}</p><br>
          <p>{{user.bio}}</p>
        </div>
        <div class="card">
          <h2>Dados</h2>
          <p>Temperatura: {{stats.temp.now}}</p>
          <p>Frequencia: {{stats.freq.now}}</p>
          <p>Medições: {{stats.acq}}</p><br>
        </div>
        <div class="card">
          <h2>Estatística</h2>
          <table style="width: 100%">
            <tr>
              <th></th>
              <th>Min</th>
              <th>Avg</th>
              <th>Max</th>
            </tr>
            <tr>
              <td>Temperatura</td>
              <td>{{stats.temp.min}}</td>
              <td>{{stats.temp.avg}}</td>
              <td>{{stats.temp.max}}</td>
            </tr>
            <tr>
              <td>Batimentos</td>
              <td>{{stats.freq.min}}</td>
              <td>{{stats.freq.avg}}</td>
              <td>{{stats.freq.max}}</td>
            </tr>
          </table>
        </div>
      </div>
      <div class="card">
        <h2>Configurações</h2>
        <form style="width: 100%" @submit.prevent="checkForm">
          <table>
            <tr>
              <th></th>
              <th>Temperatura</th>
              <th>Batimentos</th>
            </tr>
            <tr>
              <td>Max</td>
              <td><input type="number" v-model="user.temp_max"></td>
              <td><input type="number" v-model="user.freq_max"></td>
            </tr>
            <tr>
              <td>Min</td>
              <td><input type="number" v-model="user.temp_min"></td>
              <td><input type="number" v-model="user.freq_min"></td>
            </tr>
          </table>
          <div style="display: flex; flex-direction: row">
            <button class="save-btn" type="submit">Salvar Configurações</button>
            <button class="notify-btn" type="button" v-on:click="alertUser">Notificar Usuário</button>
          </div>
        </form>
      </div>
    </div>
    <div class="user-stats">
      <chartjs-line class="card user-chart" :labels="labels" :datasets="datasetT" :bind="true" :option="graphOpt"></chartjs-line>
      <chartjs-line class="card user-chart" :labels="labels" :datasets="datasetF" :bind="true" :option="graphOpt"></chartjs-line>
    </div>
  </div>
</template>

<script>
import baseURL, {HTTP} from '../http-constants'
import io from 'socket.io-client'
export default {
  data () {
    return {
      user: {},
      stats: {
        temp: {
          min: 0,
          avg: 0,
          max: 0,
          now: 0
        },
        freq: {
          min: 0,
          avg: 0,
          max: 0,
          now: 0
        },
        acq: 0
      },
      photo: '',
      labels: [],
      datasetT: [{
        label: 'Corp.',
        backgroundColor: 'rgba(192,80,80,0.4)',
        borderColor: 'rgba(192,80,80,1)',
        data: [],
        fill: false
      },
      {
        label: 'Amb.',
        backgroundColor: 'rgba(192,0,192,0.4)',
        borderColor: 'rgba(192,0,192,1)',
        data: [],
        fill: false,
        pointRadius: 0
      },
      {
        label: 'Max.',
        backgroundColor: 'rgba(20,192,20,0.4)',
        borderColor: 'rgba(20,192,20,1)',
        data: [],
        fill: false,
        pointRadius: 0
      },
      {
        label: 'Min.',
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
        data: [],
        fill: false,
        pointRadius: 0
      }],
      datasetF: [{
        label: 'Freq.',
        backgroundColor: 'rgba(192,80,80,0.4)',
        borderColor: 'rgba(192,80,80,1)',
        data: [],
        fill: false
      },
      {
        label: 'Avg.',
        backgroundColor: 'rgba(192,0,192,0.4)',
        borderColor: 'rgba(192,0,192,1)',
        data: [],
        fill: false
      },
      {
        label: 'Max.',
        backgroundColor: 'rgba(20,192,20,0.4)',
        borderColor: 'rgba(20,192,20,1)',
        data: [],
        fill: false,
        pointRadius: 0
      },
      {
        label: 'Min.',
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
        data: [],
        fill: false,
        pointRadius: 0
      }],
      socket: io(baseURL),
      show: true,
      graphOpt: {
        responsive: true,
        responsiveAnimationDuration: 0,
        maintainAspectRatio: false,
        animation: {
          duration: 0
        },
        update: {
          duration: 0
        },
        // scales: {
        //   yAxes: [{
        //     id: 'Freq',
        //     type: 'linear',
        //     position: 'left',
        //     scalePositionLeft: true
        //   },
        //   {
        //     id: 'Temp',
        //     type: 'linear',
        //     position: 'right',
        //     scalePositionLeft: false
        //   }]
        scales: {
          yAxes: {
            id: 'Aux',
            type: 'linear',
            position: 'left',
            scalePositionLeft: true
          }
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
          // console.log(response.data)
        })
        .catch(e => {
          this.errors = e
        })
    },
    updateValue: function (name) {
      this.$emit('input', name)
    },
    alertUser: function () {
      HTTP.post('/alertUser', {
        message: {
          cmd: 'A',
          mac: this.user.mac
        }
      }).then(response => {
        if (response.status === 200) {
          this.$notify({
            group: 'foo',
            title: 'Sucesso!',
            type: 'success',
            text: 'Usuário notificado!'
          })
        }
      })
    },
    checkForm: function (e) {
      e.preventDefault()
      HTTP.post('/updateUser', {
        user: this.user
      }).then(response => {
        if (response.status === 200) {
          this.$notify({
            group: 'foo',
            title: 'Sucesso!',
            type: 'success',
            text: 'Valores alterados com sucesso!'
          })
        }
      })
    },
    getStats: function (dataset) {
      var stat = {
        max: 0,
        min: 0,
        avg: 0
      }
      for (var i in dataset.data) {
        stat.avg += parseFloat(dataset.data[i])
        if (dataset.data[i] > stat.max) {
          stat.max = parseFloat(dataset.data[i]).toFixed(2)
        } else if (dataset.data[i] < stat.min || stat.min === 0) {
          stat.min = parseFloat(dataset.data[i]).toFixed(2)
        }
      }
      stat.avg /= dataset.data.length
      stat.avg = stat.avg.toFixed(2)
      stat.now = parseFloat(dataset.data[dataset.data.length - 1]).toFixed(2)
      return stat
    },
    updateData: function (pack) {
      var i = 0
      if (this.datasetT[0].data.length > 16) {
        for (i in this.datasetT) {
          this.datasetT[i].data.shift()
        }
        for (i in this.datasetF) {
          this.datasetF[i].data.shift()
        }
        this.labels.shift()
      }
      // console.log(this.user)
      this.datasetT[0].data.push(pack[1])
      this.datasetT[1].data.push(pack[2])
      this.datasetT[2].data.push(this.user.temp_max)
      this.datasetT[3].data.push(this.user.temp_min)
      this.datasetF[0].data.push(pack[3])
      this.stats.freq = this.getStats(this.datasetF[0])
      this.stats.temp = this.getStats(this.datasetT[0])
      this.datasetF[1].data.push(this.stats.freq.avg)
      this.datasetF[2].data.push(this.user.freq_max)
      this.datasetF[3].data.push(this.user.freq_min)
      this.labels.push(this.stats.acq)
      this.stats.acq += 1
    }
  },
  created () {
    this.getUsers()
  },
  mounted () {
    this.socket.on('user', (data) => {
      var pack = data.split(':')
      if (pack[0] === this.user.mac) {
        this.updateData(pack)
      }
    })
  }
}
</script>

<style scoped>

  input {
    width: 90%;
  }

  button {
    margin: 10px;
    color: white;
    flex: 1;
    padding: 6px 10px;
    border: none;
    border-radius: 4px;
  }

  .save-btn {
    background-color: #4CAF50;
  }

  .notify-btn {
    background-color: #AF4C50;
  }

  .user-bio {
    box-shadow-right: 10px;
    width: 260px;
    /*width: 35vw;*/
    box-sizing: border-box;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
    /*display: flex;*/
    vertical-align: middle;
    text-align: center;
    flex-direction: column;
    /*flex-grow: 1;*/
  }

  .user-stats {
    height: 90vh;
    min-width: 320px;
    /*width: 65vw;*/
    box-sizing: border-box;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
    display: inline-block;
    flex-wrap: wrap;
    align-items: center;
    text-align: center;
    flex: 3 0 auto;
    /*display: flex;*/
    flex-direction: column;
  }

  .user-chart {
    box-sizing: border-box;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
    vertical-align: middle;
    text-align: center;
    /*flex-direction: column;*/
    flex-grow: 1;
    /*max-width: 40vw;*/
    width: 90%;
    height: 40vh;
  }

  .card {
    padding: 4px;
    margin: 4px;
    border: 1px #888888 solid;
    background-color: white;
    box-shadow: 2px 2px #888888;
    text-align: left;
    /*display: flex;*/
    /*justify-content: center;*/
    /*align-items: center;*/
    /*flex-wrap: wrap;*/
  }

  .card h2 {
    width: 100%;
    font-size: 1em;
    background-color: #483a7a;
    color: white;
    margin-bottom: 0.5em;
    padding: 2px;
  }

  @media only screen and (orientation: portrait) {
    .user-stats {
      width: 90vw;
    }

    .user-bio {
      width: 90vw;
    }
  }

</style>
