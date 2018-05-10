import Vue from 'vue'
import Router from 'vue-router'
// @ 代表一个绝对路径，就是 项目根目录中 的 src 这一层目录
import Login from '@/components/Login'
// 导入后台的Home主页
import Home from '@/components/Home'
// 导入欢迎的组件
import Welcome from '@/components/Welcome'
// 导入用户列表组件
import Users from '@/components/user/Users'

Vue.use(Router)

export default new Router({
  routes: [
    {
      // 如果访问的是 / 根路径，则 重定向到 /login 登录页面
      path: '/',
      redirect: '/login'
    },
    {
      // 登录页面的路由规则
      path: '/login',
      component: Login
    },
    {
      path: '/home',
      component: Home,
      redirect: '/welcome', // 每当用户来访问 /home 的时候，除了要展示 一个 Home 组件，还要重定向到 /welcome 中，从而，在 Home 组件的右侧，展示一个 欢迎的子组件
      children: [
        // 注意：只要是 children 属性，匹配到的 子路由，这些即将要展示的子路由对应的组件，必须替换到 父组件的 router-view 中
        // 子路由，今后，所有的功能页面，都放到了 Home 的子路由中进行展示
        { path: '/welcome', component: Welcome },
        { path: '/users', component: Users }
      ]
    }
  ]
})
