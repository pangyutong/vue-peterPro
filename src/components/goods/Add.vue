<template>
  <div class="goodsadd-container">

    <!-- 提示条 -->
    <el-alert
      title="添加商品信息"
      type="info"
      center
      :closable="false"
      show-icon>
    </el-alert>

    <!-- 步骤条 -->
    <el-steps :active="activeTabName - 0" finish-status="success" align-center>
      <el-step title="基本信息"></el-step>
      <el-step title="商品参数"></el-step>
      <el-step title="商品属性"></el-step>
      <el-step title="商品图片"></el-step>
      <el-step title="商品内容"></el-step>
      <el-step title="完成"></el-step>
    </el-steps>

    <!-- Tab 栏 -->
    <el-form :model="AddForm" :rules="AddFormRules" ref="AddFormRef" label-width="100px" label-position="top">
      <el-tabs tab-position="left" v-model="activeTabName" @tab-click="handleTabClick">
        <!-- 第一个面板 -->
        <el-tab-pane label="基本信息" name="0">
          <el-form-item label="商品名称" prop="goods_name">
            <el-input v-model="AddForm.goods_name"></el-input>
          </el-form-item>

          <el-form-item label="商品价格" prop="goods_price">
            <el-input v-model="AddForm.goods_price" type="number"></el-input>
          </el-form-item>

          <el-form-item label="商品重量" prop="goods_weight">
            <el-input v-model="AddForm.goods_weight" type="number"></el-input>
          </el-form-item>

          <el-form-item label="商品数量" prop="goods_number">
            <el-input v-model="AddForm.goods_number" type="number"></el-input>
          </el-form-item>

          <el-form-item label="商品分类" prop="goods_cat">
            <el-cascader
              expand-trigger="hover"
              :options="cateList"
              :props="catePropsOption"
              v-model="AddForm.goods_cat"
              @change="handleCateChanged">
            </el-cascader>
          </el-form-item>
        </el-tab-pane>
        <!-- 第二个面板 -->
        <el-tab-pane label="商品参数" name="1">
          <!-- 使用 v-for 循环渲染所有动态参数项 -->
          <el-form-item v-for="item in dymanicParams" :key="item.attr_id" :label="item.attr_name">
            <!-- 使用复选框组，来渲染所有 动态参数下的复选框 -->
            <el-checkbox-group v-model="item.attr_vals">
              <el-checkbox v-for="(cb, i) in item.attr_vals" :key="i" :label="cb" border></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-tab-pane>
        <!-- 第三个面板 -->
        <el-tab-pane label="商品属性" name="2">
          <!-- 循环渲染每一个静态属性 -->
          <el-form-item v-for="item in staticParams" :key="item.attr_id" :label="item.attr_name">
            <el-input v-model="item.attr_vals"></el-input>
          </el-form-item>
        </el-tab-pane>
        <!-- 第四个面板 -->
        <el-tab-pane label="商品图片" name="3">
          <!-- 注意：在使用 el-upload 上传组件的时候，必须指定 action 属性，表示 图片要上传到服务器的哪个 接口中，而且，上传的 action 接口路径，必须是一个 完整的 URL 地址 -->
          <!-- on-preview 表示触发预览操作的时候，执行的业务逻辑 -->
          <!-- on-remove 表示 移除图片的时候，执行的业务逻辑 -->
          <el-upload
            action="http://127.0.0.1:8888/api/private/v1/upload"
            :headers="uploadHeaders"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :on-success="uploadSuccess"
            list-type="picture">
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-tab-pane>
        <!-- 第五个面板 -->
        <el-tab-pane label="商品内容" name="4">
          <v-editor v-model="AddForm.goods_introduce"></v-editor>
          <el-button type="primary" @click="addGoods">添加商品</el-button>
        </el-tab-pane>
      </el-tabs>
    </el-form>

    <!-- 预览图片的Dialog -->
    <el-dialog
      title="图片预览"
      :visible.sync="previewDialogVisible"
      width="40%">
      <img :src="previewImgURL" style="width: 100%;"/>
    </el-dialog>

  </div>
</template>

<script>
// require styles
// 导入 编辑器相关的内容
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { quillEditor } from 'vue-quill-editor'

import mix from './Add-mixins.js'
export default {
  mixins: [mix],
  // 把导入的第三方编辑器，注册为 当前 add 组件的私有子组件
  components: {
    'v-editor': quillEditor
  }
}
</script>

<style lang="less" scoped>
.el-tabs {
  margin-top: 20px;
}
</style>
