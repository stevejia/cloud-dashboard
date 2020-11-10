import { commonRequest } from "./request";
export function chartBulkGet(params) {
  let datas = {
    url: window.config.bulk + "/api/StatisticsData/BulkGet",
    methods: "post",
    info: "柱状折线图/折线图",
    params: params
  };

  return commonRequest(datas);
}
export function getComparechart(params) {
  let datas = {
    url: window.config.bulk + "/api/StatisticsComparison/Get",
    methods: "post",
    info: "获取涨幅对比",
    params: params
  };

  return commonRequest(datas);
}
export function getRankingChart(params) {
  let datas = {
    url: window.config.bulk + "/api/StatisticsRanking/Get",
    methods: "post",
    info: "能耗排名",
    params: params
  };

  return commonRequest(datas);
}
