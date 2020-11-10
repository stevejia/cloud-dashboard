<template>
  <div class="box">
    <div class="top">
      <span>{{ organizeName }}云组态中心</span>
      <div class="rightinfo">
        <Screenfull class="right-menu-item hover-effect" />
        <i class="el-icon-user"></i>
        <div class="loginName">{{ loginName }}</div>
        <el-button icon="el-icon-switch-button" @click="onLogout"></el-button>
      </div>
    </div>
    <div class="content">
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
        <!-- <el-button class="projectMapBtn" type="primary" @click="gotoProjectMap"
          >地图模式</el-button
        >-->
      </div>
      <div class="ptable">
        <el-table :data="tableData" height="100%">
          <el-table-column
            prop="projectName"
            label="项目名称"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="subProjectName"
            label="应用名称"
            align="center"
          >
            <template slot-scope="{ row }">
              <div class="project-name">
                <span class="title wraper" :title="row.subProjectName">{{
                  row.subProjectName
                }}</span>
                <el-button type="primary" size="small" @click="importJson(row)">
                  <i class="iconfont icondaoru"></i>导入
                </el-button>
                <el-button type="primary" size="small" @click="exportJson(row)">
                  <i class="iconfont icondaochu"></i>导出
                </el-button>
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
    <input
      type="file"
      ref="fileInput"
      accept="application/json"
      style="display:none"
      @change="fileChange"
    />
  </div>
