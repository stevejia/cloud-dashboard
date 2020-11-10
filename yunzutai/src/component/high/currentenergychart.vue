<template>
  <div class="symbolComp" :style="boxStyles">
    <div class="statistics" :style="titleStyle" v-if="isPattern">
      {{ titleObj.name }} <span class="value">:{{ titleValue }}</span
      >{{ titleObj.unit }}
    </div>
    <div class="echartsDiv" ref="chart" style="margin-top:10px"></div>
  </div>
</template>
<script>
import echarts from "echarts";
import colorList from "../../components/differentClassJson/common/chartColor.json";
import translateConfig from "./swichConfig/currentenergychart";
import { changeEchartsTheme, getCurrentchart } from "./swichConfig/common.js";
import mixin from "@/component/mixin.js";
// import { gettest } from "@/api/high.js";
// import { showEchartLoading, closeEchartLoading } from "@/util/util.js";
export default {
  mixins: [mixin],
  props: {
    theme: String
  },
  data() {
    return {
      name: "",
      titleStyle: {},
      boxStyles: {},
      charts: "",
      barSeries: [],
      lineSeries: [],
      titleObj: {},
      titleValue: "2019",
      isPattern: false,
      white: {
        图表标题字体2: "#000000",
        背景颜色: "#fff",
        图表内容字体2: "#000000"
      },
      black: {
        图表标题字体2: "#ffffff",
        背景颜色: "",
        图表内容字体2: "#89a7c2"
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
          value: "当前能耗图"
        },
        线条2: {
          type: "line"
        },
        模式选择: {
          type: "select",
          value: "日",
          label: [
            { label: "日", value: "日" },
            { label: "周", value: "周" },
            { label: "月", value: "月" },
            { label: "季度", value: "季度" },
            { label: "年", value: "年" }
          ]
        },
        线条3: {
          type: "line"
        },
        坐标设置: {
          type: "coordinate",
          value: 0,
          label: [
            { label: "固定范围", value: 0 },
            { label: "自动范围", value: 1 }
          ],
          options: [
            [
              { title: "最小值", value: 0 },
              { title: "最大值", value: 300 },
              { title: "单位(能耗)", value: "kWh" }
            ],
            [
              { title: "最小值", value: 0 },
              { title: "最大值", value: 30 },
              { title: "单位(参数)", value: "°C" }
            ]
          ]
        },
        线条4: {
          type: "line"
        },
        图表标题字体: {
          type: "fontThree",
          value: ["16px", "", "#B2DDFF"]
        },
        图表内容字体: {
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
        线条5: {
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
        总能耗数据: {
          type: "explain"
        },
        数据名: {
          type: "input",
          value: "能耗默认名称1"
        },
        单位: {
          type: "input",
          value: "kwh"
        },
        数据源: {
          type: "dataTree",
          value: ""
        },
        能耗: {
          type: "explain"
        },
        数据源1: {
          type: "composeSeriesData",
          chartType: "bar",
          limtLength: 4,
          value: [
            {
              name: "能耗默认名称",
              value: 100,
              pointId: [],
              rule: "",
              white: "#1e88e5",
              black: "#3573c1",
              itemStyle: {
                normal: {
                  color: "#3573c1"
                }
              },
              devType: [
                {
                  label: "耗能统计",
                  value: 1
                },
                {
                  label: "供能统计",
                  value: 2
                },
                {
                  label: "实时值",
                  value: 3
                },
                {
                  label: "平均值",
                  value: 4
                },
                {
                  label: "最大值",
                  value: 5
                },
                {
                  label: "最小值",
                  value: 6
                }
              ],
              devValue: null,
              status: 0,
              type: "bar"
            }
          ]
        },
        参数: {
          type: "explain"
        },
        数据源2: {
          type: "composeSeriesData",
          chartType: "line",
          limtLength: 4,
          value: [
            {
              name: "参数默认名称",
              value: 100,
              pointId: [],
              rule: "",
              white: "#7460ee",
              black: "#e53f3f",
              itemStyle: {
                normal: {
                  color: "#e53f3f"
                }
              },
              devType: [
                {
                  label: "耗能统计",
                  value: 1
                },
                {
                  label: "供能统计",
                  value: 2
                },
                {
                  label: "实时值",
                  value: 3
                },
                {
                  label: "平均值",
                  value: 4
                },
                {
                  label: "最大值",
                  value: 5
                },
                {
                  label: "最小值",
                  value: 6
                }
              ],
              devValue: null,
              status: 0,
              type: "line"
            }
          ]
        }
      }
    };
  },

  watch: {
    "$store.getters.theme": function(val) {
      changeEchartsTheme(val, this.highConfig["数据源1"]);
      changeEchartsTheme(val, this.highConfig["数据源2"]);
    }
  },
  created() {
    let pattern = this.baisicConfig["模式选择"].value;
    this.barSeries = [
      getCurrentchart(this.highConfig["数据源1"].value[0], "bar", "", pattern)
    ];
    this.lineSeries = [
      getCurrentchart(this.highConfig["数据源2"].value[0], "line", "", pattern)
    ];
  },
  mounted() {
    this.theme = this.$store.getters.theme;
  },
  methods: {
    init() {
      if (!this.$store.state.runtime) return;
      let seriess = this.highConfig["数据源1"].value.concat(
        this.highConfig["数据源2"].value
      );
      let pointObj = {
        pointId: this.highConfig["数据源"].value
      };
      let pointArr = seriess.concat(pointObj);
      var reg = pointArr.find(item => {
        return item.pointId.length > 0;
      });
      let points = [];
      for (let i = 0; i < pointArr.length; i++) {
        if (reg == undefined) {
          return;
        } else {
          if (pointArr[i].pointId.length > 0) {
            let obj = {
              pointId: pointArr[i].pointId[pointArr[i].pointId.length - 1],
              statisticsType: pointArr[i].devValue || 2
            };
            points.push(obj);
          }
        }
      }
      this.$drag.addShifte(this, {
        queryIntervalUnit: this.baisicConfig["模式选择"].value,
        points: points
      });
    },
    pointIdChange(val) {
      if (!this.$store.state.runtime) return;
      let data = val.data.datas;
      if (data == null) return;
      let self = this;
      setTimeout(() => {
        let isPattern = self.isPattern;
        let seriess = self.highConfig["数据源1"].value.concat(
          self.highConfig["数据源2"].value
        );
        let seriessData = [];
        let isQuest = true;
        for (let i = 0; i < seriess.length; i++) {
          let objs = {
            itemStyle: seriess[i].itemStyle,
            type: seriess[i].type,
            name: seriess[i].name,
            yAxisIndex: seriess[i].yAxisIndex
          };
          if (seriess[i].pointId.length > 0) {
            objs.data = isPattern ? data[i + 1].values : data[i].values;
          } else {
            isQuest = false;
          }
          if (seriess[i].type == "line") {
            objs.yAxisIndex = 1;
          }
          if (seriess[i].devValue == null) {
            isQuest = false;
          }
          seriessData.push(objs);
        }

        if (isPattern) {
          this.titleValue = data[0].values.slice(-1)[0].toFixed(2);
        }
        if (!isQuest) return;
        if (seriess.length.length < 2) return;
        self.setCharts(seriessData, val.data.times);
      }, 1000);
    },
    // 绑定树组件
    getData() {
      if (this.$store.state.runtime) {
        let treeId = this.highConfig["树形图"].value;
        if (treeId) {
          console.log(this.$drag.getTreeData(treeId));
          //获取当前绑定的树组件数据
        }
      }
    },
    // 和南京同步转换
    translateConfig(item) {
      return translateConfig(item);
    },
    // 重绘
    resetComp(bool) {
      if (bool) {
        this.charts.resize();
      }
    },
    initStyle(bool) {
      this.startInitStyle();
      let list = this.highConfig["数据源1"].value;
      this.barSeries = this.barSeries.map((item, index) => {
        item.itemStyle = list[index].itemStyle;
        return item;
      });
      list = this.highConfig["数据源2"].value;
      this.lineSeries = this.lineSeries.map((item, index) => {
        item.itemStyle = list[index].itemStyle;
        return item;
      });
      this.drawPie();
      this.endInitStyle(bool);
    },
    // 绘制echarts
    drawPie(action, type, index, obj) {
      let pattern = this.baisicConfig["模式选择"].value;
      let chartSeries = [];
      if (!action) {
        chartSeries.push(...this.barSeries);
        chartSeries.push(...this.lineSeries);
      } else if (action === "del") {
        if (type === "bar") {
          this.barSeries.splice(index, 1);
        } else if (type === "line") {
          this.lineSeries.splice(index, 1);
        }
        chartSeries.push(...this.barSeries);
        chartSeries.push(...this.lineSeries);
      } else if (action === "add") {
        if (type === "bar") {
          this.barSeries.push(
            getCurrentchart(obj, type, this.barSeries.length, pattern)
          );
        } else if (type === "line") {
          this.lineSeries.push(
            getCurrentchart(obj, type, this.lineSeries.length, pattern)
          );
        }
        chartSeries.push(...this.barSeries);
        chartSeries.push(...this.lineSeries);
      }
      this.titleObj = {
        name: this.highConfig["数据名"].value,
        unit: this.highConfig["单位"].value
      };
      if (!this.charts) {
        this.charts = echarts.init(this.$refs.chart);
      }
      this.isPattern = this.highConfig["数据源"].value == "" ? false : true;
      let xAxisData = this.getXdata(pattern);
      this.boxStyles = {
        background: this.baisicConfig["背景颜色"].value,
        opacity: this.baisicConfig["显示度"].value / 100
      };

      let seriesData = JSON.parse(JSON.stringify(chartSeries));
      for (let i = 0; i < chartSeries.length; i++) {
        if (pattern == "日") {
          seriesData[i].data = seriesData[i].data.slice(0, 24);
        } else if (pattern == "周") {
          seriesData[i].data = seriesData[i].data.slice(0, 7);
        } else if (pattern == "月") {
          seriesData[i].data = seriesData[i].data.slice(0, 30);
        } else if (pattern == "季度") {
          seriesData[i].data = seriesData[i].data.slice(0, 4);
        } else if (pattern == "年") {
          seriesData[i].data = seriesData[i].data.slice(0, 12);
        }
      }
      this.setCharts(seriesData, xAxisData);
    },
    setCharts(seriesData, xAxisData) {
      let font = this.baisicConfig["图表标题字体"].value;
      this.titleStyle = {
        fontSize: font[0],
        fontFamily: font[1],
        color: font[2]
      };
      let font2 = this.baisicConfig["图表内容字体"].value;
      let baryAxis = this.baisicConfig["坐标设置"].options;
      let option = {
        title: {
          text: this.baisicConfig["标题"].value,
          x: "left",
          y: "top",
          textStyle: {
            fontSize: font[0].substring(0, font[0].length - 2),
            fontFamily: font[1],
            color: font[2]
          }
        },
        grid: {
          left: "3%",
          right: "3%",
          bottom: "2%",
          containLabel: true
        },
        tooltip: {
          trigger: "axis", //触发类型；轴触发，axis则鼠标hover到一条柱状图显示全部数据，item则鼠标hover到折线点显示相应数据
          axisPointer: {
            //坐标轴指示器，坐标轴触发有效
            type: "cross", //默认为line，line直线，cross十字准星，shadow阴影
            crossStyle: {
              color: "#999"
            }
          }
        },
        toolbox: {
          feature: {
            dataView: {
              show: false,
              readOnly: false
            },
            magicType: {
              show: false,
              type: ["line", "bar"]
            },
            restore: {
              show: false
            },
            saveAsImage: {
              show: false
            }
          }
        },
        legend: {
          textStyle: {
            fontSize: font2[0].substring(0, font[0].length - 2),
            fontFamily: font2[1],
            color: font2[2]
          }
        },
        //x轴信息
        xAxis: {
          interval: 50,
          type: "category",
          data: xAxisData,
          axisLabel: {
            fontSize: font2[0].substring(0, font[0].length - 2),
            fontFamily: font2[1],
            color: font2[2]
          },
          axisLine: {
            lineStyle: {
              color: font2[2]
            }
          },
          splitLine: {
            lineStyle: {
              // 使用深浅的间隔色
              color: font2[2]
            }
          },
          axisPointer: {
            type: "shadow"
          }
        },
        yAxis: [
          //y轴信息
          {
            type: "value",
            name: `单位:(${baryAxis[0][2].value})`,
            min: 0,
            max: 300,
            // interval: 50,//分段
            nameTextStyle: {
              fontSize: font2[0].substring(0, font[0].length - 2),
              fontFamily: font2[1],
              color: font2[2]
            },
            axisLabel: {
              fontSize: font2[0].substring(0, font[0].length - 2),
              fontFamily: font2[1],
              color: font2[2],
              formatter: "{value} "
            },
            axisLine: {
              lineStyle: {
                color: colorList[this.theme].line
              }
            },
            splitLine: {
              lineStyle: {
                // 使用深浅的间隔色
                color: colorList[this.theme].line
              }
            }
          },
          {
            type: "value",
            name: `单位:(${baryAxis[1][2].value})`,
            min: 0,
            max: 25,
            // interval: 5,
            nameTextStyle: {
              fontSize: font2[0].substring(0, font[0].length - 2),
              fontFamily: font2[1],
              color: font2[2]
            },
            axisLabel: {
              fontSize: font2[0].substring(0, font[0].length - 2),
              fontFamily: font2[1],
              color: font2[2],
              formatter: "{value} "
            },
            axisLine: {
              lineStyle: {
                color: colorList[this.theme].line
              }
            },
            splitLine: {
              lineStyle: {
                // 使用深浅的间隔色
                color: colorList[this.theme].line
              }
            }
          }
        ],
        series: seriesData
      };
      if (this.baisicConfig["坐标设置"].value == 0) {
        option.yAxis[0].min = baryAxis[0][0].value || 0;
        option.yAxis[0].max = baryAxis[0][1].value || 250;
        option.yAxis[1].min = baryAxis[1][0].value || 0;
        option.yAxis[1].max = baryAxis[1][1].value || 25;
      } else {
        delete option.yAxis[0]["min"];
        delete option.yAxis[0]["max"];
        delete option.yAxis[1]["min"];
        delete option.yAxis[1]["max"];
      }
      this.charts.setOption(option, true);
    },
    getXdata(pattern) {
      let data = [];
      switch (pattern) {
        case "日":
          data = [
            "00:00",
            "01:00",
            "02:00",
            "03:00",
            "04:00",
            "05:00",
            "06:00",
            "07:00",
            "08:00",
            "09:00",
            "10:00",
            "11:00",
            "12:00",
            "13:00",
            "14:00",
            "15:00",
            "16:00",
            "17:00",
            "18:00",
            "19:00",
            "20:00",
            "21:00",
            "22:00",
            "23:00"
          ];
          break;
        case "周":
          data = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
          break;
        case "月":
          data = [
            "1",
            "2",
            "3",
            "4",
            "5",
            "6",
            "7",
            "8",
            "9",
            "10",
            "11",
            "12",
            "13",
            "14",
            "15",
            "16",
            "17",
            "18",
            "19",
            "20",
            "21",
            "22",
            "23",
            "24",
            "25",
            "26",
            "27",
            "28",
            "29",
            "30"
          ];
          break;
        case "季度":
          data = [
            "第一季度(1月-3月)",
            "第二季度(4月-6月)",
            "第三季度(7月-9月)",
            "第四季度(10月-12月)"
          ];
          break;
        case "年":
          data = [
            "1月",
            "2月",
            "3月",
            "4月",
            "5月",
            "6月",
            "7月",
            "8月",
            "9月",
            "10月",
            "11月",
            "12月"
          ];
          break;

        default:
          break;
      }
      return data;
    }
  }
};
</script>

<style lang="less" scoped>
.symbolComp {
  padding: 0 10px;
  width: calc(100%);
  height: calc(100%);
  white-space: pre;
  overflow: hidden;
  box-sizing: border-box;
  padding: 10px;
  .echartsDiv {
    height: calc(100% - 28px);
    width: calc(100%);
  }
  .statistics {
    position: absolute;
    top: 8px;
    left: 0;
    width: 93%;
    text-align: right;
    font-size: 16px;
    font-weight: 700;
  }
}
</style>
