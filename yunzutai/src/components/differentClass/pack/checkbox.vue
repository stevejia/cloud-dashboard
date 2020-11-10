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
      if (this.title === "菜单折叠") {
        (bool => {
          this.$drag.$left.$refs.routes.initRoutes(bool);
        })(this.config.value);
      }
      if (this.title === "隐藏顶部导航") {
        this.onChange("隐藏顶部导航", true);
      } else {
        this.onChange(null, true);
      }
    }
  }
};
</script>
