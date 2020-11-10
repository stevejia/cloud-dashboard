import { commonRequest } from "./request";
let preUrl = "http://configcenterapi.cloud.techsel.net";
//http://configcenterapi.cloud.techsel.net/api/admin/Admin/LogIn
export function logins(params) {
  let datas = {
    url: preUrl + "/api/admin/Admin/LogIn",
    methods: "post",
    info: "登录",
    params: params
  };

  return commonRequest(datas);
}
//http://configcenterapi.cloud.techsel.net/api/admin/Admin/GetUserInfo
export function getUserInfo(params) {
  let datas = {
    url: preUrl + "/api/admin/Admin/GetUserInfo",
    methods: "post",
    info: "获取用户信息",
    params: params
  };
  return commonRequest(datas);
}

//http://configcenterapi.cloud.techsel.net/api/cloudconfigure/Project/GetPages
export function getPages(params) {
  let datas = {
    url: preUrl + "/api/cloudconfigure/Project/GetPages",
    methods: "post",
    info: "获取项目列表",
    params: params
  };

  return commonRequest(datas);
}

//http://configcenterapi.cloud.techsel.net/api/cloudconfigure/DevicePoint/GetTree
export function getTree() {
  let datas = {
    url: preUrl + "/api/cloudconfigure/DevicePoint/GetTree",
    methods: "post",
    info: "获取项目下拉",
    params: {
      projectId: "7947b02bd86741daaf3b2d89a5f1f026"
    }
  };

  return commonRequest(datas);
}
