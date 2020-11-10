<template>
  <div class="tabMenu" :style="wholeStyle">
    <div class="lefts" :style="leftStyle">
      <span
        @mousedown.stop="hideLeft"
        :class="[arrow ? 'el-icon-s-fold' : 'el-icon-s-unfold']"
      ></span>
    </div>
    <div class="rights"></div>
  </div>
</template>
<script>
import { packFont } from '@/util/common.js'
export default {
  props: {
    config: Object,
  },
  data() {
    return {
      fontStyle: {},
      wholeStyle: {},
      leftStyle: {},
      arrow: true,
    }
  },
  methods: {
    initStyle() {
      this.fontStyle = packFont(this.config['字体样式'].value)
      this.wholeStyle = {
        background: this.config['背景色'].value,
        color: this.fontStyle.color,
        borderBottom: `1px solid ${this.config['其他样式'][0]}`,
      }
      this.leftStyle = {
        borderRight: `1px solid ${this.config['其他样式'][0]}`,
      }
    },
    hideLeft() {
      this.$parent.toggLeft()
      this.arrow = this.$parent.$data.mainLeft === 0
    },
  },
}
</script>
<style lang="less" scoped>
.tabMenu {
  background-color: rgb(36, 37, 42);
  color: rgb(183, 192, 205);
  // border-bottom: 1px solid #2b2e37;
  .lefts {
    width: 200px;
    height: calc(100%);
    // border-right: 1px solid #2b2e37;
    display: flex;
    align-items: center;
    span {
      margin-left: 20px;
    }
  }
}
</style>
