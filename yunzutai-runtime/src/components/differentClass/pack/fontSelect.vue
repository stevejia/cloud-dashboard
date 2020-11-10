<template>
  <div class="comps">
    <div class="title">{{ title }}</div>
    <div class="body">
      <div class="rows">
        <select v-model="config.value[0]" @change="onChange(null, true)">
          <option
            v-for="item in fontSize14To36"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></option>
        </select>
      </div>
      <div class="rows">
        <select v-model="config.value[1]" @change="onChange(null, true)">
          <option
            v-for="item in fontFamily"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></option>
        </select>
      </div>
      <div class="rows">
        <span>A</span>
        <div class="text-color">
          <color-picker v-model="tabColor" @change="setColor(1)" />
        </div>
      </div>
      <div class="rows">
        <span>选中</span>
        <div class="text-color">
          <color-picker v-model="tabSelectColor" @change="setColor(2)" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { fontFamily, fontSize14To36 } from "./common";
export default {
  props: {
    title: String,
    config: Object,
    onChange: Function
  },
  data() {
    return {
      fontFamily: fontFamily,
      fontSize14To36: fontSize14To36,
      tabColor: this.config.value[2],
      tabSelectColor: this.config.value[3]
    };
  },
  methods: {
    setColor(type) {
      switch (type) {
        case 1:
          this.config.value[2] = this.tabColor;
          break;
        case 2:
          this.config.value[3] = this.tabSelectColor;
          break;
        default:
          break;
      }
      this.onChange(null, true);
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
}
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
</style>
