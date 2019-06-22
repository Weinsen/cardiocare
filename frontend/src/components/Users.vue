<template>
  <div>
    <NavBar :title="title"></NavBar>
    <div id="dash">
      <div class="user-header">
        <p style="width: 7vw; font-weight: bold">ID</p>
        <p style="width: 25vw">Usuário</p>
        <p style="width: 20vw">MAC</p>
        <p>Último acesso</p><br>
      </div>
      <div style="overflow: auto;" v-for="(user, index) in users" v-bind:key="index" class="user-list">
        <router-link :to="`/user/${user.id}`" style="display: flex">
          <!-- <div><img v-bind:src="image" id="profile-icon"></div> -->
          <p style="width: 7vw; font-weight: bold">{{user.id}}</p>
          <p style="width: 25vw">{{user.name}}</p>
          <p style="width: 20vw">{{user.mac}}</p>
          <p v-if="user.isActive">{{user.isActive}}</p>
          <p v-else>{{new Date(user.lastMessage).toLocaleString()}}</p><br>
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

<style>

  .user-header {
    background-color: #483a7a;
    border-top: 1px black solid;
    padding: 1em;
    text-decoration: none;
    font-weight: bold;
    color: black;
    display: flex;
  }

  .user-header p {
    color: #FFF;
  }

  .user-list {
    color: #101080;
    border-top: 1px black solid;
    padding: 1em;
    text-decoration: none;
    font-weight: bold;
    color: black;
  }

  .user-list a {
    color: black;
    text-decoration: none;
    font-size: 14px;
  }

  .user-list:hover {
    animation-name: users-list-anim;
    animation-fill-mode: forwards;
    animation-duration: 0.5s;
  }

  .user-list:nth-child(2n) {
    background-color: #F4F4FF;
  }

  @keyframes users-list-anim {
  0%   {
    background-color: none;
  }
  100% {
    background-color: rgba(255, 21, 20, 0.2);
  }
}

</style>
