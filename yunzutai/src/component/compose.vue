<template>
  <div
    class="symbolDiv"
    @contextmenu.prevent.stop="contextmenu"
    @mousedown="selectSymbol"
    @dblclick="selectChildSymbol"
    :style="styles"
  >
    <div class="content"></div>
    <div class="markView symbolMark"></div>
    <div class="tagLens">
      <div class="taglenn taglenn-top"></div>
      <div class="taglenn taglenn-left"></div>
      <div class="taglenn taglenn-right"></div>
      <div class="taglenn taglenn-bottom"></div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      id: null,
      currentPageId: null,
      linkComps: [],
      linkCompIndexs: [],
      type: "compose",
      classes: null,
      width: 300,
      height: 200,
      left: 20,
      top: 100,
      locked: false,
      zIndex: 10
    };
  },
  methods: {
    getConfig(index, bool) {
      let comps;
      if (this.$parent.type === "container") {
        let compData = this.$parent.$refs.comp;
        let container = compData.baisicConfig["容器"];
        if (index === undefined) {
          index = container.currentTabIndex;
        }
        comps = compData.comps[index];
      } else {
        comps = this.$drag.centerConfigs[this.currentPageId].comps;
      }
      comps = comps.filter(comp => !comp.deleted);

      this.linkCompIndexs = this.linkComps.map(myComp => {
        return comps.findIndex(comp => {
          return comp === myComp;
        });
      });
      let _linkComp = this.linkCompIndexs.map(index => {
        return comps[index];
      });
      if (bool) {
        return {
          ...this.$data,
          linkComps: [],
          _linkComp: _linkComp.map(item => {
            return item.returnConfig();
          })
        };
      }
      return {
        ...this.$data,
        linkComps: [],
        _linkComp: _linkComp
      };
    },
    resetStyle() {},
    initStyle([width, height], [left, top]) {
      this.width = width;
      this.height = height;
      this.left = left;
      this.top = top;
    },
    selectChildSymbol(event) {
      let { layerX, layerY } = event;
      let comps = this.linkComps.filter(item => {
        return (
          layerX > item.left &&
          layerX < item.left + item.width &&
          layerY > item.top &&
          layerY < item.top + item.height
        );
      });
      comps.sort((a, b) => {
        return a.zIndex > b.zIndex;
      });
      let target = comps.length ? comps[0] : null;
      if (target) {
        this.$drag.hideContextmenu();
        if (this.$drag.selected) return;
        if (this.$drag.selectedId === target.id) return;
        window.getSelection().removeAllRanges();
        this.$drag.selectOperation(event, target);
        this.$drag.selected = true;
      }
    },
    contextmenu(event) {
      this.selectSymbol(event);
      this.$drag.$contextmenuKey = true;
      this.$drag.showContextmenu(this);
    },
    selectSymbol(event) {
      this.$drag.hideContextmenu();
      this.$drag.clearVms();
      this.$drag.showMenu({ classes: 66 });

      if (this.$drag.selected) return;
      if (this.$parent.type === "container") {
        if (this.$parent.$refs.comp.baisicConfig["容器"].blockContent) return;
      }
      window.getSelection().removeAllRanges();
      this.$drag.selectOperation(event, this);
      this.$drag.selected = true;
      // if (event.ctrlKey) {
      //   this.$drag.addMultOperation(this);
      // } else {
      //   let vms = this.$drag.vms;
      //   if (vms instanceof Array) {
      //     if (vms.indexOf(this) == -1) {
      //       this.$drag.setOperation(this);
      //     }
      //   } else {
      //     this.$drag.setOperation(this);
      //   }
      // }
    }
  },
  beforeDestroy() {
    if (this.$parentEl) {
      this.$parentEl.removeChild(this.$el);
    }
  },
  computed: {
    styles() {
      return {
        width: this.width + "px",
        height: this.height + "px",
        left: this.left + "px",
        top: this.top + "px",
        zIndex: this.zIndex
      };
    }
  }
};
</script>

<style lang="less" scoped>
.symbolMark {
  z-index: inherit;
}
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
  .taglenn-top {
    border-top: 1px dashed #000;
    .left,
    .right {
      border: solid 1px #000;
      background-color: #fff;
    }
    &::before {
      border: 1px solid #000;
      background: #fff;
    }
  }
  .taglenn-left {
    border-left: 1px dashed #000;
    &::after {
      border: 1px solid #000;
      background: #fff;
    }
  }
  .taglenn-right {
    border-right: 1px dashed #000;
    &::after {
      border: 1px solid #000;
      background: #fff;
    }
  }
  .taglenn-bottom {
    border-bottom: 1px dashed #000;
    .left,
    .right {
      border: solid 1px #000;
      background-color: #fff;
    }
    &::after {
      border: 1px solid #000;
      background: #fff;
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
  .taglenn-top {
    border-top: 1px dashed #fff;
    .left,
    .right {
      border: solid 1px #fff;
      background-color: #000;
    }
    &::before {
      border: 1px solid #fff;
      background: #000;
    }
  }
  .taglenn-left {
    border-left: 1px dashed #fff;
    &::after {
      border: 1px solid #fff;
      background: #000;
    }
  }
  .taglenn-right {
    border-right: 1px dashed #fff;
    &::after {
      border: 1px solid #fff;
      background: #000;
    }
  }
  .taglenn-bottom {
    border-bottom: 1px dashed #fff;
    .left,
    .right {
      border: solid 1px #fff;
      background-color: #000;
    }
    &::after {
      border: 1px solid #fff;
      background: #000;
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
  }

  .content {
    height: 100%;
    width: 100%;
    z-index: 2;
    overflow: hidden;
  }
  .tagLens {
    display: none;
    position: absolute;
    left: 0px;
    right: 0px;
    top: 0px;
    bottom: 0px;
    z-index: 1;
    height: 100%;
    width: 100%;
    .taglenn-top {
      box-sizing: border-box;
      position: absolute;
      height: 10px;
      top: -10px;
      left: -9px;
      right: -9px;
    }
    .taglenn-left {
      box-sizing: border-box;
      position: absolute;
      width: 10px;
      top: -9px;
      left: -10px;
      bottom: -9px;
    }
    .taglenn-right {
      position: absolute;
      top: -9px;
      right: -10px;
      bottom: -9px;
      width: 10px;
    }
    .taglenn-bottom {
      position: absolute;
      bottom: -10px;
      left: -9px;
      right: -9px;
      height: 10px;
    }
  }
}
</style>
