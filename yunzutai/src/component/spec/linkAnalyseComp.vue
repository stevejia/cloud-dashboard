<template>
  <div class="symbolComp" :style="styles">
    <div class="first">
      <div class="regional">
        <div class="title">区域查询</div>
        <div class="tree"></div>
      </div>
      <div class="analysis">
        <div class="data-search">
          <div class="title">查询条件</div>
          <div class="block">
            <el-date-picker
              v-model="beginTime"
              type="datetime"
              class="dateClass"
              :disabled="!$store.state.runtime"
              clearable
              size="mini"
              placeholder="开始时间"
            >
            </el-date-picker>
          </div>
          <div class="block">
            <el-date-picker
              v-model="endTime"
              type="datetime"
              class="dateClass"
              :disabled="!$store.state.runtime"
              clearable
              size="mini"
              placeholder="结束时间"
            >
            </el-date-picker>
          </div>
          <button class="btn">查询</button>
        </div>
        <div class="energy">
          <span>能耗类别: </span>
          <div class="block">
            <el-select
              v-model="value"
              placeholder="请选择"
              clearable
              class="dateClass"
              size="mini"
            >
              <el-option label="水能耗0" value="水能耗0"> </el-option>
            </el-select>
          </div>
          <div class="block">
            <el-select
              v-model="value"
              placeholder="请选择"
              clearable
              class="dateClass"
              size="mini"
            >
              <el-option label="电能耗0" value="电能耗0"> </el-option>
            </el-select>
          </div>
          <div class="block">
            <el-select
              v-model="value"
              placeholder="请选择"
              clearable
              class="dateClass"
              size="mini"
            >
              <el-option label="热能耗0" value="热能耗0"> </el-option>
            </el-select>
          </div>
          <span>参数选择: </span>
          <div class="block">
            <el-select
              v-model="value"
              placeholder="请选择"
              clearable
              class="dateClass"
              size="mini"
            >
              <el-option label="温度" value="温度"> </el-option>
            </el-select>
          </div>
        </div>
        <div class="echarts" ref="chart"></div>
      </div>
    </div>
    <div class="second">
      <div class="focus">
        <div class="title">区域查询</div>
        <div class="tree"></div>
      </div>
      <div class="statistics">
        <div class="left">
          <div class="title">图例面板</div>
        </div>
        <div class="right">
          <div class="title">能耗系数对比</div>
          <div class="body">
            <div class="titles">关系系数:相关度50%</div>
            <div class="titles">相关系数:</div>
            <div class="sliders">
              <div class="slider-line">
                <div class="top">50%</div>
                <span class="ll"></span>
                <span class="circle"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import translateConfig from "./config/freezingStation";
