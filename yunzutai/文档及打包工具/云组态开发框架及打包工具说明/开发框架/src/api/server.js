import { commonRequest } from "./request";
let preUrl = "http://cloudconfigserver.cloud.techsel.net";
//http://cloudconfigserver.cloud.techsel.net/api/config?pid=1ef1ea58892748a3baac2c46ba9dd5ec
// export function getConfig(params) {
//   let datas = {
//     url: preUrl + "/api/config",
//     methods: "get",
//     info: "获取项目配置",
//     params: params
//   };

//   return commonRequest(datas);
// }

// export function setConfig(params) {
//   let datas = {
//     url: preUrl + "/api/config",
//     methods: "post",
//     info: "更新项目配置",
//     params: params
//   };

//   return commonRequest(datas);
// }
//http://cloudconfigserver.cloud.techsel.net/api/pointsdata?pid=1ef1ea58892748a3baac2c46ba9dd5ec
export function getPointsData() {
  let datas = {
    url: preUrl + "/api/pointsdata",
    methods: "get",
    info: "获取点位配置",
    params: {
      pid: "1ef1ea58892748a3baac2c46ba9dd5ec"
    }
  };

  return commonRequest(datas);
}
//http://cloudconfigserver.cloud.techsel.net/api/pointsdata?pid=1ef1ea58892748a3baac2c46ba9dd5ec
export function setPointsData(params) {
  let datas = {
    url: preUrl + "/api/pointsdata",
    methods: "post",
    info: "更新点位配置",
    params: params
  };

  return commonRequest(datas);
}

//http://cloudconfigserver.cloud.techsel.net/api/run
export function run(params) {
  let datas = {
    url: preUrl + "/api/run",
    methods: "post",
    info: "run",
    params: params
  };

  return commonRequest(datas);
}

//http://cloudconfigserver.cloud.techsel.net/api/config/permiss?pid=1ef1ea58892748a3baac2c46ba9dd5ec
export function permiss() {
  let datas = {
    url: preUrl + "/api/config/permiss",
    methods: "get",
    info: "run",
    params: {
      pid: "1ef1ea58892748a3baac2c46ba9dd5ec"
    }
  };

  return commonRequest(datas);
}

//获取项目配置
export function getConfig(params) {
  let datas = {
    url: window.config.requestUrl + "/config",
    methods: "get",
    info: "config",
    params
  };
  return commonRequest(datas);
}
