<template>
  <div class="symbolComp" :style="boxStyles">
    <div class="search-container">
      <DateSearch
        :config="baisicConfig"
        ref="dateSearch"
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
import translateConfig from "./config/historylinechart";
import mixin from "@/component/mixin.js";
import { getHistorylinechart } from "@/api/sub.js";
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
      barSeries: [],
      lineSeries: [],
      white: {
        标题字体2: "#000000",
        查询条件字体2: "#41464d",
        背景颜色: "#fff",
        按钮颜色: "#3573C1",
        图表内容字体2: "#000000",
        折线颜色: "#3573c1"
      },
      black: {
        标题字体2: "#ffffff",
        查询条件字体2: "#b2ddff",
        背景颜色: "",
        按钮颜色: "rgb(53, 115, 193)",
        图表内容字体2: "#89a7c2",
        折线颜色: "#3573c1"
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
          value: "历史单点曲线图"
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
          value: ["12px", "Microsoft Yahei", "#B2DDFF"]
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
        数据名: {
          type: "input",
          value: "默认名称1"
        },
        数据源: {
          type: "dataTree",
          value: ""
        },
        折线颜色: {
          type: "color-select",
          value: "#3573C1"
        }
      }
    };
  },

  watch: {
    "$store.getters.theme": function() {
      let theme = this[this.theme];
      this.highConfig["折线颜色"].value = theme["折线颜色"];
    }
  },
  mounted() {
    this.theme = this.$store.getters.theme;
  },
  methods: {
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
      this.drawPie();
      this.$refs.dateSearch.update(this.baisicConfig);
      this.endInitStyle(bool);
    },
    // 绘制echarts
    drawPie() {
      if (!this.charts) {
        this.charts = echarts.init(this.$refs.chart);
      }
      this.boxStyles = {
        background: this.baisicConfig["背景颜色"].value,
        opacity: this.baisicConfig["显示度"].value / 100
      };
      this[this.theme]["折线颜色"] = this.highConfig["折线颜色"].value;
      let seriesData = [
        ["2019-08-28", "1120"],
        ["2019-08-29", 1232],
        ["2019-08-30", 1001],
        ["2019-08-31", 734],
        ["2019-09-01", 900],
        ["2019-09-02", 1030],
        ["2019-09-0", 910]
      ];
      // [1120, 1232, 1001, 734, 900, 1030, 910];
      this.setCharts(seriesData);
    },
    setCharts(seriesData) {
      console.log(seriesData);

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
        tooltip: {
          trigger: "axis",
          formatter: function(params) {
            let seriesName = params[0].seriesName;
            let name = params[0].axisValueLabel;
            let data = params[0].data;
            return `<span style="margin-left: 8px; float: right;">${name} <br/>${seriesName} : ${data[1]}</span>`;
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
          type: "time",
          boundaryGap: true,
          axisLabel: {
            fontSize: font2[0].substring(0, font[0].length - 2),
            fontFamily: font2[1],
            color: font2[2],
            formatter: function(params) {
              let title = moment(params).format("YYYY-MM-DD");
              let nerTitle = title.substr(-5) + "\n" + title.substring(0, 4);
              return nerTitle;
            },
            interval: 0
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
        yAxis: {
          type: "value",
          name: `单位:(${baryAxis[0][2].value})`,
          min: 0,
          max: 3000,
          boundaryGap: [0, "100%"],
          // interval: 50,//分段
          nameTextStyle: {
            fontSize: font2[0].substring(0, font[0].length - 2),
            fontFamily: font2[1],
            color: font2[2]
          },
          axisLabel: {
            fontSize: font2[0].substring(0, font[0].length - 2),
            fontFamily: font2[1],
            color: font2[2]
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
        series: [
          {
            name: this.highConfig["数据名"].value,
            type: "line",
            smooth: false,
            data: seriesData,
            itemStyle: {
              normal: {
                color: this.highConfig["折线颜色"].value
              }
            }
          }
        ]
      };
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

    doSearch(params) {
      if (!this.$store.state.runtime) return;
      let pointId = this.highConfig["数据源"].value;
      if (pointId.length <= 0) {
        this.$message({
          message: "未绑定数据!",
          type: "warning",
          duration: 3000,
          showClose: true
        });
        return;
      }
      let obj = {
        beginTime: params.beginTime,
        endTime: params.endTime,
        pointId: pointId[pointId.length - 1]
      };
      showEchartLoading(this.charts);
      getHistorylinechart(obj)
        .then(res => {
          let list = res.data.items;
          let xData = "",
            seriesData = "",
            totalData = [];
          for (let i = 0; i < list.length; i++) {
            seriesData = list[i].value;
            xData = list[i].time;
            totalData.push([xData, seriesData]);
          }
          this.setCharts(totalData);
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
