<template>
  <div class="symbolComp">
    <div class="table-wrapper" :style="styles">
      <table class="table">
        <tbody>
          <tr
            v-for="(item, index) in highConfig.tableData"
            :key="index"
            :style="{ ...trStyle, ...item.style }"
          >
            <td
              v-for="(item2, index2) in item.trData"
              :key="index2"
              :style="{ ...tdStyle, ...item2.style }"
              :class="{
                active:
                  index == highConfig.selectIndexs[0] &&
                  index2 == highConfig.selectIndexs[1]
              }"
              @click="selectTd(index, index2)"
            >
              <template v-if="item2.dataSet.position == 'front'">
                {{ item2.value }}{{ item2.text }}
              </template>
              <template v-else> {{ item2.text }}{{ item2.value }} </template>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script>
import mixin from "@/component/mixin.js";
export default {
  components: {},
  mixins: [mixin],
  methods: {
    initStyle(bool, type) {
      let { baisicConfig } = this.startInitStyle();
      this.renderTable();
      let tableFont = this.baisicConfig["字体"].value;
      this.styles = {
        border: `${baisicConfig["外边框粗细"].value}px ${baisicConfig["边框样式"].value} ${baisicConfig["外边框颜色"].value}`,
        opacity: baisicConfig["显示度"].value / 100,
        borderRadius: baisicConfig["圆角"].value + "px",
        boxShadow: `${baisicConfig["阴影颜色"].value} 0px 0px 10px 0px inset`,
        background: baisicConfig["背景颜色"].value,
        fontSize: tableFont[0],
        fontFamily: tableFont[1],
        color: tableFont[3],
        textAlign:
          tableFont[2] === "flex-start"
            ? "left"
            : tableFont[2] === "flex-end"
            ? "right"
            : "center"
      };
      this.trStyle = {
        height: `${baisicConfig["通用行列"].value[0]}px`,
        borderBottom: `${baisicConfig["内边框粗细"].value}px ${baisicConfig["边框样式"].value} ${baisicConfig["内边框颜色"].value}`
      };
      this.tdStyle = {
        width: `${baisicConfig["通用行列"].value[1]}px`,
        borderRight: `${baisicConfig["内边框粗细"].value}px ${baisicConfig["边框样式"].value} ${baisicConfig["内边框颜色"].value}`,
        padding: `10px ${baisicConfig["单元格左右边距"].value}px`
      };
      let [r, d] = this.highConfig.selectIndexs;
      if (
        !this.highConfig.tableData[r] ||
        !this.highConfig.tableData[r].trData[d]
      ) {
        r = d = 0;
        this.selectTd(r, d);
      }
      this.highConfig.tableData[r].trData[d].text = baisicConfig["内容"].value;
      this.highConfig.tableData[r].style.background =
        baisicConfig["行背景颜色"].value;
      this.highConfig.tableData[r].trData[d].style.background =
        baisicConfig["单元格背景颜色"].value;

      if (type === "单元格行列") {
        let curRow = this.highConfig.tableData[r];
        let hw = this.baisicConfig["单元格行列"].value;
        if (curRow.style.height != hw[0]) {
          // curRow.style = curRow.style || {};
          curRow.style.height = hw[0] + "px";
        }
        if (curRow.trData[d].style.width != hw[1]) {
          for (let item of this.highConfig.tableData) {
            // item.trData[d].style = curRow.trData[d].style || {};
            item.trData[d].style.width = hw[1] + "px";
          }
        }
      }
      if (type === "单元格字体") {
        let curItem = this.highConfig.tableData[r].trData[d];
        let curRowFont = this.baisicConfig["行字体"];
        let curFont = this.baisicConfig["单元格字体"].value;
        curItem.style.fontSize =
          curFont[0] != curRowFont.value[0] ? curFont[0] : "";
        curItem.style.fontFamily =
          curFont[1] != curRowFont.value[1] ? curFont[1] : "";
        curItem.style.color =
          curFont[2] != curRowFont.value[2] ? curFont[2] : "";
      }
      if (type === "行字体") {
        let curRow = this.highConfig.tableData[r];
        let curItem = this.highConfig.tableData[r].trData[d];
        let curFont = this.baisicConfig["行字体"].value;
        curRow.style.fontSize = curFont[0] != tableFont[0] ? curFont[0] : "";
        curRow.style.fontFamily = curFont[1] != tableFont[1] ? curFont[1] : "";
        curRow.style.color = curFont[2] != tableFont[3] ? curFont[2] : "";
        this.colorChange(this.baisicConfig["单元格字体"], [
          curItem.style.fontSize || curFont[0],
          curItem.style.fontFamily || curFont[1],
          curItem.style.color || curFont[2]
        ]);
      }
      if (type === "字体") {
        let curRow = this.highConfig.tableData[r];
        let curItem = this.highConfig.tableData[r].trData[d];
        let curRowFont = this.baisicConfig["行字体"];
        this.colorChange(this.baisicConfig["行字体"], [
          curRow.style.fontSize || tableFont[0],
          curRow.style.fontFamily || tableFont[1],
          curRow.style.color || tableFont[3]
        ]);
        this.colorChange(this.baisicConfig["单元格字体"], [
          curItem.style.fontSize || curRowFont.value[0],
          curItem.style.fontFamily || curRowFont.value[1],
          curItem.style.color || curRowFont.value[2]
        ]);
      }
      this.highConfig.tableData[r].trData[d].dataSet = JSON.parse(
        JSON.stringify(this.highConfig["颜色响应"].value)
      );
      this.highConfig.tableData[r].trData[d].writeConfig = JSON.parse(
        JSON.stringify(this.highConfig["可写入"].value)
      );
      if (this.$store.state.runtime) {
        this.highConfig.selectIndexs = [];
      }
      this.selectTd(r, d);
      this.endInitStyle(bool);
    },

    // 根据行列渲染表格
    renderTable() {
      let col = this.baisicConfig["表格列数"].value || 1;
      let row = this.baisicConfig["表格行数"].value || 1;
      this.baisicConfig["表格列数"].value = col;
      this.baisicConfig["表格行数"].value = row;
      let tableData = this.highConfig.tableData;
      let td = {
        style: {},
        text: "",
        value: "",
        dataSet: {
          pointId: [],
          colorList: [
            {
              color: "",
              start: "",
              end: ""
            }
          ],
          bit: {
            check: false,
            value: [0, 15]
          },
          position: "front"
        },
        writeConfig: { writeable: false, passwordStatus: false, role: "" }
      };
      if (row != tableData.length) {
        let tr = { trData: [], style: {} };
        for (let n = 0; n < col; n++) {
          tr.trData.push(JSON.parse(JSON.stringify(td)));
        }
        if (row > tableData.length) {
          let num = row - tableData.length;
          for (let i = 0; i < num; i++) {
            tableData.push(JSON.parse(JSON.stringify(tr)));
          }
        } else {
          tableData.splice(row, tableData.length - row);
        }
      }
      if (col != tableData[0].trData.length) {
        for (let item of tableData) {
          if (col > item.trData.length) {
            let num = col - item.trData.length;
            for (let i = 0; i < num; i++) {
              item.trData.push(JSON.parse(JSON.stringify(td)));
            }
          } else {
            item.trData.splice(col, item.trData.length - col);
          }
        }
      }
    },

    // 单元格点击事件
    selectTd(index, index2) {
      if (this.$store.state.runtime) {
        this.dbClick(index, index2);
        return;
      }
      let highConfig = this.highConfig;
      let baisicConfig = this.baisicConfig;
      let tableFont = baisicConfig["字体"].value;
      // if (
      //   highConfig.selectIndexs[0] == index &&
      //   highConfig.selectIndexs[1] == index2
      // ) {
      //   return;
      // }
      highConfig.selectIndexs = [index, index2];
      highConfig["行列"].value = `第${index + 1}行, 第${index2 + 1}列`;
      let curRow = highConfig.tableData[index];
      let curItem = highConfig.tableData[index].trData[index2];
      baisicConfig["内容"].value = curItem.text || "";
      this.colorChange(
        baisicConfig["单元格背景颜色"],
        curItem.style.background
      );
      this.colorChange(baisicConfig["行背景颜色"], curRow.style.background);
      this.colorChange(baisicConfig["单元格字体"], [
        curItem.style.fontSize || curRow.style.fontSize || tableFont[0],
        curItem.style.fontFamily || curRow.style.fontFamily || tableFont[1],
        curItem.style.color || curRow.style.color || tableFont[3]
      ]);
      this.colorChange(baisicConfig["行字体"], [
        curRow.style.fontSize || tableFont[0],
        curRow.style.fontFamily || tableFont[1],
        curRow.style.color || tableFont[3]
      ]);
      this.colorChange(highConfig["颜色响应"], curItem.dataSet);
      this.colorChange(highConfig["可写入"], curItem.writeConfig);
    },

    // 主动渲染属性栏的颜色变化
    colorChange(config, value) {
      let type = config.type;
      config.type = "";
      config.value = value;
      this.$nextTick(() => {
        config.type = type;
      });
    },

    eventColor(val) {
      console.log(val);
      // return this.baisicConfig["背景颜色"].value;
    },
    eventColorChange(color) {
      console.log(color);
      // this.baisicConfig["背景颜色"].value = color;
      // this.initStyle(true);
    },

    dbClick(r, d) {
      let curItem = this.highConfig.tableData[r].trData[d];
      let config = { ...curItem.writeConfig };
      config.pointId = curItem.dataSet.pointId;
      this.$drag.colorInput(config, this);
    },

    pointIdChange(val) {
      let data = this.highConfig.tableData;
      let index = 0;
      for (let n = 0; n < data.length; n++) {
        let item = data[n].trData;
        for (let i = 0; i < item.length; i++) {
          if (
            item[i].dataSet &&
            item[i].dataSet.pointId &&
            item[i].dataSet.pointId.length
          ) {
            let value = val[index];
            // 是否启动bit位
            if (item[i].dataSet.bit.check && value.length == 16) {
              let start = item[i].dataSet.bit.value[0];
              let end = item[i].dataSet.bit.value[1];
              let bits =
                start > end
                  ? value.substring(15 - start, 16 - end)
                  : value.substring(16 - start, 15 - end);
              value = parseInt(bits, 2);
            }
            for (let m = 0; m < item[i].dataSet.colorList.length; m++) {
              let elem = item[i].dataSet.colorList[m];
              if (elem.start <= value && value <= elem.end) {
                data[n].trData[i].style.color = elem.color;
                break;
              }
            }
            item[i].value = value;
            index++;
          }
        }
      }
    },

    returnConfig() {
      let data = this.highConfig.tableData;
      let collectPointIds = [];
      for (let n = 0; n < data.length; n++) {
        let item = data[n].trData;
        for (let i = 0; i < item.length; i++) {
          if (
            item[i].dataSet &&
            item[i].dataSet.pointId &&
            item[i].dataSet.pointId.length
          ) {
            collectPointIds.push(item[i].dataSet.pointId);
          }
        }
      }
      return {
        collectPointIds,
        white: this.white,
        black: this.black,
        highConfig: this.highConfig,
        baisicConfig: this.baisicConfig
      };
    }
  },
  data() {
    return {
      white: {
        背景颜色: "rgba(0, 0, 0, 0)",
        外边框颜色: "#355999",
        内边框颜色: "#355999",
        阴影颜色: "rgba(0, 0, 0, 0)",
        字体3: "#67757C"
      },
      black: {
        背景颜色: "rgba(0, 0, 0, 0)",
        外边框颜色: "#355999",
        内边框颜色: "#355999",
        阴影颜色: "rgba(0, 0, 0, 0)",
        字体3: "#fff"
      },
      styles: {},
      colStyle: {},
      trStyle: {},
      tdStyle: {},
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
        选择的单元格属性: {
          type: "explain"
        },
        单元格行列: {
          type: "twoInput",
          label: ["行高", "列宽"],
          value: [50, 130]
        },
        线条1: {
          type: "line"
        },
        内容: {
          type: "input",
          value: ""
        },
        单元格字体: {
          type: "fontThree",
          value: ["16px", "", ""]
        },
        单元格背景颜色: {
          type: "color-select",
          value: "rgba(0, 0, 0, 0)"
        },
        选择的行属性: {
          type: "explain"
        },
        行背景颜色: {
          type: "color-select",
          value: "rgba(0, 0, 0, 0)"
        },
        行字体: {
          type: "fontThree",
          value: ["16px", "", ""]
        },
        通用属性: {
          type: "explain"
        },
        通用行列: {
          type: "twoInput",
          label: ["行高", "列宽"],
          value: [50, 130]
        },
        线条2: {
          type: "line"
        },
        表格行数: {
          type: "input",
          inputType: "number",
          value: 3
        },
        表格列数: {
          type: "input",
          inputType: "number",
          value: 3
        },
        单元格左右边距: {
          type: "input",
          inputType: "number",
          value: 10
        },
        字体: {
          type: "fontFour",
          value: ["16px", "", "center", ""]
        },
        背景颜色: {
          type: "color-select",
          value: ""
        },
        外边框颜色: {
          type: "color-select",
          value: ""
        },
        内边框颜色: {
          type: "color-select",
          value: ""
        },
        阴影颜色: {
          type: "color-select",
          value: ""
        },
        边框样式: {
          type: "select",
          label: [
            {
              label: "实线",
              value: "solid"
            },
            {
              label: "虚线",
              value: "dashed"
            }
          ],
          value: "solid"
        },
        外边框粗细: {
          type: "slider",
          status: 1,
          range: [0, 10],
          value: 1
        },
        内边框粗细: {
          type: "slider",
          status: 1,
          range: [0, 10],
          value: 1
        },
        显示度: {
          type: "slider",
          status: 1,
          range: [0, 100],
          value: 100
        },
        圆角: {
          type: "slider",
          status: 1,
          range: [0, 100],
          value: 0
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
        }
      },
      highConfig: {
        行列: {
          type: "text",
          value: "第1行，第1列"
        },
        线条: {
          type: "line"
        },
        颜色响应: {
          type: "eventColor",
          value: {
            pointId: [],
            colorList: [
              {
                color: "",
                start: "",
                end: ""
              }
            ],
            position: "front",
            bit: {
              check: false,
              value: [0, 15]
            }
          }
        },
        添加事件: {
          type: "explain"
        },
        可写入: {
          type: "writeable",
          value: {
            writeable: false,
            passwordStatus: false,
            role: ""
          }
        },
        tableData: [
          // { trData: [{ style: {} }, { style: {} }, { style: {} }], style: {} },
          // { trData: [{ style: {} }, { style: {} }, { style: {} }], style: {} },
          // { trData: [{ style: {} }, { style: {} }, { style: {} }], style: {} }
        ],
        selectIndexs: [0, 0]
      }
    };
  }
};
</script>

<style lang="less" scoped>
.symbolComp {
  display: flex;
  justify-content: center;
  align-items: center;
  width: calc(100%);
  height: calc(100%);
  box-sizing: border-box;
  white-space: pre;
  overflow: hidden;
  padding: 10px;
  .table-wrapper {
    width: min-content;
    overflow: hidden;
  }
  .table {
    height: 100%;
    width: 100%;
    table-layout: fixed;
    border-collapse: collapse;
    border: none;
    tr {
      &:last-child {
        border: none !important;
      }
      td {
        box-sizing: border-box;
        text-overflow: ellipsis;
        vertical-align: middle;
      }
      td:last-child {
        border: none !important;
      }
      td.active {
        box-shadow: inset 0 0 10px rgba(255, 255, 255, 0.3);
      }
    }
  }
}
</style>