</template>
<script>
import Screenfull from "../../component/screenfull/index";
import { clear } from "@/util/localStorage.js";
import { getProjectList } from "../../api/usermanage.js";
import {
  getConfig,
  setConfig,
  getPointsData,
  setPointsData
} from "../../api/server.js";
export default {
  name: "ProjectList",
  components: {
    Screenfull
  },
  data() {
    return {
      tableData: [],
      loginName: "",
      organizeName: "", //标题
      searchKey: "", //搜索框绑定的值
      pagination: {
        currentPage: 1,
        pageSize: 10,
        totalItems: 1,
        totalPages: 1
      },
      curProjectId: ""
    };
  },
  created() {
    this.$store.dispatch("setLoadData", false);
    this.$store.dispatch("setConfig", null);
    this.getProjectList();
  },
  mounted() {},
  computed: {},
  methods: {
    async getProjectList() {
      //获取项目列表
      let params = {
        projectTypeId: "",
        key: this.searchKey,
        pageIndex: this.pagination.currentPage,
        pageSize: this.pagination.pageSize,
        time: "",
        order: "",
        where: ""
      };
      let res = await getProjectList(params);
      let { currentPage, pageSize, totalItems, totalPages, items } = res.data;
      this.tableData = items;
      this.pagination = {
        currentPage,
        pageSize,
        totalItems,
        totalPages
      };
    },
    handleEdit(index, row) {
      console.log(index, row);
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
    onLogout() {
      this.$confirm("是否确定退出系统?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        closeOnClickModal: false
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "退出成功!"
          });
          clear();
          // 跳转到登录页面
          this.$router.replace("/login");
        })
        .catch(() => {});
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
    exportJson(row) {
      getConfig({ pid: row.subProjectId }).then(res => {
        let data = res.data || res.body;
        this.saveJSON(data, `${row.subProjectName}.json`);
      });
    },
    importJson(row) {
      this.$confirm(
        "此操作将覆盖原应用,请确保应用已导出备份,是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          this.curProjectId = row.subProjectId;
          this.$refs.fileInput.click();
        })
        .catch(() => {});
    },
    fileChange() {
      let that = this;
      let file = this.$refs.fileInput.files[0];
      let reader = new FileReader();
      reader.readAsText(file);
      reader.onload = function() {
        // console.log(this.result);
        // console.log(JSON.parse(this.result));
        try {
          let config = JSON.parse(this.result);
          if (config.pid !== that.curProjectId) {
            config.pid = that.curProjectId;
            config = that.tranlateData(config);
            // console.log(config);
            for (let key in config.centerConfigs) {
              let item = config.centerConfigs[key];
              // console.log(item);
              if (!item.compConfigs) continue;
              item.compConfigs.map(item2 => {
                // console.log(item2);
                let comp = item2.compConfig;
                if (comp && comp.collectPointIds) comp.collectPointIds = [];
                if (!comp || !comp.highConfig) return;
                for (let key2 in comp.highConfig) {
                  // console.log(key2);
                  that.clearPointId(comp.highConfig[key2]);
                }
              });
              config.centerConfigs[key] = JSON.stringify(item);
              // console.log(config.centerConfigs[key]);
            }
            for (let item of config.treeConfigList) {
              if (item.compConfig && item.compConfig.highConfig) {
                for (let key in item.compConfig.highConfig) {
                  that.clearPointId(item.compConfig.highConfig[key]);
                }
              }
              if (item.compConfig && item.compConfig.treeData) {
                that.clearTreePointId(item.compConfig.treeData);
              }
            }
            config.treeConfigList = JSON.stringify(config.treeConfigList);
            // console.log(config);
            that.clenrPoints(that.curProjectId);
          }
          setConfig(config).then(res => {
            // console.log(res);
            if (res.statusCode === 200) {
              that.$message({
                type: "success",
                message: "导入配置成功!"
              });
            }
          });
        } catch {
          that.$message({
            type: "error",
            message: "文件内容异常!"
          });
        }
      };
    },
    tranlateData(data) {
      let centerConfigs = data.centerConfigs;
      for (let key in centerConfigs) {
        centerConfigs[key] = JSON.parse(centerConfigs[key]);
        if (!centerConfigs[key].white) {
          centerConfigs[key].white = {
            backImage: ""
          };
          centerConfigs[key].black = {
            backImage: ""
          };
        }
      }
      data.treeConfigList = JSON.parse(data.treeConfigList);
      let stylesConfig = data.stylesConfig;

      if (stylesConfig.white && stylesConfig.black) {
        //配置转换,历史信息不保存
        data.stylesConfig = {
          theme: {
            主题切换: {
              type: "select",
              label: [
                {
                  label: "主题一",
                  value: "black"
                },
                {
                  label: "主题二",
                  value: "white"
                }
              ],
              value: "black"
            }
          },
          topConfig: {
            white: {},
            black: {},
            config: {}
          },
          leftConfig: {
            config: {},
            white: {},
            black: {}
          },
          centerConfig: {
            config: {},
            white: {},
            black: {}
          },
          userConfig: {
            config: {}
          }
        };
        if (stylesConfig.theme["页面选项"].label.length === 3) {
          stylesConfig.theme["页面选项"].label = [
            {
              label: "固定尺寸",
              value: "0"
            },
            {
              label: "适应宽度",
              value: "1"
            },
            {
              label: "适应全部",
              value: "2"
            },
            {
              label: "铺满尺寸",
              value: "3"
            }
          ];
        }
      }
      return data;
    },
    saveJSON(data, filename) {
      if (!data) {
        this.$message({
          type: "error",
          message: "数据异常!"
        });
        return;
      }
      if (!filename) filename = "json.json";
      if (typeof data === "object") {
        data = JSON.stringify(data, undefined, 4);
      }
      var blob = new Blob([data], { type: "text/json" }),
        e = document.createEvent("MouseEvents"),
        a = document.createElement("a");
      a.download = filename;
      a.href = window.URL.createObjectURL(blob);
      a.dataset.downloadurl = ["text/json", a.download, a.href].join(":");
      e.initMouseEvent(
        "click",
        true,
        false,
        window,
        0,
        0,
        0,
        0,
        0,
        false,
        false,
        false,
        false,
        0,
        null
      );
      a.dispatchEvent(e);
    },
    clearPointId(item) {
      switch (item.type) {
        case "eventOpacity":
          item.value.pointId = [];
          break;
        case "eventVisible":
          item.value.pointId = [];
          break;
        case "eventColor":
          item.value.pointId = [];
          break;
        case "eventColorChange":
          item.value.pointId = [];
          break;
        case "event":
          for (let i of item.value) {
            if (i.permitPointId) i.permitPointId = [];
            if (i.pointId) i.pointId = [];
            for (let n of i.result) {
              if (n.pointId) n.pointId = [];
            }
          }
          break;
        case "eventMap":
          item.value = [];
          break;
        case "seriesData":
          for (let i of item.value) {
            i.pointId = [];
          }
          break;
        case "treeConfig":
          item.pointIds = [];
          break;
        case "pieNestedSeries":
          for (let i of item.value) {
            i.pointId = [];
            i.totalPointId = [];
          }
          break;
        case "composeSeriesData":
          for (let i of item.value) {
            i.pointId = [];
          }
          break;
        case "composeSeriesData2":
          for (let i of item.value) {
            i.pointId = [];
          }
          break;
        case "composeSeriesData3":
          for (let i of item.value) {
            i.pointId = [];
          }
          break;
        case "dataTree":
          item.value = [];
          break;
        case "eventBtn":
          for (let i of item.value) {
            i.off.predev = [];
            i.open.predev = [];
            if (i.open.curdevchar) i.open.curdevchar = [];
            if (i.off.curdevchar) i.off.curdevchar = [];
            for (let m of i.open.valueList) {
              if (m.curdev) m.curdev = [];
            }
            for (let z of i.off.valueList) {
              if (z.curdev) z.curdev = [];
            }
          }
          break;
        case "modeToggle":
          for (let i of item.data.wbEventList) {
            i.curdevchar = [];
          }
          break;
        case "dataTreeLinkage":
          for (let i of item.params) {
            i.value = [];
          }
          break;
        default:
          break;
      }
      return item;
    },
    clearTreePointId(treeArr) {
      for (let item of treeArr) {
        if (item.linkData) item.linkData.pointIds = [];
        if (item.children) this.clearTreePointId(item.children);
      }
    },
    clenrPoints(pid) {
      getPointsData({ pid }).then(res => {
        // console.log(res);
        if (res.statusCode !== 200 || !res.body) res.body = {};
        if (res.body.pointGroup) {
          for (let item of res.body.pointGroup) {
            item.piTs = [];
          }
        }
        let param = {
          pid,
          pointGroup: res.body.pointGroup || []
        };
        setPointsData(param).then(() => {});
      });
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
  font-size: 18px;
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

.rightinfo .el-button {
  float: left;
  height: 60px;
  width: 40px;
  background-color: #3573c1;
  color: #fff;
  border-style: none;
  border-radius: 0px;
  padding: 0;
  margin-left: 35px;
}
.rightinfo .el-button:focus,
.rightinfo .el-button:hover {
  background-color: #3573c1;
  color: #fff;
  opacity: 0.9;
}
.searchBtn {
  margin-left: 5px;
}
</style>

<style lang="less" scoped>
.box {
  height: 100%;
  .top {
    height: 60px;
    background-color: #202429;
    position: relative;
    span {
      line-height: 60px;
      color: #00ccff;
      font-size: 26px;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate3d(-50%, -50%, 0);
    }
    .rightinfo {
      justify-content: flex-end;
      display: flex;
      align-items: center;
      .right-menu-item {
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 20px;
        color: #fff;
        margin-right: 50px;
        vertical-align: text-bottom;
        &.hover-effect {
          cursor: pointer;
          // transition: background 0.3s;
          &:hover {
            // background: rgba(0, 0, 0, 0.3);
          }
        }
      }
      i {
        font-size: 18px;
        color: #fff;
        margin-right: 10px;
      }
      .loginName {
        color: #fff;
        text-align: center;
      }
    }
  }
  .content {
    height: calc(100% - 177px);
    background-color: #05090f;
    padding: 77px 80px 40px;
    .search {
      margin-bottom: 22px;
    }
    .ptable {
      height: calc(100% - 126px);
    }
  }
  .project-name {
    display: flex;
    align-items: center;
    justify-content: space-between;
    overflow: hidden;
    .title {
      flex-grow: 1;
      padding: 0 10px;
      overflow: hidden;
      text-align: center;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .iconfont {
      margin-right: 4px;
      font-size: 12px;
      vertical-align: baseline;
    }
  }
  .ptable /deep/ .el-table {
    tr {
      &:hover > td {
        background-color: #16191d !important;
      }
    }
  }
}
.projectMapBtn {
  float: right;
}
</style>
