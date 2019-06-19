<template>
  <div style="height: 100%">
    <NavBar :title="title" :imgLink="image"></NavBar>
    <div id="dash" style="display: flex; flex-direction: column;">

      <!-- Intro -->
      <div class="slide">
        <img class="ilust" src="../assets/wifi_heart2.svg" id="cardiologo">
        <div class="text"><h1>Cardiocare</h1></div>
      </div>
      <div class="slide">
        <p>Plataforma de monitoramento de sinais vitais e integração com dashboard.</p>
      </div>
      <div class="slide">
        <img class="ilust" src="../assets/slides/user.svg">
        <p>O usuário previamente cadastrado utiliza um conjunto de sensores conectados a um rádio 802.15.4, que transmite os dados adquiridos ao sistema.</p>
      </div>
      <div class="slide">
        <img class="ilust" src="../assets/slides/gateway.svg">
        <p>O gateway é responsável por receber os pacotes locais vindos pela rede 802.15.4 e transmití-los via MQTT para o broker central.</p>
      </div>
      <div class="slide">
        <img class="ilust" src="../assets/slides/broker.svg">
      </div>
      <div class="slide">
        <img class="ilust" src="../assets/slides/back.svg">
      </div>
      <div class="slide">
        <img class="ilust" src="../assets/slides/front.svg">
      </div>
      <div class="slide">
        <img class="ilust" src="../assets/slides/github.svg">
      </div>
    </div>
  </div>
</template>

<script>
import NavBar from '@/components/NavBar.vue'
export default {
  components: {
    NavBar
  },
  data () {
    return {
      title: 'Como funciona?',
      image: null
    }
  }
}
</script>

<style scoped>

  p {
    text-align: center;
    /*text-shadow: 1px 1px rgba(0, 0, 0, 0.2);*/
    font-weight: bold;
  }

  .slide {
    min-height: 80vh;
    border: 1px #888888 solid ;
    margin: 20px;
    background-color: white;
    box-shadow: 5px 10px #888888;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    padding: 2vh;
  }

  .ilust {
    max-height: 40%;
    width: 100%;
    flex: 1 0 column;
  }

  .text {
    text-align: center;
    width: 100%;
    flex: 1 0 column;
  }

  #cardiologo {
    animation: heartbeat 1s infinite;
    animation-timing-function: ease-in-out;
  }

  ::-webkit-scrollbar {
    width: 10px;
  }

  ::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  ::-webkit-scrollbar-thumb {
    background: #888;
    height: 10px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #555;
  }

  @media (orientation: portrait) {
    .ilust {
      max-height: 50vw;
    }
  }

  @keyframes heartbeat {
    0%   {opacity: 1.00; transform: rotate(0deg);}
    45%  {opacity: 0.70; transform: rotate(3deg);}
    60%  {opacity: 1.00; transform: rotate(0deg);}
    75%  {opacity: 0.70; transform: rotate(-3deg);}
    100% {opacity: 1.00; transform: rotate(0deg);}
  }

</style>
