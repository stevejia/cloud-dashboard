<template>
  <div class="comps">
    <div v-for="(item, index) in config.value" :key="index">
      <div class="wrapper">
        <div class="title">
          {{ (config.labelArr && config.labelArr[0]) || "数据名" }}
        </div>
        <el-input
          v-model="item.name"
          placeholder="请输入内容"
          @input="onChange"
          @change="onChange"
          @blur="onChange(null, true)"
          @keyup.enter.native="onChange(null, true)"
        ></el-input>
        <p class="tip" v-if="checkName(item, index)">数据名称不可重复！</p>
      </div>
      <div class="wrapper">
        <div class="title">
          {{ (config.labelArr && config.labelArr[1]) || "数据源" }}
        </div>
        <el-cascader
          popper-class="rightattr-cascader"
          v-model="item.pointId"
          :props="props"
          clearable
          @change="onChange(null, true)"
        ></el-cascader>
      </div>
      <div class="wrapper">
        <div class="title">
          {{ (config.labelArr && config.labelArr[2]) || "颜色" }}
        </div>
        <color-picker
          v-if="config[config.theme]"
          v-model="config[config.theme][index]"
          @change="onChange(null, true)"
        />
      </div>
      <div class="btn-wrapper">
        <span
          class="btn btn-add"
          v-if="
            index === config.value.length - 1 && index < config.maxLength - 1
          "
          @click="addData"
        >
          <i class="iconfont icontianjia"></i>
        </span>
        <span
          class="btn iconfont iconshanchu"
          v-if="config.value.length > 1"
          @click="delData(index, item)"
        ></span>
      </div>
      <packLine></packLine>
    </div>
  </div>
</template>

<script>
import packLine from "./line.vue";
import THEME_COLOR from "../../differentClassJson/common/chartColor.json";
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
      props: []
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
      let name = "";
      let black = this.config.black;
      let white = this.config.white;
      for (let i of this.config.value) {
        nameArr.push(i.name);
      }
      for (let i = 0; i < this.config.maxLength; i++) {
        name = "默认名称" + i;
        if (!nameArr.includes(name)) break;
      }
      let obj = {
        name: name,
        value: 100,
        pointId: []
      };
      for (let i of THEME_COLOR.white.pieData) {
        let str = i.toLowerCase();
        if (!white.includes(i) && !white.includes(str)) {
          white.push(i);
          break;
        }
      }
      for (let n of THEME_COLOR.black.pieData) {
        let str = n.toLowerCase();
        if (!black.includes(n) && !black.includes(str)) {
          black.push(n);
          break;
        }
      }
      this.config.value.push(obj);
      this.onChange(null, true);
    },

    delData(index) {
      this.config.value.splice(index, 1);
      this.config.black.splice(index, 1);
      this.config.white.splice(index, 1);
      this.onChange(null, true);
    },

    checkName(item, index) {
      for (let i = 0; i < this.config.value.length; i++) {
        if (i === index) continue;
        if (this.config.value[i].name === item.name) {
          return true;
        }
      }
      return false;
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
  align-items: center;
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
