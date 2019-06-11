<template>
  <div style="height: 100%">
    <NavBar :title="title" :imgLink="image"></NavBar>
    <div id="dash">
      <router-view/>
    </div>
  </div>
</template>

<script>
import baseURL from '../http-constants'
import NavBar from '@/components/NavBar.vue'
export default {
  components: {
    NavBar
  },
  data () {
    return {
      title: 'Perfil de Usuário',
      image: baseURL + '/getImage/user.png'
    }
  }
}
</script>
