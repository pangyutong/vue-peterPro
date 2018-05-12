<template>
  <div class="users-container">

    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card class="box-card">

      <!-- 头部的搜索按钮区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="keywords">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="3">
          <el-button type="primary" @click="addUserDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>

      <!-- 用户列表 -->
      <el-table
        :data="userlist"
        border
        stripe
        style="width: 100%">
        <el-table-column
          type="index"
          width="50">
        </el-table-column>
        <el-table-column
          prop="username"
          label="姓名"
          width="100">
        </el-table-column>
        <el-table-column
          prop="email"
          label="邮箱">
        </el-table-column>
        <el-table-column
          prop="mobile"
          label="电话">
        </el-table-column>
        <el-table-column
          prop="role_name"
          label="角色">
        </el-table-column>
        <el-table-column
          label="状态"
          width="70">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="stageChanged(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="190">
          <template slot-scope="scope">
            <!-- 编辑按钮 -->
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope)"></el-button>
            <!-- 删除按钮 -->
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUser(scope)"></el-button>
            <!-- 分配角色按钮 -->
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini" @click="showSetRoleDialog(scope)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="nowPage"
        :page-sizes="[2, 4, 6, 10]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>

      <!-- 添加用户的对话框 -->
      <el-dialog
        title="添加用户"
        :visible.sync="addUserDialogVisible"
        width="50%"
        @close="resetAddForm">
        <!-- Start：添加用户表单 -->
        <el-form :model="addUserForm" :rules="addUserFormRules" ref="addUserFormRef" label-width="70px">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="addUserForm.username"></el-input>
          </el-form-item>

          <el-form-item label="密码" prop="password">
            <el-input v-model="addUserForm.password"></el-input>
          </el-form-item>

          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addUserForm.email"></el-input>
          </el-form-item>

          <el-form-item label="手机" prop="mobile">
            <el-input v-model="addUserForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <!-- Ended：添加用户表单 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="addUserDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 编辑用户的对话框 -->
      <el-dialog
        title="编辑用户信息"
        :visible.sync="editUserDialogVisible"
        width="50%"
        @close="resetEditForm">
        <!-- Start：添加用户表单 -->
        <el-form :model="editUserForm" :rules="editUserFormRules" ref="editUserFormRef" label-width="70px">
          <el-form-item label="用户名">
            <el-input v-model="editUserForm.username" disabled></el-input>
          </el-form-item>

          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editUserForm.email"></el-input>
          </el-form-item>

          <el-form-item label="手机" prop="mobile">
            <el-input v-model="editUserForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <!-- Ended：添加用户表单 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="editUserDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editUser">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 分配角色的对话框 -->
      <el-dialog
        title="分配角色"
        :visible.sync="setRoleDialogVisible"
        width="50%">
        <!-- Start：分配角色 -->
        <el-form ref="setRoleFormRef" :model="setRoleForm" label-width="100px">
          <el-form-item label="当前的用户：">
            <span>{{setRoleForm.username}}</span>
          </el-form-item>

          <el-form-item label="当前的角色：">
            <span>{{setRoleForm.role_name}}</span>
          </el-form-item>

          <el-form-item label="分配新角色：">
            <el-select v-model="setRoleForm.newRoleId" placeholder="请选择">
              <el-option
                v-for="item in roles"
                :key="item.id"
                :label="item.roleName"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <!-- Ended：分配角色 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="setRoleDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="setNewRole">确 定</el-button>
        </span>
      </el-dialog>

    </el-card>

  </div>
</template>

<script>
import mix from './Users-mixins.js'
export default {
  mixins: [mix]
}
</script>

<style lang="less" scoped>

</style>
