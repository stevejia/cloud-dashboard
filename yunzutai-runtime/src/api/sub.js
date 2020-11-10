import { commonRequest } from "./request";
export function getEnergyTable(params) {
  let datas = {
    url: window.config.bulk + "/api/StatisticsRegionEnergy/GetTable",
    methods: "post",
    info: "能耗表格数据查询",
    params: params
  };
  return commonRequest(datas);
}

export function getHistorylinechart(params) {
  let datas = {
    url: window.config.bulk + "/api/HistoryData/GetPages",
    methods: "post",
    info: "单点历史曲线",
    params: params
  };

  return commonRequest(datas);
}

export function getStatisticsProportion(params) {
  let datas = {
    url: window.config.bulk + "/api/StatisticsComparisonProportion/GroupGet",
    methods: "post",
    info: "环图数据查询",
    params: params
  };
  return commonRequest(datas);
}

export function getPerformanceList(params) {
  let datas = {
    url:
      window.config.gatewayUrl +
      "/common/api/v2.0/data-fetch/monitor/performance",
    methods: "get",
    info: "电站的性能列表",
    params: params
  };
  return commonRequest(datas);
}
