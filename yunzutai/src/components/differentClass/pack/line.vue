<template>
  <div class="comps">
    <div class="bg"></div>
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
    background-color: hsla(0, 0%, 100%, 0.2);
    width: 100%;
    height: 1px;
    border-radius: 50%;
  }
}
</style>
