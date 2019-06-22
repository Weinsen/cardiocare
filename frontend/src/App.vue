<template>
  <div id="app">
    <!-- <img src="./assets/wifi_heart2.svg"> -->
    <router-view/>

    <notifications group="foo"
                   position="top left"
                   :speed="500" />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>

  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-image: './assets/wifi_heart2.svg';
    text-align: center;
    background-color: red;
    color: #FF3e50;
    height: 100vh;
    width: 100vw;
  }

</style>
