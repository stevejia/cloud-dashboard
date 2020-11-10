<template>
  <div class="comps">
    <div class="title">{{ title }}</div>
    <el-checkbox-group
      v-model="config.value"
      :min="2"
      @change="onChange(null, true)"
    >
      <el-checkbox
        v-for="(item, index) in checkboxArr"
        :key="index"
        :label="item"
      ></el-checkbox>
    </el-checkbox-group>
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
      checkboxArr: ["小时", "日", "周", "月", "季度", "年"]
    };
  }
};
</script>

<style lang="less" scoped>
.title {
  margin-bottom: 10px;
  width: 100%;
  height: 23px;
  line-height: 28px;
  text-align: center;
  background: #1d87e5;
}
.comps /deep/ .el-checkbox {
  margin-right: 0;
  width: 33%;
}
</style>
