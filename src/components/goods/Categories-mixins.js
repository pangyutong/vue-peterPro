export default {
  data () {
    return {
      type: 3, // 获取3级分类嵌套关系
      pagenum: 1, // 当前页码值
      pagesize: 5, // 每页显示多少条数据
      total: 0, // 总记录条数
      treeData: [], // 树形结构的数据
      columns: [
        // tree-grid 中每一列的配置数组
        {
          label: '分类名称',
          prop: 'cat_name',
          width: '200px'
        },
        {
          label: '是否有效',
          prop: 'cat_deleted',
          width: '200px',
          // 指定这一列使用 模板进行渲染
          type: 'template',
          // 指定要使用哪个模板
          template: 'isok'
        },
        {
          label: '排序',
          prop: 'cat_level',
          width: '200px'
        },
        {
          label: '操作',
          width: '200px',
          type: 'template',
          template: 'btns'
        }
      ],
      // 控制添加分类对话框的显示和隐藏
      addCateDialogVisible: false,
      // 添加分类的表单
      addCateForm: {
        // 父分类的Id
        cat_pid: '',
        // 分类的名称
        cat_name: '',
        // 当前要添加的分类的等级
        cat_level: ''
      },
      // 添加分类的校验规则对象
      addCateFormRules: {
        cat_name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }]
      },
      // 所有分类的列表
      cateList: [],
      // 配置级联选择框中，每个 Item 项的 属性对应关系
      itemOption: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      // 存储已选的付分类的Id
      selectedCategoriesList: [],
      // 控制 编辑分类的对话框显示或隐藏
      editCateDialogVisible: false,
      // 编辑分类的表单
      editCateForm: {},
      editCateFormRules: {
        cat_name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }]
      }
    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    // 获取商品分类列表
    async getCateList () {
      const { data: res } = await this.$http.get('categories', {
        params: {
          type: this.type,
          pagenum: this.pagenum,
          pagesize: this.pagesize
        }
      })
      if (res.meta.status !== 200) return this.$message.error('获取分类数据失败！')
      // 为表格数据赋值
      this.treeData = res.data.result
      // 保存总记录条数
      this.total = res.data.total
      // console.log(res)
    },
    // 监听页码值改变的事件
    handlePageChanged (newPage) {
      this.pagenum = newPage
      this.getCateList()
    },
    // 展示添加分类的对话框
    async showAddCateDialog () {
      // 获取所有前两级分类
      const { data: res } = await this.$http.get('categories', {
        params: {
          type: 2 // 获取前两级分类
        }
      })
      if (res.meta.status !== 200) return this.$message.error('获取分类失败！')
      this.cateList = res.data
      // console.log(res.data)
      this.addCateDialogVisible = true
    },
    cateChanged () {
      console.log(this.selectedCategoriesList)
    },
    // 重置表单
    resetAddCateForm () {
      this.$refs.addCateFormRef.resetFields()
      this.selectedCategoriesList = []
    },
    // 点击按钮添加新分类
    addNewCate () {
      // 默认，认为用户要添加一个 1 级分类
      let PID = 0
      // 默认，认为用户添加的当前分类的 等级 1 级分类
      let LV = 0

      // 用户选择的父分类
      if (this.selectedCategoriesList.length !== 0) {
        // 把 数组的最后一项Id值，作为 父分类的Id
        PID = this.selectedCategoriesList[this.selectedCategoriesList.length - 1]
        // 当前分类的等级，就是 数组的长度
        LV = this.selectedCategoriesList.length
      }

      // 添加新分类
      this.$refs.addCateFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('categories', {
          cat_pid: PID,
          cat_name: this.addCateForm.cat_name,
          cat_level: LV
        })

        if (res.meta.status !== 201) return this.$message.error('添加分类失败！')
        this.$message.success('添加分类成功！')
        this.getCateList()
        this.addCateDialogVisible = false
      })
    },
    // 点击编辑按钮，展示编辑分类的对话框
    async showEditCateDialog (scope) {
      const { data: res } = await this.$http.get('categories/' + scope.row.cat_id)
      if (res.meta.status !== 200) return this.$message.error('获取分类信息失败！')
      // console.log(res.data)
      // 把查询到的数据，保存到 data 上
      this.editCateForm = res.data
      this.editCateDialogVisible = true
    },
    // 重置 编辑表单
    resetEditForm () {
      this.$refs.editCateFormRef.resetFields()
    },
    // 点击按钮，保存被编辑的 分类信息
    saveCate () {
      this.$refs.editCateFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put('categories/' + this.editCateForm.cat_id, {
          cat_name: this.editCateForm.cat_name
        })
        if (res.meta.status !== 200) return this.$message.error('编辑分类失败！')
        this.$message.success('编辑分类成功！')
        this.getCateList()
        this.editCateDialogVisible = false
      })
    },
    // 根据ID删除对应的分类信息
    async removeCate (scope) {
      // 提示是否删除
      const confirmResult = await this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
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

      // 执行删除的业务逻辑
      const { data: res } = await this.$http.delete('categories/' + scope.row.cat_id)
      if (res.meta.status !== 200) return this.$message.error('删除分类失败！')
      this.$message.success('删除分类成功！')
      this.getCateList()
    }
  }
}
