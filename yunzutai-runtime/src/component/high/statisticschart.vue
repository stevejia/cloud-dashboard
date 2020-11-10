<template>
  <div class="symbolComp" :style="boxStyles">
    <div class="header">
      <div class="left">
        <div
          class="icon"
          :style="{ backgroundImage: 'url(' + totalData.icon + ')' }"
        ></div>
        <div class="header_content">
          <span class="label" :style="energyStyle">{{ totalData.label }}:</span>
          <span class="value" :style="energyNumberStyle">{{
            totalData.value
          }}</span>
          <span class="unit" :style="energyStyle">{{ totalData.unit }}</span>
        </div>
      </div>
      <div class="right">
        <div class="item">
          <div
            class="sub-item"
            v-for="(items, indexs) in subData[0].consumption"
            :key="indexs"
          >
            <span
              class="icon"
              :class="'icon' + indexs"
              :style="{ backgroundImage: 'url(' + items.icon + ')' }"
            ></span
            ><span class="label" :style="styleDes">{{ items.label }}:</span
            ><span class="value" :style="styleData">{{ items.value }}</span
            ><span class="unit" :style="styleDes">{{ items.unit }}</span>
          </div>
        </div>
        <div class="item">
          <div
            class="sub-item"
            v-for="(items, indexs) in subData[0].transform"
            :key="indexs"
          >
            <span
              class="icon"
              :class="'icon' + indexs"
              :style="{ backgroundImage: 'url(' + items.icon + ')' }"
            ></span
            ><span class="label" :style="styleDes">{{ items.label }}:</span
            ><span class="value" :style="styleData">{{ items.value }}</span
            ><span class="unit" :style="styleDes">{{ items.unit }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="footer">
      <div class="search-container">
        <DateSearch
          :config="baisicConfig"
          ref="dateSearch"
          :showtimeType="true"
          :timeTypeOptions="timeTypeOptions"
          :timeType="timeType"
          :theme="$store.getters.theme"
          @search="doSearch"
        ></DateSearch>
      </div>
      <div class="echartsDiv" ref="chart"></div>
      <div class="bottom">
        <button
          type="button"
          class="el-button el-button--text"
          :style="energyStyle"
          v-for="item in switchButtons"
          :key="item"
        >
          <span>{{ item }}</span>
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import echarts from "echarts";
import colorList from "../../components/differentClassJson/common/chartColor.json";
import DateSearch from "../common/dateSearch.vue";
import translateConfig from "./swichConfig/statisticschart";
import mixin from "@/component/mixin.js";
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
      energyStyle: {},
      energyNumberStyle: {},
      charts: "",
      subData: [
        {
          consumption: [
            {
              icon: "./static/img/sub/analysis/avg.png",
              label: "平均值",
              value: "1258.77",
              unit: "kwh"
            },
            {
              icon: "./static/img/sub/analysis/max.png",
              label: "最大值",
              value: "1800.69",
              unit: "kwh"
            },
            {
              icon: "./static/img/sub/analysis/min.png",
              label: "最小值",
              value: "200.89",
              unit: "kwh"
            }
          ],
          transform: []
        }
      ],
      transforms: [
        {
          icon: "./static/img/sub/analysis/co2.png",
          label: "转二氧化碳",
          value: "1258.77",
          unit: "T"
        },
        {
          icon: "./static/img/sub/analysis/coal.png",
          label: "转标煤",
          value: "1808.77",
          unit: "T"
        },
        {
          icon: "./static/img/sub/analysis/rmb.png",
          label: "转人民币",
          value: "200.77",
          unit: "元"
        },
        {
          icon: "./static/img/sub/analysis/tree.png",
          label: "转树",
          unit: "棵",
          value: "200.77"
        }
      ],
      switchButtons: [
        "总能耗",
        "单位面积能耗",
        "转换为标准煤",
        "碳排放量",
        "转换为人民币"
      ],
      totalData: {
        icon: "./static/img/sub/analysis/total.png",
        label: "总能耗",
        unit: "kwh",
        value: "2242.77"
      },
      styleData: {}, //数据字体
      styleDes: {}, //描述字体
      timeTypeOptions: [
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
      timeType: null,
      series: {
        name: "默认名称",
        type: "bar",
        smooth: false,
        data: [1020, 1232, 1101, 1134, 1190, 2130, 2010]
      },
      white: {
        标题字体2: "#000000",
        查询条件字体2: "#41464d",
        背景颜色: "#fff",
        按钮颜色: "#3573C1",
        图表内容字体2: "#000000",
        数据字体2: "#3573C1",
        描述字体2: "#333333",
        energyColor: "#000000",
        energyColorNumber: "#428bca",
        数据颜色: "#3573c1"
      },
      black: {
        标题字体2: "#ffffff",
        查询条件字体2: "#b2ddff",
        背景颜色: "",
        按钮颜色: "rgb(53, 115, 193)",
        图表内容字体2: "#89a7c2",
        数据字体2: "#ffffff",
        描述字体2: "#b2ddff",
        energyColor: "#b2ddff",
        energyColorNumber: "#ffffff",
        数据颜色: "#3573c1"
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
        线条0: {
          type: "line"
        },
        显示位置: {
          type: "select",
          label: [
            {
              label: "图表在下",
              value: 0
            },
            {
              label: "图表在上",
              value: 1
            }
          ],
          value: 0
        },
        线条1: {
          type: "line"
        },
        标题: {
          type: "input",
          value: "能耗统计图"
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
              { title: "单位(柱状)", value: "kwh" }
            ]
          ]
        },
        "总面积(km²)": {
          type: "input",
          value: "0"
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
        数据字体: {
          type: "fontThree",
          value: ["16px", "", "#ffffff"]
        },
        描述字体: {
          type: "fontThree",
          value: ["14px", "", "#B2DDFF"]
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
        能量转换类型: {
          type: "energy",
          value: ["转二氧化碳", "转标煤", "转人民币"],
          label: ["转二氧化碳", "转标煤", "转人民币", "转树"]
        },
        日期类型: {
          type: "dateType",
          time: [new Date(), new Date()],
          values: [true, true, false, true, false, false],
          label: ["小时", "日", "周", "月", "季度", "年"],
          value: "h"
        }
      },
      highConfig: {
        添加响应: {
          type: "explain"
        },
        数据名: {
          type: "input",
          value: "默认名称"
        },
        数据源: {
          type: "dataTree",
          value: ""
        },
        数据类型: {
          type: "select",
          label: [
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
          value: 1
        },
        数据颜色: {
          type: "color-select",
          value: "rgba(53,115,193,1)"
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
    "$store.getters.theme": function() {
      let theme = this[this.theme];
      this.highConfig["数据颜色"].value = theme["数据颜色"];
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
      let theme = this.theme;
      if (!this.charts) {
        this.charts = echarts.init(this.$refs.chart);
      }
      // 位置选择
      this.boxStyles = {
        background: this.baisicConfig["背景颜色"].value,
        flexDirection:
          this.baisicConfig["显示位置"].value == 0
            ? "column"
            : "column-reverse",
        opacity: this.baisicConfig["显示度"].value / 100
      };
      // 数据字体
      this.styleData = {
        fontSize: this.baisicConfig["数据字体"].value[0],
        fontFamily: this.baisicConfig["数据字体"].value[1],
        color: this.baisicConfig["数据字体"].value[2]
      };
      // 描述字体
      this.styleDes = {
        fontSize: this.baisicConfig["描述字体"].value[0],
        fontFamily: this.baisicConfig["描述字体"].value[1],
        color: this.baisicConfig["描述字体"].value[2]
      };
      // 能量转换
      let transform = this.transforms;
      let energys = this.baisicConfig["能量转换类型"].value;
      let transforms = [];
      for (let i = 0; i < energys.length; i++) {
        for (let j = 0; j < transform.length; j++) {
          if (energys[i] == transform[j].label) {
            transforms.push(transform[j]);
          }
        }
      }
      this.subData[0].transform = transforms;
      // 能量主题
      this.energyStyle = {
        color: this[theme].energyColor
      };
      this.energyNumberStyle = {
        color: this[theme].energyColorNumber
      };
      // 图表
      let font = this.baisicConfig["标题字体"].value;
      let font2 = this.baisicConfig["图表内容字体"].value;
      let baryAxis = this.baisicConfig["坐标设置"].options;
      console.log(baryAxis);
      this[this.theme]["数据颜色"] = this.highConfig["数据颜色"].value;
      this.series.name = this.highConfig["数据名"].value;
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
          right: 20,
          feature: {
            magicType: {
              show: true,
              type: ["line", "bar"]
            }
          }
        },
        tooltip: {
          trigger: "axis"
        },
        legend: {
          data: [this.series.name],
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
          boundaryGap: true,
          data: [
            "2019-8-28",
            "2019-8-29",
            "2019-8-30",
            "2019-8-31",
            "2019-9-1",
            "2019-9-2",
            "2019-9-3"
          ],
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
          }
        },
        yAxis: {
          type: "value",
          name: `单位:(${baryAxis[0][2].value})`,
          min: 0,
          max: 3000,
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
        series: {
          name: this.series.name,
          type: this.series.type,
          smooth: false,
          data: this.series.data,
          itemStyle: {
            normal: {
              color: this.highConfig["数据颜色"].value
            }
          }
        }
      };
      if (this.baisicConfig["坐标设置"].value == 0) {
        option.yAxis.min = baryAxis[0][0].value || 0;
        option.yAxis.max = baryAxis[0][1].value || 250;
      } else {
        delete option.yAxis["min"];
        delete option.yAxis["max"];
      }
      this.charts.setOption(option, true);
    },

    doSearch(params) {
      console.log(params);
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
  display: flex;
  flex-direction: column;
  .header {
    height: 38%;
    width: 100%;
    display: flex;
    .left {
      height: 100%;
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      .icon {
        height: 100px;
        width: 100px;
        border-radius: 50%;
        margin: 0 auto;
        background-repeat: no-repeat;
        background-position: 50%;
        background-size: 60%;
        background-color: #34a8c2;
      }
      .header_content {
        margin-top: 15px;
        text-align: center;
        line-height: 40px;
        height: 40px;
        font-size: 16px;
        color: #b2ddff;
      }
    }
    .right {
      flex: 3;
      display: flex;
      flex-wrap: nowrap;
      padding-left: 20px;
      color: #b2ddff;
      .item {
        flex: 1;
        height: 100%;
        padding-top: 20px;
        min-width: 250px;
        box-sizing: border-box;
        .sub-item {
          height: 30%;
          display: flex;
          align-items: center;
          .icon {
            background-color: #e53f3f;
            display: inline-block;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background-repeat: no-repeat;
            background-position: 50%;
            background-size: 60%;
            vertical-align: middle;
            margin-right: 10px;
          }
          .icon1 {
            background-color: #33a566;
          }
          .icon2 {
            background-color: #ef9219;
          }
          .label {
            display: inline-block;
            max-width: 94px;
          }
        }
      }
    }
    .value {
      font-size: 18px;
      margin: 0 10px;
      color: #fff;
      font-weight: 700;
    }
  }
  .footer {
    flex: 1;
    width: 100%;
    .bottom {
      height: 30px;
      display: flex;
      align-items: center;
      box-sizing: border-box;
      .el-button {
        color: #b2ddff;
        margin-left: 10px;
        text-decoration: underline;
      }
    }
  }
  .echartsDiv {
    height: calc(100% - 78px);
    width: calc(100%);
  }
  .search-container {
    height: 50px;
    width: 100%;
  }
}
</style>
