import { commonRequest } from "./request";
let preUrl = "http://dataapi.cloud.techsel.net";

export function bulkGet(params) {
  let datas = {
    url: preUrl + "/api/RealTimeData/BulkGet",
    methods: "post",
    info: "获取数据",
    params: params
  };

  return commonRequest(datas);
}
export function bulkSet(params) {
  let datas = {
    url: preUrl + "/api/RealTimeData/BulkSet",
    methods: "post",
    info: "获取数据",
    params: params
  };

  return commonRequest(datas);
}
