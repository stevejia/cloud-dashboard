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
    <div class="title" v-if="config.value.position">数值位置</div>
    <el-select
      v-if="config.value.position"
      class="page_select"
      v-model="config.value.position"
      placeholder="请选择"
      @change="onChange(null, true)"
      :popper-append-to-body="false"
    >
      <el-option
        v-for="item in positionProps"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      ></el-option>
    </el-select>
    <el-checkbox
      v-if="config.value.bit"
      v-model="config.value.bit.check"
      @change="onChange(null, true)"
    >
      <p>启用bit位（<span class="font-red">*从后向前</span>）</p>
    </el-checkbox>
    <div
      class="select-wrapper"
      v-if="config.value.bit && config.value.bit.check"
    >
      <el-select
        class="page_select"
        v-model="config.value.bit.value[0]"
        placeholder="请选择"
        @change="onChange(null, true)"
        :popper-append-to-body="false"
      >
        <el-option
          v-for="item in bitProps"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <el-select
        class="page_select"
        v-model="config.value.bit.value[1]"
        placeholder="请选择"
        @change="onChange(null, true)"
        :popper-append-to-body="false"
      >
        <el-option
          v-for="item in bitProps"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
    </div>
    <template v-for="(item, index) in colorList">
      <div class="bodys" :key="index">
        <div class="title">{{ "颜色" + (index + 1) }}</div>
        <div class="colorConfig divFlex">
          <color-picker v-model="item.color" @change="onChange(null, true)" />
          <div class="divs">
            <input
              type="text"
              v-model="item.start"
              oninput="value=value.replace(/[^\d]/g, 0)"
            />
          </div>
          <div class="line"></div>
          <div>
            <input
              type="text"
              v-model="item.end"
              oninput="value=value.replace(/[^\d]/g, 0)"
            />
          </div>
        </div>
        <div class="divFlex">
          <div
            @click="adds(index)"
            v-show="index + 1 === colorList.length"
            class="add"
          >
            <i class="el-icon-circle-plus"></i>
          </div>
          <div
            @click="deletes(index)"
            v-show="colorList.length !== 1"
            class="delete"
          >
            <i class="el-icon-delete"></i>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { bitList } from "./common.js";

export default {
  props: {
    title: String,
    config: Object,
    onChange: Function
  },
  data() {
    return {
      props: [],
      colorList: this.config.value.colorList,
      positionProps: [
        {
          label: "数据在前",
          value: "front"
        },
        {
          label: "数据在后",
          value: "after"
        }
      ],
      bitProps: bitList
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
    adds(index) {
      this.colorList.splice(index + 1, 0, {
        color: "",
        start: "",
        end: ""
      });
      this.config.value.colorList = this.colorList;
      this.onChange(null, true);
    },
    deletes(index) {
      this.colorList.splice(index, 1);
      this.config.value.colorList = this.colorList;
      this.onChange(null, true);
    }
  }
};
</script>
<style lang="less" scoped>
.bodys {
  margin-top: 5px;
  .divFlex {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
  }
  .add,
  .delete {
    margin-top: 5px;
    width: 40px;
    font-size: 26px;
    text-align: center;
  }
  .delete {
    color: red;
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
.font-red {
  color: red;
}
.select-wrapper {
  display: flex;
  .page_select:first-child {
    margin-right: 4px;
  }
}
.comps {
  /deep/ .el-checkbox__input.is-checked + .el-checkbox__label {
    color: #fff;
  }
}
</style>
