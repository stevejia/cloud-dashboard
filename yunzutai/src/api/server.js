import { commonRequest } from "./request";

//登录地址
export function login(params) {
  let datas = {
    url: window.config.dataCenterUrl + "/api/admin/Admin/LogIn",
    methods: "post",
    info: "登录",
    params
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
//登录之后获取用户信息
export function userInfo(params) {
  let datas = {
    url: window.config.dataCenterUrl + "/api/admin/Admin/GetUserInfo",
    methods: "post",
    info: "登录之后获取用户信息",
    params
  };
  return commonRequest(datas);
}
//获取项目配置
export function getConfig(params) {
  let datas = {
    url: window.config.requestUrl + "/api/config",
    methods: "get",
    info: "获取项目配置",
    params
  };
  return commonRequest(datas);
}
//保存项目配置
export function setConfig(params) {
  let datas = {
    url: window.config.requestUrl + "/api/config",
    methods: "post",
    info: "保存项目配置",
    params
  };
  return commonRequest(datas);
}
//南京运行态配置保存
export function run(params) {
  let datas = {
    url: window.config.requestUrl + "/api/run",
    methods: "post",
    info: "南京运行态配置保存",
    params: params
  };

  return commonRequest(datas);
}

//获取上传js列表
export function getUploadJsList(params) {
  let datas = {
    url: window.config.requestUrl + "/api/file/info",
    methods: "get",
    info: "获取上传js列表",
    params
  };
  return commonRequest(datas);
}
//获取js信息
export function getUploadJs(params) {
  let datas = {
    url: params.fileUrl,
    methods: "get",
    info: "获取js信息"
  };
  return commonRequest(datas);
}
//上传js信息
export function uploadJs(params, headers) {
  let datas = {
    url: window.config.requestUrl + "/api/file/upload/js",
    methods: "post",
    info: "上传js信息",
    params,
    headers
  };
  return commonRequest(datas);
}
//校验上传js名称
export function checkUploadJsName(params) {
  let datas = {
    url: window.config.requestUrl + "/api/file/check",
    methods: "get",
    info: "校验上传js名称",
    params
  };
  return commonRequest(datas);
}

// 获取点位配置
//http://cloudconfigserver.cloud.techsel.net/api/pointsdata?pid=1ef1ea58892748a3baac2c46ba9dd5ec
export function getPointsData(params) {
  let datas = {
    // url: "http://cloudconfigserver.cloud.techsel.net/api/pointsdata",
    url: window.config.requestUrl + "/api/pointsdata",
    methods: "get",
    info: "获取点位配置",
    // params: {
    //   pid: "1ef1ea58892748a3baac2c46ba9dd5ec"
    // }
    params: params
  };

  return commonRequest(datas);
}
//设置点位配置
export function setPointsData(params) {
  console.log(params);
  let datas = {
    // url: "http://cloudconfigserver.cloud.techsel.net/api/pointsdata",
    url: window.config.requestUrl + "/api/pointsdata",
    methods: "post",
    info: "设置点位配置",
    // params: {
    //   pid: "1ef1ea58892748a3baac2c46ba9dd5ec"
    // }
    params: params
  };
  return commonRequest(datas);
}
//获取测点列表
export function getTree(params) {
  let datas = {
    // url:
    //   "http://configcenterapi.cloud.techsel.net/api/cloudconfigure/DevicePoint/GetTree",
    url:
      window.config.dataCenterUrl + "/api/cloudconfigure/DevicePoint/GetTree",
    methods: "post",
    info: "获取测点列表",
    // params: {
    //   projectId: "7947b02bd86741daaf3b2d89a5f1f026"
    // }
    params: params
  };
  return commonRequest(datas);
}
