<template>
  <div :class="['ruler-container', $store.getters.theme]">
    <div class="editor-ruler-top">
      <div class="editor-ruler-inner" v-html="topRulerHtml"></div>
    </div>
    <div class="editor-ruler-left">
      <div class="editor-ruler-inner" v-html="leftRulerHtml"></div>
    </div>
  </div>
</template>
<script>
export default {
  props: ["scale", "container"],
  data() {
    return {
      leftRulerHtml: "",
      topRulerHtml: "",
      isMouseDown: false
    };
  },
  mounted() {
    this.initRuler();
  },
  watch: {
    scale(val) {
      console.log(val);
      this.initRuler();
    }
  },
  methods: {
    initRuler() {
      let el = this.$el;
      let editArea = document.querySelector(this.container);
      let editAreaWidth = editArea.clientWidth;
      let editAreaHeight = editArea.clientHeight;
      //   let topRuler = el.querySelector(".editor-ruler-top");
      let rulerTopContent = this.generateRuler(editAreaWidth);
      this.topRulerHtml = rulerTopContent;

      let rulerLeftContent = this.generateRuler(editAreaHeight);
      this.leftRulerHtml = rulerLeftContent;
      // console.log(rulerTopContent);
      let leftRuler = el.querySelector(".editor-ruler-left");
      leftRuler.style.width = `${editAreaHeight}px`;
    },
    getTickSizeByZoom(zoom) {
      //default 10
      let tickSize = 10;
      if (zoom >= 1.8) {
        tickSize = 5;
      } else if (zoom > 0.8) {
        tickSize = 10;
      } else if (zoom > 0.5) {
        tickSize = 40;
      } else if (zoom > 0.3) {
        tickSize = 100;
      } else {
        tickSize = 100;
      }
      return tickSize;
    },
    generateRuler(length, isLeft) {
      let zoom = this.scale;
      let tickSize = this.getTickSizeByZoom(zoom);
      let tickCount = Math.floor(length / tickSize);
      let rulerHtml = "";
      for (let start = 0; start < tickCount; start++) {
        let subTick = this.createRulerTick(
          start,
          start % 5 === 0,
          isLeft,
          tickSize
        );
        // console.log(subTick, start);
        rulerHtml += subTick;
      }
      return rulerHtml;
    },
    createRulerTick(tick, withDigital, isLeft, tickSize) {
      let zoom = this.scale;
      let tickInner = `<div class="ruler-subtick-small"></div>`;
      if (withDigital) {
        tickInner = `<div class="ruler-subtick-large"></div><span class="ruler-subtick-digital">${tick *
          tickSize}</span>`;
      }
      return `<div class="ruler-subtick" style="left: ${15 +
        tick * tickSize * zoom}px">${tickInner}</div>`;
    }

    // onZoom(el) {
    //   console.log(el);
    //   let { deltaY } = el;
    //   //最小缩放到0.1
    //   if (this.editorZoom < 0.3 && deltaY > 0) {
    //     return;
    //   }
    //   if (this.editorZoom >= 3 && deltaY < 0) {
    //     return;
    //   }
    //   let scaleDelta = 0.1;
    //   if (deltaY > 0) {
    //     scaleDelta = -0.1;
    //   }
    //   this.editorZoom += scaleDelta;
    //   this.$nextTick(() => {
    //     this.initRuler();
    //   });
    // },
  }
};
</script>
<style lang="css">
.white .editor-ruler-top {
  background: #ffffff;
}
.black .editor-ruler-top {
  background: rgb(36, 37, 42);
}

.white .editor-ruler-left {
  background: #ffffff;
}
.black .editor-ruler-left {
  background: rgb(36, 37, 42);
}

.black .ruler-subtick-digital {
  color: #e9e9e9;
}

.ruler-container {
  left: 0;
  top: 0;
  /* position: absolute; */
  width: 100%;
  height: calc(100%);
}

.editor-ruler-top {
  width: 100%;
  height: 15px;
  position: absolute;
  border-bottom: 1px solid red;
  top: 0;
  left: 0;

  z-index: 2;
}

.editor-ruler-top .editor-ruler-inner {
  padding-left: 15px;
  width: 100%;
}

.ruler-subtick {
  position: absolute;
  height: 100%;
  left: 15px;
}

.ruler-subtick-large {
  width: 1px;
  height: 12px;
  background: red;
  position: absolute;
  left: 0;
  bottom: -1px;
}

.ruler-subtick-digital {
  position: absolute;
  top: -2px;
  left: 2px;
  font-size: 12px;
}

.ruler-subtick-small {
  width: 1px;
  height: 5px;
  background: red;
  position: absolute;
  left: 0;
  bottom: -1px;
}

.editor-ruler-left {
  width: 100%;
  height: 15px;
  position: absolute;
  /* padding-left: 15px; */
  left: 15px;
  top: 0;
  transform: rotate(90deg);
  transform-origin: left top;
  border-top: 1px solid red;
  background: #ffffff;
  z-index: 2;
}

.editor-ruler-left .ruler-subtick-small,
.editor-ruler-left .ruler-subtick-large {
  top: -1px !important;
}

.editor-ruler-left .ruler-subtick-digital {
  top: 2px !important;
}
</style>
