<template>
  <div class="params-container">

    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>

      <!-- 警告框 -->
      <el-alert
        title="注意：只允许为第三级分类设置相关参数！"
        type="warning"
        :closable="false"
        show-icon>
      </el-alert>

      <!-- 分类选择的级联下拉框 -->
      <el-row>
        <el-col>
          <span>选择商品分类：</span>
          <!-- options 表示要绑定的数据源 -->
          <!-- v-model 表示，选中分类以后，所有被选中的分类Id数组 -->
          <!-- @change 每当选中的分类，被改变了，就会触发 change 事件 -->
          <el-cascader
            expand-trigger="hover"
            :options="cateData"
            :props="propsOption"
            v-model="selectedCateList"
            @change="handleCateChanged">
          </el-cascader>
        </el-col>
      </el-row>

      <!-- Tab栏 -->
      <el-tabs v-model="activeTabName" @tab-click="handleTabClick">
        <el-tab-pane label="动态参数" name="many">
          <!-- 添加动态参数按钮 -->
          <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addParamsDialogVisible = true">添加参数</el-button>
          <!-- 动态参数列表 -->
          <el-table
            :data="dynamicTableData"
            border
            stripe
            style="width: 100%">
            <el-table-column
              type="expand">
              <template slot-scope="scope">
                <el-tag v-for="(item, i) in scope.row.attr_vals" :key="i" closable @close="tagClosed(scope, i)">{{item}}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope)"
                  @blur="handleInputConfirm(scope)"
                >
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column
              type="index"
              width="50">
            </el-table-column>
            <el-table-column
              prop="attr_name"
              label="参数名称"
              width="180">
            </el-table-column>
            <el-table-column
              label="操作">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope)">修改</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeParams(scope)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addParamsDialogVisible=true">添加属性</el-button>
          <!-- 静态属性列表 -->
          <el-table
              :data="staticTableData"
              border
              stripe
              style="width: 100%">
              <el-table-column
              type="expand">
              <template slot-scope="scope">
                <el-tag v-for="(item, i) in scope.row.attr_vals" :key="i" closable @close="tagClosed(scope, i)">{{item}}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope)"
                  @blur="handleInputConfirm(scope)"
                >
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope)">+ New Tag</el-button>
              </template>
            </el-table-column>
              <el-table-column
                type="index"
                width="50">
              </el-table-column>
              <el-table-column
                prop="attr_name"
                label="属性名称"
                width="180">
              </el-table-column>
              <el-table-column
                label="操作">
                <template slot-scope="scope">
                  <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope)">修改</el-button>
                  <el-button type="danger" icon="el-icon-delete" size="mini"  @click="removeParams(scope)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
      </el-tabs>

    </el-card>

    <!-- 添加参数的对话框 -->
    <el-dialog
      :title="activeTabName === 'many' ? '添加动态参数' : '添加静态属性'"
      :visible.sync="addParamsDialogVisible"
      width="40%"
      @close="resetAddForm">
      <!-- 添加参数的表单 -->
      <el-form :model="addParamsForm" :rules="addParamsFormRules" ref="addParamsFormRef" label-width="100px">
        <el-form-item :label="activeTabName === 'many' ? '动态参数' : '静态属性'" prop="attr_name">
          <el-input v-model="addParamsForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addParamsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addNewParams">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改参数的对话框 -->
    <el-dialog
      :title="activeTabName === 'many' ? '修改动态参数' : '修改静态属性'"
      :visible.sync="editParamsDialogVisible"
      width="40%"
      @close="resetEditForm">
      <!-- 添加参数的表单 -->
      <el-form :model="editParamsForm" :rules="editParamsFormRules" ref="editParamsFormRef" label-width="100px">
        <el-form-item :label="activeTabName === 'many' ? '动态参数' : '静态属性'" prop="attr_name">
          <el-input v-model="editParamsForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editParamsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import mix from './Params-mixins.js'
export default {
  mixins: [mix]
}
</script>

<style lang="less" scoped>
.el-row {
  margin: 15px 0;
}

.el-tag{
  margin: 5px;
}

.el-input{
  width: 150px;
}
</style>