import colorList from "../../components/differentClassJson/common/chartColor.json";
import mixin from "@/component/mixin.js";
import echarts from "echarts";
export default {
  mixins: [mixin],
  methods: {
    formatTooltip(val) {
      return val + "%";
    },
    translateConfig(item) {
      return translateConfig(item);
    },
    init() {
      console.log("init");
      this.charts = echarts.init(this.$refs.chart);
      this.drawEcharts();
    },
    //resetComp（bool）高度变化，字体跟着变化，可以进行样式属性重新赋值
    //bool：false----高度一直在变化，这个时候不能进行图表重绘
    //bool：true---高度最后一次变化，这个时候应该进行图表重绘
    resetComp(bool) {
      console.log(bool);
      if (bool) {
        this.charts.resize();
      }
    },
    drawEcharts() {
      let theme = this.theme;
      let option = {
        title: {
          text: "能耗图",
          textStyle: {
            fontSize: 16, //标题颜色
            color: colorList[theme].title,
            fontFamily: "微软雅黑"
          }
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            crossStyle: {
              color: "#999"
            }
          }
        },
        toolbox: {
          feature: {
            magicType: {
              show: true,
              type: ["line", "bar"]
            }
          }
        },
        legend: {
          textStyle: {
            color: colorList[theme].legend
          }
        },
        xAxis: [
          {
            type: "category",
            data: [
              "2019.2.31",
              "2019.4.31",
              "2019.6.31",
              "2019.8.31",
              "2019.10.31",
              "2019.12.31"
            ],
            axisLabel: {
              color: colorList[theme].label
            },
            axisLine: {
              lineStyle: {
                color: colorList[theme].line
              }
            },

            splitLine: {
              lineStyle: {
                // 使用深浅的间隔色
                color: colorList[theme].line
              }
            },
            axisPointer: {
              type: "shadow"
            }
          }
        ],
        yAxis: [
          {
            type: "value",
            name: "能耗值:电(kwh)",
            min: 6217.32,
            max: 6545.27,
            // interval: 50,
            nameTextStyle: {
              color: colorList[theme].label
            },
            axisLabel: {
              color: colorList[theme].label,
              formatter: "{value}"
            },
            axisLine: {
              lineStyle: {
                color: colorList[theme].line
              }
            },
            splitLine: {
              lineStyle: {
                // 使用深浅的间隔色
                color: colorList[theme].line
              }
            }
          },
          {
            type: "value",
            name: "温度(°C)",
            min: 0,
            max: 25,
            // interval: 5,
            nameTextStyle: {
              color: colorList[theme].label
            },
            axisLabel: {
              color: colorList[theme].label,
              formatter: "{value}"
            },
            axisLine: {
              lineStyle: {
                color: colorList[theme].line
              }
            },
            splitLine: {
              lineStyle: {
                // 使用深浅的间隔色
                color: colorList[theme].line
              }
            }
          }
        ],
        series: [
          {
            name: "能耗值",
            type: "line",
            data: [6314.15, 6440.15, 6340.15, 6345.15, 6374.15, 6414.15],
            itemStyle: {
              normal: {
                color: "rgb(30, 136, 229)"
              }
            }
          },
          {
            name: "温度",
            type: "line",
            yAxisIndex: 1,
            data: [2.0, 3.2, 3.3, 4.5, 6.3, 10.2],
            itemStyle: {
              normal: {
                color: "rgb(230, 105, 57)"
              }
            }
          }
        ]
      };
      this.charts.setOption(option, true);
    },
    initStyle(bool) {
      let { theme, baisicConfig } = this.startInitStyle();

      //这里进行一些当前组件属性的转换与使用
      this.styles = {
        color: theme.color
      };
      console.log(baisicConfig);

      this.endInitStyle(bool);
    }
  },
  data() {
    return {
      sliderValue: 50,
      charts: null,
      beginTime: "",
      endTime: "",
      value: "",
      styles: {},
      white: {
        字体样式0: "#000000"
      },
      black: {
        字体样式0: "#FFFFFF"
      },
      highConfig: {},
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
        线条: {
          type: "line"
        },
        字体样式: {
          type: "font",
          value: ["", "normal", "", ""]
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
        线条1: {
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
.sliders {
  height: 145px;
  width: calc(100%);
  display: flex;
  align-items: flex-end;

  .slider-line {
    width: calc(100%);
    height: 24px;
    margin: 16px 0;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    background: #83a8c9;
    position: relative;
    .top {
      position: absolute;
      left: calc(50% - 35px);
      bottom: 34px;
      width: 70px;
      height: 89px;
      background: url(/static/img/sub/correlatchart/guanlian1.png) no-repeat
        center;
      font-weight: 700;
      font-size: 22px;
      color: rgb(255, 255, 255);
      line-height: 80px;
      text-align: center;
    }
    .ll {
      height: calc(100%);
      width: calc(50%);
      background: #3573c1;
    }
    .circle {
      position: absolute;
      left: calc(50% - 10px);
      bottom: 2px;
      // box-sizing: border-box;
      width: 16px;
      height: 16px;
      border: 2px solid #c0c4cc;
      border-radius: 50%;
      background-color: #fff;
    }
  }
}

.dateClass {
  width: 130px;
}
.btn {
  outline: none;
  cursor: pointer;
  padding: 4px 15px;
  border: none;
  min-width: 58px;
  min-height: 28px;
  border-radius: 4px;
  box-sizing: border-box;
}
.symbolComp {
  width: calc(100%);
  height: calc(100%);
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  white-space: pre;
  overflow: hidden;
  .first {
    margin-top: 10px;
    display: flex;
    height: calc(55%);
    justify-content: space-around;
    align-content: flex-start;
    .regional {
      width: 20%;
      height: 100%;
      padding: 10px;
      box-sizing: border-box;
      margin-right: 10px;
      .title {
        height: 35px;
        line-height: 35px;
        font-weight: 700;
      }
      .tree {
        background-color: #18191d;
        width: 100%;
        height: calc(100% - 47px);
        white-space: nowrap;
        overflow: auto;
        color: #b2ddff;
      }
    }
    .analysis {
      width: 80%;
      height: 100%;
      box-sizing: border-box;
      padding: 10px;
      .data-search {
        height: 35px;
        color: #b2ddff;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        margin-bottom: 15px;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        .title {
          padding-right: 10px;
        }
        .block {
          margin: 0 10px 0 5px;
        }
      }
      .energy {
        padding: 10px 0;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        .block {
          margin: 0 10px 0 5px;
        }
      }
      .echarts {
        height: calc(100% - 80px);
        width: calc(100%);
        padding: 6px;
      }
    }
  }
  .second {
    margin-top: 10px;
    display: flex;
    height: calc(45%);
    justify-content: space-around;
    align-content: flex-start;
    .focus {
      width: 20%;
      height: 100%;
      padding: 10px;
      box-sizing: border-box;
      margin-right: 10px;
      .title {
        height: 35px;
        line-height: 35px;
        font-weight: 700;
      }
      .tree {
        background-color: #18191d;
        width: 100%;
        height: calc(100% - 47px);
        white-space: nowrap;
        overflow: auto;
        color: #b2ddff;
      }
    }
    .statistics {
      display: flex;
      flex-direction: row;
      width: 80%;
      height: 100%;
      box-sizing: border-box;
      padding: 10px;
      .left,
      .right {
        flex: 1;
        .body {
          font-weight: normal;
          color: #b2ddff;
          height: calc(100% - 55px);
          box-sizing: content-box;
          padding: 10px;
          titles {
            margin-bottom: 10px;
          }
        }
      }
      .title {
        height: 35px;
        line-height: 35px;
        font-weight: 700;
      }
    }
  }
}
</style>
