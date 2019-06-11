<template>
  <div style="height: 100%">
    <nav-bar :title="title"></nav-bar>
    <div id="dash" class="main-page">
      <router-link to="/newUser"><menu-button :label="'Cadastrar'" :icon="'cross'"></menu-button></router-link>
      <router-link to="/users"><menu-button :label="'Usuários'" :icon="'user'"></menu-button></router-link>
      <router-link to="/chat"><menu-button :label="'Chat'" :icon="'chat'"></menu-button></router-link>
      <menu-button :label="'Como?'" :icon="'help'"></menu-button>
    </div>
  </div>
</template>

<script>
import NavBar from '@/components/NavBar.vue'
import MenuButton from '@/components/MenuButton.vue'
// import baseURL from '../http-constants'
export default {
  components: {
    NavBar, MenuButton
  },
  data () {
    return {
      title: 'Home'
    }
  }
}
</script>
