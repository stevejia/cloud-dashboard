<template>
  <div class="layout">
    <div class="MainBody">
      <headers
        ref="headers"
        class="headers"
        :config="config.topConfig"
      ></headers>
      <tabMenu
        ref="tabMenus"
        class="tabMenus"
        :config="config.leftConfig"
      ></tabMenu>
      <div class="main" :style="{ top: mainTop + 'px' }">
        <lefters
          ref="lefters"
          class="lefters"
          :config="config.leftConfig"
          :style="{ left: mainLeft + 'px' }"
        ></lefters>
        <div class="body" :style="{ left: mainLeft === 0 ? '200px' : '0px' }">
          <router-view />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import lefters from "./lefters.vue";
import headers from "./headers.vue";
import tabMenu from "./tabMenu.vue";
export default {
  components: {
    headers,
    tabMenu,
    lefters
  },
  data() {
    return {
      theme: "black",
      themeConfig: this.$store.state.config.stylesConfig.theme,
      config: this.$store.state.config.stylesConfig["black"],
      mainTop: 104,
      mainLeft: 0
    };
  },
  mounted() {
    this.initStyle();
    this.changeTheme(this.theme);
  },
  methods: {
    //收缩左侧栏
    toggLeft() {
      if (this.mainLeft === -200) {
        this.mainLeft = 0;
      } else {
        this.mainLeft = -200;
      }
      this.$drag.$vm.initStyle(this.mainLeft);
    },
    changeTheme(theme) {
      this.theme = theme;
      this.config = this.$store.state.config.stylesConfig[theme];
      document.body.className = theme === "black" ? "themeBlack" : "themeWhite";
      document
        .getElementById("modLink")
        .setAttribute("href", `./static/css/${theme}.css`);
      this.$nextTick(() => {
        this.$drag.$vm.initStyle();
        this.$refs.headers.initStyle();
        this.$refs.tabMenus.initStyle();
        this.$refs.lefters.initStyle();
      });
    },
    initStyle() {
      let theme = this.themeConfig["主题切换"].value;
      if (this.theme !== theme) {
        this.changeTheme(theme);
      } else {
        let bool = this.config.topConfig["隐藏顶部导航"].value;
        if (bool) {
          this.mainTop = 60;
        } else {
          this.mainTop = 104;
        }
        this.$drag.$vm.initStyle();
        this.$refs.tabMenus.initStyle();
      }
    },
    deal() {
      let bool = this.config.topConfig["隐藏顶部导航"].value;
      this.config.topConfig["隐藏顶部导航"].value = !bool;
      this.initStyle();
    }
  }
};
</script>

<style lang="less" scoped>
.layout {
  height: 100%;
  width: 100%;
  .MainBody {
    flex: none;
    height: calc(100%);
    position: relative;
    .headers {
      height: 60px;
      box-shadow: none !important;
    }
    .tabMenus {
      height: 44px;
      box-sizing: border-box;
    }
    .main {
      position: absolute;
      left: 0px;
      right: 0px;
      bottom: 0px;
      display: flex;
      flex-direction: row;
      transition: all 0.2s;
      .lefters {
        transition: all 0.2s;
        position: absolute;
        top: 0px;
        bottom: 0px;
        width: 200px;
        box-shadow: none !important;
      }
      .body {
        transition: all 0.2s;
        position: absolute;
        right: 0px;
        top: 0px;
        bottom: 0px;
        flex: 1;
      }
    }
  }
}
</style>
