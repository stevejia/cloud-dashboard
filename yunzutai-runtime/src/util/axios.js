import axios from "axios";
import Vue from "vue";
import { getToken, clear } from "@/util/localStorage.js";

axios.defaults.headers.common["Content-Type"] =
  "application/json;charset=UTF-8";

axios.interceptors.request.use(
  config => {
    if (getToken() && !config.headers.common["authorization"]) {
      config.headers["authorization"] = getToken();
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);
axios.interceptors.response.use(data => {
  let statusCode = data.data.statusCode;
  if (statusCode === 401) {
    clear();
    Vue.prototype.$message({
      type: "error",
      message: "权限不足"
    });
    window.location.hash = "#/login";
  }
  if (statusCode != 200 && statusCode !== undefined) {
    Vue.prototype.$message({
      type: "error",
      message: data.data.message
    });
  }
  return data;
});
Vue.prototype.$axios = axios;
