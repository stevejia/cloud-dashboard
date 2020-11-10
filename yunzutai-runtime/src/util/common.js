// 基础
import FlowPipe from "@/component/base/flowPipe.vue";
import Demo from "@/component/base/demo.vue";
import Test from "@/component/base/test.vue";
import TestTable from "@/component/base/testTable.vue";
import Texts from "@/component/base/text.vue";
import Numbers from "@/component/base/number.vue";
import Rects from "@/component/base/rect.vue";
import Animations from "@/component/base/animation.vue";
import Sharps from "@/component/base/sharp.vue";
import Webviews from "@/component/base/webview.vue";
import Containers from "@/component/base/container.vue";
import Circles from "@/component/base/circle.vue";
// 图库
import Maps from "@/component/map/map.vue";
// 组件
import SwitchBtns from "@/component/sub/switchBtn.vue";
import Slider from "@/component/sub/slider.vue";
import Progress from "@/component/sub/progress.vue";
import Time from "@/component/sub/time.vue";
import PieSolid from "@/component/sub/pieSolid.vue";
import PieRing from "@/component/sub/pieRing.vue";
import PieRing2 from "@/component/sub/pieRing2.vue";
import SubTitle from "@/component/sub/title.vue";
import DateSelect from "@/component/sub/dateSelect.vue";
import BarChart from "@/component/sub/barChart.vue";
import GaugeChart from "@/component/sub/gaugechart.vue";
import aircon1 from "@/component/sub/airConditioner1.vue";
import aircon2 from "@/component/sub/airConditioner2.vue";
import aircon3 from "@/component/sub/airConditioner3.vue";
import aircon4 from "@/component/sub/airConditioner4.vue";
import statistics from "@/component/sub/statistics.vue";
import install from "@/component/sub/install.vue";
import lightingOne from "@/component/sub/lightingOne.vue"; //灯光组1
import lightingTwo from "@/component/sub/lightingTwo.vue"; //灯光组2
import cellTable from "@/component/sub/cellTable.vue";
import subTable from "@/component/sub/subTable.vue";
import historyTable from "@/component/sub/historytable.vue";
import statisticsTable from "@/component/sub/statisticstable.vue";
import energyTable from "@/component/sub/energytable.vue";
// import MapChart from "@/component/sub/mapChart.vue";
import MapGolde from "@/component/sub/mapGolde.vue";
import Security from "@/component/sub/security.vue";
import datacomparison from "@/component/sub/datacomparison.vue";
import environment1 from "@/component/sub/environment1.vue";
import environment2 from "@/component/sub/environment2.vue";
import historylinechart from "@/component/sub/historylinechart.vue"; //单点历史曲线图
import foldlinechart from "@/component/sub/foldlinechart.vue"; //折线图
import foldlinenochart from "@/component/sub/foldlinenochart.vue"; //折线图无时间
import linechart from "@/component/sub/linechart.vue"; //实时图-1
import realtimechart from "@/component/sub/realtimechart.vue"; //实时图-2
import progressList from "@/component/sub/progressList.vue"; //实时图-2

import mode from "@/component/sub/mode.vue"; //实时图-2
import mode2 from "@/component/sub/mode2.vue"; //实时图-2
// 高级
import Alarm from "@/component/high/alarm.vue";
import Alarm2 from "@/component/high/alarm2.vue";
import Tree from "@/component/high/tree.vue";
import Comlinebar from "@/component/high/comlinebar.vue";
import combinedchart from "@/component/high/combinedchart.vue";
import Scenes from "@/component/high/scenes.vue"; //场景
import Comparechart from "@/component/high/comparechart.vue";
import ComRank2chart from "@/component/high/rank2chart.vue";
import CombinationCurve from "@/component/high/combinationCurve.vue";
import COP from "@/component/high/cop.vue";
import Currentenergychart from "@/component/high/currentenergychart.vue";
import EnergyConsumptionEstimation from "@/component/high/energyConsumptionEstimation.vue";
import Efficientchart from "@/component/high/efficientchart.vue";
import statisticschart from "@/component/high/statisticschart.vue"; //能耗统计
import Timer from "@/component/high/timer.vue"; //定时
import Aps from "@/component/high/aps.vue"; //排程

// 专业
import Monitor from "@/component/spec/monitor.vue";
import LinkAnalyseComp from "@/component/spec/linkAnalyseComp.vue"; //关联分析组件
import Transformer from "@/component/spec/transformer.vue"; //变压器
import FreezingStation from "@/component/spec/freezingStation.vue"; //冷冻站

//生成唯一id
export function guid() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
//组装样式
export function packFont(val) {
  return {
    fontSize: val[0],
    fontFamily: val[1],
    fontWeight: val[2],
    color: val[3]
  };
}

