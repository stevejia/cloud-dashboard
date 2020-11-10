<template>
  <div class="_home">
    <div class="home" :style="wholeStyle">
      <template v-for="page in pageList">
        <template v-if="page.type === 'multi' && page.origin === 'local'">
          <div
            class="multi"
            :key="page.linkPage"
            :id="'page-' + page.linkPage"
            :style="{
              display: page.linkPage === linkPageId ? '' : 'none'
            }"
          >
            <div class="tabs">
              <div
                :key="item.id"
                :class="
                  mulLinkPageId === item.id
                    ? 'tab wrapper backColor active'
                    : 'tab backColor wrapper'
                "
                v-for="item in page.pages"
                @mousedown.stop="selectMul(page.pages, item)"
              >
                <span class="xuanzhong">{{ item.name }}</span>
                <p />
              </div>
            </div>
            <div
              class="content"
              style="    height: calc(100% - 50px);width: calc(100%);"
            >
              <div class="contents" :style="{ ...otherStyle }">
                <div
                  v-for="item in page.pages"
                  :key="item.id"
                  :id="'page-' + item.id"
                  class="dragDiv dragss"
                  :style="{
                    display: item.id === mulLinkPageId ? '' : 'none',
                    ...styles,
                    ...backIm,
                    height: `${parseInt(styles.height.slice(0, -2)) - 50}px`
                  }"
                ></div>
                <!-- :style="{
                  display: item.id === mulLinkPageId ? '' : 'none',
                  ...styles,
                  height: `${parseInt(styles.height.slice(0, -2)) - 50}px`
                }"-->
              </div>
            </div>
          </div>
        </template>
        <template v-else>
          <div
            class="single"
            :key="page.linkPage"
            :style="{
              display: page.linkPage === linkPageId ? '' : 'none'
            }"
          >
            <div class="contents" :style="{ ...otherStyle }">
              <div
                :id="'page-' + page.linkPage"
                class="dragDiv dragss"
                :style="{ ...styles, ...backIm }"
              >
                <UserManage v-if="linkPageId === '用户管理'"></UserManage>
                <LogManage v-if="linkPageId === '操作日志'"></LogManage>
              </div>
            </div>
          </div>
        </template>
      </template>
    </div>
    <compContextmenu ref="contextmenu"></compContextmenu>
    <compMark ref="compMark"></compMark>
    <dialogCompose ref="dialogCompose"></dialogCompose>
    <dialogScenes ref="dialogScenes"></dialogScenes>
    <dialogTimer ref="dialogTimer"></dialogTimer>
    <dialogAps ref="dialogAps"></dialogAps>
  </div>
