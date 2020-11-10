<template>
  <div class="symbolComp" :style="styles"></div>
</template>
<script>
export default {
  props: {
    theme: String
  },
  watch: {
    "$store.getters.theme": function() {
      let theme = this[this.theme];
      this.baisicConfig["背景颜色"].value = theme.backgroundColor;
      this.baisicConfig["边框颜色"].value = theme.borderColor;
      this.initStyle(true);
    }
  },
  methods: {
    initStyle(bool) {
      let theme = this[this.theme];
      theme.backgroundColor = this.baisicConfig["背景颜色"].value;
      theme.borderColor = this.baisicConfig["边框颜色"].value;
      let addStyles = null;
      let fash = this.highConfig["背景图样式"].imgType;
      if (fash === "居中") {
        addStyles = {
          backgroundPosition: "center center"
        };
      } else if (fash === "铺满") {
        addStyles = {
          backgroundSize: "100% 100%"
        };
      } else {
        addStyles = {
          backgroundSize: "cover"
        };
      }
      this.styles = {
        backgroundColor: this.baisicConfig["背景颜色"].value,
        backgroundImage: `url(${this.highConfig["背景图样式"].currentImage})`,
        border: `${this.baisicConfig["边框粗细"].value}px solid ${this.baisicConfig["边框颜色"].value}`,
        opacity: this.baisicConfig["显示度"].value / 100,
        borderRadius: this.baisicConfig["圆角"].value + "px",
        ...addStyles
      };

      if (!bool) {
        this.$parent.initStyle(
          this.baisicConfig["尺寸"].value,
          this.baisicConfig["位置"].value,
          this.baisicConfig["旋转角度"].value
        );
      }
    }
  },
  data() {
    return {
      text: "",
      styles: {},
      white: {
        backgroundColor: "",
        borderColor: ""
      },
      black: {
        backgroundColor: "",
        borderColor: ""
      },
      highConfig: {
        背景图样式: {
          type: "degree",
          currentImage: "",
          imgType: "铺满",
          sameStatus: false
        },
        添加事件: {
          type: "explain"
        },
        事件: {
          type: "event",
          remind: false,
          value: [
            {
              order: ""
            }
          ]
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

        背景颜色: {
          type: "color-select",
          value: ""
        },

        边框颜色: {
          type: "color-select",
          value: "#FFFFFF"
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
        圆角: {
          type: "slider",
          status: 1,
          range: [0, 100],
          value: 0
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
  background-repeat: no-repeat;
}
</style>
