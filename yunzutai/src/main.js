import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "@/util/axios";
import "@/util/comp.js";
import Grag from "@/util/drag.js";
import Chint from "@/util/chint.js";
import "@/assets/css/common.less";
import "./util/permission";
import ColorPicker from "@/components/ColorPicker/index.vue";
Vue.component("ColorPicker", ColorPicker);

// import VueAMap from "vue-amap";
// Vue.use(VueAMap);
// VueAMap.initAMapApiLoader({
//   key: "chint-map",
//   plugin: [
//     "AMap.Scale",
//     "AMap.OverView",
//     "AMap.ToolBar",
//     "AMap.MapType",
//     "AMap.PlaceSearch",
//     "AMap.Geolocation",
//     "AMap.Geocoder"
//   ],
//   v: "1.4.4",
//   uiVersion: "1.0"
// });

document.documentElement.addEventListener("contextmenu", ev => {
  ev.preventDefault();
});

import ElementUI from "element-ui";
Vue.use(ElementUI);
Vue.prototype.$drag = new Grag();
Vue.prototype.$chint = new Chint(Vue.prototype.$drag);

window.config = {};
window.config = {
  requestUrl: "https://dev-gateway.chintcloud.net/common/api/v2.0/visual",
  dataCenterUrl: "https://dev-gateway.chintcloud.net/common/api/v2.0/visual",
  uploadUrl: "https://dev-gateway.chintcloud.net/common/api/v2.0/visual",
  bulk: "https://dev-gateway.chintcloud.net/common/api/v2.0/visual",
  timerUrl: "https://dev-gateway.chintcloud.net/common/api/v2.0/visual",
  gatewayUrl: "https://dev-gateway.chintcloud.net",
  getToken: "https://dev-gateway.chintcloud.net/common/api/v2.0/",
  agreement: "http://",
  uploadJsPreUrl:
    "https://chintcloud.oss-cn-shanghai.aliyuncs.com/dev/cloud-config/js/"
};
if (window.location.host.indexOf(":18080") !== -1) {
  window.config = {
    requestUrl: "https://dev-gateway.chintcloud.net/common/api/v2.0/visual",
    dataCenterUrl: "https://dev-gateway.chintcloud.net/common/api/v2.0/visual",
    uploadUrl: "https://dev-gateway.chintcloud.net/common/api/v2.0/visual",
    bulk: "https://dev-gateway.chintcloud.net/common/api/v2.0/visual",
    timerUrl: "https://dev-gateway.chintcloud.net/common/api/v2.0/visual",
    gatewayUrl: "https://dev-gateway.chintcloud.net",
    getToken: "https://dev-gateway.chintcloud.net/common/api/v2.0/",
    agreement: "http://",
    uploadJsPreUrl:
      "https://chintcloud.oss-cn-shanghai.aliyuncs.com/dev/cloud-config/js/"
  };
  // window.config = {
  //   requestUrl: "http://cloudconfigserver.cloud.techsel.net",
  //   dataCenterUrl: "http://configcenterapi.cloud.techsel.net",
  //   uploadUrl: "http://ufs.cloud.techsel.net/uploadfile",
  //   bulk: "http://dataapi.cloud.techsel.net",
  //   timerUrl: "http://hangfire.cloud.techsel.net",
  //   agreement: "http://",
  // uploadJsPreUrl:"https://chintcloud.oss-cn-shanghai.aliyuncs.com/dev/cloud-config/js/"
  // };
} else if (window.location.host.startsWith("dev-tethys")) {
  window.config = {
    requestUrl: "https://dev-gateway.chintcloud.net/common/api/v2.0/visual",
    dataCenterUrl: "https://dev-gateway.chintcloud.net/common/api/v2.0/visual",
    uploadUrl: "https://dev-gateway.chintcloud.net/common/api/v2.0/visual",
    bulk: "https://dev-gateway.chintcloud.net/common/api/v2.0/visual",
    timerUrl: "https://dev-gateway.chintcloud.net/common/api/v2.0/visual",
    gatewayUrl: "https://dev-gateway.chintcloud.net",
    getToken: "https://dev-gateway.chintcloud.net/common/api/v2.0/",
    agreement: "http://",
    uploadJsPreUrl:
      "https://chintcloud.oss-cn-shanghai.aliyuncs.com/dev/cloud-config/js/"
  };
} else if (window.location.host.startsWith("test-tethys")) {
  window.config = {
    requestUrl: "https://test-gateway.chintcloud.net/common/api/v2.0/visual",
    dataCenterUrl: "https://test-gateway.chintcloud.net/common/api/v2.0/visual",
    uploadUrl: "https://test-gateway.chintcloud.net/common/api/v2.0/visual",
    bulk: "https://test-gateway.chintcloud.net/common/api/v2.0/visual",
    timerUrl: "https://test-gateway.chintcloud.net/common/api/v2.0/visual",
    gatewayUrl: "https://dev-gateway.chintcloud.net",
    getToken: "https://test-gateway.chintcloud.net/common/api/v2.0/",
    agreement: "https://",
    uploadJsPreUrl:
      "https://chintcloud.oss-cn-shanghai.aliyuncs.com/test/cloud-config/js/"
  };
  // window.config = {
  //   requestUrl: "https://test-gateway.chintcloud.net/common/api/v2.0/visual",
  //   dataCenterUrl: "https://test-gateway.chintcloud.net/common/api/v2.0/visual",
  //   uploadUrl: "http://ufs.cloud.techsel.net/uploadfile",
  //   bulk: "http://dataapi.cloud.techsel.net",
  //   timerUrl: "http://hangfire.cloud.techsel.net",
  // agreement:"https",
  // uploadJsPreUrl:"https://chintcloud.oss-cn-shanghai.aliyuncs.com/test/cloud-config/js/"
  // };
} else if (window.location.host.startsWith("tethys")) {
  window.config = {
    requestUrl: "https://gateway.chint.com/common/api/v2.0/visual",
    dataCenterUrl: "https://gateway.chint.com/common/api/v2.0/visual",
    uploadUrl: "https://gateway.chint.com/common/api/v2.0/visual",
    bulk: "https://gateway.chint.com/common/api/v2.0/visual",
    timerUrl: "https://gateway.chint.com/common/api/v2.0/visual",
    gatewayUrl: "https://dev-gateway.chintcloud.net",
    getToken: "https://gateway.chint.com/common/api/v2.0/",
    agreement: "https://",
    uploadJsPreUrl:
      "https://chintcloud.oss-cn-shanghai.aliyuncs.com/prd/cloud-config/js/"
  };
  // window.config = {
  //   requestUrl: "http://gateway.chint.com/common/api/v2.0/visual",
  //   dataCenterUrl: "http://gateway.chint.com/common/api/v2.0/visual",
  //   uploadUrl: "http://ufs.cloud.techsel.net/uploadfile",
  //   bulk: "http://dataapi.cloud.techsel.net",
  //   timerUrl: "http://hangfire.cloud.techsel.net",
  // agreement:"https",
  // uploadJsPreUrl:"https://chintcloud.oss-cn-shanghai.aliyuncs.com/prd/cloud-config/js/"
  // };
}

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");

/**
 * 屏蔽浏览器的缩放事件
 */
window.addEventListener(
  "mousewheel",
  function(event) {
    if (event.ctrlKey || event.metaKey) {
      event.preventDefault();
    }
  },
  { passive: false }
);
window.addEventListener(
  "contextmenu",
  function(e) {
    Vue.prototype.$drag.hideContextmenu();
    e.preventDefault();
  },
  false
);
