<template>
  <div class="symbolComp" :style="styles">变压器</div>
</template>
<script>
import translateConfig from "./config/freezingStation";
import mixin from "@/component/mixin.js";
export default {
  mixins: [mixin],
  methods: {
    getData() {
      if (this.$store.state.runtime) {
        let treeId = this.highConfig["树形图"].value;
        if (treeId) {
          console.log(this.$drag.getTreeData(treeId));
          //获取当前绑定的树组件数据
        }
      }
    },
    translateConfig(item) {
      return translateConfig(item);
    },
    init() {
      console.log("init");
    },
    //resetComp（bool）高度变化，字体跟着变化，可以进行样式属性重新赋值
    //bool：false----高度一直在变化，这个时候不能进行图表重绘
    //bool：true---高度最后一次变化，这个时候应该进行图表重绘
    resetComp(bool) {
      console.log(bool);
    },
    initStyle(bool) {
      let { theme, baisicConfig } = this.startInitStyle();

      //这里进行一些当前组件属性的转换与使用
      this.styles = {
        color: theme.color
      };
      console.log(baisicConfig);

      this.endInitStyle(bool);
    }
  },
  data() {
    return {
      styles: {},
      white: {
        字体样式0: "#000000"
      },
      black: {
        字体样式0: "#FFFFFF"
      },
      highConfig: {},
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
        字体样式: {
          type: "font",
          value: ["", "normal", "", ""]
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
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  white-space: pre;
  overflow: hidden;
}
</style>
