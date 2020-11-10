<template>
  <div class="comps">
    <div class="title">{{ title }}</div>
    <el-input
      type="textarea"
      :autosize="{ minRows: 2, maxRows: 4 }"
      placeholder="请输入文本内容"
      @input="onChange"
      @change="onChange"
      @blur="onChange(null, true)"
      @keyup.enter="onChange(null, true)"
      v-model="config.value"
    />
    <div class="btn" v-if="config.status === 1">
      <button @mousedown.stop="onChange" class="confirm">刷新</button>
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
.comps {
  position: relative;
  .btn {
    display: flex;
    justify-content: flex-end;
    margin-top: 5px;
    .confirm {
      height: 20px;
      width: 40px;
      background: #3573c1;
      color: #fff;
      border: 0;
      cursor: pointer;
      margin-right: 5px;
    }
  }
}
.comps /deep/ .el-textarea__inner {
  background-color: #fff;
  color: #383838;
  border: 1px solid #23272e;
  background-color: #fff;
  color: #383838;
  border: 1px solid #23272e;
  font-size: 12px;
}
</style>
