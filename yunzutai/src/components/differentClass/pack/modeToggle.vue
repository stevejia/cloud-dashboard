<template>
  <div class="mode-toggle-container">
    <div class="title-container">
      <div class="title">{{ title }}</div>
    </div>
    <el-checkbox v-model="config.data.eventable" @change="onChange(null, true)"
      >确认提示</el-checkbox
    >
    <el-checkbox v-model="config.data.numconfirm" @change="onChange(null, true)"
      >启用密码</el-checkbox
    >
    <el-select
      style="padding: 10px 0;"
      v-if="config.data.numconfirm"
      v-model="config.data.permissId"
      @change="onChange(null, true)"
    >
      <el-option
        v-for="item in yztPermiss"
        :key="item.id"
        :label="item.label"
        :value="item.id"
      ></el-option>
    </el-select>
    <div
      class="response-container"
      v-for="(item, index) in config.data.wbEventList"
      :key="index"
    >
      <el-cascader
        popper-class="rightattr-cascader"
        v-model="item.curdevchar"
        :props="props"
        clearable
        @change="onChange(null, true)"
      ></el-cascader>

      <div class="value-container">
        <span class="gap">开启值</span>
        <el-input
          v-model.number="item.startnum"
          class="value-input"
          type="number"
          @input="onChange"
          @change="onChange"
          @blur="onChange(null, true)"
          @keyup.enter.native="onChange(null, true)"
        ></el-input>
        <span class="gap">关闭值</span>
        <el-input
          class="value-input"
          v-model.number="item.closenum"
          type="number"
          @input="onChange"
          @change="onChange"
          @blur="onChange(null, true)"
          @keyup.enter.native="onChange(null, true)"
        ></el-input>
      </div>
      <div style="display:flex; justify-content: flex-end;">
        <span>
          <i
            class="el-icon-circle-plus-outline add-icon"
            v-show="index === config.data.wbEventList.length - 1"
            @click="addItem"
          ></i>
          <i
            class="el-icon-delete delete-icon"
            v-show="config.data.wbEventList.length > 1"
            @click="deleteItem(index)"
          ></i>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["title", "config", "onChange"],
  data() {
    return {
      yztPermiss: [
        {
          counter: 0,
          grade: "65535",
          id: "5a359b2f88d644c2ab034d51514fa218",
          label: "超级管理员",
          password: "123456"
        },
        {
          counter: 1,
          grade: "1",
          id: "edf25a60a19a11eaac6c1584933b5f45",
          label: "权限名称2",
          password: "111111"
        }
      ]
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
    deleteItem(index) {
      console.log(index);
      this.config.data.wbEventList = this.config.data.wbEventList.filter(
        (wl, idx) => {
          return wl && index !== idx;
        }
      );
      this.onChange(null, true);
    },
    addItem() {
      this.config.data.wbEventList.push({
        startNum: null,
        closeNum: null,
        curdevchar: []
      });
      this.onChange(null, true);
    }
  }
};
</script>

<style lang="less" scoped>
.mode-toggle-container {
  .title-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .response-container {
    // display: flex;
    // align-items: center;
    // justify-content: space-between;
  }
  .value-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .value-input {
    width: 45px;
  }
  .delete-icon {
    font-size: 16px;
    color: #f56c6c;
    cursor: pointer;
    padding: 10px 0;
  }
  .add-icon {
    font-size: 16px;
    color: #409eff;
    cursor: pointer;
    padding: 10px;
  }
}
</style>
