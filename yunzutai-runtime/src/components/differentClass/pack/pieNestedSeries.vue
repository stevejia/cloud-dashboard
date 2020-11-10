<template>
  <div class="comps">
    <div class="title">{{ title }}</div>
    <el-select
      v-model="config.dataType"
      placeholder="请选择"
      @change="onChange(null, true)"
    >
      <el-option
        v-for="item in dataTypeArr"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      ></el-option>
    </el-select>
    <packLine></packLine>
    <div v-for="(item, index) in config.value" :key="index">
      <div class="wrapper">
        <div class="title">数据名</div>
        <el-input
          v-model="item.data[0].name"
          placeholder="请输入内容"
          @input="onChange"
          @change="onChange"
          @blur="onChange(null, true)"
          @keyup.enter.native="onChange(null, true)"
        ></el-input>
        <p class="tip" v-if="checkName(item, index)">数据名称不可重复！</p>
      </div>
      <div class="wrapper">
        <div class="title">总数</div>
        <el-cascader
          v-if="config.dataType == '2'"
          popper-class="rightattr-cascader"
          v-model="item.totalPointId"
          :props="props"
          clearable
          @change="onChange(null, true)"
        ></el-cascader>
        <el-input
          v-if="config.dataType == '1'"
          v-model="item.totalAmount"
          placeholder="请输入数值"
          @input="onChange"
          @change="onChange"
          @blur="onChange(null, true)"
          @keyup.enter.native="onChange(null, true)"
        ></el-input>
      </div>
      <div class="wrapper">
        <div class="title">当前值</div>
        <el-cascader
          v-if="config.dataType == '2'"
          popper-class="rightattr-cascader"
          v-model="item.pointId"
          :props="props"
          clearable
          @change="onChange(null, true)"
        ></el-cascader>
        <el-input
          v-if="config.dataType == '1'"
          v-model="item.data[0].value"
          placeholder="请输入数值"
          @input="onChange"
          @change="onChange"
          @blur="onChange(null, true)"
          @keyup.enter.native="onChange(null, true)"
        ></el-input>
      </div>
      <div class="wrapper">
        <div class="title">单位</div>
        <el-input
          v-model="item.valueUnit"
          placeholder="请输入数据单位"
          @input="onChange"
          @change="onChange"
          @blur="onChange(null, true)"
          @keyup.enter.native="onChange(null, true)"
        ></el-input>
      </div>
      <div class="wrapper">
        <div class="title">环图颜色</div>
        <color-picker
          v-if="config[config.theme]"
          v-model="config[config.theme][index]"
          @change="onChange(null, true)"
        />
      </div>
      <div class="btn-wrapper">
        <span
          class="btn btn-add"
          v-if="index === config.value.length - 1 && index < 2"
          @click="addData(index)"
        >
          <i class="iconfont icontianjia"></i>
        </span>
        <span
          class="btn iconfont iconshanchu"
          v-if="config.value.length > 1 && index != 0"
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
      props: [],
      dataTypeArr: [
        {
          label: "手动输入",
          value: "1"
        },
        {
          label: "绑定点位",
          value: "2"
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
    addData() {
      let nameArr = [];
      let index = "";
      let black = this.config.black;
      let white = this.config.white;
      for (let i of this.config.value) {
        nameArr.push(i.data[0].name);
      }
      for (index = 3; index < 6; index++) {
        let name = "默认名称" + index;
        if (!nameArr.includes(name)) break;
      }
      let obj = {
        type: "pie",
        radius: ["30%", "40%"],
        hoverAnimation: false,
        clockwise: false,
        avoidLabelOverlap: true,
        labelLine: {
          show: false
        },
        totalAmount: 100,
        totalPointId: "",
        pointId: "",
        valueUnit: "单位" + index,
        data: [
          {
            value: 60,
            name: "环图" + index,
            label: {
              show: true,
              position: "center"
            }
          },
          {
            value: 0,
            name: "",
            emphasis: {
              itemStyle: {
                color: "#333"
              }
            },
            itemStyle: {
              color: "#333"
            }
          }
        ]
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
        if (this.config.value[i].data[0].name === item.data[0].name) {
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
