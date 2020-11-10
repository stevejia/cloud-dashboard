<template>
  <div class="lefter" :style="wholeStyle" @mousedown="clearVms">
    <leftRoutes
      class="routes"
      ref="routes"
      style="height:calc(50% - 3px)"
    ></leftRoutes>
    <div class="spaceLine moveLine" :style="lineStyle"></div>
    <leftPages class="pages" ref="pages" style="height:'calc(50%)'"></leftPages>
  </div>
</template>

<script>
import leftRoutes from "./routes";
import leftPages from "./pages";
export default {
  components: {
    leftRoutes,
    leftPages
  },
  data() {
    return {
      theme: null,
      wholeStyle: {},
      lineStyle: {},
      white: {
        divider: "rgba(255,255,255,0)", //间隔线色
        shadow: "rgba(255,255,255,0)", //边框发光色
        chkItemColor: "rgb(53, 115, 193)", //选中条目颜色
        fontColor: "rgb(85, 85, 85)", //字体颜色
        selectItemColor: "rgb(53, 115, 193)", //选中字体颜色
        background: "rgb(255, 255, 255)", //背景色
        lineColor: "#2c90e5" //tab线条颜色
      },
      black: {
        divider: "rgba(255,255,255,0)",
        shadow: "rgba(255,255,255,0)",
        chkItemColor: "#2B2E37",
        fontColor: "#B7C0CD",
        selectItemColor: "#2B2E37",
        background: "#24252A",
        lineColor: "#3b4149"
      },
      config: {
        字体样式: {
          type: "fontStyle",
          value: ["14px", "", "normal", "#B7C0CD"]
        },
        选中的字体颜色: {
          type: "color-select",
          value: "#FFFFFF"
        },
        选中的条目颜色: {
          type: "color-select",
          value: "#2B2E37"
        },
        背景色: {
          type: "color-select",
          value: "#24252A"
        },
        边框发光色: {
          type: "color-select",
          value: "rgba(255,255,255,0)"
        },
        间隔线色: {
          type: "color-select",
          value: "rgba(255,255,255,0)"
        },
        间隔线的渐变范围: {
          type: "linear-gradient",
          note: "取消渐变色",
          value: [50, false]
        },
        样式还原: {
          type: "resetStyle"
        },
        线条: {
          type: "line"
        },
        菜单折叠: {
          type: "checkbox",
          backFn: null,
          value: true
        }
      }
    };
  },
  watch: {
    "$store.getters.theme"(val) {
      this.theme = val;
      let theme = this[val];
      this.config["字体样式"].value[3] = theme.fontColor;
      this.config["选中的条目颜色"].value = theme.selectItemColor;
      this.config["背景色"].value = theme.background;
      this.config["选中的条目颜色"].value = theme.chkItemColor;
      this.config["边框发光色"].value = theme.shadow;
      this.config["间隔线色"].value = theme.divider;
      this.themeChange();
    }
  },
  created() {
    this.theme = this.$store.getters.theme;
    let leftConfig = this.$store.state.config.stylesConfig.leftConfig;
    Object.assign(this.config, leftConfig.config);
    Object.assign(this.white, leftConfig.white);
    Object.assign(this.black, leftConfig.black);
  },
  mounted() {
    this.initStyle();
  },
  methods: {
    clearVms() {
      this.$drag.clearVms();
      this.$drag.showMenu({ classes: 66 });
    },
    themeChange() {
      this.initStyle();
    },
    selectPage(item) {
      this.$refs.pages.selectPage(item);
    },
    //初始化样式
    initStyle(order) {
      let theme = this[this.theme];
      if (order === "resetStyle") {
        if (this.theme === "white") {
          theme.fontColor = "rgb(85, 85, 85)";
          theme.selectItemColor = "rgb(53, 115, 193)";
          theme.background = "rgb(255, 255, 255)";
          theme.divider = "rgba(255,255,255,0)";
          theme.shadow = "rgba(255,255,255,0)";
          theme.chkItemColor = "rgb(53, 115, 193)";
        } else if (this.theme === "black") {
          theme.fontColor = "#B7C0CD";
          theme.selectItemColor = "#2B2E37";
          theme.background = "#24252A";
          theme.divider = "rgba(255,255,255,0)";
          theme.shadow = "rgba(255,255,255,0)";
          theme.chkItemColor = "#2B2E37";
        }
        this.config = {
          ...this.config,
          字体样式: {
            type: "fontStyle",
            value: ["14px", "", "normal", theme.fontColor]
          },
          选中的字体颜色: {
            type: "color-select",
            value: "#FFFFFF"
          },
          选中的条目颜色: {
            type: "color-select",
            value: theme.selectItemColor
          },
          背景色: {
            type: "color-select",
            value: theme.background
          },
          边框发光色: {
            type: "color-select",
            value: "rgba(255,255,255,0)"
          },
          间隔线色: {
            type: "color-select",
            value: "rgba(255,255,255,0)"
          },
          间隔线的渐变范围: {
            type: "linear-gradient",
            note: "取消渐变色",
            value: [50, false]
          }
        };
      }
      theme.fontColor = this.config["字体样式"].value[3];
      theme.selectItemColor = this.config["选中的条目颜色"].value;
      theme.background = this.config["背景色"].value;
      theme.chkItemColor = this.config["选中的条目颜色"].value;
      theme.shadow = this.config["边框发光色"].value;
      theme.divider = this.config["间隔线色"].value;

      this.lineStyle = {
        background: theme.lineColor
      };
      this.wholeStyle = {
        background: this.config["背景色"].value,
        boxShadow: this.config["边框发光色"].value + " 0px 0px 10px 0px inset"
      };
      this.$refs.routes.initStyle();
      this.$refs.pages.initStyle();
    }
  }
};
</script>

<style lang="less" scoped>
.lefter {
  background: rgb(36, 37, 42);
  display: flex;
  flex-direction: column;
  padding: 8px 4px;
  box-sizing: border-box;
  position: relative;
  .routes {
    overflow: hidden;
    position: relative;
    height: calc(50% - 3px);
    width: calc(100% - 4px);
  }
  .pages {
    width: calc(100%);
    height: calc(50%);
    position: relative;
    overflow: hidden;
  }
  .spaceLine {
    cursor: s-resize;
    width: calc(100%);
    height: 3px;
  }
}
</style>
