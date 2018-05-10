<template>
  <div class="login-container">

    <!-- 登陆框 -->
    <div class="login-box">

      <!-- Logo区域 -->
      <div class="logo">
        <img src="../assets/logo.png" alt="">
      </div>

      <!-- 登录表单 -->
      <el-form :model="loginForm" :rules="loginFormRules" ref="loginFormRef">
        <el-form-item prop="username">
          <el-input placeholder="登录名称" prefix-icon="iconfont icon-user" v-model="loginForm.username">
          </el-input>
        </el-form-item>

        <el-form-item prop="password">
          <el-input placeholder="登录密码" v-model="loginForm.password" :type="ispwd ? 'password' : 'text'">
            <!-- 使用 slot 设置文本框的小图标 -->
            <i slot="prefix" :class="['iconfont', ispwd ? 'icon-3702mima' : 'icon-showpassword']" @click="ispwd = !ispwd"></i>
          </el-input>
        </el-form-item>

        <el-row>
          <el-col>
            <el-button type="primary" @click="login">登录</el-button>
            <el-button type="info" @click="reset">重置</el-button>
          </el-col>
        </el-row>
      </el-form>

    </div>

  </div>
</template>

<script>
// 导入属于自己的 mixins 文件
import mix from './Login-mixins.js'
export default {
  mixins: [mix]
}
</script>

<style lang="less" scoped>
// 如果要让 style 标签支持 less 语法：
// 1. 添加 lang="less" 属性
// 2. 安装 cnpm i less-loader less -D
.login-container {
  background-color: #2b4b6b;
  height: 100%;

  .login-box {
    height: 304px;
    width: 450px;
    background-color: #fff;
    border-radius: 4px;
    position: absolute;
    top: 20%;
    left: 50%;
    transform: translateX(-50%);

    .logo {
      width: 120px;
      height: 120px;
      padding: 10px;
      border: 1px solid #eee;
      box-shadow: 0 1px 6px #eee;
      border-radius: 50%;
      position: relative;
      left: 50%;
      transform: translateX(-50%);
      top: -60px;
      background-color: #fff;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eee;
      }
    }

    .el-form {
      padding: 15px;
      position: relative;
      top: -50px;
    }

    .el-col {
      display: flex;
      justify-content: flex-end;
    }
  }
}

.icon-3702mima,
.icon-showpassword {
  transition: all 0.5s ease;
  cursor: pointer;
  &:hover {
    color: darkred;
  }
}
</style>
