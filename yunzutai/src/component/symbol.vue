<template>
  <div
    class="symbolDiv"
    @contextmenu.prevent.stop="contextmenu"
    @mousedown="selectSymbol"
    :style="styles"
    v-show="!deleted"
  >
    <div class="content">
      <component
        ref="comp"
        :is="currentComp"
        :theme="$store.getters.theme"
      ></component>
    </div>
    <div class="markView symbolMark"></div>
    <div class="tagLens">
      <div class="taglen taglen-top">
        <div
          class="taglen top left"
          index="0"
          @mouseenter="mouseenter($event, 0)"
          @mouseleave="mouseleave($event)"
        ></div>
        <div
          class="taglen top center"
          index="1"
          middle
          @mouseenter="mouseenter($event, 1)"
          @mouseleave="mouseleave($event)"
        ></div>
        <div
          class="taglen top right"
          index="2"
          @mouseenter="mouseenter($event, 2)"
          @mouseleave="mouseleave($event)"
        ></div>
      </div>
      <div class="taglen taglen-right">
        <div
          class="taglen right center"
          index="3"
          middle
          @mouseenter="mouseenter($event, 3)"
          @mouseleave="mouseleave($event)"
        ></div>
      </div>
      <div class="taglen taglen-bottom">
        <div
          class="taglen bottom right"
          index="4"
          @mouseenter="mouseenter($event, 4)"
          @mouseleave="mouseleave($event)"
        ></div>
        <div
          class="taglen bottom center"
          index="5"
          middle
          @mouseenter="mouseenter($event, 5)"
          @mouseleave="mouseleave($event)"
        ></div>
        <div
          class="taglen bottom left"
          index="6"
          @mouseenter="mouseenter($event, 6)"
          @mouseleave="mouseleave($event)"
        ></div>
      </div>
      <div class="taglen taglen-left">
        <div
          class="taglen left center"
          index="7"
          middle
          @mouseenter="mouseenter($event, 7)"
          @mouseleave="mouseleave($event)"
        ></div>
      </div>
    </div>
    <div
      v-if="transform !== null && transform !== undefined"
      class="rotate-container"
    >
      <div class="rotate"></div>
      <div>
        <div
          :style="{ transform: `rotate(${-transform}deg)` }"
          :class="[
            'axis-rotate-deg',
            transform % 90 === 0 ? 'axis-rotate-deg-vertical' : ''
          ]"
        >
          {{ `${transform}°` }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getComp } from "@/util/common.js";
