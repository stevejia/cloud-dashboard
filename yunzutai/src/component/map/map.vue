<template>
  <div class="symbolComp" :style="styles">
    <img :style="styleImg" :src="imUrl" @mousedown.prevent="" alt="" />
  </div>
</template>
<script>
import translateConfig from "./map.js";
import mixin from "@/component/mixin.js";
export default {
  mixins: [mixin],
  props: {
    theme: String
  },
  data() {
    return {
      styles: {},
      styleImg: {},
      imUrl: "",
      billie: 1,
      white: {
        mapBg: "",
        mapFilter: ""
      },
      black: {
        mapBg: "",
        mapFilter: ""
      },
      newHightConfig: {
        线条3: {
          type: "line"
        },
        动画响应: {
          type: "dataTree",
          value: ""
        },
        禁止: {
          type: "eventMapNumber",
          value: [0, ""]
        },
        动画: {
          type: "eventMapNumber",
          value: [1, ""]
        }
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
        线条1: {
          type: "line"
        },
        闪烁: {
          type: "eventOpacity",
          value: {
            pointId: [],
            rule: ""
          }
        },
        线条2: {
          type: "line"
        },
        显示度: {
          type: "eventMap",
          value: [],
          opacityRange: [20, 100],
          dataRange: [0, 100]
        }
      },
      baisicConfig: {
        固定比例: {
          type: "checkbox",
          value: false
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
        翻转: {
          type: "btnRotate",
          value: [0, 0]
        },
        线条2: {
          type: "line"
        },
        背景颜色: {
          type: "color-select-row",
          modifyColor: false,
          value: [
            { title: "背景颜色", value: "" },
            { title: "图素颜色", value: "" }
          ]
        },
        显示度: {
          type: "slider",
          status: 1,
          range: [0, 100],
          value: 100
        },
        旋转角度: {
          type: "slider",
          status: 1,
          range: [0, 360],
          value: 0
        }
      }
    };
  },
  watch: {
    "$store.getters.theme": function() {
      let theme = this[this.theme];
      this.baisicConfig["背景颜色"].value[0].value = theme.mapBg;
      let modifyColor = this.$parent._data.modifyColor || false;
      if (modifyColor) {
        this.baisicConfig["背景颜色"].value[1].value = theme.mapFilter;
      }
      this.initStyle(true);
    },
    "baisicConfig.尺寸.value": function() {
      this.initStyle(true);
    }
  },
  created() {
    if (this.$parent._data.multiple) {
      this.highConfig = { ...this.highConfig, ...this.newHightConfig };
    }
    let modifyColor = this.$parent._data.modifyColor || false;
    if (!modifyColor) {
      this.baisicConfig["背景颜色"].value = [{ title: "背景颜色", value: "" }];
    } else {
      this.baisicConfig["背景颜色"].value[1].value =
        this.$parent._data.color || "#fff";
      this.black.mapFilter = this.baisicConfig["背景颜色"].value[1].value;
      this.white.mapFilter = this.baisicConfig["背景颜色"].value[1].value;
      delete this.highConfig["闪烁"];
      delete this.highConfig["线条1"];
    }
    this.white.mapBg = this.baisicConfig["背景颜色"].value[0].value;
    this.black.mapBg = this.baisicConfig["背景颜色"].value[0].value;
    this.imUrl = this.$parent.imUrl;
  },
  methods: {
    translateConfig(item) {
      return translateConfig(item);
    },
    initStyle(bool) {
      this.startInitStyle();
      let theme = this[this.theme];
      theme.mapBg = this.baisicConfig["背景颜色"].value[0].value;
      let rotate = this.baisicConfig["翻转"].value;
      this.styles = {
        opacity: this.baisicConfig["显示度"].value / 100,
        background: this.baisicConfig["背景颜色"].value[0].value,
        transform: `rotateX(${rotate[0]}deg) rotateY(${rotate[1]}deg)`
      };
      if (this.$parent._data.modifyColor) {
        theme.mapFilter = this.baisicConfig["背景颜色"].value[1].value;
        let widths = this.baisicConfig["尺寸"].value[0];
        let color2 = this.baisicConfig["背景颜色"].value[1].value;
        this.styleImg = {
          width: "100%",
          height: "100%",
          position: "relative",
          left: -widths + "px",
          filter: `drop-shadow(${color2 || ""} ${widths}px 0px)`
        };
      }
      this.setBillie();
      this.endInitStyle(bool);
    },
    // 重绘
    resetComp(bool, style) {
      if (!bool) {
        let w = this.baisicConfig["尺寸"].value[0];
        let h = this.baisicConfig["尺寸"].value[1];
        this.billie = w / h;
      } else {
        this.setBillie();
        if (this.baisicConfig["固定比例"].value) {
          if (this.baisicConfig["固定比例"].value && style) {
            let size = this.baisicConfig["尺寸"].value;
            let height = size[1];
            let width = height * this.billie;
            if (style == "width") {
              width = size[0];
              height = width / this.billie;
            }
            this.baisicConfig["尺寸"].value = [width, height];
            // this.initStyle();
          }
        }
      }
    },
    setBillie() {
      if (this.baisicConfig["固定比例"].value) return;
      let w = this.baisicConfig["尺寸"].value[0];
      let h = this.baisicConfig["尺寸"].value[1];
      this.billie = w / h;
    },
    pointIdChange(val) {
      let imUrl = this.$parent.imUrl;
      let url1 = this.$parent.url1;
      let sport1 = Number(this.highConfig["动画"].value[0]);
      let sport2 = Number(this.highConfig["动画"].value[1]);
      let stop2 = Number(this.highConfig["禁止"].value[1]);
      let value = Number(val[0]);
      let isOpenClose = this.$parent._data.isOpenClose;
      if (sport1 < stop2) {
        if (isOpenClose) return;
        this.imUrl = url1;
        return;
      }
      if (sport2 < sport1) {
        if (isOpenClose) return;
        this.imUrl = url1;
        return;
      }
      if (value >= sport1 && value <= sport2) {
        if (isOpenClose) {
          if (this.imUrl.indexOf("zhiti-open") == -1) {
            this.imUrl = this.$parent.imUrl;
            return;
          } else if (this.imUrl.indexOf("zhiti-close") == -1) {
            this.imUrl = this.$parent.url1;
            return;
          }
        }
        this.imUrl = imUrl;
      } else {
        if (isOpenClose) return;
        this.imUrl = url1;
      }
    },
    returnConfig() {
      let collectPointIds = [];
      let arrs = this.highConfig["动画响应"];
      if (arrs && arrs.value) {
        collectPointIds.push(arrs.value);
        return {
          collectPointIds: collectPointIds,
          white: this.white,
          black: this.black,
          highConfig: this.highConfig,
          baisicConfig: this.baisicConfig
        };
      }
    },
    setMessage(message) {
      this.$message({
        message: message,
        type: "warning",
        duration: 1500,
        showClose: true
      });
    }
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
  img {
    width: 100%;
    height: 100%;
  }
}
</style>
