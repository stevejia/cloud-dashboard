<template>
  <div>
    <div class="title">{{ title }}</div>
    <div class="input-wrapper">
      <div class="flex-item">
        <el-input
          v-model="config.value[0]"
          type="number"
          @input="change(0)"
          @change="change(0)"
          @blur="change(0, true)"
          @keyup.enter.native="change(0, true)"
        ></el-input>
        <span class="unit" v-if="config.unit">{{ config.unit[0] }}</span>
      </div>
      <span class="gap" :style="config.gapStyle">{{ config.gap || "--" }}</span>
      <div class="flex-item">
        <el-input
          v-model="config.value[1]"
          type="number"
          @input="change(1)"
          @change="change(1)"
          @blur="change(0, true)"
          @keyup.enter.native="change(0, true)"
        ></el-input>
        <span class="unit" v-if="config.unit">{{ config.unit[1] }}</span>
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
  methods: {
    change(index, finalChange) {
      let max = this.config.limit && this.config.limit[1];
      let min = this.config.limit && this.config.limit[0];
      let val = this.config.value[index];
      if (typeof max == "number" && typeof min == "number") {
        if (val < min) {
          this.config.value[index] = min;
        } else if (val > max) {
          this.config.value[index] = max;
        }
        if (val == "") {
          this.config.value[index] = this.config.limit[index];
        }
      } else if (val == "") {
        this.config.value[index] = 0;
      }
      this.onChange(null, finalChange);
    }
  }
};
</script>
<style lang="less" scoped>
.input-wrapper {
  display: flex;
  align-items: center;
  .gap {
    flex: 0 0 8px;
    text-align: center;
  }
  .flex-item {
    display: flex;
    align-items: center;
    .unit {
      padding-left: 2px;
    }
  }
}
</style>
