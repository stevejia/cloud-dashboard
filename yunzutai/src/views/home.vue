<template>
  <div class="_home">
    <div
      class="home"
      :style="wholeStyle"
      @contextmenu.prevent.stop="showContextMenu"
    >
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
                v-for="(item, index) in page.pages"
              >
                <input
                  @mousedown.stop="selectMul(page.pages, item)"
                  class="noBorder backColor colorWhiteBlack"
                  type="text"
                  :style="
                    mulLinkPageId == item.id
                      ? { ...mulHeadStyle.normal, ...mulHeadStyle.hight }
                      : mulHeadStyle.normal
                  "
                  v-model="item.name"
                />
                <i
                  v-show="index"
                  @mousedown.stop="deleteMulPage(page.pages, item, index)"
                  class="el-icon-circle-close colorWhiteBlack"
                ></i>
              </div>
              <div class="add colorWhiteBlack">
                <i
                  @mousedown.stop="addMul(page.pages)"
                  class="el-icon-plus"
                ></i>
              </div>
            </div>
            <div
              class="content"
              style="height: calc(100% - 50px);width: calc(100%);"
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
                :cc="styles.width"
              >
                <UserManage v-if="linkPageId === '用户管理'"></UserManage>
                <LogManage v-if="linkPageId === '操作日志'"></LogManage>
              </div>
            </div>
          </div>
        </template>
      </template>
      <div class="content" :style="otherStyle" v-if="!linkPageId">
        <div class="dragDiv dragss" :style="styles">
          <div class="views">请选择组态页面</div>
        </div>
      </div>
    </div>

    <compContextmenu ref="contextmenu"></compContextmenu>
    <compMark ref="compMark"></compMark>
    <dialogCompose ref="dialogCompose"></dialogCompose>
    <dialogScenes ref="dialogScenes"></dialogScenes>
    <dialogTimer ref="dialogTimer"></dialogTimer>
    <dialogAps ref="dialogAps"></dialogAps>
    <!-- <ruler :scale="1" container=".home"></ruler> -->
    <div :style="{ opacity: scaleTipOpacity }" class="scale-tip">
      <span>{{ config["页面缩放"].value }}</span>
      <span class="sign">x</span>
    </div>
    <div
      style="position: absolute; width: 5px; height: 5px; background: red;"
      id="testScale"
    ></div>
  </div>
