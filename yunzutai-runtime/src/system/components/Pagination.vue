<template>
  <div
    :class="{ hidden: hidden }"
    class="pagination-container Tethys-pagination-style"
    align="center"
  >
    <el-pagination
      :background="background"
      :current-page.sync="currentPage"
      :page-size.sync="pageSize"
      :layout="layout"
      :page-sizes="pageSizes"
      :total="total"
      v-bind="$attrs"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
//import { scrollTo } from '../js/scroll-to.js'
export default {
  name: "Pagination",
  props: {
    total: {
      required: true,
      type: Number
    },
    page: {
      type: Number,
      default: 1
    },
    limit: {
      type: Number,
      default: 10
    },
    pageSizes: {
      type: Array,
      default() {
        return [10, 20, 30, 50];
      }
    },
    layout: {
      type: String,
      default: "total, prev, pager, next, jumper"
    },
    background: {
      type: Boolean,
      default: true
    },
    autoScroll: {
      type: Boolean,
      default: true
    },
    hidden: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    currentPage: {
      get() {
        return this.page;
      },
      set(val) {
        this.$emit("update:page", val);
      }
    },
    pageSize: {
      get() {
        return this.limit;
      },
      set(val) {
        this.$emit("update:limit", val);
      }
    }
  },
  methods: {
    handleSizeChange(val) {
      this.$emit("pagination", { page: this.currentPage, limit: val });
      /* if (this.autoScroll) {
        scrollTo(0, 800)
      } */
    },
    handleCurrentChange(val) {
      this.$emit("pagination", { page: val, limit: this.pageSize });
      /* if (this.autoScroll) {
        scrollTo(0, 800)
      } */
    }
  }
};
</script>

<style lang="less">
.Tethys-pagination-style {
  &.pagination-container {
    background: none;
    padding: 20px 16px;
  }
  &.pagination-container.hidden {
    display: none;
  }
}
.Theme-black {
  .Tethys-pagination-style {
    /* &.pagination-container {
      background: none;
      padding: 20px 16px;
    }
    &.pagination-container.hidden {
      display: none;
    } */
    .el-pagination .el-pagination__sizes .el-input__inner,
    .el-pagination .el-pagination__jump .el-input__inner {
      background: transparent !important;
      border: 1px solid #5c6586 !important;
      color: #dfe8ff;
    }
    .el-pagination__total,
    .el-pagination__jump {
      color: #dfe8ff;
    }
    .el-pagination.is-background .btn-next,
    .el-pagination.is-background .btn-prev,
    .el-pagination.is-background .el-pager li {
      background-color: transparent;
      border: 1px solid #5c6586;
      color: rgba(223, 232, 255, 1);
      border-radius: 4px;
      font-weight: 400;
    }
    .el-pagination__editor.el-input {
      margin: auto 5px;
    }
    .el-pagination__editor.el-input .el-input__inner {
      height: 28px !important;
      border-radius: 4px;
    }
    .el-pagination.is-background .el-pager li:not(.disabled).active {
      border: none;
      background-color: #237ae4;
    }
  }
}
</style>
