<template>
  <div class="tableComp" :style="tableConfig.style">
    <div class="title" v-if="tableConfig.title">
      <div class="left" :style="tableConfig.titleStyle">
        {{ tableConfig.title }}
      </div>
      <div class="right" v-if="tableConfig.export">
        <el-button type="primary" size="mini" @click="exportExcel"
          >导出excel</el-button
        >
      </div>
    </div>
    <el-table
      :data="tableData"
      style="width: 100%"
      :header-cell-style="tableConfig.headStyle"
      :cell-style="tableConfig.bodyStyle"
      :height="tableConfig.height"
      ref="table"
    >
      <el-table-column
        :fixed="tableConfig.columns[0].fixed"
        type="index"
        label="序号"
        align="center"
        width="60"
      >
      </el-table-column>
      <template v-for="item in tableConfig.columns">
        <template v-if="item.slotName">
          <el-table-column
            align="center"
            show-overflow-tooltip
            :key="item.label"
            :fixed="item.fixed"
            :label="item.label"
            :width="item.width"
          >
            <template slot-scope="scope">
              <slot
                :name="item.slotName"
                :index="scope.$index"
                :row="scope.row"
              ></slot>
            </template>
          </el-table-column>
        </template>
        <template v-else>
          <el-table-column
            align="center"
            show-overflow-tooltip
            :sortable="item.sortable"
            :key="item.label"
            :fixed="item.fixed"
            :prop="item.prop"
            :label="item.label"
            :width="item.width"
          >
          </el-table-column>
        </template>
      </template>
    </el-table>
    <el-pagination
      class="table-pagination"
      v-if="tableConfig.usePage"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="params.pageIndex"
      :page-sizes="[5, 10, 15, 20]"
      :page-size.sync="params.pageSize"
      background
      :layout="
        tableConfig.pageConfig || 'sizes, prev, pager, next, total,jumper'
      "
      :total="total"
    >
    </el-pagination>
  </div>
</template>

<script>
import { export_json_to_excel } from "./Export2Excel.js";
export default {
  props: {
    tableConfig: Object,
    onRequest: Function
  },
  data() {
    return {
      total: 0,
      tableData: [],
      oldParmas: {},
      params: {
        pageIndex: 1,
        pageSize: 10
      }
    };
  },
  methods: {
    //页码个数切换
    handleSizeChange() {
      this.requestData(this.oldParmas);
    },
    //页面切换
    handleCurrentChange() {
      this.requestData(this.oldParmas);
    },
    // 数据请求，layout为true，请求数据后，table重新布局
    requestData(params, layout) {
      this.oldParmas = params;
      if (!this.$store.state.runtime || this.tableConfig.handRequest) {
        this.tableData = this.tableConfig.defaultData;
        this.total = this.tableConfig.total || this.tableData.length;
        return;
      }
      let formatter = this.tableConfig.formatter;
      this.tableConfig.request({ ...params, ...this.params }).then(res => {
        if (formatter) {
          res = formatter(res);
        }
        this.tableData = res.data.items;
        this.total = res.data.totalItems;

        if (layout) {
          this.$nextTick(() => {
            this.$refs.table.doLayout();
          });
        }
      });
    },
    // 导出的方法
    exportExcel() {
      let title = this.tableConfig.title;
      let tHeader = [];
      let filterVal = [];
      for (let i of this.tableConfig.columns) {
        tHeader.push(i.label);
        filterVal.push(i.prop);
      }
      let list = this.tableData;
      let data = this.formatJson(filterVal, list);
      export_json_to_excel(tHeader, data, title);
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]));
    }
  }
};
</script>
<style lang="less" scoped>
.tableComp {
  width: calc(100%);
  height: calc(100%);
  .title {
    min-height: 38px;
    display: flex;
    justify-content: space-between;
    flex-direction: row;
  }
  /deep/.el-table th.gutter {
    background-color: transparent;
  }
  /deep/.el-table__header-wrapper tr {
    background-color: transparent;
  }
  /deep/ .el-pagination.is-background {
    margin-top: 10px;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
  }
  /deep/ .el-table {
    background-color: transparent;
    &::before {
      height: 0px;
    }
    tr {
      cursor: pointer;
      th {
        height: 40px;
        padding: 0px;
      }
      td {
        height: 40px;
        padding: 0px;
      }
    }

    .el-table__fixed::before {
      // display: none;
      background-color: transparent;
    }
    // .el-table__fixed {
    //   height: calc(100% - 12px) !important;
    // }
    // .el-table__fixed-body-wrapper {
    //   height: calc(100% - 40px) !important;
    // }
  }
}
</style>
