<template>
  <div class="comps">
    <div class="bodys">
      <div class="select">
        <el-checkbox
          v-model="config.value.writeable"
          @change="onChange(null, true)"
          >可写入</el-checkbox
        >
        <el-checkbox
          v-model="config.value.passwordStatus"
          v-if="config.value.writeable"
          @change="onChange(null, true)"
          >启用密码</el-checkbox
        >
      </div>
      <el-select
        style="margin-top:15px"
        v-show="config.value.passwordStatus"
        v-model="config.value.role"
        placeholder="请选择"
        clearable
        @change="onChange(null, true)"
      >
        <el-option
          v-for="item in options"
          :key="item.id"
          :label="item.label"
          :value="item.id"
        ></el-option>
      </el-select>
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
      options: this.$store.state.authorityList
    };
  }
};
</script>
<style lang="less" scoped>
.select {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.bodys {
  margin-top: 5px;
  .divFlex {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
  }
  .add,
  .delete {
    width: 40px;
    font-size: 40px;
    text-align: center;
  }
  & /deep/ .el-color-picker {
    margin-right: 10px;
  }
  .line {
    background: #ddd;
    width: 6px;
    height: 2px;
    margin: 0 3px;
  }
  input {
    width: 67px;
    height: 30px;
    padding: 0;
    box-sizing: border-box;
  }
}
</style>
