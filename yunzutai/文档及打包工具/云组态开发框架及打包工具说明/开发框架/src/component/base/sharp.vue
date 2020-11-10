<template>
  <div class="symbolComp">
    <div class="left-arrow" :style="leftArrow"></div>
    <div class="line" :style="styles"></div>
    <div class="right-arrow" :style="rightArrow"></div>
  </div>
</template>
<script>
export default {
  props: {
    theme: String
  },
  watch: {
    "$store.getters.theme": function() {
      let theme = this[this.theme];
      this.baisicConfig["颜色"].value = theme.borderColor;
      this.initStyle(true);
    }
  },
  methods: {
    initStyle() {
      let theme = this[this.theme];
      theme.borderColor = this.baisicConfig["颜色"].value;
      let color = this.baisicConfig["颜色"].value;
      let temp =
        this.baisicConfig["样式"].value.indexOf("实线/虚线") != -1
          ? "dashed"
          : "solid";
      this.styles = {
        borderTop: `${this.baisicConfig["线条粗细"].value}px ${temp} ${color}`,
        opacity: this.baisicConfig["显示度"].value / 100
      };
      this.leftArrow = {
        display:
          this.baisicConfig["样式"].value.indexOf("左箭头") != -1
            ? "block"
            : "none",
        borderColor: `transparent ${color} transparent transparent`
      };
      this.rightArrow = {
        display:
          this.baisicConfig["样式"].value.indexOf("右箭头") != -1
            ? "block"
            : "none",
        borderColor: `transparent transparent transparent ${color}`
      };
    }
  },
  data() {
    return {
      styles: {},
      leftArrow: {},
      rightArrow: {},
      white: {
        borderColor: "#000000"
      },
      black: {
        borderColor: "white"
      },
      baisicConfig: {
        样式: {
          type: "mul-checkbox",
          label: ["左箭头", "右箭头", "实线/虚线"],
          value: []
        },
        颜色: {
          type: "color-select",
          value: "#FFFFFF"
        },
        线条粗细: {
          type: "slider",
          range: [1, 10],
          value: 1
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
          range: [0, 160],
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
  .line {
    width: calc(100%);
  }
  .left-arrow {
    border-width: 6px;
    margin-left: -6px;
    border-style: solid;
  }
  .right-arrow {
    border-width: 6px;
    margin-right: -6px;
    border-style: solid;
  }
}
</style>
