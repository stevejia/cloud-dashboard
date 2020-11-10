<template>
  <div>
    <div class="title">{{ title }}</div>
    <el-input
      style="width:calc(70%);"
      :disabled="config.status"
      v-model="config.value"
      placeholder="请输入内容"
      type="number"
      @input="onChanges"
      @change="onChanges"
      @blur="onChanges(null, true)"
      @keyup.enter.native="onChanges(null, true)"
    ></el-input>
    <template v-if="!config.range">
      <el-checkbox
        v-model="config.status"
        @change="onChanges(null, true)"
      ></el-checkbox>
      <span class="title">自动</span>
    </template>
    <template v-else>
      <span class="title">%</span>
    </template>
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
    onChanges(order, finalChange) {
      if (this.config.range) {
        let [min, max] = this.config.range;
        if (this.config.value > max) {
          this.config.value = max;
        } else if (this.config.value < min) {
          this.config.value = min;
        }
      }
      this.onChange(this.title, finalChange);
    }
  }
};
</script>
