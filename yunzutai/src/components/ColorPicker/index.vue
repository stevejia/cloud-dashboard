<template>
  <el-color-picker
    :value="value"
    show-alpha
    @change="handleChange"
    @active-change="handleActiveChange"
    @toggle-panel="handleToggle"
  ></el-color-picker>
</template>

<script>
import ElColorPicker from "./color-picker";

export default {
  components: { ElColorPicker },
  model: {
    prop: "value", // 默认是value
    event: "change" // 默认是input
  },
  props: {
    value: String // v-model 默认会穿过来一个 value --> model
  },
  data() {
    return {
      defColor: ""
    };
  },
  methods: {
    handleChange(v) {
      //值变化
      this.$emit("change", v);
    },
    handleActiveChange(v) {
      this.$emit("active-change", v);
    },
    handleToggle(v) {
      // 开启/关闭面板
      if (v) {
        // 记录默认值
        this.defColor = this.value;
      } else {
        this.$emit("change", this.defColor);
      }
    }
  }
};
</script>
