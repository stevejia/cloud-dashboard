<template>
  <!-- 组件内容不细说，该有的都有，该有的样式变化要有变化 -->
  <div class="symbolComp" :style="tableConfig.style" :class="theme">
    <div class="search-container">
      <DateSearch
        :config="baisicConfig"
        ref="dateSearch"
        :theme="$store.getters.theme"
        @search="doSearch"
      ></DateSearch>
    </div>
    <TableComp ref="tables" :tableConfig="tableConfig"></TableComp>
  </div>
</template>
<script>
import TableComp from "@/components/table/table.vue";
import DateSearch from "../common/dateSearch.vue";
import { getTables } from "@/api/api.js";
import mixin from "@/component/mixin.js";
import translateConfig from "./config/subTable";
export default {
  components: {
    TableComp,
    DateSearch
  },
  mixins: [mixin],
  methods: {
    doSearch() {},
    requestData() {
      this.$refs.tables.requestData();
    },
    init() {
      this.$refs.tables.tableData = this.tableConfig.defaultData;
      this.total = this.tableConfig.defaultData.length;
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

      this.tableConfig.usePage = baisicConfig["是否启用分页器"].value;
      this.tableConfig.height = baisicConfig["尺寸"].value[1] - 170 + "px";
      this.$refs.dateSearch.update(this.baisicConfig);
      this.endInitStyle(bool);
      console.log(this.tableConfig);
    },
    resetComp() {
      this.tableConfig.height = this.baisicConfig["尺寸"].value[1] - 170 + "px";
    },
    // 和南京同步转换
    translateConfig(item) {
      return translateConfig(item);
    }
  },
  data() {
    return {
      tableConfig: {
        request: getTables,
        height: "0px",
        title: "表格",
        style: {}, //背景样式
        titleStyle: {}, //标题样式
        headStyle: {}, //头部样式
        bodyStyle: {}, //单元格样式
        export: true, //是否启用导出
        usePage: true, //是否使用分页
        // handRequest: true,
        //pageConfig:"total, sizes, prev, pager, next, jumper",//可不写
        defaultData: [
          {
            date: "2016-05-03",
            name: "王小虎",
            address: "上海市普陀区金沙江路 1518 弄"
          },
          {
            date: "2016-05-02",
            name: "王小虎",
            address: "上海市普陀区金沙江路 1518 弄"
          },
          {
            date: "2016-05-04",
            name: "王小虎",
            address: "上海市普陀区金沙江路 1518 弄"
          },
          {
            date: "2016-05-01",
            name: "王小虎",
            address: "上海市普陀区金沙江路 1518 弄"
          },
          {
            date: "2016-05-08",
            name: "王小虎",
            address: "上海市普陀区金沙江路 1518 弄"
          },
          {
            date: "2016-05-06",
            name: "王小虎",
            address: "上海市普陀区金沙江路 1518 弄"
          },
          {
            date: "2016-05-07",
            name: "王小虎",
            address: "上海市普陀区金沙江路 1518 弄"
          }
        ],
        columns: [
          {
            fixed: true,
            // sortable: true,
            label: "日期",
            width: 150,
            prop: "date"
          },
          {
            label: "姓名",
            width: 120,
            prop: "name"
          },
          {
            label: "地址",
            prop: "address"
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
          value: "表格"
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
        是否启用分页器: {
          type: "checkbox",
          value: true
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
        添加响应: {
          type: "explain"
        },
        数据名: {
          type: "input",
          value: ""
        },
        数据源: {
          type: "dataTree",
          value: []
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
