// 导入 Echarts
import echarts from 'echarts'
import _ from 'lodash'

export default {
  data () {
    return {
      // 定义报表数据 为 空对象
      // reportData: {},
      // 报表
      myChart: null,
      // 需要合并的数据对象
      options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    }
  },
  methods: {
    // 获取报表数据
    async getReportsData () {
      const { data: res } = await this.$http.get('reports/type/1')
      if (res.meta.status !== 200) return this.$message.error('获取报表数据失败！')
      console.log(res)
      // 把服务器返回的报表数据，赋值给 reportData
      // this.reportData = res.data

      // 需要使用 loadsh 库 进行 两个对象属性的合并；能够方便程序员的操作
      const newData = _.merge(this.options, res.data)

      // 绘制图表, 调用  setOption  初始化 myChart 的数据
      this.myChart.setOption(newData)
    }
  },
  mounted () {
    // 基于准备好的dom，初始化echarts实例
    this.myChart = echarts.init(this.$refs.ecartsArea)
    // 在 mounted 中获取 报表的数据
    this.getReportsData()
  }
}
