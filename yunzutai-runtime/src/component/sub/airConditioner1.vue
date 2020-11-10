<template>
  <div class="symbolComp" :style="styles">
    <div class="title">
      <span class="titleText" :style="fontStyle">{{
        baisicConfig["标题"].value
      }}</span>
      <el-switch
        ref="switch"
        v-model="highConfig.state"
        active-text="ON"
        inactive-text="OFF"
        :active-value="highConfig['启停响应值'].value[1].value"
        :inactive-value="highConfig['启停响应值'].value[0].value"
        @change="switchChange"
      ></el-switch>
    </div>
    <div class="content" :class="theme">
      <i class="iconfont iconaircon-black aircon-img"></i>
      <span class="temperature">
        <i class="iconfont icontianjia" @click="editNum('add')"></i>
        <span class="text" :style="fontStyle">
          {{ highConfig.temperature }}℃
        </span>
        <i class="iconfont" @click="editNum('dec')">—</i>
      </span>
    </div>
    <div class="btn-row" :class="theme">
      <i
        class="iconfont"
        v-for="(item, index) in modelArr"
        :key="item"
        :class="[
          item,
          {
            active:
              highConfig.model == highConfig['模式响应值'].value[index].value
          }
        ]"
        @click="setControl(highConfig['模式控制值'].value[index].value, '模式')"
      ></i>
      <i
        class="iconfont"
        v-for="(item, index) in windArr"
        :key="item"
        :class="[
          item,
          {
            active:
              highConfig.winds == highConfig['风速响应值'].value[index].value
          }
        ]"
        @click="setControl(highConfig['风速控制值'].value[index].value, '风速')"
      ></i>
    </div>
    <div
      class="mask"
      v-show="highConfig.state != highConfig['启停响应值'].value[1].value"
    ></div>
  </div>
