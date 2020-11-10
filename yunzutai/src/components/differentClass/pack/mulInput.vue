<template>
  <div class="mulInput">
    <div>{{ config.title }}</div>
    <div class="input-wrapper">
      <div v-for="(item, index) in config.value" :key="index">
        <div class="title">{{ item.name }}</div>
        <div
          v-if="item.inputType == 'colorShow'"
          class="color-block"
          :style="{ background: item.value }"
        ></div>
        <el-input
          v-else-if="item.inputType == 'stateLinkage'"
          v-model="item.value"
          @input="changes"
          @blur="changes(null, true)"
          @keyup.enter.native="changes(null, true)"
          :disabled="index == 1 && config.value[0].value == 0"
          oninput="this.value=this.value.replace(/[^\d]/g,'')"
        ></el-input>
        <el-input
          v-else
          v-model="item.value"
          @input="onChange"
          @change="onChange"
          @blur="onChange(null, true)"
          @keyup.enter.native="onChange(null, true)"
          :type="item.inputType || 'text'"
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
  },
  methods: {
    changes(order, finalChange) {
      if (this.config.value[0].value == 0) {
        this.config.value[1].value = "非0";
      } else if (
        this.config.value[0].value != 0 &&
        this.config.value[1].value == "非0"
      ) {
        this.config.value[1].value = 0;
      }
      this.onChange(null, finalChange);
    }
  }
};
</script>
<style lang="less" scoped>
.mulInput .input-wrapper {
  display: flex;
  justify-content: space-around;
  text-align: center;
  .color-block {
    height: 28px;
    width: 100%;
    border: 1px solid #999;
    box-sizing: border-box;
  }
  > div {
    padding: 0 5px;
  }
  .el-input.is-disabled /deep/ input {
    color: #282828;
    background: #d3d3d3;
  }
  /deep/ .el-input__inner {
    padding: 0 8px;
  }
}
</style>
