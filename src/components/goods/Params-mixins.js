export default {
  data () {
    return {
      // 分类选择框中，的数据来源
      cateData: [],
      // 配置，分类选中框中，每个分类的配置选项
      propsOption: {
        label: 'cat_name', // 要展示名称
        value: 'cat_id', // 被选中时候的 值
        children: 'children' // 指定子分类
      },
      // 被选中的所有分类的 Id 值
      selectedCateList: [],
      // 当前被选中的 tab 栏的 name 名称；通过这个属性，可以控制哪个 tab 页签被选中了
      activeTabName: 'many',
      // 动态参数表格数据
      dynamicTableData: [],
      // 静态属性表格数据
      staticTableData: [],
      // 控制添加参数对话框是否展示
      addParamsDialogVisible: false,
      // 控制编辑参数对话框是否展示
      editParamsDialogVisible: false,
      // 添加 参数的表单数据对象
      addParamsForm: {
        attr_name: ''
      },
      // 添加参数的 表单验证对象
      addParamsFormRules: {
        attr_name: [{ required: true, message: '请输入参数名称', trigger: 'blur' }]
      },
      // 编辑参数信息的表单对象
      editParamsForm: {
        attr_id: '',
        attr_name: ''
      },
      // 编辑参数信息的表单 验证对象
      editParamsFormRules: {
        attr_name: [{ required: true, message: '请输入参数名称', trigger: 'blur' }]
      }
    }
  },
  created () {
    this.getCateList()
  },
  // 计算属性
  computed: {
    // 在定义的时候，计算属性是一个方法
    // 在页面上使用的时候，是当作属性来进行使用的
    isBtnDisabled () {
      // 按钮是否被禁用的属性
      if (this.selectedCateList.length === 3) return false
      return true
      // 注意：在计算属性中，最后一定要 return 一个值；
      // 否则就是一个无效的计算属性
    }
  },
  methods: {
    // 每当 选中的分类被修改，都会触发 此事件
    handleCateChanged () {
      // console.log(this.selectedCateList)
      // 判断 被选中的 Id 数组，长度是否为 3，如果是，则证明选中了第三级分类，否则，没有选中三级分类；
      // 如果没有选中三级分类，应该把 数组 重置为 空数组
      if (this.selectedCateList.length !== 3) {
        this.selectedCateList = []
        this.dynamicTableData = []
        this.staticTableData = []
        return
      }
      // 如果用户选中的是 三级分类，则直接获取 参数列表
      this.getParamsList()
    },
    // 获取分类列表
    async getCateList () {
      const { data: res } = await this.$http.get('categories', { params: { type: 3 } })
      if (res.meta.status !== 200) return this.$message.error('获取所有分类列表失败！')
      this.cateData = res.data
      // console.log(this.cateData)
    },
    handleTabClick () {
      // 每当 tab 栏页签切换的时候，都要重新获取一下 参数列表的数据
      // 1. 先判断 选中的分类，是否 长度为 3，如果不为 3，直接return
      if (this.selectedCateList.length !== 3) return
      // 获取参数列表的数据
      this.getParamsList()
    },
    // 获取参数列表
    async getParamsList () {
      const { data: res } = await this.$http.get(`categories/${this.selectedCateList[2]}/attributes`, { params: { sel: this.activeTabName } })
      if (res.meta.status !== 200) return this.$message.error('获取参数列表失败！')
      // 使用 forEach 循环，遍历每一个 参数信息对象，把 每个参数上的 attr_vals 进行字符串分割； 把 得到的数组，重新赋值给 当前这个参数的 attr_vals 属性；
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals.trim().length > 0 ? item.attr_vals.split(' ') : []
        // 默认不显示文本框
        item.inputVisible = false
        // 默认文本框中没有值
        item.inputValue = ''
      })
      // console.log(res.data)
      if (this.activeTabName === 'many') {
        // 动态参数
        this.dynamicTableData = res.data
      } else {
        // 静态参数
        this.staticTableData = res.data
      }
    },
    // 添加新参数
    addNewParams () {
      this.$refs.addParamsFormRef.validate(async valid => {
        if (!valid) return
        // 发起添加新参数的请求
        // console.log(this.addParamsForm.attr_name)
        // return
        const { data: res } = await this.$http.post(`categories/${this.selectedCateList[2]}/attributes`, {
          attr_name: this.addParamsForm.attr_name,
          attr_sel: this.activeTabName
        })
        if (res.meta.status !== 201) return this.$message.error('添加新参数失败！')
        this.$message.success('添加新参数成功！')
        this.getParamsList()
        this.addParamsDialogVisible = false
      })
    },
    // 重置添加参数的表单
    resetAddForm () {
      this.$refs.addParamsFormRef.resetFields()
    },
    // 重置 编辑 参数的表单
    resetEditForm () {
      this.$refs.editParamsFormRef.resetFields()
    },
    // 展示编辑的对话框
    async showEditDialog (scope) {
      // 先获取参数的信息
      const { data: res } = await this.$http.get(`categories/${this.selectedCateList[2]}/attributes/${scope.row.attr_id}`)
      if (res.meta.status !== 200) return this.$message.error('获取指定参数信息失败！')
      // 预先存储一下，要被编辑的那个参数的Id值
      this.editParamsForm.attr_id = scope.row.attr_id
      // 把 查询到的 参数的名称，赋值给 编辑表单
      this.editParamsForm.attr_name = res.data.attr_name
      this.editParamsDialogVisible = true
    },
    // 点击按钮 编辑参数
    editParams () {
      // 1. 验证表单
      this.$refs.editParamsFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put(`categories/${this.selectedCateList[2]}/attributes/${this.editParamsForm.attr_id}`, {
          attr_name: this.editParamsForm.attr_name,
          attr_sel: this.activeTabName
        })
        if (res.meta.status !== 200) return this.$message.error('保存参数信息失败！')
        this.$message.success('保存参数信息成功！')
        this.getParamsList()
        this.editParamsDialogVisible = false
      })
      // 2. 发起请求
    },
    // 根据Id删除分类下对应的参数
    async removeParams (scope) {
      // 提示用户是否删除
      const confirmResult = await this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
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

      const { data: res } = await this.$http.delete(`categories/${this.selectedCateList[2]}/attributes/${scope.row.attr_id}`)
      if (res.meta.status !== 200) return this.$message.error('删除商品分类下的参数失败！')
      this.$message.success('删除参数成功！')
      // 重新获取参数列表
      this.getParamsList()
    },
    // 点击Tag标签上的关闭按钮，触发此事件
    async tagClosed (scope, i) {
      // console.log(i)
      // 1. 把 要删除的哪一项，从 数组中splice掉
      scope.row.attr_vals.splice(i, 1)
      // 2. 把 处理完毕的 attr_vals 数组，重新使用 空格 进行 join, 得到一个新的字符串
      const newStr = scope.row.attr_vals.join(' ')
      // console.log(newStr)
      // 3. 把 最新的 字符串，保存到 服务器对应 的 attr_vals 中即可
      const { data: res } = await this.$http.put(`categories/${this.selectedCateList[2]}/attributes/${scope.row.attr_id}`, {
        attr_name: scope.row.attr_name,
        attr_sel: this.activeTabName,
        attr_vals: newStr
      })
      if (res.meta.status !== 200) return this.$message.error('删除失败！')
      this.$message.success('删除成功！')
    },
    // 每当 文本框 失去焦点，或 触发了 enter 键，都会执行此函数
    // 在这个函数中，应该进行 添加 新 tag 的业务逻辑
    async handleInputConfirm (scope) {
      scope.row.inputVisible = false
      if (scope.row.inputValue.trim().length <= 0) return (scope.row.inputValue = '')
      // console.log('添加数据')
      // 走添加数据的业务逻辑
      // 把当前文本框中的值，push 到 数组中
      scope.row.attr_vals.push(scope.row.inputValue.trim())
      // 清空文本框中的数据，防止 下一次 添加的时候，看到上一次遗留的数据
      scope.row.inputValue = ''
      const { data: res } = await this.$http.put(`categories/${this.selectedCateList[2]}/attributes/${scope.row.attr_id}`, {
        attr_name: scope.row.attr_name,
        attr_sel: this.activeTabName,
        attr_vals: scope.row.attr_vals.join(' ')
      })
      if (res.meta.status !== 200) return this.$message.error('添加失败！')
      this.$message.success('添加成功！')
    },
    // 点击 按钮，显示 文本输入框
    showInput (scope) {
      scope.row.inputVisible = true
      // 当页面 根据最新的数据更新完毕以后，才调用 $nextTick 中所指定的 回调函数
      // 好处：保证 在 $nextTick 回调函数中的操作，能够操作到 页面上 最新的 DOM 元素；
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    }
  }
}
