<template>
  <div class="comps">
    <div class="title">
      <span>{{ title }}</span>
    </div>
    <div class="body" style="margin-top:10px;">
      <div class="rows">
        <select v-model="config.value[0]" @change="onChange(null, true)">
          <option
            v-for="item in options1"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></option>
        </select>
      </div>
      <div class="rows">
        <select v-model="config.value[1]" @change="onChange(null, true)">
          <option
            v-for="item in options2"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></option>
        </select>
      </div>
      <div class="rows">
        <select v-model="config.value[2]" @change="onChange(null, true)">
          <option
            v-for="item in options3"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></option>
        </select>
      </div>
    </div>
    <div class="body" style="margin-top:4px;">
      <div class="rows">
        <select v-model="config.value[3]" @change="onChange(null, true)">
          <option
            v-for="item in options4"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></option>
        </select>
      </div>
      <div class="rows">
        <select v-model="config.value[4]" @change="onChange(null, true)">
          <option
            v-for="item in options5"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></option>
        </select>
      </div>
    </div>
  </div>
</template>

<script>
import {
  fontFamily,
  fontSize14To36,
  lineHeights,
  fontAligns,
  fontAlignHeight
} from "./common";
export default {
  props: {
    title: String,
    config: Object,
    onChange: Function
  },
  data() {
    return {
      options5: fontAlignHeight,
      options4: fontAligns,
      options3: lineHeights,
      options2: fontFamily,
      options1: fontSize14To36
    };
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
    display: flex;
    justify-content: center;
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
}
</style>
