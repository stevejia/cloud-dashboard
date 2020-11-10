<template>
  <div class="symbolComp" :style="styles">
    {{ text }}
  </div>
</template>
<script>
import translateConfig from "./text.js";
import mixin from "@/component/mixin.js";
export default {
  mixins: [mixin],
  methods: {
    translateConfig(item) {
      return translateConfig(item);
    },
    eventColor() {
      return this.baisicConfig["字体样式"].value[0];
    },
    eventColorChange(color) {
      this.baisicConfig["字体样式"].value[0] = color;
      this.initStyle(true);
    },
    initStyle(bool) {
      let { theme, baisicConfig } = this.startInitStyle();
      this.text = baisicConfig["文本内容"].value;
      let font = baisicConfig["文本样式"].value;
      let fontAlign = baisicConfig["字体样式"].value;
      this.styles = {
        fontSize: font[0],
        fontFamily: font[1],
        lineHeight: font[2],
        justifyContent: font[3],
        alignItems: font[4],
        color: fontAlign[0],
        fontWeight: fontAlign[1],
        fontStyle: fontAlign[2],
        textDecoration: fontAlign[3],
        background: theme["背景颜色"],
        border: `${baisicConfig["边框粗细"].value}px solid ${theme["边框颜色"]}`,
        opacity: baisicConfig["显示度"].value / 100
      };
      this.endInitStyle(bool);
    }
  },
  data() {
    return {
      text: "",
      styles: {},
      white: {
        背景颜色: "rgba(8,114,184,0)",
        边框颜色: "#000000",
        字体样式0: "#000000"
      },
      black: {
        背景颜色: "rgba(8,114,184,0)",
        边框颜色: "#FFFFFF",
        字体样式0: "#FFFFFF"
      },
      highConfig: {
        添加响应: {
          type: "explain"
        },
        可见: {
          type: "eventVisible",
          value: {
            pointId: [],
            rule: ""
          }
        },
        闪烁: {
          type: "eventOpacity",
          value: {
            pointId: [],
            rule: ""
          }
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
            ]
          }
        },
        线条: {
          type: "line"
        },
        启用文字响应: {
          type: "fontResponse",
          value: {
            status: false,
            pointId: [],
            valueList: [
              {
                text: "",
                min: null,
                max: null
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
              result: [
                {
                  pointId: [],
                  value: ""
                }
              ]
            }
          ]
        }
      },
      baisicConfig: {
        文本内容: {
          type: "textarea",
          value: "文本"
        },
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
        文本样式: {
          type: "font-align",
          value: ["12px", "", "", "center", "center"]
        },
        字体样式: {
          type: "font",
          value: ["#FFFFFF", "normal", "", ""]
        },
        背景颜色: {
          type: "color-select",
          value: ""
        },
        边框粗细: {
          type: "slider",
          status: 1,
          range: [0, 10],
          value: 0
        },
        边框颜色: {
          type: "color-select",
          value: "#FFFFFF"
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
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
}
</style>
