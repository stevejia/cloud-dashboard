<template>
  <div class="comps">
    <div class="title">{{ title }}</div>
    <div class="body">
      <el-slider
        ref="slider"
        v-model="config.value"
        :min="config.range[0]"
        :max="config.range[1]"
        @change="onChange(null, true)"
        @input="onChange"
      ></el-slider>
      <template v-if="config.status === 1">
        <input
          class="compsInput"
          @input="onChanges"
          @change="onChanges"
          v-model="config.value"
          @blur="onChange(null, true)"
          @keyup.enter="onChange(null, true)"
        />
      </template>
      <template v-else>
        <span class="demonstration">{{ config.value + "px" }}</span>
      </template>
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
    onChanges() {
      this.config.value = parseInt(this.config.value || 0);
      this.onChange();
    }
  }
};
</script>
<style lang="less" scoped>
.body {
  paddint-left: 12px;
}
</style>
