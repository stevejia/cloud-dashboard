<template>
  <div class="comps">
    <div class="title">
      <el-checkbox v-model="config.value" @change="onChanges"></el-checkbox>
      <span>{{ title }}</span>
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
      console.log("做事");
      this.onChange(null, true);
    }
  }
};
</script>
