<template>
  <div
    :class="[
      'el-color-picker',
      colorDisabled ? 'is-disabled' : '',
      colorSize ? `el-color-picker--${colorSize}` : ''
    ]"
    v-clickoutside="hide"
  >
    <div class="el-color-picker__mask" v-if="colorDisabled"></div>
    <div class="el-color-picker__trigger" @click="handleTrigger">
      <span class="el-color-picker__color" :class="{ 'is-alpha': showAlpha }">
        <span
          class="el-color-picker__color-inner"
          :style="{
            backgroundColor: displayedColor
          }"
        ></span>
        <span
          class="el-color-picker__empty el-icon-close"
          v-if="!value && !showPanelColor"
        ></span>
      </span>
      <span
        class="el-color-picker__icon el-icon-arrow-down"
        v-show="value || showPanelColor"
      ></span>
    </div>
    <picker-dropdown
      ref="dropdown"
      :class="['el-color-picker__panel', popperClass || '']"
      v-model="showPicker"
      @pick="confirmValue"
      @clear="clearValue"
      :color="color"
      :show-alpha="showAlpha"
      :predefine="predefine"
    ></picker-dropdown>
  </div>
</template>

<script>
import Color from "./color";
import PickerDropdown from "./components/picker-dropdown.vue";
import Clickoutside from "@/element-ui/src/utils/clickoutside";
// import Clickoutside from './clickoutside';
import Emitter from "@/element-ui/src/mixins/emitter";
import { predefineColors } from "@/components/differentClass/pack/common.js";

export default {
  name: "ElColorPicker",

  mixins: [Emitter],

  props: {
    value: String,
    showAlpha: Boolean,
    colorFormat: String,
    disabled: Boolean,
    size: String,
    popperClass: String,
    chooseTheme: Function
  },

  inject: {
    elForm: {
      default: ""
    },
    elFormItem: {
      default: ""
    }
  },

  directives: { Clickoutside },
  data() {
    const color = new Color({
      enableAlpha: this.showAlpha,
      format: this.colorFormat
    });
    return {
      orignColor: "",
      color,
      showPicker: false,
      showPanelColor: false,
      predefine: predefineColors
    };
  },

  components: {
    PickerDropdown
  },
  mounted() {
    const value = this.value;
    if (value) {
      this.color.fromString(value);
    }
    this.popperElm = this.$refs.dropdown.$el;
    this.orignColor = this.color.value;
  },
  computed: {
    displayedColor() {
      if (!this.value && !this.showPanelColor) {
        return "transparent";
      }

      return this.displayedRgb(this.color, this.showAlpha);
    },

    _elFormItemSize() {
      return (this.elFormItem || {}).elFormItemSize;
    },

    colorSize() {
      return this.size || this._elFormItemSize || (this.$ELEMENT || {}).size;
    },

    colorDisabled() {
      return this.disabled || (this.elForm || {}).disabled;
    }
  },

  watch: {
    value(val) {
      if (!val) {
        this.showPanelColor = false;
      } else if (val && val !== this.color.value) {
        this.color.fromString(val);
      }
    },
    color: {
      deep: true,
      handler() {
        this.showPanelColor = true;
      }
    },
    displayedColor(val) {
      if (!this.showPicker) return;
      const currentValueColor = new Color({
        enableAlpha: this.showAlpha,
        format: this.colorFormat
      });
      currentValueColor.fromString(this.value);

      // const currentValueColorRgb = this.displayedRgb(
      //   currentValueColor,
      //   this.showAlpha
      // );
      this.$emit("active-change", val);
    }
  },

  methods: {
    async handleTrigger() {
      // if (this.colorDisabled || !this.chooseTheme) return;
      //   if (this.$store.getters.theme !== "custom") {
      //     try {
      //       let res = await this.$confirm(
      //         "当前处于主题样式，修改将自动切回自定义样式，请确认？",
      //         "确认信息",
      //         {
      //           distinguishCancelAndClose: true,
      //           confirmButtonText: "确认切换",
      //           cancelButtonText: "放弃修改"
      //         }
      //       );
      //       this.chooseTheme("custom");
      //     } catch (err) {
      //       console.log(3, err);
      //     }
      //     return;
      //   }
      this.showPicker = !this.showPicker;
      this.$emit("toggle-panel", this.showPicker);
    },
    confirmValue() {
      const value = this.color.value;
      this.$emit("input", value);
      this.$emit("change", value);
      this.dispatch("ElFormItem", "el.form.change", value);
      this.showPicker = false;
    },
    clearValue() {
      this.$emit("toggle-panel", false);
      if (this.value !== null) {
        this.dispatch("ElFormItem", "el.form.change", null);
      }
      this.showPanelColor = false;
      this.showPicker = false;
      this.resetColor();
    },
    hide() {
      if (!this.showPicker) {
        return;
      }
      this.$emit("toggle-panel", false);

      this.showPicker = false;
      this.resetColor();
    },
    resetColor() {
      this.$nextTick(() => {
        if (this.value) {
          this.color.fromString(this.value);
        } else {
          this.showPanelColor = false;
        }
      });
    },
    displayedRgb(color, showAlpha) {
      if (!(color instanceof Color)) {
        throw Error("color should be instance of Color Class");
      }

      const { r, g, b } = color.toRgb();
      // return `rgba(${ r }, ${ g }, ${ b }, ${ color.get('alpha') / 100 })`
      return showAlpha
        ? `rgba(${r}, ${g}, ${b}, ${color.get("alpha") / 100})`
        : `rgb(${r}, ${g}, ${b})`;
    }
  }
};
</script>
