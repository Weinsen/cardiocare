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

<style>

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
