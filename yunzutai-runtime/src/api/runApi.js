import { commonRequest } from "./request";
export function login(params) {
  let datas = {
    url: window.config.requestUrl + "/api/terminal/User/Login",
    methods: "post",
    info: "登录",
    params: params
  };

  return commonRequest(datas);
}
export function getLoginConfig(params) {
  console.log(params);
  let datas = {
    url: window.config.requestUrl + "/api/run/getLoginConfig",
    methods: "get",
    info: "登录背景图，logo",
    params: params
  };

  return commonRequest(datas);
}
export function GetModel(params) {
  let datas = {
    url: window.config.requestUrl + "/api/cloudconfigure/LoginPage/GetModel",
    methods: "post",
    info: "获取appid",
    params: params
  };

  return commonRequest(datas);
}

//验证码地址
export function verifyCode(params) {
  let datas = {
    url: window.config.dataCenterUrl + "/api/admin/Admin/Verifycode",
    methods: "post",
    info: "验证码",
    params
  };
  return commonRequest(datas);
}
export function getUserInfo(params) {
  let datas = {
    url: window.config.requestUrl + "/api/terminal/User/GetCurrentUserInfo",
    methods: "post",
    info: "获取用户信息",
    params: params
  };
  return commonRequest(datas);
}

export function getPages(params) {
  let datas = {
    url: window.config.requestUrl + "/api/cloudconfigure/Project/GetPages",
    methods: "post",
    info: "获取项目列表",
    params: params
  };

  return commonRequest(datas);
}
export function getWeather(city) {
  let datas = {
    url: window.config.requestUrl + "/api/run/getWeather",
    methods: "get",
    info: "获取天气",
    params: {
      city: city
    }
  };

  return commonRequest(datas);
}

export function getAppRunTime(params) {
  let datas = {
    url: window.config.requestUrl + "/api/System/AppRunTime",
    methods: "get",
    info: "获取运行时长",
    params
  };

  return commonRequest(datas);
}
