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
      class="echarts"
    ></EchartsCommon>
    <div class="table-container">
      <div class="table-title">详细数据</div>
      <div class="progress">
        <div :class="['progress-label', $store.getters.theme]">
          预测总能耗值:
        </div>

        <div class="progress-bar-container">
          <div class="progress-locate progress-info">
            <i class="el-icon-location"></i>
            <span :class="['pre-value', $store.getters.theme]">
              {{ totalPreData[0] }}
            </span>
            <span :class="[$store.getters.theme]">Kwh</span>
          </div>
          <el-progress
            :show-text="false"
            :stroke-width="20"
            :percentage="70"
          ></el-progress>
        </div>
        <div class="progress-total progress-info">
          <i class="el-icon-location"></i>
          <span :class="[$store.getters.theme]">历史总能耗值:</span>
          <span :class="['pre-value', $store.getters.theme]">
            {{ totalHisData[0] }}
          </span>
          <span :class="[$store.getters.theme]">Kwh</span>
        </div>
      </div>
      <el-table
        :data="dataList"
        :height="tableHeight"
        border
        style="width: 100%"
        :header-cell-style="thStyles"
        :cell-style="tdStyles"
      >
        <el-table-column prop="date" label="序号" width="70" align="center">
          <template slot-scope="scope">{{ scope.$index + 1 }}</template>
        </el-table-column>
        <el-table-column prop="date" label="日期"></el-table-column>
        <el-table-column
          prop="predictiveValue"
          label="预测值"
        ></el-table-column>
        <el-table-column prop="actualValue" label="实际值"></el-table-column>
        <el-table-column prop="diffValue" label="偏差值"></el-table-column>
        <el-table-column label="偏差百分比">
          <template slot-scope="scope">{{
            `${scope.row.diffPercent}%`
          }}</template>
        </el-table-column>
      </el-table>
    </div>
    <!-- <video class="monitor" :src="videoSrc" controls playsinline webkit-playsinline></video> -->
    <!-- <div class="mask" v-if="!$store.state.runtime"></div> -->
  </div>
</template>
<script>
import { initStyle, getBasicConfig, changeTheme } from "../common";
import DateSearch from "../common/dateSearch.vue";
import EchartsCommon from "../common/echartsCommon.vue";

