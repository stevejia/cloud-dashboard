<template>
  <div class="comps">
    <div v-for="(item, index) in config.value" :key="index">
      <div class="wrapper">
        <div class="title">数据名</div>
        <el-input
          v-model="item.name"
          placeholder="请输入内容"
          @input="onChange"
          @change="onChange"
          @blur="onChange(null, true)"
          @keyup.enter.native="onChange(null, true)"
        ></el-input>
      </div>
      <div class="wrapper">
        <div class="title">数据绑定</div>
        <el-cascader
          popper-class="rightattr-cascader"
          v-model="item.pointId"
          :props="props"
          clearable
          @change="onChange(null, true)"
        ></el-cascader>
      </div>
      <div class="btn-wrapper">
        <span
          class="btn btn-add"
          v-if="index === config.value.length - 1 && index < max"
          @click="addData(index)"
        >
          <i class="iconfont icontianjia"></i>
        </span>
        <span
          class="btn iconfont iconshanchu"
          v-if="config.value.length > 1"
          @click="delData(index, item)"
        ></span>
      </div>
      <packLine v-if="config.value.length != index"></packLine>
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
      props: [],
      max: 10
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
  },

  methods: {
    addData() {
      let nameArr = [];
      let index = "";
      let name = "";
      for (let i of this.config.value) {
        nameArr.push(i.name);
      }
      for (index = 1; index < this.max; index++) {
        name = "默认名称" + index;
        if (!nameArr.includes(name)) break;
      }
      let obj = {
        name,
        pointId: "",
        value: 40
      };
      this.config.value.push(obj);
      this.onChange(null, true);
    },

    delData(index) {
      this.config.value.splice(index, 1);
      this.onChange(null, true);
    }
  }
};
</script>

<style lang="less" scoped>
.wrapper {
  padding-bottom: 15px;
  .tip {
    margin: 0;
    width: 100%;
    text-align: left;
    color: rgb(245, 108, 108);
  }
}
.btn-wrapper {
  display: flex;
  justify-content: flex-end;
  .btn {
    margin-left: 20px;
    font-size: 24px;
    &:hover {
      opacity: 0.8;
    }
    &.iconshanchu {
      color: red;
    }
    &.btn-add {
      height: 24px;
      width: 24px;
      line-height: 20px;
      text-align: center;
      border-radius: 50%;
      background-color: rgb(255, 255, 255);
    }
    .icontianjia {
      color: #333;
    }
  }
}
</style>
