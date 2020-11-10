<template>
  <div class="comps">
    <div class="title">{{ title }}</div>
    <el-cascader
      popper-class="rightattr-cascader"
      v-model="config.value"
      :props="props"
      clearable
      @change="onChange(null, true)"
    ></el-cascader>
    <div class="title">显示度范围</div>
    <div class="row">
      <div class="rowDiv">
        <input
          v-model="config.opacityRange[0]"
          @blur="onChange(null, true)"
          @keyup.enter="onChange(null, true)"
        />
        <span>%</span>
      </div>
      <div class="rowDivLine">-</div>
      <div class="rowDiv">
        <input
          v-model="config.opacityRange[1]"
          @blur="onChange(null, true)"
          @keyup.enter="onChange(null, true)"
        />
        <span>%</span>
      </div>
    </div>
    <div class="title">数据范围</div>
    <div class="row">
      <div class="rowDiv">
        <input
          v-model="config.dataRange[0]"
          @blur="onChange(null, true)"
          @keyup.enter="onChange(null, true)"
        />
      </div>
      <div class="rowDivLine">-</div>
      <div class="rowDiv">
        <input
          v-model="config.dataRange[1]"
          @blur="onChange(null, true)"
          @keyup.enter="onChange(null, true)"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { eventOpacity } from "./common";
export default {
  props: {
    title: String,
    config: Object,
    onChange: Function
  },
  data() {
    return {
      props: [],
      optionOption: eventOpacity
    };
  },
  created() {
    let self = this;
    self.props = {
      label: "name",
      lazy: true,
      lazyLoad(node, resolve) {
        let { data, root } = node;
        setTimeout(() => {
          let params = [];
          if (!root && data.childNodes) {
            params = data.childNodes;
          } else {
            params = self.$store.state.deviceList || [];
          }
          const nodes = Array.from(params).map(item => ({
            value: item.id,
            name: item.name,
            disabled: item.disabled,
            leaf: !item.children,
            childNodes: item.children
          }));
          resolve(nodes);
        }, 400);
      }
    };
  }
};
</script>
<style lang="less" scoped>
.row {
  width: calc(100%);
  .rowDiv {
    width: calc(40%);
    input {
      width: 70px;
      outline: none;
      font-family: microsoft yahei;
      font-size: 14px;
      text-align: left;
      padding-left: 10px;
      box-sizing: border-box;
      height: 30px;
      color: #282828;
      background-color: #fff;
      border: 1px solid #282828;
    }
  }
  .rowDivLine {
    text-align: center;
    align-self: center;
    font-size: 20px;
    font-weight: bold;
    width: calc(20%);
  }
}
</style>
