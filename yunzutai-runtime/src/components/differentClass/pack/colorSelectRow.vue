<template>
  <div class="comps cloreRow">
    <div v-for="(item, index) in config.value" :key="index">
      <div class="title">
        <span>{{ item.title }}</span>
        <el-checkbox
          v-show="config.note"
          v-model="config.disabled"
          @change="onChange(null, true)"
          >{{ config.note }}</el-checkbox
        >
      </div>
      <div
        class="bg-reset"
        v-show="config.disabled === undefined || config.disabled"
      >
        <color-picker v-model="item.value" @change="setColor(item, index)" />
      </div>
    </div>
  </div>
</template>

<script>
import { predefineColors } from "./common";
export default {
  props: {
    title: String,
    config: Object,
    onChange: Function
  },
  data() {
    return {
      predefineColors: predefineColors,
      ovalue: JSON.parse(JSON.stringify(this.config.value))
    };
  },
  methods: {
    setColor(item, index) {
      let oItem = this.ovalue[index];
      if (oItem.value === item.value) {
        return;
      }
      console.log(this.config.value);
      // this.config.value = this.color1;
      this.onChange(null, true);
      oItem.value = item.value;
    }
  }
};
</script>
<style lang="less" scoped>
.cloreRow {
  display: flex;
  justify-content: space-between;
}
</style>
