<template>
  <div class="comps">
    <div class="title">{{ title }}</div>
    <div class="item-wrapper">
      <el-checkbox v-model="config.value.iconStatus"></el-checkbox>
    </div>
    <div class="bodys" v-show="config.value.iconStatus">
      <div class="title">选择小图标</div>
      <el-select
        class="item-wrapper"
        v-model="config.value.iconUrl"
        placeholder="请选择"
      >
        <el-option
          v-for="item in options"
          :key="item.id"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <div class="title">图标颜色</div>
      <color-picker v-model="config.value.color" @change="onChange" />
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    title: String,
    config: Object,
    onChange: Function
  },
  data() {
    return {
      options: [
        {
          id: 1,
          label: "电表",
          value: "/static/img/sub/title/electric.svg"
        },
        {
          id: 2,
          label: "水表",
          value: "/static/img/sub/title/water.svg"
        },
        {
          id: 3,
          label: "概述",
          value: "/static/img/sub/title/summary.svg"
        },
        {
          id: 4,
          label: "节能",
          value: "/static/img/sub/title/save_energy.svg"
        },
        {
          id: 5,
          label: "展示",
          value: "/static/img/sub/title/show.svg"
        },
        {
          id: 6,
          label: "告警",
          value: "/static/img/sub/title/warning.svg"
        }
      ], // this.$store.state.authorityList,
      props: [] //this.$store.state.deviceList,
    };
  }
};
</script>
<style lang="less" scoped>
.item-wrapper {
  margin-bottom: 10px;
}
</style>
