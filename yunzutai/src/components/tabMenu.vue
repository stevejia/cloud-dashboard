<template>
  <div class="tabMenu" :style="wholeStyle" @mousedown="clearVms">
    <div class="lefts" :style="leftStyle">
      <span
        @mousedown.stop="hideLeft"
        :class="[isHideLeft ? 'el-icon-s-unfold' : 'el-icon-s-fold']"
      ></span>
    </div>
    <div class="rights">
      <div class="left" v-if="level1">{{ level2 ? level2 : level1 }}</div>
      <div class="right" v-if="level1">
        <span :class="['iconfont', routeIcon]"></span>
        <span class="line">/</span>
        <span class="title wrapper">{{ level1 }}</span>
        <template v-if="level2">
          <span class="line">/</span>
          <span class="title wrapper">{{ level2 }}</span>
        </template>
      </div>
    </div>
  </div>
</template>
<script>
import { packFont } from "@/util/common.js";
export default {
  data() {
    return {
      config: {},
      fontStyle: {},
      wholeStyle: {},
      leftStyle: {},
      level1: "",
      level2: "",
      isHideLeft: false,
      routeIcon: ""
    };
  },
  methods: {
    clearVms() {
      this.$drag.clearVms();
      this.$drag.showMenu({ classes: 66 });
    },
    updateTitle(level1, level2, icon) {
      this.level1 = level1;
      this.level2 = level2;
      this.routeIcon = icon;
    },
    initStyle() {
      let config = this.$parent.$refs.lefters.config;
      this.fontStyle = packFont(config["字体样式"].value);
      let theme = this.$store.getters.theme;
      let borderColor = theme === "black" ? "#2b2e37" : "#eee";
      this.wholeStyle = {
        background: config["背景色"].value,
        color: this.fontStyle.color,
        borderBottom: `1px solid ${borderColor}`
      };
      this.leftStyle = {
        borderRight: `1px solid ${borderColor}`
      };
    },
    hideLeft(status) {
      this.$parent.toggLeft(status);
      if (typeof status === "boolean") {
        this.isHideLeft = !status;
      } else {
        this.isHideLeft = !this.isHideLeft;
      }
    }
  }
};
</script>
<style lang="less" scoped>
.tabMenu {
  background-color: rgb(36, 37, 42);
  color: rgb(183, 192, 205);
  display: flex;
  flex-direction: row;
  .lefts {
    width: 200px;
    height: calc(100%);
    box-sizing: border-box;
    display: flex;
    align-items: center;
    span {
      cursor: pointer;
      margin-left: 20px;
    }
  }
  .rights {
    flex: 1;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    .left {
      height: calc(100%);
      line-height: 43px;
      font-size: 15px;
      padding: 0 22px;
      border-bottom: 2px solid #3573c1;
    }
    .right {
      padding-right: 20px;
      display: flex;
      align-items: center;
      .title {
        max-width: 150px;
        display: inline-block;
      }
      .line {
        display: inline-block;
        margin: 0 9px;
        font-weight: 700;
      }
    }
  }
}
</style>
