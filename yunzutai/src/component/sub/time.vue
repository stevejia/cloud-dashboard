<template>
  <div class="symbolComp" :style="styles">
    <span>{{ date | dateFormat("yyyy-MM-dd") }}</span>
    <span>{{ weekArr[date.getDay()] }}</span>
    <span>{{ date | dateFormat("hh:mm:ss") }}</span>
  </div>
</template>
<script>
import mixin from "@/component/mixin.js";
import translateConfig from "./config/time.js";
export default {
  mixins: [mixin],
  props: {
    theme: String
  },
  methods: {
    initStyle(bool) {
      this.startInitStyle();
      let font = this.baisicConfig["字体样式"].value;
      this.styles = {
        border: `${this.baisicConfig["边框粗细"].value}px solid ${this.baisicConfig["边框颜色"].value}`,
        opacity: this.baisicConfig["显示度"].value / 100,
        fontSize: font[0],
        fontFamily: font[1],
        color: font[2],
        background: this.baisicConfig["背景颜色"].value
      };
      this.endInitStyle(bool);
    },
    translateConfig(item) {
      return translateConfig(item);
    }
  },
  data() {
    return {
      date: new Date(),
      styles: {},
      black: {
        字体样式2: "#fff",
        边框颜色: "#fff",
        背景颜色: "rgba(0, 0, 0, 0)"
      },
      white: {
        字体样式2: "#000",
        边框颜色: "#ddd",
        背景颜色: "rgba(0, 0, 0, 0)"
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
        字体样式: {
          type: "fontThree",
          value: ["14px", "", ""]
        },
        背景颜色: {
          type: "color-select",
          value: ""
        },
        边框颜色: {
          type: "color-select",
          value: "#404753"
        },
        边框粗细: {
          type: "slider",
          status: 1,
          range: [0, 10],
          value: 0
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
        线条2: {
          type: "line"
        },
        旋转角度: {
          type: "slider",
          status: 1,
          range: [0, 360],
          value: 0
        }
      },
      weekArr: [
        "星期日",
        "星期一",
        "星期二",
        "星期三",
        "星期四",
        "星期五",
        "星期六"
      ]
    };
  },
  filters: {
    dateFormat(date, fmt) {
      let res;
      const opt = {
        "y+": date.getFullYear().toString(),
        "M+": (date.getMonth() + 1).toString(),
        "d+": date.getDate().toString(),
        "h+": date.getHours().toString(),
        "m+": date.getMinutes().toString(),
        "s+": date.getSeconds().toString()
      };
      for (let k in opt) {
        res = new RegExp("(" + k + ")").exec(fmt);
        if (res) {
          fmt = fmt.replace(
            res[1],
            res[1].length == 1 ? opt[k] : opt[k].padStart(res[1].length, "0")
          );
        }
      }
      return fmt;
    }
  }
};
</script>

<style lang="less" scoped>
.symbolComp {
  padding: 0 10px;
  width: calc(100%);
  height: calc(100%);
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  white-space: pre;
  overflow: hidden;
}
</style>