export default {
  data() {
    return {
      id: null,
      isCompose: false,
      currentComp: null,
      type: null,
      classes: null,
      transform: 0,
      width: 300,
      height: 200,
      left: 20,
      top: 100,
      locked: false,
      zIndex: 10,
      modifyColor: false,
      compConfig: null,
      heightChange: false,
      deleted: false
    };
  },
  mounted() {
    this.currentComp = getComp(this.type);
    this.$nextTick(() => {
      let comp = this.$refs.comp;
      Object.assign(comp.$data, this.compConfig);
      Object.assign(comp, this.compConfig);
      let config = this.$refs.comp.baisicConfig;
      if (config["尺寸"]) {
        config["尺寸"].value = [this.width, this.height];
      }
      if (config["位置"]) {
        config["位置"].value = [this.left, this.top];
      }
      if (config["旋转角度"]) {
        config["旋转角度"].value = this.transform;
      }

      comp.init && comp.init();
      comp.themeChange ? comp.themeChange() : comp.initStyle(true);
    });
  },
  methods: {
    returnConfig() {
      let comp = this.$refs.comp;
      if (comp && comp.returnConfig) {
        return {
          ...this.$data,
          currentComp: null,
          compConfig: comp.returnConfig()
        };
      }
      return {
        ...this.$data,
        currentComp: null,
        compConfig: comp ? comp.$data : {}
      };
    },
    getConfig() {
      let compData = this.$refs.comp.$data;
      let _comps = compData.comps;
      let _compconfigs = compData.compconfigs;
      _compconfigs = _comps.map((myCompConfig, index) => {
        myCompConfig = myCompConfig.map(compVm => {
          if (compVm.type === "compose") {
            return {
              ...compVm.getConfig(index),
              _linkComp: null
            };
          } else {
            let myconfig = compVm.$refs.comp
              ? compVm.$refs.comp.returnConfig
                ? compVm.$refs.comp.returnConfig()
                : compVm.$refs.comp.$data
              : compVm.$data;
            return {
              ...compVm.$data,
              currentComp: null,
              compConfig: myconfig
            };
          }
        });
        return myCompConfig;
      });
      this.$refs.comp.$data.compconfigs = _compconfigs;
      return {
        ...this.$data,
        currentComp: null,
        compConfig: {
          ...this.$refs.comp.$data,
          comps: _compconfigs.map(() => {
            return [];
          })
        }
      };
    },
    resizeHeight() {
      let config = this.$refs.comp.baisicConfig;
      if (
        config["尺寸"] &&
        (config["尺寸"].value[0] !== this.width ||
          config["尺寸"].value[1] !== this.height)
      ) {
        config["尺寸"].value = [this.width, this.height];
        this.heightChange = true;
        this.$refs.comp.resetComp && this.$refs.comp.resetComp(true);
      }
      if (config["位置"]) {
        config["位置"].value = [this.left, this.top];
      }
      if (config["旋转角度"]) {
        config["旋转角度"].value = this.transform;
      }
    },
    resetStyle() {
      let config = this.$refs.comp.baisicConfig;
      if (
        config["尺寸"] &&
        (config["尺寸"].value[0] !== this.width ||
          config["尺寸"].value[1] !== this.height)
      ) {
        config["尺寸"].value = [this.width, this.height];
      }
      if (config["位置"]) {
        config["位置"].value = [this.left, this.top];
      }
      if (config["旋转角度"]) {
        config["旋转角度"].value = this.transform;
      }
      if (this.heightChange) {
        this.heightChange = false;
        this.$refs.comp.resetComp && this.$refs.comp.resetComp(true);
      }
    },
    initStyle(widthHeight, size, transform) {
      if (widthHeight) {
        this.width = widthHeight[0];
        this.height = widthHeight[1];
        this.left = size[0];
        this.top = size[1];
      }
      if (transform !== undefined) {
        this.transform = transform;
      }
    },
    contextmenu(event) {
      this.selectSymbol(event);
      this.$drag.$contextmenuKey = true;
      this.$drag.showContextmenu(this);
    },
    selectSymbol(event) {
      this.$drag.hideContextmenu();
      if (this.$drag.selected) return;
      if (this.$drag.selectedId === this.id) return;

      if (this.$parent.type === "container") {
        if (this.$parent.$refs.comp.baisicConfig["容器"].blockContent) return;
      }
      window.getSelection().removeAllRanges();
      this.$drag.selectOperation(event, this);
      this.$drag.selected = true;
    },
    mouseenter(event, index) {
      event.stopPropagation();
      event.preventDefault();
      let offset = Math.floor(this.transform / 45);
      let newIndex = (index + offset) % 8;
      let cursorClass = this.getCursorStyleClass(newIndex);
      event.target.classList.add(cursorClass);
    },
    mouseleave(event) {
      let classList = event.target.classList;
      let cls = "";
      for (let i = 0; i < classList.length; i++) {
        if (classList[i].indexOf("cursor-") > -1) {
          cls = classList[i];
        }
      }
      if (cls) {
        event.target.classList.remove(cls);
      }
    },
    getCursorStyleClass(index) {
      let cursorCls = "";
      switch (index) {
        case 0:
          cursorCls = "cursor-nw";
          break;
        case 1:
          cursorCls = "cursor-n";
          break;
        case 2:
          cursorCls = "cursor-ne";
          break;
        case 3:
          cursorCls = "cursor-e";
          break;
        case 4:
          cursorCls = "cursor-se";
          break;
        case 5:
          cursorCls = "cursor-s";
          break;
        case 6:
          cursorCls = "cursor-sw";
          break;
        case 7:
          cursorCls = "cursor-w";
          break;
      }
      return cursorCls;
    }
  },
  beforeDestroy() {
    if (this.$parentEl) {
      this.$parentEl.removeChild(this.$el);
    }
    if (this.type === "container") {
      //如果是容器，则需要继续删除容器属性
      this.$drag.deleteContainerVms(this);
    }
  },
  computed: {
    styles() {
      return {
        width: this.width + "px",
        height: this.height + "px",
        left: this.left + "px",
        top: this.top + "px",
        transform: `rotate(${this.transform}deg)`,
        zIndex: this.zIndex
      };
    }
  }
};
</script>

