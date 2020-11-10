<template>
  <div class="symbolComp" :style="styles" @click="showDialog">
    <div class="content" :style="style2">
      <div class="title" :style="fontStyle">
        {{ baisicConfig["标题"].value }}
      </div>
      <div class="temp-wrapper" :class="[{ active: highConfig.state }, theme]">
        <div
          :style="{
            fontSize: fontStyle.fontSize,
            fontFamily: fontStyle.fontFamily
          }"
        >
          <p class="num">{{ highConfig.curTemp }}℃</p>
          <p class="label">当前温度</p>
        </div>
        <div
          :style="{
            fontSize: fontStyle.fontSize,
            fontFamily: fontStyle.fontFamily
          }"
        >
          <p class="num">{{ highConfig.setTemp }}℃</p>
          <p class="label">设置温度</p>
        </div>
        <i class="iconfont iconoff"></i>
      </div>
      <ul class="btn-row" :class="theme">
        <li
          v-for="(item, index) in highConfig['模式响应值'].value"
          :key="index"
          :class="{
            active: item.value == highConfig.model && highConfig.state
          }"
          class="item"
        >
          <i class="iconfont" :class="item.iconClass"></i>
          <span
            :style="{
              fontSize: fontStyle.fontSize,
              fontFamily: fontStyle.fontFamily
            }"
            class="text"
            >{{ item.name }}</span
          >
        </li>
      </ul>
      <ul class="btn-row" :class="theme">
        <li
          v-for="(item, index) in highConfig['风速响应值'].value"
          :key="index"
          :class="{
            active: item.value == highConfig.winds && highConfig.state
          }"
          class="item"
        >
          <i class="iconfont" :class="item.iconClass"></i>
          <span
            :style="{
              fontSize: fontStyle.fontSize,
              fontFamily: fontStyle.fontFamily
            }"
            class="text"
            >{{ item.name }}</span
          >
        </li>
      </ul>
    </div>
    <el-dialog
      title="空调设置"
      :close-on-click-modal="false"
      :visible.sync="setDialog"
      :append-to-body="true"
      top="25vh"
      width="550px"
      custom-class="aircon-dialog"
    >
      <ul class="dialog_body">
        <li>
          <span class="set-label">温度设置：</span>
          <div class="btns-wrapper temp-wrapper">
            <input type="number" class="temp-input" v-model="setInfo.setTemp" />
            <span class="unit">℃</span>
          </div>
          <button class="set-btn" @click="setControl('setTemp')">设置</button>
        </li>
        <li>
          <span class="set-label">启停设置：</span>
          <div class="btns-wrapper temp-wrapper">
            <el-radio-group v-model="setInfo.state">
              <el-radio-button :label="highConfig['启停控制值'].value[0].value"
                ><i class="iconfont iconoff"></i>关闭</el-radio-button
              >
              <el-radio-button :label="highConfig['启停控制值'].value[1].value"
                ><i class="iconfont iconoff"></i>开启</el-radio-button
              >
            </el-radio-group>
          </div>
          <button class="set-btn" @click="setControl('state')">设置</button>
        </li>
        <li>
          <span class="set-label">风速设置：</span>
          <div class="btns-wrapper temp-wrapper">
            <el-radio-group v-model="setInfo.winds">
              <el-radio-button
                v-for="(item, index) in highConfig['风速控制值'].value"
                :key="item.value"
                :label="item.value"
                ><i
                  class="iconfont"
                  :class="highConfig['风速响应值'].value[index].iconClass"
                ></i
                >{{ item.name }}</el-radio-button
              >
            </el-radio-group>
          </div>
          <button class="set-btn" @click="setControl('winds')">设置</button>
        </li>
        <li>
          <span class="set-label">模式设置：</span>
          <div class="btns-wrapper temp-wrapper">
            <el-radio-group v-model="setInfo.model">
              <el-radio-button
                v-for="(item, index) in highConfig['模式控制值'].value"
                :key="item.value"
                :label="item.value"
                ><i
                  class="iconfont"
                  :class="highConfig['模式响应值'].value[index].iconClass"
                ></i
                >{{ item.name }}</el-radio-button
              >
            </el-radio-group>
          </div>
          <button class="set-btn" @click="setControl('model')">设置</button>
        </li>
      </ul>
      <span slot="footer" class="dialog-footer">
        <button class="confirm" @click="showDialog(true)">确 定</button>
        <button class="cancel" @click="showDialog(false)">取 消</button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import mixin from "@/component/mixin.js";
