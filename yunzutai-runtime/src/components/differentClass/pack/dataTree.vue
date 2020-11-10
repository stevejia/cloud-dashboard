<template>
  <div class="comps">
    <div class="title">{{ title }}</div>
    <el-cascader
      popper-class="rightattr-cascader"
      v-model="config.value"
      :props="props"
      clearable
      @change="onChange(null, true)"
    ></el-cascader>
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
      props: []
    };
  },
  created() {
    let self = this;
    if (!self.config.white) {
      self.config.white = this.white;
      self.config.black = this.black;
    }
    self.props = {
      label: "name",
      lazy: true,
      lazyLoad(node, resolve) {
        let { data, root } = node;
        setTimeout(() => {
          let params = [];
          if (!root && data.childNodes) {
            params = data.childNodes;
          } else {
            params = self.$store.state.deviceList || [];
          }
          const nodes = Array.from(params).map(item => ({
            value: item.id,
            name: item.name,
            disabled: item.disabled,
            leaf: !item.children,
            childNodes: item.children
          }));
          resolve(nodes);
        }, 400);
      }
    };
  }
};
</script>

<style lang="less" scoped>
.comps /deep/ .el-checkbox {
  margin-right: 0;
  width: 33%;
}
</style>
