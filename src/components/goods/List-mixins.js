export default {
  data () {
    return {
      // 搜索关键字
      keywords: '',
      // 当前页码值
      nowPage: 1,
      // 每页显示几条数据
      pageSize: 10,
      // 总记录条数
      total: 0,
      // 商品列表数据
      goodlist: []
    }
  },
  created () {
    this.getGoodsList()
  },
  filters: {
    // 定义全局过滤器，格式化时间字符串
    dateFormat (originVal) {
      const dt = new Date(originVal)
      const y = dt.getFullYear()
      const m = (dt.getMonth() + 1).toString().padStart(2, '0')
      const d = dt.getDate().toString().padStart(2, '0')

      const hh = dt.getHours().toString().padStart(2, '0')
      const mm = dt.getMinutes().toString().padStart(2, '0')
      const ss = dt.getSeconds().toString().padStart(2, '0')

      return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
    }
  },
  methods: {
    async getGoodsList () {
      // 发起请求获取 用户列表数据
      const { data: res } = await this.$http.get('goods', { params: { query: this.keywords, pagenum: this.nowPage, pagesize: this.pageSize } })
      // 获取数据失败
      if (res.meta.status !== 200) return this.$message.error('获取商品列表失败！')
      this.goodlist = res.data.goods
      // 重新为总记录条数赋值
      this.total = res.data.total
    },

    // 当 pageSize 改变的时候触发此事件
    handleSizeChange (newSize) {
      // 把最新的pageSize,赋值到 当前的 data 中
      this.pageSize = newSize
      this.getGoodsList()
    },
    // 当页码值改变的时候，触发此事件
    handleCurrentChange (newPage) {
      // 把最新的页码值，赋值到 data 中
      this.nowPage = newPage
      this.getGoodsList()
    },
    // 删除商品
    async removeGood (scope) {
      // 提示是否删除
      const confirmResult = await this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
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

      // 发起请求删除商品
      const { data: res } = await this.$http.delete('goods/' + scope.row.id)
      if (res.meta.status !== 200) return this.$message.error('删除失败！')
      this.$message.success('删除成功！')
      this.getGoodsList()
    }
  }
}
