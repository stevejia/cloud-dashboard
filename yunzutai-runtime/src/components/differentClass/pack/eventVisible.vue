<template>
  <div class="comps">
    <div class="title">{{ title }}</div>
    <el-cascader
      popper-class="rightattr-cascader"
      v-model="config.value.pointId"
      :props="props"
      clearable
      @change="onChange(null, true)"
    ></el-cascader>
    <el-select
      style="margin-top:10px;"
      v-model="config.value.rule"
      placeholder="请选择"
      clearable
      @change="onChange(null, true)"
    >
      <el-option
        v-for="item in optionVisible"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      ></el-option>
    </el-select>
  </div>
</template>

<script>
import { eventVisible } from "./common";
export default {
  props: {
    title: String,
    config: Object,
    onChange: Function
  },
  data() {
    return {
      props: [],
      optionVisible: eventVisible
    };
  },
  created() {
    let self = this;
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
