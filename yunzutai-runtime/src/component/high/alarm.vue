<template>
  <!-- 组件内容不细说，该有的都有，该有的样式变化要有变化 -->
  <div class="symbolComp" :style="styles">
    <div class="title" :style="titleStyle">{{ title }}</div>
    <div class="search" :style="searchStyle">
      <div class="block">
        <span>关键字:</span>
        <el-input
          :disabled="!$store.state.runtime"
          v-model="keyss"
          placeholder="请输入关键字"
        ></el-input>
      </div>
      <div class="block">
        <span>时间段:</span>
        <el-date-picker
          v-model="times"
          :disabled="!$store.state.runtime"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        >
        </el-date-picker>
      </div>
      <button class="btn" :style="btnStyle">查询</button>
    </div>
    <TableComp ref="tables" :tableConfig="tableConfig">
      <template v-slot:oper="scope">
        <el-button @click="handleClick(scope)" type="primary" size="small"
          >处理报警</el-button
        >
      </template>
    </TableComp>
  </div>
</template>
<script>
import translateConfig from "./swichConfig/alarm.js";
import TableComp from "@/components/table/table.vue";
import { getTables } from "@/api/api.js";
import mixin from "@/component/mixin.js";
export default {
  components: {
    TableComp
  },
  mixins: [mixin],
  methods: {
    translateConfig(data) {
      return translateConfig(data);
    },
    requestData() {
      this.$refs.tables.requestData();
    },
    init() {
      this.requestData();
    },
    handleClick(scope) {
      console.log(scope);
    },
    resetComp() {
      this.baisicConfig["表格高度"].value = this.$parent.height - 140;
    },
    initStyle(bool) {
      let { theme, baisicConfig } = this.startInitStyle();
      this.styles = {
        backgroundColor: theme["背景颜色"],
        opacity: baisicConfig["显示度"].value / 100
      };
      this.tableConfig.style = {
        backgroundColor: theme["背景颜色"]
      };

      this.title = baisicConfig["标题"].value;
      this.searchStyle = {
        color: theme["查询条件字体2"],
        fontSize: baisicConfig["查询条件字体"].value[0],
        fontFamily: baisicConfig["查询条件字体"].value[1]
      };

      this.titleStyle = {
        color: theme["标题字体2"],
        fontSize: baisicConfig["标题字体"].value[0],
        fontFamily: baisicConfig["标题字体"].value[1]
      };
      this.btnStyle = {
        backgroundColor: theme["按钮颜色"],
        fontSize: baisicConfig["标题字体"].value[0],
        fontFamily: baisicConfig["标题字体"].value[1]
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
      this.tableConfig.height = baisicConfig["表格高度"].value + "px";
      let [width] = baisicConfig["尺寸"].value;
      baisicConfig["尺寸"].value = [
        width,
        baisicConfig["表格高度"].value + 140
      ];
      this.endInitStyle(bool);
    }
  },
  data() {
    return {
      keyss: "",
      times: [],
      title: "",
      btnStyle: {},
      titleStyle: {},
      styles: {},
      searchStyle: {},
      tableConfig: {
        request: getTables,
        height: "0px",
        style: {}, //背景样式
        titleStyle: {}, //标题样式
        headStyle: {}, //头部样式
        bodyStyle: {}, //单元格样式
        usePage: true, //是否使用分页
        pageConfig: "total, prev, pager, next", //可不写
        defaultData: [
          {
            id: "cd8c96e6407a40119aefb90fff40f4a1",
            alarmConfigId: "1",
            alarmConfigName: "报警配置1",
            addTime: "2020-06-11 12:36",
            value: "3",
            message: "提示错误",
            level: "2",
            source: "报警设备",
            isConfirm: "已处理",
            confirmTime: "2020-06-11 16:36",
            confirmIdentityName: "张三",
            handleNote: "关闭"
          },
          {
            id: "cd8c96e6407a40119aefb90fff40f4a1",
            alarmConfigId: "2",
            alarmConfigName: "报警配置2",
            addTime: "2020-06-11 12:36",
            value: "3",
            message: "提示错误",
            level: "2",
            source: "报警设备",
            isConfirm: "已处理",
            confirmTime: "2020-06-11 16:36",
            confirmIdentityName: "张三",
            handleNote: "关闭"
          },
          {
            id: "cd8c96e6407a40119aefb90fff40f4a1",
            alarmConfigId: "3",
            alarmConfigName: "报警配置3",
            addTime: "2020-06-11 12:36",
            value: "3",
            message: "提示错误",
            level: "2",
            source: "报警设备",
            isConfirm: "已处理",
            confirmTime: "2020-06-11 16:36",
            confirmIdentityName: "张三",
            handleNote: "关闭"
          },
          {
            id: "cd8c96e6407a40119aefb90fff40f4a1",
            alarmConfigId: "4",
            alarmConfigName: "报警配置4",
            addTime: "2020-06-11 12:36",
            value: "3",
            message: "提示错误",
            level: "2",
            source: "报警设备",
            isConfirm: "已处理",
            confirmTime: "2020-06-11 16:36",
            confirmIdentityName: "张三",
            handleNote: "关闭"
          },
          {
            id: "cd8c96e6407a40119aefb90fff40f4a1",
            alarmConfigId: "5",
            alarmConfigName: "报警配置5",
            addTime: "2020-06-11 12:36",
            value: "3",
            message: "提示错误",
            level: "2",
            source: "报警设备",
            isConfirm: "已处理",
            confirmTime: "2020-06-11 16:36",
            confirmIdentityName: "张三",
            handleNote: "关闭"
          }
        ],

        columns: [
          {
            fixed: true,
            label: "产生时间",
            prop: "addTime"
          },
          {
            label: "报警配置",
            prop: "alarmConfigName"
          },
          {
            label: "报警值",
            prop: "value"
          },
          {
            label: "报警提示",
            prop: "message"
          },
          {
            label: "等级",
            prop: "level"
          },
          {
            label: "是否处理",
            prop: "isConfirm"
          },
          {
            prop: "confirmTime",
            label: "处理时间"
          },
          {
            prop: "confirmIdentityName",
            label: "处理用户"
          },
          {
            prop: "handleNote",
            label: "处理意见"
          },
          {
            label: "操作",
            width: 150,
            slotName: "oper"
          }
        ]
      },
      white: {
        查询条件字体2: "#41464D",
        标题字体2: "rgba(0,0,0,1)",
        表格头部字体2: "#FFFFFF",
        单元格字体2: "#67757C",
        背景颜色: "#FFFFFF",
        标题背景颜色: "#3573C1",
        单元格背景颜色: "#FFFFFF",
        边框颜色: "rgba(221, 221, 221,1)",
        按钮颜色: "#3573C1"
      },
      black: {
        查询条件字体2: "#B2DDFF",
        标题字体2: "#FFFFFF",
        表格头部字体2: "#FFFFFF",
        单元格字体2: "#FFFFFF",
        背景颜色: "#18191D",
        标题背景颜色: "#24252A",
        单元格背景颜色: "#18191D",
        边框颜色: "rgba(67, 74, 90,1)",
        按钮颜色: "#3573C1"
      },
      highConfig: {
        点位组关联: {
          type: "select",
          label: [],
          value: ""
        }
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
        标题: {
          type: "input",
          value: "报警记录列表"
        },
        线条: {
          type: "line"
        },
        查询条件字体: {
          type: "fontThree",
          value: ["16px", "", ""]
        },
        标题字体: {
          type: "fontThree",
          value: ["16px", "", ""]
        },
        表格头部字体: {
          type: "fontThree",
          value: ["14px", "", ""]
        },
        单元格字体: {
          type: "fontThree",
          value: ["14px", "", ""]
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
        表格高度: {
          type: "slider",
          status: 1,
          range: [0, 1000],
          value: 312
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
        线条1: {
          type: "line"
        },
        旋转角度: {
          type: "slider",
          status: 1,
          range: [0, 360],
          value: 0
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
  padding: 0 15px;
  .btn {
    color: white;
    padding: 4px 15px;
    border: none;
    border-radius: 4px;
    box-sizing: border-box;
  }
  .search {
    padding: 10px 0;
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
  }
  .title {
    height: 40px;
    line-height: 40px;
  }
  .myTable {
    height: calc(100% - 92px);
  }
}
</style>
