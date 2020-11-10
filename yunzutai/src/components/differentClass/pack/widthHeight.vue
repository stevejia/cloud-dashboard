<template>
  <div class="comps">
    <div
      class="techsel-checkbox__wrapper"
      v-if="String(config.checked) !== 'undefined'"
    >
      <span class="techsel-checkbox__mark" @click.stop="changePage">
        <img
          :class="config.checked ? 'techsel-checkbox__checked' : ''"
          src="@/assets/image/mark.svg"
        />
      </span>
      <span data-v-bf763318 class="techsel-checkbox__title margin__right"
        >分页适配</span
      >
    </div>
    <div class="title">
      {{ title }}
      <span v-if="config.tisi">
        <span>(</span>
        <span :style="{ color: 'rgb(255, 75, 75)' }">{{ config.tisi }}</span>
        <span>)</span>
      </span>
    </div>
    <div class="body">
      <span>
        {{ config.label[0] }}
        <input
          :disabled="disabled"
          type="number"
          v-model.number="config.value[0]"
          @change="onChange"
          @input="onChange"
          @blur="onFinalChange(0)"
          @keyup.enter="onFinalChange(0)"
        /> </span
      >&nbsp;&nbsp;&nbsp;
      <span>
        {{ config.label[1] }}
        <input
          :disabled="disabled"
          type="number"
          v-model.number="config.value[1]"
          @change="onChange"
          @input="onChange"
          @blur="onFinalChange(1)"
          @keyup.enter="onFinalChange(1)"
        />
      </span>
    </div>
    <div class="footer" v-if="config.button">
      <el-button type="primary" size="small" @click="btn('width')"
        >按宽正方</el-button
      >
      <el-button type="primary" size="small" @click="btn('height')"
        >按高正方</el-button
      >
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: String,
    config: Object,
    onChange: Function
  },
  data() {
    return {
      disabled: false,
      oValue0: null,
      oValue1: null
    };
  },
  mounted() {
    if (this.config) {
      this.oValue0 = this.config.value[0];
      this.oValue1 = this.config.value[1];
      this.disabled = this.$drag.vms?.isCompose || false;
    }
  },
  // watch: {
  //   "config.value"(newVal) {
  //     console.log(newVal);
  //   }
  // },
  methods: {
    changePage() {
      this.$set(this.config, "checked", !this.config.checked);
      this.onChange("isPageSize", true);
    },
    btn(style) {
      let width = this.config.value[0];
      let height = this.config.value[1];
      if (style == "width") {
        this.config.value = [width, width];
      } else {
        this.config.value = [height, height];
      }
      // this.onChange();
      this.onChange("isPageSize", true);
    },
    onFinalChange(type) {
      //检测value 0是否有变化
      if (type === 0) {
        let nValue0 = this.config.value[0];
        if (this.oValue0 !== nValue0) {
          this.onChange(null, true);
        }
        this.oValue0 = nValue0;
      } else if (type === 1) {
        //检测value 1是否变化
        let nValue1 = this.config.value[1];
        if (this.oValue1 !== nValue1) {
          this.onChange(null, true);
        }
        this.oValue1 = nValue1;
      }
    }
  }
};
</script>
<style lang="less" scoped>
.body {
  display: flex;
  justify-content: space-between;
}
.footer {
  margin-top: 10px;
  display: flex;
  justify-content: space-around;
}
input {
  outline: none;
  width: 68px;
  color: #282828;
  border: 1px solid #cccccc;
  background-color: #fff;
  border-radius: 4px;
  border: 1px solid rgba(40, 40, 40, 1);
  font-family: microsoft yahei;
  font-size: 14px;
  text-align: center;
  box-sizing: border-box;
  height: 30px;
}
.techsel-checkbox__wrapper {
  display: flex;
  align-items: center;
  width: 100%;
  height: 30px;
  margin-bottom: 10px;
}
.techsel-checkbox__mark {
  display: inline-block;
  width: 20px;
  height: 20px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  border: 1px solid;
  border-radius: 3px;
  text-align: center;
  line-height: 1;
  background-color: #fff;
  font-size: 0;
  vertical-align: middle;
  cursor: pointer;
}
.techsel-checkbox__mark img {
  width: 16px;
  height: 16px;
  vertical-align: middle;
  -webkit-transform: scaleY(0);
  transform: scaleY(0);
  -webkit-transition: -webkit-transform 0.15s ease-in 0.05s;
  transition: -webkit-transform 0.15s ease-in 0.05s;
  transition: transform 0.15s ease-in 0.05s;
  transition: transform 0.15s ease-in 0.05s,
    -webkit-transform 0.15s ease-in 0.05s;
  -webkit-transform-origin: center;
  transform-origin: center;
}
.margin__right {
  margin-left: 10px;
}
.margin__left {
  margin-right: 10px;
}
.techsel-checkbox__checked {
  transform: scaleY(1) !important;
}
img {
  vertical-align: top;
  max-width: 100%;
}
</style>
