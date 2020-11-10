import { commonRequest } from "./request";
export function groupBulkGet(params) {
  let datas = {
    url: window.config.bulk + "/api/StatisticsDataCurrent/GroupBulkGet",
    // url: window.config.requestUrl + "/StatisticsData/BulkGet",
    methods: "post",
    info: "当前能耗图",
    params: params
  };

  return commonRequest(datas);
}
export function groupGet(params) {
  let datas = {
    url:
      window.config.bulk +
      "/api/StatisticsComparisonBeforeTimeOutMoney/GroupGet",
    // url: window.config.requestUrl + "/StatisticsData/BulkGet",
    methods: "post",
    info: "能耗标签",
    params: params
  };

  return commonRequest(datas);
}
export function bulkGet(params) {
  let datas = {
    url: window.config.bulk + "/api/RealTimeData/BulkGet",
    // url: window.config.requestUrl + "/StatisticsData/BulkGet",
    methods: "post",
    info: "获取数据",
    params: params
  };

  return commonRequest(datas);
}
export function chartBulkGet(params) {
  let datas = {
    url: window.config.bulk + "/api/StatisticsData/BulkGet",
    methods: "post",
    info: "搜索图表接口数据",
    params: params
  };
  return commonRequest(datas);
}
export function bulkSet(params) {
  let datas = {
    url: window.config.bulk + "/api/RealTimeData/BulkSet",
    // url: window.config.requestUrl + "/api/RealTimeData/BulkSet",
    methods: "post",
    info: "获取数据",
    params: params
  };

  return commonRequest(datas);
}
export function timerBulkSet(params) {
  let datas = {
    url: window.config.timerUrl + "/api/TimerTask/BulkSet",
    // url: window.config.requestUrl + "/api/RealTimeData/BulkSet",
    methods: "post",
    info: "获取数据",
    params: params
  };

  return commonRequest(datas);
}
export function timerBulkCtrl(params) {
  let datas = {
    url: window.config.timerUrl + "/api/TimerTask/BulkCtrl",
    // url: window.config.requestUrl + "/api/RealTimeData/BulkSet",
    methods: "post",
    info: "获取数据",
    params: params
  };

  return commonRequest(datas);
}
export function timerTask(params) {
  let datas = {
    url: window.config.timerUrl + "/api/TimerTask/GroupBulkGet",
    // url: window.config.requestUrl + "/api/RealTimeData/BulkSet",
    methods: "post",
    info: "获取数据",
    params: params
  };

  return commonRequest(datas);
}
export function apsBulkSet(params) {
  let datas = {
    url: window.config.timerUrl + "/api/ScheduleTask/BulkSet",
    // url: window.config.requestUrl + "/api/RealTimeData/BulkSet",
    methods: "post",
    info: "获取数据",
    params: params
  };

  return commonRequest(datas);
}

export function apsBulkCtrl(params) {
  let datas = {
    url: window.config.timerUrl + "/api/ScheduleTask/BulkCtrl",
    // url: window.config.requestUrl + "/api/RealTimeData/BulkSet",
    methods: "post",
    info: "获取数据",
    params: params
  };

  return commonRequest(datas);
}
export function apsTask(params) {
  let datas = {
    url: window.config.timerUrl + "/api/ScheduleTask/GroupBulkGet",
    // url: window.config.requestUrl + "/api/RealTimeData/BulkSet",
    methods: "post",
    info: "获取数据",
    params: params
  };

  return commonRequest(datas);
}

export function getDataComparisionData(params) {
  let datas = {
    url: window.config.bulk + "/api/StatisticsComparisonBeforeTime/GroupGet",
    // url: window.config.requestUrl + "/api/RealTimeData/BulkSet",
    methods: "post",
    info: "获取数据对比图数据",
    params
  };

  return commonRequest(datas);
}

export function getCOPData(params) {
  let datas = {
    url: window.config.bulk + "/api/StatisticsEnergyCOP/Get",
    // url: window.config.requestUrl + "/api/RealTimeData/BulkSet",
    methods: "post",
    info: "获取数据对比图数据",
    params
  };

  return commonRequest(datas);
}