</template>
<script>
import LogManage from "@/system/LogManage.vue";
import UserManage from "@/system/UserManage.vue";
// import ruler from "@/component/ruler.vue";
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
    // ruler
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
      mulHeadStyle: {
        normal: {},
        hight: {}
      },
      white: {
        centerBackground: "#e2ecf1",
        otherColor: "rgba(255,255,255,0)",
        mulHeadColor: "#2F363D",
        mulHeadHightColor: "#fff",
        mulHeadBackColor: "#fff",
        mulHeadhightBackColor: "#3573C1"
      },
      black: {
        centerBackground: "#2B2E37",
        otherColor: "rgba(255,255,255,0)",
        mulHeadColor: "#fff",
        mulHeadHightColor: "#fff",
        mulHeadBackColor: "#24252A",
        mulHeadhightBackColor: "#3573C1"
      },
      config: {
        页面缩放: {
          type: "zoom",
          value: "1"
        },
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
        线条2: {
          type: "line"
        },
        // start 多页面时显示
        多页面标签样式: {
          type: "fontStyle",
          value: ["", "", "", ""]
        },
        标签文字高亮色: {
          type: "color-select",
          value: "rgba(255,255,255,0)"
        },
        标签背景色: {
          type: "color-select",
          value: "rgba(255,255,255,0)"
        },
        标签背景高亮色: {
          type: "color-select",
          value: "rgba(255,255,255,0)"
        },
        // end
        样式还原: {
          type: "resetStyle"
        },
        线条3: {
          type: "line"
        },
        容器列表: {
          type: "containerSelect",
          value: ["", false]
        },
        线条4: {
          type: "line"
        },
        上传中心区域背景图: {
          type: "upload-image",
          value: {
            imgUrl: ""
          }
        }
      },
      showScaleTip: false,
      scaleTipOpacity: 0,
      isCheckedObj: {},
      noCheckedObj: {}
    };
  },
  beforeDestroy() {
    this.$drag.destory();
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
      // this.themeChange();
      if (this.$drag.currentPageType == "multi") {
        this.writeColorConfig();
      }
    }
  },
  created() {
    this.theme = this.$store.getters.theme;
    let centerConfig = this.$store.state.config.stylesConfig.centerConfig;
    Object.assign(this.config, centerConfig.config);
    Object.assign(this.white, centerConfig.white);
    Object.assign(this.black, centerConfig.black);
    // this.initStyle();
  },
  mounted() {
    this.$drag.init(this);
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
      if (this.multPages.length === 7) {
        this.$message({
          type: "warning",
          message: "最多只能添加6个页面!"
        });
        return;
      }
      this.multPages = pages;
      this.multPages.push({
        id: guid(),
        name: "新增页面-" + this.multPages.length
      });
    },
    //删除多页面
    deleteMulPage(pages, item, index) {
      this.$confirm(`确认删除此标签页?`, "删除标签页", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        closeOnClickModal: false
      })
        .then(() => {
          this.multPages = pages;
          this.multPages.splice(index, 1);
          if (this.mulLinkPageId === item.id) {
            this.selectMul(this.multPages, this.multPages[0]);
          }
          this.$drag.deletePage(item.id, item);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
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
    initStyle(order) {
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

        if (this.$drag.currentPageType == "multi") {
          let pages = this.$chint.getPageList();
          let curPage = pages.find(_page => {
            return _page.id === this.linkPageId;
          });
          curPage.mulHeadStyle = {
            ...curPage.mulHeadStyle,
            fontSize: "14px",
            fontFamily: "",
            fontWeight: ""
          };
          curPage.mulHeadStyle[this.theme] = {
            color: theme.mulHeadColor,
            hightColor: theme.mulHeadHightColor,
            backgroundColor: theme.mulHeadBackColor,
            hightBackColor: theme.mulHeadhightBackColor
          };
          this.writeColorConfig();
        }
      }
      // 设置地图背景色
      this.$store.state.bgColor = this.config["背景色"].value;
      // console.log(this.$store.state.bgColor);
      theme.centerBackground = this.config["背景色"].value;
      theme.otherColor = this.config["栅格色"].value;

      let top = this.$parent.mainTop;
      let left = 200;
      let gridColor = this.config["栅格色"].value;

      let val = gridColor.match(/(\d(\.\d+)?)+/g);
      let r = val[0];
      let g = val[1];
      let b = val[2];
      let a = val[3];

      let a1 = +a > 0 ? 0.2 : 0;
      let a2 = +a > 0 ? 0.3 : 0;
      let padding = this.config["外边距"].value;
      let scale = this.config["页面缩放"].value;
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
        height: height + "px",
        backgroundImage: `linear-gradient(rgba(${r}, ${g}, ${b}, ${a1}) 1px, transparent 0), linear-gradient(90deg, rgba(${r}, ${g}, ${b}, ${a1}) 1px, transparent 0), linear-gradient(rgba(${r}, ${g}, ${b}, ${a2})1px, transparent 0), linear-gradient(90deg, rgba(${r}, ${g}, ${b}, ${a2}) 1px, transparent 0)`,
        backgroundSize: `25px 25px, 25px 25px, 100px 100px, 100px 100px`,
        transformOrigin: "0 0",
        transform: `scale(${scale || 1})`
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
      // 当为多页面时，动态更新表头样式
      if (this.$drag.currentPageType == "multi") {
        let pages = this.$chint.getPageList();
        let curPage = pages.find(_page => {
          return _page.id === this.linkPageId;
        });
        let mulFont = this.config["多页面标签样式"].value;
        curPage.mulHeadStyle = {
          ...curPage.mulHeadStyle,
          fontSize: mulFont[0],
          fontFamily: mulFont[1],
          fontWeight: mulFont[2]
        };
        curPage.mulHeadStyle[this.theme] = {
          // ...curPage.mulHeadStyle[this.theme],
          color: mulFont[3],
          hightColor: this.config["标签文字高亮色"].value,
          backgroundColor: this.config["标签背景色"].value,
          hightBackColor: this.config["标签背景高亮色"].value
        };
        this.mulHeadStyle = {
          normal: {
            fontSize: mulFont[0],
            fontFamily: mulFont[1],
            fontWeight: mulFont[2],
            color: mulFont[3],
            background: this.config["标签背景色"].value
          },
          hight: {
            color: this.config["标签文字高亮色"].value,
            background: this.config["标签背景高亮色"].value
          }
        };
      }
    },
    // 初始化多页面样式
    initMulStyle() {
      if (this.$drag.currentPageType != "multi") {
        this.config["多页面标签样式"].type = "";
        this.config["标签文字高亮色"].type = "";
        this.config["标签背景色"].type = "";
        this.config["标签背景高亮色"].type = "";
        return;
      }
      this.$nextTick(() => {
        this.$nextTick(() => {
          let pages = this.$chint.getPageList();
          let curPage = pages.find(_page => {
            return _page.id === this.linkPageId;
          });
          if (!curPage.mulHeadStyle) {
            curPage.mulHeadStyle = {
              fontSize: "14px",
              fontFamily: "",
              fontWeight: "",
              black: {
                color: this.black.mulHeadColor,
                hightColor: this.black.mulHeadHightColor,
                backgroundColor: this.black.mulHeadBackColor,
                hightBackColor: this.black.mulHeadhightBackColor
              },
              white: {
                color: this.white.mulHeadColor,
                hightColor: this.white.mulHeadHightColor,
                backgroundColor: this.white.mulHeadBackColor,
                hightBackColor: this.white.mulHeadhightBackColor
              }
            };
          }
          let theme = this.theme;
          this.writeColorConfig(curPage);
          this.mulHeadStyle.normal = {
            fontSize: curPage.mulHeadStyle.fontSize,
            fontFamily: curPage.mulHeadStyle.fontFamily,
            fontWeight: curPage.mulHeadStyle.fontWeight,
            color: curPage.mulHeadStyle[theme].color,
            background: curPage.mulHeadStyle[theme].backgroundColor
          };
          this.mulHeadStyle.hight = {
            color: curPage.mulHeadStyle[theme].hightColor,
            background: curPage.mulHeadStyle[theme].hightBackColor
          };
        });
      });
    },
    writeColorConfig() {
      let pages = this.$chint.getPageList();
      let curPage = pages.find(_page => {
        return _page.id === this.linkPageId;
      });
      let theme = this.theme;
      this.config["多页面标签样式"] = {
        type: "",
        value: [
          curPage.mulHeadStyle.fontSize,
          curPage.mulHeadStyle.fontFamily,
          curPage.mulHeadStyle.fontWeight,
          curPage.mulHeadStyle[theme].color
        ]
      };
      this.config["标签文字高亮色"] = {
        type: "",
        value: curPage.mulHeadStyle[theme].hightColor
      };
      this.config["标签背景色"] = {
        type: "",
        value: curPage.mulHeadStyle[theme].backgroundColor
      };
      this.config["标签背景高亮色"] = {
        type: "",
        value: curPage.mulHeadStyle[theme].hightBackColor
      };
      this.$nextTick(() => {
        this.config["多页面标签样式"].type = "fontStyle";
        this.config["标签文字高亮色"].type = "color-select";
        this.config["标签背景色"].type = "color-select";
        this.config["标签背景高亮色"].type = "color-select";
      });
    }
  }
};
</script>

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
  /* 悬浮提示 */
  .scale-tip {
    width: 140px;
    height: 60px;
    position: absolute;
    z-index: 100001;
    top: -50px;
    left: 50%;
    transform: translateX(-50%);
    border-radius: 5px;
    text-align: center;
    line-height: 60px;
    background-color: rgba(229, 63, 63, 0.35);
    border: 2px dashed #e53f3f;
    color: #eee;
    font-size: 26px;
    transition: all 0.6s;
    .sign {
      margin-left: 2px;
    }
  }
}
.home {
  height: calc(100%);
  width: calc(100%);
  background: rgb(43, 46, 55);
  box-sizing: border-box;

  position: relative;
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
    border: 2px dashed rgba(230, 162, 60, 0.5);
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
