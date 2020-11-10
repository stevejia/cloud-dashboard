<template>
  <!-- 组件内容不细说，该有的都有，该有的样式变化要有变化 -->
  <div class="symbolComp">没有该实例</div>
</template>
<script>
//必要---保持一致：配置转换器，命名规范：test.vue test.js
import mixin from "@/component/mixin.js";
export default {
  mixins: [mixin],
  methods: {
    init() {
      console.log("init");
    },
    resetComp(bool) {
      console.log(bool);
    },
    initStyle(bool) {
      this.startInitStyle();

      this.endInitStyle(bool);
    }
  },
  data() {
    return {
      white: {},
      black: {},
      baisicConfig: {
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
        旋转角度: {
          type: "slider",
          status: 1,
          range: [0, 360],
          value: 0
        }
      }
    };
  }
};
</script>

<style lang="less" scoped>
.symbolComp {
  background: black;
  width: calc(100%);
  height: calc(100%);
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  white-space: pre;
  overflow: hidden;
}
</style>
