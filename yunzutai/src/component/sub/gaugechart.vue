<template>
  <div class="symbolComp" :style="styles">
    <div ref="chart" style="width:100%;height:100%"></div>
  </div>
</template>
<script>
import echarts from "echarts";
import mixin from "@/component/mixin.js";
import translateConfig from "./config/gaugechart.js";
export default {
  mixins: [mixin],
  props: {
    theme: String
  },
  methods: {
    initStyle(bool) {
      let theme = this[this.theme];
      theme.backgroundColor = this.baisicConfig["背景颜色"].value;
      theme.titleColor = this.baisicConfig["表盘名称字体"].value[2];
      theme.numColor = this.baisicConfig["表盘数值字体"].value[2];
      this.styles = {
        opacity: this.baisicConfig["显示度"].value / 100,
        background: this.baisicConfig["背景颜色"].value
      };
      this.drawChart();
      this.endInitStyle(bool);
    },

    themeChange() {
      let theme = this[this.theme];
      this.highConfig["数据添加"].theme = this.theme;
      this.baisicConfig["背景颜色"].value = theme.backgroundColor;
      this.baisicConfig["表盘名称字体"].value[2] = theme.titleColor;
      this.baisicConfig["表盘数值字体"].value[2] = theme.numColor;
      this.initStyle(true);
    },
    // 重绘
    resetComp(bool) {
      if (bool) {
        this.charts.resize();
      }
    },

    drawChart() {
      if (!this.charts) {
        this.charts = echarts.init(this.$refs.chart);
      }
      let font = this.baisicConfig["表盘名称字体"].value;
      let font2 = this.baisicConfig["表盘数值字体"].value;
      this.charts.setOption({
        tooltip: {
          formatter: "{a} <br/>{b} : {c}%"
        },
        series: [
          {
            name: this.highConfig["数据添加"].value[0].name,
            type: "gauge",
            detail: {
              fontSize: font2[0].substring(0, font2[0].length - 2),
              fontFamily: font2[1],
              color: font2[2],
              formatter: "{value}" + this.baisicConfig["单位"].value
            },
            data: [
              {
                value: this.highConfig["数据添加"].value[0].value,
                name: this.baisicConfig["标题"].value,
                itemStyle: {
                  color: this.highConfig["数据添加"][this.theme][0]
                }
              }
            ],
            title: {
              offsetCenter: [0, "70%"],
              textStyle: {
                fontSize: font[0].substring(0, font[0].length - 2),
                fontFamily: font[1],
                color: font[2]
              }
            },
            min: this.baisicConfig["最小刻度值"].value,
            max: this.baisicConfig["最大刻度值"].value,
            splitNumber: parseInt(this.baisicConfig["刻度段数"].value)
          }
        ]
      });
    },

    pointIdChange(val) {
      this.highConfig["数据添加"].value[0].value = val;
      this.drawChart();
    },
    translateConfig(item) {
      return translateConfig(item);
    },
    returnConfig() {
      let collectPointIds = [this.highConfig["数据添加"].value[0].pointId];
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
        backgroundColor: "rgba(0, 0, 0, 0)",
        titleColor: "#fff",
        numColor: "#34A8C2"
      },
      white: {
        backgroundColor: "rgb(255, 255, 255)",
        titleColor: "#333",
        numColor: "#333"
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
        标题: {
          type: "input",
          value: "仪表盘名称"
        },
        最小刻度值: {
          type: "input",
          inputType: "number",
          value: 0
        },
        最大刻度值: {
          type: "input",
          inputType: "number",
          value: 100
        },
        单位: {
          type: "input",
          value: "%"
        },
        刻度段数: {
          type: "input",
          inputType: "number",
          value: 10
        },
        线条2: {
          type: "line"
        },
        表盘名称字体: {
          type: "fontThree",
          value: ["20px", "", "#fff"]
        },
        表盘数值字体: {
          type: "fontThree",
          value: ["24px", "", "#34A8C2"]
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
        添加响应: {
          type: "explain"
        },
        数据添加: {
          type: "seriesData",
          maxLength: 1,
          labelArr: ["", "", "指针颜色"],
          value: [
            {
              name: "业务指标",
              value: 90,
              pointId: []
            }
          ],
          black: ["#34A8C2"],
          white: ["#63869E"],
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
