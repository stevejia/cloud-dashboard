<template>
  <div class="comps">
    <div class="titles">{{ title }}</div>
    <el-checkbox-group
      class="checkbox"
      @change="onCheckChange"
      v-model="config.value"
    >
      <template v-for="(item, index) in config.label">
        <el-checkbox
          class="checkItem"
          :label="item"
          :key="index"
          v-if="index < 4"
          >{{ item }}</el-checkbox
        >
      </template>
    </el-checkbox-group>
    <packLine v-if="false"></packLine>
  </div>
</template>

<script>
import packLine from "./line.vue";
export default {
  props: {
    title: String,
    config: Object,
    onChange: Function
  },
  components: {
    packLine
  },
  methods: {
    onCheckChange() {
      let item = this.config.label[3];
      this.config.label.splice(0, 0, item);
      this.config.label.pop();
      this.config.value = this.config.label.slice(0, 3);
      this.onChange(null, true);
    }
  }
};
</script>

<style lang="less" scoped>
.titles {
  width: 100%;
  height: 28px;
  line-height: 28px;
  background: #1d87e5;
  border-radius: 2px;
  text-align: center;
}
.checkbox {
  width: 100%;
  margin-top: 10px;
  .checkItem {
    height: 30px;
    width: 100%;
    display: block;
    margin-left: 20px;
    margin-bottom: 10px;
    line-height: 30px;
  }
}
</style>
