export default {
  data () {
    return {
      // 搜索关键字
      keywords: '',
      // 当前页码值
      nowPage: 1,
      // 每页显示几条数据
      pageSize: 2,
      userlist: [] // 用户列表数据
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    // 获取用户列表
    async getUserList () {
      // 发起请求获取 用户列表数据
      const { data: res } = await this.$http.get('users', { params: { query: this.keywords, pagenum: this.nowPage, pagesize: this.pageSize } })
      // 获取数据失败
      if (res.meta.status !== 200) return this.$message.error('获取用户列表失败！')
      this.userlist = res.data.users
      console.log(this.userlist)
    },
    // 每当 用户的状态被修改以后，触发这个回调
    async stageChanged (row) {
      // console.log(row.id + ' ---' + row.mg_state)
      const { data: res } = await this.$http.put(`users/${row.id}/state/${row.mg_state}`)
      if (res.meta.status !== 200) return this.$message.error('修改状态失败！')
      this.$message.success('修改状态成功！')
    }
  }
}
