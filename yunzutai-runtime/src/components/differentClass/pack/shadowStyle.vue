<template>
  <div class="comps">
    <div class="title">
      <el-checkbox
        v-model="config.value[4]"
        @change="onChange(null, true)"
      ></el-checkbox>
      <span>{{ title }}</span>
    </div>
    <div class="body" v-show="config.value[4]">
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
            v-for="item in options1"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></option>
        </select>
      </div>
      <div class="rows">
        <select v-model="config.value[3]" @change="onChange(null, true)">
          <option
            v-for="item in options2"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></option>
        </select>
      </div>
      <div class="rows">
        <span :style="{ color: color1 }">A</span>
        <div class="text-color">
          <color-picker v-model="color1" @change="setColor" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { predefineColors, fontSize6To6, fontSize1To6 } from "./common";
export default {
  props: {
    title: String,
    config: Object,
    onChange: Function
  },
  data() {
    return {
      color1: this.config.value[0],
      options1: fontSize6To6,
      options2: fontSize1To6,
      predefineColors: predefineColors,
      oColor: this.config.value[0]
    };
  },
  watch: {
    "config.value"(newVal) {
      // debugger;
      this.color1 = newVal[0];
      // if (this.color1 !== newVal[0]) {
      //   this.color1 = newVal[0];
      // }
    }
  },

  methods: {
    setColor() {
      this.config.value[0] = this.color1;
      console.log(this.oColor, this.color1);
      if (this.oColor !== this.color1) {
        this.onChange(null, true);
      }
      this.oColor = this.color1;
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
