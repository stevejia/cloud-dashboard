<template>
  <div class="symbolComp" :style="styles">
    <video
      class="monitor"
      :src="videoSrc"
      controls
      playsinline
      webkit-playsinline
    ></video>
    <div class="mask" v-if="!$store.state.runtime"></div>
  </div>
</template>
<script>
import { initStyle, getBasicConfig } from "../common";
export default {
  props: {
    theme: String
  },
  data() {
    return {
      videoSrc:
        "https://edge.ivideo.sina.com.cn/34263728303.mp4?KID=sina,viask&Expires=1595520000&ssig=CPYZjez0yx&reqid=",
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
      widthHeight: [480, 270],
      position: [0, 0],
      borderWidth: 0,
      borderColor: "#FFFFFF",
      opacity: 100,
      resetStyle: null,
      rotateDeg: 0
    };
  },
  mounted() {
    getBasicConfig.bind(this)();
  },
  methods: {
    initStyle(bool) {
      initStyle(bool, this, styles => {
        this.styles = styles;
      });
    }
  }
};
</script>

<style lang="less" scoped>
.monitor {
  width: 100%;
  height: 100%;
}

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

.mask {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  cursor: not-allowed;
}
</style>
