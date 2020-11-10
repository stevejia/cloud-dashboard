<template>
  <div class="symbolComp" :style="boxStyles">
    <div class="echartsDiv" ref="chart"></div>
  </div>
</template>
<script>
import echarts from "echarts";
import colorList from "../../components/differentClassJson/common/chartColor.json";
import translateConfig from "./config/foldlinenochart";
import { changeEchartsTheme } from "./config/common.js";
import mixin from "@/component/mixin.js";
import { chartBulkGet } from "@/api/high.js";
import { showEchartLoading, closeEchartLoading } from "@/util/util.js";
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
      timeType: null,
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
      seriesType: {
        type: "line",
        smooth: false
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
          value: "折线图"
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
              { title: "最大值", value: 3000 },
              { title: "单位", value: "kWh" }
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
        添加响应: {
          type: "explain"
        },
        数据源: {
          type: "composeSeriesData",
          chartType: "line",
          limtLength: 16,
          value: [
            {
              name: "默认名称1",
              value: 100,
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
              smooth: false,
              type: "line",
              data: [1120, 1232, 1001, 734, 900, 1030, 910]
            }
          ],
          category: "foldlinechart"
        },
        数据关联: {
          type: "explain"
        },
        日期组件: {
          type: "dependDateSelect",
          oldValue: "",
          value: ""
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
    resetComp() {
      this.charts.resize();
    },
    initStyle(bool) {
      this.startInitStyle();
      this.drawPie();
      this.endInitStyle(bool);
    },
    // 绘制echarts
    drawPie() {
      let list = this.highConfig["数据源"].value;
      let seriesData = [];
      for (let i = 0; i < list.length; i++) {
        let obj = {
          name: list[i].name,
          type: list[i].type,
          smooth: list[i].smooth,
          data: list[i].data,
          itemStyle: list[i].itemStyle
        };
        seriesData.push(obj);
      }
      if (!this.charts) {
        this.charts = echarts.init(this.$refs.chart);
      }
      this.boxStyles = {
        background: this.baisicConfig["背景颜色"].value,
        opacity: this.baisicConfig["显示度"].value / 100
      };
      let xData = [
        "2019-8-28",
        "2019-8-29",
        "2019-8-30",
        "2019-8-31",
        "2019-9-1",
        "2019-9-2",
        "2019-9-3"
      ];
      this.setCharts(seriesData, xData);
    },
    setCharts(seriesData, xData) {
      let font = this.baisicConfig["标题字体"].value;
      let font2 = this.baisicConfig["图表内容字体"].value;
      let self = this;
      let option = {
        title: {
          text: this.baisicConfig["标题"].value,
          textStyle: {
            fontSize: font[0].substring(0, font[0].length - 2),
            fontFamily: font[1],
            color: font[2]
          }
        },
        toolbox: {
          show: true,
          feature: {
            myTool1: {
              show: true,
              title: "变为折线图",
              icon:
                "path://M1002.624 981.269333 42.730667 981.269333 42.730667 559.573333l161.984-161.962667c10.304 6.997333 22.762667 11.093333 36.16 11.093333 6.464 0 12.565333-1.237333 18.453333-3.008l255.68 255.701333c-1.770667 5.866667-2.986667 11.989333-2.986667 18.410667 0 35.648 28.885333 64.533333 64.554667 64.533333 35.626667 0 64.533333-28.885333 64.533333-64.533333 0-6.037333-1.109333-11.797333-2.666667-17.322667l379.050667-367.552c8.448-8.192 8.661333-21.76 0.448-30.208s-21.738667-8.64-30.208-0.448L613.589333 627.114667c-10.474667-7.402667-23.210667-11.818667-36.992-11.818667-13.418667 0-25.877333 4.096-36.181333 11.114667L294.336 380.330667c6.997333-10.325333 11.093333-22.762667 11.093333-36.181333 0-35.648-28.928-64.533333-64.554667-64.533333s-64.533333 28.906667-64.533333 64.533333c0 6.442667 1.237333 12.544 2.986667 18.410667l-136.597333 136.618667L42.730667 21.376C42.730667 9.578667 33.173333 0 21.376 0 9.578667 0 0 9.578667 0 21.376l0 529.322667 0 0.021333 0 451.904C0 1014.442667 9.578667 1024 21.376 1024l981.248 0C1014.464 1024 1024 1014.442667 1024 1002.624 1024 990.784 1014.464 981.269333 1002.624 981.269333z",
              onclick: function() {
                let option1 = self.charts.getOption();
                for (let i = 0; i < option1.series.length; i++) {
                  self.highConfig["数据源"].value[i].type = option1.series[
                    i
                  ].type = "line";
                  self.highConfig["数据源"].value[i].smooth = option1.series[
                    i
                  ].smooth = false;
                }
                self.charts.clear();
                self.charts.setOption(option1);
              }
            },
            myTool2: {
              show: true,
              title: "变为曲线图",
              icon:
                "path://M900.0976384 837.8744832H165.8421248V652.57472c23.2062976-54.05300053 58.20798293-103.34808747 108.49047893-131.63342507 118.93582507-72.3943424 180.9874944 113.76503467 279.2390656 139.6211712 113.76503467 31.02583467 196.50095787-51.7144576 232.6986752-144.79414613 25.85613653-72.39543467 25.85613653-279.2357888 134.44928854-284.40876373 41.3696 0 41.3696-62.05385387 0-56.8819712-118.93364053 10.34048853-144.79086933 129.27740587-165.4751232 222.3570944-10.34048853 62.05494613-20.68534613 134.44928853-67.223552 180.98858666-56.8819712 62.05385387-144.78977707 25.85613653-191.33125974-25.853952-67.223552-87.91217493-175.81561173-144.79414613-279.24015786-62.05494613-20.09879893 17.22722987-37.00053333 36.05353813-51.60741547 55.5843584v-406.43242667c0-24.27562667-19.67936853-43.95390293-43.95390293-43.95390293S77.93322667 114.79176533 77.93322667 139.06629973v742.7620864c0 24.27562667 19.67936853 43.95390293 43.95390293 43.95390294 0.3244032 0 0.6455296-0.01747627 0.96884053-0.02402987 0.3375104 0.0065536 0.67283627 0.02402987 1.0125312 0.02402987h776.22913707c25.3689856 0 45.93527467-19.67936853 45.93527467-43.95390294-0.00109227-24.2745344-20.56628907-43.95390293-45.93527467-43.95390293z",

              onclick: function() {
                let option1 = self.charts.getOption();
                for (let i = 0; i < option1.series.length; i++) {
                  self.highConfig["数据源"].value[i].type = option1.series[
                    i
                  ].type = "line";
                  self.highConfig["数据源"].value[i].smooth = option1.series[
                    i
                  ].smooth = true;
                }
                self.charts.clear();
                self.charts.setOption(option1);
              }
            },
            myTool3: {
              show: true,
              title: "变为柱形图",
              icon:
                "path://M1024 928c0 16-16 32-32 32H128v32c0 16-16 32-32 32s-32-16-32-32v-32H32c-16 0-32-16-32-32s16-32 32-32h32V32c0-16 16-32 32-32s32 16 32 32v864h192V480c0-16 16-32 32-32s32 16 32 32v416h192V192c0-16 16-32 32-32s32 16 32 32v704h192V384c0-16 16-32 32-32s32 16 32 32v512h96c16 0 32 16 32 32z",
              onclick: function() {
                let option1 = self.charts.getOption();
                for (let i = 0; i < option1.series.length; i++) {
                  self.highConfig["数据源"].value[i].type = option1.series[
                    i
                  ].type = "bar";
                }
                self.charts.clear();
                self.charts.setOption(option1);
              }
            }
          }
        },
        legend: {
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
          trigger: "axis"
        },
        //x轴信息
        xAxis: {
          type: "category",
          boundaryGap: true,
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
              color: font2[2]
            }
          },
          data: xData
        },
        yAxis: {
          name: "单位:(kwh)",
          type: "value",
          min: 0,
          max: 3000,
          // data: yAxisData,
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
              color: colorList[this.theme].line
            }
          }
        },
        series: seriesData
      };
      let baryAxis = this.baisicConfig["坐标设置"].options;
      if (this.baisicConfig["坐标设置"].value == 0) {
        option.yAxis.min = baryAxis[0][0].value || 0;
        option.yAxis.max = baryAxis[0][1].value || 3000;
      } else {
        delete option.yAxis["min"];
        delete option.yAxis["max"];
      }
      this.charts.setOption(option, true);

      closeEchartLoading(this.charts);
    },
    toSearch(params) {
      if (!this.$store.state.runtime) return;
      let points = [];
      let seriess = this.highConfig["数据源"].value;
      if (this.highConfig["树形图"].value != "") {
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
              message: "请至少选择一个点位!",
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
        intervalValue: 1,
        points: points
      };
      showEchartLoading(this.charts);
      chartBulkGet(obj)
        .then(res => {
          let data = res.data.datas;
          let seriessData = [];
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
            seriessData.push(objs);
          }
          this.setCharts(seriessData, res.data.times);
        })
        .catch(err => {
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
    height: calc(100%);
    width: calc(100%);
  }
  .search-container {
    height: 50px;
    width: 100%;
  }
}
</style>
