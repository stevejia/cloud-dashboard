<template>
  <div class="symbolDiv" :style="styles">
    <template v-if="type === 'single'">
      <iframe :src="remoteUrl || site.url"></iframe>
    </template>
    <template v-else>
      <div class="content">
        <div class="row rowstart">
          <div
            @mousedown.stop="activeName = item.name"
            :class="activeName === item.name ? 'tabs active' : 'tabs'"
            v-for="item in site"
            :key="item.name"
          >
            {{ item.name }}
          </div>
        </div>
        <iframe
          :class="activeName === item.name ? 'iframes active' : 'iframes'"
          v-for="item in site"
          :key="item.name + '1'"
          :src="item.url"
        ></iframe>
      </div>
    </template>
    <div class="markView"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      type: null,
      site: null,
      container: null,
      activeName: null,
      remoteUrl: null
    };
  },
  created() {
    if (this.type === "multi") {
      this.activeName = this.site[0].name;
    }
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    }
  },
  beforeDestroy() {
    this.$parentEl.removeChild(this.$el);
  },
  computed: {
    styles() {
      return {
        width: this.$parentEl.offsetWidth + "px",
        height: this.$parentEl.offsetHeight + "px",
        left: "0px",
        top: "0px"
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
    }
  }
  .taglen-top {
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
  .taglen-left {
    border-left: 1px dashed #000;
    &::after {
      border: 1px solid #000;
      background: #fff;
    }
  }
  .taglen-right {
    border-right: 1px dashed #000;
    &::after {
      border: 1px solid #000;
      background: #fff;
    }
  }
  .taglen-bottom {
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
    }
  }
  .taglen-top {
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
  .taglen-left {
    border-left: 1px dashed #fff;
    &::after {
      border: 1px solid #fff;
      background: #000;
    }
  }
  .taglen-right {
    border-right: 1px dashed #fff;
    &::after {
      border: 1px solid #fff;
      background: #000;
    }
  }
  .taglen-bottom {
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
  .tabs {
    width: 130px;
    height: 34px;
    line-height: 34px;
    text-align: center;
    background: #24252a;
    color: white;
    cursor: pointer;
    &.active {
      background: #3573c1;
    }
  }
  .iframes {
    display: none;
    height: calc(100% - 34px);
    &.active {
      display: block;
    }
  }
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
    .taglen-top {
      box-sizing: border-box;
      position: absolute;
      height: 10px;
      top: -10px;
      left: -9px;
      right: -9px;

      cursor: n-resize;
      .left {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        position: absolute;
        left: -7px;
        top: -7px;
        cursor: nw-resize;
        z-index: 1;
      }
      .right {
        width: 12px;
        height: 12px;

        border-radius: 50%;

        position: absolute;
        right: -7px;
        top: -7px;
        cursor: ne-resize;
        z-index: 1;
      }
      &::before {
        content: "";
        width: 10px;
        height: 10px;

        position: absolute;
        left: 50%;
        top: -6px;
        margin-left: -6px;
      }
    }
    .taglen-left {
      box-sizing: border-box;
      position: absolute;
      width: 10px;
      top: -9px;
      left: -10px;
      bottom: -9px;

      cursor: w-resize;
      &::after {
        content: "";
        width: 10px;
        height: 10px;

        position: absolute;
        top: 50%;
        left: -6px;
        margin-top: -6px;
      }
    }
    .taglen-right {
      position: absolute;
      top: -9px;
      right: -10px;
      bottom: -9px;
      width: 10px;

      cursor: e-resize;
      &::after {
        content: "";
        width: 10px;
        height: 10px;

        position: absolute;
        top: 50%;
        right: -6px;
        margin-top: -6px;
      }
    }
    .taglen-bottom {
      position: absolute;
      bottom: -10px;
      left: -9px;
      right: -9px;
      height: 10px;

      cursor: s-resize;
      .left {
        width: 12px;
        height: 12px;

        border-radius: 50%;

        position: absolute;
        left: -7px;
        bottom: -7px;
        cursor: sw-resize;
        z-index: 1;
      }
      .right {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        position: absolute;
        right: -7px;
        bottom: -7px;
        cursor: nw-resize;
        z-index: 1;
      }
      &::after {
        content: "";
        width: 10px;
        height: 10px;

        position: absolute;
        left: 50%;
        bottom: -6px;
        margin-left: -6px;
      }
    }
  }
}
</style>
