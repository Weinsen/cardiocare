import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'
import User from '@/components/User.vue'
import Users from '@/components/Users.vue'
import Home from '@/components/Home.vue'
import Chat from '@/components/Chat.vue'
import UserInfo from '@/components/UserInfo.vue'
import Chart from '@/components/Chart.vue'
import NewUser from '@/components/NewUser.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/chart',
      name: 'Chart',
      component: Chart
    },
    {
      path: '/users',
      name: 'Users',
      component: Users
    },
    {
      path: '/newUser',
      name: 'NewUser',
      component: NewUser
    },
    {
      path: '/chat',
      name: 'Chat',
      component: Chat
    },
    {
      path: '/user',
      name: 'User',
      component: User,
      children: [
        {
          path: ':id',
          name: 'Info',
          component: UserInfo
        }
      ]
    }
  ]
})
