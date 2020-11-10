<template>
  <div class="symbolComp" :style="styles">
    <div class="title" :style="titleStyle">
      {{ baisicConfig["标题"].value }}
      <span :style="btnStyle" class=" spanBtn el-icon-s-tools more"></span>
    </div>
    <div class="body" :style="contentStyle">
      <ul v-if="tableData.length">
        <li :key="index" v-for="(item, index) in tableData">
          <div class="content">
            <span class="times">{{ item.addTime }}</span>
            <span class="status">{{
              item.isConfirm ? "已确认" : "已取消"
            }}</span>
            <span class="tisi">{{ item.message }}</span>
          </div>
        </li>
      </ul>
      <div class="no-data">暂无数据</div>
    </div>
  </div>
</template>
<script>
import translateConfig from "./swichConfig/alarm2.js";
import mixin from "@/component/mixin.js";
export default {
  mixins: [mixin],
  methods: {
    init() {
      if (this.$store.state.runtime) {
        this.tableData = [];
      }
    },
    translateConfig(item) {
      return translateConfig(item);
    },
    initStyle(bool) {
      let { theme, baisicConfig } = this.startInitStyle();
      this.styles = {
        backgroundColor: theme["背景颜色"],
        opacity: baisicConfig["显示度"].value / 100
      };
      this.btnStyle = {
        color: theme["按钮颜色"]
      };

      this.titleStyle = {
        color: theme["标题字体2"],
        fontSize: baisicConfig["标题字体"].value[0],
        fontFamily: baisicConfig["标题字体"].value[1],
        borderBottom: `1px solid ${theme["标题线条颜色"]}`,
        textAlign: baisicConfig["标题位置"].value
      };
      this.contentStyle = {
        color: theme["内容字体2"],
        fontSize: baisicConfig["内容字体"].value[0],
        fontFamily: baisicConfig["内容字体"].value[1]
      };

      this.endInitStyle(bool);
    }
  },
  data() {
    return {
      tableData: [
        {
          id: "cd8c96e6407a40119aefb90fff40f4a1",
          message: "空调机组报警",
          alarmConfigName: "报警配置1",
          addTime: "2020-06-11 12:36",
          value: "1",
          isConfirm: true
        },
        {
          id: "cd8c96e6407a40119aefb90fff40f4a1",
          alarmConfigName: "报警配置2",
          addTime: "2020-06-11 11:23",
          value: "2",
          message: "智能照明报警",
          isConfirm: false
        },
        {
          id: "cd8c96e6407a40119aefb90fff40f4a1",
          alarmConfigName: "报警配置3",
          addTime: "2020-05-11 12:36",
          value: "3",
          message: "空调机组报警2",
          isConfirm: false
        },
        {
          id: "cd8c96e6407a40119aefb90fff40f4a1",
          alarmConfigName: "报警配置5",
          addTime: "2020-06-17 12:36",
          value: "4",
          message: "空调机组报警",
          isConfirm: false
        },
        {
          id: "cd8c96e6407a40119aefb90fff40f4a1",
          alarmConfigName: "报警配置1",
          addTime: "2020-06-11 12:36",
          value: "3",
          message: "空调机组报警",
          isConfirm: false
        },
        {
          id: "cd8c96e6407a40119aefb90fff40f4a1",
          alarmConfigName: "报警配置1",
          addTime: "2020-06-11 12:36",
          value: "3",
          message: "空调机组报警",
          isConfirm: false
        }
      ],
      btnStyle: {},
      styles: {},
      titleStyle: {},
      contentStyle: {},

      white: {
        标题字体2: "#333333",
        内容字体2: "#455A64",
        标题线条颜色: "#AEAEAE",
        背景颜色: "rgba(0,0,0,0)",
        按钮颜色: "#3573C1"
      },
      black: {
        标题字体2: "#FFFFFF",
        内容字体2: "#B2DDFF",
        标题线条颜色: "#404753",
        背景颜色: "rgba(0,0,0,0)",
        按钮颜色: "#7182B6"
      },
      highConfig: {
        报警页面关联: {
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
        线条1: {
          type: "line"
        },
        标题: {
          type: "input",
          value: "标题"
        },
        标题位置: {
          type: "select",
          label: [
            {
              label: "左",
              value: "left"
            },
            {
              label: "中",
              value: "center"
            }
          ],
          value: "left"
        },
        线条2: {
          type: "line"
        },
        模式选择: {
          type: "select",
          label: [
            {
              label: "日",
              value: "日"
            },
            {
              label: "周",
              value: "周"
            },
            {
              label: "月",
              value: "月"
            },
            {
              label: "季度",
              value: "季度"
            },
            {
              label: "年",
              value: "年"
            }
          ],
          value: "日"
        },
        线条3: {
          type: "line"
        },
        最大数据条数: {
          type: "input",
          value: "10"
        },
        线条4: {
          type: "line"
        },
        标题字体: {
          type: "fontThree",
          value: ["14px", "", ""]
        },
        内容字体: {
          type: "fontThree",
          value: ["14px", "", ""]
        },
        标题线条颜色: {
          type: "color-select",
          value: ""
        },
        背景颜色: {
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
        线条: {
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
  .title {
    white-space: nowrap;
    margin: 0 12px;
    padding: 12px 0 12px 0px;
    box-sizing: border-box;
    position: relative;
    .spanBtn {
      position: absolute;
      right: 0px;
      top: calc(50% - 9px);
      font-size: 18px;
    }
  }
  .body {
    height: calc(100% - 40px);
    position: relative;
    .no-data {
      color: #404753;
      height: calc(100%);
      width: calc(100%);
      display: flex;
      justify-content: center;
      align-items: center;
    }
    ul {
      overflow: auto;
      height: calc(100%);
      padding: 10px 0;
      box-sizing: border-box;
    }
    .content {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      padding: 10px;
      box-sizing: border-box;
      align-items: center;
      .times,
      .tisi {
        flex: 1;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .tisi {
        text-align: right;
      }
      .status {
        text-align: center;
        width: 70px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
}
</style>
