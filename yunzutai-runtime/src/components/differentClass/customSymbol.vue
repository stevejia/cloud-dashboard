<template>
  <div class="comp">
    <div style="height:calc(40% - 3px)">
      <div class="title">
        {{ "基本元件"
        }}<span v-if="currentItem">{{ "--" + currentItem.name }}</span>
      </div>
      <div class="body" v-if="currentItem">
        <sub-unit
          :list="$drag.composeToVmsList"
          :currentItem="currentItem"
        ></sub-unit>
      </div>
    </div>
  </div>
</template>
<script>
import subUnit from "./component/subUnit";
export default {
  components: {
    subUnit
  },
  data() {
    return {
      currentItem: null
    };
  },
  mounted() {
    let list = this.$drag.composeToVmsList;
    this.currentItem = list?.length ? list[0] : null;
  },
  methods: {
    initType(type) {
      this.currentItem = this.$drag.composeToVmsList.find(item => {
        return item.type === type;
      });
    },
    selectSymbol(item) {
      this.$parent.currentVm = null;
      this.currentItem = item;
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
  }
}
</style>
