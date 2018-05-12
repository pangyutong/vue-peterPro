export default {
  data () {
    return {
      // 角色列表
      rolesList: []
    }
  },
  created () {
    this.getRolesList()
  },
  methods: {
    // 获取角色列表
    async getRolesList () {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) return this.$message.error('获取角色列表失败！')
      this.rolesList = res.data
    },
    // 点击 tag 标签， 移除 角色下的 指定权限
    async removeTag (scope, rightsId) {
      // 1. 弹框提示用户是否删除
      const confirmResult = await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)

      // 2. 用户取消了删除
      if (confirmResult !== 'confirm') {
        return this.$message({
          type: 'info',
          message: '已取消删除'
        })
      }

      // 3. 执行删除的逻辑
      const { data: res } = await this.$http.delete(`roles/${scope.row.id}/rights/${rightsId}`)
      if (res.meta.status !== 200) return this.$message.error('删除权限失败！')
      this.$message.success('删除权限成功！')
      // console.log(res)
      // 把 服务器返回的最新的权限，赋值给 页面上，当前这一行 的 children 属性
      scope.row.children = res.data
    }
  }
}
