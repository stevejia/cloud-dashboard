<template>
  <div>
    <el-tooltip
      class="item"
      effect="dark"
      :content="isFullscreen ? '关闭全屏' : '全屏'"
      placement="bottom"
    >
      <i
        :class="isFullscreen ? 'el-icon-full-screen' : 'el-icon-full-screen'"
        @click="click"
      >
      </i>
      <!-- <span
        :class="[
          'iconfont',
          isFullscreen ? 'iconshuouqiquanping' : 'iconquanping'
        ]"
        @click="click"
      ></span> -->
    </el-tooltip>
  </div>
</template>

<script>
import screenfull from "screenfull";
export default {
  name: "Screenfull",
  data() {
    return {
      isFullscreen: false
    };
  },
  mounted() {
    this.init();
  },
  beforeDestroy() {
    this.destroy();
  },
  methods: {
    click() {
      // if (!screenfull.enabled) {
      //   this.$message({
      //     message: "你的浏览器不支持全屏",
      //     showClose: true,
      //     type: "warning",
      //     duration: 3000
      //   });
      //   return;
      // }
      screenfull.toggle();
    },
    change() {
      this.isFullscreen = screenfull.isFullscreen;
    },
    init() {
      if (screenfull.enabled) {
        screenfull.on("change", this.change);
      }
    },
    destroy() {
      if (screenfull.enabled) {
        screenfull.off("change", this.change);
      }
    }
  }
};
</script>

<style scoped>
.screenfull-svg {
  display: inline-block;
  cursor: pointer;
  fill: #5a5e66;
  width: 20px;
  height: 20px;
  vertical-align: 10px;
}
</style>
