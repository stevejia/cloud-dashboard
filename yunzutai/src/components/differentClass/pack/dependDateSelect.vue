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
        v-for="item in dateSelectList"
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
      dateSelectList: []
    };
  },
  mounted() {
    this.dateSelectList = this.$drag.getDateSelectList();
  },
  methods: {
    onChanges() {
      this.$drag.dependDateSelect(this.config.oldValue, this.config.value);
      this.config.oldValue = this.config.value;
      this.onChange(null, true);
    }
  }
};
</script>
