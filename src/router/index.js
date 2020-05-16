import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/recommend'
  },
  {
    path: '/recommend',
    component: () => import('../views/recommend/index.vue'),
    meta:{keepAlive:true}
  },
  {
    path: '/singer',
    component: () => import('../views/singer/index.vue')
  },
  {
    path: '/rank',
    component: () => import('../views/rank/index.vue')
  },
  {
    path: '/search',
    component: () => import('../views/search/index.vue')
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
