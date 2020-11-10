<template>
  <div class="list-content">
    <div class="search">
      <el-input
        placeholder="搜索项目名称"
        style="width:413px;height:42px;"
        v-model="searchKey"
        clearable
        @clear="search"
      />
      <el-button
        class="searchBtn"
        type="primary"
        icon="el-icon-search"
        @click="search"
        >搜索</el-button
      >
      <el-button class="projectMapBtn" type="primary" @click="gotoProjectMap"
        >地图模式</el-button
      >
    </div>
    <div class="ptable">
      <el-table :data="tableData" height="100%">
        <el-table-column
          prop="projectName"
          label="项目名称"
          align="center"
        ></el-table-column>
        <el-table-column prop="subProjectName" label="应用名称" align="center">
          <template slot-scope="{ row }">
            <div class="project-name">
              <span>{{ row.appName }}</span>
              <el-button
                type="primary"
                size="small"
                @click="clickProjectList(row)"
                >进入应用</el-button
              >
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-button
      v-if="userLevel > 0"
      type="primary"
      @click="goUserManage"
      style="marginTop: 30px;"
      >用户管理</el-button
    >
    <el-pagination
      style="float:right;margin-right: 80px;margin-top: 30px;"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagination.currentPage"
      :page-sizes="[5, 10, 100, 200, 500]"
      :page-size="pagination.pageSize"
      background
      layout="total, sizes, prev, pager, next, jumper"
      :total="pagination.totalItems"
    ></el-pagination>
  </div>
</template>
<script>
import { getUser } from "@/util/localStorage.js";
import { getRunProjectList } from "../../../api/usermanage";
let Domain = window.location.hostname;
export default {
  name: "ProjectList",
  data() {
    return {
      userLevel: 0,
      tableData: [],
      searchKey: "", //搜索框绑定的值
      pagination: {
        currentPage: 1,
        pageSize: 10,
        totalItems: 1,
        totalPages: 1
      }
    };
  },
  created() {
    this.$store.dispatch("setLoadData", false);
    this.$store.dispatch("setConfig", null);
    this.getProjectList();
  },
  mounted() {
    // this.userLevel = getUser().admin.userLevel || 0;
  },
  methods: {
    async getProjectList() {
      //获取项目列表
      // let params = {
      //   projectTypeId: "",
      //   key: this.searchKey,
      //   pageIndex: this.pagination.currentPage,
      //   pageSize: this.pagination.pageSize,
      //   time: "",
      //   order: "",
      //   where: ""
      // };
      let params = {
        Domain: Domain,
        Key: this.searchKey,
        PageIndex: this.pagination.currentPage,
        PageSize: this.pagination.pageSize
      };
      let res = await getRunProjectList(params);
      if (res.statusCode != 200) {
        return false;
      }
      let { currentPage, pageSize, totalItems, totalPages, items } = res.data;
      // if (items.length === 1) {
      //   this.clickProjectList(items[0]);
      //   return;
      // }
      this.tableData = items;
      this.pagination = {
        currentPage,
        pageSize,
        totalItems,
        totalPages
      };
      this.userLevel = getUser().admin.userLevel || 0;
    },
    search() {
      this.getProjectList();
    },
    //项目列表条目点击事件
    clickProjectList(row) {
      this.$store.dispatch("setProjectInfo", row).then(() => {
        this.$router.replace({
          name: "load"
        });
      });
    },
    formatter(row) {
      return row.address;
    },
    handleSizeChange(val) {
      this.pagination.pageSize = val;
      this.getProjectList();
    },
    handleCurrentChange(val) {
      this.pagination.currentPage = val;
      this.getProjectList();
    },
    goUserManage() {
      this.$router.push({ path: "/project/user" });
    },
    gotoProjectMap() {
      this.$router.push({ name: "projectMap" });
    }
  }
};
</script>
<style>
/* 分页1，2，3数据li标签 */
/* .el-pagination.is-background .el-pager li {
  border-color: #4a5053;
  background-color: #202429;
} */
/* 分页前面箭头 */
/* .el-pagination.is-background .btn-prev {
  background-color: #202429;
} */
/* 分页后面箭头 */
/* .el-pagination.is-background .btn-next {
  background-color: #202429;
} */

/* //表格颜色 */
.ptable .el-table__header th {
  padding: 0;
  height: 42px;
  background-color: #409eff !important;
  color: #fff;
  box-shadow: -2px -2px 8px #63696e;
}
.ptable .el-table tr {
  background-color: #202429 !important;
  font-size: 16px;
  color: #f2f6fc;
}
.ptable .el-table tr:hover > td {
  background-color: #63696e !important;
}

/* //上箭头 */
.ptable .el-table .ascending .sort-caret.ascending {
  border-bottom-color: #63696e;
}
/* 下箭头 */
.ptable .el-table .descending .sort-caret.descending {
  border-top-color: #63696e;
}
/* 搜索框和前往页面输入框 */
.ptable .search .el-input__inner {
  background: #202429;
  border: 1px solid #32383f;
}
/* 表格颜色 */
.ptable .el-table td,
.ptable .el-table th.is-leaf {
  border: 1px solid #32383f;
}
/* 设置完表格颜色，但是表格底部线还是白色，其实是背景色导致的 */
.ptable .el-table::before {
  background-color: #32383f;
}
/* 设置完表格颜色，但是表格右部线还是白色，其实是背景色导致的 */
.ptable .el-table,
.ptable .el-table__expanded-cell {
  /* background-color: #32383f; */
  background-color: #05090f;
}

/* 右边滚动条 */
.ptable
  .el-table--scrollable-y
  .el-table__body-wrapper::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  background-color: #b2ddff;
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
}
.searchBtn {
  margin-left: 5px;
}
</style>

<style lang="less" scoped>
.list-content {
  height: 100%;
  width: 100%;
  .search {
    margin-bottom: 22px;
  }
  .ptable {
    height: calc(100% - 126px);
  }
}
.project-name {
  display: flex;
  height: 100%;
  align-items: convert;
  span {
    flex: 1;
    line-height: 40px;
  }
}
.projectMapBtn {
  float: right;
}
</style>
