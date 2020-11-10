<template>
  <div class="energy">
    {{ title }}
    <span class="sub test">subTitle</span>
    <el-input
      v-model="input"
      placeholder="我是element ui的input组件！！！"
    ></el-input>
  </div>
</template>
<script>
export default {
  data() {
    return {
      title: "我是a页面 支持less哦",
      input: ""
    };
  }
};
</script>

<style lang="less" scoped>
.energy {
  height: calc(100%);
  width: calc(100%);
  color: red;
  .sub {
    color: green !important;
    &.test {
      color: yellow;
    }
  }
}
</style>
