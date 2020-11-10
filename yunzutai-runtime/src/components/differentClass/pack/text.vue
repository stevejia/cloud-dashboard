<template>
  <span class="comps">
    {{ config.value }}
  </span>
</template>

<script>
export default {
  props: {
    title: String,
    config: Object,
    onChange: Function
  }
};
</script>
<style lang="less" scoped>
.comps {
  position: relative;
}
</style>
