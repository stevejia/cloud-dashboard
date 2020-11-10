<template>
  <div class="symbolComp" :style="styles">
    <template v-if="$store.state.runtime">
      <div class="divStop" @mousedown.stop="" :style="stopStyle"></div>
    </template>
    <template v-else>
      <div class="divStop" :style="stopStyle"></div>
    </template>
    <div class="divLine" :style="lineStyle"></div>
    <ul v-for="vItem in vNum" :key="vItem" class="light">
      <template v-if="vItem === 1 || vItem === vNum">
        <li
          :key="item"
          v-for="item in hNum"
          class="light-li"
          :style="{ ...lightStyle }"
        ></li>
      </template>
      <template v-else>
        <li
          :key="item"
          v-for="item in cNum"
          class="light-li"
          :style="{ ...lightStyle }"
        ></li>
      </template>
    </ul>
  </div>
</template>
<script>
import translateConfig from "./config/lightingTwo.js";
import mixin from "@/component/mixin.js";
export default {
  mixins: [mixin],
  methods: {
    translateConfig(item) {
      return translateConfig(item);
    },
    initStyle(bool) {
      let { theme, baisicConfig } = this.startInitStyle();

      theme.background = baisicConfig["背景颜色"].value;
      theme.lineColor = baisicConfig["连接线颜色"].value;

      this.hNum = parseInt(baisicConfig["水平灯光数量"].value) || 0;
      this.vNum = parseInt(baisicConfig["垂直灯光数量"].value) || 0;
      if (this.hNum == 1) {
        this.cNum = 1;
      } else if (this.hNum == 0 || this.vNum == 0) {
        this.cNum = 0;
      } else {
        this.cNum = 2;
      }
      this.styles = {
        background: theme.background,
        opacity: baisicConfig["显示度"].value / 100
      };
      let lightSize = baisicConfig["灯光宽高属性"];
      if (baisicConfig["可控边距"].status) {
        baisicConfig["可控边距"].value = lightSize.value[1] * 2 + 20;
      }
      this.lineStyle = {
        width: `calc(100% - ${lightSize.value[0]}px)`,
        height: `calc(100% - ${lightSize.value[1]}px)`,
        borderWidth: baisicConfig["连接线粗细"].value + "px"
      };
      if (this.vNum == 0 || this.hNum == 0) {
        this.lineStyle.borderColor = theme.lineColor;
      } else {
        this.lineStyle.borderTopColor =
          this.hNum <= 1 ? "rgba(0,0,0,0)" : theme.lineColor;
        this.lineStyle.borderRightColor =
          this.hNum <= 1 || this.vNum <= 1 ? "rgba(0,0,0,0)" : theme.lineColor;
        this.lineStyle.borderBottomColor =
          this.hNum <= 1 || this.vNum <= 1 ? "rgba(0,0,0,0)" : theme.lineColor;
        this.lineStyle.borderLeftColor =
          this.vNum <= 1 ? "rgba(0,0,0,0)" : theme.lineColor;
      }
      this.stopStyle = {
        borderColor: theme.liBack,
        width: `calc(100% - ${baisicConfig["可控边距"].value}px)`,
        height: `calc(100% - ${baisicConfig["可控边距"].value}px)`
      };
      this.lightStyle = {
        backgroundColor: theme.liBack,
        backgroundImage: `url(${this.highConfig["动画"].currentImage})`,
        width: lightSize.value[0] + "px",
        height: lightSize.value[1] + "px"
      };

      this.endInitStyle(bool);
    }
  },
  data() {
    return {
      hNum: 3,
      vNum: 3,
      cNum: 2,
      styles: {},
      lineStyle: {},
      lightStyle: {},
      stopStyle: {},
      white: {
        背景颜色: "rgba(0,0,0,0)",
        连接线颜色: "#455A64",
        liBack: "#455a64"
      },
      black: {
        背景颜色: "rgba(0,0,0,0)",
        连接线颜色: "#DDDDDD",
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
        灯光宽高属性: {
          type: "widthHeight",
          label: ["宽", "高"],
          value: [40, 40]
        },
        线条1: {
          type: "line"
        },
        水平灯光数量: {
          type: "input",
          value: 3
        },
        垂直灯光数量: {
          type: "input",
          value: 3
        },
        线条2: {
          type: "line"
        },
        可控边距: {
          type: "inputNumber",
          status: true,
          value: 100
        },
        线条4: {
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
        线条5: {
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
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  white-space: pre;
  overflow: hidden;
  cursor: pointer;
  .divLine {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-style: solid;
    box-sizing: border-box;
  }
  .divStop {
    opacity: 0.5;
    z-index: 3;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-style: dashed;
    border-width: 1px;
    box-sizing: border-box;
  }
  .light {
    z-index: 2;
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
