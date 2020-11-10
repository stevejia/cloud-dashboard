<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import { getLoginConfig, GetModel } from "@/api/runApi.js";
let Domain = window.location.hostname;
import loginTitle from "@/assets/image/common/login_title1.png";
export default {
  data() {
    return {};
  },
  created() {
    if (window.location.hostname == "http://localhost") return;
    this.getModel();
  },
  methods: {
    async getModel() {
      let data = await GetModel({
        Domain: window.location.protocol + "//" + Domain + "/#/Login"
      });
      let { body } = await getLoginConfig({ pid: data.data.appId });
      let save_data = body[0].save_data;
      let loginInfo = {};
      if (save_data.loginPage == undefined) {
        loginInfo = {
          appCound: data.data.appCont,
          logo: save_data?.Logo?.value?.imgUrl || loginTitle,
          bg:
            save_data["背景图"]?.value?.imgUrl ||
            require("./assets/image/bg.jpg"),
          favicon: save_data["页面标签"]?.value?.imgUrl,
          title: save_data["页面标题"]?.value || "正泰云组态平台"
        };
      } else {
        loginInfo = {
          appCound: data.data.appCont,
          logo: save_data.loginPage.logo || loginTitle,
          bg: save_data.loginPage.bg || require("./assets/image/bg.jpg"),
          favicon: save_data.loginPage.favicon,
          title: save_data.loginPage.title || "正泰云组态平台"
        };
      }
      this.$store.state.loginInfo = loginInfo;
      document.querySelector("link[type='image/x-icon']").href =
        loginInfo.favicon;
      document.title = loginInfo.title;
    }
  }
};
</script>

<style lang="less">
.iconfont {
  cursor: pointer;
  font-family: "chint" !important;
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100%;
  width: 100%;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
.el-select,
.el-cascader {
  width: 100%;
}
</style>
