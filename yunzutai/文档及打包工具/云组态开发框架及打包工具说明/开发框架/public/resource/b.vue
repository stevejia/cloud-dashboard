<template>
  <div class="energy">{{ title }}</div>
</template>

<script lang="babel">
import b2 from "vue"
console.log(b2);
export default {
  data() {
    return {
      title: "我是b页面 支持css哦"
    };
  }
};
</script>

<style lang="css" scoped>
.energy {
  height: calc(100%);
  width: calc(100%);
  color: red;
}
</style>
