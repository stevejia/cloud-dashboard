<template>
  <div class="comps">
    <div class="title">{{ title }}</div>
    <el-select
      v-model="config.value"
      clearable
      placeholder="请选择"
      @change="onChanges"
    >
      <el-option
        v-for="item in treeList"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      >
      </el-option>
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
      treeList: []
    };
  },
  mounted() {
    this.treeList = this.$drag.getTreeList();
  },
  methods: {
    onChanges() {
      if (this.config.value) {
        this.$drag.dependTree(this.config.value);
      }
      this.onChange(null, true);
    }
  }
};
</script>
