<template>
  <transition name="el-zoom-in-top" @after-leave="doDestroy">
    <div class="el-color-dropdown" v-show="showPopper">
      <div class="el-color-dropdown__main-wrapper">
        <hue-slider
          ref="hue"
          :color="color"
          vertical
          style="float: right;"
        ></hue-slider>
        <sv-panel ref="sl" :color="color"></sv-panel>
      </div>
      <alpha-slider ref="alpha" v-if="showAlpha" :color="color"></alpha-slider>
      <predefine
        v-if="predefine"
        :color="color"
        :colors="predefine"
      ></predefine>
      <div
        class="el-color-dropdown__btns"
        :style="{ height: showAlpha ? '70px' : '40px' }"
      >
        <span v-if="showAlpha" class="el-color-dropdown__value rgba">
          <!-- <el-input
            v-model="customInput"
            @keyup.native.enter="handleConfirm"
            @blur="handleConfirm"
            :validate-event="false"
            size="mini">
          </el-input> -->
          <span>R </span>
          <el-input
            style="width:55px"
            v-model.number="r"
            @keyup.native.enter="handleConfirm"
            @input="filterInputR"
            @blur="handleConfirm"
            :validate-event="false"
            size="mini"
          >
          </el-input>
          <span>G </span>
          <el-input
            style="width:60px"
            v-model="g"
            @keyup.native.enter="handleConfirm"
            @input="filterInputG"
            @blur="handleConfirm"
            :validate-event="false"
            size="mini"
          >
          </el-input>
          <span>B </span>
          <el-input
            style="width:60px"
            v-model="b"
            @keyup.native.enter="handleConfirm"
            @input="filterInputB"
            @blur="handleConfirm"
            :validate-event="false"
            size="mini"
          >
          </el-input>
          <span>A </span>
          <el-input
            style="width:50px"
            v-model="a"
            @keyup.native.enter="handleConfirm"
            @input="filterInputA"
            @blur="handleConfirm"
            :validate-event="false"
            size="mini"
          >
          </el-input>
        </span>
        <span class="el-color-dropdown__value">
          <el-input
            v-model="hexCustomInput"
            @keyup.native.enter="handleConfirm2"
            @blur="handleConfirm2"
            :validate-event="false"
            size="mini"
          >
          </el-input>
        </span>
        <span style="line-height:40px">
          <el-button
            size="mini"
            type="text"
            class="el-color-dropdown__link-btn"
            @click="$emit('clear')"
          >
            关闭
          </el-button>
          <el-button
            plain
            size="mini"
            class="el-color-dropdown__btn"
            @click="confirmValue"
          >
            {{ t("el.colorpicker.confirm") }}
          </el-button>
        </span>
      </div>
    </div>
  </transition>
</template>

<script>
import SvPanel from "./sv-panel";
import HueSlider from "./hue-slider";
import AlphaSlider from "./alpha-slider";
import Predefine from "./predefine";
import Popper from "@/element-ui/src/utils/vue-popper";
import Locale from "@/element-ui/src/mixins/locale";
import ElInput from "@/element-ui/packages/input";
import ElButton from "@/element-ui/packages/button";

export default {
  name: "el-color-picker-dropdown",

  mixins: [Popper, Locale],

  components: {
    SvPanel,
    HueSlider,
    AlphaSlider,
    ElInput,
    ElButton,
    Predefine
  },

  props: {
    color: {
      required: true
    },
    showAlpha: Boolean,
    predefine: Array
  },

  data() {
    return {
      // customInput: '',
      r: "",
      g: "",
      b: "",
      a: "",
      hexCustomInput: ""
    };
  },

  computed: {
    currentColor() {
      const parent = this.$parent;
      return !parent.value && !parent.showPanelColor
        ? ""
        : [parent.color.value, parent.color.value2, parent.color.value3];
    }
  },

  methods: {
    checkInputNum(v, max = 255, min = 0) {
      let num = parseInt(v);
      if (isNaN(num)) {
        num = min;
      } else if (num > 255) {
        num = max;
      }
      return num;
    },
    filterInputR(val) {
      this.r = this.checkInputNum(val);
    },
    filterInputG(val) {
      this.g = this.checkInputNum(val);
    },
    filterInputB(val) {
      this.b = this.checkInputNum(val);
    },
    filterInputA(val) {
      val = val.replace(/[^\d.]/g, "");
      if (isNaN(parseFloat(val))) {
        this.a = 0;
      } else if (parseFloat(val) > 1) {
        this.a = 1;
      } else {
        this.a = val;
      }
    },
    confirmValue() {
      this.$emit("pick");
    },

    handleConfirm() {
      this.color.fromString(`rgba(${this.r},${this.g},${this.b},${this.a})`);
    },
    handleConfirm2() {
      this.color.fromString(this.hexCustomInput);
    }
  },

  mounted() {
    this.$parent.popperElm = this.popperElm = this.$el;
    this.referenceElm = this.$parent.$el;
  },

  watch: {
    showPopper(val) {
      if (val === true) {
        this.$nextTick(() => {
          const { sl, hue, alpha } = this.$refs;
          sl && sl.update();
          hue && hue.update();
          alpha && alpha.update();
        });
      }
    },

    currentColor: {
      immediate: true,
      handler(val) {
        if (!val) return;
        // this.customInput = val[0];
        (this.hexCustomInput = val[1]), (this.r = parseInt(val[2][0]));
        this.g = parseInt(val[2][1]);
        this.b = parseInt(val[2][2]);
        this.a = parseFloat(val[2][3]);
      }
    }
  }
};
</script>
<style lang="less">
.el-color-dropdown__btns {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  height: 70px;
  .el-color-dropdown__value {
    &.rgba {
      width: 100%;
      display: flex;
      justify-content: space-around;
    }
    line-height: 35px;
  }
}
</style>
