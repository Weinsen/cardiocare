<template>
  <div style="height: 100%">
    <NavBar :title="title" :imgLink="image"></NavBar>
    <div id="dash" style="display: flex; flex-direction: column;">
      <div id="chat-box" ref="chatlog">
        <div v-for="m in messages" :key="m">{{m}}</div>
      </div>
      <form @submit.prevent="checkForm">
        <table style="border: 1px black solid; width: 100%">
          <tr style="width: 100%; display: flex; ">
            <!-- <td><label>Mensagem</label></td> -->
            <td style="flex: 1; flex-grow: 1; flex-direction: row"><input type="text" v-model="message" ref="input" style="width: 100%" ></td>
            <td><button type="submit">Submit</button></td>
          </tr>
        </table>
      </form>
    </div>
  </div>
</template>

<script>
import NavBar from '@/components/NavBar.vue'
import baseURL, {HTTP} from '../http-constants'
import io from 'socket.io-client'
export default {
  components: {
    NavBar
  },
  data () {
    return {
      socket: io(baseURL),
      title: 'Chat',
      image: null,
      messages: [],
      message: '',
      errors: []
    }
  },
  methods: {
    getMessages: function () {
      HTTP.get('/chat')
        .then(response => {
          this.messages = response.data
        })
        .catch(e => {
          this.errors = e
        })
    },
    checkForm: function (e) {
      e.preventDefault()
      HTTP.post('/chat/postMessage', {
        message: this.message
      })
      this.message = ''
    }
  },
  created () {
    this.getMessages()
  },
  mounted () {
    this.socket.on('CHAT', (data) => {
      this.messages.push(data)
    })
  },
  updated () {
    this.$refs.chatlog.scrollTop = this.$refs.chatlog.scrollHeight
  }
}
</script>

<style>
#chat-box {
  height: 50vh;
  overflow: auto;
  width: 100%;
  background-color: rgba(255,255,255,0.8);
  overflow: auto;
  flex-grow: 1;
  flex: 1;
  max-height: 75vh;
  flex-direction: column;
}
</style>