</template>
<script>
import LogManage from "@/system/LogManage.vue";
import UserManage from "@/system/UserManage.vue";
import compContextmenu from "@/components/contextmenu.vue";
import dialogCompose from "@/components/dialogCompose.vue";
import dialogScenes from "@/components/dialogScenes.vue";
import dialogTimer from "@/components/dialogTimer.vue";
import dialogAps from "@/components/dialogAps.vue";
import compMark from "@/components/mark.vue";
import { guid } from "@/util/common.js";
export default {
  components: {
    dialogTimer,
    dialogAps,
    dialogScenes,
    dialogCompose,
    compContextmenu,
    compMark,
    LogManage,
    UserManage
  },
  data() {
    return {
      scale: [1, 1],
      theme: null,
      query: this.$route.query,
      styles: {},
      backIm: {},
      wholeStyle: {},
      otherStyle: {},
      pageList: [],
      multPages: [],
      linkPageId: null,
      mulLinkPageId: null,
      white: {
        centerBackground: "#e2ecf1",
        otherColor: "rgba(255,255,255,0)"
      },
      black: {
        centerBackground: "#2B2E37",
        otherColor: "rgba(255,255,255,0)"
      },
      config: {
        外边距: {
          type: "slider",
          range: [0, 15],
          value: 15
        },
        线条1: {
          type: "line"
        },
        背景色: {
          type: "color-select",
          value: "#2B2E37"
        },
        栅格色: {
          type: "color-select",
          value: "rgba(255,255,255,0)"
        },
        样式还原: {
          type: "resetStyle"
        },
        线条2: {
          type: "line"
        },
        容器列表: {
          type: "containerSelect",
          value: ["", false]
        },
        线条3: {
          type: "line"
        },
        上传中心区域背景图: {
          type: "upload-image",
          value: {
            imgUrl: ""
          }
        }
      },
      notifys: null
    };
  },
  beforeDestroy() {
    this.$drag.destory();
    let bodyEl = document.querySelector("body");
    bodyEl.style = {};
  },
  watch: {
    "$store.getters.theme"(val) {
      this.theme = val;
      let theme = this[val];
      this.config["背景色"].value = theme.centerBackground;
      this.config["栅格色"].value = theme.otherColor;
      let pageId = this.$drag.currentPageId;
      if (pageId && this.$drag.centerConfigs[pageId]) {
        this.config[
          "上传中心区域背景图"
        ].value.imgUrl = this.$drag.centerConfigs[pageId].backImage;
      }
      this.gitWidth(val);
      // this.themeChange();
    }
  },
  created() {
    this.theme = this.$store.getters.theme;
    let centerConfig = this.$store.state.config.stylesConfig.centerConfig;
    Object.assign(this.config, centerConfig.config);
    Object.assign(this.white, centerConfig.white);
    Object.assign(this.black, centerConfig.black);
    // this.initStyle();

    this.$store.dispatch("setLoadData", false);
    let themeConfig = this.$store.state.config.stylesConfig.theme;
    let [width, height] = themeConfig["页面大小"].value;
    let pageState = this.$store.state.config.routeConfig.pageState;
    this.doResize(width, height, pageState);
  },
  mounted() {
    this.$drag.init(this);
    this.checkPassWord();
  },
  methods: {
    themeChange() {
      this.initStyle();
    },
    //显示右击菜单
    showContextMenu() {
      this.$drag.showContextmenu();
    },
    //初始化多页面
    initMulPages(pages) {
      this.multPages = pages;
    },
    //添加多页面
    addMul(pages) {
      this.multPages = pages;
      this.multPages.push({
        id: guid(),
        name: "新增页面-" + this.multPages.length
      });
    },
    //删除多页面
    deleteMulPage(pages, item, index) {
      this.multPages = pages;
      this.multPages.splice(index, 1);
      if (this.mulLinkPageId === item.id) {
        this.selectMul(this.multPages, this.multPages[0]);
      }
      this.$drag.deletePage(item.id, item);
    },
    //选择多页面页签
    selectMul(pages, item) {
      this.multPages = pages;
      if (this.mulLinkPageId === item.id) return;
      this.mulLinkPageId = item.id;
      this.$drag.currentPageId = item.id;
      this.$drag.loadmulLocal(item.id);
    },
    setSize() {
      let pages = this.$parent.$refs.lefters.$refs.pages.pages;
      let item = pages.find(_page => {
        return _page.id === this.linkPageId;
      });
      if (!item) return;
      let pageSizes = this.$parent.themeConfig["页面大小"];
      if (!pageSizes.checked) {
        let { width, height, pageState } = this.$store.state.config.routeConfig;
        this.$parent.themeConfig["页面大小"].value = [width, height];
        this.$parent.themeConfig["页面选项"].value = pageState;
      } else {
        this.$parent.themeConfig["页面大小"].value = [item.width, item.height];
        this.$parent.themeConfig["页面选项"].value = item.pageState;
      }
    },
    setStyles(width, height, pageState) {
      let bool = this.$parent.themeConfig["页面大小"].checked;
      if (bool) {
        let pages = this.$parent.$refs.lefters.$refs.pages.pages;
        let item = pages.find(_page => {
          return _page.id === this.linkPageId;
        });
        if (!item) return;
        item.width = width;
        item.height = height;
        item.pageState = pageState;
      } else {
        //给全局
        this.$store.state.config.routeConfig.width = width;
        this.$store.state.config.routeConfig.height = height;
        this.$store.state.config.routeConfig.pageState = pageState;
      }
    },
    //更新样式
    initStyle(order, mainLeft = 0) {
      // 分享判断
      if (
        this.$route.query.sharePageId &&
        this.$route.query.shareToken &&
        this.$route.query.shareAll == "0"
      ) {
        mainLeft = 1;
      }
      let theme = this[this.theme];
      let bool = true;
      if (order == "isPageSize") {
        this.setSize();
        bool = false;
      }
      if (order === "resetStyle") {
        if (this.theme === "white") {
          theme.centerBackground = "#e2ecf1";
          theme.otherColor = "rgba(255,255,255,0)";
        } else if (this.theme === "black") {
          theme.centerBackground = "#2B2E37";
          theme.otherColor = "rgba(255,255,255,0)";
        }
        this.config = {
          ...this.config,
          背景色: {
            type: "color-select",
            value: theme.centerBackground
          },
          栅格色: {
            type: "color-select",
            value: theme.otherColor
          }
        };
      }
      // 设置地图背景色
      this.$store.state.bgColor = this.config["背景色"].value;
      theme.centerBackground = this.config["背景色"].value;
      theme.otherColor = this.config["栅格色"].value;

      let top = this.$parent.mainTop;
      let left = mainLeft == 0 ? 200 : 0;
      let padding = this.config["外边距"].value;
      let pageState = this.$parent.themeConfig["页面选项"].value;
      let isMulti = this.$drag.currentPageType === "multi";
      let lWdith = this.$parent.themeConfig["页面大小"].value[0];
      let lHeight = this.$parent.themeConfig["页面大小"].value[1];
      lWdith = lWdith === "" ? 1920 : lWdith;
      lHeight = lHeight === "" ? 1080 : lHeight;
      let delW = padding * 2 + left;
      let delH = padding * 2 + top;
      if (isMulti) {
        delH = padding * 2 + top + 50;
      }
      let width = lWdith > delW ? lWdith - delW : 0;
      let height = lHeight > delH ? lHeight - delH : 0;
      if (bool) {
        this.setStyles(lWdith, lHeight, pageState);
      }
      this.styles = {
        width: width + "px",
        height: height + "px"
      };
      this.otherStyle = {
        padding: this.config["外边距"].value + "px"
      };
      this.wholeStyle = {
        background: this.config["背景色"].value
      };

      let back = this.config["上传中心区域背景图"].value.imgUrl;
      if (this.$drag) {
        let pageId = this.$drag.currentPageId;
        if (pageId && this.$drag.centerConfigs[pageId]) {
          let backImage = this.$drag.centerConfigs[pageId][this.theme]
            .backImage;
          if (backImage != back) {
            this.$drag.centerConfigs[pageId][this.theme].backImage = back;
          }
        }
      }
      this.backIm = {
        backgroundImage: back ? `url(${back})` : ""
      };
      let pages = this.$parent.$refs.lefters.$refs.pages.pages;
      let item = pages.find(_page => {
        return _page.id === this.linkPageId;
      });
      if (!item) return;
      let checked = this.$store.state.config.stylesConfig.theme["页面大小"]
        .checked;
      if (checked) {
        this.doResize(item.width, item.height, item.pageState);
      }
    },
    gitWidth(linkId) {
      let config = this.$parent.config.centerConfig;
      let left = 400;
      let widths = "100%";
      if (
        linkId != "清洗计划" &&
        linkId != "操作日志" &&
        linkId != "用户管理" &&
        linkId != "61f06766c7fb432e9b27261b80999726"
      ) {
        widths =
          config["页面大小"].value[0] -
          left -
          config["外边距"].value * 2 +
          "px";
      }
      this.styles.width = widths;
    },
    doResize(width, height, adapter) {
      this._resize(width, height, adapter);
      window.onresize = () => {
        this._resize(width, height, adapter);
      };
    },
    _resize(width, height, adapter) {
      //目前适配有4种方式 固定尺寸0 适应宽度1 适应全部2 适用宽度&高度3
      //对于固定尺寸来说 做任何限制
      if (adapter !== "0") {
        let bodyEl = document.querySelector("body");
        bodyEl.style.width = `${width}px`;
        bodyEl.style.height = `${height}px`;

        let { innerWidth, innerHeight } = window;
        let scaleX = innerWidth / width;
        let scaleY = innerHeight / height;
        let transformOriginX = "0";
        let transformOriginY = "0";
        let translateY = "-50%";
        let top = "50%";
        //适应宽度时
        if (adapter === "1") {
          bodyEl.parentNode.style.overflowX = "hidden";
          // let htmlHeight = bodyEl.parentNode.clientHeight;
          // let htmlWidth = bodyEl.parentNode.clientWidth;
          //如果宽度出现滚动条 需要用去掉滚动条宽度的净宽度去计算scale
          if (innerHeight < height * scaleX) {
            // scaleX = innerHeight / width;
            translateY = "0";
            top = "0";
          }
          scaleY = scaleX;
        }
        //适应全部
        if (adapter === "2") {
          bodyEl.parentNode.style.overflow = "hidden";
          let htmlHeight = bodyEl.parentNode.clientHeight;
          let htmlWidth = bodyEl.parentNode.clientWidth;
          //如果高度出现滚动条 需要用去掉滚动条高度的净高度去计算scale
          if (htmlHeight < height * scaleY) {
            scaleX = htmlWidth / width;
          }
          //如果宽度出现滚动条 需要用去掉滚动条宽度的净宽度去计算scale
          if (htmlWidth < width * scaleX) {
            scaleY = htmlHeight / height;
          }
          let scale = Math.min(scaleX, scaleY);
          scaleX = scale;
          scaleY = scale;
        }
        //缩放按照x和y的缩放比例单独缩放
        if (adapter === "3") {
          let htmlHeight = bodyEl.parentNode.clientHeight;
          let htmlWidth = bodyEl.parentNode.clientWidth;
          scaleX = htmlWidth / width;
          scaleY = htmlHeight / height;
        }
        this.scale = [scaleX, scaleY];
        bodyEl.style.transform = `scale(${scaleX}, ${scaleY}) translate(-50%, ${translateY})`;
        bodyEl.style.transformOrigin = `${transformOriginX} ${transformOriginY}`;
        bodyEl.style.position = "absolute";
        bodyEl.style.left = "50%";
        bodyEl.style.top = top;
      }
    },
    // 检测密码

    checkPassWord() {
      let password = sessionStorage.getItem("userPwd") || "";
      var reg = /^\d{1,}$/;
      var pattern = new RegExp(reg);
      if (pattern.test(password)) {
        this.notifys = this.$notify({
          title: "警告",
          message: "密码强度不够请尽快修改",
          type: "warning",
          duration: 0,
          customClass: "customClassHome"
        });
      }
    }
  },
  destroyed() {
    this.notifys.close();
  }
};
</script>
<style lang="less">
.customClassHome {
  background-color: rgba(233, 220, 221);
  color: #f56c6c;
  top: 116px !important;
}
</style>
<style lang="less" scoped>
.noBorder {
  height: 34px;
  line-height: 34px;
  cursor: pointer;
  width: inherit;
  border: 0px;
  font-size: 14px;
  box-sizing: border-box;
  padding: 0;
  text-align: center;
}
._home {
  height: calc(100%);
  width: calc(100%);
  background: rgb(43, 46, 55);
  box-sizing: border-box;
}
.home {
  height: calc(100%);
  width: calc(100%);
  background: rgb(43, 46, 55);
  box-sizing: border-box;
  // overflow: overlay;
  position: relative;
  .xuanzhong {
    color: #ffffff;
    line-height: 36px;
    font-size: 14px;
  }
  .multi,
  .single {
    height: 100%;
    width: 100%;
    .tabs {
      height: 50px;
      padding: 0 15px;
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: flex-end;
      .add {
        cursor: pointer;
        height: 34px;
        width: 50px;
        line-height: 34px;
        text-align: center;
        font-weight: 700;
        border-radius: 50%;
      }
      .tab {
        height: 34px;
        border-radius: 2px;
        text-align: center;
        width: 130px;
        box-sizing: border-box;
        position: relative;
        margin-left: 1px;
        &.active {
          color: white;
          background: #3573c1;
          input {
            color: white;
            background: #3573c1;
          }
        }
        .el-icon-circle-close {
          cursor: pointer;
          position: absolute;
          right: 10px;
          top: calc(50% - 8px);
        }
      }
    }
  }
  .contents {
    height: calc(100%);
    width: calc(100%);
    background-repeat: no-repeat;
    box-sizing: border-box;
    overflow: overlay;
  }
  .dragDiv {
    z-index: 2;
    overflow: hidden;
    background-size: 10px 10px;
    box-sizing: border-box;
    // border: 2px dashed rgba(230, 162, 60, 0.5);
    position: relative;
    background-position: 0 0;
    background-size: auto;
    background-repeat: no-repeat;
    .views {
      width: 100%;
      height: 100%;
      background-size: 10px 10px;
      position: relative;
      color: #e6a23c;
      font-size: 35px;
      text-align: center;
      position: relative;
      top: 20%;
    }
  }
}
</style>
