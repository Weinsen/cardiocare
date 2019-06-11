<template>
  <div style="height: 100%">
    <NavBar :title="title" :imgLink="image"></NavBar>
    <div id="dash">
      <form @submit.prevent="checkForm">
        <p>
          <label>Nome de Usuário</label>
          <input type="text" v-model="user.name">
        </p>
        <p>
          <label>MAC de Dispositivo</label>
          <input type="text" v-model="user.mac">
        </p>
        <p>
          <label>Data de Nascimento</label>
          <input type="date" v-model="user.date">
        </p>
        <p>
          <label>Biografia</label>
          <textarea rows="5" type="text" v-model="user.bio"></textarea>
        </p>
        <p>
          <button type="submit">Submit</button>
        </p>
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
      }).then(response => {
        console.log(response)
        if (response.status === 200) {
          this.user.name = ''
          this.user.bio = ''
          this.user.date = ''
          this.user.mac = ''
        }
      })
    }
  }
}
</script>

<style scoped>

  #dash {
    display: flex;
    align-items: flex-start;
    justify-content: center;
  }

  form {
    display: table;
    width: 50%;
    max-width: 800px;
    flex: 1;
    /*background-color: rgba(255, 255, 255, 0.2);*/
  }

  p {
    width: 100%;
    /*display: flex;*/
    word-break: none;
  }

  label {
    padding: 12px 12px 12px 0;
    display: inline-block;
    font-weight: bold;
  }

  input, select, textarea {
    box-sizing: border-box;
    width: 100%;
    padding: 12px;
    border: 1px solid #ccc;
    border-radius: 4px;
    background-color: rgba(250, 250, 250, 1);
    /*resize: vertical;*/
  }

  button {
    margin-top: 10px;
    background-color: #4CAF50;
    color: white;
    width: 100%;
    padding: 12px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    float: right;
  }

  @media screen and (max-width: 900px) {
    form {
      width: 90%;
    }
  }

</style>
