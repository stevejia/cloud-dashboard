<template>
  <div class="symbolComp" :style="styles">
    <div class="title">查询条件</div>
    <div class="block date">
      <el-date-picker
        v-model="beginTime"
        type="datetime"
        class="dateClass"
        :disabled="!$store.state.runtime"
        clearable
        size="mini"
        placeholder="开始时间"
      >
      </el-date-picker>
    </div>

    <div class="block date">
      <el-date-picker
        v-model="endTime"
        class="dateClass"
        :disabled="!$store.state.runtime"
        type="datetime"
        clearable
        size="mini"
        placeholder="结束时间"
      >
      </el-date-picker>
    </div>

    <div class="options">
      <label class="radio" v-show="selectItems[0]">
        <input type="radio" name="dateType" class="inputNone" value="h" /><span
          @click="selected('h')"
          :style="intervalUnit === 'h' ? radioSelectStyles : radioStyles"
        ></span
        >小时
      </label>
      <label class="radio" v-show="selectItems[1]">
        <input type="radio" name="dateType" class="inputNone" value="d" /><span
          @click="selected('d')"
          :style="intervalUnit === 'd' ? radioSelectStyles : radioStyles"
        ></span
        >日
      </label>
      <label class="radio" v-show="selectItems[2]">
        <input type="radio" name="dateType" class="inputNone" value="W" /><span
          @click="selected('W')"
          :style="intervalUnit === 'W' ? radioSelectStyles : radioStyles"
        ></span
        >周
      </label>
      <label class="radio" v-show="selectItems[3]">
        <input type="radio" name="dateType" class="inputNone" value="M" /><span
          @click="selected('M')"
          :style="intervalUnit === 'M' ? radioSelectStyles : radioStyles"
        ></span
        >月
      </label>
      <label class="radio" v-show="selectItems[4]">
        <input type="radio" name="dateType" class="inputNone" value="q" /><span
          @click="selected('q')"
          :style="intervalUnit === 'q' ? radioSelectStyles : radioStyles"
        ></span
        >季度
      </label>
      <label class="radio" v-show="baisicConfig['日期类型'].value[5]">
        <input type="radio" name="dateType" class="inputNone" value="y" /><span
          @click="selected('y')"
          :style="intervalUnit === 'y' ? radioSelectStyles : radioStyles"
        ></span
        >年
      </label>
    </div>
    <button class="btn" :style="btnStyle" @click="search">查询</button>
  </div>
