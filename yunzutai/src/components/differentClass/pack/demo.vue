<template>
  <div class="comps">
    <el-button type="primary" size="small">主要按钮</el-button>
  </div>
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
