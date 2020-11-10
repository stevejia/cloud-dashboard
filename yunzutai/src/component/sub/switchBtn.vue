<template>
  <div class="symbolComp" :style="styles">
    <div class="switchs" :style="switchsStyle" @click="btnCut">
      <div class="circle" :style="circleStyle"></div>
      <div class="text" :style="textStyle">{{ text }}</div>
    </div>
  </div>
</template>
<script>
import mixin from "@/component/mixin.js";
import translateConfig from "./config/switchBtn";
export default {
  mixins: [mixin],
  props: {
    theme: String
  },
  data() {
    return {
      text: "",
      styles: {},
      circleStyle: {},
      switchsStyle: {},
      textStyle: {},
      isOn: false, //表示开
      white: {
        字体3: "#6cc044",
        背景颜色: "#000000",
        按钮颜色: "#3573C1"
      },
      black: {
        字体3: "#6cc044",
        背景颜色: "#000000",
        按钮颜色: "#3573C1"
      },
      highConfig: {
        添加响应: {
          type: "explain"
        },
        显示切换: {
          type: "dataTree",
          value: []
        },
        添加事件: {
          type: "explain"
        },
        事件: {
          type: "eventBtn",
          remind: false,
          ditto: false,
          value: [
            {
              order: "",
              open: {
                valueList: [{}]
              },
              off: { valueList: [{}] }
            }
          ]
        }
      },
      baisicConfig: {
        尺寸: {
          type: "widthHeight",
          label: ["宽度", "高度"],
          value: [0, 0]
        },
        位置: {
          type: "widthHeight",
          label: ["横轴", "纵轴"],
          value: [0, 0]
        },
        线条1: {
          type: "line"
        },
        背景颜色: {
          type: "color-select",
          value: "#000000"
        },
        按钮颜色: {
          type: "color-select",
          value: "#3573C1"
        },
        字体: {
          type: "fontFour",
          value: ["12px", "", "center", "#6cc044"]
        },
        样式还原: {
          type: "resetStyle"
        },
        线条2: {
          type: "line"
        },
        开状态文本: {
          type: "input",
          value: "ON"
        },
        关状态文本: {
          type: "input",
          value: "OFF"
        },
        线条3: {
          type: "line"
        },
        旋转角度: {
          type: "slider",
          status: 1,
          range: [0, 360],
          value: 0
        }
      }
    };
  },
  mounted() {
    this.theme = this.$store.getters.theme;
  },
  methods: {
    // 和南京同步转换
    translateConfig(item) {
      return translateConfig(item);
    },
    initStyle(bool) {
      this.startInitStyle();
      // let theme = this[this.theme];
      let font = this.baisicConfig["字体"].value;
      this.textStyle = {
        fontSize: font[0],
        fontFamily: font[1],
        justifyContent: font[2],
        color: font[3]
      };
      this.circleStyle = {
        background: this.baisicConfig["按钮颜色"].value
      };
      this.switchsStyle.background = this.baisicConfig["背景颜色"].value;
      this.switchIsOn();
      this.endInitStyle(bool);
    },
    btnCut() {
      this.$nextTick(() => {
        this.isOn = !this.isOn;
        this.switchIsOn();
      });
    },
    returnConfig() {
      let collectPointIds = this.highConfig["显示切换"].value;
      return {
        collectPointIds: [collectPointIds],
        white: this.white,
        black: this.black,
        highConfig: this.highConfig,
        baisicConfig: this.baisicConfig
      };
    },
    switchIsOn() {
      this.$nextTick(() => {
        if (!this.isOn) {
          this.text = this.baisicConfig["开状态文本"].value;
          this.switchsStyle.flexDirection = "row";
        } else {
          this.text = this.baisicConfig["关状态文本"].value;
          this.switchsStyle.flexDirection = "row-reverse";
        }
      });
    },
    pointIdChange(val) {
      if (val[0] == "0") {
        this.isOn = true;
      } else {
        this.isOn = false;
      }
      this.switchIsOn();
    }
  }
};
</script>
<style lang="less" scoped>
.symbolComp {
  width: calc(100%);
  height: calc(100%);
  box-sizing: border-box;
  white-space: pre;
  overflow: hidden;
  .switchs {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 200px;
    box-sizing: border-box;
    white-space: pre;
    padding: 5%;
    .circle {
      width: 37.97%;
      border-radius: 50%;
      background-color: #0064ff;
      height: 100%;
    }
    .text {
      flex: 1;
      display: flex;
      padding: 0 4px;
      align-items: center;
    }
  }
}
</style>