//获取页面列表
export function getPages(that) {
  let addRoute = [
    {
      value: "用户管理",
      label: "用户管理"
    },
    {
      value: "操作日志",
      label: "操作日志"
    }
  ];
  return that.$drag.$left.$refs.pages.pages
    .map(item => {
      return {
        label: item.name,
        value: item.id
      };
    })
    .concat(addRoute);
}

//获取组件 不同类型的组件放在相应的位置方便查找
export function getComp(type) {
  let comp = null;
  switch (type) {
    case "flowPipe":
      comp = FlowPipe;
      break;
    case "text": //基础类
      comp = Texts;
      break;
    case "number":
      comp = Numbers;
      break;
    case "circle":
      comp = Circles;
      break;
    case "animation":
      comp = Animations;
      break;
    case "rect":
      comp = Rects;
      break;
    case "container":
      comp = Containers;
      break;
    case "webview":
      comp = Webviews;
      break;
    case "sharp":
      comp = Sharps;
      break;
    case "开关按钮": //组件类
      comp = SwitchBtns;
      break;
    case "标题栏":
      comp = SubTitle;
      break;
    case "拖动条":
      comp = Slider;
      break;
    case "进度条":
      comp = Progress;
      break;
    case "时间":
      comp = Time;
      break;
    case "饼图":
      comp = PieSolid;
      break;
    case "环图":
      comp = PieRing;
      break;
    case "环图2":
      comp = PieRing2;
      break;
    case "日期选择器":
      comp = DateSelect;
      break;
    case "灯光组-1":
      comp = lightingOne;
      break;
    case "灯光组-2":
      comp = lightingTwo;
      break;
    case "树形关联图":
      comp = Tree;
      break;
    case "测试":
      comp = Test;
      break;
    case "测试表格":
      comp = TestTable;
      break;
    case "barchart":
      comp = BarChart;
      break;
    case "gaugechart":
      comp = GaugeChart;
      break;
    case "echarts_combinationCurve":
      comp = CombinationCurve;
      break;
    case "aircon1":
      comp = aircon1;
      break;
    case "mapChart":
      // comp = MapChart;
      comp = Demo;
      break;
    case "mapGolde":
      comp = MapGolde;
      break;
    case "aircon2":
      comp = aircon2;
      break;
    case "security":
      comp = Security;
      break;
    case "datacomparison":
      comp = datacomparison;
      break;
    case "environment1":
      comp = environment1;
      break;
    case "environment2":
      comp = environment2;
      break;
    case "mode":
      comp = mode;
      break;
    case "mode2":
      comp = mode2;
      break;
    case "aircon3":
      comp = aircon3;
      break;
    case "aircon4":
      comp = aircon4;
      break;
    case "table":
      comp = subTable;
      break;
    case "celltable":
      comp = cellTable;
      break;

    case "historylinechart":
      comp = historylinechart;
      break;
    case "foldlinechart":
      comp = foldlinechart;
      break;
    case "foldlinenochart":
      comp = foldlinenochart;
      break;
    case "linechart":
      comp = linechart;
      break;
    case "realtimechart":
      comp = realtimechart;
      break;
    case "historytable":
      comp = historyTable;
      break;
    case "statisticstable":
      comp = statisticsTable;
      break;
    case "energytable":
      comp = energyTable;
      break;
    case "statistics":
      comp = statistics;
      break;
    case "install":
      comp = install;
      break;
    case "progressList":
      comp = progressList;
      break;

    case "echarts_柱状折线图": //高级类
      comp = Comlinebar;
      break;
    case "echarts_combinedchart":
      comp = combinedchart;
      break;
    case "scenes":
      comp = Scenes;
      break;
    case "timer":
      comp = Timer;
      break;
    case "echarts_cop":
      comp = COP;
      break;
    case "comparechart":
      comp = Comparechart;
      break;
    case "rank2chart":
      comp = ComRank2chart;
      break;
    case "currentenergychart":
      comp = Currentenergychart;
      break;
    case "echarts_energyConsumptionEstimation":
      comp = EnergyConsumptionEstimation;
      break;
    case "efficientchart":
      comp = Efficientchart;
      break;
    case "statisticschart":
      comp = statisticschart;
      break;
    case "aps":
      comp = Aps;
      break;
    case "alarm":
      comp = Alarm;
      break;
    case "alarm2":
      comp = Alarm2;
      break;
    case "monitor": //专业类
      comp = Monitor;
      break;
    case "transformerchart": //专业类
      comp = Transformer;
      break;
    case "freezingchart": //专业类
      comp = FreezingStation;
      break;
    case "correlatchart": //专业类
      comp = LinkAnalyseComp;
      break;
    default:
      comp = Maps; //图库类
      break;
  }
  return comp;
}
