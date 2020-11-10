<template>
  <div class="comps">
    <div class="row">
      <el-button type="primary" size="small" @click="change(1)"
        >水平翻转</el-button
      >
      <el-button type="primary" size="small" @click="change(0)"
        >垂直翻转</el-button
      >
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
    change(index) {
      let val = this.config.value[index];
      if (val === 0) {
        this.config.value[index] = 180;
      } else {
        this.config.value[index] = 0;
      }
      this.onChange(null, true);
    }
  }
};
</script>
<style lang="less" scoped>
.row {
  justify-content: space-between;
}
</style>
