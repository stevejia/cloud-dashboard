<template>
  <!-- 组件内容不细说，该有的都有，该有的样式变化要有变化 -->
  <div class="symbolComp" :style="tableConfig.style" :class="theme">
    <div class="search-container">
      <DateSearch
        :config="baisicConfig"
        ref="dateSearch"
        :theme="$store.getters.theme"
        @search="requestData"
      ></DateSearch>
    </div>
    <TableComp ref="tables" :tableConfig="tableConfig"></TableComp>
  </div>
</template>
<script>
import TableComp from "@/components/table/table.vue";
import DateSearch from "../common/dateSearch.vue";
import { chartBulkGet } from "@/api/bulk.js";
import mixin from "@/component/mixin.js";
import translateConfig from "./config/statisticstable";
export default {
  components: {
    TableComp,
    DateSearch
  },
  mixins: [mixin],
  methods: {
    requestData(param) {
      let points = "";
      let message = "未绑定树形图";
      if (this.highConfig["树形图"].value) {
        points = this.$drag.getTreeDatas(this.highConfig["树形图"].value);
        if (!points.length) {
          points = "";
          message = "未选择设备或绑定点位为空！";
        }
      }
      if (!points) {
        this.$message({
          message,
          type: "warning",
          duration: 3000,
          showClose: true
        });
        return;
      }
      for (let i of points) {
        i.id = i.name;
        delete i.name;
      }
      this.$refs.tables.requestData(
        {
          beginTime: param.beginTime,
          endTime: param.endTime,
          exceptionDisposal: 0,
          intervalUnit: param.intervalUnit,
          intervalValue: 1,
          points: points
        },
        true
      );
    },
    init() {
      this.$refs.tables.tableData = this.tableConfig.defaultData;
    },
    initStyle(bool) {
      let { theme, baisicConfig } = this.startInitStyle();

      this.tableConfig.style = {
        backgroundColor: theme["背景颜色"],
        opacity: baisicConfig["显示度"].value / 100
      };

      this.tableConfig.title = baisicConfig["表格标题"].value;
      this.tableConfig.titleStyle = {
        color: theme["表格标题字体2"],
        fontSize: baisicConfig["表格标题字体"].value[0],
        fontFamily: baisicConfig["表格标题字体"].value[1]
      };
      this.tableConfig.headStyle = {
        color: theme["表格头部字体2"],
        backgroundColor: theme["标题背景颜色"],
        fontSize: baisicConfig["表格头部字体"].value[0],
        fontFamily: baisicConfig["表格头部字体"].value[1],
        borderColor: theme["边框颜色"]
      };

      this.tableConfig.bodyStyle = {
        color: theme["单元格字体2"],
        backgroundColor: theme["单元格背景颜色"],
        fontSize: baisicConfig["单元格字体"].value[0],
        fontFamily: baisicConfig["单元格字体"].value[1],
        borderColor: theme["边框颜色"]
      };

      this.tableConfig.height = baisicConfig["尺寸"].value[1] - 130 + "px";
      this.$refs.dateSearch.update(this.baisicConfig);
      this.endInitStyle(bool);
    },
    resetComp() {
      this.tableConfig.height = this.baisicConfig["尺寸"].value[1] - 130 + "px";
    },
    dataFormatter(res) {
      if (res.statusCode !== 200) {
        return {
          data: {}
        };
      }
      let column = [
        {
          label: "区域",
          fixed: true,
          prop: "area"
        }
      ];
      let resData = [];
      for (let n = 0; n < res.data.datas.length; n++) {
        let item = res.data.datas[n];
        let obj = {
          area: item.id
        };
        for (let i = 0; i < item.dbDatas.length; i++) {
          if (n === 0) {
            column.push({
              label: res.data.times[i],
              prop: item.dbDatas[i].time,
              width: 130
            });
          }
          obj[item.dbDatas[i].time] = item.dbDatas[i].value;
        }
        resData.push(obj);
      }
      this.tableConfig.columns = column;
      return {
        data: {
          items: resData,
          totalItems: resData.length
        }
      };
    },
    // 和南京同步转换
    translateConfig(item) {
      return translateConfig(item);
    }
  },
  data() {
    return {
      tableConfig: {
        request: chartBulkGet,
        height: "0px",
        title: "数据统计表格",
        style: {}, //背景样式
        titleStyle: {}, //标题样式
        headStyle: {}, //头部样式
        bodyStyle: {}, //单元格样式
        export: true, //是否启用导出
        usePage: false, //是否使用分页
        //pageConfig:"total, sizes, prev, pager, next, jumper",//可不写
        formatter: this.dataFormatter,
        defaultData: [
          {
            "0分": "0",
            "1分": "1",
            "2分": "2",
            "3分": "3",
            "4分": "4",
            "5分": "5",
            "6分": "6",
            "7分": "7",
            "8分": "8",
            "9分": "9",
            "10分": "10",
            area: "一楼"
          },
          {
            "0分": "0",
            "1分": "1",
            "2分": "2",
            "3分": "3",
            "4分": "4",
            "5分": "5",
            "6分": "6",
            "7分": "7",
            "8分": "8",
            "9分": "9",
            "10分": "10",
            area: "二楼"
          },
          {
            "0分": "0",
            "1分": "1",
            "2分": "2",
            "3分": "3",
            "4分": "4",
            "5分": "5",
            "6分": "6",
            "7分": "7",
            "8分": "8",
            "9分": "9",
            "10分": "10",
            area: "三楼"
          },
          {
            "0分": "0",
            "1分": "1",
            "2分": "2",
            "3分": "3",
            "4分": "4",
            "5分": "5",
            "6分": "6",
            "7分": "7",
            "8分": "8",
            "9分": "9",
            "10分": "10",
            area: "四楼"
          },
          {
            "0分": "0",
            "1分": "1",
            "2分": "2",
            "3分": "3",
            "4分": "4",
            "5分": "5",
            "6分": "6",
            "7分": "7",
            "8分": "8",
            "9分": "9",
            "10分": "10",
            area: "五楼"
          },
          {
            "0分": "0",
            "1分": "1",
            "2分": "2",
            "3分": "3",
            "4分": "4",
            "5分": "5",
            "6分": "6",
            "7分": "7",
            "8分": "8",
            "9分": "9",
            "10分": "10",
            area: "六楼"
          },
          {
            "0分": "0",
            "1分": "1",
            "2分": "2",
            "3分": "3",
            "4分": "4",
            "5分": "5",
            "6分": "6",
            "7分": "7",
            "8分": "8",
            "9分": "9",
            "10分": "10",
            area: "七楼"
          }
        ],
        columns: [
          {
            label: "区域",
            fixed: true,
            prop: "area"
          },
          {
            label: "0分",
            prop: "0分",
            width: 130
          },
          {
            label: "1分",
            prop: "1分",
            width: 130
          },
          {
            label: "2分",
            prop: "2分",
            width: 130
          },
          {
            label: "3分",
            prop: "3分",
            width: 130
          },
          {
            label: "4分",
            prop: "4分",
            width: 130
          },
          {
            label: "5分",
            prop: "5分",
            width: 130
          },
          {
            label: "6分",
            prop: "6分",
            width: 130
          },
          {
            label: "7分",
            prop: "7分",
            width: 130
          },
          {
            label: "8分",
            prop: "8分",
            width: 130
          },
          {
            label: "9分",
            prop: "9分",
            width: 130
          }
        ]
      },
      white: {
        查询条件字体2: "#41464D",
        表格标题字体2: "rgba(0,0,0,1)",
        表格头部字体2: "#FFFFFF",
        单元格字体2: "#67757C",
        背景颜色: "#FFFFFF",
        标题背景颜色: "#3573C1",
        单元格背景颜色: "#FFFFFF",
        边框颜色: "rgba(221, 221, 221,1)",
        按钮颜色: "#3573c1"
      },
      black: {
        查询条件字体2: "#b2ddff",
        表格标题字体2: "#FFFFFF",
        表格头部字体2: "#FFFFFF",
        单元格字体2: "#B2DDFF",
        背景颜色: "#18191D",
        标题背景颜色: "#24252A",
        单元格背景颜色: "#18191D",
        边框颜色: "rgba(67, 74, 90,1)",
        按钮颜色: "#3573c1"
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
        表格标题: {
          type: "input",
          value: "统计数据表格"
        },
        线条2: {
          type: "line"
        },
        查询条件字体: {
          type: "fontThree",
          value: ["16px", "", ""]
        },
        表格标题字体: {
          type: "fontThree",
          value: ["16px", "", ""]
        },
        表格头部字体: {
          type: "fontThree",
          value: ["16px", "", ""]
        },
        单元格字体: {
          type: "fontThree",
          value: ["16px", "", ""]
        },
        背景颜色: {
          type: "color-select",
          value: ""
        },
        标题背景颜色: {
          type: "color-select",
          value: ""
        },
        单元格背景颜色: {
          type: "color-select",
          value: ""
        },
        边框颜色: {
          type: "color-select",
          value: ""
        },
        按钮颜色: {
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
        线条3: {
          type: "line"
        },
        旋转角度: {
          type: "slider",
          status: 1,
          range: [0, 360],
          value: 0
        },
        线条4: {
          type: "line"
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
        数据关联: {
          type: "explain"
        },
        树形图: {
          type: "dependtree",
          value: ""
        }
      }
    };
  }
};
</script>

<style lang="less" scoped>
.symbolComp {
  width: calc(100%);
  height: calc(100%);
  box-sizing: border-box;
  white-space: pre;
  overflow: hidden;
  padding: 10px;
  .search-container {
    margin-bottom: 15px;
    height: 50px;
  }
}
</style>