import translateConfig from "./config/airConditioner4.js";
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
        fontSize: this.baisicConfig["尺寸"].value[1] * 0.333 + "px",
        opacity: this.baisicConfig["显示度"].value / 100,
        background: this.baisicConfig["背景颜色-1"].value,
        border: `${this.baisicConfig["边框粗细"].value}px solid ${this.baisicConfig["边框颜色"].value}`
      };
      this.style2 = { background: this.baisicConfig["背景颜色-2"].value };
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
      this.endInitStyle(bool);
    },
    resetComp() {
      let height = this.baisicConfig["尺寸"].value[1];
      this.styles.fontSize = height * 0.333 + "px";
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
      this.highConfig.curTemp = val[1];
      this.highConfig.setTemp = val[2];
      this.highConfig.model = val[3];
      this.highConfig.winds = val[4];
    },
    // 显示设置弹窗
    showDialog(flag) {
      // flag为true，确认弹窗的操作设置
      if (!this.$store.state.runtime) return;
      if (this.$store.state.runtime && !this.pointState) {
        this.$message({
          message: "设备绑定不完善！",
          type: "error",
          duration: 3000,
          showClose: true
        });
        return;
      }
      this.setDialog = !this.setDialog;
      if (this.setDialog) {
        let config = this.highConfig;
        this.setInfo = {
          setTemp: config.setTemp,
          state: config.state,
          winds: config.winds,
          model: config.model
        };
      } else {
        if (!flag) return;
        let promiseArr = [];
        for (let key in this.setInfo) {
          promiseArr.push(this.setControl(key, 2));
        }
        Promise.all(promiseArr).then(data => {
          let flag = true;
          for (let i of data) {
            if (i.statusCode !== 200) {
              flag = false;
              break;
            }
          }
          if (flag) {
            this.$message({
              message: data[0].message,
              type: "success",
              duration: 3000,
              showClose: true
            });
          }
        });
      }
    },
    // 设置操作，type=1单次请求，2多次合并请求
    setControl(name, type = 1) {
      let keyMap = {
        state: "启停",
        setTemp: "设定温度",
        model: "模式",
        winds: "风速"
      };
      let points = this.highConfig[keyMap[name] + "--控制"].value;
      let value = parseInt(this.setInfo[name]);
      let param = [
        {
          pointId: points[points.length - 1],
          value
        }
      ];
      this.highConfig[name] = value;
      if (type === 1) {
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
      } else if (type === 2) {
        return bulkSet(param);
      }
    },
    getPointState() {
      const points = [
        "启停--响应",
        "启停--控制",
        "当前温度--响应",
        "设定温度--响应",
        "设定温度--控制",
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
      let collectPointIds = [
        this.highConfig["启停--响应"].value,
        this.highConfig["当前温度--响应"].value,
        this.highConfig["设定温度--响应"].value,
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
      style2: {},
      fontStyle: {},
      fontRatio: 0.047,
      setDialog: false,
      setInfo: {
        setTemp: "",
        state: "",
        winds: "",
        model: ""
      },
      black: {
        字体2: "#fff",
        "背景颜色-1": "#18191D",
        "背景颜色-2": "#24252A",
        边框颜色: "rgba(0, 0, 0, 0)"
      },
      white: {
        字体2: "#455A64",
        "背景颜色-1": "#fff",
        "背景颜色-2": "#eee",
        边框颜色: "rgba(0, 0, 0, 0)"
      },
      pointState: false,
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
        字体: {
          type: "fontThrees",
          value: [14, "", "#fff"]
        },
        "背景颜色-1": {
          type: "color-select",
          value: "#24252A"
        },
        "背景颜色-2": {
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
        线条3: {
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
        "当前温度--响应": {
          type: "dataTree",
          value: []
        },
        线条2: {
          type: "line"
        },
        "设定温度--响应": {
          type: "dataTree",
          value: []
        },
        "设定温度--控制": {
          type: "dataTree",
          value: []
        },
        线条3: {
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
              iconClass: "iconcooling-black"
            },
            {
              name: "制热",
              value: 1,
              inputType: "number",
              iconClass: "iconheating-black"
            },
            {
              name: "通风",
              value: 2,
              inputType: "number",
              iconClass: "iconairness-black"
            },
            {
              name: "除湿",
              value: 3,
              inputType: "number",
              iconClass: "iconwet-black"
            }
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
            { name: "通风", value: 2, inputType: "number" },
            { name: "除湿", value: 3, inputType: "number" }
          ]
        },
        线条4: {
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
              name: "自动",
              value: 0,
              inputType: "number",
              iconClass: "iconauto-black"
            },
            {
              name: "低风",
              value: 1,
              inputType: "number",
              iconClass: "iconlow-black"
            },
            {
              name: "中风",
              value: 2,
              inputType: "number",
              iconClass: "iconmid-black"
            },
            {
              name: "高风",
              value: 3,
              inputType: "number",
              iconClass: "iconhigh-black"
            }
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
        线条5: {
          type: "line"
        },
        curTemp: 28.2,
        setTemp: 25,
        state: "非0",
        model: 3,
        winds: 2
      }
    };
  }
};
</script>

