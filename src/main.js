import Vue from 'vue'
import App from './App'
import router from './router'

// 配置当前的开发模式是开发模式
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
