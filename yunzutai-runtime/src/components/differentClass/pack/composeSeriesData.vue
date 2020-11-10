<template>
  <div class="comps">
    <div v-for="(item, index) in config.value" :key="index">
      <div class="wrapper" v-if="item.status != 1">
        <div class="title">数据名</div>
        <el-input
          v-model="item.name"
          placeholder="请输入内容"
          @input="changeInput"
          @change="onChange"
          @blur="onChange(null, true)"
          @keyup.enter.native="onChange(null, true)"
        ></el-input>
        <p class="repeat" v-if="item.repeat">数据名称不可重复！</p>
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
      <div class="wrapper" v-if="item.devType != undefined">
        <div class="title">数据类型</div>
        <el-select
          class="page_select"
          v-model="item.devValue"
          placeholder="请选择"
          @change="onChange(null, true)"
          clearable
        >
          <el-option
            v-for="items in item.devType"
            :key="items.value"
            :label="items.label"
            :value="items.value"
          ></el-option>
        </el-select>
      </div>
      <div class="wrapper" v-if="item.status != 1 && item.itemStyle != null">
        <div class="title">{{ item.type == "line" ? "折线" : "柱状" }}颜色</div>
        <color-picker
          v-model="item.itemStyle.normal.color"
          @change="change(item, item.itemStyle.normal.color)"
        />
      </div>
      <div class="btn-wrapper" v-if="item.status != 1">
        <span
          class="btn btn-add"
          v-if="
            index === config.value.length - 1 && index < config.limtLength - 1
          "
          @click="addDate(index)"
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
      ],
      totleNum: 30,
      nameData: this.config.name || "默认名称"
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
    addDate() {
      let theme = this.$store.getters.theme;
      let obj = {};
      if (this.config.value.length >= this.config.limtLength) return;
      let color = "";
      let colorWhite = "";
      let colorBlack = "";
      if (this.config.chartType == "line") {
        color = this.config[theme][this.total + 4];
        colorWhite = this.config["white"][this.total + 4];
        colorBlack = this.config["black"][this.total + 4];
      } else {
        color = this.config[theme][this.total.length];
        colorWhite = this.config["white"][this.total.length];
        colorBlack = this.config["black"][this.total.length];
      }
      let itemStyle = {};
      let data = undefined;
      if (this.config.category == "foldlinechart") {
        itemStyle = {
          normal: {
            color: color
          }
        };
        let arr = [1120, 1232, 1001, 734, 900, 1030, 910];
        for (let i = 0; i < arr.length; i++) {
          arr[i] = arr[i] + (this.totleNum += 50);
        }
        data = arr;
      } else if (this.config.category == "linechart") {
        itemStyle = {
          normal: {
            color: color
          }
        };
        let arr = [
          520,
          732,
          801,
          334,
          790,
          830,
          910,
          520,
          732,
          801,
          334,
          790,
          830,
          910,
          520,
          732,
          801,
          334,
          790,
          830,
          910,
          1230,
          892,
          578
        ];
        for (let i = 0; i < arr.length; i++) {
          arr[i] = arr[i] + (this.totleNum += 10);
        }
        data = arr;
      } else {
        if (
          this.config.value[0].itemStyle == null &&
          this.config.value[0].data != undefined
        ) {
          itemStyle = null;
          data = this.totleNum -= 2;
        } else {
          itemStyle = {
            normal: {
              color: color
            }
          };
          data = undefined;
        }
      }
      obj = {
        name: this.nameData + (this.config.value.length + 1),
        value: 100,
        pointId: [],
        white: colorWhite,
        black: colorBlack,
        itemStyle: itemStyle,
        devValue: null,
        status: 0,
        data: data,
        type: this.config.value[0].type
      };
      if (
        this.config.category == "foldlinechart" ||
        this.config.category == "linechart"
      ) {
        obj.smooth = false;
        obj.type = "line";
      }
      if (this.config.value[0].devType != undefined) {
        obj.devType = [
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
        ];
      }

      this.total++;
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
    },
    change(item, val) {
      if (item) {
        let theme = this.$store.getters.theme;
        item[theme] = val;
        this.onChange(null, true);
      }
    },
    changeInput() {
      let list = this.config.value;
      for (let i = 0; i < list.length; i++) {
        for (let j = 0; j < list.length; j++) {
          if (i != j) {
            if (list[i].name == list[j].name) {
              list[i].repeat = true;
            } else {
              delete list[i].repeat;
            }
          }
        }
      }
      this.onChange();
    },
    delData(index) {
      this.config.value.splice(index, 1);
      if (this.$drag.vms.$refs.comp.drawPie) {
        this.$drag.vms.$refs.comp.drawPie("del", this.config.chartType, index);
      }
      for (let i = 0; i < this.config.value.length; i++) {
        if (i != 0) {
          this.config.value[i].name = this.nameData + (i + 1);
        } else {
          this.config.value[i].name = this.nameData + 1;
        }
      }
      this.onChange(null, true);
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
.page_select {
  width: 100%;
}
.repeat {
  height: 20px;
  margin-top: 0px;
  color: rgb(245, 108, 108);
}
</style>
