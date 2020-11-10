<template>
  <div class="comps">
    <div class="title">
      <el-checkbox
        v-model="config.used"
        @change="onChange(null, true)"
      ></el-checkbox>
      <span>{{ title }}</span>
    </div>
    <div v-show="config.used">
      <div>
        <color-picker v-model="color1" @change="setColor" />
      </div>
      <div class="titles">
        <span>渐变角度</span>
      </div>
      <div class="body">
        <el-slider
          v-model="config.value[1]"
          :min="config.range[0]"
          :max="config.range[1]"
          @change="onChange(null, true)"
          @input="onChange"
          :show-input="config.status === 1"
        ></el-slider>
      </div>
    </div>
  </div>
</template>

<script>
import { predefineColors } from "./common";
export default {
  props: {
    title: String,
    config: Object,
    onChange: Function
  },
  data() {
    return {
      color1: "",
      predefineColors: predefineColors
    };
  },
  created() {
    this.$watch(
      function() {
        return this.config.value;
      },
      function(newVal) {
        if (this.color1 !== newVal[0]) {
          this.color1 = newVal[0];
        }
      }
    );
  },
  // watch: {
  //   "config.value[0]"(value) {
  //     this.color1 = value;
  //   }
  // },
  methods: {
    setColor() {
      this.config.value[0] = this.color1;
      this.onChange(null, true);
    }
  }
};
</script>
<style lang="less" scoped>
.titles {
  margin-top: 10px;
}
</style>
