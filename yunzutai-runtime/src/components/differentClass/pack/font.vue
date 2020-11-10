<template>
  <div class="comps">
    <div class="title">
      <span>{{ title }}</span>
    </div>
    <div class="body" style="margin-top:10px;">
      <div class="rows" :style="{ background: color1 }">
        <span>A</span>
        <div class="text-color">
          <color-picker v-model="color1" @change="setColor" />
        </div>
      </div>
      <div
        class="rows"
        @mousedown.stop="change(1)"
        :style="{ 'font-weight': fontWeight }"
      >
        <span>B</span>
      </div>
      <div
        class="rows"
        @mousedown.stop="change(2)"
        :style="{ 'font-style': fontStyle }"
      >
        <span>T</span>
      </div>
      <div
        class="rows"
        @mousedown.stop="change(3)"
        :style="{ 'text-decoration': textDecoration }"
      >
        <span>U</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: String,
    config: Object,
    onChange: Function
  },
  data() {
    return {
      color1: this.config.value[0],
      ocolor1: this.config.value[0],
      fontStyle: this.config.value[2],
      fontWeight: this.config.value[1],
      textDecoration: this.config.value[3]
    };
  },
  watch: {
    "config.value"(newVal) {
      this.fontStyle = newVal[2];
      this.fontWeight = newVal[1];
      this.textDecoration = newVal[3];
      this.color1 = newVal[0];
    }
  },
  methods: {
    setColor() {
      this.config.value[0] = this.color1;
      this.ids = Math.random();
      if (this.ocolor1 === this.color1) {
        return;
      }
      this.onChange(null, true);
      this.ocolor1 = this.color1;
    },
    change(type) {
      let val = null;
      switch (type) {
        case 1:
          // eslint-disable-next-line no-case-declarations
          val = this.config.value[1];
          this.config.value[1] = val === "normal" ? "bold" : "normal";
          this.fontWeight = this.config.value[1];
          break;
        case 2:
          // eslint-disable-next-line no-case-declarations
          val = this.config.value[2];
          this.config.value[2] = val === "" ? "oblique" : "";
          this.fontStyle = this.config.value[2];
          break;
        case 3:
          // eslint-disable-next-line no-case-declarations
          val = this.config.value[3];
          this.config.value[3] = val === "" ? "underline" : "";
          this.textDecoration = this.config.value[3];
          break;
        default:
          break;
      }
      this.$nextTick(() => {
        this.onChange(null, true);
      });
      this.ids = Math.random();
    }
  }
};
</script>

<style lang="less" scoped>
.body {
  height: 28px;
  line-height: 28px;
  background: white;
  color: #282828;
  border-radius: 4px;
  .rows {
    height: calc(100%);
    position: relative;
    width: 25%;
    text-align: center;
    cursor: pointer;
    box-sizing: border-box;
    position: relative;
    .text-color {
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      opacity: 0;
    }
    select {
      border-radius: 4px;
      width: calc(100%);
      height: 26px;
      border: none;
      font-size: 12px;
    }
    span {
      font-size: 20px;
    }
  }
  .rows + .rows {
    &::before {
      content: "";
      position: absolute;
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
      top: 2px;
      left: 0.5px;
      height: 24px;
      width: 1px;
      background: #cccccc;
    }
  }
}
</style>
