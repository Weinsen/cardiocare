<template>
  <div id="bar">
    <div><img v-if="imgLink" v-bind:src="imgLink" id="profile-icon"></div>
    <div class="bar-label">{{title}}</div>
    <router-link to="/users" class="bar-item"><p>Usuários</p></router-link>
    <router-link to="/" class="bar-item"><img src="../assets/wifi_heart3.svg" id="logicon"></router-link>
  </div>
</template>

<script>
export default {
  name: 'NavBar',
  // To use props, they must be declared
  props: {
    title: String,
    imgLink: String
  }
}
</script>
