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
        <h1>Rádio-sensor</h1>
        <p>O usuário é cadastrado à plataforma e recebe um dispositivo portátil para medição de sinais vitais, como temperatura e batimentos cardíacos.</p>
      </div>
      <div class="slide">
        <div style="max-height: 30%; width: 100%; display: flex; justify-content: space-around;">
          <img class="ilust-multi" src="../assets/slides/user.svg">
          <img class="ilust-multi" src="../assets/slides/gateway.svg">
        </div>
        <h1>Transmissão</h1>
        <p>A transmissão é feita entre o rádio-sensor e gateways por canais 802.15.4. Cada rádio possui um endereço MAC único, evitando assim colisão entre sensores.</p>
      </div>
      <div class="slide">
        <img class="ilust" src="../assets/slides/gateway.svg">
        <h1>Gateway</h1>
        <p>O gateway é responsável por receber os pacotes locais vindos pela rede 802.15.4 e transmití-los via MQTT para o broker central. Ele também permite que comandos vindos da central sejam repassados corretamente ao dispostivo desejado.<br><br>Este equipamento é composto por um CC1350 em conjunção a um dispositivo com Linux.</p>
      </div>
      <div class="slide">
        <div style="max-height: 30%; width: 100%; display: flex; justify-content: space-around;">
          <img class="ilust-multi" src="../assets/slides/broker.svg">
          <img class="ilust-multi" src="../assets/slides/back.svg">
          <img class="ilust-multi" src="../assets/slides/front.svg">
        </div>
        <h1>Central</h1>
        <p>A central é composta por três serviços distintos:<br><br>MQTT Broker<br>Backend<br>Frontend</p>
      </div>
      <div class="slide">
        <img class="ilust" src="../assets/slides/broker.svg">
        <h1>MQTT Broker</h1>
        <p>O broker é responsável por gerenciar os pacotes e clientes MQTT.<br><br>Tanto os gateways quanto o backend publicam e se inscrevem em tópicos através deste serviço.</p>
      </div>
      <div class="slide">
        <img class="ilust" src="../assets/slides/back.svg">
        <h1>Backend</h1>
        <p>Escrito em NodeJS, o servidor backend centraliza o tráfego de informações tanto do frontend, quanto do broker. Através desta dinâmica é possível integrar ao sistema mensagens baseadas tanto em MQTT e HTTP. <br><br> Este serviço também é responsável pelo acesso e manutenção do banco de dados, fornecendo ao sistema informações específicas de cada cliente.</p>
      </div>
      <div class="slide">
        <img class="ilust" src="../assets/slides/front.svg">
        <h1>Frontend</h1>
        <p>Também escrito em Javascript, através de pacotes VueJS. É responsável pela renderização da interface no navegador do usuário, atualizando gráficos e informações recebidas do backend.</p>
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
    width: 70%;
  }

  h1 {
    text-align: center;
    width: 100%;
    margin-top: 1.5em;
    margin-bottom: 1.5em;
  }

  .slide {
    min-height: 80vh;
    border: 1px #888888 solid ;
    margin: 20px;
    background-color: white;
    box-shadow: 5px 10px #888888;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    padding: 2vh;
  }

  .ilust {
    max-height: 40%;
    width: 100%;
    flex: 1 0 auto;
  }

  .ilust-multi {
    flex: 1 0 auto;
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
      max-height: 27vw;
    }

    .ilust-multi {
      max-height: 15vw;
    }

    p {
      width: 90%;
      font-size: 0.8em;
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
