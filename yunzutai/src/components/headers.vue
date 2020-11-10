<template>
  <div class="header" :style="bodyStyle" @mousedown="clearVms">
    <div class="left" v-show="logoVisible || subVisible">
      <img
        v-show="logoVisible"
        :src="logoUrl"
        :style="{ height: config['启用Logo'].num + '%' }"
      />
      <span class="headerTitle" v-show="subVisible" :style="subStyle">
        {{ subtitle }}
      </span>
    </div>
    <div class="center" :style="titleLocation">
      <div :style="titleShadow">
        <span :data-content="title" :style="titleStyle">{{ title }}</span>
      </div>
    </div>
    <div class="right">
      <div class="icon messege">
        <span class="iconfont iconzhixian"></span>
      </div>

      <div
        v-show="config['启用天气'].value[4]"
        :style="skyStyle"
        class="weather"
      >
        <i
          :style="{ marginRight: '10px', fontSize: weatherImgSize + 'px' }"
          class="iconfont iconqingtian"
        ></i>
        <span>晴 24°C~35°C 东风 2级 1970-01-01 星期三 {{ city }}</span>
      </div>
      <div v-show="config['启用运行时间'].value" class="runtime">
        安全运行99天9时9分9秒
      </div>
      <Screenfull class="hover-effect" />
      <div class="icon messege" @click="showWarnDialog">
        <el-badge is-dot class="item">
          <span class="iconfont iconxiaoxi"></span>
        </el-badge>
      </div>
      <el-dropdown
        @command="handleCommand"
        trigger="click"
        placement="bottom-end"
      >
        <div class="icon el-dropdown-link cirle-box">
          <span class="iconfont iconmorentouxiang"></span>
        </div>
        <!-- <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
            :title="loginName"
            style="width:82px;    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis; "
            command="1"
            ><span class="iconfont iconwode1" style="margin-right: 4px;"></span
            >{{ loginName }}</el-dropdown-item
          >
          <el-dropdown-item style="width:82px" command="2"
            ><span class="iconfont iconjiben" style="margin-right: 4px;"></span
            >项目列表</el-dropdown-item
          ><el-dropdown-item style="width:82px" command="3"
            ><i class="el-icon-delete"></i>帮助文档</el-dropdown-item
          >
          <el-dropdown-item style="width:80px" command="4" divided
            ><span class="iconfont iconRight" style="margin-right: 4px;"></span
            >退出</el-dropdown-item
          >
        </el-dropdown-menu>-->
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
            :title="loginName"
            style="width:82px;    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis; "
            command="1"
          >
            <i class="el-icon-user"></i>
            {{ loginName }}
          </el-dropdown-item>
          <el-dropdown-item style="width:82px" command="2">
            <i class="el-icon-tickets"></i>项目列表
          </el-dropdown-item>
          <el-dropdown-item style="width:82px" command="3">
            <i class="el-icon-help"></i>帮助文档
          </el-dropdown-item>
          <el-dropdown-item style="width:80px" command="4" divided>
            <span class="iconfont iconRight" style="margin-right: 4px;"></span
            >退出
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-dialog
      custom-class="dialogs"
      title="绑定页面"
      width="20%"
      :visible.sync="warnVisible"
      :before-close="resetForm"
      append-to-body
    >
      <el-form
        :model="routeForm"
        label-width="80px"
        :rules="myrules"
        ref="forms"
        inline
      >
        <el-form-item label="页面类型" required>
          <el-select
            v-model="routeForm.type"
            style="width:200px"
            @change="getRouteLinkPages"
          >
            <el-option label="单页面" value="single"></el-option>
            <el-option label="多页面" value="multi"></el-option>
            <el-option label="系统页面" value="system"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择页面" required show-message prop="pageId">
          <el-select
            style="width:200px"
            v-model="routeForm.pageId"
            placeholder="请选择页面"
            clearable
          >
            <el-option
              v-for="item in routesLinkPages"
              :key="item.name"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="bindWarnPage">确 定</el-button>
        <el-button @click="resetForm">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import logoBlack from "@/assets/image/chnt-b.svg";
