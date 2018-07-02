import Vue from 'vue'
import Vuetify from 'vuetify'
import App from './App.vue'
import VueLogger from 'vuejs-logger'
import store from './store/store'
import VuejsDialog from 'vuejs-dialog'
import 'vuetify/dist/vuetify.min.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'


Vue.config.productionTip = true
Vue.use(Vuetify)
Vue.use(VuejsDialog)



const options = {
  logLevel : 'debug',
  // optional : defaults to false if not specified
  stringifyArguments : false,
  // optional : defaults to false if not specified
  showLogLevel : false
}

Vue.use(VueLogger,options)



new Vue({
  store,
  render: h => h(App)
}).$mount('#app')
