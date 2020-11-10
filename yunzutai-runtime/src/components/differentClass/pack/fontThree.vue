<template>
  <div class="comps">
    <div class="title">{{ title }}</div>
    <div class="body" style="margin-top:10px;">
      <div class="rows">
        <select v-model="config.value[0]" @change="onChange(title, true)">
          <option
            v-for="item in fontSize14To36"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></option>
        </select>
      </div>
      <div class="rows">
        <select v-model="config.value[1]" @change="onChange(title, true)">
          <option
            v-for="item in fontFamily"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></option>
        </select>
      </div>
      <div class="rows">
        <span class="fontIcon" :style="{ color: color1 }">A</span>
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
      predefineColors: predefineColors,
      fontSize14To36: fontSize14To36,
      fontFamily: fontFamily,
      fontBold: fontBold,
      color1: this.config.value[2]
    };
  },
  created() {
    // 定义需要显示的字体配置，默认三个全部显示
    // if (this.config && !this.config.typeParam) {
    //   this.config.typeParam = {
    //     fontSize: true,
    //     fontFamily: true,
    //     color: true
    //   };
    // }
  },
  methods: {
    setColor() {
      this.config.value[2] = this.color1;
      this.onChange(this.title, true);
    },
    change(type) {
      switch (type) {
        case 1:
          // eslint-disable-next-line no-case-declarations
          // let val = this.config.value[2];
          // this.config.value[2] = val === "normal" ? "bold" : "normal";
          this.onChange(this.title, true);
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
    flex: 1;
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
      height: 26px;
      border: none;
      font-size: 12px;
    }
    span {
      font-size: 20px;
    }
    .fontIcon {
      text-shadow: 1px 2px 2px rgba(94, 94, 94, 0.5);
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
