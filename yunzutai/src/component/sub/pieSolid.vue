<template>
  <div class="symbolComp" :style="styles">
    <div ref="chart" style="width:100%;height:100%"></div>
  </div>
</template>
<script>
import echarts from "echarts";
import colorList from "../../components/differentClassJson/common/chartColor.json";
import mixin from "@/component/mixin.js";
import translateConfig from "./config/pieSolid.js";
export default {
  mixins: [mixin],
  props: {
    theme: String
  },
  methods: {
    init() {
      if (!this.$store.state.runtime) return;
      let points = [];
      for (let i of this.highConfig["数据添加"].value) {
        if (i.pointId && i.pointId.length) {
          points.push(i.pointId[i.pointId.length - 1]);
        }
      }
      let timeType = this.baisicConfig["默认时间选择"].timeType;
      let statisticsType =
        timeType === "r" ? 1 : this.baisicConfig["默认时间选择"].statisticsType;
      this.$drag.addShifte(this, {
        timeType: timeType,
        statisticsType: statisticsType || 2,
        pointIds: points
      });
    },

    initStyle(bool) {
      let theme = this[this.theme];
      theme.backgroundColor = this.baisicConfig["背景颜色"].value;
      theme.color = this.baisicConfig["字体"].value[2];
      theme.legColor = this.baisicConfig["说明文字字体"].value[2];
      this.styles = {
        opacity: this.baisicConfig["显示度"].value / 100,
        background: this.baisicConfig["背景颜色"].value
      };
      this.drawPie();
      this.endInitStyle(bool);
    },

    themeChange() {
      let theme = this[this.theme];
      this.highConfig["数据添加"].theme = this.theme;
      this.baisicConfig["背景颜色"].value = theme.backgroundColor;
      this.baisicConfig["字体"].value[2] = theme.color;
      this.baisicConfig["说明文字字体"].value[2] = theme.legColor;
      this.initStyle(true);
    },
    // 重绘
    resetComp(bool) {
      if (bool) {
        this.charts.resize();
      }
    },

    drawPie() {
      if (!this.charts) {
        this.charts = echarts.init(this.$refs.chart);
      }
      let positionArr = this.baisicConfig["显示位置"].value.split("_");
      let LegPositionArr = this.baisicConfig["说明文字"].value.split("_");
      let font = this.baisicConfig["字体"].value;
      let font2 = this.baisicConfig["说明文字字体"].value;
      this.charts.setOption({
        title: {
          text: this.baisicConfig["名称"].value,
          left: positionArr[0],
          top: positionArr[1],
          textStyle: {
            fontSize: font[0].substring(0, font[0].length - 2),
            fontFamily: font[1],
            color: font[2]
          }
        },
        tooltip: {
          trigger: "item",
          formatter: "{a}<br/>{b}:{c} ({d}%)"
        },
        legend: {
          orient: "horizontal",
          show: LegPositionArr[0] != "none",
          left: LegPositionArr[0],
          top: LegPositionArr[1],
          data: this.highConfig["数据添加"].value,
          textStyle: {
            fontSize: font2[0].substring(0, font[0].length - 2),
            fontFamily: font2[1],
            color: font2[2]
          }
        },
        color: this.highConfig["数据添加"][this.theme],
        series: [
          {
            name: this.baisicConfig["名称"].value,
            type: "pie",
            radius: "55%",
            top: "-50px",
            bottom: "20px",
            center: ["50%", "60%"],
            data: this.highConfig["数据添加"].value,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          }
        ]
      });
    },

    pointIdChange(val) {
      if (val.statusCode != 200) return;
      let points = {};
      for (let i of val.data.points) {
        points[i.pointId] = i.proportion;
      }
      for (let n of this.highConfig["数据添加"].value) {
        let pointId = n.pointId[n.pointId.length - 1];
        if (points[pointId]) {
          n.value = points[pointId];
        }
      }
      this.drawPie();
    },

    translateConfig(item) {
      return translateConfig(item);
    }
  },

  data() {
    return {
      charts: "",
      styles: {},
      black: {
        color: "#fff",
        legColor: "#B2DDFF",
        backgroundColor: "rgba(0, 0, 0, 0)"
      },
      white: {
        color: "#333",
        legColor: "#333",
        backgroundColor: "rgb(255, 255, 255)"
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
        名称: {
          type: "input",
          value: "饼图"
        },
        显示位置: {
          type: "select",
          label: [
            {
              label: "上",
              value: "center_top"
            },
            {
              label: "下",
              value: "center_bottom"
            },
            {
              label: "左",
              value: "left_middle"
            },
            {
              label: "右",
              value: "right_middle"
            },
            {
              label: "左上",
              value: "left_top"
            },
            {
              label: "右上",
              value: "right_top"
            },
            {
              label: "左下",
              value: "left_bottom"
            },
            {
              label: "右下",
              value: "right_bottom"
            }
          ],
          value: "left_top"
        },
        说明文字: {
          type: "select",
          label: [
            {
              label: "无",
              value: "none"
            },
            {
              label: "上",
              value: "center_top"
            },
            {
              label: "下",
              value: "center_bottom"
            },
            {
              label: "左",
              value: "left_middle"
            },
            {
              label: "右",
              value: "right_middle"
            },
            {
              label: "左上",
              value: "left_top"
            },
            {
              label: "右上",
              value: "right_top"
            },
            {
              label: "左下",
              value: "left_bottom"
            },
            {
              label: "右下",
              value: "right_bottom"
            }
          ],
          value: "none"
        },
        线条2: {
          type: "line"
        },
        字体: {
          type: "fontThree",
          value: ["14px", "", "#fff"]
        },
        说明文字字体: {
          type: "fontThree",
          value: ["14px", "", "#B2DDFF"]
        },
        背景颜色: {
          type: "color-select",
          value: ""
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
        线条3: {
          type: "line"
        },
        旋转角度: {
          type: "slider",
          status: 1,
          range: [0, 360],
          value: 0
        },
        线条4: {
          type: "line"
        },
        默认时间选择: {
          type: "pieSelectDate",
          timeType: "r",
          statisticsType: ""
        }
      },
      highConfig: {
        添加响应: {
          type: "explain"
        },
        数据添加: {
          type: "seriesData",
          maxLength: 16,
          value: [
            {
              name: "默认名称0",
              value: 100,
              pointId: []
            }
          ],
          white: [colorList.white.pieData[0]],
          black: [colorList.black.pieData[0]],
          theme: this.theme
        }
      }
    };
  }
};
</script>

<style lang="less" scoped>
.symbolComp {
  padding: 0 10px;
  width: calc(100%);
  height: calc(100%);
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  white-space: pre;
  overflow: hidden;
}
</style>
