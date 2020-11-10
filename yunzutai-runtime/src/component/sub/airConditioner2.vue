<template>
  <div class="symbolComp" :style="outerStyles" @click="openAircon">
    <div class="content" :style="{ ...styles, backgroundColor: bgColor }">
      <div class="temperature-outer">
        <div class="temperature" :style="fontStyle">
          <span class="num">{{ highConfig.temperature }}</span>
          <span class="unit">℃</span>
        </div>
      </div>
      <div class="btn-row" :class="theme">
        <i
          class="iconfont"
          v-for="(item, index) in highConfig['模式响应值'].value"
          :key="index"
          :class="item.iconClass"
          v-show="highConfig.model == item.value"
        ></i>
        <i
          class="iconfont"
          v-for="item in highConfig['风速响应值'].value"
          :key="item.iconClass"
          :class="item.iconClass"
          v-show="highConfig.winds == item.value"
        ></i>
      </div>
    </div>
    <div
      class="mask"
      :style="bgStyles"
      v-show="highConfig.state == highConfig['启停响应值'].value[0].value"
    >
      <i class="iconfont iconoff"></i>
    </div>
  </div>
</template>
<script>
import mixin from "@/component/mixin.js";
import translateConfig from "./config/airConditioner2.js";
import { bulkSet } from "@/api/bulk.js";
export default {
  mixins: [mixin],
  props: {
    theme: String
  },
  computed: {
    bgColor() {
      let color = this.highConfig["模式响应值"].value[0].color;
      for (let item of this.highConfig["模式响应值"].value) {
        if (item.value == this.highConfig.model) {
          color = item.color;
          break;
        }
      }
      return color;
    }
  },
  methods: {
    init() {
      this.getPointState();
      this.fontRatio = (
        this.baisicConfig["字体"].value[0] / this.baisicConfig["尺寸"].value[1]
      ).toFixed(3);
    },
    initStyle(bool, type) {
      let { baisicConfig } = this.startInitStyle();
      this.styles = {
        border: `${baisicConfig["边框粗细"].value}px solid ${baisicConfig["边框颜色"].value}`
      };
      this.bgStyles = { background: baisicConfig["背景颜色-关闭状态"].value };
      this.outerStyles = {
        opacity: baisicConfig["显示度"].value / 100,
        fontSize: baisicConfig["尺寸"].value[1] * 0.5 + "px"
      };
      let font = baisicConfig["字体"].value;
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
      this.endInitStyle(bool);
    },
    resetComp() {
      let width = this.baisicConfig["尺寸"].value[0];
      let height = this.baisicConfig["尺寸"].value[1];
      if (height / width > 1.421) {
        // 以宽为准
        this.outerStyles.fontSize = width * 0.71 + "px";
      } else {
        // 以高为准
        this.outerStyles.fontSize = height * 0.5 + "px";
      }
      let fontSize = parseInt(height * this.fontRatio);
      fontSize = fontSize > 12 ? fontSize : 12;
      this.fontStyle.fontSize = fontSize + "px";
      this.baisicConfig["字体"].value = [
        fontSize,
        this.baisicConfig["字体"].value[1],
        this.baisicConfig["字体"].value[2]
      ];
    },
    pointIdChange(val) {
      if (!val) return;
      this.highConfig.state = val[0];
      this.highConfig.temperature = val[1];
      this.highConfig.model = val[2];
      this.highConfig.winds = val[3];
    },
    openAircon() {
      if (this.$store.state.runtime && !this.pointState) {
        this.$message({
          message: "设备绑定不完善！",
          type: "error",
          duration: 3000,
          showClose: true
        });
        return;
      }
      for (let i of this.highConfig["启停控制值"].value) {
        if (i.value != this.highConfig.state) {
          this.highConfig.state = i.value;
          break;
        }
      }
      if (!this.$store.state.runtime) return;
      let points = this.highConfig["启停--控制"].value;
      let param = [
        {
          pointId: points[points.length - 1],
          value: this.highConfig.state
        }
      ];
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
        "模式--响应",
        "风速--响应"
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
      let collectPointIds = [
        this.highConfig["启停--响应"].value,
        this.highConfig["温度--响应"].value,
        this.highConfig["模式--响应"].value,
        this.highConfig["风速--响应"].value
      ];
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
      bgStyles: {},
      fontStyle: {},
      outerStyles: {},
      fontRatio: 0.344,
      black: {
        字体2: "#fff",
        "背景颜色-关闭状态": "#B2DDFF",
        边框颜色: "rgba(0, 0, 0, 0)"
      },
      white: {
        字体2: "#fff",
        "背景颜色-关闭状态": "#B2DDFF",
        边框颜色: "rgba(0, 0, 0, 0)"
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
        字体: {
          type: "fontThrees",
          value: [22, "", "#fff"]
        },
        背景开启: {
          type: "mulInput",
          title: "背景颜色-开启状态",
          value: [
            { name: "制冷", value: "#3573C1", inputType: "colorShow" },
            { name: "制热", value: "#F1921C", inputType: "colorShow" },
            { name: "通风", value: "#33A567", inputType: "colorShow" }
          ]
        },
        "背景颜色-关闭状态": {
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
        线条2: {
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
            {
              name: "制冷",
              value: 0,
              inputType: "number",
              iconClass: "iconcooling-black",
              color: "#3573C1"
            },
            {
              name: "制热",
              value: 1,
              inputType: "number",
              iconClass: "iconheating-black",
              color: "#F1921C"
            },
            {
              name: "通风",
              value: 2,
              inputType: "number",
              iconClass: "iconairness-black",
              color: "#33A567"
            }
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
            {
              name: "低风",
              value: 0,
              inputType: "number",
              iconClass: "iconlow"
            },
            {
              name: "中风",
              value: 1,
              inputType: "number",
              iconClass: "iconmid"
            },
            {
              name: "高风",
              value: 2,
              inputType: "number",
              iconClass: "iconhigh"
            }
          ]
        },
        线条4: {
          type: "line"
        },
        temperature: 24,
        state: "非0",
        model: 0,
        winds: 2
      },
      pointState: false
    };
  }
};
</script>

<style lang="less" scoped>
.symbolComp {
  position: relative;
  width: calc(100%);
  height: calc(100%);
  box-sizing: border-box;
  white-space: pre;
  overflow: hidden;
  font-size: 100px;
  .content {
    padding: 0.1em;
    height: 100%;
    box-sizing: border-box;
    .temperature-outer {
      display: flex;
      align-items: flex-end;
      justify-content: center;
      height: 50%;
      box-sizing: border-box;
      border-bottom: 1px solid #fff;
    }
    .temperature {
      overflow: hidden;
      vertical-align: baseline;
      text-align: center;
      .num {
        font-size: 100%;
      }
      .unit {
        font-size: 0.6em;
      }
    }
  }
  .btn-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 50%;
    color: #fff;
  }
  .iconfont {
    width: 1.4em;
    height: 1.4em;
    line-height: 1.4em;
    font-size: 0.6em;
    text-align: center;
  }
  .mask {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    z-index: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #fff;
    .iconfont {
      font-size: 0.9em;
      color: #1d1e22;
    }
  }
}
</style>
