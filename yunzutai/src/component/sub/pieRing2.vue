<template>
  <div class="symbolComp" :style="styles">
    <div ref="chart" style="width:100%;height:100%"></div>
  </div>
</template>
<script>
import echarts from "echarts";
import colorList from "../../components/differentClassJson/common/chartColor.json";
import mixin from "@/component/mixin.js";
import translateConfig from "./config/pieRing2.js";
export default {
  mixins: [mixin],
  props: {
    theme: String
  },
  methods: {
    init() {
      if (!this.$store.state.runtime) return;
      if (this.highConfig["数据添加"].dataType == "1") return;
      let points = [];
      for (let i of this.highConfig["数据添加"].value) {
        if (i.pointId && i.pointId.length) {
          points.push(i.pointId[i.pointId.length - 1]);
        }
        if (i.totalPointId && i.totalPointId.length) {
          points.push(i.totalPointId[i.totalPointId.length - 1]);
        }
      }
      this.$drag.addShifte(this, {
        timeType: "ch",
        statisticsType: 2,
        pointIds: points
      });
    },

    initStyle(bool) {
      let theme = this[this.theme];
      theme.backgroundColor = this.baisicConfig["背景颜色"].value;
      theme.legColor = this.baisicConfig["图表内容字体"].value[2];
      theme.titleColor = this.baisicConfig["图表标题字体"].value[2];
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
      this.baisicConfig["图表内容字体"].value[2] = theme.legColor;
      this.baisicConfig["图表标题字体"].value[2] = theme.titleColor;
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
      let positionArr = this.baisicConfig["标题位置"].value.split("_");
      let LegPositionArr = this.baisicConfig["说明文字"].value.split("_");
      let font = this.baisicConfig["图表标题字体"].value;
      let font2 = this.baisicConfig["图表内容字体"].value;
      let font3 = this.baisicConfig["环内字体"].value;
      let series = this.highConfig["数据添加"].value;
      let legendData = [];
      // console.log(series);
      for (let i = 0; i < series.length; i++) {
        let item = series[i];
        item.data[1].value = item.totalAmount - item.data[0].value;
        item.data[0].label.fontSize = font3[0].substring(0, font[0].length - 2);
        item.data[0].label.fontFamily = font3[1];
        item.data[0].label.formatter = "{c}" + item.valueUnit;
        item.radius = [30 + i * 15 + "%", 40 + i * 15 + "%"];
        item.data[0].label.padding = [0, 0, -40 + i * 40, 0];
        item.data[1].itemStyle.color = this[this.theme].disableColor;
        item.data[1].emphasis = {
          itemStyle: {
            color: this[this.theme].disEmpColor
          }
        };
        legendData.push(item.data[0].name);
      }
      this.charts.setOption(
        {
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
          legend: {
            orient: "horizontal",
            left: LegPositionArr[0],
            top: LegPositionArr[1],
            data: legendData,
            textStyle: {
              fontSize: font2[0].substring(0, font[0].length - 2),
              fontFamily: font2[1],
              color: font2[2]
            }
          },
          tooltip: {
            show: false,
            trigger: "item",
            formatter: "{a}<br/>{b}:{c} ({d}%)"
          },
          color: this.highConfig["数据添加"][this.theme],
          series: this.highConfig["数据添加"].value
        },
        true
      );
    },

    pointIdChange(val) {
      if (val.statusCode != 200) return;
      let points = {};
      for (let i of val.data.points) {
        points[i.pointId] = i.proportion;
      }
      for (let n of this.highConfig["数据添加"].value) {
        let pointId = n.pointId[n.pointId.length - 1];
        if (points[pointId] != undefined) {
          n.data[0].value = points[pointId];
        }
        let totalPId = n.totalPointId[n.totalPointId.length - 1];
        if (points[totalPId] != undefined) {
          n.totalAmount = points[totalPId];
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
        titleColor: "#fff",
        legColor: "#B2DDFF",
        backgroundColor: "rgba(0, 0, 0, 0)",
        disableColor: "#58555F",
        disEmpColor: "#58555F"
      },
      white: {
        titleColor: "#333",
        legColor: "#333",
        backgroundColor: "rgba(0, 0, 0, 0)",
        disableColor: "#ccc",
        disEmpColor: "#ccc"
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
          value: "环图"
        },
        标题位置: {
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
          value: "center_bottom"
        },
        线条2: {
          type: "line"
        },
        图表标题字体: {
          type: "fontThree",
          value: ["14px", "", "#fff"]
        },
        图表内容字体: {
          type: "fontThree",
          value: ["14px", "", "#B2DDFF"]
        },
        环内字体: {
          type: "fontAbleSet",
          typeParam: { fontSize: true, fontFamily: true },
          value: ["14px", ""]
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
        }
      },
      highConfig: {
        数据关联: {
          type: "explain"
        },
        数据添加: {
          type: "pieNestedSeries",
          value: [
            {
              type: "pie",
              radius: ["30%", "40%"],
              hoverAnimation: false,
              clockwise: false,
              avoidLabelOverlap: true,
              labelLine: {
                show: false
              },
              totalAmount: 100,
              totalPointId: "",
              pointId: "",
              valueUnit: "%",
              data: [
                {
                  value: 75,
                  name: "报警",
                  label: {
                    show: true,
                    position: "center",
                    padding: [40, 0, 0, 0]
                  }
                },
                {
                  value: 0,
                  name: "",
                  emphasis: {
                    itemStyle: {
                      color: "#58555F"
                    }
                  },
                  itemStyle: {
                    color: "#58555F"
                  }
                }
              ]
            },
            {
              type: "pie",
              radius: ["45%", "55%"],
              hoverAnimation: false,
              clockwise: false,
              avoidLabelOverlap: true,
              labelLine: {
                show: false
              },
              totalAmount: 100,
              totalPointId: "",
              pointId: "",
              valueUnit: "台",
              data: [
                {
                  value: 20,
                  name: "故障",
                  label: {
                    show: true,
                    position: "center",
                    padding: [0, 0, 0, 0]
                  }
                },
                {
                  value: 0,
                  name: "",
                  emphasis: {
                    itemStyle: {
                      color: "#58555F"
                    }
                  },
                  itemStyle: {
                    color: "#58555F"
                  }
                }
              ]
            }
          ],
          dataType: "1",
          white: [colorList.white.pieData[0], colorList.white.pieData[1]],
          black: [colorList.black.pieData[0], colorList.black.pieData[1]],
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
