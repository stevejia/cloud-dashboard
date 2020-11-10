<template>
  <div>
    <el-tooltip
      class="item"
      effect="dark"
      :content="isFullscreen ? '关闭全屏' : '全屏'"
      placement="bottom"
    >
      <div @click="click" class="screen">
        <span
          :class="[
            'iconfont',
            isFullscreen ? 'iconshuouqiquanping' : 'iconquanping'
          ]"
        ></span>
      </div>
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
      if (screenfull.enabled) {
        this.$message({
          message: "你的浏览器不支持全屏",
          showClose: true,
          type: "warning",
          duration: 3000
        });
        return;
      }
      this.isFullscreen = !screenfull.isFullscreen;
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

<style lang="less" scoped>
.screen {
  margin-right: 30px;
  img {
    height: 20px;
    width: 20px;
  }
  .iconfont {
    font-size: 20px;
  }
}
</style>
