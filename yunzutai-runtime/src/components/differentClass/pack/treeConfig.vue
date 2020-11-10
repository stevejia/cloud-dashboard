<template>
  <div class="comps">
    <div class="title">{{ config.currentItem || "请先选择子项" }}</div>
    <div class="title">数据源</div>
    <el-cascader
      :disabled="config.currentItem === ''"
      popper-class="rightattr-cascader"
      v-model="config.pointIds"
      :props="props"
      @change="onChange(null, true)"
      clearable
    ></el-cascader>
    <div class="title">数据类型</div>
    <el-select
      :disabled="config.currentItem === ''"
      v-model="config.statisticsType"
      placeholder="请选择"
      @change="onChange(null, true)"
    >
      <el-option
        v-for="item in dataType"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      ></el-option>
    </el-select>
  </div>
</template>

<script>
import { dataType } from "./common";
export default {
  props: {
    title: String,
    config: Object,
    onChange: Function
  },
  data() {
    return {
      props: [],
      dataType: dataType
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
