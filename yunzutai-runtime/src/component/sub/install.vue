<template>
  <div class="symbolComp" @click="dbClick" :style="styles">
    <div class="left" :style="titleStyle">
      {{ baisicConfig["标签标题"].value }}
    </div>
    <span
      class="line"
      :style="{ background: baisicConfig['竖线颜色'].value }"
    ></span>
    <div class="right" :style="dataStyle">
      <span>{{ highConfig.installVal }}</span>
      <span>{{ baisicConfig["单位"].value }}</span>
    </div>
  </div>
</template>
<script>
import mixin from "@/component/mixin.js";
import translateConfig from "./config/install.js";
export default {
  mixins: [mixin],
  props: {
    theme: String
  },
  methods: {
    init() {
      this.computeRatio();
    },
    initStyle(bool, type) {
      this.startInitStyle();
      this.styles = {
        opacity: this.baisicConfig["显示度"].value / 100,
        background: this.baisicConfig["背景颜色"].value,
        border: `${this.baisicConfig["边框粗细"].value}px solid ${this.baisicConfig["边框颜色"].value}`
      };
      // 记录手动设置字体大小时的信息
      if (["标签字体", "数值单位字体"].includes(type)) {
        this.computeRatio();
      }
      this.setFontSize();
      this.endInitStyle(bool);
    },
    resetComp() {
      this.setFontSize();
      let size1 = parseInt(this.titleStyle.fontSize);
      let size2 = parseInt(this.dataStyle.fontSize);
      this.baisicConfig["标签字体"].value.splice(0, 1, size1);
      this.baisicConfig["数值单位字体"].value.splice(0, 1, size2);
    },
    setFontSize() {
      let height = this.baisicConfig["尺寸"].value[1];
      let width = this.baisicConfig["尺寸"].value[0];
      let font1 = this.baisicConfig["标签字体"].value;
      let font2 = this.baisicConfig["数值单位字体"].value;
      let size1 = parseInt(this.titleRatio * height);
      let size2 = parseInt(this.dataRatio * height);
      this.titleStyle = {
        fontSize: (size1 > 12 ? size1 : 12) + "px",
        fontFamily: font1[1],
        color: font1[2],
        paddingLeft: width * 0.05 + "px",
        marginRight: width * 0.05 + "px",
        width: "calc(50% - " + width * 0.05 + "px)"
      };
      this.dataStyle = {
        fontSize: (size2 > 12 ? size2 : 12) + "px",
        fontFamily: font2[1],
        color: font2[2],
        paddingLeft: width * 0.05 + "px",
        paddingRight: width * 0.08 + "px"
      };
      this.styles.fontSize = height * 0.4 + "px";
    },
    computeRatio() {
      let font1 = this.baisicConfig["标签字体"].value;
      let font2 = this.baisicConfig["数值单位字体"].value;
      let height = this.baisicConfig["尺寸"].value[1];
      this.titleRatio = (font1[0] / height).toFixed(3);
      this.dataRatio = (font2[0] / height).toFixed(3);
    },
    dbClick() {
      if (!this.$store.state.runtime) return;
      let config = this.highConfig["可写入"].value;
      config.pointId = this.highConfig["数据源"].value;
      this.$drag.colorInput(config, this);
    },
    pointIdChange(val) {
      this.highConfig.installVal = val && val[0];
    },
    translateConfig(item) {
      return translateConfig(item);
    },
    returnConfig() {
      let collectPointIds = [this.highConfig["数据源"].value];
      return {
        collectPointIds,
        white: this.white,
        black: this.black,
        highConfig: this.highConfig,
        baisicConfig: this.baisicConfig
      };
    }
  },
  data() {
    return {
      styles: {},
      fontStyle: {},
      titleStyle: {},
      dataStyle: {},
      dataRatio: "",
      titleRatio: "",
      black: {
        标签字体2: "#F1921C",
        数值单位字体2: "#B2DDFF",
        竖线颜色: "#18191D",
        背景颜色: "#24252A",
        边框颜色: "rgba(0, 0, 0, 0)"
      },
      white: {
        标签字体2: "#3573C1",
        数值单位字体2: "#455A64",
        竖线颜色: "#3573C1",
        背景颜色: "#DFE5EA",
        边框颜色: "#ddd"
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
        标签标题: {
          type: "input",
          value: "设置温度"
        },
        线条2: {
          type: "line"
        },
        单位: {
          type: "input",
          value: "°C"
        },
        线条3: {
          type: "line"
        },
        标签字体: {
          type: "fontThrees",
          value: [15, "", "#fff"]
        },
        数值单位字体: {
          type: "fontThrees",
          value: [15, "", "#fff"]
        },
        竖线颜色: {
          type: "color-select",
          value: ""
        },
        背景颜色: {
          type: "color-select",
          value: "#24252A"
        },
        边框颜色: {
          type: "color-select",
          value: ""
        },
        边框粗细: {
          type: "slider",
          status: 1,
          range: [0, 10],
          value: 1
        },
        显示度: {
          type: "slider",
          status: 1,
          range: [0, 100],
          value: 100
        },
        样式还原: {
          type: "resetStyle"
        },
        线条4: {
          type: "line"
        },
        旋转角度: {
          type: "slider",
          status: 1,
          range: [0, 360],
          value: 0
        }
      },
      highConfig: {
        添加数据: {
          type: "explain"
        },
        数据源: {
          type: "dataTree",
          value: []
        },
        线条: {
          type: "line"
        },
        可写入: {
          type: "writeable",
          value: {
            writeable: false,
            passwordStatus: false,
            role: ""
          }
        },
        installVal: 26.9
      }
    };
  }
};
</script>

<style lang="less" scoped>
.symbolComp {
  position: relative;
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  font-size: 0;
  display: flex;
  align-items: center;
  overflow: hidden;
  white-space: nowrap;
  .left {
    float: left;
    height: 100%;
    width: 50%;
    overflow: hidden;
    box-sizing: border-box;
    font-size: 15px;
    display: flex;
    align-items: center;
  }
  .right {
    flex: 0.8;
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-width: fit-content;
  }
  .line {
    width: 2px;
    height: 40%;
  }
}
</style>
