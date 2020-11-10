<template>
  <div class="layout">
    <div class="MainBody">
      <headers ref="headers" class="headers"></headers>
      <tabMenu ref="tabMenus" class="tabMenus"></tabMenu>
      <div class="main" :style="{ top: mainTop + 'px' }">
        <lefters
          ref="lefters"
          class="lefters"
          :style="{ left: mainLeft + 'px' }"
        ></lefters>
        <div
          class="body"
          :style="{
            left: mainLeft === 0 ? '200px' : '0px',
            width: mainLeft === 0 ? 'calc(100% - 200px)' : 'calc(100%)'
          }"
        >
          <router-view />
        </div>
      </div>
      <rightTab
        ref="righters"
        :style="{ top: mainTop + 'px' }"
        class="rightTabs"
      ></rightTab>
    </div>
  </div>
</template>
<script>
import lefters from "./lefters/lefter.vue";
import headers from "./headers.vue";
import tabMenu from "./tabMenu.vue";
import rightTab from "./rightTab";
export default {
  components: {
    rightTab,
    headers,
    tabMenu,
    lefters
  },
  data() {
    return {
      theme: null,
      themeConfig: {
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
        },
        线条: {
          type: "line"
        },
        页面大小: {
          type: "widthHeight",
          label: ["宽", "高"],
          tisi: "*非数字则无效",
          checked: false,
          value: [1920, 1080]
        },
        线条1: {
          type: "line"
        },

        页面选项: {
          type: "select",
          label: [
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
          ],
          value: "0"
        }
      },
      userConfig: {
        页面标题: {
          type: "input",
          value: "正泰云组态平台"
        },
        页面标签: {
          type: "upload-image",
          value: {
            imgUrl: ""
          }
        },
        Logo: {
          type: "upload-image",
          value: {
            imgUrl: ""
          }
        },
        背景图: {
          type: "upload-image",
          value: {
            imgUrl: ""
          }
        }
      },
      config: null,
      mainTop: 104,
      mainLeft: 0
    };
  },
  created() {
    this.theme = this.$store.getters.theme;
    Object.assign(
      this.themeConfig,
      this.$store.state.config.stylesConfig.theme
    );
    Object.assign(
      this.userConfig,
      this.$store.state.config.stylesConfig.userConfig
    );
    this.config = this.$store.state.config.stylesConfig;
  },
  mounted() {
    this.themeChange();
  },
  methods: {
    //收缩左侧栏
    toggLeft(status) {
      if (this.mainLeft === -200 || status === true) {
        this.mainLeft = 0;
      } else {
        this.mainLeft = -200;
      }
    },
    themeChange(theme) {
      this.theme = theme;
      document.body.className = theme === "black" ? "themeBlack" : "themeWhite";
      if (theme) {
        document
          .getElementById("modLink")
          .setAttribute("href", `./static/css/${theme}.css`);
      }
      this.$nextTick(() => {
        this.initStyle();
      });
    },
    initStyle(order) {
      let theme = this.themeConfig["主题切换"].value;
      if (this.theme !== theme) {
        this.themeChange(theme);
      } else {
        let hideTopTab = this.$refs.headers.config["隐藏顶部导航"];
        let bool = hideTopTab && hideTopTab.value;
        if (bool) {
          this.mainTop = 60;
        } else {
          this.mainTop = 104;
        }
        this.$drag.$vm.initStyle(order);
        this.$refs.tabMenus.initStyle();
      }
    },
    deal() {
      let bool = this.$refs.headers.config["隐藏顶部导航"].value;
      this.$refs.headers.config["隐藏顶部导航"].value = !bool;
      this.initStyle();
    }
  }
};
</script>

<style lang="less" scoped>
.layout {
  height: 100%;
  width: 100%;
  .MainBody {
    flex: none;
    height: calc(100%);
    position: relative;
    .headers {
      height: 60px;
    }
    .tabMenus {
      height: 44px;
      box-sizing: border-box;
    }
    .main {
      position: absolute;
      left: 0px;
      right: 0px;
      bottom: 0px;
      display: flex;
      flex-direction: row;
      transition: all 0.2s;
      .lefters {
        transition: all 0.2s;
        position: absolute;
        top: 0px;
        bottom: 0px;
        width: 200px;
      }
      .body {
        transition: all 0.2s;
        position: absolute;
        right: 0px;
        top: 0px;
        bottom: 0px;
        width: calc(100%);
      }
    }
    .rightTabs {
      transition: all 0.2s;
      position: absolute;
      right: 0px;
      top: 0px;
      bottom: 0px;
      z-index: 1500;
    }
  }
}
</style>
