export default {
  data () {
    return {
      // 菜单是否被收起
      isCollapse: false,
      menus: [], // 菜单列表
      menuIcons: ['icon-users', 'icon-tijikongjian', 'icon-shangpin', 'icon-danju', 'icon-baobiao'] // 左侧菜单的图标数组
    }
  },
  created () {
    this.getMenus()
  },
  methods: {
    // 点击退出登录
    logout () {
      sessionStorage.removeItem('token')
      // 编程式导航
      this.$router.push('/login')
    },
    // 获取左侧菜单项
    async getMenus () {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error('请求菜单列表失败！')
      this.menus = res.data
      // console.log(res.data)
    }
  }
}
