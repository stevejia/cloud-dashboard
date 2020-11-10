<template>
  <div class="symbolComp" :style="styles">
    <div ref="chart" style="width:100%;height:100%"></div>
  </div>
</template>
<script>
import echarts from "echarts";
import mixin from "@/component/mixin.js";
import translateConfig from "./config/barChart.js";
export default {
  mixins: [mixin],
  props: {
    theme: String
  },
  // watch: {
  //   "$store.getters.theme": function() {
  //     this.themeChange();
  //   }
  // },
  // mounted() {
  //   this.theme = this.$store.getters.theme;
  //   this.themeChange();
  // },
  methods: {
    initStyle(bool) {
      this.startInitStyle();
      this.styles = {
        opacity: this.baisicConfig["显示度"].value / 100
      };
      this.drawChart();
      this.endInitStyle(bool);
    },
    // themeChange() {
    //   let theme = this[this.theme];
    //   this.baisicConfig["背景颜色"].value = theme.backgroundColor;
    //   this.baisicConfig["填充颜色"].value = theme.barColor;
    //   this.baisicConfig["标尺颜色"].value = theme.color;
    //   this.initStyle(true);
    // },
    drawChart(val = 50) {
      if (!this.charts) {
        this.charts = echarts.init(this.$refs.chart);
      }
      this.charts.setOption(
        {
          grid: {
            left: "17%",
            top: "10%",
            right: "-2%",
            bottom: "3%"
          },
          yAxis: {
            name: this.baisicConfig["多表单"].value[2].value,
            show: true,
            offset: -8,
            type: "value",
            interval: 10,
            max: this.baisicConfig["多表单"].value[1].value,
            min: this.baisicConfig["多表单"].value[0].value,
            axisLine: {
              lineStyle: {
                color: this.baisicConfig["标尺颜色"].value
                // color: vm[prop][theme].option.rodcolor
              }
            },
            axisLabel: {
              show: true,
              showMinLabel: true,
              showMaxLabel: true,
              formatter: value => {
                if (
                  value == this.baisicConfig["多表单"].value[0].value ||
                  value == this.baisicConfig["多表单"].value[1].value
                ) {
                  return value;
                }
              }
            },
            splitLine: {
              show: false
            }
          },
          xAxis: {
            show: false,
            type: "category"
          },
          series: [
            {
              name: "成绩",
              type: "bar",
              label: {
                normal: {
                  show: true,
                  position: "Top",
                  offset: [-30, -4],
                  textStyle: {
                    color: this.baisicConfig["标尺颜色"].value
                  },
                  formatter: item => {
                    let str = item.value;
                    if (
                      item.value ==
                        this.baisicConfig["多表单"].value[0].value ||
                      item.value == this.baisicConfig["多表单"].value[1].value
                    ) {
                      str = "";
                    }
                    return str;
                  }
                }
              },
              showBackground: true,
              backgroundStyle: {
                color: this.baisicConfig["背景颜色"].value
              },
              data: [
                {
                  value: val,
                  itemStyle: {
                    normal: {
                      borderColor: this.baisicConfig["边框颜色"].value,
                      borderWidth: "3",
                      color: this.baisicConfig["填充颜色"].value
                    }
                  },
                  name: "分数"
                }
              ]
            }
          ]
        },
        true
      );
    },
    // 重绘
    resetComp(bool) {
      if (bool) {
        this.charts.resize();
      }
    },
    pointIdChange(val) {
      if (!val) return;
      this.drawChart(val[0]);
    },
    translateConfig(item) {
      return translateConfig(item);
    },
    returnConfig() {
      let collectPointIds = [this.highConfig["绑定数据"].value];
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
      charts: "",
      styles: {},
      black: {
        标尺颜色: "#B2DDFF",
        填充颜色: "#3573C1",
        背景颜色: "#24252A",
        边框颜色: "rgba(255, 255, 255, 0)"
      },
      white: {
        标尺颜色: "#455A64",
        填充颜色: "#33A566",
        背景颜色: "#DADCDF",
        边框颜色: "rgba(0, 0, 0, 0)"
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
        多表单: {
          type: "mulInput",
          value: [
            { name: "最小值", inputType: "number", value: 0 },
            { name: "最大值", inputType: "number", value: 100 },
            { name: "单位", value: "吨" }
          ]
        },
        线条2: {
          type: "line"
        },
        边框颜色: {
          type: "color-select",
          value: "rgba(255,255,255,0)"
        },
        背景颜色: {
          type: "color-select",
          value: "#24252A"
        },
        填充颜色: {
          type: "color-select",
          value: "#3573C1"
        },
        标尺颜色: {
          type: "color-select",
          value: "#B2DDFF"
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
        添加响应: {
          type: "explain"
        },
        绑定数据: {
          type: "dataTree",
          value: ""
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
