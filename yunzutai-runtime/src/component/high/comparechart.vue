<template>
  <div class="symbolComp" :style="boxStyles">
    <div class="search-container">
      <DateSearch
        :config="baisicConfig"
        ref="dateSearch"
        :theme="$store.getters.theme"
        @search="searchData"
      ></DateSearch>
    </div>
    <div class="echartsDiv">
      <div class="echartsDiv1" ref="chart" style="margin-top:10px"></div>
      <div class="echartsDiv1" ref="chartLine"></div>
    </div>
  </div>
</template>
<script>
import echarts from "echarts";
import colorList from "../../components/differentClassJson/common/chartColor.json";
import DateSearch from "../common/dateSearchPare.vue";
import translateConfig from "./swichConfig/comparechart";
import { changeCompareThem } from "./swichConfig/common.js";
import { getComparechart } from "@/api/high.js";
import mixin from "@/component/mixin.js";
import { showEchartLoading, closeEchartLoading } from "@/util/util.js";
import moment from "moment";
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
      chartOne: "",
      barSeries: [
        {
          name: "2019",
          type: "bar",
          black: "#3573c1",
          white: "#1e88e5",
          itemStyle: {
            normal: {
              color: "#3573c1",
              barBorderRadius: [10, 10, 0, 0],
              label: {
                show: false,
                position: "top",
                textStyle: {
                  color: this.theme === "black" ? "#fff" : "#000"
                }
              }
            }
          },
          data: [110, 10, 10, 10, 0, 32, 22, 0, 2, 3, 4, 5]
        },
        {
          name: "2018",
          type: "bar",
          black: "#3573c1",
          white: "#1e88e5",
          itemStyle: {
            normal: {
              color: "#33a566",
              barBorderRadius: [10, 10, 0, 0],
              label: {
                show: false,
                position: "top",
                textStyle: {
                  color: this.theme === "black" ? "#fff" : "#000"
                }
              }
            }
          },
          data: [1, 2, 3, 4, 5, 6, 10, 10, 10, 110, 10, 10]
        }
      ],
      lineSeries: [
        {
          name: "2019",
          type: "line",
          black: "#e53f3f",
          white: "#7460ee",
          itemStyle: {
            normal: {
              color: "#e53f3f"
            }
          },
          data: [
            1,
            2,
            -3,
            4,
            5,
            -6,
            -3.2,
            7,
            8,
            9,
            0.9,
            2.1,
            3.2,
            4.3,
            -2.6,
            -2.6,
            -5.6,
            -7.5,
            5.7,
            3.5,
            7.5,
            7.8,
            5.77,
            8.6,
            9.5,
            -5.7,
            -8.5,
            -8.1,
            1.0,
            6,
            4,
            3
          ]
        },
        {
          name: "2018",
          type: "line",
          black: "#e53f3f",
          white: "#7460ee",
          itemStyle: {
            normal: {
              color: "#3445c2"
            }
          },
          data: [
            5.7,
            3.5,
            7.5,
            7.8,
            5.77,
            0,
            1.5,
            -4.5,
            -7.3,
            -4.6,
            -3.0,
            8.3,
            5.0,
            3.5,
            2.4,
            2.8,
            3.7,
            1.7,
            1.9,
            3.65,
            -4.6,
            -3.5,
            -3.8,
            5.7,
            4.7,
            7.4,
            9.4,
            6.7,
            -6.9,
            -7.9,
            4
          ]
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
              { title: "电量", value: "kWh" }
            ],
            [
              { title: "最小值", value: -30 },
              { title: "最大值", value: 30 },
              { title: "变化率", value: "%" }
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
          value: ["16px", "Microsoft Yahei", "#ffffff"]
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
        },
        线条5: {
          type: "line"
        },
        查询间隔: {
          type: "dateType",
          time: [new Date(), new Date()],
          values: [true, true, true, false, false],
          label: ["日", "周", "月", "季度", "年"],
          value: "h",
          name: "查询间隔"
        }
      },
      highConfig: {
        添加响应: {
          type: "explain"
        },
        数据源: {
          type: "composeSeriesData",
          chartType: "bar",
          limtLength: 1,
          value: [
            {
              name: "柱状名称",
              value: 100,
              pointId: [],
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
              status: 1
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
      changeCompareThem(val, this.barSeries);
      changeCompareThem(val, this.lineSeries);
    }
  },
  mounted() {
    this.theme = this.$store.getters.theme;
  },
  methods: {
    // 和南京同步转换
    translateConfig(item) {
      return translateConfig(item);
    },
    // 重绘
    resetComp(bool) {
      if (bool) {
        this.charts.resize();
        this.chartLine.resize();
      }
    },
    initStyle(bool) {
      this.startInitStyle();
      this.drawPie();
      this.$refs.dateSearch.editUnitOption(
        this.baisicConfig["查询间隔"].values
      );
      this.$refs.dateSearch.update(this.baisicConfig);
      this.endInitStyle(bool);
    },
    // 绘制echarts
    drawPie() {
      let theme = this[this.theme];
      if (!this.charts) {
        this.charts = echarts.init(this.$refs.chart);
        this.chartLine = echarts.init(this.$refs.chartLine);
      }
      theme.color = this.baisicConfig["标题字体"].value[2];
      theme.searchColor = this.baisicConfig["查询条件字体"].value[2];
      theme.echartsColor = this.baisicConfig["图表内容字体"].value[2];
      theme.background = this.baisicConfig["背景颜色"].value;
      theme.btnBackGround = this.baisicConfig["按钮颜色"].value;
      this.boxStyles = {
        background: this.baisicConfig["背景颜色"].value,
        opacity: this.baisicConfig["显示度"].value / 100
      };
      let dataxAxis = [
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
      let gainAxis = [
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
      let datas = {
        dataxAxis: dataxAxis,
        gainAxis: gainAxis,
        barSeries: this.barSeries,
        lineSeries: this.lineSeries
      };
      this.setCharts(datas);
    },
    setCharts(datas) {
      let font = this.baisicConfig["标题字体"].value;
      let font2 = this.baisicConfig["图表内容字体"].value;
      let baryAxis = this.baisicConfig["坐标设置"].options;
      let option = {
        title: {
          text: "数值对比",
          textStyle: {
            fontSize: font[0].substring(0, font[0].length - 2),
            fontFamily: font[1],
            color: font[2]
          }
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          textStyle: {
            fontSize: font2[0].substring(0, font[0].length - 2),
            fontFamily: font2[1],
            color: font2[2]
          }
        },
        grid: {
          left: "3%",
          right: "3%",
          bottom: "2%",
          containLabel: true
        },
        //x轴信息
        xAxis: {
          type: "category",
          name: "",
          boundaryGap: true,
          data: datas.dataxAxis,
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
          nameTextStyle: {
            fontSize: font2[0].substring(0, font[0].length - 2),
            fontFamily: font2[1],
            color: font2[2]
          },
          splitLine: {
            lineStyle: {
              // 使用深浅的间隔色
              color: "#999"
            }
          },
          axisPointer: {
            type: "shadow"
          }
        },
        //y轴信息
        yAxis: {
          type: "value",
          name: `电量:（${baryAxis[0][2].value}）`,
          min: 0,
          max: 250,
          // interval: 50,//分段
          nameTextStyle: {
            fontSize: font2[0].substring(0, font[0].length - 2),
            fontFamily: "微软雅黑",
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
        series: datas.barSeries
      };
      let optionLine = {
        title: {
          text: "涨幅对比",
          textStyle: {
            fontSize: font[0].substring(0, font[0].length - 2),
            fontFamily: font[1],
            color: font[2]
          }
        },
        tooltip: {
          trigger: "axis"
        },
        legend: {
          textStyle: {
            fontSize: font2[0].substring(0, font[0].length - 2),
            fontFamily: font2[1],
            color: font2[2]
          }
        },
        grid: {
          left: "3%",
          right: "3%",
          bottom: "2%",
          containLabel: true
        },
        //x轴信息
        xAxis: {
          type: "category",
          name: "",
          boundaryGap: true,
          data: datas.gainAxis,
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
          nameTextStyle: {
            fontSize: font2[0].substring(0, font[0].length - 2),
            fontFamily: font2[1],
            color: font2[2]
          },
          splitLine: {
            lineStyle: {
              // 使用深浅的间隔色
              color: "#999"
            }
          },
          axisPointer: {
            type: "shadow"
          }
        },
        //y轴信息
        yAxis: {
          type: "value",
          name: `变化率:（${baryAxis[1][2].value}）`,
          min: 0,
          max: 30,
          // interval: 50,//分段
          nameTextStyle: {
            fontSize: font2[0].substring(0, font[0].length - 2),
            fontFamily: "微软雅黑",
            color: font2[2]
          },
          axisLabel: {
            fontSize: font2[0].substring(0, font[0].length - 2),
            fontFamily: "Microsoft YaHei",
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
        series: datas.lineSeries
      };

      if (this.baisicConfig["坐标设置"].value == 0) {
        option.yAxis.min = baryAxis[0][0].value || 0;
        option.yAxis.max = baryAxis[0][1].value || 250;
        optionLine.yAxis.min = baryAxis[1][0].value || 0;
        optionLine.yAxis.max = baryAxis[1][1].value || 25;
      } else {
        delete option.yAxis["max"];
        delete option.yAxis["max"];
        delete optionLine.yAxis["min"];
        delete optionLine.yAxis["min"];
      }
      this.charts.setOption(option, true);
      this.chartLine.setOption(optionLine, true);

      closeEchartLoading(this.chartLine);
      closeEchartLoading(this.charts);
    },
    searchData(params) {
      if (!this.$store.state.runtime) return;
      if (params.intervalUnit == "" || params.intervalUnit == null) {
        this.$message({
          message: "统计间隔不能为空!",
          type: "warning",
          duration: 3000,
          showClose: true
        });
        return;
      }
      let points = {};
      let point = {};
      if (this.highConfig["树形图"].value != "") {
        let pointsIds = this.$drag.getTreeData(this.highConfig["树形图"].value);
        if (pointsIds.length <= 0) {
          this.$message({
            message: "未绑定有效点位点位!",
            type: "warning",
            duration: 3000,
            showClose: true
          });
          return;
        } else if (pointsIds.length > 1) {
          this.$message({
            message: "涨幅对比图只能绑定一个设备!",
            type: "warning",
            duration: 3000,
            showClose: true
          });
          return;
        }
        point = {
          pointId: pointsIds[0].pointId,
          statisticsType: pointsIds[0].statisticsType
        };
      } else {
        points = this.highConfig["数据源"].value[0];
        if (points.pointId.length <= 0) {
          this.$message({
            message: "未绑定有效点位!",
            type: "warning",
            duration: 3000,
            showClose: true
          });
          return;
        }
        if (points.devValue == null) {
          this.$message({
            message: "数据类型为必选项!",
            type: "warning",
            duration: 3000,
            showClose: true
          });
          return;
        }
        point = {
          pointId: points.pointId[points.pointId.length - 1],
          statisticsType: points.devValue
        };
      }
      let obj = {
        sourceTime: moment(params.sourceTime).format("YYYY-MM-DD HH:mm:ss"),
        compareTime: moment(params.compareTime).format("YYYY-MM-DD HH:mm:ss"),
        intervalUnit: params.intervalUnit,
        queryIntervalUnit: params.queryIntervalUnit,
        point: point
      };
      showEchartLoading(this.charts);
      showEchartLoading(this.chartLine);
      getComparechart(obj)
        .then(res => {
          let lineSeries = this.lineSeries;
          let barSeries = this.barSeries;
          let dataValues = res.data.dataValues.datas;
          for (let i = 0; i < barSeries.length; i++) {
            barSeries[i].name = dataValues[i].id;
            barSeries[i].data = dataValues[i].values;
          }
          for (let i = 0; i < lineSeries.length; i++) {
            lineSeries[i].name = dataValues[i].id;
            lineSeries[i].data = dataValues[i].values;
          }

          let datas = {
            dataxAxis: res.data.dataValues.times,
            gainAxis: res.data.gainValues.times,
            barSeries: barSeries,
            lineSeries: lineSeries
          };
          this.setCharts(datas);
        })
        .catch(err => {
          this.$message.error(err.message);
          closeEchartLoading(this.chartLine);
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
    .echartsDiv1 {
      height: calc(50%);
      width: calc(100%);
    }
  }
  .search-container {
    height: 50px;
    width: 100%;
  }
}
</style>
