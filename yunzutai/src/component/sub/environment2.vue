<template>
  <div class="datacomparison-container" :style="styles">
    <img
      class="icon"
      :style="iconStyles"
      :src="`/static/img/sub/environment2/${tagIcon}.svg`"
    />
    <p>
      <span class="value" :style="valueStyles">{{ value }}</span>
      <span :style="unitStyles">{{ tagUnit }}</span>
    </p>
  </div>
</template>

<script>
import { initStyle, getBasicConfig, changeTheme } from "../common";
const originHeight = 116;
const originFontSize = 10;
const originTextFontSize = 15;
const originPercent = 76;
// const originPadding = 0.9;
const originWH = 4.4;
let lastHeight = originHeight;

// const mapUnit = {
//   用电量: "Kwh",
//   用水量: "t",
//   用气量: "m³",
//   耗热量: "Kwh"
// };

const mapTag = {
  温度: {
    unit: "℃",
    icon: "temp"
  },
  湿度: {
    unit: "%",
    icon: "wet"
  },
  CO2: {
    unit: "ppm",
    icon: "co2"
  },
  甲醛: {
    unit: "mg/m³",
    icon: "jiaquan"
  },
  "PM2.5": {
    unit: "ug/m³",
    icon: "pm2.5"
  },
  PM10: {
    unit: "ug/m³",
    icon: "pm10"
  },
  光照度: {
    unit: "lux",
    icon: "light"
  },
  VOC: {
    unit: "mg/m³",
    icon: "voc"
  }
};
const themeMappingKeys = {
  图标颜色: ["value"],
  数值单位样式: ["value", 2],
  竖线颜色: ["value"],
  背景颜色: ["value"],
  边框颜色: ["value"]
};
let initialWhite = null;
let initialBlack = null;
export default {
  props: ["theme"],
  data() {
    return {
      styles: {},
      valueStyles: {},
      unitStyles: {},
      iconStyles: {},
      tagStyles: {},
      triangleStyles: {},
      verticalLineStyles: {},
      white: {
        图标颜色: "#3573C1",
        数值单位样式: "#455A64",
        背景颜色: "#DFE5EA",
        边框颜色: "#FFFFFF"
      },
      black: {
        图标颜色: "#F1921C",
        数值单位样式: "#B2DDFF",
        背景颜色: "#24252A",
        边框颜色: "rgba(0, 0, 0, 0)"
      },
      widthHeight: [130, originHeight],
      position: [0, 0],
      smallIcon2: "PM2.5",
      //   tagSelect: "温度",
      scenePercent: originPercent,
      valueFont: [18, "Microsoft Yahei", "#b2ddff"],
      iconColor: "#F1921C",
      background: "",
      borderColor: "",
      borderWidth: 1,
      opacity: 100,
      resetStyle_: null,
      rotateDeg: 0,
      trend: 10,
      tagIcon: "temp",
      tagUnit: "℃",
      dtsource: [
        {
          dev: [],
          devType: 1
        }
      ],
      value: 32.9
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
    //   let val = Math.round(Math.random() * 2000 + Number(500)) / 100;
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
          let tFontConfig = this.baisicConfig["数值单位样式"];
          if (tFontConfig) {
            let tFont = tFontConfig.value;
            if (tFont && tFont.length) {
              tStyles.fontSize = `${tFont[0]}px`;
              tStyles.fontFamily = tFont[1];
              tStyles.color = tFont[2];
            }
            this.valueStyles = tStyles;

            let unitStyles = { ...tStyles };
            unitStyles.fontSize = `${tFont[0] - 4}px`;
            this.unitStyles = unitStyles;
          }

          let iStyles = {};
          let percentConfig = this.baisicConfig["前景占比（0% - 100%）"];
          if (percentConfig) {
            let percent = percentConfig.value || 60;
            // let newPadding = (percent / originPercent) * originPadding;
            let widthHeight = (percent / originPercent) * originWH;
            // iStyles.padding = `${newPadding}em`;
            iStyles.width = `${widthHeight}em`;
            iStyles.height = `${widthHeight}em`;
            iStyles.minWidth = `${widthHeight}em`;
            iStyles.minHeight = `${widthHeight}em`;
          }
          let tagConfig = this.baisicConfig["选择小图标"];
          if (tagConfig) {
            let tag = tagConfig.value;
            if (tag) {
              let tagInfo = mapTag[tag] || {};
              let unit = tagInfo.unit || "";
              let icon = tagInfo.icon || "";
              this.tagIcon = icon;
              this.tagSelect = tag;
              this.tagUnit = unit;
            }
          }

          let iconColorConfig = this.baisicConfig["图标颜色"];
          if (iconColorConfig) {
            let iconColor = iconColorConfig.value;
            if (iconColor) {
              iStyles.color = iconColor;
            }
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
          let oFont = [...this.baisicConfig["数值单位样式"].value];
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
          let scale = height / originHeight;
          newFontSize = Math.floor(originFontSize * scale);
          newTextFontSize = Math.floor(originTextFontSize * scale);
          let fontSizeStyle = `${newFontSize}px`;
          this.styles = { ...this.styles, ...{ fontSize: fontSizeStyle } };
          //   this.baisicConfig[""]
          oFont[0] = newTextFontSize;
          this.baisicConfig["数值单位样式"].value = oFont;
          //   this.$data.baisicConfig["字体"].value[0] = newTextFontSize;
          this.valueStyles = {
            ...this.valueStyles,
            ...{ fontSize: `${newTextFontSize}px` }
          };

          this.unitStyles = {
            ...this.unitStyles,
            ...{ fontSize: `${newTextFontSize - 4}px` }
          };

          this.tagStyles = {
            ...this.tagStyles,
            ...{ fontSize: `${newTextFontSize}px` }
          };
          lastHeight = height;
        }
      }
    },
    pointIdChange(val) {
      this.value = val[0];
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
.datacomparison-container {
  font-size: 10px;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  /* align-items: center; */
  /* justify-content: center; */
  padding-left: 1.5em;
  padding-right: 1.5em;
  box-sizing: border-box;
  white-space: nowrap;
  overflow: hidden;
  position: relative;
}

.datacomparison-container .date {
  position: absolute;
  left: 0.25em;
  top: 0.25em;
  font-size: 1.2em;
}

.datacomparison-container .icon {
  font-size: 1em;
  /* padding: 0.9em; */
  width: 4.4em;
  height: 4.4em;
  display: inline-block;
  background-repeat: no-repeat;
  background-size: 60% 60%;
  background-position: 50%;
  /* margin-right: 1.2em; */
  border-radius: 50%;
  vertical-align: middle;
  /* margin-right: 1.2em; */
  filter: drop-shadow(99em 0);
  position: relative;
  left: -99em;
  color: #f1921c;
}

.value {
  margin-right: 0.5em;
}

.left {
  font-size: 1em;
  padding-right: 1.2em;
  display: flex;
  align-items: center;
  width: 50%;
  box-sizing: border-box;
  color: rgb(241, 146, 28);
  overflow: hidden;
}
.line {
  height: 40%;
  width: 2px;
  background: #18191d;
}
.right {
  font-size: 1em;
  color: #b2ddff;
  padding-left: 1.2em;
  width: calc(50% - 2px);
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
}

.right .top {
  margin: 0;
  padding: 0;
}

.right .bottom {
  margin: 0;
  padding: 0;
  margin-top: 0.8em;
}

.datacomparison-container .left .tag {
  color: #f1921c;
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
