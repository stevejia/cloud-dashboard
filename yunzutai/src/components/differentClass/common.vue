<template>
  <div class="comp">
    <el-collapse v-model="activeName" accordion>
      <el-collapse-item title="主题" name="1">
        <packComp
          :config="layoutVm ? layoutVm.themeConfig : {}"
          :type="'theme'"
          :onChange="initStyle"
        ></packComp>
      </el-collapse-item>
      <el-collapse-item title="顶部编辑" name="2">
        <packComp
          v-if="topBool"
          :config="header ? header.config : {}"
          :type="'top'"
          :onChange="initStyle"
        ></packComp>
      </el-collapse-item>
      <el-collapse-item title="中心区域编辑" name="3">
        <packComp
          v-if="centerBool"
          :config="center ? center.config : {}"
          :type="'center'"
          :onChange="initStyle"
        ></packComp>
      </el-collapse-item>
      <el-collapse-item title="左侧导航编辑" name="4">
        <packComp
          v-if="leftBool"
          :config="lefter ? lefter.config : {}"
          :type="'left'"
          :onChange="initStyle"
        ></packComp>
      </el-collapse-item>
      <el-collapse-item title="用户入口编辑" name="5">
        <packComp
          :config="layoutVm ? layoutVm.userConfig : {}"
          :type="'user'"
          :onChange="initStyle"
        ></packComp>
        <el-button
          class="shareLien"
          type="primary"
          size="small"
          @click="shareLien"
        >
          创建项目引用
        </el-button>
      </el-collapse-item>
    </el-collapse>
    <div class="bottomDiv">- 我是有底线的 -</div>
  </div>
</template>

<script>
import packComp from "./pack/pack.vue";
import { getToken } from "@/api/api.js";
export default {
  components: {
    packComp
  },
  data() {
    return {
      topBool: true,
      centerBool: true,
      leftBool: true,
      activeName: "1",
      white: {
        topBackground: "#3573c1"
      },
      black: {
        topBackground: "#2d3035"
      },
      layoutVm: null,
      config: null,
      header: null,
      lefter: null,
      center: null,
      theme: null
    };
  },
  created() {
    this.layoutVm = this.$parent.$parent;
    this.config = this.layoutVm.config;
    // console.log(JSON.stringify(this.config));
  },
  mounted() {
    this.resets();
  },
  methods: {
    resets() {
      this.header = this.layoutVm.$refs.headers;
      this.lefter = this.layoutVm.$refs.lefters;
      this.center = this.$drag.$vm;
    },
    initStyle(type, order) {
      if (type == "theme" && order == "isPageSize") {
        this.layoutVm.initStyle("isPageSize");
      } else {
        switch (type) {
          case "theme":
            this.layoutVm.initStyle();
            break;
          case "top":
            if (order === "resetStyle") {
              this.topBool = false;
            }
            if (order === "隐藏顶部导航") {
              this.layoutVm.initStyle();
            } else {
              this.header.initStyle(order);
              this.$nextTick(() => {
                this.topBool = true;
              });
            }

            break;
          case "center":
            if (order === "resetStyle") {
              this.centerBool = false;
            }

            this.center.initStyle(order);
            this.$nextTick(() => {
              this.centerBool = true;
            });

            break;
          case "left":
            if (order === "resetStyle") {
              this.leftBool = false;
            }
            this.lefter.initStyle(order);
            this.$nextTick(() => {
              this.leftBool = true;
            });
            break;
          default:
            break;
        }
      }
    },
    // 分享
    shareLien() {
      var Input = document.createElement("input"); //创建一个隐藏input（重要！）
      let pageId = sessionStorage.getItem("shareRouteId");
      if (!pageId) {
        this.$message({ message: "请先绑定页面", type: "warning" });
        return;
      }
      let SubProjectId = window.sessionStorage.getItem("SubProjectId");
      let ProjectId = window.sessionStorage.getItem("ProjectId");
      getToken({ projectId: ProjectId, subProjectId: SubProjectId }).then(
        res => {
          let token = res.data;
          let Domain = sessionStorage.getItem("Domain");
          Input.value = `http://${Domain}/#/home?shareToken=${token}&sharePageId=${pageId}&SubProjectId=${SubProjectId}&ProjectId=${ProjectId}&shareAll=1`; //赋值
          document.body.appendChild(Input);
          Input.select(); // 选择对象
          document.execCommand("Copy"); // 执行浏览器复制命令
          Input.className = "oInput";
          Input.style.display = "none";
          this.$message({ message: "复制成功", type: "success" });
        }
      );
    }
  }
};
</script>

<style lang="less" scoped>
.shareLien {
  width: 100%;
}
.comp {
  height: calc(100%);
  width: calc(100%);
  background: #373e4a;
  overflow: overlay;
  &::-webkit-scrollbar {
    width: 4px;
    height: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: #e3e3e3;
    border-radius: 4px;
  }
  &::-webkit-scrollbar-resizer {
    background: #ff0bee;
  }
  & /deep/ .el-collapse {
    border-top: 0px;
    border-bottom: 1px solid #24252a;
  }
  & /deep/ .el-collapse-item__header {
    background: #737881;
    border-bottom: 1px solid #24252a;
    color: white;
    padding-left: 20px;
  }
  & /deep/ .el-collapse-item__wrap {
    overflow: inherit;
    border-bottom: 0px;
  }
  & /deep/ .el-collapse-item__content {
    background: #373e4a;
    color: #e9e9e9;
    padding: 16px 10px 20px;
    box-sizing: border-box;
  }
  & /deep/ .el-collapse-item__header {
    height: 36px;
    line-height: 36px;
  }
  .bottomDiv {
    text-align: center;
    color: #c0c4cc;
    font-size: 12px;
    padding-bottom: 20px;
  }
}
</style>
