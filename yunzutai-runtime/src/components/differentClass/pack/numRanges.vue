<template>
  <div>
    <div class="title">{{ title }}</div>
    <div
      class="input-wrapper"
      v-for="(item, index) in config.values"
      :key="index"
    >
      <el-input
        v-model="item[0]"
        placeholder="最小值"
        type="number"
        @input="onChange"
        @change="onChange"
        @blur="onChange(null, true)"
        @keyup.enter.native="onChange(null, true)"
      ></el-input>
      <span class="gap">-</span>
      <el-input
        v-model="item[1]"
        placeholder="最大值"
        type="number"
        @input="onChange"
        @change="onChange"
        @blur="onChange(null, true)"
        @keyup.enter.native="onChange(null, true)"
      ></el-input>
      <div class="delete-icon-container">
        <i
          class="el-icon-delete delete-icon"
          v-show="index !== 0"
          @click="deleteRange(index)"
        ></i>
      </div>

      <i class="el-icon-plus add-icon" @click="addRange"></i>
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
    addRange() {
      this.config.values.push([null, null]);
      this.onChange(null, true);
    },
    deleteRange(index) {
      this.config.values = this.config.values.filter((cv, idx) => {
        return cv && idx !== index;
      });
      this.onChange(null, true);
    }
  }
};
</script>
<style lang="less" scoped>
.input-wrapper {
  margin-top: 10px;
  display: flex;
  position: relative;
  align-items: center;
  .gap {
    padding: 0 12px;
  }
  .add-icon {
    position: absolute;
    font-size: 16px;
    right: -10px;
    color: #409eff;
    cursor: pointer;
  }

  .delete-icon-container {
    box-sizing: border-box;
    margin: 0 12px 0 6px;
    min-width: 16px;
    height: 16px;
  }

  .delete-icon {
    font-size: 16px;
    color: #f56c6c;
    cursor: pointer;
  }
}
</style>
