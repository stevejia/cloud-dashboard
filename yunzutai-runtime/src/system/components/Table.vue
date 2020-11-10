<template>
  <div class="table Tethys-style-table">
    <el-table
      :data="data"
      :header-row-class-name="headClassName"
      header-align="left"
      :default-sort="defaultSort"
      :max-height="hasMaxHeight"
      :before-filter="beforeFilter"
      select-on-indeterminate
      v-bind="$attrs"
      @selection-change="handleSelectionChange"
      ref="tableData"
    >
      <el-table-column
        v-if="showSelection || false"
        type="selection"
        width="55"
      ></el-table-column>
      <el-table-column
        v-if="(showIndex && showIndex.show) || false"
        type="index"
        :label="showIndex.label || ''"
        width="120"
      ></el-table-column>
      <el-table-column
        v-for="(col, index) in head"
        :prop="col.prop"
        :label="col.label"
        :width="col.width"
        :type="col.type"
        :key="index"
        :header-align="col.headAlign"
        :align="col.align"
        :sortable="col.sortable"
        :min-width="col.mwidth"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scope">
          {{
            col.filterFn
              ? shouldEval(scope, col.prop, col.filterFn)
              : scope.row[col.prop]
          }}
        </template>
      </el-table-column>
      <el-table-column :min-width="changeStatus.mwidth" v-if="changeStatus">
        <template slot="header">
          <div class="status_column">{{ changeStatus.name }}</div>
        </template>
        <template slot-scope="scope">
          <el-switch
            :value="scope.row.status === 1"
            @change="changeStatusHandle(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column
        :label="tableOption.label"
        v-if="tableOption"
        :min-width="tableOption.mwidth"
        :header-align="tableOption.headAlign"
        :align="tableOption.align"
      >
        <template slot-scope="scope">
          <el-button
            v-for="(item, index) in tableOption.options"
            size="mini"
            class="btn-custom-operate"
            :key="index"
            :type="item.type"
            @click="
              handleButton(item.methods, scope.row, scope.column, scope.$index)
            "
            >{{ item.label }}</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  props: [
    "data",
    "head",
    "showSelection", //是否显示表格复选框
    "showIndex", //是否显示索引序号
    "headClassName",
    "changeStatus",
    "tableOption",
    "maxHeight",
    "isShowAddEquipment",
    "defaultSort",
    "blank"
  ],
  data() {
    return {
      isDefault: this.isShowAddEquipment,
      selectValue: "",
      switchWidth: 40,
      reserveSelected: true,
      hasMaxHeight: this.maxHeight ? this.maxHeight : "auto",
      value: true
    };
  },
  mounted: function() {},
  components: {},
  watch: {
    /**
     * @Description: 监听isShowAddEquipment
     * @Author: zhap
     * @param {Boolean} val:isShowAddEquipment的值，控制显示与隐藏
     * @Date: 2019-04-19 09:45:52
     */
    isShowAddEquipment(val) {
      this.isDefault = val;
    }
  },
  methods: {
    shouldEval(scope, prop, str) {
      return eval(str);
    },
    setUserLevel(level) {
      return level === 0 ? "普通用户" : "管理员";
    },
    setUserStatus(status) {
      return status === true ? "启用" : "禁用";
    },
    getUserRole(roles) {
      if (!roles) return;
      return roles.length > 0 ? roles.join(",") : "--";
    },
    setAuthorityLevel(level) {
      switch (level) {
        case 0:
          return "零级权限";
        case 1:
          return "一级权限";
        case 2:
          return "二级权限";
        case 3:
          return "三级权限";
        case 4:
          return "四级权限";
        case 5:
          return "五级权限";
        case 65535:
          return "超级权限";
        default:
          return "--";
      }
    },
    beforeFilter(keyword) {
      this.$emit("beforeFilter", keyword);
    },
    handleSelectionChange(val) {
      this.$emit("handleSelectionChange", val);
    },
    actionHandler(row) {
      this.$emit("actionHandle", row);
    },
    changeStatusHandle(row) {
      this.$emit("changeStatusHandle", row);
    },

    /**
     * @Description: 表格操作点击事件
     * @Author: zhap
     * @param {String} methods：方法名称
     * @param {Object} row:当前行数据
     * @Date: 2019-04-16 11:06:49
     */
    handleButton(methods, row, column, index) {
      this.$emit("handleButton", {
        methods: methods,
        row: row,
        column: column,
        index: index
      });
    }
    /* getLocalTime(ns) {
      if (!ns) return ''
      return format(ns, 'yyyy-MM-dd hh:mm:ss')
    } */
  }
};
</script>

<style lang="less" scoped>
.Tethys-style-table {
  width: 100%;
  overflow: hidden;
  margin-top: 20px;
  .btn-custom-operate {
    background: transparent;
    border-radius: 2px;
    border: none;
    color: #237ae4;
    padding: 7px 4px;
  }
}
.Theme-black {
  .Tethys-style-table {
    /deep/ .el-table .el-checkbox__inner {
      background-color: rgba(255, 255, 255, 0.1);
      border-color: rgba(255, 255, 255, 0.1);
    }
    /deep/ .el-table {
      background: unset;
    }
    /deep/ .el-table thead {
      color: #abb4c3;
      background: rgba(92, 101, 134, 0.1);
      border-bottom: 1px solid rgba(92, 101, 134, 1);
      font-size: 14px;
    }
    /deep/ .el-table__header-wrapper {
      border-bottom: 1px solid rgba(92, 101, 134, 1);
    }
    /deep/ .el-table__row {
      height: 50px;
    }
    /deep/.el-table td,
    /deep/.el-table th {
      background: #2b2e37;
      color: #abb4c3;
    }
    /deep/ .el-table tr:hover td {
      background: rgba(43, 46, 55, 0.95);
    }
    /deep/.el-table td,
    /deep/.el-table th.is-leaf {
      border-bottom: 1px solid #32383f;
    }
    /deep/ .el-table::before {
      background: unset;
    }
    /deep/ &.has-gutter th .cell {
      font-weight: 550;
      font-size: 14px;
      color: rgba(223, 232, 255, 1);
    }
    /deep/ .el-table__empty-block {
      min-height: 100px;
      padding-top: 100px;
      background: rgb(43, 46, 55);
    }
    /deep/ .el-table__empty-text {
      color: rgba(223, 232, 255, 1);
    }
    /deep/ .el-progress-bar__outer {
      background-color: rgba(44, 50, 78, 1);
    }
    /deep/ .el-progress-bar__inner {
      background: rgba(47, 194, 91, 1);
    }
    /deep/ .el-progress__text {
      color: #fff;
    }
    .table-empty {
      margin-top: 30px;
      display: block;
      height: 412px;
      background: rgba(20, 28, 47, 1);
      box-shadow: 1px 1px 4px 0px rgba(35, 122, 228, 0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      .text {
        i {
          color: #237ae4;
          font-style: normal;
          cursor: pointer;
        }
      }
      h2 {
        color: rgba(223, 232, 255, 1);
      }
    }
    /deep/ .el-table__body-wrapper::-webkit-scrollbar {
      /*滚动条整体样式*/
      width: 5px; /*高宽分别对应横竖滚动条的尺寸*/
      height: 5px;
    }
    /deep/ .el-table__body-wrapper::-webkit-scrollbar-thumb {
      /*滚动条里面小方块*/
      border-radius: 5px;
      -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
      background: #242b3f;
    }
    /deep/ .el-table__body-wrapper::-webkit-scrollbar-track {
      /*滚动条里面轨道*/
      -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
      border-radius: 0;
      background: #242b3f;
    }
  }
}
</style>
