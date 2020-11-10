import axios from "axios";
import Vue from "vue";
import { getToken } from "@/util/localStorage.js";

axios.defaults.headers.common["Content-Type"] =
  "application/json;charset=UTF-8";

axios.interceptors.request.use(
  config => {
    if (getToken() && !config.headers.common["authorization"]) {
      config.headers["Authorization"] = getToken();
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);
axios.interceptors.response.use(data => {
  if (data.data.code == "401") {
    Vue.prototype.$message({
      type: "error",
      message: data.data.message
    });
  }
  return data;
});
Vue.prototype.$axios = axios;
