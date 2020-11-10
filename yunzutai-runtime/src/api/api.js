import { commonRequest } from "./request";
export function logins(params) {
  let datas = {
    url: window.config.requestUrl + "/api/admin/Admin/LogIn",
    methods: "post",
    info: "登录",
    params: params
  };

  return commonRequest(datas);
}
export function getUserInfo(params) {
  let datas = {
    url: window.config.requestUrl + "/api/admin/Admin/GetUserInfo",
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

export function getTables(params) {
  let datas = {
    url: window.config.requestUrl + "/api/cloudconfigure/Project/GetPages",
    methods: "post",
    info: "获取项目列表",
    params: {
      key: "",
      order: "",
      projectTypeId: "",
      time: "",
      where: "",
      ...params
    }
  };

  return commonRequest(datas);
}
// 获取token
export function getToken(params) {
  let datas = {
    url: window.config.getToken + "user-center/cloud/user/project/admin/token",
    methods: "get",
    info: "获取token",
    params: params
  };

  return commonRequest(datas);
}
