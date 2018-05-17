import Vue from 'vue'
import App from './App'
// 如果要加载 某个目录中的 index.js 文件，则 可以省略 index.js 这个后缀名；
import router from './router'
// 导入 axios 发起Ajax请求
import axios from 'axios'
// 导入 树形表格 组件
import TreeGrid from 'vue-table-with-tree-grid'

// 导入全局样式表
import './assets/css/global.css'
// 导入字体图标库
import './assets/fonts/iconfont.css'

// 导入和安装 ElementUI 组件库
import ElementUI from 'element-ui'
Vue.use(ElementUI)

// 把 树形表格，注册为全局的组件
Vue.component('tree-grid', TreeGrid)

// 添加路由导航守卫，只有登录的情况，才允许访问有权限的页面；否则，跳转到登录
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  // 获取令牌
  const token = sessionStorage.getItem('token')
  if (!token) return next('/login')
  next()
})

// 把 axios 挂载 到 Vue 上
// 配置 baseURL 地址
// 云端链接和本地链接
// axios.defaults.baseURL = 'http://www.liulongbin.top:8888/api/private/v1/'
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
Vue.prototype.$http = axios
// 在每次请求的请求头中，添加 token 令牌
axios.interceptors.request.use(
  function (config) {
    // 获取 令牌
    const token = sessionStorage.getItem('token')
    // 把 令牌，添加到每次 Ajax 的请求头中
    config.headers.Authorization = token
    return config
  },
  function (error) {
    return Promise.reject(error)
  }
)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