const themeMappingKeys = {
  背景颜色: ["value"],
  查询条件字体: ["value", 2],
  标题字体: ["value", 2],
  内容字体: ["value", 2],
  表格标题字体: ["value", 2],
  单元格字体: ["value", 2],
  标题背景颜色: ["value"],
  单元格背景颜色: ["value"],
  数据源: ["value", [0], "itemStyle", "normal", "color"],
  数据源1: ["value", [0], "itemStyle", "normal", "color"],
  按钮颜色: ["value"]
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
      thStyles: {},
      tdStyles: {},
      white: {
        背景颜色: "#FFFFFF",
        查询条件字体: "#41464d",
        标题字体: "#455A64",
        内容字体: "#333333",
        表格标题字体: "#FFFFFF",
        单元格字体: "#67757C",
        标题背景颜色: "#3573C1",
        单元格背景颜色: "#FFFFFF",
        数据源: "#8573f0",
        数据源1: "#3a97e8",
        按钮颜色: "#3573c1"
      },
      black: {
        背景颜色: "#2b2e37",
        查询条件字体: "#B2DDFF",
        标题字体: "#FFFFFF",
        内容字体: "#B2DDFF",
        表格标题字体: "#FFFFFF",
        单元格字体: "#B2DDFF",
        标题背景颜色: "#24252A",
        单元格背景颜色: "#18191D",
        按钮颜色: "#3573c1"
      },
      widthHeight: [720, 300],
      position: [0, 0],
      title: "能耗预测图",
      coordinate: [
        0,
        [
          {
            title: "最小值",
            value: 0
          },
          {
            title: "最大值",
            value: 3000
          },
          {
            title: "单位",
            value: "Kwh"
          }
        ]
      ],
      searchFont: ["16px", "Microsoft Yahei", "#B2DDFF"],
      titleFont: ["16px", "Microsoft Yahei", "#33A566"],
      contentFont: ["12px", "Microsoft Yahei", "#B2DDFF"],
      tableHeaderFont: ["16px", "Microsoft Yahei", "#33A566"],
      tableBodyFont: ["16px", "Microsoft Yahei", "#B2DDFF"],
      background: "",
      btnColor: "#3573c1",
      headerColor: "#24252A",
      bodyColor: "#18191D",
      tableHeight: 230,
      opacity: 100,
      resetStyle_: null,

      // borderWidth: 0,
      // borderColor: "#FFFFFF",
      rotateDeg: 0,
      dateTypes: [
        [true, true, false, true, false, false],
        "h",
        null,
        null,
        true
      ],
      baisicConfig: null,
      //以上是基础属性配置

      //以下是高级属性配置
      h_chartConfig3: [
        {
          type: "line",
          label: "预测值",
          name: "能耗预测值",
          color: "#3573c1",
          index: 0,
          noDateType: true,
          key: "能耗预测值"
        },
        {
          type: "line",
          label: "实际值",
          name: "能耗实际值",
          color: "#e53f3f",
          index: 0,
          key: "能耗实际值"
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
      },
      totalPreData: [2020],
      totalHisData: [3514],
      columnList: [
        //TODO::
      ],
      dataList: [
        {
          date: "2016-05-04",
          predictiveValue: 1283,
          actualValue: 2132,
          diffValue: 849,
          diffPercent: 65.66
        },
        {
          date: "2016-05-05",
          predictiveValue: 1283,
          actualValue: 2132,
          diffValue: 849,
          diffPercent: 65.66
        },
        {
          date: "2016-05-06",
          predictiveValue: 1283,
          actualValue: 2132,
          diffValue: 849,
          diffPercent: 65.66
        },
        {
          date: "2016-05-07",
          predictiveValue: 1283,
          actualValue: 2132,
          diffValue: 849,
          diffPercent: 65.66
        },
        {
          date: "2016-05-08",
          predictiveValue: 1283,
          actualValue: 2132,
          diffValue: 849,
          diffPercent: 65.66
        },
        {
          date: "2016-05-09",
          predictiveValue: 1283,
          actualValue: 2132,
          diffValue: 849,
          diffPercent: 65.66
        },
        {
          date: "2016-05-010",
          predictiveValue: 1283,
          actualValue: 2132,
          diffValue: 849,
          diffPercent: 65.66
        }
      ]
    };
  },
  created() {
    getBasicConfig.bind(this)();
    let { black, white } = this;
    initialWhite = JSON.parse(JSON.stringify(white));
    initialBlack = JSON.parse(JSON.stringify(black));
    this.changeTheme(this.$store.getters.theme);
  },
  // mounted() {
  //   this.$refs.dateSearch.search();
  // },
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
      this.tableHeight = this.baisicConfig["表格高度"].value;
      this.$refs.charts.update(this.baisicConfig, this.highConfig);
      this.$refs.dateSearch.update(this.baisicConfig);
      this.getStyles(this.baisicConfig);
    },
    resetStyle() {
      this.white = { ...initialWhite };
      this.black = { ...initialBlack };
      this.changeTheme(this.$store.getters.theme);
    },
    getStyles(basicConfig) {
      let thConfig = basicConfig["表格标题字体"];
      if (thConfig) {
        let thFont = thConfig.value;
        if (thFont) {
          let fontSize = thFont[0];
          let fontFamily = thFont[1];
          let color = thFont[2];
          this.thStyles = {
            fontSize,
            fontFamily,
            color
          };
        }
      }

      let thBgConfig = basicConfig["标题背景颜色"];
      if (thBgConfig) {
        let thBg = thBgConfig.value;
        this.thStyles["background"] = thBg;
      }

      let tdConfig = basicConfig["单元格字体"];
      if (tdConfig) {
        let tdFont = tdConfig.value;
        if (tdFont) {
          let fontSize = tdFont[0];
          let fontFamily = tdFont[1];
          let color = tdFont[2];
          this.tdStyles = {
            fontSize,
            fontFamily,
            color
          };
        }
      }
      let tdBgConfig = basicConfig["单元格背景颜色"];
      if (tdBgConfig) {
        let tdBg = tdBgConfig.value;
        this.tdStyles["background"] = tdBg;
      }
    },
    changeTheme(themeName, isChange) {
      changeTheme.bind(this)(themeName, themeMappingKeys, isChange);

      // let theme = this[themeName];
      // this.baisicConfig["背景颜色"].value = theme.backgroundColor;
    },
    doSearch(params) {
      let isRuntime = this.$store.getters.runtime;
      if (!isRuntime) {
        return;
      }
      /**接口还未对接 */
      this.$message({ type: "error", message: "南京组件未对接接口" });
      console.log(this.highConfig);
      console.log(params);
      //TODO::这里需要对接接口
      setTimeout(() => {
        this.chartData.series.forEach(series => {
          series.data = series.data.sort(() => {
            return Math.random() > 0.5 ? -1 : 1;
          });
        });
      }, 1000);
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

.echarts {
  box-sizing: border-box;
  padding-top: 10px;
  height: 266px;
  width: 100%;
}

.table-container {
  padding: 10px;
  height: 50%;
}

.table-title {
  height: 7%;
  font-size: 16px;
  font-weight: 700;
}

.progress {
  width: 100%;
  padding: 10px 0;
  display: flex;
  align-items: center;
}
.progress-label {
  color: #b2ddff;
  margin-right: 40px;
  padding-left: 20px;
}

.progress-bar-container {
  width: 60%;
  position: relative;
}

/deep/ .el-progress {
  width: 100%;
}
.progress-locate {
  position: absolute;
  top: -28px;
  left: 70%;
  transform: translateX(-12px);
}

.progress-info {
  display: flex;
  align-items: center;
  color: #b2ddff;
}
.progress-info i {
  font-size: 25px;
  color: #3573c1;
}

.pre-value {
  color: #ef9219;
  margin-right: 6px;
}

.progress-total {
  margin-left: 50px;
}

.white {
  color: #333333;
}

.pre-value.white {
  color: #428bca;
}
</style>
