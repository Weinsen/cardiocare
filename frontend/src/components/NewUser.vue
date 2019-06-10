<template>
  <div style="height: 100%">
    <NavBar :title="title" :imgLink="image"></NavBar>
    <div id="dash">
      <form @submit.prevent="checkForm">
        <table>
          <tr>
            <td><label>Nome de Usuário</label></td>
            <td><input type="text" v-model="user.name"></td>
          </tr>
          <tr>
            <td><label>MAC de Dispositivo</label></td>
            <td><input type="text" v-model="user.mac"></td>
          </tr>
          <tr>
            <td><label>Data de Nascimento</label></td>
            <td><input type="date" v-model="user.date"></td>
          </tr>
          <tr>
            <td><label>Biografia</label></td>
            <td><textarea rows="5" type="text" v-model="user.bio"></textarea></td>
          </tr>
        </table>
        <button type="submit">Submit</button>
      </form>
    </div>
  </div>
</template>

<script>
import NavBar from '@/components/NavBar.vue'
import {HTTP} from '../http-constants'
export default {
  components: {
    NavBar
  },
  data () {
    return {
      title: 'Cadastrar novo usuário',
      image: null,
      errors: [],
      user: {
        name: null,
        mac: null,
        bio: null,
        date: null,
        profile: null
      }
    }
  },
  methods: {
    checkForm: function (e) {
      e.preventDefault()
      HTTP.post('/newUser', {
        user: this.user
      })
    }
  }
}
</script>