</template>
<script>
import translateConfig from "./dateSelect.js";
import moment from "moment";
export default {
  props: {
    theme: String
  },
  watch: {
    "$store.getters.theme": function() {
      this.themeChange();
    }
  },
  beforeDestroy() {
    this.$drag.deleteDateSelect(this.$parent);
  },
  methods: {
    init() {
      this.$drag.collectDateSelect(this.$parent);
    },
    themeChange() {
      let theme = this[this.theme];
      this.baisicConfig["字体"].value[2] = theme.color;
      this.baisicConfig["背景颜色"].value = theme.background;
      this.baisicConfig["按钮颜色"].value = theme.btnBackGround;
      this.initStyle(true);
    },
    resetStyle(data) {
      this[this.theme] = data[this.theme];
      this.baisicConfig = {
        ...this.baisicConfig,
        名称: {
          type: "input",
          value: "日期"
        },
        字体: {
          type: "fontThree",
          value: ["16px", "", "#B2DDFF"]
        },
        背景颜色: {
          type: "color-select",
          value: ""
        },
        按钮颜色: {
          type: "color-select",
          value: "rgb(53, 115, 193)"
        },
        显示度: {
          type: "slider",
          status: 1,
          range: [0, 100],
          value: 100
        }
      };
      this.themeChange();
    },
    translateConfig(item) {
      return translateConfig(item);
    },
    initStyle(bool) {
      let dateTypes = this.baisicConfig["日期类型"].value;
      this.selectItems = ["小时", "日", "周", "月", "季度", "年"].map(label => {
        return dateTypes.indexOf(label) !== -1;
      });
      let theme = this[this.theme];
      let fontSize = parseInt(this.baisicConfig["字体"].value[0].slice(0, -2));
      theme.color = this.baisicConfig["字体"].value[2];
      theme.background = this.baisicConfig["背景颜色"].value;
      theme.btnBackGround = this.baisicConfig["按钮颜色"].value;

      this.name = this.baisicConfig["名称"].value;
      this.radioStyles = {
        width: (fontSize * 7) / 8 + "px",
        height: (fontSize * 7) / 8 + "px",
        border: `1px solid ${this.baisicConfig["按钮颜色"].value}`
      };
      this.radioSelectStyles = {
        width: (fontSize * 2) / 5 + "px",
        height: (fontSize * 2) / 5 + "px",
        border: `${fontSize * 0.3}px solid ${
          this.baisicConfig["按钮颜色"].value
        }`,
        background: theme.radioBack
      };
      this.btnStyle = {
        color: theme.btnColor,
        fontSize: (fontSize * 7) / 8 + "px",
        background: this.baisicConfig["按钮颜色"].value
      };
      this.styles = {
        color: this.baisicConfig["字体"].value[2],
        background: this.baisicConfig["背景颜色"].value,
        fontFamily: this.baisicConfig["字体"].value[1],
        fontSize: this.baisicConfig["字体"].value[0],
        opacity: this.baisicConfig["显示度"].value / 100
      };
      if (!bool) {
        this.$parent.initStyle(
          this.baisicConfig["尺寸"].value,
          this.baisicConfig["位置"].value,
          this.baisicConfig["旋转角度"].value
        );
      }
    },
    selected(value) {
      this.intervalUnit = value;
    },
    search() {
      if (!this.$store.state.runtime) return;
      this.linkVmIds.forEach(id => {
        let comps =
          comps || this.$drag.centerConfigs[this.$drag.currentPageId].comps;
        let comp = comps.find(_comp => {
          if (_comp.id === id) {
            return true;
          }
        });
        comp.$refs.comp.toSearch({
          beginTime: moment(this.beginTime).format("YYYY-MM-DD HH:mm:ss"),
          endTime: moment(this.endTime).format("YYYY-MM-DD HH:mm:ss"),
          intervalUnit: this.intervalUnit
        });
      });
    },
    getSearchData() {
      return {
        beginTime: this.beginTime,
        endTime: this.endTime,
        intervalUnit: this.intervalUnit
      };
    }
  },
  data() {
    return {
      selectItems: [],
      name: "",
      linkVmIds: [], //被当前组件绑定的元素id合集
      beginTime: new Date(new Date() - 24 * 60 * 60 * 1000),
      endTime: new Date(),
      intervalUnit: "h",
      styles: {},
      radioStyles: {},
      btnStyle: {},
      radioSelectStyles: {},
      white: {
        color: "#41464D",
        background: "rgba(53, 115, 193,0)",
        btnBackGround: "#3573C1",
        radioBack: "rgba(53, 115, 193,0)",
        btnColor: "#FFFFFF"
      },
      black: {
        color: "#B2DDFF",
        background: "rgba(53, 115, 193,0)",
        btnBackGround: "rgb(53, 115, 193)",
        radioBack: "#b2ddff",
        btnColor: "#b2ddff"
      },
      baisicConfig: {
        尺寸: {
          type: "widthHeight",
          label: ["宽度", "高度"],
          value: [0, 0]
        },
        位置: {
          type: "widthHeight",
          label: ["横轴", "纵轴"],
          value: [0, 0]
        },
        线条: {
          type: "line"
        },
        名称: {
          type: "input",
          value: "日期"
        },
        字体: {
          type: "fontThree",
          value: ["16px", "", "#B2DDFF"]
        },
        背景颜色: {
          type: "color-select",
          value: ""
        },
        按钮颜色: {
          type: "color-select",
          value: "rgb(53, 115, 193)"
        },
        显示度: {
          type: "slider",
          status: 1,
          range: [0, 100],
          value: 100
        },
        样式还原: {
          type: "resetStyle"
        },
        线条2: {
          type: "line"
        },
        旋转角度: {
          type: "slider",
          status: 1,
          range: [0, 360],
          value: 0
        },
        日期类型: {
          type: "dateTypeCheckbox",
          value: ["小时", "日", "月"]
        }
      }
    };
  }
};
</script>
<style lang="less" scoped>
.symbolComp {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  white-space: nowrap;
  padding-left: 10px;
  box-sizing: border-box;
  align-items: center;
  white-space: nowrap;
  .inputNone {
    display: none;
  }
  .title {
    box-sizing: border-box;
    padding-left: 10px;
    font-weight: 400;
  }
  .btn {
    outline: none;
    cursor: pointer;
    padding: 4px 15px;
    border: none;
    min-width: 58px;
    min-height: 28px;
    border-radius: 4px;
    box-sizing: border-box;
  }
  .radio {
    span {
      cursor: pointer;
      display: inline-block;
      width: 12px;
      height: 12px;
      vertical-align: middle;
      border-radius: 50%;
      margin: 0 6px;
      box-sizing: content-box;
    }
  }
  .dateClass {
    font-size: 12px;
    width: auto;
    max-width: 180px;
    margin-left: 10px;
  }
  .options {
    margin: 0 20px;
    display: inline-block;
  }
  .block.date {
    margin-left: 10px;
    // width: calc();
  }
}
</style>
