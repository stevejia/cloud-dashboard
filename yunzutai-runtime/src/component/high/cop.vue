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
    <div :class="['consumpt', $store.getters.theme]">
      <span>耗能数据:</span>
      <label v-for="(item, index) in dissEnergies" :key="index">
        <input
          type="checkbox"
          v-model="selectedDissEnergies"
          :value="item.name"
          @change="checkboxChange"
        />
        {{ item.name }}
      </label>
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
import { getCOPData } from "@/api/bulk.js";
import DateSearch from "../common/dateSearch.vue";
import EchartsCommon from "../common/echartsCommon.vue";
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
        按钮颜色: "#3573c1"
      },
      black: {
        查询条件字体: "#B2DDFF",
        标题字体: "#FFFFFF",
        内容字体: "#B2DDFF",
        背景颜色: "#2B2E37",
        按钮颜色: "#3573c1"
      },
      widthHeight: [720, 300],
      position: [0, 0],
      title: "能效COP",
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
        ],
        [
          {
            title: "最小值",
            value: 0
          },
          {
            title: "最大值",
            value: 100
          },
          {
            title: "COP",
            value: "COP"
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
      dateTypes: [[true, true, false, true, false, false], "h", "", ""],
      dissEnergies: [],
      selectedDissEnergies: [],
      dissEnergiesIndex: 2,
      baisicConfig: null,
      //以上是基础属性配置

      //以下是高级属性配置
      h_chartConfig: [
        {
          type: "line",
          label: "COP",
          name: "COP",
          color: "#E53F3F",
          index: 2,
          key: "COP",
          cantAdd: true
        },
        {
          type: "bar",
          label: "供能数据",
          name: "供能数据",
          color: "#3573c1",
          key: "供能数据",
          index: 0,
          noDateType: true,
          noOperate: true,
          devValue: 2
        },
        {
          type: "bar",
          label: "耗能数据",
          name: "耗能数据1",
          color: "#33A566",
          key: "耗能数据",
          index: 0,
          stack: "耗能数据",
          limtLength: 3,
          noDateType: true,
          devValue: 1
        },
        {
          type: "line",
          label: "折线数据",
          name: "折线数据1",
          color: "#F1921C",
          key: "折线图",
          index: 1,
          limtLength: 2
        }
      ],

      h_refTree: "",
      highConfig: null,

      //以下是echarts的配置
      chartData: {
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
      // dtsource: []
    };
  },
  created() {
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
    translateConfig(item) {
      //处理尺寸
      this.$data.widthHeight = [item.gWidth, item.gHeight];
      //处理位置
      this.$data.position = [item.gLeft, item.gTop];
      //图表标题
      this.$data.title = item.option.title.text;

      //坐标位置
      this.$data.coordinate[0] = item.coordinate === "fixed" ? 0 : 1;
      this.$data.coordinate.forEach((co, index) => {
        if (index !== 0) {
          co[0].value = item.option.yAxis[index - 1].min;
          co[1].value = item.option.yAxis[index - 1].max;
          let name = item.option.yAxis[index - 1].name;
          name = name
            .replace(/单位:/g, "")
            .replace(/\(/g, "")
            .replace(/\)/g, "");
          co[2].value = name;
        }
      });
      this.$data.searchFont = [
        `${item.timeFontSize}px`,
        item.timeFamily,
        item.timeColor
      ];
      let titleFont = item.option.title.textStyle;
      this.$data.titleFont = [
        `${titleFont.fontSize}px`,
        titleFont.fontFamily,
        titleFont.color
      ];
      let contentFont = item.option.legend.textStyle;
      this.$data.contentFont = [
        `${contentFont.fontSize}px`,
        contentFont.fontFamily,
        contentFont.color
      ];

      this.$data.background = item.backgroundColor;
      this.$data.btnColor = item.buttonColor;
      this.$data.opacity = item.opacity || 100;
      this.$data.dateTypes = [
        item.dateType,
        item.time,
        item.starttime,
        item.endtime
      ];
    },
    initStyle(bool) {
      initStyle(
        bool,
        this,
        styles => {
          this.styles = styles;
        },
        themeMappingKeys
      );
      let index = this.dissEnergiesIndex;
      let dissEnergies = this.highConfig[`数据源${index}`].value;
      let originDE = [...this.dissEnergies];
      this.dissEnergies = dissEnergies.map(de => {
        // this.selectedDissEnergies.push(de.name);
        let exist =
          originDE.filter(ode => {
            return ode.name === de.name;
          }).length > 0;
        if (!exist) {
          this.selectedDissEnergies.push(de.name);
        }
        return {
          name: de.name
        };
      });
      let selected = {};
      dissEnergies.forEach(de => {
        selected[de.name] = this.selectedDissEnergies.indexOf(de.name) > -1;
      });
      this.$refs.charts.update(
        this.baisicConfig,
        this.highConfig,
        this.chartData.series,
        selected
      );

      this.$refs.dateSearch.update(this.baisicConfig);
    },
    resetStyle() {
      this.white = { ...initialWhite };
      this.black = { ...initialBlack };
      this.changeTheme(this.$store.getters.theme);
    },
    checkboxChange() {
      let selected = {};
      this.dissEnergies.forEach(de => {
        selected[de.name] = this.selectedDissEnergies.indexOf(de.name) > -1;
      });
      this.$refs.charts.update(
        this.baisicConfig,
        this.highConfig,
        this.cacheSeries,
        selected
      );
    },
    changeTheme(themeName, isChange) {
      changeTheme.bind(this)(themeName, themeMappingKeys, isChange);
    },
    async doSearch(params) {
      if (!this.$store.state.runtime) return;
      let energySupplyPoint = null;
      let energyConsumptionPoints = [];
      let otherPoints = [];

      let availablePoints = [];
      for (let prop in this.highConfig) {
        if (prop.indexOf("数据源") > -1) {
          let conf = this.highConfig[prop];
          conf.value.forEach(item => {
            let { pointId, key } = item;
            if (pointId.length > 0) {
              availablePoints.push({ ...item, chartType: conf.chartType });
              if (key === "供能数据") {
                energySupplyPoint = {
                  id: pointId[pointId.length - 1],
                  pointId: pointId[pointId.length - 1],
                  statisticsType: 2
                };
              }
              if (key === "耗能数据") {
                let ecsItem = {
                  id: pointId[pointId.length - 1],
                  pointId: pointId[pointId.length - 1],
                  statisticsType: 1
                };
                energyConsumptionPoints.push(ecsItem);
              }
              if (key === "折线图") {
                let otherItem = {
                  id: pointId[pointId.length - 1],
                  pointId: pointId[pointId.length - 1],
                  statisticsType: item.devValue
                };
                otherPoints.push(otherItem);
              }
            }
            if (key === "COP") {
              availablePoints.push({ ...item, chartType: conf.chartType });
            }
          });
        }
      }

      if (!energySupplyPoint) {
        this.$message({ type: "warning", message: "功能数据点位未配置!" });
        return;
      }

      let highParams = {
        energySupplyPoint,
        energyConsumptionPoints,
        otherPoints
      };
      params = {
        ...params,
        ...highParams,
        ...{ exceptionDisposal: 0, intervalValue: 1 }
      };
      let { data } = await getCOPData(params);
      let {
        copData,
        energyConsumptionDatas,
        energySupplyData,
        otherDatas,
        times
      } = data;

      let seriess = [];
      let selected = null;
      let copConf = availablePoints.find(ap => {
        return ap.key === "COP";
      });
      let copSeries = {
        name: copConf.name,
        type: copConf.chartType,
        smooth: true,
        yAxisIndex: copConf.index,
        data: [],
        itemStyle: copConf.itemStyle
      };
      if (copData) {
        if (copConf) {
          copSeries.data = copData.values;
        }
      }
      seriess.push(copSeries);

      if (energySupplyData) {
        let supConf = availablePoints.find(ap => {
          return ap.key === "供能数据";
        });
        if (supConf) {
          let supSeries = {
            name: supConf.name,
            type: supConf.chartType,
            smooth: true,
            yAxisIndex: supConf.index,
            data: energySupplyData.values,
            itemStyle: supConf.itemStyle
          };
          seriess.push(supSeries);
        }
      }

      if (energyConsumptionDatas && energyConsumptionDatas.length > 0) {
        let ectConfs = availablePoints.filter(ap => {
          return ap.key === "耗能数据";
        });
        if (ectConfs && ectConfs.length) {
          energyConsumptionDatas.forEach((ecd, index) => {
            let ectConf = ectConfs[index];
            let ecdSeries = {
              name: ectConf.name,
              type: ectConf.chartType,
              smooth: true,
              yAxisIndex: ectConf.index,
              data: ecd.values,
              itemStyle: ectConf.itemStyle,
              stack: ectConf.stack
            };
            seriess.push(ecdSeries);
          });
        }
        let matchedConfs = availablePoints.filter(ap => {
          return ap.key === "耗能数据";
        });
        let checkboxSelected = [];
        selected = matchedConfs.map(mc => {
          let item = {};
          item[mc.name] = true;
          checkboxSelected.push(mc.name);
          return item;
        });
        this.selectedDissEnergies = checkboxSelected;
      }

      if (otherDatas && otherDatas.length > 0) {
        let otherConf = availablePoints.find(ap => {
          return ap.key === "折线图";
        });
        if (otherConf) {
          otherDatas.forEach(other => {
            let otherSeries = {
              name: otherConf.name,
              type: otherConf.chartType,
              smooth: true,
              yAxisIndex: otherConf.index,
              data: other.values,
              itemStyle: otherConf.itemStyle
            };
            seriess.push(otherSeries);
          });
        }
      }
      this.chartData.xAxis = times;

      this.$nextTick(() => {
        this.$refs.charts.update(
          this.baisicConfig,
          this.highConfig,
          seriess,
          selected
        );
      });
      this.cacheSeries = seriess;
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
  height: calc(100% - 70px);
  width: 100%;
}

.consumpt {
  color: #b2ddff;
  font-size: 14px;
}

.consumpt.white {
  color: #000000;
}
</style>
