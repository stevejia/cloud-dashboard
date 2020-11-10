import { commonRequest } from "./request";

export function getPermisions(params) {
  let datas = {
    url: window.config.dataCenterUrl + "/menu",
    methods: "get",
    params: { ...params },
    info: "运行态：获取角色权限菜单列表"
  };
  return commonRequest(datas);
}

export function getRoleInfo(params) {
  let datas = {
    url: window.config.dataCenterUrl + "/role",
    methods: "get",
    params: { ...params },
    info: "运行态：获取角色信息"
  };
  return commonRequest(datas);
}

export function addRoles(params) {
  let datas = {
    url: window.config.dataCenterUrl + "/role",
    methods: "post",
    params: { ...params },
    info: "运行态：添加角色信息"
  };
  return commonRequest(datas);
}

export function editRoles(params) {
  return commonRequest({
    url: window.config.dataCenterUrl + "/role",
    methods: "put",
    params: { ...params },
    info: "运行态：编辑角色信息"
  });
}

export function deleteRole(params) {
  return commonRequest({
    url: window.config.dataCenterUrl + "/role/" + params,
    methods: "delete",
    info: "运行态：删除角色信息"
  });
}

export function getRolesList(params) {
  return commonRequest({
    url:
      window.config.dataCenterUrl +
      "/role/list/" +
      window.sessionStorage.getItem("SubProjectId"),
    methods: "get",
    params: { ...params },
    info: "运行态：获取角色信息列表"
  });
}

export function getUsersList(params) {
  return commonRequest({
    url: window.config.dataCenterUrl + "/users/list",
    methods: "post",
    params: { ...params },
    info: "运行态：获取用户信息列表"
  });
}

export function getCurrentUserInfo() {
  return commonRequest({
    url: window.config.dataCenterUrl + "/api/terminal/User/GetCurrentUserInfo",
    methods: "post",
    info: "运行态：获取当前登录用户信息"
  });
}

export function addUser(params) {
  return commonRequest({
    url: window.config.dataCenterUrl + "/api/terminal/User/Add",
    methods: "post",
    params: { ...params },
    info: "运行态：添加用户信息"
  });
}

export function editUser(params) {
  return commonRequest({
    url: window.config.dataCenterUrl + "/api/terminal/User/Edit",
    methods: "post",
    params: { ...params },
    info: "运行态：编辑用户信息"
  });
}

export function deleteUser(params) {
  return commonRequest({
    url: window.config.dataCenterUrl + "/api/terminal/User/Delete",
    methods: "post",
    params: { ...params },
    info: "运行态：删除用户信息"
  });
}

export function resetPassword(params) {
  return commonRequest({
    url: window.config.dataCenterUrl + "/api/terminal/User/ResetPassword",
    methods: "post",
    params: { ...params },
    info: "运行态：重置用户密码"
  });
}

export function changeUserLevel(params) {
  return commonRequest({
    url: window.config.dataCenterUrl + "/api/terminal/UserAuthority/Change",
    methods: "post",
    params: { ...params },
    info: "运行态：设置等级权限"
  });
}

export function setRoleAuthority(params) {
  return commonRequest({
    url: window.config.dataCenterUrl + "/user/role",
    methods: "post",
    params: { ...params },
    info: "运行态：设置角色权限"
  });
}

export function getUserAuthorityType(params) {
  return commonRequest({
    url: window.config.dataCenterUrl + "/permssion/category",
    methods: "get",
    params: { ...params },
    info: "运行态：获取用户权限类型"
  });
}
