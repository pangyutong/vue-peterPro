<template>
  <div class="orders-container">

    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 搜索框 -->
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="keywords" class="input-with-select">
            <el-button slot="append" icon="el-icon-search" @click="getOrderList"></el-button>
          </el-input>
        </el-col>
      </el-row>

      <!-- 订单列表 -->
      <el-table
        :data="orderList"
        border
        stripe
        style="width: 100%">
        <el-table-column
          type="index"
          width="50">
        </el-table-column>
        <el-table-column
          prop="order_number"
          label="订单编号"
          width="180">
        </el-table-column>
        <el-table-column
          prop="order_price"
          label="订单价格">
        </el-table-column>
        <el-table-column
          prop="order_pay"
          label="是否付款">
          <template slot-scope="scope">
            <el-tag type="danger" v-if="scope.row.order_pay === '0'">未付款</el-tag>
            <el-tag type="success" v-else>已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="is_send"
          label="是否发货">
        </el-table-column>
        <el-table-column
          prop="create_time"
          width="140"
          label="下单时间">
          <template slot-scope="scope">
            {{scope.row.create_time | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column
        width="130"
          label="操作">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" title="修改订单地址" @click="editAddressDialogVisible = true"></el-button>
            <el-button type="success" icon="el-icon-location" size="mini" title="物流信息" @click="showLogisticsDialog(scope)"></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>

    <!-- 展示 编辑的对话框 -->
    <el-dialog
      title="修改地址"
      :visible.sync="editAddressDialogVisible"
      width="30%">
      <el-form :model="editAddressForm" :rules="editAddressFormRules" ref="editAddressFormRef" label-width="100px">
        <el-form-item label="省市区/县" prop="lev1Address">
          <el-cascader
            :options="areas"
            :props="propsOption"
            v-model="editAddressForm.lev1Address"
            @change="handleAreasChanged">
          </el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="lev2Address">
          <el-input v-model="editAddressForm.lev2Address"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editAddressDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editAddressDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 展示物流信息的对话框 -->
    <el-dialog
      title="物流信息"
      :visible.sync="logisticsDialogVisible"
      width="50%">
      <!-- 物流信息开始 -->
      <!-- finish-status 表示已经完成的那些步骤的状态    wait  表示灰色的文本 -->
      <!-- process-status 表示当前正在处理的这个节点的状态    success 表示 绿色的文本 -->
      <el-steps direction="vertical" :active="logisticsAddress.length - 1" finish-status="wait" process-status="success">
        <el-step v-for="(item, i) in logisticsAddress" :key="i" :title="item.time" :description="item.context"></el-step>
      </el-steps>
      <!-- 物流信息结束 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="logisticsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="logisticsDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import mix from './Orders-mixins.js'
export default {
  mixins: [mix]
}
</script>

<style lang="less" scoped>

</style>
