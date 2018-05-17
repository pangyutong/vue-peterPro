<template>
  <div class="categories-container">

    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <!-- vue-table-with-tree-grid -->
    <!-- https://github.com/MisterTaki/vue-table-with-tree-grid -->
    <el-card>
      <el-button type="primary" style="margin-bottom: 15px;" @click="showAddCateDialog">添加分类</el-button>

      <!-- 分类列表 -->
      <tree-grid ref="table" index-text="#" :data="treeData" :columns="columns" :border="true" :show-index="true" :selection-type="false" :expand-type="false">
        <template slot="isok" slot-scope="scope">
          <i class="el-icon-circle-close" v-if="scope.row.cat_deleted" style="color: red;"></i>
          <i class="el-icon-circle-check" v-else style="color: #009961;"></i>
        </template>

        <template slot="btns" slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditCateDialog(scope)">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeCate(scope)">删除</el-button>
        </template>
      </tree-grid>

      <!-- 分页 -->
      <el-pagination
        @current-change="handlePageChanged"
        :current-page="pagenum"
        :page-size="pagesize"
        layout="total, prev, pager, next, jumper"
        :total="total">
      </el-pagination>

    </el-card>

    <!-- 添加分类的对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="50%"
      @close="resetAddCateForm">
      <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px">
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>

        <el-form-item label="父级分类：">
          <el-cascader
            expand-trigger="hover"
            :options="cateList"
            :props="itemOption"
            v-model="selectedCategoriesList"
            style="width: 100%;"
            :change-on-select="true"
            @change="cateChanged">
          </el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addNewCate">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑分类的对话框 -->
    <el-dialog
      title="编辑分类"
      :visible.sync="editCateDialogVisible"
      width="30%"
      @close="resetEditForm">
      <!-- 编辑的表单 -->
      <el-form :model="editCateForm" :rules="editCateFormRules" ref="editCateFormRef" label-width="100px">
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="editCateForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveCate">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import mix from './Categories-mixins.js'
export default {
  mixins: [mix]
}
</script>

<style lang="less" scoped>

</style>
