<template>
  <div class="symbolComp" :style="styles"></div>
</template>
<script>
import translateConfig from "./rect.js";
export default {
  props: {
    theme: String
  },
  watch: {
    "$store.getters.theme": function() {
      this.themeChange();
    }
  },
  created() {
    this.theme = this.$store.getters.theme;
    this.themeChange();
  },
  methods: {
    eventColor() {
      return this.baisicConfig["背景颜色"].value;
    },
    eventColorChange(color) {
      this.baisicConfig["背景颜色"].value = color;
      this.initStyle(true);
    },
    translateConfig(item) {
      return translateConfig(item);
    },
    resetStyle(data) {
      this[this.theme] = data[this.theme];
      this.baisicConfig = {
        ...this.baisicConfig,
        背景颜色: {
          type: "color-select",
          value: ""
        },
        启用标题渐变色: {
          type: "slider-gradient",
          used: false,
          range: [0, 360],
          value: ["", 0]
        },
        边框颜色: {
          type: "color-select",
          value: "#FFFFFF"
        },
        边框粗细: {
          type: "slider",
          status: 1,
          range: [1, 10],
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
        }
      };
      this.themeChange();
    },
    themeChange() {
      let theme = this[this.theme];
      this.baisicConfig["背景颜色"].value = theme.backgroundColor;
      this.baisicConfig["边框颜色"].value = theme.borderColor;
      this.baisicConfig["启用标题渐变色"].value[0] = theme.sliderGradient;
      this.initStyle(true);
    },
    initStyle(bool) {
      let theme = this[this.theme];
      theme.backgroundColor = this.baisicConfig["背景颜色"].value;
      theme.borderColor = this.baisicConfig["边框颜色"].value;
      theme.sliderGradient = this.baisicConfig["启用标题渐变色"].value[0];
      let addStyles = null;
      let { imgUrl, fash } = this.baisicConfig["上传背景图"].value;
      if (fash === "center center") {
        addStyles = {
          backgroundPosition: "center center"
        };
      } else {
        addStyles = {
          backgroundSize: fash
        };
      }
      let backgroundImage = `url(${imgUrl})`;
      if (this.baisicConfig["启用标题渐变色"].used) {
        backgroundImage = `linear-gradient(${this.baisicConfig["启用标题渐变色"].value[1]}deg, ${theme.backgroundColor}, ${theme.sliderGradient})`;
      }
      this.styles = {
        backgroundColor: this.baisicConfig["背景颜色"].value,
        backgroundImage: backgroundImage,
        border: `${this.baisicConfig["边框粗细"].value}px ${this.baisicConfig["样式"].value} ${this.baisicConfig["边框颜色"].value}`,
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
        backgroundColor: "#FFFFFF",
        borderColor: "#DDDDDD",
        sliderGradient: "rgba(0,0,0,0)"
      },
      black: {
        backgroundColor: "rgba(8,114,184,0)",
        borderColor: "#FFFFFF",
        sliderGradient: "rgba(0,0,0,0)"
      },
      highConfig: {
        颜色响应: {
          type: "eventColor",
          value: {
            pointId: "",
            colorList: [
              {
                color: "",
                start: "",
                end: ""
              }
            ]
          }
        },
        添加事件: {
          type: "explain"
        },
        事件: {
          type: "event",
          remind: false,
          value: [
            {
              order: "",
              result: [{ pointId: [], value: "" }]
            }
          ]
        }
      },
      baisicConfig: {
        尺寸: {
          status: 1,
          type: "widthHeight",
          label: ["宽度", "高度"],
          value: [0, 0],
          button: true
        },
        位置: {
          type: "widthHeight",
          label: ["横轴", "纵轴"],
          value: [0, 0]
        },
        线条1: {
          type: "line"
        },
        上传背景图: {
          type: "upload-image",
          status: 1,
          value: {
            imgUrl: "",
            fash: "100% 100%"
          }
        },
        样式: {
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
        背景颜色: {
          type: "color-select",
          value: ""
        },
        启用标题渐变色: {
          type: "slider-gradient",
          used: false,
          range: [0, 360],
          value: ["", 0]
        },
        边框颜色: {
          type: "color-select",
          value: "#FFFFFF"
        },
        边框粗细: {
          type: "slider",
          status: 1,
          range: [1, 10],
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
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  white-space: pre;
  overflow: hidden;
  background-repeat: no-repeat;
}
</style>
