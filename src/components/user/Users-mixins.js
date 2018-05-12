export default {
  data () {
    return {
      // 搜索关键字
      keywords: '',
      // 当前页码值
      nowPage: 1,
      // 每页显示几条数据
      pageSize: 2,
      // 总记录条数
      total: 0,
      userlist: [], // 用户列表数据
      // 控制 添加用户 对话框的显示和隐藏
      addUserDialogVisible: false,
      // 控制 编辑用户对话框的显示和隐藏
      editUserDialogVisible: false,
      // 控制 分配角色 对话框的显示和隐藏
      setRoleDialogVisible: false,
      // 添加用户的表单对象
      addUserForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 添加用户表单的验证规则
      addUserFormRules: {
        username: [{ required: true, message: '请输入用户名称', trigger: 'blur' }, { min: 3, max: 6, message: '长度在 3 到 6 个字符', trigger: 'blur' }],
        password: [{ required: true, message: '请输入登录密码', trigger: 'blur' }, { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }],
        email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }],
        mobile: [{ required: true, message: '请输入电话', trigger: 'blur' }]
      },
      // 编辑用户的表单
      editUserForm: {
        id: -1,
        username: '',
        email: '',
        mobile: ''
      },
      // 编辑表单的验证规则
      editUserFormRules: {
        email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }],
        mobile: [{ required: true, message: '请输入电话', trigger: 'blur' }]
      },
      // 分配权限的表单数据
      setRoleForm: {
        newRoleId: '' // 用户新角色的 Id
      },
      // 所有角色的列表
      roles: []
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
      // 重新为总记录条数赋值
      this.total = res.data.total
    },
    // 每当 用户的状态被修改以后，触发这个回调
    async stageChanged (row) {
      // console.log(row.id + ' ---' + row.mg_state)
      const { data: res } = await this.$http.put(`users/${row.id}/state/${row.mg_state}`)
      if (res.meta.status !== 200) return this.$message.error('修改状态失败！')
      this.$message.success('修改状态成功！')
    },
    // 当 pageSize 改变的时候触发此事件
    handleSizeChange (newSize) {
      // 把最新的pageSize,赋值到 当前的 data 中
      this.pageSize = newSize
      this.getUserList()
    },
    // 当页码值改变的时候，触发此事件
    handleCurrentChange (newPage) {
      // 把最新的页码值，赋值到 data 中
      this.nowPage = newPage
      this.getUserList()
    },
    // 监听 添加对话框的关闭事件，并重置添加的表单
    resetAddForm () {
      this.$refs.addUserFormRef.resetFields()
    },
    // 点击按钮添加 新用户
    addUser () {
      // 1. 要验证表单是否合法
      // 2. 如果合法，发起请求，添加用户
      // 3. 如果添加成功，则重新刷新列表
      this.$refs.addUserFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('users', this.addUserForm)
        if (res.meta.status !== 201) return this.$message.error('添加用户失败！')
        this.$message.success('添加用户成功！')
        this.getUserList()
        // 隐藏对话框
        this.addUserDialogVisible = false
      })
    },
    // 删除用户
    async removeUser (scope) {
      // 提示是否删除
      const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)

      // 用户取消了删除
      if (confirmResult !== 'confirm') {
        return this.$message({
          type: 'info',
          message: '已取消删除'
        })
      }

      // 发起请求删除用户
      const { data: res } = await this.$http.delete('users/' + scope.row.id)
      if (res.meta.status !== 200) return this.$message.error('删除失败！')
      this.$message.success('删除成功！')
      this.getUserList()
    },
    // 重置 编辑的表单
    resetEditForm () {
      // 重置编辑的表单
      this.$refs.editUserFormRef.resetFields()
    },
    // 点击按钮 保存用户信息
    editUser () {
      // 验证表单
      this.$refs.editUserFormRef.validate(async valid => {
        if (!valid) return
        // 发起请求
        const { data: res } = await this.$http.put('users/' + this.editUserForm.id, {
          email: this.editUserForm.email,
          mobile: this.editUserForm.mobile
        })
        // 判断是否 提交成功
        if (res.meta.status !== 200) return this.$message.error('编辑用户信息失败！')
        this.$message.success('编辑用户信息成功！')
        this.getUserList()
        this.editUserDialogVisible = false
      })
    },
    // 点击编辑按钮，展示编辑对话框
    async showEditDialog (scope) {
      this.editUserDialogVisible = true
      // 根据 Id 查询用户最新的数据
      const { data: res } = await this.$http.get('users/' + scope.row.id)
      this.editUserForm.username = res.data.username
      this.editUserForm.email = res.data.email
      this.editUserForm.mobile = res.data.mobile
      // 把 Id 存储到 表单中，从而方便 保存
      this.editUserForm.id = scope.row.id
    },
    // 展示 分配角色的对话框
    async showSetRoleDialog (scope) {
      // 获取用户Id
      const id = scope.row.id
      // 查询用户信息
      const { data: res } = await this.$http.get('users/' + id)
      if (res.meta.status !== 200) return this.$message.error('获取用户信息失败！')
      // 当获取用户信息成功；显示 对话框
      this.setRoleDialogVisible = true
      // 注意：根据Id从服务器获取回来的数据中，不包含 用户当前的角色名称；
      // this.setRoleForm = res.data
      // console.log(this.setRoleForm)
      this.setRoleForm.id = res.data.id
      this.setRoleForm.username = res.data.username
      // 从 scope 上获取 用户当前的角色名称
      this.setRoleForm.role_name = scope.row.role_name

      // 调用接口，获取所有角色的名称
      const { data: roles } = await this.$http.get('roles')
      if (roles.meta.status !== 200) return this.$message.error('获取角色列表失败！')
      this.roles = roles.data
    },
    async setNewRole () {
      const { data: res } = await this.$http.put(`users/${this.setRoleForm.id}/role`, { rid: this.setRoleForm.newRoleId })
      if (res.meta.status !== 200) return this.$message.error('分配权限失败！')
      this.$message.success('分配权限成功！')
      this.getUserList()
      this.setRoleDialogVisible = false
    }
  }
}
