<template>
  <div class="symbolComp" :style="styles">
    <span
      class="valueText"
      :class="highConfig['数据位置'].value"
      :style="fontStyle"
      >{{ highConfig.percentage + highConfig["数据单位"].value }}</span
    >
    <el-progress
      class="el-progress"
      :percentage="progressPercent"
      :show-text="false"
      ref="elProgress"
    ></el-progress>
  </div>
</template>
<script>
import mixin from "@/component/mixin.js";
import translateConfig from "./config/progress.js";
export default {
  mixins: [mixin],
  props: {
    theme: String
  },
  watch: {
    "$store.getters.theme": function() {
      let theme = this[this.theme];
      this.highConfig["字体样式"].value[3] = theme.color;
    },
    "highConfig.数据位置.value": {
      immediate: true,
      handler: function(n) {
        if (n === "none") {
          this.highConfig["数据单位"].type = "";
        } else {
          this.highConfig["数据单位"].type = "input";
        }
      }
    }
  },
  computed: {
    progressPercent() {
      if (!this.$store.state.runtime) return 30;
      let num = 0;
      let min = parseFloat(this.highConfig["最小值"].value);
      let max = parseFloat(this.highConfig["最大值"].value);
      let val = this.highConfig.percentage;
      if (val > max) {
        num = 1;
      } else if (val > min) {
        num = (val - min) / (max - min);
      }
      return num * 100;
    }
  },
  methods: {
    initStyle(bool) {
      this.startInitStyle();
      let theme = this[this.theme];
      theme.color = this.highConfig["字体样式"].value[3];
      let proOuter = this.$refs.elProgress.$el.getElementsByClassName(
        "el-progress-bar__outer"
      )[0];
      let proInner = this.$refs.elProgress.$el.getElementsByClassName(
        "el-progress-bar__inner"
      )[0];
      proOuter.style.backgroundColor = this.baisicConfig["背景颜色"].value;
      proOuter.style.border = `${this.baisicConfig["边框粗细"].value}px solid ${this.baisicConfig["边框颜色"].value}`;
      proOuter.style.height = this.baisicConfig["数据条高度"].value + "px";
      proInner.style.backgroundColor = this.baisicConfig["填充颜色"].value;

      this.styles = {
        opacity: this.baisicConfig["显示度"].value / 100
      };

      let font = this.highConfig["字体样式"].value;
      this.fontStyle = {
        fontSize: font[0],
        fontFamily: font[1],
        fontWeight: font[2],
        color: font[3]
      };
      this.endInitStyle(bool);
    },
    pointIdChange(val) {
      this.highConfig.percentage = val && val[0];
    },
    translateConfig(item) {
      return translateConfig(item);
    },
    returnConfig() {
      let collectPointIds = [this.highConfig["显示数据"].value];
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
      black: {
        color: "#E53F3F",
        背景颜色: "#24252A",
        填充颜色: "#E53F3F",
        边框颜色: "#000"
      },
      white: {
        color: "#E53F3F",
        背景颜色: "#DADCDF",
        填充颜色: "#E53F3F",
        边框颜色: "#000"
      },
      highConfig: {
        添加响应: {
          type: "explain"
        },
        最小值: {
          type: "input",
          inputType: "number",
          value: 0
        },
        最大值: {
          type: "input",
          inputType: "number",
          value: 100
        },
        线条1: {
          type: "line"
        },
        数据位置: {
          type: "select",
          label: [
            {
              label: "无",
              value: "none"
            },
            {
              label: "右",
              value: "row"
            },
            {
              label: "左",
              value: "row-reverse"
            },
            {
              label: "上",
              value: "column-reverse"
            },
            {
              label: "下",
              value: "column"
            }
          ],
          value: "none"
        },
        数据单位: {
          type: "input",
          value: ""
        },
        字体样式: {
          type: "fontStyle",
          value: ["14px", "", "normal", "#E53F3F"]
        },
        线条2: {
          type: "line"
        },
        显示数据: {
          type: "dataTree",
          value: []
        },
        percentage: 30
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
        边框颜色: {
          type: "color-select",
          value: "#000"
        },
        背景颜色: {
          type: "color-select",
          value: "#24252A"
        },
        填充颜色: {
          type: "color-select",
          value: "#E53F3F"
        },
        边框粗细: {
          type: "slider",
          status: 1,
          range: [0, 10],
          value: 0
        },
        数据条高度: {
          type: "slider",
          status: 1,
          range: [1, 30],
          value: 12
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
        线条2: {
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
  }
};
</script>

<style lang="less" scoped>
.symbolComp {
  padding: 0 20px;
  width: calc(100%);
  height: calc(100%);
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  box-sizing: border-box;
  overflow: hidden;
  .el-progress {
    flex: 1;
    padding: 0 10px;
    font-size: 100%;
  }
  .valueText {
    text-align: center;
    &.none {
      display: none;
    }
    &.row-reverse {
      padding-right: 20px;
    }
    &.row {
      order: 9;
      padding-left: 20px;
    }
    &.column-reverse {
      width: 100%;
    }
    &.column {
      order: 9;
      width: 100%;
    }
  }
  /deep/ .el-progress-bar__outer {
    box-sizing: border-box;
  }
}
</style>
