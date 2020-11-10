<template>
  <div class="symbolComp" :style="boxStyles">
    <div class="echartsDiv" ref="chart" style="margin-top:10px"></div>
  </div>
</template>
<script>
import echarts from "echarts";
import colorList from "../../components/differentClassJson/common/chartColor.json";
import translateConfig from "./config/realtimechart";
import { changeEchartsTheme, getChartSeries } from "./config/common.js";
import mixin from "@/component/mixin.js";
import moment from "moment";
export default {
  mixins: [mixin],
  props: {
    theme: String
  },
  data() {
    return {
      name: "",
      linkVmIds: [], //被当前组件绑定的元素id合集
      beginTime: new Date(),
      endTime: new Date(),
      intervalUnit: "h",
      boxStyles: {},
      btnStyle: {},
      radioSelectStyles: {},
      charts: "",
      barSeries: [],
      lineSeries: [],
      sereisDatas: [],
      times: [],
      lengthSelect: {},
      white: {
        标题字体2: "#000000",
        背景颜色: "#fff",
        图表内容字体2: "#000000"
      },
      black: {
        标题字体2: "#ffffff",
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
          value: "实时图-2"
        },
        实时数据最大个数: {
          type: "input",
          value: 7
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
              { title: "单位(柱状)", value: "kWh" }
            ],
            [
              { title: "最小值", value: 0 },
              { title: "最大值", value: 30 },
              { title: "单位(折线)", value: "°C" }
            ]
          ]
        },
        线条3: {
          type: "line"
        },
        标题字体: {
          type: "fontThree",
          value: ["16px", "", "#ffffff"]
        },
        图表内容字体: {
          type: "fontThree",
          value: ["12px", "", "#B2DDFF"]
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
        柱状图: {
          type: "explain"
        },
        数据源: {
          type: "composeSeriesData",
          collectId: true, //判断是否轮训
          chartType: "bar",
          limtLength: 3,
          name: "柱状图默认名称",
          value: [
            {
              name: "柱状图默认名称1",
              pointId: [],
              white: "#1e88e5",
              black: "#3573c1",
              itemStyle: {
                normal: {
                  color: "#3573c1"
                }
              },
              devValue: null,
              status: 0,
              type: "bar"
            }
          ]
        },
        折线图: {
          type: "explain"
        },
        数据源1: {
          type: "composeSeriesData",
          collectId: true, //判断是否轮训
          chartType: "line",
          limtLength: 3,
          name: "折线图默认名称",
          value: [
            {
              name: "折线图默认名称1",
              pointId: [],
              white: "#7460ee",
              black: "#e53f3f",
              itemStyle: {
                normal: {
                  color: "#e53f3f"
                }
              },
              devValue: null,
              status: 0,
              type: "line",
              yAxisIndex: 1
            }
          ]
        }
      }
    };
  },

  watch: {
    "$store.getters.theme": function(val) {
      changeEchartsTheme(val, this.highConfig["数据源"]);
      changeEchartsTheme(val, this.highConfig["数据源1"]);
    }
  },
  created() {
    this.barSeries = [
      getChartSeries(this.highConfig["数据源"].value[0], "bar")
    ];
    this.lineSeries = [
      getChartSeries(this.highConfig["数据源1"].value[0], "line")
    ];
  },
  mounted() {
    this.theme = this.$store.getters.theme;
  },
  methods: {
    // 运行态绑定数据
    pointIdChange(val) {
      if (!this.$store.state.runtime) return;
      this.filterData(val);
      let num = this.baisicConfig["实时数据最大个数"].value;
      if (!this.$store.state.runtime) return;
      let list = this.highConfig["数据源"].value.concat(
        this.highConfig["数据源1"].value
      );
      let seriesData = [];
      for (let i = 0; i < list.length; i++) {
        let newData = [];
        if (this.sereisDatas[i] != undefined) {
          newData = this.sereisDatas[i].slice(-Number(num));
        }

        let obj = {
          name: list[i].name,
          type: list[i].type,
          smooth: list[i].smooth,
          data: newData,
          itemStyle: list[i].itemStyle
        };
        seriesData.push(obj);
        if (this.sereisDatas[i] == undefined) return;
        if (this.sereisDatas[i][0] === undefined) return;
      }
      this.times.push(moment(new Date()).format("YYYY-MM-DD HH:mm:ss"));
      let newTime = this.times.slice(-Number(num));
      this.setCharts(seriesData, newTime);
    },

    returnConfig() {
      let list = this.highConfig["数据源"].value.concat(
        this.highConfig["数据源1"].value
      );
      let collectPointIds = [];
      list.forEach(item => {
        collectPointIds.push(item.pointId);
      });
      return {
        collectPointIds: collectPointIds,
        white: this.white,
        black: this.black,
        highConfig: this.highConfig,
        baisicConfig: this.baisicConfig
      };
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
      let list = this.highConfig["数据源"].value;
      this.barSeries = this.barSeries.map((item, index) => {
        item.itemStyle = list[index].itemStyle;
        return item;
      });
      list = this.highConfig["数据源1"].value;
      this.lineSeries = this.lineSeries.map((item, index) => {
        item.itemStyle = list[index].itemStyle;
        return item;
      });
      this.drawPie();
      this.endInitStyle(bool);
    },
    // 绘制echarts
    drawPie(action, type, index, obj) {
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
          this.barSeries.push(getChartSeries(obj, type, this.barSeries.length));
        } else if (type === "line") {
          this.lineSeries.push(
            getChartSeries(obj, type, this.lineSeries.length)
          );
        }
        chartSeries.push(...this.barSeries);
        chartSeries.push(...this.lineSeries);
      }
      if (!this.charts) {
        this.charts = echarts.init(this.$refs.chart);
      }
      this.boxStyles = {
        background: this.baisicConfig["背景颜色"].value,
        opacity: this.baisicConfig["显示度"].value / 100
      };
      let dataChars = this.highConfig["数据源"].value.concat(
        this.highConfig["数据源1"].value
      );
      for (let i = 0; i < chartSeries.length; i++) {
        chartSeries[i].name = dataChars[i].name;
      }
      let xData = [
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
      let objs = {};
      chartSeries.forEach(item => {
        return (objs[item.name] = true);
      });
      this.lengthSelect = objs;
      this.setCharts(chartSeries, xData);
    },
    setCharts(chartSeries, xData) {
      let font = this.baisicConfig["标题字体"].value;
      let font2 = this.baisicConfig["图表内容字体"].value;
      let baryAxis = this.baisicConfig["坐标设置"].options;
      let selected = JSON.parse(JSON.stringify(this.lengthSelect));
      let self = this;
      let option = {
        title: {
          text: self.baisicConfig["标题"].value,
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
              color: font[2]
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
          selected: selected,
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
          data: xData,
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
                color: colorList[self.theme].line
              }
            },
            splitLine: {
              lineStyle: {
                // 使用深浅的间隔色
                color: colorList[self.theme].line
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
                color: colorList[self.theme].line
              }
            },
            splitLine: {
              lineStyle: {
                // 使用深浅的间隔色
                color: colorList[self.theme].line
              }
            }
          }
        ],
        series: chartSeries
      };
      if (self.baisicConfig["坐标设置"].value == 0) {
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
      self.charts.on("legendselectchanged", function(params) {
        self.lengthSelect = params.selected;
      });
      self.charts.setOption(option, true);
    },
    filterData(val) {
      let arr = val;
      let newArr = this.sereisDatas;
      arr.forEach((v, idx) => {
        if (!newArr[idx]) {
          newArr[idx] = [];
        }
        newArr[idx].push(v);
      });
      this.sereisDatas = newArr;
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
    height: calc(100%);
    width: calc(100%);
  }
  .search-container {
    height: 50px;
    width: 100%;
  }
}
</style>
