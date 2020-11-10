<template>
  <div class="symbolComp" :style="styles">
    <div ref="chart" style="width:100%;height:100%"></div>
  </div>
</template>
<script>
import echarts from "echarts";
export default {
  props: {
    theme: String
  },
  watch: {
    "$store.getters.theme": function() {
      let theme = this[this.theme];
      this.highConfig["数据添加"].theme = this.theme;
      this.baisicConfig["背景颜色"].value = theme.backgroundColor;
      this.baisicConfig["字体"].value[3] = theme.color;
      this.initStyle(true);
    },

    "baisicConfig.尺寸.value": {
      handler: function(newV) {
        this.charts.resize({
          height: newV[1] + "px",
          width: newV[0] + "px"
        });
      }
    }
  },
  methods: {
    initStyle(bool) {
      let theme = this[this.theme];
      theme.backgroundColor = this.baisicConfig["背景颜色"].value;
      theme.color = this.baisicConfig["字体"].value[3];
      this.styles = {
        opacity: this.baisicConfig["显示度"].value / 100,
        background: this.baisicConfig["背景颜色"].value
      };

      if (!bool) {
        this.$parent.initStyle(
          this.baisicConfig["尺寸"].value,
          this.baisicConfig["位置"].value,
          this.baisicConfig["旋转角度"].value
        );
      }
      this.drawPie();
    },

    drawPie() {
      if (!this.charts) {
        this.charts = echarts.init(this.$refs.chart);
      }
      let positionArr = this.baisicConfig["显示位置"].value.split("_");
      let font = this.baisicConfig["字体"].value;
      this.charts.setOption({
        title: {
          text: this.baisicConfig["名称"].value,
          left: positionArr[0],
          top: positionArr[1],
          textStyle: {
            fontSize: font[0].substring(0, font[0].length - 2),
            fontFamily: font[1],
            color: font[3]
          }
        },
        tooltip: {
          trigger: "item",
          formatter: "{a}<br/>{b}:{c} ({d}%)"
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
    }
  },
  data() {
    return {
      charts: "",
      styles: {},
      black: {
        color: "#fff",
        backgroundColor: "rgba(255, 255, 255, 0)"
      },
      white: {
        color: "#333",
        backgroundColor: "rgba(255, 255, 255, 1)"
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
        线条2: {
          type: "line"
        },
        字体: {
          type: "fontThree",
          value: ["14px", "", "", "#fff"]
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
          range: [0, 160],
          value: 0
        },
        线条4: {
          type: "line"
        },
        默认时间选择: {
          type: "select",
          label: [
            {
              label: "实时",
              value: "center_top"
            },
            {
              label: "当日",
              value: "center_bottom"
            }
          ],
          value: "center_top"
        }
      },
      highConfig: {
        添加响应: {
          type: "explain"
        },
        数据添加: {
          type: "seriesData",
          chartType: "pie",
          value: [
            {
              name: "默认名称0",
              value: 100,
              pointId: [],
              rule: ""
            }
          ],
          white: [],
          black: [],
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