<style lang="less" scoped>
.themeWhite {
  .symbolDiv {
    color: black;
    &.multiple {
      background: rgba(222, 232, 255, 0.8);
      border: 1px dashed #4c84ff;
      box-sizing: border-box;
      &.oper {
        border-color: #ff4c4c;
      }
    }
  }
  .tagLens {
    // border: 1px dashed #000;
  }
  .taglen-top {
    border-top: 1px dashed #000;
    .left,
    .right,
    .center {
      border: solid 1px #000;
      background-color: #fff;
    }
  }
  .taglen-left {
    border-left: 1px dashed #000;
    .center {
      border: 1px solid #000;
      background: #fff;
    }
  }
  .taglen-right {
    border-right: 1px dashed #000;
    .center {
      border: 1px solid #000;
      background: #fff;
    }
  }
  .taglen-bottom {
    border-bottom: 1px dashed #000;
    .left,
    .right,
    .center {
      border: solid 1px #000;
      background-color: #fff;
    }
  }
}
.themeBlack {
  .symbolDiv {
    color: white;
    &.multiple {
      background: rgba(222, 232, 255, 0.8);
      border: 1px dashed #4c84ff;
      box-sizing: border-box;
      &.oper {
        border-color: #ff4c4c;
      }
    }
  }
  .taglen-top {
    border-top: 1px dashed #fff;
    .left,
    .right,
    .center {
      border: solid 1px #fff;
      background-color: #000;
    }
    // &::before {
    //   border: 1px solid #fff;
    //   background: #000;
    // }
  }
  .taglen-left {
    border-left: 1px dashed #fff;
    .center {
      border: 1px solid #fff;
      background: #000;
    }
  }
  .taglen-right {
    border-right: 1px dashed #fff;
    .center {
      border: 1px solid #fff;
      background: #000;
    }
  }
  .taglen-bottom {
    border-bottom: 1px dashed #fff;
    .left,
    .right,
    .center {
      border: solid 1px #fff;
      background-color: #000;
    }
  }
}

.symbolDiv {
  position: absolute;

  // transition: top 0.2s, left 0.2s;
  &.single {
    > .tagLens {
      display: block;
    }
    > .rotate-container {
      display: block;
    }
    &.re-positioning {
      > .tagLens {
        display: none;
      }
      > .rotate-container {
        display: none;
      }
    }
  }

  .content {
    height: 100%;
    width: 100%;
    z-index: 2;
    & /deep/ .symbolComp {
      overflow: hidden;
    }
  }
  .markView.symbolMark {
    display: none;
  }
  &.multiple {
    .markView.symbolMark {
      display: block;
    }
  }
  .tagLens {
    // width: 100%;
    // height: 100%;
    // position: absolute;
    // left: 0;
    // top: 0;
    display: none;
    // box-sizing: border-box;
    .taglen-top {
      box-sizing: border-box;
      position: absolute;
      // height: 10px;
      top: 0;
      left: 0;
      right: 0;
      .left {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        position: absolute;
        left: -7px;
        top: -7px;
        z-index: 4;
      }

      .center {
        width: 10px;
        height: 10px;
        position: absolute;
        left: 50%;
        top: -7px;
        transform: translateX(-50%);
        z-index: 4;
      }

      .right {
        width: 12px;
        height: 12px;

        border-radius: 50%;

        position: absolute;
        right: -7px;
        top: -7px;
        z-index: 4;
      }
      // &::before {
      //   content: "";
      // }
    }
    .taglen-left {
      box-sizing: border-box;
      position: absolute;
      // width: 10px;
      top: 0;
      left: 0;
      bottom: 0;
      .center {
        width: 10px;
        height: 10px;

        position: absolute;
        top: 50%;
        left: -6px;
        margin-top: -6px;
        z-index: 1;
      }
    }
    .taglen-right {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      // width: 10px;

      .center {
        content: "";
        width: 10px;
        height: 10px;

        position: absolute;
        top: 50%;
        right: -6px;
        margin-top: -6px;
        z-index: 2;
      }
    }
    .taglen-bottom {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      // height: 10px;

      .left {
        width: 12px;
        height: 12px;

        border-radius: 50%;

        position: absolute;
        left: -7px;
        bottom: -7px;
        z-index: 2;
      }
      .right {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        position: absolute;
        right: -7px;
        bottom: -7px;
        z-index: 3;
      }
      .center {
        width: 10px;
        height: 10px;
        position: absolute;
        left: 50%;
        bottom: -6px;
        margin-left: -6px;
      }
    }
    .taglen {
      .cursor-nw {
        cursor: nw-resize;
      }
      .cursor-n {
        cursor: n-resize;
      }
      .cursor-ne {
        cursor: ne-resize;
      }
      .cursor-e {
        cursor: e-resize;
      }
      .cursor-se {
        cursor: se-resize;
      }
      .cursor-s {
        cursor: s-resize;
      }
      .cursor-sw {
        cursor: sw-resize;
      }
      .cursor-w {
        cursor: w-resize;
      }
    }
  }
  .rotate-container {
    display: none;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: -60px;
    .rotate {
      width: 24px;
      height: 24px;
      background-image: url(../assets/image/common/rota.svg);
      background-repeat: no-repeat;
      background-size: 100% 100%;
      background-position: center;
      cursor: pointer; /* cursor: none; 消除鼠标样式 */
    }
    .axis-rotate-deg {
      position: absolute;
      left: 40px;
      top: 0;
      color: blue;
      background: #ffffff;
      border-radius: 6px;
      padding: 0 10px;
      &.axis-rotate-deg-vertical {
        color: red;
        font-weight: bold;
      }
    }
  }
}
</style>
