<template>
  <div class="goods-container">
    <!-- 卡片视图 -->
    <el-card class="box-card">
      <!-- 头部的搜索按钮区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="keywords">
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="3">
          <el-button type="primary" @click="handleToAdd">添加商品</el-button>
        </el-col>
      </el-row>
       <!-- 商品列表 -->
      <el-table
        :data="goodlist"
        border
        stripe
        style="width: 100%">
        <el-table-column
          type="index"
          label="#">
        </el-table-column>
        <el-table-column
          prop="goods_name"
          label="商品名称"
          >
        </el-table-column>
        <el-table-column
          prop="goods_price"
          label="商品价格（元）"
          width="130">
        </el-table-column>
        <el-table-column
          prop="goods_weight"
          label="商品重量"
          width="130">
        </el-table-column>
        <el-table-column
          label="创建时间"
          width="150">
          <template slot-scope="scope">
            {{scope.row.add_time | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="130">
          <template slot-scope="scope">
            <!-- 编辑按钮 @click="showEditDialog(scope)"-->
            <el-button type="primary" icon="el-icon-edit" size="mini" ></el-button>
            <!-- 删除按钮 @click="removeGood(scope)"-->
            <el-button type="danger" icon="el-icon-delete" size="mini" ></el-button>
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
    </el-card>
  </div>
</template>

<script>
import mix from './List-mixins.js'
export default {
  mixins: [mix]
}
</script>
<style lang="less" scoped>

</style>
