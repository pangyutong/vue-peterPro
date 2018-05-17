export default {
  data () {
    return {
      // 被激活的 标签页的名称
      activeTabName: '0',
      // 添加 商品的表单对象
      AddForm: {
        // 商品名称
        goods_name: '',
        // 选中的商品分类
        goods_cat: [],
        // 商品价格
        goods_price: '',
        // 商品数量
        goods_number: '',
        // 商品重量
        goods_weight: '',
        // 商品的描述
        goods_introduce: '',
        // 商品的图片
        pics: [],
        // 商品的属性，包含了动态参数 和 静态参数
        attrs: []
      },
      // 添加商品的表单验证对象
      AddFormRules: {
        goods_name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
        goods_price: [{ required: true, message: '请输入商品价格', trigger: 'blur' }],
        goods_weight: [{ required: true, message: '请输入商品重量', trigger: 'blur' }],
        goods_number: [{ required: true, message: '请输入商品数量', trigger: 'blur' }],
        goods_cat: [{ required: true, message: '请选中商品分类', trigger: 'blur' }]
      },
      // 所有商品的分类数据
      cateList: [],
      // 分类选择框中每条数据的配置对象
      catePropsOption: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      // 动态参数的数组
      dymanicParams: [],
      // 静态属性的数组
      staticParams: [],
      // 上传图片时候的请求头
      uploadHeaders: {
        // 注意：必须这么写
        Authorization: sessionStorage.getItem('token')
      },
      // 默认不展示 预览图片的对话框
      previewDialogVisible: false,
      // 预览图片的地址
      previewImgURL: ''
    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    // 获取所有分类的列表数据
    async getCateList () {
      const { data: res } = await this.$http.get('categories', {
        params: {
          type: 3
        }
      })
      if (res.meta.status !== 200) return this.$message.error('获取所有商品分类失败！')
      this.cateList = res.data
    },
    // 每当分类 选中项改变，触发 此函数
    handleCateChanged () {
      if (this.AddForm.goods_cat.length !== 3) {
        return (this.AddForm.goods_cat = [])
      }
    },
    // 监听 tab 栏 页签的点击事件
    async handleTabClick () {
      // 在点击事件中，获取到 当前被选中的 面板的 name 名称   this.activeTabName
      // console.log(this.activeTabName)
      // 如果 当前激活的 tab 页签的名称等于 1 或 2，表示用户进入了 商品参数 或商品属性 面板
      if (this.activeTabName === '1' || this.activeTabName === '2') {
        // 如果没有选中商品分类，则直接提示用户，需要选择一下
        if (this.AddForm.goods_cat.length !== 3) return this.$message.error('请选择商品分类！')
        // 获取 动态参数 或 静态属性
        const { data: res } = await this.$http.get(`categories/${this.AddForm.goods_cat[2]}/attributes`, {
          params: {
            sel: this.activeTabName === '1' ? 'many' : 'only'
          }
        })
        if (res.meta.status !== 200) return this.$message.error('获取商品参数失败！')
        // console.log(res.data)
        // 判断 当前的 页签 是否为 【商品参数】，如果是，
        // 则需要把 res.data 数组中的每一项，进行forEach循环，把 每一项 的 attr_vals 分割成 数组
        if (this.activeTabName === '1') {
          // 证明是 【商品参数面板】
          res.data.forEach(item => {
            // 分割每一个 动态参数的 attr_vals，并把 分割的结果，重新赋值给 每一项 动态参数 的 attr_vals
            item.attr_vals = item.attr_vals.trim().length <= 0 ? [] : item.attr_vals.split(' ')
          })
          this.dymanicParams = res.data
        } else {
          // 证明是 【商品静态属性面板】，静态属性，不需要把 attr_vals 进行 split 分割
          this.staticParams = res.data
        }
      }
    },
    // 预览图片执行的操作
    handlePreview (info) {
      // console.log(info)
      this.previewImgURL = info.response.data.url
      this.previewDialogVisible = true
    },
    // 移除图片执行的操作
    handleRemove (file) {
      // console.log(file)
      // 1. 获取要要删除的那张图片的 tmp_path 路径
      const path = file.response.data.tmp_path
      // 2. 从 this.AddForm.pics 数组中，找到 tmp_path 所对应的那个对象的索引
      const index = this.AddForm.pics.findIndex(item => item.pic === path)
      // 3. 使用数组的 splice 方法，根据索引，删除对应的对象
      this.AddForm.pics.splice(index, 1)
      // console.log(this.AddForm.pics)
    },
    // 图片上传成功的事件
    uploadSuccess (response) {
      // console.log(response)
      // 当图片上传成功以后，需要把 服务器返回的 图片相对路径， 整理成一个对象，push 到 addForm.pics 数组中
      const o = { pic: response.data.tmp_path }
      this.AddForm.pics.push(o)
      // console.log(this.AddForm)
    },
    // 添加商品
    addGoods () {
      // 1. 验证表单
      this.$refs.AddFormRef.validate(async valid => {
        if (!valid) return this.$message.error('请填写必要的商品信息！')
        // console.log(this.AddForm)
        // 这种方式不可以，因为页面上的 分类选择框，还使用 v-model 指令，引用着 this.AddForm.goods_cat，
        // 所以 ，必须 要求 this.AddForm.goods_cat 是一个数组，不能被重新赋值为 字符串
        // this.AddForm.goods_cat = this.AddForm.goods_cat.join(',')
        // const o2 = this.AddForm
        // 深拷贝(把对象上的每个属性，重新开辟一块内存存储，拷贝的结果，得到 两个完全独立的对象)
        // 浅拷贝（引用传递，只是单纯的把 对象1 的引用，交给了对象2， 浅拷贝的结果，就是 对象1 和 对象2  共享同一份内存）
        // 展开运算符
        const o = { ...this.AddForm }
        o.goods_cat = o.goods_cat.join(',')

        // 循环渲染 dynamicParams 数组，把 动态参数数组中的每一项，处理一下，得到 { attr_id: 动态参数Id, attr_value: 动态参数值 }
        // console.log(this.dymanicParams)
        // 数组的新方法，把 元素组中的每一项，做某些操作，返回并得到一个新数组
        /* const arr1 = this.dymanicParams.map(item => {
          const param = { attr_id: item.attr_id, attr_value: item.attr_vals }
          return param
        }) */
        const arr1 = this.dymanicParams.map(item => ({ attr_id: item.attr_id, attr_value: item.attr_vals }))
        // 处理静态参数
        /* const arr2 = this.staticParams.map(item => {
          const param2 = { attr_id: item.attr_id, attr_value: item.attr_vals }
          return param2
        }) */
        const arr2 = this.staticParams.map(item => ({ attr_id: item.attr_id, attr_value: item.attr_vals }))
        // 完成对 静态属性和动态属性的处理过程
        o.attrs = [...arr1, ...arr2]

        // 发起请求，添加商品
        const { data: res } = await this.$http.post('goods', o)
        if (res.meta.status !== 201) return this.$message.error('添加商品失败！')
        this.$message.success('添加商品成功！')
        // 跳转到列表页面
        this.$router.push('/goods/list')
      })
    }
  }
}
