<template>
  <div class="symbolDiv" v-show="showMark" :style="styles"></div>
</template>
<script>
export default {
  data() {
    return {
      showMark: false,
      type: "mark",
      width: 0,
      height: 0,
      left: 0,
      top: 0
    };
  },
  methods: {
    resetStyle() {}
  },
  computed: {
    config() {
      return {
        width: Math.abs(this.width),
        height: Math.abs(this.height),
        left: this.width > 0 ? this.left : this.left + this.width,
        top: this.height > 0 ? this.top : this.top + this.height
      };
    },
    styles() {
      return {
        width: Math.abs(this.width) + "px",
        height: Math.abs(this.height) + "px",
        left: this.width > 0 ? this.left : this.left + this.width + "px",
        top: this.height > 0 ? this.top : this.top + this.height + "px"
      };
    }
  }
};
</script>

<style lang="less" scoped>
.symbolDiv {
  z-index: 3;
  // display: none;
  position: absolute;
  border: 1px dotted #3573c1;
  background: rgba(53, 115, 193, 0.4);
}
</style>
