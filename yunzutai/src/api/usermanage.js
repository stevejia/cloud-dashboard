import { commonRequest } from "./request";
export function getProjectList(params) {
  let datas = {
    url: window.config.dataCenterUrl + "/api/cloudconfigure/Project/GetPages",
    methods: "post",
    info: "编辑态：获取项目列表",
    params: params
  };
  return commonRequest(datas);
}
export function getRunProjectList(params) {
  let datas = {
    url: window.config.dataCenterUrl + "/api/terminal/App/GetPages",
    methods: "post",
    info: "运行态：获取项目列表",
    params: params
  };
  return commonRequest(datas);
}
export function getUserList(params) {
  let datas = {
    url:
      window.config.dataCenterUrl + "/api/terminal/User/GetUserAndAppListPages",
    methods: "post",
    info: "运行态：获取用户信息列表",
    params: params
  };

  return commonRequest(datas);
}
export function getProjectListRun(params) {
  let datas = {
    url: window.config.dataCenterUrl + "/api/terminal/App/GetList",
    methods: "post",
    info: "运行态：获取用户信息新增的项目列表",
    params: params
  };

  return commonRequest(datas);
}

export function addUser(params) {
  let datas = {
    url: window.config.dataCenterUrl + "/api/terminal/User/Add",
    methods: "post",
    info: "运行态：新增用户",
    params: params
  };

  return commonRequest(datas);
}
export function editUser(params) {
  let datas = {
    url: window.config.dataCenterUrl + "/api/terminal/User/Edit",
    methods: "post",
    info: "运行态：编辑用户信息",
    params: params
  };

  return commonRequest(datas);
}
export function deleteUser(params) {
  let datas = {
    url: window.config.dataCenterUrl + "/api/terminal/User/Delete",
    methods: "post",
    info: "运行态：删除用户",
    params: params
  };

  return commonRequest(datas);
}
export function resetUser(params) {
  let datas = {
    url: window.config.dataCenterUrl + "/api/terminal/User/ResetPassword",
    methods: "post",
    info: "运行态：重置密码",
    params: params
  };
  return commonRequest(datas);
}
export function ChangePassword(params) {
  let datas = {
    url: window.config.dataCenterUrl + "/api/terminal/User/ChangePassword",
    methods: "post",
    info: "运行态：修改密码",
    params: params
  };
  return commonRequest(datas);
}
export function editUserLevel(params) {
  let datas = {
    url: window.config.dataCenterUrl + "/api/terminal/UserAuthority/Change",
    methods: "post",
    info: "运行态：修改用户权限",
    params: params
  };

  return commonRequest(datas);
}
