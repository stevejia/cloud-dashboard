<template>
  <div class="symbolComp" :style="boxStyles">
    <div class="search-container">
      <DateSearch
        :config="baisicConfig"
        ref="dateSearch"
        :theme="$store.getters.theme"
        :timeInterval="timeInterval"
        @search="doSearch"
      ></DateSearch>
    </div>
    <div class="echartsDiv" ref="chart" style="margin-top:10px"></div>
  </div>
</template>
<script>
import echarts from "echarts";
import colorList from "../../components/differentClassJson/common/chartColor.json";
import DateSearch from "../common/dateSearch.vue";
import translateConfig from "./swichConfig/comlinebar";
import { changeEchartsTheme, getChartSeries } from "./swichConfig/common.js";
import mixin from "@/component/mixin.js";
import { chartBulkGet } from "@/api/high.js";
import { showEchartLoading, closeEchartLoading } from "@/util/util.js";
export default {
  mixins: [mixin],
  components: {
    DateSearch
  },
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
      timeInterval: [
        {
          value: "1",
          label: "1分钟"
        },
        {
          value: "2",
          label: "2分钟"
        },
        {
          value: "5",
          label: "5分钟"
        },
        {
          value: "10",
          label: "10分钟"
        },
        {
          value: "15",
          label: "15分钟"
        },
        {
          value: "30",
          label: "30分钟"
        },
        {
          value: "h",
          label: "小时"
        },
        {
          value: "d",
          label: "日"
        },
        {
          value: "w",
          label: "周"
        },
        {
          value: "M",
          label: "月"
        },
        {
          value: "q",
          label: "季度"
        },
        {
          value: "y",
          label: "年"
        }
      ],
      white: {
        标题字体2: "#000000",
        查询条件字体2: "#41464d",
        背景颜色: "#fff",
        按钮颜色: "#3573C1",
        图表内容字体2: "#000000"
      },
      black: {
        标题字体2: "#ffffff",
        查询条件字体2: "#b2ddff",
        背景颜色: "",
        按钮颜色: "rgb(53, 115, 193)",
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
          value: "柱状折线图"
        },
        线条2: {
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
              { title: "最大值", value: 250 },
              { title: "单位(柱状)", value: "kWh" }
            ],
            [
              { title: "最小值", value: 0 },
              { title: "最大值", value: 25 },
              { title: "单位(折线)", value: "℃" }
            ]
          ]
        },
        线条3: {
          type: "line"
        },
        查询条件字体: {
          type: "fontThree",
          value: ["16px", "Microsoft Yahei", "#B2DDFF"]
        },
        标题字体: {
          type: "fontThree",
          value: ["16px", "Microsoft Yahei", "#B2DDFF"]
        },
        图表内容字体: {
          type: "fontThree",
          value: ["14px", "Microsoft Yahei", "#B2DDFF"]
        },
        背景颜色: {
          type: "color-select",
          value: ""
        },
        按钮颜色: {
          type: "color-select",
          value: "rgb(53, 115, 193)"
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
        // 线条5: {
        //   type: "line"
        // },
        // 日期类型: {
        //   type: "dateType",
        //   time: [new Date(new Date() - 24 * 60 * 60 * 1000), new Date()],
        //   values: [true, true, false, true, false, false],
        //   label: ["小时", "日", "周", "月", "季度", "年"],
        //   value: "h"
        // }
      },
      highConfig: {
        柱状图: {
          type: "explain"
        },
        数据源: {
          type: "composeSeriesData",
          chartType: "bar",
          limtLength: 4,
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
        折线图: {
          type: "explain"
        },
        数据源1: {
          type: "composeSeriesData",
          chartType: "line",
          limtLength: 4,
          name: "折线图默认名称名称",
          value: [
            {
              name: "折线图默认名称名称1",
              pointId: [],
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
        },
        数据关联: {
          type: "explain"
        },
        树形图: {
          type: "dependtree",
          value: ""
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
  methods: {
    init() {
      let barSeries = [];
      let lineSeries = [];
      this.highConfig["数据源"].value.forEach((item, index) => {
        barSeries.push(getChartSeries(item, "bar", index));
      });
      this.barSeries = barSeries;
      this.highConfig["数据源1"].value.forEach((item, index) => {
        lineSeries.push(getChartSeries(item, "line", index));
      });
      this.lineSeries = lineSeries;
    },
    // 和南京同步转换
    translateConfig(item) {
      return translateConfig(item);
    },
    // 重绘
    resetComp(bool) {
      console.log(122);
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
      this.$refs.dateSearch.update(this.baisicConfig);
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
      let yData = [
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
      this.setCharts(chartSeries, yData);
    },
    setCharts(chartSeries, yData) {
      let font = this.baisicConfig["标题字体"].value;
      let font2 = this.baisicConfig["图表内容字体"].value;

      let baryAxis = this.baisicConfig["坐标设置"].options;
      let option = {
        title: {
          text: this.baisicConfig["标题"].value,
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
          data: yData,
          axisLabel: {
            fontSize: font2[0].substring(0, font[0].length - 2),
            fontFamily: "微软雅黑",
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
            max: 250,
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
        series: chartSeries
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
      closeEchartLoading(this.charts);
    },
    doSearch(params) {
      // if (!this.$store.state.runtime) return;
      let isEmptyTree = this.highConfig["树形图"].value;
      let seriess = this.highConfig["数据源"].value.concat(
        this.highConfig["数据源1"].value
      );
      let points = [];
      if (isEmptyTree != "") {
        points = this.$drag.getTreeData(this.highConfig["树形图"].value);
        if (points.length <= 0) {
          this.$message({
            message: "未绑定有效点位点位!",
            type: "warning",
            duration: 3000,
            showClose: true
          });
          return;
        }
      } else {
        var reg = seriess.find(item => {
          return item.pointId.length > 0;
        });
        for (let i = 0; i < seriess.length; i++) {
          if (reg == undefined) {
            this.$message({
              message: "未绑定有效点位!",
              type: "warning",
              duration: 3000,
              showClose: true
            });
            return;
          } else {
            if (seriess[i].pointId.length > 0) {
              if (seriess[i].devValue == null || seriess[i].devValue == "") {
                this.$message({
                  message: "数据类型为必选项!",
                  type: "warning",
                  duration: 3000,
                  showClose: true
                });
                return;
              } else {
                let obj = {
                  pointId: seriess[i].pointId[seriess[i].pointId.length - 1],
                  statisticsType: seriess[i].devValue
                };
                points.push(obj);
              }
            }
          }
        }
      }
      let obj = {
        beginTime: params.beginTime,
        endTime: params.endTime,
        exceptionDisposal: 0,
        intervalUnit: params.intervalUnit,
        intervalValue: params.intervalValue,
        points: points
      };
      showEchartLoading(this.charts);

      chartBulkGet(obj)
        .then(res => {
          let data = res.data.datas;
          let seriessData = [];
          if (isEmptyTree != "") {
            let getTreeDataName = this.$drag.getTreeDataName(
              this.highConfig["树形图"].value
            );
            for (let i = 0; i < getTreeDataName.length; i++) {
              let objs = {
                itemStyle: {
                  normal: {
                    color:
                      seriess[i]?.itemStyle?.normal?.color ||
                      colorList[this.theme].data[seriess.length + 1]
                  }
                },
                type: "bar",
                name: getTreeDataName[i],
                data: data[i]?.values || []
              };
              seriessData.push(objs);
            }
          } else {
            for (let i = 0; i < seriess.length; i++) {
              let objs = {
                itemStyle: seriess[i].itemStyle,
                type: seriess[i].type,
                name: seriess[i].name
              };
              for (let j = 0; j < data.length; j++) {
                if (seriess[i].pointId.length > 0) {
                  objs.data = data[j].values;
                } else {
                  objs.data = [];
                }
              }
              if (seriess[i].type == "line") {
                objs.yAxisIndex = 1;
              }
              seriessData.push(objs);
            }
          }

          this.setCharts(seriessData, res.data.times);
        })
        .catch(err => {
          console.log(err);
          this.$message.error(err.message);
          closeEchartLoading(this.charts);
        });
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
    height: calc(100% - 68px);
    width: calc(100%);
  }
  .search-container {
    height: 50px;
    width: 100%;
  }
}
</style>
