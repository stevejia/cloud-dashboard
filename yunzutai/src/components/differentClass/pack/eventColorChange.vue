<template>
  <div class="comps">
    <div class="title">{{ title }}</div>
    <el-cascader
      popper-class="rightattr-cascader"
      v-model="config.value.pointId"
      :props="props"
      clearable
      @change="onChange(null, true)"
    ></el-cascader>
    <div class="bodys">
      <div class="colorConfig divFlex">
        <div class="title">高限颜色</div>
        <color-picker
          v-model="config.value.highColor"
          @change="onChange(null, true)"
        />
        <div class="divs">
          <input
            type="text"
            v-model="config.value.highValue"
            @blur="onChange(null, true)"
            @keyup.enter="onChange(null, true)"
          />
        </div>
      </div>
    </div>
    <div class="bodys">
      <div class="colorConfig divFlex">
        <div class="title">低限颜色</div>
        <color-picker
          v-model="config.value.lowColor"
          @change="onChange(null, true)"
        />
        <div class="divs">
          <input
            type="text"
            v-model="config.value.lowValue"
            @blur="onChange(null, true)"
            @keyup.enter="onChange(null, true)"
          />
        </div>
      </div>
    </div>
    <explain style="margin:15px 0" :title="'添加事件'"></explain>
    <div class="bodys">
      <div class="select">
        <el-checkbox
          v-model="config.value.writeable"
          @change="onChange(null, true)"
          >可写入</el-checkbox
        >
        <el-checkbox
          v-model="config.value.passwordStatus"
          v-if="config.value.writeable"
          @change="onChange(null, true)"
          >启用密码</el-checkbox
        >
      </div>
      <el-select
        style="margin-top:15px"
        v-show="config.value.passwordStatus"
        v-model="config.value.role"
        placeholder="请选择"
        clearable
        @change="onChange(null, true)"
      >
        <el-option
          v-for="item in options"
          :key="item.id"
          :label="item.label"
          :value="item.id"
        ></el-option>
      </el-select>
    </div>
  </div>
</template>

<script>
import explain from "./explain.vue";
export default {
  components: {
    explain
  },
  props: {
    title: String,
    config: Object,
    onChange: Function
  },
  data() {
    return {
      options: this.$store.state.authorityList,
      props: [] //this.$store.state.deviceList,
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
.select {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}
.bodys {
  margin-top: 5px;
  .divFlex {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
  }
  .add,
  .delete {
    width: 40px;
    font-size: 40px;
    text-align: center;
  }
  & /deep/ .el-color-picker {
    margin-right: 10px;
  }
  .line {
    background: #ddd;
    width: 6px;
    height: 2px;
    margin: 0 3px;
  }
  input {
    width: 67px;
    height: 30px;
    padding: 0;
    box-sizing: border-box;
  }
}
</style>