</template>
<script>
import mixin from "@/component/mixin.js";
import translateConfig from "./config/airConditioner1.js";
import { bulkSet } from "@/api/bulk.js";
export default {
  mixins: [mixin],
  props: {
    theme: String
  },
  methods: {
    init() {
      this.getPointState();
      this.fontRatio = (
        this.baisicConfig["字体"].value[0] / this.baisicConfig["尺寸"].value[1]
      ).toFixed(3);
    },
    initStyle(bool, type) {
      this.startInitStyle();
      this.styles = {
        fontSize: this.baisicConfig["尺寸"].value[1] * 0.5 + "px",
        opacity: this.baisicConfig["显示度"].value / 100,
        background: this.baisicConfig["背景颜色"].value,
        border: `${this.baisicConfig["边框粗细"].value}px solid ${this.baisicConfig["边框颜色"].value}`
      };
      let font = this.baisicConfig["字体"].value;
      // 记录手动设置字体大小时的信息
      if (type === "字体") {
        this.fontRatio = (
          this.baisicConfig["字体"].value[0] /
          this.baisicConfig["尺寸"].value[1]
        ).toFixed(3);
      }
      this.fontStyle = {
        fontSize: font[0] + "px",
        fontFamily: font[1],
        color: font[2]
      };
      // 开关组件设置字体
      let switchCom = this.$refs.switch.$el.querySelectorAll(
        ".el-switch__label span"
      );
      switchCom[0].style.fontSize = font[0] + "px";
      switchCom[1].style.fontSize = font[0] + "px";
      this.endInitStyle(bool);
    },
    resetComp() {
      let height = this.baisicConfig["尺寸"].value[1];
      this.styles.fontSize = height * 0.5 + "px";
      let fontSize = parseInt(height * this.fontRatio);
      fontSize = fontSize > 12 ? fontSize : 12;
      this.fontStyle.fontSize = fontSize + "px";
      this.baisicConfig["字体"].value = [
        fontSize,
        this.baisicConfig["字体"].value[1],
        this.baisicConfig["字体"].value[2]
      ];
      // 开关组件设置字体
      let switchCom = this.$refs.switch.$el.querySelectorAll(
        ".el-switch__label span"
      );
      switchCom[0].style.fontSize = fontSize + "px";
      switchCom[1].style.fontSize = fontSize + "px";
    },
    pointIdChange(val) {
      if (!val) return;
      this.highConfig.state = val[0];
      this.highConfig.temperature = val[1];
      this.highConfig.model = val[2];
      this.highConfig.winds = val[3];
      if (
        this.highConfig["启停响应值"].value[1].value == "非0" &&
        val[0] != 0
      ) {
        this.highConfig.state = "非0";
      }
    },
    switchChange(val) {
      if (this.$store.state.runtime && !this.pointState) {
        this.$message({
          message: "设备绑定不完善！",
          type: "error",
          duration: 3000,
          showClose: true
        });
        return;
      }
      this.setControl(val, "启停");
    },
    editNum(type) {
      if (this.$store.state.runtime && !this.pointState) {
        this.$message({
          message: "设备绑定不完善！",
          type: "error",
          duration: 3000,
          showClose: true
        });
        return;
      }
      let temp = this.highConfig.temperature;
      if (type === "add" && temp < this.baisicConfig["温度范围"].value[1]) {
        this.setControl(++this.highConfig.temperature, "温度");
        return;
      }
      if (type === "dec" && temp > this.baisicConfig["温度范围"].value[0]) {
        this.setControl(--this.highConfig.temperature, "温度");
      }
    },
    setControl(value, name) {
      if (!this.$store.state.runtime) return;
      let points = this.highConfig[name + "--控制"].value;
      let param = [
        {
          pointId: points[points.length - 1],
          value
        }
      ];
      let keyMap = {
        启停: "state",
        温度: "temperature",
        模式: "model",
        风速: "winds"
      };
      this.highConfig[keyMap[name]] = value;
      bulkSet(param)
        .then(res => {
          if (res.statusCode !== 200) return;
          this.$message({
            message: res.message,
            type: "success",
            duration: 3000,
            showClose: true
          });
        })
        .catch(err => {
          this.$message.error(err.message);
        });
    },
    getPointState() {
      const points = [
        "启停--响应",
        "启停--控制",
        "温度--响应",
        "温度--控制",
        "模式--响应",
        "模式--控制",
        "风速--响应",
        "风速--控制"
      ];
      let flag = true;
      for (let i of points) {
        if (!this.highConfig[i].value || !this.highConfig[i].value.length) {
          flag = false;
          break;
        }
      }
      this.pointState = flag;
    },
    translateConfig(item) {
      return translateConfig(item);
    },
    returnConfig() {
      this.getPointState();
      let collectPointIds = [
        this.highConfig["启停--响应"].value,
        this.highConfig["温度--响应"].value,
        this.highConfig["模式--响应"].value,
        this.highConfig["风速--响应"].value
      ];
      collectPointIds = this.pointState ? collectPointIds : [];
      return {
        collectPointIds,
        white: this.white,
        black: this.black,
        highConfig: this.highConfig,
        baisicConfig: this.baisicConfig
      };
    }
  },
  data() {
    return {
      styles: {},
      fontStyle: {},
      fontRatio: 0.08,
      black: {
        字体2: "#fff",
        背景颜色: "#24252A",
        边框颜色: "rgba(0, 0, 0, 0)"
      },
      white: {
        字体2: "#455A64",
        背景颜色: "#DFE5EA",
        边框颜色: "#ddd"
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
        线条1: {
          type: "line"
        },
        标题: {
          type: "input",
          value: "办公室"
        },
        线条2: {
          type: "line"
        },
        温度范围: {
          type: "numRange",
          value: [17, 30]
        },
        线条3: {
          type: "line"
        },
        字体: {
          type: "fontThrees",
          value: [16, "", "#fff"]
        },
        背景颜色: {
          type: "color-select",
          value: "#24252A"
        },
        边框颜色: {
          type: "color-select",
          value: ""
        },
        边框粗细: {
          type: "slider",
          status: 1,
          range: [0, 10],
          value: 1
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
        线条4: {
          type: "line"
        },
        旋转角度: {
          type: "slider",
          status: 1,
          range: [0, 360],
          value: 0
        }
      },
      highConfig: {
        添加数据: {
          type: "explain"
        },
        "启停--响应": {
          type: "dataTree",
          value: []
        },
        启停响应值: {
          type: "mulInput",
          title: "响应值",
          value: [
            { name: "关", value: 0, inputType: "stateLinkage" },
            { name: "开", value: "非0", inputType: "stateLinkage" }
          ]
        },
        "启停--控制": {
          type: "dataTree",
          value: []
        },
        启停控制值: {
          type: "mulInput",
          title: "控制值",
          value: [
            { name: "关", value: 0, inputType: "number" },
            { name: "开", value: 1, inputType: "number" }
          ]
        },
        线条1: {
          type: "line"
        },
        "温度--响应": {
          type: "dataTree",
          value: []
        },
        "温度--控制": {
          type: "dataTree",
          value: []
        },
        线条2: {
          type: "line"
        },
        "模式--响应": {
          type: "dataTree",
          value: []
        },
        模式响应值: {
          type: "mulInput",
          title: "响应值",
          value: [
            { name: "制冷", value: 0, inputType: "number" },
            { name: "制热", value: 1, inputType: "number" },
            { name: "通风", value: 2, inputType: "number" }
          ]
        },
        "模式--控制": {
          type: "dataTree",
          value: []
        },
        模式控制值: {
          type: "mulInput",
          title: "控制值",
          value: [
            { name: "制冷", value: 0, inputType: "number" },
            { name: "制热", value: 1, inputType: "number" },
            { name: "通风", value: 2, inputType: "number" }
          ]
        },
        线条3: {
          type: "line"
        },
        "风速--响应": {
          type: "dataTree",
          value: []
        },
        风速响应值: {
          type: "mulInput",
          title: "响应值",
          value: [
            { name: "自动", value: 0, inputType: "number" },
            { name: "低风", value: 1, inputType: "number" },
            { name: "中风", value: 2, inputType: "number" },
            { name: "高风", value: 3, inputType: "number" }
          ]
        },
        "风速--控制": {
          type: "dataTree",
          value: []
        },
        风速控制值: {
          type: "mulInput",
          title: "控制值",
          value: [
            { name: "自动", value: 0, inputType: "number" },
            { name: "低风", value: 1, inputType: "number" },
            { name: "中风", value: 2, inputType: "number" },
            { name: "高风", value: 3, inputType: "number" }
          ]
        },
        线条4: {
          type: "line"
        },
        temperature: 24,
        state: "非0",
        model: 1,
        winds: 3
      },
      modelArr: ["iconcooling-black", "iconheating-black", "iconairness-black"],
      windArr: [
        "iconauto-black",
        "iconlow-black",
        "iconmid-black",
        "iconhigh-black"
      ],
      pointState: false
    };
  }
};
</script>

<style lang="less" scoped>
.symbolComp {
  position: relative;
  padding: 0 20px;
  width: calc(100%);
  height: calc(100%);
  box-sizing: border-box;
  white-space: pre;
  overflow: hidden;
  font-size: 100px;
  .title {
    position: relative;
    padding-top: 10px;
    height: 10%;
    box-sizing: border-box;
    .titleText {
      display: block;
    }
    /deep/ .el-switch {
      position: absolute;
      right: 0;
      top: 0.12em;
      z-index: 2;
      font-size: 100%;
      .el-switch__label {
        display: none;
        height: auto;
        line-height: 1;
        font-size: 0.14em;
        span {
          font-size: 100%;
        }
        &.is-active {
          display: block;
          z-index: 1;
          color: #fff;
        }
      }
      .el-switch__core {
        width: 0.6em !important;
        height: 0.2em;
        border-radius: 0.1em;
        &::after {
          top: 50%;
          left: 0.01em;
          width: 0.16em;
          height: 0.16em;
          transform: translateY(-50%);
        }
      }
      &.is-checked .el-switch__core::after {
        left: 100%;
        margin-left: -0.17em;
      }
      .el-switch__label--left {
        position: absolute;
        right: 0.5em;
        z-index: -1;
        margin-right: 0;
      }
      .el-switch__label--right {
        position: absolute;
        left: 0.5em;
        z-index: -1;
        margin-left: 0;
      }
    }
  }
  .content {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    padding: 0.1em 0 0.2em;
    height: 60%;
    box-sizing: border-box;
    border-bottom: 1px solid #18191d;
    .aircon-img {
      // height: 0.75em;
      width: auto;
      height: auto;
      line-height: 1;
      font-size: 0.7em;
      cursor: default;
    }
    .temperature {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 54%;
      .text {
        font-size: 0.16em;
      }
    }
  }
  .btn-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 30%;
  }
  .iconfont {
    width: 1.4em;
    height: 1.4em;
    line-height: 1.4em;
    border: 2px solid #fff;
    border-radius: 50%;
    font-size: 0.3em;
    text-align: center;
  }
  .black {
    color: #fff;
    .iconfont {
      border: 2px solid #fff;
    }
  }
  .white {
    color: #455a64;
    .iconfont {
      border: 2px solid #455a64;
    }
  }
  .white .iconfont,
  .black .iconfont {
    &.aircon-img {
      border: none;
    }
    &.active {
      color: #3573c1;
      border: 2px solid #3573c1;
    }
  }
  .mask {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    z-index: 1;
    background: rgba(36, 37, 42, 0.5);
  }
}
</style>
