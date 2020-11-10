<template>
  <div class="symbolComp" :style="styles">
    {{ text }}
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
      this.baisicConfig["字体样式"].value[0] = theme.color;
      this.baisicConfig["边框颜色"].value = theme.borderColor;
      this.initStyle(true);
    }
  },
  methods: {
    initStyle(bool) {
      let theme = this[this.theme];
      theme.color = this.baisicConfig["字体样式"].value[0];
      theme.borderColor = this.baisicConfig["边框颜色"].value;

      this.text = this.baisicConfig["文本内容"].value;
      let font = this.baisicConfig["文本样式"].value;
      let fontAlign = this.baisicConfig["字体样式"].value;
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
        background: this.baisicConfig["背景颜色"].value,
        border: `${this.baisicConfig["边框粗细"].value}px solid ${this.baisicConfig["边框颜色"].value}`,
        opacity: this.baisicConfig["显示度"].value / 100
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
        borderColor: "#000000",
        color: "#000000"
      },
      black: {
        backgroundColor: "",
        borderColor: "white",
        color: "white"
      },
      highConfig: {
        添加响应: {
          type: "explain"
        },
        可见: {
          type: "eventVisible",
          value: {
            pointId: "",
            rule: ""
          }
        },
        闪烁: {
          type: "eventOpacity",
          value: {
            pointId: "",
            rule: ""
          }
        },
        颜色响应: {
          type: "eventColor",
          value: {
            pointId: "",
            colorList: [
              {
                color: "",
                c1showcs: "",
                c1showce: ""
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
              order: ""
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
}
</style>
