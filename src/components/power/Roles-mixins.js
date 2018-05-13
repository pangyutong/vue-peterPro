export default {
  data () {
    return {
      // 角色列表
      rolesList: [],
      // 控制 分配权限对话框的显示和隐藏
      setRoleDialogVisible: false,
      // 控制添加角色对话框的显示与隐藏
      addRolesDialogVisible: false,
      // 控制 编辑角色对话框的显示和隐藏
      editRolesDialogVisible: false,
      // 权限树形结构的数据
      treeData: [],
      treeProps: {
        label: 'authName', // 指定 tree 中每个节点 展示的名称 所对应的属性
        children: 'children' // 指定了 树形结构中，使用 哪个属性进行嵌套
      },
      // 默认被勾选的 树形节点
      defaultCheckedKeys: [],
      // 被选中的 角色的Id
      selectedRoleId: '',
      addRolesForm: {
        roleName: '',
        roleDesc: ''
      },
      editRolesForm: {
        id: -1,
        roleName: '',
        roleDesc: ''
      },
      addRolesFormRules: {
        rolesname: [{ required: true, message: '请输入角色名称', trigger: 'blur' }, { min: 3, max: 6, message: '长度在 3 到 6 个字符', trigger: 'blur' }],
        describe: [{ required: true, message: '请输入角色描述', trigger: 'blur' }, { max: 50, message: '长度在 50 个字符以内', trigger: 'blur' }]
      },
      // 编辑表单的验证规则
      editRolesFormRules: {
        rolesname: [{ required: true, message: '请输入角色名称', trigger: 'blur' }, { min: 3, max: 6, message: '长度在 3 到 6 个字符', trigger: 'blur' }],
        describe: [{ required: true, message: '请输入角色描述', trigger: 'blur' }, { max: 50, message: '长度在 50 个字符以内', trigger: 'blur' }]
      }
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
    },
    // 点击按钮，展示 分配权限的对话框
    async showSetRoleDialog (scope) {
      // 把 角色的Id，保存到 data 中
      this.selectedRoleId = scope.row.id
      // 获取权限的树形结构的数据
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) return this.$message.error('获取权限列表失败！')
      this.treeData = res.data

      // console.log(scope.row)
      this.getLeafKeys(scope.row, this.defaultCheckedKeys)
      // console.log(this.defaultCheckedKeys)

      this.setRoleDialogVisible = true
    },
    // 递归获取所有三级权限的Id
    getLeafKeys (node, keys) {
      if (!node.children) {
        keys.push(node.id)
      } else {
        node.children.forEach(item => this.getLeafKeys(item, keys))
      }
    },
    // 分配权限对话框关闭的事件
    setRoleDialogClosed () {
      // 清空 树形结构的数据
      this.treeData = []
      // 清空默认选中项
      this.defaultCheckedKeys = []
    },
    // 点击按钮，保存权限
    async saveRights () {
      // 1. 获取 所有 被 勾选的 权限Id
      // 2. 获取所有 被 半选的 权限Id
      const k1 = this.$refs.tree.getCheckedKeys()
      const k2 = this.$refs.tree.getHalfCheckedKeys()
      // ES6 的展开运算符
      const keys = [...k1, ...k2]
      const { data: res } = await this.$http.post(`roles/${this.selectedRoleId}/rights`, {
        rids: keys.join(',')
      })
      if (res.meta.status !== 200) return this.$message.error('分配权限失败！')
      this.$message.success('分配权限成功！')
      this.setRoleDialogVisible = false
      this.getRolesList()
    },
    // 重置添加表单
    resetAddForm () {
      this.$refs.addRolesFormRef.resetFields()
    },
    // 重置编辑表单
    resetEditForm () {
      this.$refs.editRolesFormRef.resetFields()
    },
    // 添加角色
    addRoles () {
      // 1. 要验证表单是否合法
      // 2. 如果合法，发起请求，添加角色
      // 3. 如果添加成功，则重新刷新列表
      this.$refs.addRolesFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('roles', this.addRolesForm)
        if (res.meta.status !== 201) return this.$message.error('添加角色失败！')
        this.$message.success('添加角色成功！')
        this.getRolesList()
        // 隐藏对话框
        this.addRolesDialogVisible = false
      })
    },
    // 删除角色
    async removeRoles (scope) {
      // 提示是否删除
      const confirmResult = await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
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

      // 发起请求删除角色
      const { data: res } = await this.$http.delete('roles/' + scope.row.id)
      if (res.meta.status !== 200) return this.$message.error('删除失败！')
      this.$message.success('删除成功！')
      this.getRolesList()
    },
    // 编辑角色
    editRoles () {
      // 验证表单
      this.$refs.editRolesFormRef.validate(async valid => {
        if (!valid) return
        // 发起请求
        const { data: res } = await this.$http.put('roles/' + this.editRolesForm.id, {
          roleName: this.editRolesForm.roleName,
          roleDesc: this.editRolesForm.roleDesc
        })
        // 判断是否 提交成功
        if (res.meta.status !== 200) return this.$message.error('编辑角色信息失败！')
        this.$message.success('编辑角色信息成功！')
        this.getRolesList()
        this.editRolesDialogVisible = false
      })
    },
    // 点击编辑按钮，展示编辑对话框
    async showEditDialog (scope) {
      this.editRolesDialogVisible = true
      // 根据 Id 查询用户最新的数据
      const { data: res } = await this.$http.get('roles/' + scope.row.id)
      this.editRolesForm.roleName = res.data.roleName
      this.editRolesForm.roleDesc = res.data.roleDesc
      // 把 Id 存储到 表单中，从而方便 保存
      this.editRolesForm.id = scope.row.id
    }
  }
}
