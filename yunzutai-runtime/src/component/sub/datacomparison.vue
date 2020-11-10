<template>
  <div class="datacomparison-container" :style="styles">
    <div v-if="comparisionData.trend < 0" class="left down">
      <div class="icon icon-down" :style="iconStyles"></div>
      <strong>{{ comparisionData.percentage }}</strong>
    </div>

    <div v-if="comparisionData.trend === 0" class="left fair">
      <div class="icon icon-fair" :style="iconStyles"></div>
      <strong>{{ comparisionData.percentage }}</strong>
    </div>

    <div v-if="comparisionData.trend > 0" class="left up">
      <div class="icon icon-up" :style="iconStyles"></div>
      <strong>{{ comparisionData.percentage }}</strong>
    </div>

    <div class="right">
      <p class="top" :style="textStyles">
        {{
          `${computedPreDateType}同时段：${comparisionData.curdata} ${computedUnit}`
        }}
      </p>
      <p class="bottom" :style="textStyles">
        {{
          `${computedCurDateType}${dataTypeSelect}：${comparisionData.predata} ${computedUnit}`
        }}
      </p>
    </div>
    <div class="triangle" :style="triangleStyles"></div>
    <div class="date">{{ dateTypeSelect }}</div>
  </div>
</template>

<script>
import { initStyle, getBasicConfig, changeTheme } from "../common";
import { getDataComparisionData } from "@/api/bulk.js";
const originHeight = 90;
const originFontSize = 10;
const originTextFontSize = 16;
const originPercent = 60;
// const originPadding = 0.9;
const originWH = 2.4;
let lastHeight = 90;

const mapUnit = {
  用电量: "Kwh",
  用水量: "t",
  用气量: "m³",
  耗热量: "Kwh"
};
const themeMappingKeys = {
  背景颜色: ["value"],
  字体: ["value", 2],
  边框颜色: ["value"],
  三角区域颜色: ["value"]
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
      triangleStyles: {},
      white: {
        字体: "#455A64",
        背景颜色: "#FFFFFF",
        边框颜色: "#FFFFFF",
        三角区域颜色: "#17BB97"
      },
      black: {
        字体: "#B2DDFF",
        背景颜色: "#24252A",
        边框颜色: "rgba(0, 0, 0, 0)",
        三角区域颜色: "#17BB97"
      },
      widthHeight: [400, originHeight],
      position: [0, 0],
      dateTypeSelect: "日",
      dataTypeSelect: "用电量",
      font: [16, "Microsoft Yahei", "#b2ddff"],
      triangleBackground: "",
      background: "",
      borderColor: "",
      borderWidth: 1,
      opacity: 100,
      resetStyle_: null,
      rotateDeg: 0,
      trend: 10,
      dev: [],
      comparisionData: {
        curdata: 9512.35,
        predata: 9512.35,
        percentage: 35.52,
        trend: -1
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
    if (this.$store.state.runtime) {
      this.getData();
      this.timer = setInterval(() => {
        this.getData();
      }, 60000);
    }
  },
  computed: {
    computedPreDateType() {
      let dateType = this.dateTypeSelect;
      switch (dateType) {
        case "小时":
          return "上个小时";
        case "日":
          return "昨日";
        case "周":
          return "上周";
        case "月":
          return "上月";
        case "季度":
          return "上季度";
        case "年":
          return "上年";
        default:
          return "";
      }
    },
    computedCurDateType() {
      let dateType = this.dateTypeSelect;
      switch (dateType) {
        case "小时":
          return "当前小时";
        case "日":
          return "今日";
        case "周":
          return "本周";
        case "月":
          return "本月";
        case "季度":
          return "本季度";
        case "年":
          return "今年";
        default:
          return "";
      }
    },
    computedUnit() {
      let dataType = this.dataTypeSelect;
      return mapUnit[dataType] || "";
    }
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
    async getData() {
      let dateType = this.baisicConfig["时间类型选择"].value;
      let dev = this.highConfig["绑定位号"].value;
      if (!dev || dev.length === 0) {
        return;
      }
      if (!dateType) {
        return;
      }
      let params = [
        {
          id: "datacomparison_techsel_6eaad150e05211eabcb7bfefe6d0436e",
          data: {
            intervalUnit: dateType,
            pointId: dev[dev.length - 1]
          }
        }
      ];
      let res = await getDataComparisionData(params);
      let data = res.data[0].data.data;
      this.comparisionData.curdata = data.value;
      this.comparisionData.trend = data.increasesState;
      this.comparisionData.predata = data.beforeValue;
      this.comparisionData.percentage =
        Math.round(data.increasesValue * 10000) / 100;
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
          // let iconConfig = this.baisicConfig["选择小图标"];
          // if (iconConfig) {
          //   let icon = iconConfig.value;
          //   let iconPath = `/static/img/sub/datacomparison/${icon}.svg`;
          //   iStyles.backgroundImage = `url(${iconPath})`;
          // }
          this.iconStyles = iStyles;

          let dateTypeConfig = this.baisicConfig["时间类型选择"];
          if (dateTypeConfig) {
            let dateType = dateTypeConfig.value;
            this.dateTypeSelect = dateType;
          }

          let dataTypeConfig = this.baisicConfig["数据类型选择"];
          if (dataTypeConfig) {
            let dataType = dataTypeConfig.value;
            this.dataTypeSelect = dataType;
          }

          let triangleConfig = this.baisicConfig["三角区域颜色"];
          let triStyles = {};
          if (triangleConfig) {
            let triangleBG = triangleConfig.value;
            triStyles.borderTopColor = triangleBG;
            this.triangleStyles = triStyles;
          }
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
  align-items: center;
  justify-content: center;
  padding-left: 1.5em;
  padding-right: 1.5em;
  box-sizing: border-box;
  white-space: nowrap;
  overflow: hidden;
  position: relative;
}

.datacomparison-container .triangle {
  font-size: 1em;
  position: absolute;
  top: 0;
  left: 0;
  width: 0;
  height: 0;
  border-style: solid;
  border-top-color: #0eeb8e;
  border-left-color: transparent;
  border-right-color: transparent;
  border-bottom-color: transparent;
  border-width: 3.2em 3.2em 0 0;
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
  width: 3.7em;
  height: 3.7em;
  display: inline-block;
  background-repeat: no-repeat;
  background-size: 60% 60%;
  background-position: 50%;
  /* margin-right: 1.2em; */
  border-radius: 50%;
  vertical-align: middle;
}
.datacomparison-container .icon.icon-down {
  background-image: url("/static/img/sub/datacomparison/down.png");
}

.datacomparison-container .icon.icon-up {
  background-image: url("/static/img/sub/datacomparison/up.png");
}
.datacomparison-container .icon.icon-fair {
  background-image: url("/static/img/sub/datacomparison/fair.png");
}

.left {
  font-size: 2.2em;
  margin-right: 1.6em;
  display: flex;
  align-items: center;
}

.right {
  font-size: 16px;
  color: #b2ddff;
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

.datacomparison-container .down strong {
  color: #17bb97;
}

.datacomparison-container .up strong {
  color: #eb4939;
}

.datacomparison-container .fair strong {
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
