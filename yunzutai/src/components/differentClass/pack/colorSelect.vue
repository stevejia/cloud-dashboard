<template>
  <div class="comps">
    <div class="title">
      <span>{{ title }}</span>
      <el-checkbox
        v-show="config.note"
        v-model="config.disabled"
        @change="onChange"
        >{{ config.note }}</el-checkbox
      >
    </div>
    <div
      class="bg-reset"
      v-show="config.disabled === undefined || config.disabled"
    >
      <color-picker
        v-model="color1"
        @change="setColor"
        @active-change="activeChange"
      />
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
      color1: this.config.value,
      originColor: this.config.value,
      predefineColors: predefineColors
    };
  },
  watch: {
    "config.value"(newVal) {
      this.color1 = newVal;
    }
  },
  methods: {
    setColor(color) {
      if (color === this.originColor) {
        return;
      }
      this.config.value = this.color1;
      this.onChange(null, true);
      this.originColor = color;
    },
    activeChange(color) {
      this.config.value = color;
      this.onChange();
    }
  }
};
</script>
