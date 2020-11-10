<template>
  <div class="tree" :style="{ fontSize: fontSize + 'px', color: color }">
    <treeItem
      ref="tree"
      :fontSize="fontSize"
      :treeData="treeData"
      :selectColor="selectColor"
      :color="color"
    ></treeItem>
    <div class="tree-footer">
      <i
        title="展开"
        @click.stop="toExpanded"
        style="margin-right: 5px;"
        class=" icon el-icon-s-grid"
      ></i>
      <i title="折叠" @click.stop="toUnExpanded" class=" icon el-icon-menu"></i>
    </div>
  </div>
</template>

<script>
import treeItem from "./treeItem.vue";
export default {
  components: {
    treeItem
  },
  props: {
    treeData: Array,
    fontSize: Number,
    selectColor: String,
    color: String
  },
  mounted() {
    this.initStyle();
  },
  methods: {
    toExpanded() {
      this.deal(this.$parent.treeData, true);
    },
    toUnExpanded() {
      this.deal(this.$parent.treeData, false);
    },
    deal(arr, bool) {
      arr.forEach(item => {
        if (item.expanded === !bool) {
          item.expanded = bool;
        }
        if (item.chilren) {
          this.deal(item.chilren, bool);
        }
      });
    },
    initStyle() {
      this.$refs.tree.initStyle();
    }
  },
  watch: {
    fontSize() {
      this.initStyle();
    }
  }
};
</script>
<style lang="less" scoped>
.tree {
  padding: 10px 0;
  position: relative;
  height: calc(100%);
  width: calc(100%);
  box-sizing: border-box;
  .tree-footer {
    position: absolute;
    bottom: 8px;
    right: 8px;
    .icon {
      padding: 2px;
      cursor: pointer;
    }
  }
}
</style>
