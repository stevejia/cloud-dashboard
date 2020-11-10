<template>
  <div class="comps">
    <div class="title">{{ title }}</div>
    <div class="body">
      <el-slider
        :disabled="config.value[1]"
        ref="slider"
        v-model="config.value[0]"
        @change="onChange(null, true)"
        @input="deal"
      ></el-slider>
      <span class="demonstration">{{ config.value[0] + "%" }}</span>
    </div>
    <el-checkbox
      v-model="config.value[1]"
      @change="onChange(null, true)"
    ></el-checkbox>
    <span style="margin-left:10px">{{ config.note }}</span>
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
    deal() {
      this.onChange();
    }
  }
};
</script>
