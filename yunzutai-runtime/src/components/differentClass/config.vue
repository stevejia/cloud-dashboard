<template>
  <div class="compConfig">
    <div class="title">
      <div
        :class="currentType === 'basic' ? 'block active' : 'block'"
        @mousedown.stop="change('basic')"
      >
        基本属性
      </div>
      <div
        v-if="highConfig"
        :class="currentType === 'high' ? 'block active' : 'block'"
        @mousedown.stop="change('high')"
      >
        高级属性
      </div>
    </div>
    <div class="body">
      <packComp
        ref="basic"
        v-show="currentType === 'basic'"
        :config="baisicConfig"
        :onChange="initStyle"
      ></packComp>
      <packComp
        ref="high"
        v-show="currentType === 'high'"
        :config="highConfig"
        :onChange="initStyle"
      ></packComp>
      <div class="bottomDiv">- 我是有底线的 -</div>
    </div>
  </div>
</template>

<script>
import packComp from "./pack/pack.vue";
import { getComp } from "@/util/common.js";
export default {
  components: {
    packComp
  },
  props: {
    targetType: String
  },
  data() {
    return {
      bool: false,
      currentType: "basic",
      currentComp: null,
      baisicConfig: {},
      highConfig: null
    };
  },
  watch: {
    "$store.getters.theme": function() {
      this.currentType = "basic";
      this.baisicConfig = null;
      this.highConfig = null;
      this.$parent.$parent.currentVm = null;
    }
  },
  created() {
    this.initConfig();
  },
  methods: {
    initConfig() {
      this.currentType = "basic";
      this.currentComp = getComp(this.targetType);
      if (this.currentComp.__file) {
        this.baisicConfig = this.currentComp.data().baisicConfig;
        this.highConfig = this.currentComp.data().highConfig;
      }
    },
    //更新对应组件
    initStyle(type, order) {
      if (!this.bool || this.currentComp.__file || this.$draging) return;
      this.currentComp.initStyle(type, order);
    },
    //基础属性，高级属性切换
    change(type) {
      if (this.currentType === type) return;
      this.currentType = type;
    }
  }
};
</script>
<style lang="less" scoped>
.compConfig {
  height: calc(60% - 44px);
  .title {
    height: 36px;
    line-height: 36px;
    display: flex;
    flex-direction: row;
    background: #737881;
    color: white;
    .block {
      cursor: pointer;
      flex: 1;
      text-align: center;
      &.active {
        background: #0064ff;
      }
    }
  }
  .body {
    overflow: overlay;
    height: calc(100% - 36px);
    box-sizing: border-box;
    padding: 16px 10px 40px;
    position: relative;
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
    .bottomDiv {
      position: relative;
      top: 30px;
      text-align: center;
      color: #c0c4cc;
      font-size: 12px;
    }
  }
}
</style>
