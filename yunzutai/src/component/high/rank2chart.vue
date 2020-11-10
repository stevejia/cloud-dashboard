<template>
  <div class="symbolComp" :style="boxStyles">
    <div class="search-container">
      <DateSearch
        :config="baisicConfig"
        ref="dateSearch"
        :timeType="timeType"
        :sortValue="sortValue"
        :showSort="true"
        :showtimeType="true"
        :fastOptions="fastOptions"
        :theme="$store.getters.theme"
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
import translateConfig from "./swichConfig/comRank2chart";
import mixin from "@/component/mixin.js";
import { getRankingChart } from "@/api/high.js";
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
      sortValue: 0,
      timeType: null,
      fastOptions: [
        {
          value: 0,
          label: "本日"
        },
        {
          value: 1,
          label: "本月"
        },
        {
          value: 2,
          label: "本季"
        },
        {
          value: 3,
          label: "本年"
        },
        {
          value: 4,
          label: "上日"
        },
        {
          value: 5,
          label: "上月"
        },
        {
          value: 6,
          label: "上季"
        },
        {
          value: 7,
          label: "上年"
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
          value: "能耗排行"
        },
        线条2: {
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
        }
      },
      highConfig: {
        添加响应: {
          type: "explain"
        },
        数据源: {
          type: "composeSeriesData",
          chartType: "bar",
          limtLength: 20,
          value: [
            {
              name: "默认名称0",
              pointId: [],
              itemStyle: null,
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
              type: 0,
              data: 40
            },
            {
              name: "默认名称1",
              pointId: [],
              itemStyle: null,
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
              type: 0,
              data: 30
            },
            {
              name: "默认名称2",
              pointId: [],
              itemStyle: null,
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
              type: 0,
              data: 20
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
      this.$refs.dateSearch.update(this.baisicConfig);
      this.endInitStyle(bool);
    },
    // 绘制echarts
    drawPie() {
      let list = this.highConfig["数据源"].value;
      if (!this.charts) {
        this.charts = echarts.init(this.$refs.chart);
      }
      this.boxStyles = {
        background: this.baisicConfig["背景颜色"].value,
        opacity: this.baisicConfig["显示度"].value / 100
      };
      this.setChart(list);
    },
    setChart(list) {
      let yAxisData = [];
      let xAxisData = [];
      let self = this;
      list.sort(function(a, b) {
        if (self.sortValue == 0) {
          return b.data - a.data;
        } else {
          return a.data - b.data;
        }
      });
      for (let i = 0; i < list.length; i++) {
        yAxisData[i] = list[i].name;
        xAxisData[i] = list[i].data;
      }
      let font = this.baisicConfig["标题字体"].value;
      let font2 = this.baisicConfig["图表内容字体"].value;
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
          right: "7%",
          bottom: "2%",
          containLabel: true
        },
        tooltip: {
          trigger: "axis"
        },
        //x轴信息
        xAxis: {
          name: "kwh",
          min: 0,
          nameTextStyle: {
            fontSize: font2[0].substring(0, font[0].length - 2),
            fontFamily: font2[2],
            color: font2[2]
          },
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
          }
        },
        yAxis: {
          type: "category",
          name: "名称",
          data: yAxisData,
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
        series: [
          {
            type: "bar",
            encode: {
              x: "value",
              y: "name"
            },
            itemStyle: {
              normal: {
                // color: '#f00'
                color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                  { offset: 0, color: "#456EFF" }, //柱图渐变色
                  { offset: 1, color: "#47B2FE" } //柱图渐变色
                ])
              }
            },
            data: xAxisData
          }
        ]
      };
      this.charts.setOption(option, true);
      closeEchartLoading(this.charts);
    },
    doSearch(params) {
      if (!this.$store.state.runtime) return;
      let datas = this.highConfig["数据源"].value;
      let points = [];
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
        for (let i = 0; i < datas.length; i++) {
          if (datas[i].pointId.length <= 0) {
            this.$message({
              message: "点位绑定不能为空!",
              type: "warning",
              duration: 3000,
              showClose: true
            });
            return;
          }
          if (datas[i].devValue == null) {
            this.$message({
              message: "数据类型为必选项!",
              type: "warning",
              duration: 3000,
              showClose: true
            });
            return;
          }
          let obj = {
            pointId: datas[i].pointId[datas[i].pointId.length - 1],
            statisticsType: datas[i].devValue
          };
          points.push(obj);
        }
      }

      let obj = {
        beginTime: params.beginTime,
        endTime: params.endTime,
        points: points
      };
      this.sortValue = params.sortValue;
      showEchartLoading(this.charts);
      getRankingChart(obj)
        .then(res => {
          let list = res.data.points;
          for (let i = 0; i < list.length; i++) {
            list[i].name = datas[i].name;
            list[i].data = list[i].value;
          }
          this.setChart(list);
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
    height: calc(100% - 68px);
    width: calc(100%);
  }
  .search-container {
    height: 50px;
    width: 100%;
  }
}
</style>
