<template>
  <div>
    <div class="title">
      <el-checkbox
        v-if="config.value.length === 6"
        v-model="config.value[5]"
        @change="onChange(null, true)"
      ></el-checkbox>
      <span>{{ title }}</span>
    </div>
    <div v-show="!config.note || config.value[5]">
      <el-input
        v-model="config.value[0]"
        :placeholder="'请输入' + title"
        @input="onChange"
        @change="onChange"
        @blur="onFinalChange"
      ></el-input>
    </div>
    <div
      class="body"
      style="margin-top:10px;"
      v-show="!config.note || config.value[5]"
    >
      <div class="rows">
        <select v-model="config.value[1]" @change="onChange(null, true)">
          <option
            v-for="item in options1"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></option>
        </select>
      </div>
      <div class="rows">
        <select v-model="config.value[2]" @change="onChange(null, true)">
          <option
            v-for="item in options2"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></option>
        </select>
      </div>
      <div
        class="rows"
        @mousedown.stop="change(1)"
        :style="{ 'font-weight': config.value[3] }"
      >
        <span>B</span>
      </div>
      <div class="rows">
        <span>A</span>
        <div class="text-color">
          <color-picker v-model="color1" @change="setColor" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {
  predefineColors,
  fontFamily,
  fontBold,
  fontSize14To36
} from "./common";
export default {
  props: {
    title: String,
    config: Object,
    onChange: Function
  },
  data() {
    return {
      oTitle: null,
      color1: "rgba(255,255,255,1)",
      options3: fontBold,
      options2: fontFamily,
      options1: fontSize14To36,
      predefineColors: predefineColors
    };
  },
  mounted() {
    if (this.config) {
      this.oTitle = this.config.value[0];
    }
  },
  methods: {
    setColor() {
      this.config.value[4] = this.color1;
      this.onChange(null, true);
    },
    onFinalChange() {
      let nTitle = this.config.value[0];
      if (nTitle !== this.oTitle) {
        this.onChange(null, true);
      }
      this.oTitle = nTitle;
    },
    change(type) {
      switch (type) {
        case 1:
          // eslint-disable-next-line no-case-declarations
          let val = this.config.value[3];
          this.config.value[3] = val === "normal" ? "bold" : "normal";
          this.onChange(null, true);
          break;
        default:
          break;
      }
    }
  }
};
</script>

<style lang="less" scoped>
.body {
  height: 28px;
  line-height: 28px;
  background: white;
  color: #282828;
  border-radius: 4px;
  .rows {
    height: calc(100%);
    position: relative;
    width: 25%;
    text-align: center;
    cursor: pointer;
    box-sizing: border-box;
    position: relative;
    .text-color {
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      opacity: 0;
    }
    select {
      border-radius: 4px;
      width: calc(100%);
      height: 28px;
      border: none;
      font-size: 12px;
    }
    span {
      font-size: 20px;
    }
  }
  .rows + .rows {
    &::before {
      content: "";
      position: absolute;
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
      top: 2px;
      left: 0.5px;
      height: 24px;
      width: 1px;
      background: #cccccc;
    }
  }
}
</style>
