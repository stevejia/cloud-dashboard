<template>
  <div>
    <div class="title">{{ title }}</div>
    <el-select
      class="page_select"
      v-model="config.value"
      placeholder="请选择"
      @change="onChange(title, true)"
      clearable
      :popper-append-to-body="false"
    >
      <el-option
        v-for="item in labels"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      ></el-option>
    </el-select>
  </div>
</template>
<script>
export default {
  props: {
    title: String,
    config: Object,
    onChange: Function
  },
  data() {
    return {
      labels: []
    };
  },
  created() {
    if (this.title === "点位组关联") {
      this.labels = (() => {
        if (!this.$store) return [];
        return this.$store.getters.pointGroup.map(item => {
          return {
            label: item.name,
            value: item.id
          };
        });
      })();
    } else {
      this.labels = this.config.label;
    }
  }
};
</script>
<style lang="less" scoped>
.page_select {
  width: 100%;
}
</style>
