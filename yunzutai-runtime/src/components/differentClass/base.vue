<template>
  <div class="comp">
    <div style="height:calc(40% - 3px)">
      <div class="title">{{ "基本元件--" + currentItem.name }}</div>
      <div class="body">
        <sub-unit :list="baseList" :currentItem="currentItem"></sub-unit>
      </div>
    </div>

    <div class="line moveLine"></div>
    <compConfig
      style="height:calc(60%)"
      ref="compConfig"
      :targetType="currentItem.type"
    ></compConfig>
  </div>
</template>
<script>
import base from "./../differentClassJson/base.json";
import compConfig from "./config";
import subUnit from "./component/subUnit";
export default {
  components: {
    compConfig,
    subUnit
  },
  data() {
    return {
      baseList: base,
      currentItem: base[0]
    };
  },
  methods: {
    initType(type) {
      this.currentItem = this.baseList.find(item => {
        return item.type === type;
      });
    },
    selectSymbol(item) {
      this.$parent.currentVm = null;
      this.currentItem = item;
      this.$nextTick(() => {
        this.$refs.compConfig.initConfig();
      });
    }
  }
};
</script>
<style lang="less" scoped>
.comp {
  height: calc(100%);
  width: calc(100%);
  background: #373e4a;
  color: #e9e9e9;
  font-size: 14px;
  .title {
    border-bottom: 1px solid transparent;
    background-color: #737881;
    height: 35px;
    line-height: 35px;
    text-align: center;
  }
  .line {
    background-color: #ddd;
    border-top: 8px solid #373e4a;
    height: 1px;
    cursor: s-resize;
  }
  .body {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 0 10px 10px;
    box-sizing: border-box;
    flex-wrap: wrap;
    overflow: overlay;
    height: calc(100% - 36px);
    &::-webkit-scrollbar {
      width: 4px;
      height: 4px;
    }
    &::-webkit-scrollbar-thumb {
      background: #e3e3e3;
      border-radius: 4px;
    }
    &::-webkit-scrollbar-resizer {
      background: #ff0bee;
    }
    // .imgDiv {
    //   display: flex;
    //   flex-direction: column;
    //   align-items: center;
    //   justify-content: space-around;
    //   cursor: move;
    //   width: 100px;
    //   height: 100px;
    //   box-sizing: border-box;
    //   margin: 8px 0;
    //   box-sizing: border-box;
    //   border: 1px solid transparent;
    //   &.active {
    //     border: 1px solid white;
    //   }
    //   .iconfont {
    //     cursor: move;
    //     font-size: 46px;
    //   }
    // }
  }
}
</style>
