<template>
  <div class="comps">
    <div class="title">{{ title }}</div>
    <div class="conte">{{ config.value }} x</div>
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
<style lang="less" scoped>
.conte {
  text-align: center;
  font-size: 13px;
  color: #fff;
  width: 70px;
  height: 30px;
  background-color: #23272e;
  border: 1px solid #202c38;
  border-radius: 4px;
  line-height: 28px;
}
</style>
