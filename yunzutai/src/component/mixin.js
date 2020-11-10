const mixin = {
  props: {
    theme: String
  },
  watch: {
    "$store.getters.theme": function() {
      this.$nextTick(() => {
        this.themeChange();
      });
    }
  },
  methods: {
    returnConfig() {
      return {
        white: this.white,
        black: this.black,
        highConfig: this.highConfig,
        baisicConfig: this.baisicConfig
      };
    },
    resetStyle(data) {
      this[this.theme] = data[this.theme];
      let baisicConfig = data.baisicConfig;
      let config = {};
      let bool = false;
      for (let key in baisicConfig) {
        if (key.startsWith("线条")) {
          bool = true;
          config = {};
        }
        if (key.indexOf("样式还原") !== -1) {
          break;
        }
        if (bool) {
          config[key] = baisicConfig[key];
        }
      }
      this.baisicConfig = {
        ...this.baisicConfig,
        ...config
      };
      this.themeChange();
    },
    themeChange() {
      let theme = this[this.theme];
      let baisicConfig = this.baisicConfig;
      for (let key in theme) {
        if (baisicConfig[key]) {
          baisicConfig[key].value = theme[key];
        } else {
          let str = parseInt(key.slice(-1));
          if (typeof str === "number" && !isNaN(str)) {
            baisicConfig[key.slice(0, -1)].value[str] = theme[key];
          }
        }
      }
      this.initStyle(true);
    },
    startInitStyle() {
      let theme = this[this.theme];
      let baisicConfig = this.baisicConfig;
      for (let key in theme) {
        if (baisicConfig[key]) {
          theme[key] = baisicConfig[key].value;
        } else {
          let str = parseInt(key.slice(-1));
          if (typeof str === "number" && !isNaN(str)) {
            theme[key] = baisicConfig[key.slice(0, -1)].value[str];
          }
        }
      }
      let heightChange = baisicConfig["尺寸"].value[1] !== this.$parent.height;
      let widthChange = baisicConfig["尺寸"].value[0] !== this.$parent.width;
      if (heightChange || widthChange) {
        let name = "";
        if (heightChange) {
          name = "height";
        } else if (widthChange) {
          name = "width";
        }
        this.$nextTick(() => {
          this.resetComp && this.resetComp(true, name);
        });
      }
      return { theme, baisicConfig };
    },
    endInitStyle(bool) {
      if (!bool) {
        this.$parent.initStyle(
          this.baisicConfig["尺寸"].value,
          this.baisicConfig["位置"].value,
          this.baisicConfig["旋转角度"].value
        );
      }
    }
  }
};
export default mixin;
