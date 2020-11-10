<!-- 高级组件-组合曲线图 -->
<template>
  <div class="symbolComp" :style="styles">
    <div class="search-container">
      <DateSearch
        :config="baisicConfig"
        ref="dateSearch"
        :theme="$store.getters.theme"
        @search="doSearch"
      ></DateSearch>
    </div>
    <EchartsCommon
      ref="charts"
      :config="baisicConfig"
      :xAxis="chartData.xAxis"
      :series="chartData.series"
      class="combination-echarts"
    ></EchartsCommon>

    <!-- <video class="monitor" :src="videoSrc" controls playsinline webkit-playsinline></video> -->
    <!-- <div class="mask" v-if="!$store.state.runtime"></div> -->
  </div>
</template>
<script>
import { initStyle, getBasicConfig, changeTheme } from "../common";
import DateSearch from "../common/dateSearch.vue";
import EchartsCommon from "../common/echartsCommon.vue";
import { chartBulkGet } from "@/api/bulk.js";
const themeMappingKeys = {
  背景颜色: ["value"],
  查询条件字体: ["value", 2],
  标题字体: ["value", 2],
  内容字体: ["value", 2],
  按钮颜色: ["value"]
  // 表格标题字体: ["value", 2]
  // 数据源: ["value", [0], "itemStyle", "normal", "color"],
  // 数据源1: ["value", [0], "itemStyle", "normal", "color"]
};
let initialWhite = null;
let initialBlack = null;
export default {
  components: { DateSearch, EchartsCommon },
  props: {
    theme: String
  },
  data() {
    return {
      styles: {},
      white: {
        查询条件字体: "#41464D",
        标题字体: "#455A64",
        内容字体: "#333333",
        背景颜色: "#FFFFFF",
        按钮颜色: "#3573C1"
      },
      black: {
        查询条件字体: "#B2DDFF",
        标题字体: "#FFFFFF",
        内容字体: "#B2DDFF",
        背景颜色: "",
        按钮颜色: "#3573C1"
      },
      widthHeight: [720, 300],
      position: [0, 0],
      title: "组合曲线图",
      coordinate: [
        0,
        [
          {
            title: "最小值",
            value: 0
          },
          {
            title: "最大值",
            value: 250
          },
          {
            title: "单位(柱状)",
            value: "Kwh"
          }
        ],
        [
          {
            title: "最小值",
            value: 0
          },
          {
            title: "最大值",
            value: 30
          },
          {
            title: "单位(折线)",
            value: "℃"
          }
        ]
      ],
      searchFont: ["16px", "Microsoft Yahei", "#B2DDFF"],
      titleFont: ["16px", "Microsoft Yahei", "#33A566"],
      contentFont: ["12px", "Microsoft Yahei", "#B2DDFF"],
      background: "",
      btnColor: "#3573c1",
      opacity: 100,
      resetStyle_: null,
      // borderWidth: 0,
      // borderColor: "#FFFFFF",
      rotateDeg: 0,
      dateTypes: [[true, true, false, true, false, false], "h", null, null],
      baisicConfig: null,
      //以上是基础属性配置

      //以下是高级属性配置
      h_chartConfig: [
        {
          type: "bar",
          label: "柱状图",
          name: "柱状图默认名称1",
          color: "#3573c1",
          index: 0
        },
        {
          type: "line",
          label: "折线图",
          name: "折线图默认名称1",
          color: "#e53f3f",
          index: 1
        }
      ],

      h_refTree: "",
      highConfig: null,

      //以下是echarts的配置
      chartData: {
        series: [
          {
            name: "柱状图1",
            type: "bar",
            data: [
              2.0,
              4.9,
              7.0,
              23.2,
              25.6,
              76.7,
              135.6,
              162.2,
              32.6,
              20.0,
              6.4,
              3.3
            ]
          },
          {
            name: "折线图1",
            type: "line",
            smooth: true,
            yAxisIndex: 1,
            data: [
              2.0,
              2.2,
              3.3,
              4.5,
              6.3,
              10.2,
              20.3,
              23.4,
              23.0,
              16.5,
              12.0,
              6.2
            ]
          }
        ],
        xAxis: [
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
        ]
      }
    };
  },
  created() {
    console.log(this);
    getBasicConfig.bind(this)();
    let { black, white } = this;
    initialWhite = JSON.parse(JSON.stringify(white));
    initialBlack = JSON.parse(JSON.stringify(black));
    this.changeTheme(this.$store.getters.theme);
  },
  mounted() {
    // this.$refs.dateSearch.search();
  },
  watch: {
    "$store.getters.theme"(newVal) {
      if (!newVal) {
        return;
      }
      this.changeTheme(newVal, true);
    }
  },
  methods: {
    initStyle(bool) {
      initStyle(
        bool,
        this,
        styles => {
          this.styles = styles;
        },
        themeMappingKeys
      );
      this.$refs.charts.update(this.baisicConfig, this.highConfig);
      this.$refs.dateSearch.update(this.baisicConfig);
    },
    resetStyle() {
      this.white = { ...initialWhite };
      this.black = { ...initialBlack };
      this.changeTheme(this.$store.getters.theme);
    },
    changeTheme(themeName, isChange) {
      changeTheme.bind(this)(themeName, themeMappingKeys, isChange);
    },
    async doSearch(params) {
      let isRuntime = this.$store.getters.runtime;
      if (!isRuntime) {
        return;
      }
      let treeConfig = this.highConfig["树形图"];
      let treeId = null;
      let treePoints = [];
      if (treeConfig) {
        treeId = treeConfig.value;
      }
      let points = [];
      let highConfig = { ...this.highConfig };
      for (let prop in highConfig) {
        if (prop.indexOf("数据源") > -1) {
          points.push({ ...highConfig[prop] });
        }
      }
      if (treeId) {
        treePoints = this.$drag.getTreeData(treeId);
        if (points.length > treePoints.length) {
          points = points.splice(0, treePoints.length);
        } else {
          let diffLen = treePoints.length - points.length;
          for (let i = 0; i < diffLen; i++) {
            let tempPoint = JSON.parse(JSON.stringify(points[0]));
            tempPoint.chartType = "line";
            tempPoint.value.forEach(chart => {
              chart.index = 1;
            });
            points.push(tempPoint);
            highConfig[`数据源_tree` + i] = tempPoint;
          }
        }

        points.forEach((point, index) => {
          point.value.forEach(chart => {
            let treePoint = treePoints[index];
            chart.pointId = [treePoint.pointId];
            chart.devValue = treePoint.statisticsType;
            chart.name = treePoint.name;
          });
        });
      }

      let flag = points.some(point => {
        return point.value.some(chart => {
          return !chart.devValue;
        });
      });

      if (flag) {
        this.$message({ type: "warning", message: "数据类型为必选项!" });
        return;
      }
      let searchPoints = [];
      points.forEach(po => {
        po.value.forEach(pov => {
          let pointId = pov.pointId;
          if (pointId && pointId.length > 0) {
            let pItem = {
              statisticsType: pov.devValue,
              pointId: pointId[pointId.length - 1],
              yAxisIndex: pov.index,
              name: pov.name,
              chartType: po.chartType,
              itemStyle: { ...{ itemStyle: pov.itemStyle } }
            };
            searchPoints.push(pItem);
          }
        });
      });

      params = {
        ...params,
        ...{ points: searchPoints },
        ...{ exceptionDisposal: 0, intervalValue: 1 }
      };

      let { data } = await chartBulkGet(params);

      this.chartData.xAxis = data.times;
      let seriesList = [];
      data.datas.forEach((ds, index) => {
        let conf = searchPoints[index];
        let series = {
          name: conf.name,
          type: conf.chartType,
          smooth: true,
          yAxisIndex: conf.yAxisIndex,
          data: ds.values,
          itemStyle: conf.itemStyle
        };
        seriesList.push(series);
      });
      this.$nextTick(() => {
        this.$refs.charts.update(this.baisicConfig, highConfig, seriesList);
      });
    }
  }
};
</script>

<style lang="less" scoped>
.monitor {
  width: 100%;
  height: 100%;
}

.symbolComp {
  width: calc(100%);
  height: calc(100%);
  // display: flex;
  // justify-content: center;
  // align-items: center;
  box-sizing: border-box;
  white-space: pre;
  overflow: hidden;
  padding: 10px;
}

.mask {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  cursor: not-allowed;
}

.search-container {
  height: 50px;
  width: 100%;
}

.combination-echarts {
  box-sizing: border-box;
  padding-top: 10px;
  height: calc(100% - 50px);
  width: 100%;
}
</style>
