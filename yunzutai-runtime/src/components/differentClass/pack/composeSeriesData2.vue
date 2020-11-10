<template>
  <div class="comps">
    <div v-for="(item, index) in config.value" :key="index">
      <div v-if="!item.cantAdd">
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
          <div class="title">数据源</div>
          <el-cascader
            class="page_select"
            popper-class="rightattr-cascader"
            v-model="item.pointId"
            :props="props"
            clearable
            @change="onChange(null, true)"
          ></el-cascader>
        </div>
        <div class="wrapper" v-if="!item.noDateType">
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
        <div class="wrapper">
          <div class="title">颜色</div>
          <color-picker
            v-model="item.itemStyle.normal.color"
            @change="change(item, item.itemStyle.normal.color)"
          />
        </div>
        <div class="btn-wrapper" v-if="!item.noOperate">
          <button
            class="btn"
            v-if="addBtnVisible(item, index)"
            @click="addDate(index, item)"
          >
            +
          </button>
          <button
            class="btn"
            v-if="config.value.length > 1"
            @click="delData(index, item)"
          >
            del
          </button>
        </div>
        <packLine></packLine>
      </div>
      <div v-if="item.cantAdd">
        <div class="wrapper">
          <div class="title">颜色</div>
          <color-picker
            v-model="item.itemStyle.normal.color"
            @change="change(item, item.itemStyle.normal.color)"
          />
        </div>
        <packLine></packLine>
      </div>
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
  },
  methods: {
    addDate(index, item) {
      let theme = this.$store.getters.theme;
      let obj = {};
      if (this.config.value.length >= this.config.limtLength) return;
      let color = "";
      let colorWhite = "";
      let colorBlack = "";
      if (this.config.chartType == "line") {
        color = this.config[theme][this.config.value.length + 4];
        colorWhite = this.config["white"][this.config.value.length + 4];
        colorBlack = this.config["black"][this.config.value.length + 4];
      } else {
        color = this.config[theme][this.config.value.length + 1];
        colorWhite = this.config["white"][this.config.value.length + 1];
        colorBlack = this.config["black"][this.config.value.length + 1];
      }
      if (this.config.value[0].devType != undefined) {
        let name = this.genName();
        console.log(name);
        obj = {
          name,
          value: 100,
          pointId: [],
          rule: "",
          white: colorWhite,
          black: colorBlack,
          index: item.index,
          key: item.key,
          cantAdd: item.cantAdd,
          stack: item.stack,
          noDateType: item.noDateType,
          stackNum: item.stackNum,
          needChange: item.needChange,
          itemStyle: {
            normal: {
              color: color
            }
          },
          devType: [
            {
              label: "耗能统计",
              value: 1
            },
            {
              label: "供能统计",
              value: 2
            },
            {
              label: "实时值",
              value: 3
            },
            {
              label: "平均值",
              value: 4
            },
            {
              label: "最大值",
              value: 5
            },
            {
              label: "最小值",
              value: 6
            }
          ],
          devValue: null
        };
      } else {
        obj = {
          name,
          value: 100,
          pointId: [],
          rule: "",
          white: colorWhite,
          black: colorBlack,
          itemStyle: {
            normal: {
              color: color
            }
          }
        };
      }
      this.config.value.push(obj);
      if (this.$drag.vms.$refs.comp.drawPie) {
        this.$drag.vms.$refs.comp.drawPie(
          "add",
          this.config.chartType,
          null,
          obj
        );
      }
      this.change();
      if (item.needChange) {
        this.onChange(null, true);
      }
    },
    genName() {
      let maxPrefix = 0;
      let label = this.config.value[0].label;
      let matchedItems = this.config.value.filter(item => {
        return item.name.indexOf(label) > -1;
      });
      let matchedItemPrefixes = matchedItems.map(mi => {
        return mi.name.split(label)[1];
      });
      matchedItemPrefixes = matchedItemPrefixes.filter(mip => {
        return !isNaN(mip);
      });
      maxPrefix = Math.max(maxPrefix, ...matchedItemPrefixes);
      return label + ++maxPrefix;
    },
    change(item, val) {
      if (item) {
        let theme = this.$store.getters.theme;
        item[theme] = val;
        this.onChange(null, true);
      }
    },
    delData(index, item) {
      this.config.value.splice(index, 1);
      if (this.$drag.vms.$refs.comp.drawPie) {
        this.$drag.vms.$refs.comp.drawPie("del", this.config.chartType, index);
      }
      if (item.needChange) {
        this.onChange(null, true);
      }
    },
    addBtnVisible(item, index) {
      let isLast = index === this.config.value.length - 1;
      let maxCount = 5;
      maxCount = this.config.limtLength ? this.config.limtLength : maxCount;
      let outRange = index < maxCount - 1;
      return isLast && outRange;
    }
  }
};
</script>

<style lang="less" scoped>
.wrapper {
  padding-bottom: 15px;
}
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
</style>
