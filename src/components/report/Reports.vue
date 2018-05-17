<template>
  <div class="reports-container">

    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <!-- 用来初始化 Echarts 的区域 -->
      <div ref="ecartsArea" style="width: 800px; height: 500px;"></div>
    </el-card>

  </div>
</template>

<script>
import mix from './Reports-mixins.js'
export default {
  mixins: [mix]
}
</script>

<style lang="less" scoped>
</style>
