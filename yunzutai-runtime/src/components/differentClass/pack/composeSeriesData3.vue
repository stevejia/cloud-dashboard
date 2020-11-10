<template>
  <div class="comps">
    <div v-for="(item, index) in config.value" :key="index">
      <div>
        <div class="wrapper">
          <div class="title">{{ item.label }}</div>
          <el-cascader
            class="page_select"
            popper-class="rightattr-cascader"
            v-model="item.pointId"
            :props="props"
            clearable
            @change="onChange(null, true)"
          ></el-cascader>
        </div>
        <div class="wrapper datatype" v-if="!item.noDateType">
          <div class="title">数据类型</div>
          <el-select
            class="page_select"
            v-model="item.devValue"
            placeholder="请选择"
            @change="onChange(null, true)"
          >
            <el-option
              v-for="items in item.devType"
              :key="items.value"
              :label="items.label"
              :value="items.value"
            ></el-option>
          </el-select>
        </div>
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
      props: [],
      total: 1,
      black: [
        "#3573c1",
        "#33a566",
        "#f1921c",
        "#34a8c2",
        "#e53f3f",
        "#3445c2",
        "#bb4fe1",
        "#b2ddff",
        "#24252a",
        "#1c3a60",
        "#f6376a",
        "#82c949",
        "#f4b60b",
        "#106b7f",
        "#9c34c2",
        "#323232",
        "#2f588e",
        "#0eeb8e",
        "#803d23"
      ],
      white: [
        "#1e88e5",
        "#3445c2",
        "#bb4fe1",
        "#b2ddff",
        "#7460ee",
        "#fc4b6c",
        "#26c6da",
        "#ffb22b",
        "#24252a",
        "#1c3a60",
        "#f6376a",
        "#82c949",
        "#f4b60b",
        "#106b7f",
        "#9c34c2",
        "#323232",
        "#2f588e",
        "#0eeb8e",
        "#803d23"
      ]
    };
  },
  created() {
    let self = this;
    if (!self.config.white) {
      self.config.white = this.white;
      self.config.black = this.black;
    }
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
.btn-wrapper {
  display: flex;
  justify-content: flex-end;
  .btn {
    margin-left: 20px;
  }
}
.page_select {
  width: 100%;
}

.datatype {
  padding-top: 15px;
}
</style>
