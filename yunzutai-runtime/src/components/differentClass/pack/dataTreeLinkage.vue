<template>
  <div class="comps">
    <div v-for="(item, index) in config.params" :key="index">
      <div class="title">
        {{ item.title }}
        <el-checkbox
          v-if="index > 0"
          v-model="item.sameAbove"
          @change="sameChange(index)"
        >
          同上
        </el-checkbox>
      </div>
      <el-cascader
        popper-class="rightattr-cascader"
        v-model="item.value"
        :props="props"
        :options="options"
        :disabled="item.sameAbove"
        clearable
        @change="change(index)"
        ref="abc"
      ></el-cascader>
      <packLine v-if="index < config.params.length - 1"></packLine>
    </div>
  </div>
</template>

<script>
import packLine from "./line.vue";
export default {
  props: {
    title: String,
    config: Object,
    onChange: Function
  },
  components: {
    packLine
  },
  data() {
    return {
      props: { label: "name", value: "id" },
      options: []
    };
  },
  created() {
    let self = this;
    if (!self.config.white) {
      self.config.white = this.white;
      self.config.black = this.black;
    }
    this.getDataTree();
  },
  methods: {
    change(index) {
      if (
        this.config.params[index + 1] &&
        this.config.params[index + 1].sameAbove
      ) {
        this.config.params[index + 1].value = [
          ...this.config.params[index].value
        ];
      }
      this.onChange(null, true);
    },
    sameChange(index) {
      if (
        this.config.params[index - 1] &&
        this.config.params[index].sameAbove
      ) {
        this.config.params[index].value = [
          ...this.config.params[index - 1].value
        ];
        this.onChange(null, true);
      }
    },
    getDataTree() {
      let flag = 0;
      let timer = setTimeout(() => {
        let params = this.$store.state.deviceList || [];
        this.options = Array.from(params).map(item => ({
          id: item.id,
          name: item.name,
          disabled: item.disabled,
          leaf: !item.children,
          children: item.children
        }));
        clearTimeout(timer);
        timer = null;
        if (!this.options.length && flag < 10) {
          flag++;
          this.getDataTree();
        }
      }, 1000);
    },

    optionMap(params) {
      return Array.from(params).map(item => ({
        value: item.id,
        name: item.name,
        disabled: item.disabled,
        leaf: !item.children,
        children: item.children
      }));
    }
  }
};
</script>

<style lang="less" scoped>
.comps /deep/ .el-checkbox {
  float: right;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-right: 0;
  padding-right: 0;
  width: 60px;
  .el-checkbox__input {
    font-size: 0;
  }
  .el-checkbox__inner {
    width: 20px;
    height: 20px;
    &::after {
      left: 6px;
      height: 11px;
      width: 5px;
      border-color: #333;
      border-width: 2px;
    }
  }
  .el-checkbox__input.is-checked .el-checkbox__inner,
  .el-checkbox__input.is-indeterminate .el-checkbox__inner {
    background-color: #fff;
    border-color: #dcdfe6;
  }
  .el-checkbox__input.is-checked + .el-checkbox__label {
    color: #fff;
  }
}
.comps /deep/ .el-input.is-disabled .el-input__inner {
  color: #c0c4cc;
}
</style>
