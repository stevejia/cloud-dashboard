<template>
  <div class="symbolComp" :style="styles">
    <div
      class="icon-wrapper"
      :style="{ background: baisicConfig[increaseState + '颜色'].value }"
    >
      <i
        class="iconfont"
        :class="staType[baisicConfig['图标样式选择'].value].icon"
      ></i>
    </div>
    <div class="text-wrapper">
      <p :style="dataFontStyle" class="dataValue">
        {{ highConfig.statisticInfo.data }}
      </p>
      <p class="desc-wrapper">
        <span :style="percentFontStyle" class="percent">
          <i class="iconfont iconjiantou up" v-if="increaseState == '上升'"></i>
          <span class="iconfont" v-else-if="increaseState == '平衡'">=</span>
          <i class="iconfont iconjiantou" v-else></i>
          {{ Math.abs(highConfig.statisticInfo.percentage) }}%
        </span>
        <span :style="descFontStyle" class="desc">
          本{{
            baisicConfig["时间类型选择"].value +
              staType[baisicConfig["图标样式选择"].value].label
          }}
        </span>
      </p>
    </div>
  </div>
</template>
<script>
import mixin from "@/component/mixin.js";
import translateConfig from "./config/statistics.js";
export default {
  mixins: [mixin],
  props: {
    theme: String
  },
  methods: {
    init() {
      this.computeRatio();
      let percentage = this.highConfig.statisticInfo.percentage;
      this.increaseState =
        percentage > 0 ? "上升" : percentage < 0 ? "下降" : "平衡";

      if (!this.$store.state.runtime) return;
      let points = this.highConfig["绑定位号"].value;
      if (!points || !points.length) return;
      this.$drag.addShifte(this, {
        intervalUnit: this.baisicConfig["时间类型选择"].value,
        pointId: points[points.length - 1]
      });
    },
    initStyle(bool, type) {
      this.startInitStyle();
      this.styles = {
        opacity: this.baisicConfig["显示度"].value / 100,
        background: this.baisicConfig["背景颜色"].value,
        border: `${this.baisicConfig["边框粗细"].value}px solid ${this.baisicConfig["边框颜色"].value}`
      };
      // 记录手动设置字体大小时的信息
      if (
        [
          "数据字体/颜色/大小",
          "上升(下降)字体/字体大小",
          "字体/颜色/大小"
        ].includes(type)
      ) {
        this.computeRatio();
      }
      this.setFontSize();
      this.endInitStyle(bool);
    },
    resetComp() {
      this.setFontSize();
      let size1 = parseInt(this.dataFontStyle.fontSize);
      let size2 = parseInt(this.percentFontStyle.fontSize);
      let size3 = parseInt(this.descFontStyle.fontSize);
      this.baisicConfig["数据字体/颜色/大小"].value.splice(0, 1, size1);
      this.baisicConfig["上升(下降)字体/字体大小"].value.splice(0, 1, size2);
      this.baisicConfig["字体/颜色/大小"].value.splice(0, 1, size3);
    },
    setFontSize() {
      let height = this.baisicConfig["尺寸"].value[1];
      let font1 = this.baisicConfig["数据字体/颜色/大小"].value;
      let font2 = this.baisicConfig["上升(下降)字体/字体大小"].value;
      let font3 = this.baisicConfig["字体/颜色/大小"].value;
      let size1 = parseInt(this.dataRadio * height);
      let size2 = parseInt(this.percentRadio * height);
      let size3 = parseInt(this.descRadio * height);
      this.dataFontStyle = {
        fontSize: (size1 > 12 ? size1 : 12) + "px",
        fontFamily: font1[1],
        color: font1[2]
      };
      this.percentFontStyle = {
        fontSize: (size2 > 12 ? size2 : 12) + "px",
        fontFamily: font2[1],
        color: this.baisicConfig[this.increaseState + "颜色"].value
      };
      this.descFontStyle = {
        fontSize: (size3 > 12 ? size3 : 12) + "px",
        fontFamily: font3[1],
        color: font3[2]
      };
      this.styles.fontSize = height * 0.4 + "px";
    },
    computeRatio() {
      let font1 = this.baisicConfig["数据字体/颜色/大小"].value;
      let font2 = this.baisicConfig["上升(下降)字体/字体大小"].value;
      let font3 = this.baisicConfig["字体/颜色/大小"].value;
      let height = this.baisicConfig["尺寸"].value[1];
      this.dataRadio = (font1[0] / height).toFixed(3);
      this.percentRadio = (font2[0] / height).toFixed(3);
      this.descRadio = (font3[0] / height).toFixed(3);
    },
    pointIdChange(val) {
      if (val.statusCode != 200) return;
      this.highConfig.statisticInfo = {
        data: val.data.value,
        percentage: (val.data.increases * 100).toFixed(2)
      };
      this.increaseState =
        val.data.increases > 0
          ? "上升"
          : val.data.increases < 0
          ? "下降"
          : "平衡";
      this.percentFontStyle.color = this.baisicConfig[
        this.increaseState + "颜色"
      ].value;
    },
    translateConfig(item) {
      return translateConfig(item);
    }
  },
  // mounted() {
  //   setTimeout(() => {
  //     let data = {
  //       data: {
  //         value: 2040,
  //         increases: 0.707
  //       }
  //     };
  //     this.pointIdChange(data);
  //   }, 2000);
  // },
  data() {
    return {
      styles: {},
      fontStyle: {},
      dataFontStyle: {},
      percentFontStyle: {},
      descFontStyle: {},
      dataRadio: "",
      percentRadio: "",
      descRadio: "",
      black: {
        "数据字体/颜色/大小2": "#B2DDFF",
        "字体/颜色/大小2": "#B2DDFF",
        上升颜色: "#E73F3E",
        平衡颜色: "#F1921C",
        下降颜色: "#3573C1",
        背景颜色: "#24252A",
        边框颜色: "rgba(0, 0, 0, 0)"
      },
      white: {
        "数据字体/颜色/大小2": "#455A64",
        "字体/颜色/大小2": "#99ABB4",
        上升颜色: "#E73F3E",
        平衡颜色: "#F1921C",
        下降颜色: "#3573C1",
        背景颜色: "#fff",
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
        时间类型选择: {
          type: "select",
          label: [
            {
              label: "小时",
              value: "小时"
            },
            {
              label: "日",
              value: "日"
            },
            {
              label: "周",
              value: "周"
            },
            {
              label: "月",
              value: "月"
            },
            {
              label: "季度",
              value: "季度"
            },
            {
              label: "年",
              value: "年"
            }
          ],
          value: "日"
        },
        线条2: {
          type: "line"
        },
        图标样式选择: {
          type: "select",
          label: [
            {
              label: "电",
              value: "elec"
            },
            {
              label: "气",
              value: "air"
            },
            {
              label: "水",
              value: "water"
            },
            {
              label: "热",
              value: "hot"
            },
            {
              label: "经济",
              value: "econ"
            }
          ],
          value: "air"
        },
        线条3: {
          type: "line"
        },
        "字体/颜色/大小": {
          type: "fontThrees",
          value: [16, "", "#fff"]
        },
        "数据字体/颜色/大小": {
          type: "fontThrees",
          value: [30, "", "#fff"]
        },
        "上升(下降)字体/字体大小": {
          type: "fontAbleSet",
          typeParam: { fontSize: "input", fontFamily: true },
          value: [14, ""]
        },
        上升颜色: {
          type: "color-select",
          value: ""
        },
        平衡颜色: {
          type: "color-select",
          value: ""
        },
        下降颜色: {
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
        数据关联: {
          type: "explain"
        },
        绑定位号: {
          type: "dataTree",
          value: ""
        },
        statisticInfo: {
          data: 30445.5,
          percentage: "-50.55"
        }
      },
      staType: {
        elec: {
          label: "耗电(kWh)",
          icon: "iconstatistics-0-black"
        },
        air: {
          label: "耗气(m³)",
          icon: "iconstatistics-1-black"
        },
        water: {
          label: "耗水(t)",
          icon: "iconstatistics-2-black"
        },
        hot: {
          label: "耗热(kWh)",
          icon: "iconstatistics-3-black"
        },
        econ: {
          label: "花费(￥)",
          icon: "iconstatistics-4-black"
        }
      },
      increaseState: "平衡"
    };
  }
};
</script>

<style lang="less" scoped>
.symbolComp {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: calc(100%);
  height: calc(100%);
  box-sizing: border-box;
  overflow: hidden;
  .iconfont {
    cursor: default;
  }
  .icon-wrapper {
    margin-right: 0.55em;
    padding: 0.14em;
    border-radius: 0.14em;
    background: red;
    .iconfont {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
      font-size: 100%;
      color: rgb(36, 37, 42);
    }
  }
  .text-wrapper {
    text-align: right;
    .dataValue {
      font-weight: 600;
    }
    .desc-wrapper {
      line-height: 1;
    }
    .percent {
      display: inline-flex;
      justify-content: flex-end;
      align-items: center;
      margin-right: 0.5em;
      vertical-align: middle;
    }
    .iconfont {
      font-size: 0.8em;
      margin-right: 0.2em;
    }
    .up {
      transform: rotate(180deg);
    }
    .desc {
      display: inline-block;
      white-space: nowrap;
      vertical-align: middle;
    }
    p {
      margin: 0;
      font-size: 0;
    }
  }
}
</style>
