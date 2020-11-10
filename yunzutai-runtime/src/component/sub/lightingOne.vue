<template>
  <div class="symbolComp" :style="styles">
    <div class="divLine" :style="lineStyle"></div>
    <ul class="light">
      <li
        :key="item"
        v-for="item in num"
        class="light-li"
        :style="{ ...lightStyle }"
      ></li>
    </ul>
  </div>
</template>
<script>
import translateConfig from "./config/lightingOne.js";
export default {
  props: {
    theme: String
  },
  watch: {
    "$store.getters.theme": function() {
      this.themeChange();
    }
  },
  methods: {
    translateConfig(item) {
      return translateConfig(item);
    },
    returnConfig() {
      return {
        white: this.white,
        black: this.black,
        highConfig: this.highConfig,
        basicConfig: this.basicConfig
        // ...
      };
    },
    resetStyle(data) {
      this[this.theme] = data[this.theme];
      this.baisicConfig = {
        ...this.baisicConfig,
        背景颜色: {
          type: "color-select",
          value: ""
        },
        连接线颜色: {
          type: "color-select",
          value: ""
        },
        连接线粗细: {
          type: "slider",
          status: 1,
          range: [0, 10],
          value: 2
        },
        显示度: {
          type: "slider",
          status: 1,
          range: [0, 100],
          value: 100
        }
      };
      this.themeChange();
    },
    //该组件被按下时候触发
    init() {
      console.log("initEvent");
    },
    themeChange() {
      this.height = this.$parent.height;
      let theme = this[this.theme];
      this.baisicConfig["背景颜色"].value = theme.background;
      this.baisicConfig["连接线颜色"].value = theme.lineColor;

      this.initStyle(true);
    },
    resetComp() {
      this.baisicConfig["灯光宽高属性"].value = [
        this.baisicConfig["灯光宽高属性"].value[0],
        this.baisicConfig["尺寸"].value[1]
      ];
      this.lightStyle.height =
        this.baisicConfig["灯光宽高属性"].value[1] + "px";
    },
    initStyle(bool) {
      let theme = this[this.theme]; //获取对应主题的对象

      theme.background = this.baisicConfig["背景颜色"].value;
      theme.lineColor = this.baisicConfig["连接线颜色"].value;

      this.num = parseInt(this.baisicConfig["灯光总数"].value) || 0;
      this.styles = {
        background: theme.background,
        opacity: this.baisicConfig["显示度"].value / 100
      };
      this.lineStyle = {
        background: theme.lineColor,
        height: this.baisicConfig["连接线粗细"].value + "px",
        display: this.num <= 1 ? "none" : "block"
      };
      let lightSize = this.baisicConfig["灯光宽高属性"];
      let size = this.baisicConfig["尺寸"];
      if (size.value[1] !== lightSize.value[1]) {
        if (lightSize.value[1] === this.$parent.height) {
          lightSize.value = [lightSize.value[0], size.value[1]];
        } else {
          size.value = [size.value[0], lightSize.value[1]];
        }
        this.baisicConfig["灯光宽高属性"].value;
      }
      this.lightStyle = {
        backgroundColor: theme.liBack,
        backgroundImage: `url(${this.highConfig["动画"].currentImage})`,
        width: lightSize.value[0] + "px",
        height: lightSize.value[1] + "px"
      };

      if (!bool) {
        //这里是告诉父组件，我这边数据更新了，你们的left，width，translate也要更新
        this.$parent.initStyle(
          size.value,
          this.baisicConfig["位置"].value,
          this.baisicConfig["旋转角度"].value
        );
      }
    }
  },
  data() {
    return {
      num: 3,
      styles: {},
      lineStyle: {},
      lightStyle: {},
      height: 0,
      white: {
        background: "rgba(0,0,0,0)",
        lineColor: "#455A64",
        liBack: "#455a64"
      },
      black: {
        background: "rgba(0,0,0,0)",
        lineColor: "#DDDDDD",
        liBack: "#ddd"
      },
      highConfig: {
        动画: {
          type: "degree",
          currentImage: "",
          sameStatus: true,
          value: [
            {
              pointId: [],
              sourceValue: 1,
              oper: "",
              value: "",
              imgUrl: ""
            }
          ]
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
          type: "widthHeight",
          label: ["宽度", "高度"],
          value: [0, 40]
        },
        位置: {
          type: "widthHeight",
          label: ["横轴", "纵轴"],
          value: [0, 0]
        },
        线条: {
          type: "line"
        },
        灯光宽高属性: {
          type: "widthHeight",
          label: ["宽", "高"],
          value: [40, 40]
        },
        线条1: {
          type: "line"
        },
        灯光总数: {
          type: "input",
          value: 3
        },
        线条2: {
          type: "line"
        },
        背景颜色: {
          type: "color-select",
          value: ""
        },
        连接线颜色: {
          type: "color-select",
          value: ""
        },
        连接线粗细: {
          type: "slider",
          status: 1,
          range: [0, 10],
          value: 2
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
  width: calc(100%);
  height: calc(100%);
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  white-space: pre;
  overflow: hidden;
  .divLine {
    width: calc(100%);
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    box-sizing: border-box;
  }
  .light {
    z-index: 3;
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .light-li {
      box-sizing: border-box;
      background-size: 100% 100%;
    }
  }
}
</style>
