<template>
  <div>
    <NavBar :title="title"></NavBar>
    <div id="dash">
      <div style="overflow: auto;" v-for="user in users" v-bind:key='user' class="user-list">
        <router-link :to="`/user/${user.id}`" style="display: flex">
          <!-- <div><img v-bind:src="image" id="profile-icon"></div> -->
          <p style="width: 33vw">{{user.name}}</p>
          <p style="margin-left">{{user.mac}}</p>
        </router-link>
      </div>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import NavBar from '@/components/NavBar.vue'
import {HTTP} from '../http-constants'
export default {
  name: 'userlist',
  data () {
    return {
      title: 'Usuários Ativos',
      users: '',
      errors: '',
      show: true
    }
  },
  components: {
    NavBar
  },
  methods: {
    getUsers: function () {
      HTTP.get('/getUsers')
        .then(response => {
          this.users = response.data.users
          console.log(this.users)
        })
        .catch(e => {
          this.errors = e
        })
    }
  },
  created () {
    this.getUsers()
  }
}
</script>
