<template>
  <div class="date-search">
    <div class="title" :style="labelStyle">查询条件</div>
    <div class="block date">
      <el-date-picker
        v-model="sourceTime"
        type="datetime"
        class="dateClass"
        :disabled="!$store.state.runtime"
        clearable
        size="mini"
        placeholder="开始时间"
        :style="selectStyles"
      ></el-date-picker>
    </div>
    <div class="title" style="margin-left:10px" :style="labelStyle">
      统计时间
    </div>
    <div class="block date">
      <el-date-picker
        v-model="compareTime"
        class="dateClass"
        :disabled="!$store.state.runtime"
        type="datetime"
        clearable
        size="mini"
        placeholder="结束时间"
        :style="selectStyles"
      ></el-date-picker>
    </div>
    <div class="title" style="margin-left:10px" :style="labelStyle">
      查询间隔
    </div>
    <div class="block date">
      <el-select
        v-model="queryIntervalUnit"
        class="dateClass"
        placeholder="请选择"
        size="mini"
        :style="selectStyles"
        @change="changeQuery"
      >
        <el-option
          v-for="item in UnitOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
    </div>
    <div class="title" style="margin-left:10px" :style="labelStyle">
      统计间隔
    </div>
    <div class="block date">
      <el-select
        v-model="interIntervalUnit"
        clearable
        class="dateClass"
        placeholder="请选择"
        size="mini"
        :style="selectStyles"
      >
        <el-option
          v-for="item in interUnitOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
    </div>
    <button class="btn" style="color:#fff" :style="btnStyle" @click="search">
      查询
    </button>
  </div>
</template>
<script>
export default {
  props: {
    theme: String,
    config: {
      type: Object
    }
  },
  data() {
    return {
      radioSelectStyles: {},
      btnStyle: {},
      selectStyles: {},
      labelStyle: {},
      dateTypes: [],
      sourceTime: new Date(new Date() - 24 * 60 * 60 * 1000),
      compareTime: new Date(),
      queryIntervalUnit: "M",
      interIntervalUnit: null,
      UnitOptions: [],
      interUnitOptions: []
    };
  },
  methods: {
    editUnitOption(arrs) {
      let options = [
        {
          value: "d",
          label: "日"
        },
        {
          value: "w",
          label: "周"
        },
        {
          value: "M",
          label: "月"
        },
        {
          value: "q",
          label: "季"
        },
        {
          value: "y",
          label: "年"
        }
      ];
      let UnitOptions = [];
      for (let i = 0; i < arrs.length; i++) {
        if (arrs[i]) {
          let obj = options[i];
          UnitOptions.push(obj);
        }
      }
      this.UnitOptions = UnitOptions;
      this.queryIntervalUnit = UnitOptions[UnitOptions.length - 1].value;
      this.changeQuery();
    },
    selected(value) {
      this.interIntervalUnit = value;
      let dateTypeConfig = this.config["日期类型"];

      if (dateTypeConfig) {
        dateTypeConfig.value = value;
      }
    },
    processStyles(config) {
      if (config) {
        let selectStyles = {};
        let btnStyle = {};
        let labelStyle = {};
        let searchFontConfig = config["查询条件字体"];
        if (searchFontConfig) {
          let searchFont = searchFontConfig.value;
          if (searchFont) {
            let fontSize = searchFont[0];
            if (fontSize) {
              selectStyles["fontSize"] = `${+fontSize.split("px")[0] - 4}px`;
              btnStyle["fontSize"] = fontSize;
              labelStyle["fontSize"] = fontSize;
            }

            let fontFamily = searchFont[1];
            if (fontFamily) {
              selectStyles["fontFamily"] = fontFamily;
              btnStyle["fontFamily"] = fontFamily;
              labelStyle["fontFamily"] = fontFamily;
            }

            let fontColor = searchFont[2];
            if (fontColor) {
              selectStyles["color"] = fontColor;
              labelStyle["color"] = fontColor;
            }
          }
        }

        let dateTypesConfig = config["日期类型"];
        if (dateTypesConfig) {
          let dateTypes = dateTypesConfig.values || [];
          this.dateTypes = dateTypes;
          this.intervalUnit = dateTypesConfig.value;
        }

        let btnColorConfig = config["按钮颜色"];
        if (btnColorConfig) {
          let btnColor = btnColorConfig.value;
          btnStyle.borderColor = btnColor;
          btnStyle.backgroundColor = btnColor;
        }
        this.labelStyle = labelStyle;
        this.btnStyle = btnStyle;
        this.selectStyles = selectStyles;
      }
    },
    isChecked(type) {
      return type === this.intervalUnit;
    },
    changeQuery() {
      switch (this.queryIntervalUnit) {
        case "d":
          this.interUnitOptions = [
            {
              value: "h",
              label: "小时"
            }
          ];
          break;
        case "w":
          this.interUnitOptions = [
            {
              value: "h",
              label: "小时"
            },
            {
              value: "d",
              label: "日"
            }
          ];
          break;
        case "M":
          this.interUnitOptions = [
            {
              value: "h",
              label: "小时"
            },
            {
              value: "d",
              label: "日"
            },
            {
              value: "w",
              label: "周"
            }
          ];
          break;
        case "q":
          this.interUnitOptions = [
            {
              value: "h",
              label: "小时"
            },
            {
              value: "d",
              label: "日"
            },
            {
              value: "w",
              label: "周"
            },
            {
              value: "M",
              label: "月"
            }
          ];
          break;
        case "y":
          this.interUnitOptions = [
            {
              value: "h",
              label: "小时"
            },
            {
              value: "d",
              label: "日"
            },
            {
              value: "w",
              label: "周"
            },
            {
              value: "M",
              label: "月"
            },
            {
              value: "q",
              label: "季度"
            }
          ];
          break;

        default:
          this.interUnitOptions = [];
          this.interIntervalUnit = null;
          break;
      }
      this.interIntervalUnit = null;
    },
    search() {
      this.$emit("search", {
        sourceTime: this.sourceTime,
        compareTime: this.compareTime,
        intervalUnit: this.interIntervalUnit,
        queryIntervalUnit: this.queryIntervalUnit
      });
    },
    update(config) {
      this.processStyles(config);
    }
  }
};
</script>
<style lang="less" scoped>
.date-search {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  white-space: nowrap;
  align-items: center;
  white-space: nowrap;
  .inputNone {
    display: none;
  }
  .title {
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
    color: #b2ddff;
    background-color: #3573c1;
    margin: 0 20px;
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
      // box-sizing: content-box;
      border: 1px solid #404753;
    }
    [type="radio"]:checked + span {
      background-color: #b2ddff;
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
    // width: calc();
  }
}
</style>