<style lang="less" scoped>
.symbolComp {
  position: relative;
  padding: 0.15em;
  width: calc(100%);
  height: calc(100%);
  box-sizing: border-box;
  white-space: pre;
  overflow: hidden;
  font-size: 100px;
  .content {
    padding: 20px;
    height: 100%;
    box-sizing: border-box;
  }
  .title {
    padding-bottom: 0.8em;
    white-space: normal;
  }
  .temp-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.15em;
    padding: 0 0.2em;
    height: 0.81em;
    border-radius: 0.06em;
    background: rgb(24, 25, 29);
    > div {
      padding: 10px 0;
    }
    p {
      margin: 0;
    }
    .iconfont {
      font-size: 0.28em;
    }
    .num {
      font-size: 1.867em;
    }
    .label {
      font-size: 0.933em;
    }
  }
  .btn-row {
    display: flex;
    align-items: center;
    margin-bottom: 0.1em;
    > li {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-right: 1px;
      padding: 0.1em 0;
      width: calc(25% - 1px);
      height: 0.46em;
      box-sizing: border-box;
      border: 1px solid #566777;
      &:last-child {
        margin: 0;
      }
      .iconfont {
        margin-right: 0.3em;
        font-size: 0.2em;
      }
      .text {
        white-space: normal;
      }
    }
  }
  .black {
    color: #fff;
  }
  .white {
    color: #455a64;
    &.temp-wrapper,
    > li {
      background: rgb(221, 221, 221);
    }
  }
  .temp-wrapper.active,
  li.active {
    color: #fff;
    background: #3573c1;
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
.el-dialog__wrapper {
  /deep/ .aircon-dialog {
    padding: 0 18px;
    background: rgb(47, 49, 56);
    .el-dialog__header {
      padding: 0;
      height: 50px;
      line-height: 50px;
      box-sizing: border-box;
      border-bottom: 1px solid #3f424b;
      .el-dialog__title {
        color: #fff;
        font-size: 16px;
        line-height: unset;
      }
    }
    .dialog_body {
      > li {
        position: relative;
        display: flex;
        align-items: center;
        margin-bottom: 15px;
        cursor: default;
        .set-label {
          color: #fff;
        }
        .btns-wrapper {
          padding-left: 10px;
        }
        .temp-wrapper {
          position: relative;
        }
        .temp-input {
          padding-left: 12px;
          padding-right: 25px;
          width: 70px;
          height: 30px;
          box-sizing: border-box;
          border: 1px solid #404753;
          color: #b2ddff;
          outline: none;
          background-color: #24252a;
        }
        .unit {
          position: absolute;
          right: 10px;
          top: 50%;
          color: #b2ddff;
          transform: translateY(-50%);
        }
        .el-radio-button {
          margin-right: 10px;
        }
        .el-radio-button__orig-radio:checked + .el-radio-button__inner {
          background-color: #3573c1;
          box-shadow: unset;
        }
        .el-radio-button__inner {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
          width: 70px;
          height: 30px;
          border-left: 1px solid #404753;
          border-radius: 0;
          border-color: #404753;
          font-size: 13px;
          color: #b2ddff;
          background-color: #24252a;
        }
        .iconfont {
          margin-right: 6px;
          color: #fff;
        }
        .set-btn {
          position: absolute;
          right: 0;
          top: 0;
          width: 60px;
          height: 28px;
          background-color: #3573c1;
          color: #fff;
          outline: none;
          border: 0;
          cursor: pointer;
        }
      }
    }
    .el-dialog__footer {
      border-top: 1px solid #3f424b;
      button {
        padding: 5px 28px;
        background-color: #3573c1;
        border: 0;
        border-radius: 0;
        font-size: 14px;
        outline: none;
        color: #fff;
        cursor: pointer;
        &.cancel {
          background-color: #24252a;
          color: #fff;
          margin-left: 20px;
        }
      }
    }
  }
}
</style>
