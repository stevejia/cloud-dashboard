<template>
  <div class="symbolComp" :style="styles">
    <img
      class="imgDiv"
      :src="baisicConfig['是否启用小图标'].value.iconUrl"
      :style="imgStyle"
      v-show="baisicConfig['是否启用小图标'].value.iconStatus"
    />{{ title }}
  </div>
</template>
<script>
import mixin from "@/component/mixin.js";
import translateConfig from "./config/title.js";
export default {
  mixins: [mixin],
  props: {
    theme: String
  },
  watch: {
    "$store.getters.theme": {
      immediate: true,
      handler: function() {
        let theme = this[this.theme];
        this.baisicConfig["是否启用小图标"].value.color = theme.iconColor;
      }
    }
  },
  methods: {
    initStyle(bool) {
      this.startInitStyle();
      let theme = this[this.theme];
      theme.iconColor = this.baisicConfig["是否启用小图标"].value.color;
      this.title = this.baisicConfig["标题内容"].value;
      let font = this.baisicConfig["字体样式"].value;
      this.styles = {
        border: `${this.baisicConfig["边框粗细"].value}px solid ${this.baisicConfig["边框颜色"].value}`,
        justifyContent: this.baisicConfig["标题位置"].value,
        opacity: this.baisicConfig["显示度"].value / 100,
        fontSize: font[0],
        fontFamily: font[1],
        color: font[2],
        background: this.baisicConfig["背景颜色"].value,
        boxShadow: `${this.baisicConfig["发光色"].value} 0px 0px 10px -3px inset`
      };
      this.imgStyle = {
        filter: `drop-shadow(${this.baisicConfig["是否启用小图标"].value.color} 750px 0)`
      };
      this.endInitStyle(bool);
    },
    translateConfig(item) {
      return translateConfig(item);
    }
  },
  data() {
    return {
      title: "",
      styles: {},
      imgStyle: {},
      white: {
        字体样式2: "#000",
        边框颜色: "#eee",
        发光色: "#3573C1",
        背景颜色: "rgba(0, 0, 0, 0)",
        iconColor: "#000"
      },
      black: {
        字体样式2: "#fff",
        边框颜色: "#404753",
        发光色: "#3573C1",
        背景颜色: "rgba(0, 0, 0, 0)",
        iconColor: "#fff"
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
        标题内容: {
          type: "input",
          value: "标题"
        },
        标题位置: {
          type: "select",
          label: [
            {
              label: "左",
              value: "flex-start"
            },
            {
              label: "中间",
              value: "center"
            },
            {
              label: "右",
              value: "flex-end"
            }
          ],
          value: "flex-start"
        },
        线条2: {
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
        发光色: {
          type: "color-select",
          value: "rgb(53, 115, 193)"
        },
        边框颜色: {
          type: "color-select",
          value: "#404753"
        },
        是否启用小图标: {
          type: "iconCheckbox",
          note: "123",
          value: {
            iconStatus: false,
            iconUrl: "/static/img/sub/title/electric.svg",
            color: "#fff"
          }
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
      }
    };
  }
};
</script>

<style lang="less" scoped>
.symbolComp {
  padding: 0 10px;
  width: calc(100%);
  height: calc(100%);
  display: flex;
  align-items: center;
  box-sizing: border-box;
  white-space: pre;
  overflow: hidden;
  .imgDiv {
    height: 60%;
    fill: currentColor;
    overflow: hidden;
    display: block;
    transform: translateX(-750px);
  }
}
</style>
