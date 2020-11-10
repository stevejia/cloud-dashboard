<template>
  <div class="comps">
    <div class="title">
      <span>背景颜色-开模式</span>
      <el-checkbox
        v-model="openChecked"
        @change="onChanges(true)"
      ></el-checkbox>
      <div>
        <color-picker
          v-model="config.value[1]"
          @change="onChange(null, true)"
        />
      </div>
    </div>
    <div class="title">
      <span>背景颜色-关模式</span>
      <el-checkbox v-model="closeChecked" @change="onChanges()"></el-checkbox>
      <div>
        <color-picker
          v-model="config.value[2]"
          @change="onChange(null, true)"
        />
      </div>
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
  data() {
    return {
      openChecked: true,
      closeChecked: false
    };
  },
  created() {
    this.openChecked = this.config.value[0];
    this.closeChecked = !this.config.value[0];
  },
  methods: {
    onChanges(isOpen) {
      if (isOpen) {
        this.closeChecked = !this.closeChecked;
      } else {
        this.openChecked = !this.openChecked;
      }
      this.config.value[0] = this.openChecked;
      this.onChange(null, true);
    }
  }
};
</script>
<style lang="less" scoped>
.title {
  span {
    margin-right: 10px;
    padding-bottom: 5px;
  }
}
</style>
