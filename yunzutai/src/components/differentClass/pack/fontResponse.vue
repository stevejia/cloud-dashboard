<template>
  <div class="comps">
    <div class="title">
      <el-checkbox
        v-model="config.value.status"
        @change="onChange(null, true)"
      ></el-checkbox>
      <span>{{ title }}</span>
    </div>
    <el-cascader
      v-show="config.value.status"
      popper-class="rightattr-cascader"
      v-model="config.value.pointId"
      :props="props"
      clearable
      @change="onChange(null, true)"
    ></el-cascader>
    <AddDel
      v-show="config.value.status"
      :list="config.value.valueList"
      :defaultConfig="defaultConfig"
    >
      <template v-slot:default="defaults">
        <div class="pad">{{ "文字" + defaults.index }}</div>
        <el-input
          type="text"
          v-model="defaults.item.text"
          @blur="onChange(null, true)"
          @keyup.enter="onChange(null, true)"
        ></el-input>
        <div class="block">
          <input
            type="number"
            v-model="defaults.item.min"
            @blur="onChange(null, true)"
            @keyup.enter="onChange(null, true)"
          />
          <div class="line"></div>
          <input
            type="number"
            v-model="defaults.item.max"
            @blur="onChange(null, true)"
            @keyup.enter="onChange(null, true)"
          />
        </div>
      </template>
    </AddDel>
  </div>
</template>

<script>
import AddDel from "./addDel.vue";
export default {
  components: {
    AddDel
  },
  props: {
    title: String,
    config: Object,
    onChange: Function
  },
  data() {
    return {
      defaultConfig: {
        text: "",
        min: null,
        max: null
      },
      props: []
    };
  },
  created() {
    let self = this;
    this.props = {
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
.block {
  margin: 10px 0 0 0;
  display: flex;
  // justify-content: center;
  align-items: center;
}
.line {
  background: #ddd;
  width: 6px;
  height: 2px;
  margin: 0 3px;
}
.pad {
  margin: 10px 0 5px 0;
}
input {
  border-radius: 2px;
  border: none;
  width: 67px;
  height: 30px;
  padding: 0;
  box-sizing: border-box;
}
</style>
