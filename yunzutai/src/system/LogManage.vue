<template>
  <div class="logManage aps-content">
    <el-form ref="form" :inline="true" :model="form" class="search-form">
      <el-form-item label="关键字">
        <el-input
          v-model="form.name"
          placeholder="用户名，设置点位查询"
        ></el-input>
      </el-form-item>
      <el-form-item label="时间段">
        <el-date-picker
          v-model="form.times"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSearch">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="tableData"
      style="width: 100%"
      border
      height="521"
      v-loading="tableLoading"
    >
      <el-table-column
        prop="order"
        label="序号"
        width="70"
        align="center"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        prop="operateTime"
        label="操作时间"
        width="180"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        prop="origin"
        label="来源"
        width="180"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        prop="operateUser"
        label="操作用户"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        prop="devidePoint"
        label="设备点位"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        prop="settingValue"
        label="设置值"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        prop="ipAddress"
        label="IP地址"
        :show-overflow-tooltip="true"
      ></el-table-column>
    </el-table>
    <el-pagination
      class="pagination pull-right"
      background
      layout="total, sizes, prev, pager, next, jumper"
      :page-size="pageSize"
      :total="total"
      :current-page="currentPage"
      @current-change="apsCurrentChange"
      @size-change="onPageSizeChange"
      :page-sizes="[10, 15, 20, 50]"
    ></el-pagination>
  </div>
</template>
<script>
export default {
  data() {
    return {
      total: 100,
      currentPage: 1,
      pageSize: 10,
      tableLoading: false,
      tableData: [],
      form: {
        keywards: "",
        times: ""
      }
    };
  },
  async mounted() {
    try {
      // let { data } = await this.$http.get(this.$http.run, {});
      // this.tableData = data
      this.mockTableData();
      this.search();
    } catch (error) {
      console.log("网络请求异常:" + error);
    }
  },
  methods: {
    mockTableData() {
      let allTableData = [];
      for (var i = 0; i < 100; i++) {
        allTableData.push({
          order: `${i + 1}`,
          operateTime: "2016-10-20 10:15",
          origin: "网络",
          operateUser: "张三",
          devidePoint: "A",
          settingValue: "100",
          ipAddress: "192.168.1.1"
        });
      }
      this.allTableData = allTableData;
    },

    onSearch() {
      this.currentPage = 1;
      this.search();
    },
    search() {
      this.tableLoading = true;
      let pagination = {
        currentPage: this.currentPage,
        pageSize: this.pageSize
      };
      let params = { ...pagination, ...this.form };
      setTimeout(() => {
        let tableData = this.allTableData.filter((atd, index) => {
          return (
            index >= (params.currentPage - 1) * params.pageSize &&
            index < params.currentPage * params.pageSize
          );
        });
        this.tableData = tableData;
        this.total = this.allTableData.length;
        this.tableLoading = false;
      }, 1000);
    },
    apsCurrentChange(currentPage) {
      this.currentPage = currentPage;
      this.search();
    },
    onPageSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.search();
    }
  }
};
</script>
<style lang="less" scoped>
.logManage {
  height: auto !important;
  height: unset !important;
  width: 100%;
  min-width: 700px;
}

.pull-right {
  float: right;
}

/deep/ .search-form {
  margin-bottom: -12px !important;
}

/deep/ .el-pagination__total,
/deep/ .el-pager li.number,
/deep/ .btn-prev,
/deep/ .btn-next {
  line-height: 28px !important;
  height: 28px !important;
  font-size: 13px !important;
}
</style>