import logoWhite from "@/assets/image/chnt-w.svg";
import { packFont } from "@/util/common.js";
import Screenfull from "../component/screenfull/index";
import { getUser, clear } from "../util/localStorage";
import systemPages from "@/config/systemSource.json";
export default {
  components: {
    Screenfull
  },
  data() {
    return {
      theme: null,
      white: {
        isLogo: false, //是否启用自定义logo
        logoUrl: "",
        color: "", //标题颜色
        deg: 0, //渐变角度
        gradColor: "", //渐变颜色
        topBackground: "#3573c1", //北京
        titleSdColor: "#1E88E5", //标题阴影颜色
        subColor: "#FC4B6C", //副标题颜色
        shadow: "" //边框方光色
      },
      black: {
        isLogo: false,
        logoUrl: "",
        color: "#FFFFFF",
        deg: 0,
        gradColor: "",
        topBackground: "#2d3035",
        titleSdColor: "#1E88E5",
        subColor: "#FC4B6C",
        shadow: ""
      },
      config: {
        标题: {
          type: "inputFontStyle",
          value: ["新能源科技有限公司", "22px", "", "normal", "#FFFFFF"]
        },
        启用标题渐变色: {
          type: "slider-gradient",
          used: true,
          range: [0, 360],
          value: ["", 0]
        },
        启用标题阴影: {
          type: "shadowStyle",
          value: ["", "2px", "2px", "2px", false]
        },
        标题位置: {
          type: "select",
          label: [
            {
              label: "左",
              value: "flex-start"
            },
            {
              label: "居中",
              value: "center"
            },
            {
              label: "右",
              value: "flex-end"
            }
          ],
          value: "flex-start"
        },
        启用副标题: {
          type: "inputFontStyle",
          note: "启用",
          value: ["能效综合平台", "14px", "", "normal", "#FFFFFF", true]
        },
        背景色: {
          type: "color-select",
          value: "#2d3035"
        },
        边框发光色: {
          type: "color-select",
          value: "rgba(255, 255, 255, 0)"
        },
        样式还原: {
          type: "resetStyle"
        },
        线条1: {
          type: "line"
        },
        隐藏顶部导航: {
          type: "checkbox",
          note: "启用",
          value: false
        },
        线条2: {
          type: "line"
        },
        启用Logo: {
          type: "logo",
          note: "启用",
          num: 36,
          value: ["", false, true]
        },
        线条3: {
          type: "line"
        },
        启用运行时间: {
          type: "checkbox",
          note: "启用",
          value: false
        },
        线条4: {
          type: "line"
        },
        启用天气: {
          type: "sky",
          note: "启用",
          value: ["14px", "", "", "rgba(255,255,255,1)", false, "上海"]
        }
      },
      bodyStyle: {},
      logoUrl: "",
      logoVisible: true,
      subVisible: true,
      title: "",
      titleStyle: {},
      titleShadow: {},
      titleLocation: {},
      subtitle: "",
      subStyle: {},
      skyStyle: {},
      weatherImgSize: 21,
      city: "上海",
      loginName: "",
      warnVisible: false,
      routeForm: {
        type: "",
        pageId: ""
      },
      myrules: {
        pageId: [{ required: true, message: "请选择页面" }]
      },
      routesLinkPages: [],
      warnPage: {
        type: "",
        pageId: ""
      }
    };
  },
  watch: {
    "$store.getters.theme"(val) {
      this.theme = val;
      this.config["标题"].value[4] = this[val].color;
      this.config["背景色"].value = this[val].topBackground;
      this.config["启用标题渐变色"].value = [
        this[val].gradColor,
        this[val].deg
      ];
      this.config["启用标题阴影"].value[0] = this[val].titleSdColor;
      this.config["启用副标题"].value[4] = this[val].subColor;
      this.config["边框发光色"].value = this[val].shadow;
      this.config["启用Logo"].value[0] = this[val].logoUrl;
      this.config["启用Logo"].value[1] = this[val].isLogo;
      this.themeChange();
    }
  },
  created() {
    this.theme = this.$store.getters.theme;
    let topConfig = this.$store.state.config.stylesConfig.topConfig;
    Object.assign(this.config, topConfig.config);
    Object.assign(this.white, topConfig.white);
    Object.assign(this.black, topConfig.black);
    this.initStyle();
    this.loginName = getUser().admin.loginName;
    let warnConfig = this.$store.state.config.routeConfig.warnPage;
    this.warnPage = { ...warnConfig };
  },
  methods: {
    clearVms() {
      this.$drag.clearVms();
      this.$drag.showMenu({ classes: 66 });
    },
    themeChange() {
      this.initStyle();
    },
    initStyle(order) {
      let theme = this[this.theme];
      if (order === "resetStyle") {
        if (this.theme === "white") {
          theme.topBackground = "#3573c1";
          theme.color = "#FFFFFF";
          theme.deg = 0;
          theme.gradColor = "";
          theme.titleSdColor = "#1E88E5";
          theme.subColor = "#FC4B6C";
          theme.shadow = "";
        } else if (this.theme === "black") {
          theme.topBackground = "#2d3035";
          theme.color = "#FFFFFF";
          theme.deg = 0;
          theme.gradColor = "";
          theme.titleSdColor = "#1E88E5";
          theme.subColor = "#FC4B6C";
          theme.shadow = "";
        }

        this.config = {
          ...this.config,
          标题: {
            type: "inputFontStyle",
            value: ["新能源科技有限公司", "22px", "", "normal", "#FFFFFF"]
          },
          启用标题渐变色: {
            type: "slider-gradient",
            used: true,
            status: 1,
            range: [0, 360],
            value: ["", 0]
          },
          启用标题阴影: {
            type: "shadowStyle",
            value: ["", "2px", "2px", "2px", false]
          },
          标题位置: {
            type: "select",
            label: [
              {
                label: "左",
                value: "flex-start"
              },
              {
                label: "居中",
                value: "center"
              },
              {
                label: "右",
                value: "flex-end"
              }
            ],
            value: "flex-start"
          },
          启用副标题: {
            type: "inputFontStyle",
            note: "启用",
            value: ["能效综合平台", "14px", "", "normal", "#FFFFFF", true]
          },
          背景色: {
            type: "color-select",
            value: theme.topBackground
          },
          边框发光色: {
            type: "color-select",
            value: "rgba(255, 255, 255, 0)"
          }
        };
      }
      theme.topBackground = this.config["背景色"].value;
      theme.color = this.config["标题"].value[4];
      theme.deg = this.config["启用标题渐变色"].value[1];
      theme.gradColor = this.config["启用标题渐变色"].value[0];
      theme.titleSdColor = this.config["启用标题阴影"].value[0];
      theme.subColor = this.config["启用副标题"].value[4];
      theme.shadow = this.config["边框发光色"].value;

      this.skyStyle = this.config["启用天气"].value[4]
        ? packFont(this.config["启用天气"].value)
        : {};
      if (this.skyStyle && this.skyStyle.fontSize) {
        this.weatherImgSize =
          Number(this.skyStyle.fontSize.substring(0, 2)) + 7;
      }
      this.title = this.config["标题"].value[0];
      if (typeof this.config["启用天气"].value.slice(-1)[0] !== "string") {
        let city = this.config["启用天气"].value.slice(-1)[0];
        this.city = city[city.length - 1];
      } else {
        this.city = this.config["启用天气"].value.slice(-1)[0];
      }
      this.titleStyle = !this.config["启用标题渐变色"].used
        ? {
            "--deg": "0deg"
          }
        : {
            "--deg": `${this.config["启用标题渐变色"].value[1]}deg`,
            "--gradient": this.config["启用标题渐变色"].value[0]
          };
      let shadow = this.config["启用标题阴影"].value;
      this.titleShadow = Object.assign(
        {
          textShadow: shadow[4]
            ? `${shadow[1]} ${shadow[2]} ${shadow[3]} ${shadow[0]}`
            : ""
        },
        packFont(this.config["标题"].value.slice(1))
      );
      this.titleLocation = {
        justifyContent: this.config["标题位置"].value
      };

      theme.isLogo = this.config["启用Logo"].value[1];
      if (theme.isLogo) {
        this.logoUrl = this.config["启用Logo"].value[0];
      } else {
        this.logoUrl =
          this.config["启用Logo"].value[0] ||
          (this.theme === "black" ? logoBlack : logoWhite);
      }
      theme.logoUrl = this.config["启用Logo"].value[0];
      this.logoVisible = this.config["启用Logo"].value[2];
      this.subVisible = this.config["启用副标题"].value[5];
      this.subtitle = this.config["启用副标题"].value[0];
      this.subStyle = packFont(this.config["启用副标题"].value.slice(1));
      this.bodyStyle = {
        background: this.config["背景色"].value,
        boxShadow: this.config["边框发光色"].value + " 0px 0px 10px 0px inset"
      };
    },
    handleCommand(command) {
      if (command == "2") {
        this.onProjectList();
      } else if (command == "3") {
        window.open(
          "https://chintcloud.oss-cn-shanghai.aliyuncs.com/prd/cloud-config/ComponentOperationManual/v1.0%20.pdf"
        );
      } else if (command == "4") {
        this.onLogout();
      }
    },
    onProjectList() {
      this.$confirm("是否确定返回项目列表页?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        closeOnClickModal: false
      })
        .then(() => {
          // 跳转到项目列表页面
          this.$router.replace("/ProjectList");
        })
        .catch(() => {});
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
          this.$router.replace("/Login");
        })
        .catch(() => {});
    },
    showWarnDialog() {
      if (this.$store.state.runtime) {
        let routes = this.$chint.getRouteList();
        let target, parentItem;
        for (let item of routes) {
          if (item.linkPage === this.warnPage.pageId) {
            target = item;
            break;
          }
          for (let i of item.children) {
            if (i.linkPage === this.warnPage.pageId) {
              target = i;
              parentItem = item;
              break;
            }
          }
          if (target) break;
        }
        if (!target) {
          this.$message({
            type: "warning",
            message: "未找到界面!"
          });
        }
        this.$drag.$left.$refs.routes.selectRoutes(target, parentItem);
        return;
      }
      this.routeForm = {
        type: this.warnPage.type || "single",
        pageId: this.warnPage.pageId
      };
      this.getRouteLinkPages();
      this.warnVisible = true;
    },
    bindWarnPage() {
      this.$refs["forms"].validate(valid => {
        if (!valid) return;
        this.warnPage = { ...this.routeForm };
        this.warnVisible = false;
      });
    },
    resetForm() {
      this.warnVisible = false;
    },
    getRouteLinkPages(flag) {
      let pages = this.$chint.getPageList();
      this.routeForm.pageId = flag ? "" : this.routeForm.pageId;
      switch (this.routeForm.type) {
        case "system":
          pages = systemPages;
          break;
        default:
          pages = pages.filter(page => {
            return page.type === this.routeForm.type;
          });
          break;
      }
      this.routesLinkPages = pages;
    }
  }
};
</script>
<style lang="less" scoped>
.header {
  color: white;
  display: flex;
  width: calc(100%);
  flex-direction: row;
  .left {
    min-width: 200px;
    width: 200px;
    height: calc(100%);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .headerTitle {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    img {
      height: 22px;
      padding-bottom: 5px;
      max-width: 100%;
    }
  }
  .right {
    min-width: 200px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
    font-size: 14px;
    margin-right: 20px;
    .weather {
      white-space: normal;
      margin-right: 30px;
      display: flex;
      align-items: center;
    }
    .runtime {
      white-space: normal;
      margin-right: 30px;
    }
    .icon {
      /deep/.el-badge__content {
        background-color: #e6a23c;
      }
      .iconxiaoxi {
        font-size: 20px;
        &:hover {
          color: #409eff;
        }
      }
    }
    .cirle-box {
      background-color: rgba(0, 0, 0, 0.2);
      width: 34px;
      height: 34px;
      line-height: 34px;
      border-radius: 50%;
      color: #fff;
      font-size: 16px;
      text-align: center;
      cursor: pointer;
      .iconmorentouxiang {
        &:hover {
          color: #3573c1;
        }
      }
    }
    .messege {
      margin-right: 30px;
    }
  }
  .center {
    flex: 1;
    height: calc(100%);
    position: relative;
    display: flex;
    align-items: center;
    div {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      span {
        position: relative;
        display: inline-block;
        &::after {
          position: absolute;
          content: attr(data-content);
          text-decoration: none;
          top: 0;
          left: 0;
          z-index: 2;
          color: var(--gradient);
          -webkit-mask-image: linear-gradient(var(--deg), #000, transparent);
          -webkit-mask-size: 100% 100%;
        }
      }
    }
  }
}
.el-dialog__wrapper {
  /deep/.dialogs {
    min-width: 240px;
    .el-dialog__header {
      padding-bottom: 10px;
      border-bottom: 1px solid #ccc;
      font-weight: 700;
    }
  }
}
</style>
