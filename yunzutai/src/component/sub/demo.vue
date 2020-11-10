<template>
  <div class="symbolComp" :style="styles">
    demo
  </div>
</template>
<script>
export default {
  props: {
    theme: String
  },
  watch: {
    "$store.getters.theme": function() {
      // let theme = this[this.theme];
      this.initStyle(true);
    }
  },
  methods: {
    initStyle(bool) {
      if (!bool) {
        this.$parent.initStyle(
          this.baisicConfig["尺寸"].value,
          this.baisicConfig["位置"].value,
          this.baisicConfig["旋转角度"].value
        );
      }
    }
  },
  data() {
    return {
      styles: {},
      white: {
        color: ""
      },
      black: {
        color: "#FFFFFF"
      },
      highConfig: {},
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
      }
    };
  }
};
</script>
