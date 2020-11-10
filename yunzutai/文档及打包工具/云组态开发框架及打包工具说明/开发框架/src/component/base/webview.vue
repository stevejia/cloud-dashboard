<template>
  <div class="symbolComp" :style="styles">
    <iframe :src="webSrc"></iframe>
    <div class="mask" v-if="!$store.state.runtime"></div>
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
      this.webSrc = this.baisicConfig["地址"].value;
      this.styles = {
        backgroundColor: this.baisicConfig["背景颜色"].value,
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
      webSrc: "",
      styles: {},
      white: {
        backgroundColor: "#FFFFFF",
        borderColor: "#DDDDDD"
      },
      black: {
        backgroundColor: "",
        borderColor: "#FFFFFF"
      },
      baisicConfig: {
        地址: {
          status: 1,
          type: "textarea",
          value: "https://www.baidu.com"
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
  background-repeat: no-repeat;
  iframe {
    height: calc(100%);
    width: calc(100%);
    border: 0;
    margin: 0 auto;
  }
  .mask {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
  }
}
</style>
