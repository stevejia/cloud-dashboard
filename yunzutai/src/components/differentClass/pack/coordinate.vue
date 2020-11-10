<template>
  <div>
    <div class="title">{{ title }}</div>
    <el-select
      v-model="config.value"
      placeholder="请选择"
      @change="onChange(null, true)"
    >
      <el-option
        v-for="item in config.label"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      ></el-option>
    </el-select>
    <div
      class="box"
      v-show="config.value === 0"
      v-for="(item, index) in config.options"
      :key="index"
    >
      <div class="box_child" v-for="(items, indexs) in item" :key="indexs">
        <div class="title">{{ items.title }}</div>
        <el-input
          v-model.number="items.value"
          :type="indexs != 2 ? 'number' : 'text'"
          placeholder="请输入内容"
          @input="onChange"
          @change="onChange"
          @blur="onChange(null, true)"
          @keyup.enter.native="onChange(null, true)"
        ></el-input>
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
  }
};
</script>
<style lang="less" scoped>
.box {
  display: flex;
  justify-content: space-between;
  margin-top: 6px;
  .box_child {
    width: 30%;
    text-align: center;
    .title {
      font-size: 12px;
    }
  }
}
</style>
