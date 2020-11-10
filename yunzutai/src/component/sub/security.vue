<template>
  <div class="security-container" :style="styles">
    <div class="icon" :style="iconStyles"></div>
    <div class="text-content">
      <span style="margin-right: 5px;" :style="textStyles">{{ title }}</span>
      <div style="font-size: 1em; width: 0.5em;"></div>
      <span :class="status === 0 ? 'alarm' : ''" :style="textStyles"
        >[{{ status === 0 ? "报警" : "正常" }}]</span
      >
    </div>
    <div
      v-show="status === 0"
      class="point"
      style="font-size: 1em; width: 1em; height: 1em; position: absolute; top: 1em; right: 1em;"
    ></div>
  </div>
</template>

<script>
import { initStyle, getBasicConfig, changeTheme } from "../common";
const originHeight = 70;
const originFontSize = 10;
const originTextFontSize = 16;
const originPercent = 60;
const originPadding = 0.9;
const originWH = 2.4;
let lastHeight = 70;
let lastTag = "SOS";

const themeMappingKeys = {
  背景颜色: ["value"],
  字体: ["value", 2],
  边框颜色: ["value"]
};
let initialWhite = null;
let initialBlack = null;
export default {
  props: ["theme"],
  data() {
    return {
      styles: {},
      textStyles: {},
      iconStyles: {},
      white: {
        字体: "#455A64",
        背景颜色: "#FFFFFF",
        边框颜色: "#FFFFFF"
      },
      black: {
        字体: "#B2DDFF",
        背景颜色: "#24252A",
        边框颜色: "rgba(0, 0, 0, 0)"
      },
      widthHeight: [190, originHeight],
      position: [0, 0],
      title: "SOS",
      smallIcon: "SOS",
      scenePercent: 60,
      font: [16, "Microsoft Yahei", "#b2ddff"],
      background: "#24252A",
      borderColor: "",
      borderWidth: 1,
      opacity: 100,
      resetStyle_: null,
      rotateDeg: 0,
      status: 0,

      webInfoes: {
        visdev: [],
        vistf: [
          {
            minVistf: 0,
            maxVistf: 10
          }
        ]
      }
    };
  },
  created() {
    getBasicConfig.bind(this)();
    let { black, white } = this;
    initialWhite = JSON.parse(JSON.stringify(white));
    initialBlack = JSON.parse(JSON.stringify(black));
    this.changeTheme(this.$store.getters.theme);
  },
  mounted() {
    // this.timer = setInterval(() => {
    //   let val = Math.random() * 10 + 5;
    //   this.pointIdChange(val);
    // }, 3000);
  },
  watch: {
    "$store.getters.theme"(newVal) {
      if (!newVal) {
        return;
      }
      this.changeTheme(newVal, true);
    }
  },
  methods: {
    returnConfig() {
      let point = this.highConfig["数据源"].pointId;
      let collectPointIds = [[...point]];
      return {
        collectPointIds,
        white: this.white,
        black: this.black,
        highConfig: this.highConfig,
        baisicConfig: this.baisicConfig
      };
    },
    resetComp(bool) {
      if (!bool) {
        this.calcBaseFontSize();
      }
    },
    initStyle(bool) {
      initStyle(
        bool,
        this,
        styles => {
          this.styles = { ...this.styles, ...styles };
          this.calcBaseFontSize();
          let tStyles = {};
          let tFontConfig = this.baisicConfig["字体"];
          if (tFontConfig) {
            let tFont = tFontConfig.value;
            if (tFont && tFont.length) {
              tStyles.fontSize = `${tFont[0]}px`;
              tStyles.fontFamily = tFont[1];
              tStyles.color = tFont[2];
            }
            this.textStyles = tStyles;
          }
          let titleConfig = this.baisicConfig["标题"];
          if (titleConfig) {
            let title = titleConfig.value;
            this.title = title;
          }
          let iStyles = {};
          let percentConfig = this.baisicConfig["前景占比（0% - 100%）"];
          if (percentConfig) {
            let percent = percentConfig.value || 60;
            let newPadding = (percent / originPercent) * originPadding;
            let widthHeight = (percent / originPercent) * originWH;
            iStyles.padding = `${newPadding}em`;
            iStyles.width = `${widthHeight}em`;
            iStyles.height = `${widthHeight}em`;
            iStyles.minWidth = `${widthHeight}em`;
            iStyles.minHeight = `${widthHeight}em`;
          }
          let iconConfig = this.baisicConfig["选择小图标"];
          if (iconConfig) {
            let icon = iconConfig.value;

            if (lastTag !== icon) {
              let labelItem =
                iconConfig.label.find(lb => {
                  return lb.value === icon;
                }) || {};
              let title = labelItem.label || "";
              this.title = title;
              this.baisicConfig["标题"].value = title;
              lastTag = icon;
            }
            let iconPath = `/static/img/sub/security/${icon}.svg`;
            iStyles.backgroundImage = `url(${iconPath})`;
          }
          this.iconStyles = iStyles;
        },
        themeMappingKeys
      );
    },
    resetStyle() {
      this.white = { ...initialWhite };
      this.black = { ...initialBlack };
      this.changeTheme(this.$store.getters.theme);
    },
    changeTheme(themeName, isChange) {
      changeTheme.bind(this)(themeName, themeMappingKeys, isChange);
    },
    calcBaseFontSize() {
      let whConfig = this.baisicConfig["尺寸"];
      if (whConfig) {
        let widthHeight = whConfig.value;
        if (widthHeight && widthHeight.length === 2) {
          let oFont = [...this.baisicConfig["字体"].value];

          let height = widthHeight[1];
          let newFontSize = 10;
          let newTextFontSize = oFont[0];
          if (+height === lastHeight) {
            this.textStyles = {
              ...this.textStyles,
              ...{ fontSize: `${newTextFontSize}px` }
            };
            return;
          }
          if (+height !== originHeight) {
            let scale = height / originHeight;
            newFontSize = Math.floor(originFontSize * scale);
            newTextFontSize = Math.floor(originTextFontSize * scale);
          }
          let fontSizeStyle = `${newFontSize}px`;
          this.styles = { ...this.styles, ...{ fontSize: fontSizeStyle } };
          //   this.baisicConfig[""]
          oFont[0] = newTextFontSize;
          this.baisicConfig["字体"].value = oFont;
          //   this.$data.baisicConfig["字体"].value[0] = newTextFontSize;
          this.textStyles = {
            ...this.textStyles,
            ...{ fontSize: `${newTextFontSize}px` }
          };
          lastHeight = height;
        }
      }
    },
    pointIdChange(val) {
      let alarmRanges = this.highConfig["报警范围"].values;
      let status = 1;

      alarmRanges.forEach(ar => {
        let minR = ar[0];
        let isNumMinR = this.isNumber(minR);
        let maxR = ar[1];
        let isNumMaxR = this.isNumber(maxR);
        let value = val[0];
        if (isNumMinR || isNumMaxR) {
          if (!isNumMinR) {
            if (value <= maxR) {
              status = 0;
            }
          } else if (!isNumMaxR) {
            if (value >= minR) {
              status = 0;
            }
          } else {
            if (value >= minR && value <= maxR) {
              status = 0;
            }
          }
        }
      });
      this.status = status;
    },
    //判断是不是数字
    isNumber(val) {
      let regPos = /^\d+(\.\d+)?$/; //非负浮点数
      let regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
      if (regPos.test(val) || regNeg.test(val)) {
        return true;
      } else {
        return false;
      }
    }
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
};
</script>

<style scoped>
.security-container {
  font-size: 10px;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-left: 1.5em;
  padding-right: 1.5em;
  box-sizing: border-box;
  white-space: nowrap;
  overflow: hidden;
  position: relative;
}

.security-container .icon {
  font-size: 1em;
  padding: 0.9em;
  width: 2.4em;
  height: 2.4em;
  display: inline-block;
  background-repeat: no-repeat;
  background-size: 60% 60%;
  background-position: 50%;
  margin-right: 1.2em;
  border-radius: 50%;
  vertical-align: middle;
  background-color: rgb(53, 115, 193);
}

.text-content {
  font-size: 1em;
  min-width: 8.4em;
  display: flex;
  align-items: center;
}

.text-content .alarm {
  color: #e53f3f !important;
}

.point {
  background: #e53f3f;
  border-radius: 100%;
}
</style>
