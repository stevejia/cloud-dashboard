<template>
  <div class="symbolComp" :style="styles">
    <span
      class="valueText"
      :class="highConfig['数据位置'].value"
      :style="fontStyle"
    >
      {{ highConfig.sliderVal + highConfig["数据单位"].value }}
    </span>
    <el-slider
      class="el-slider"
      v-model="highConfig.sliderVal"
      :show-tooltip="false"
      :min="parseInt(highConfig['最小值'].value)"
      :max="parseInt(highConfig['最大值'].value)"
      :step="parseInt(highConfig['步长值'].value)"
      @change="sliderChange"
      ref="elSlider"
    ></el-slider>
  </div>
</template>
<script>
import mixin from "@/component/mixin.js";
import translateConfig from "./config/slider.js";
import { bulkSet } from "@/api/bulk.js";
export default {
  mixins: [mixin],
  props: {
    theme: String
  },
  watch: {
    "$store.getters.theme": function() {
      this.highConfig["字体样式"].value[3] = this[this.theme].color;
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
  methods: {
    initStyle(bool) {
      this.startInitStyle();
      this[this.theme].color = this.highConfig["字体样式"].value[3];
      let slider = this.$refs.elSlider.$el.getElementsByClassName(
        "el-slider__runway"
      )[0];
      let sliderBar = this.$refs.elSlider.$el.getElementsByClassName(
        "el-slider__bar"
      )[0];
      let sliderButton = this.$refs.elSlider.$el.getElementsByClassName(
        "el-slider__button"
      )[0];
      slider.style.backgroundColor = this.baisicConfig["数据条背景颜色"].value;
      slider.style.border = `${this.baisicConfig["边框粗细"].value}px solid ${this.baisicConfig["数据条边框颜色"].value}`;
      sliderBar.style.backgroundColor = this.baisicConfig[
        "数据条前景颜色"
      ].value;
      sliderButton.style.borderColor = this.baisicConfig["滑块边框颜色"].value;
      sliderButton.style.backgroundColor = this.baisicConfig[
        "滑块填充颜色"
      ].value;

      this.styles = {
        opacity: this.baisicConfig["显示度"].value / 100,
        fontSize: this.baisicConfig["数据条高度"].value + "px"
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
      this.highConfig.sliderVal = val && val[0];
    },
    sliderChange() {
      if (!this.$store.state.runtime) return;
      let points = this.highConfig["数据"].params[1].value;
      let pointId = points && points[points.length - 1];
      if (!pointId) {
        this.$message({
          message: "未绑定有效显示点位！",
          type: "warning",
          duration: 3000,
          showClose: true
        });
        return;
      }
      let param = [
        {
          pointId,
          value: this.highConfig.sliderVal
        }
      ];
      bulkSet(param)
        .then(res => {
          if (res.statusCode !== 200) return;
          this.$message({
            message: res.message,
            type: "success",
            duration: 3000,
            showClose: true
          });
        })
        .catch(err => {
          this.$message.error(err.message);
        });
    },
    translateConfig(item) {
      return translateConfig(item);
    },
    returnConfig() {
      let collectPointIds = [this.highConfig["数据"].params[0].value];
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
      value: 0,
      black: {
        数据条边框颜色: "#000",
        数据条背景颜色: "#7C95A8",
        数据条前景颜色: "#3573C1",
        滑块边框颜色: "#B2DDFF",
        滑块填充颜色: "#3573C1",
        color: "#E53F3F"
      },
      white: {
        数据条边框颜色: "#000",
        数据条背景颜色: "#DADCDF",
        数据条前景颜色: "#3573C1",
        滑块边框颜色: "#B2DDFF",
        滑块填充颜色: "#3573C1",
        color: "#E53F3F"
      },
      styles: {},
      fontStyle: {},
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
        步长值: {
          type: "input",
          inputType: "number",
          value: 1
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
        线条1: {
          type: "line"
        },
        数据: {
          type: "dataTreeLinkage",
          params: [
            {
              title: "显示数据",
              value: ""
            },
            {
              title: "发送数据",
              value: "",
              sameAbove: false
            }
          ]
        },
        sliderVal: 50
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
        数据条边框颜色: {
          type: "color-select",
          value: ""
        },
        数据条背景颜色: {
          type: "color-select",
          value: "#7C95A8"
        },
        数据条前景颜色: {
          type: "color-select",
          value: "#409EFF"
        },
        滑块边框颜色: {
          type: "color-select",
          value: "#409EFF"
        },
        滑块填充颜色: {
          type: "color-select",
          value: "#FFF"
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
  .el-slider {
    flex: 1;
    padding: 0 10px;
    font-size: 100%;
  }
  .el-slider /deep/ .el-slider__runway {
    height: 1em;
    box-sizing: border-box;
    border-radius: 0.7em;
    font-size: 100%;
    .el-slider__bar {
      height: 100%;
      border-radius: 0.7em;
    }
    .el-slider__button-wrapper {
      top: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 6em;
      width: 6em;
      transform: translate(-50%, -50%);
      .el-slider__button {
        height: 2em;
        width: 2em;
        box-sizing: border-box;
      }
    }
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
}
</style>
