<template>
  <ul @contextmenu.prevent.stop="">
    <li
      v-for="item in treeData"
      :key="item.name"
      @click.stop="selectItem(item, true)"
      @contextmenu.prevent.stop="$drag.showTreeContextMenu(item, parentItem)"
    >
      <div
        class="tree-item tree-floder"
        v-if="item.type === 'floder'"
        :style="{
          height: itemHeight,
          color: item.selected ? selectColor : '',
          paddingLeft: itemPaddingLeft
        }"
      >
        <i
          :class="
            item.expanded
              ? 'cursors el-icon-caret-right expanded'
              : 'cursors el-icon-caret-right'
          "
          :style="{ padding: iconPadding }"
          @click.stop="item.expanded = !item.expanded"
        ></i>
        <i
          :class="
            item.selected
              ? 'cursors el-icon-folder-checked'
              : 'cursors el-icon-folder'
          "
        ></i>
        <label class="cursors" :style="{ paddingLeft: iconPadding }">{{
          item.name
        }}</label>
      </div>
      <div
        class="tree-item tree-file"
        v-else
        :style="{
          height: itemHeight,
          color: item.selected ? selectColor : '',
          paddingLeft: itemPaddingLeft
        }"
      >
        <i
          class="cursors el-icon-caret-right iconNone"
          :style="{ padding: iconPadding }"
        ></i>
        <div
          class="cursors checkbox"
          :style="{
            width: checkboxWidth,
            height: checkboxWidth,
            fontSize: checkboxSize
          }"
        >
          <label :class="item.selected ? 'check-label' : 'check-label hide'">
            <i class="el-icon-check"></i>
          </label>
        </div>
        <label class="cursors" :style="{ paddingLeft: iconPadding }">{{
          item.name
        }}</label>
      </div>
      <transition name="fade">
        <div class="treeHeight" v-if="item.children" v-show="item.expanded">
          <treeItem
            ref="tree"
            :treeData="item.children"
            :fontSize="fontSize"
            :selectColor="selectColor"
            :parentItem="item"
            :layer="layer + 1"
            :color="color"
          ></treeItem>
        </div>
      </transition>
    </li>
  </ul>
</template>

<script>
export default {
  name: "treeItem",
  props: {
    treeData: Array,
    fontSize: Number,
    selectColor: String,
    color: String,
    parentItem: Object,
    layer: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      type: "tree",
      itemHeight: "32px",
      itemPaddingLeft: "24px",
      iconPadding: "8px",
      checkboxWidth: "14px",
      checkboxSize: "12px"
    };
  },
  created() {
    this.initStyle();
  },
  methods: {
    selectItem(item, status, selected) {
      selected = selected !== undefined ? selected : !item.selected;
      item.selected = selected;
      if (status) {
        if (item.type === "file" && !this.$store.state.runtime) {
          let config = this.$drag.vms.$refs.comp.highConfig["树形图"];
          this.$drag.vms.$refs.comp.currentItem = null;
          this.$nextTick(() => {
            this.$drag.vms.$refs.comp.currentItem = item;
            config.currentItem = this.parentItem
              ? this.parentItem.name + " " + item.name
              : item.name;
            config.pointIds = item.linkData.pointIds;
            config.statisticsType = item.linkData.statisticsType;
          });
        }
        if (item.children) {
          this.selectAfterItem(item.children, selected);
        }
      }
      this.selectPreItem();
    },
    selectPreItem() {
      if (!this.parentItem) return;
      let selected = this.treeData.some(item => {
        return item.selected;
      });
      this.$parent.selectItem(this.parentItem, false, selected);
    },
    selectAfterItem(child, bool) {
      child.forEach(item => {
        item.selected = bool;
        if (item.children) {
          this.selectAfterItem(item.children, bool);
        }
      });
    },
    initStyle() {
      this.itemPaddingLeft =
        (((this.fontSize * 3) / 2) * this.layer).toFixed(1) + "px";
      this.itemHeight = this.fontSize * 2 + "px";
      this.iconPadding = this.fontSize / 2 + "px";
      this.checkboxWidth = ((this.fontSize * 7) / 8).toFixed(1) + "px";
      this.checkboxSize = ((this.fontSize * 3) / 4).toFixed(1) + "px";
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
.themeBlack {
  .tree-item:hover {
    background: #303133;
  }
}
.themeWhite {
  .tree-item:hover {
    background: #f2f6fc;
  }
}
.cursors {
  cursor: pointer;
}
.treeHeight {
  transition: all 0.3s;
  overflow: hidden;
}
.tree-item {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  .iconNone {
    visibility: hidden;
  }
  .el-icon-caret-right {
    transition: all 0.3s;
    &.expanded {
      transform: rotate(90deg);
    }
  }
  .checkbox {
    box-sizing: border-box;
    border-radius: 2px;
    border: 1px solid;
    position: relative;
    top: 1px;
  }
}
.check-label {
  cursor: pointer;
  opacity: 1;
  &.hide {
    opacity: 0;
  }
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter,
.fade-leave-active {
  opacity: 0;
}
</style>
