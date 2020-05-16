import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import './vant'
import './utils/initRem'
import { i18n, vantLocales } from './lang/index'
vantLocales(i18n.locale)
Vue.prototype.$vantLocales = vantLocales

import fastclick from 'fastclick'
fastclick.attach(document.body)

import '@/assets/style/index.scss'

Vue.config.productionTip = false

new Vue({
  i18n,
  router,
  store,
  render: h => h(App)
}).$mount('#app')
