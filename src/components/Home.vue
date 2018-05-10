<template>
  <!-- 根容器 -->
  <el-container>
    <!-- 头部区域 -->
    <el-header>
      <img src="../assets/images/logo.png" alt="">
      <h3 class="title">电商后台管理系统</h3>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 主体区域 -->
    <el-container>

      <!-- 左侧菜单栏 -->
      <el-aside :style="{width: isCollapse ? '65px' : '200px'}">
        <div class="toggleBar" @click="isCollapse = !isCollapse">|||</div>
        <!-- 菜单开始 -->
        <el-menu :collapse="isCollapse" :collapse-transition="false" default-active="1" background-color="#333744" text-color="#fff" :unique-opened="true" :router="true">
          <!-- 第一个子菜单 -->
          <el-submenu :index="(i+1).toString()" v-for="(item, i) in menus" :key="item.id" :style="{width: isCollapse ? '65px' : '200px'}">
            <template slot="title">
              <!-- 左侧的图标 -->
              <i :class="['iconfont', menuIcons[i]]" style="margin-right:10px;"></i>
              <span style="font-size: 13px;">{{item.authName}}</span>
            </template>
            <!-- 循环生成菜单Item项 -->
            <el-menu-item :index="subitem.path" v-for="subitem in item.children" :key="subitem.id"><i class="el-icon-menu"></i>{{subitem.authName}}</el-menu-item>
          </el-submenu>
        </el-menu>
        <!-- 菜单结束 -->
      </el-aside>

      <!-- 右侧的内容区域 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import mix from './Home-mixins.js'
export default {
  mixins: [mix]
}
</script>

<style lang="less" scoped>
.el-container {
  width: 100%;
  height: 100%;
}
.el-header {
  height: 60px;
  background-color: #373d41;
  padding: 0;
  user-select: none;
  img {
    float: left;
  }
  .title {
    float: left;
    color: white;
    font-weight: 200;
    margin-left: 15px;
  }
  .el-button {
    float: right;
    margin: 10px 20px 0 0;
  }
}

.el-aside {
  background-color: #333744;
  user-select: none;
  font-size: 12px;
}

.toggleBar {
  color: #fff;
  font-size: 12px;
  letter-spacing: 0.2em;
  background-color: #4a5064;
  line-height: 26px;
  text-align: center;
  cursor: pointer;
  user-select: none;
}
</style>
