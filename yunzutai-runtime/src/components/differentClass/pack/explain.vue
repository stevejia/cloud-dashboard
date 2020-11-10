<template>
  <div class="comps">
    <div class="bg"></div>
    <span class="text">{{ title }}</span>
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
.comps {
  position: relative;
  height: 26px;
  display: flex;
  justify-content: center;
  align-items: center;
  .bg {
    background-color: #0064ff;
    width: 100%;
    height: 1px;
    border-radius: 50%;
  }
  .text {
    position: absolute;
    background-color: #373e4a;
    padding: 0 8px;
  }
}
</style>
