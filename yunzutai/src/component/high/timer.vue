<template>
  <div
    class="symbolComp"
    :style="styles"
    @contextmenu.prevent.stop="$drag.showCompContextMenu('timer', $parent)"
  >
    <TableComp ref="tables" :tableConfig="tableConfig">
      <template v-slot:oper="scope">
        <div>
          <template v-if="scope.row.state > 0">
            <span @click="toChange(scope.row, 1)" style="color:#3573c1"
              >运行<i class="icon el-icon-video-play"></i
            ></span>
          </template>
          <template v-else-if="scope.row.state < 0">
            <span style="color:#e53f3f"
              >编辑<i class="icon el-icon-edit-outline"></i
            ></span>
          </template>
          <template v-else>
            <span @click="toChange(scope.row, 0)" style="color:#F1921C"
              >停止<i class="icon el-icon-video-pause"></i
            ></span>
          </template>
        </div>
      </template>
    </TableComp>
  </div>
</template>
<script>
import { setPointsData } from "@/api/server.js";
import TableComp from "@/components/table/table.vue";
import { getTables } from "@/api/api.js";
import mixin from "@/component/mixin.js";
import translateConfig from "./swichConfig/timer.js";
export default {
  components: {
    TableComp
  },
  mixins: [mixin],
  destroyed() {
    if (this.$store.state.runtime) return;
    let compId = this.$parent.id;
    let bool = false;
    let timerList = this.$store.state.pointGroup.timerList.filter(item => {
      if (item.id !== "timer_" + compId) {
        return true;
      } else {
        bool = true;
      }
    });
    if (bool) {
      setPointsData({
        ...this.$store.state.pointGroup,
        timerList: timerList
      });
    }
  },
  methods: {
    toChange(row, state) {
      if (this.$store.state.runtime) {
        this.$drag.timerBulkCtrl(this.$parent.id, [
          {
            ctrlState: state,
            taskId: row.taskId
          }
        ]);
      }
    },
    translateConfig(data) {
      return translateConfig(data);
    },
    requestData() {
      this.$refs.tables.requestData();
    },
    init() {
      if (this.$store.state.runtime) {
        let compId = this.$parent.id;
        let target = this.$store.state.pointGroup.timerList.find(item => {
          return item.id === "timer_" + compId;
        });
        if (target) {
          this.$drag.dealTimer(this, target);
        }
      } else {
        this.requestData();
      }
    },
    resetComp() {
      this.baisicConfig["表格高度"].value = this.$parent.height - 100;
    },
    initStyle(bool) {
      let { theme, baisicConfig } = this.startInitStyle();
      this.tableConfig.style = this.styles = {
        backgroundColor: theme["背景颜色"],
        opacity: baisicConfig["显示度"].value / 100
      };
      this.tableConfig.style = {
        backgroundColor: theme["背景颜色"]
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
      this.tableConfig.height = baisicConfig["表格高度"].value + "px";
      let [width] = baisicConfig["尺寸"].value;
      baisicConfig["尺寸"].value = [
        width,
        baisicConfig["表格高度"].value + 100
      ];
      this.endInitStyle(bool);
    }
  },
  data() {
    return {
      styles: {}, //背景样式
      tableConfig: {
        request: getTables,
        height: "0px",
        title: "定时列表",
        style: {}, //背景样式
        titleStyle: {}, //标题样式
        headStyle: {}, //头部样式
        bodyStyle: {}, //单元格样式
        export: false, //是否启用导出
        usePage: true, //是否使用分页
        pageConfig: "prev, pager, next, total",
        handRequest: true,
        total: 7,
        defaultData: [
          {
            name: "定时示例1",
            date: "2020/2/17",
            cycle: "周一",
            stateDepict: "关",
            state: 0,
            runState: 0
          },
          {
            name: "定时示例2",
            date: "2020/2/19",
            cycle: "周五",
            stateDepict: "开",
            state: 1,
            runState: 0
          },
          {
            name: "定时示例3",
            date: "2020/2/17",
            cycle: "周三",
            stateDepict: "开",
            state: 1,
            runState: 0
          },
          {
            name: "定时示例4",
            date: "2019/2/16",
            cycle: "周二",
            stateDepict: "开",
            state: 1,
            runState: 0
          },
          {
            name: "定时示例5",
            date: "2019/2/10",
            cycle: "周一",
            stateDepict: "禁",
            state: -1,
            runState: 0
          },
          {
            name: "定时示例6",
            date: "2019/2/16",
            cycle: "周二",
            stateDepict: "禁",
            state: -1,
            runState: 0
          },
          {
            name: "定时事例7",
            date: "2019/2/10",
            cycle: "周一",
            stateDepict: "关",
            state: 0,
            runState: 0
          }
        ],

        columns: [
          {
            sortable: true,
            prop: "name",
            label: "名称"
          },
          {
            sortable: true,
            prop: "date",
            label: "时间"
          },
          {
            prop: "cycle",
            label: "周期"
          },
          {
            prop: "stateDepict",
            label: "状态"
          },
          {
            label: "控制",
            width: 150,
            slotName: "oper"
          }
        ]
      },
      white: {
        表格标题字体2: "rgba(0,0,0,1)",
        表格头部字体2: "#FFFFFF",
        单元格字体2: "#67757C",
        背景颜色: "#FFFFFF",
        标题背景颜色: "#3573C1",
        单元格背景颜色: "#FFFFFF",
        边框颜色: "rgba(221, 221, 221,1)"
      },
      black: {
        表格标题字体2: "#FFFFFF",
        表格头部字体2: "#FFFFFF",
        单元格字体2: "#FFFFFF",
        背景颜色: "#18191D",
        标题背景颜色: "#24252A",
        单元格背景颜色: "#18191D",
        边框颜色: "rgba(67, 74, 90,1)"
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
        线条: {
          type: "line"
        },
        表格标题: {
          type: "input",
          value: "定时列表"
        },
        表格标题字体: {
          type: "fontThree",
          value: ["14px", "", ""]
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
        是否启用分页器: {
          type: "checkbox",
          value: true
        },
        表格高度: {
          type: "slider",
          status: 1,
          range: [0, 1000],
          value: 322
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
  padding: 10px;
  .icon {
    margin-left: 8px;
  }
}
</style>
