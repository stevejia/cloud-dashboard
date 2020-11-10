<template>
  <div class="flowpipe">
    <canvas id="test" class="fp-canvas"></canvas>
  </div>
</template>
<script>
import Createline from "@/util/flowPipe.js";
export default {
  data() {
    return {
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
        }
      },
      highConfig: {}
    };
  },
  mounted() {},
  methods: {
    initStyle(bool) {
      console.log(bool);
      this.renderPipe();
    },
    resetComp() {
      this.renderPipe();
    },
    renderPipe() {
      if (!this.flow) {
        let el = this.$el.querySelector(".fp-canvas");
        this.flow = Createline(el);
      }
      let { width, height } = this.$el.getBoundingClientRect();
      console.log(height);
      var data = {
        time: 140, //运动速度
        mx: 0, //起点位置
        my: 6,
        ly: 6,
        canvas_w: width,
        canvas_h: 10,
        color: "#a84a0a", //颜色
        vx: 4,
        vy: 0,
        line_w: 4,
        fx: "w",
        width: 20, //线长
        jiange: 8 //间隔
      };
      this.flow.render(data);
    }
  }
};
</script>
<style scoped>
.flowpipe {
  background: url(/static/img/flowPipe/shuiguan_w.svg);
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
