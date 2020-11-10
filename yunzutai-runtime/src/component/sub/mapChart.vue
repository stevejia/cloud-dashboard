<template>
  <div class="map-container" :style="styles">
    <a id="back_btn" class="back_hide" @click="backToChina($event)">返回</a>
    <div class="map-chart" id="map-chart"></div>
  </div>
</template>

<script>
import echarts from "echarts";
import china from "echarts/map/json/china.json";
// import axios from "axios";

import shanghai from "echarts/map/json/province/shanghai.json";
import hebei from "echarts/map/json/province/hebei.json";
import shanxi from "echarts/map/json/province/shanxi.json";
import neimenggu from "echarts/map/json/province/neimenggu.json";
import liaoning from "echarts/map/json/province/liaoning.json";
import jilin from "echarts/map/json/province/jilin.json";
import heilongjiang from "echarts/map/json/province/heilongjiang.json";
import jiangsu from "echarts/map/json/province/jiangsu.json";
import zhejiang from "echarts/map/json/province/zhejiang.json";
import anhui from "echarts/map/json/province/anhui.json";
import fujian from "echarts/map/json/province/fujian.json";
import jiangxi from "echarts/map/json/province/jiangxi.json";
import shandong from "echarts/map/json/province/shandong.json";
import henan from "echarts/map/json/province/henan.json";
import hubei from "echarts/map/json/province/hubei.json";
import hunan from "echarts/map/json/province/hunan.json";
import guangdong from "echarts/map/json/province/guangdong.json";
import guangxi from "echarts/map/json/province/guangxi.json";
import hainan from "echarts/map/json/province/hainan.json";
import sichuan from "echarts/map/json/province/sichuan.json";
import guizhou from "echarts/map/json/province/guizhou.json";
import yunnan from "echarts/map/json/province/yunnan.json";
import xizang from "echarts/map/json/province/xizang.json";
import shanxi1 from "echarts/map/json/province/shanxi1.json";
import gansu from "echarts/map/json/province/gansu.json";
import qinghai from "echarts/map/json/province/qinghai.json";
import ningxia from "echarts/map/json/province/ningxia.json";
import xinjiang from "echarts/map/json/province/xinjiang.json";
import beijing from "echarts/map/json/province/beijing.json";
import tianjin from "echarts/map/json/province/tianjin.json";
import chongqing from "echarts/map/json/province/chongqing.json";
import xianggang from "echarts/map/json/province/xianggang.json";
import aomen from "echarts/map/json/province/aomen.json";
import taiwan from "echarts/map/json/province/taiwan.json";

echarts.registerMap("china", china);
const provinceMap = {
  上海: {
    data: shanghai,
    name: "shanghai"
  },
  河北: {
    data: hebei,
    name: "hebei"
  },
  山西: {
    data: shanxi,
    name: "shanxi"
  },
  内蒙古: {
    data: neimenggu,
    name: "neimenggu"
  },
  辽宁: {
    data: liaoning,
    name: "liaoning"
  },
  吉林: {
    data: jilin,
    name: "jilin"
  },
  黑龙江: {
    data: heilongjiang,
    name: "heilongjiang"
  },
  江苏: {
    data: jiangsu,
    name: "jiangsu"
  },
  浙江: {
    data: zhejiang,
    name: "zhejiang"
  },
  安徽: {
    data: anhui,
    name: "anhui"
  },
  福建: {
    data: fujian,
    name: "fujian"
  },
  江西: {
    data: jiangxi,
    name: "jiangxi"
  },
  山东: {
    data: shandong,
    name: "shandong"
  },
  河南: {
    data: henan,
    name: "henan"
  },
  湖北: {
    data: hubei,
    name: "hubei"
  },
  湖南: {
    data: hunan,
    name: "hunan"
  },
  广东: {
    data: guangdong,
    name: "guangdong"
  },
  广西: {
    data: guangxi,
    name: "guangxi"
  },
  海南: {
    data: hainan,
    name: "hainan"
  },
  四川: {
    data: sichuan,
    name: "sichuan"
  },
  贵州: {
    data: guizhou,
    name: "guizhou"
  },
  云南: {
    data: yunnan,
    name: "yunnan"
  },
  西藏: {
    data: xizang,
    name: "xizang"
  },
  陕西: {
    data: shanxi1,
    name: "shanxi1"
  },
  甘肃: {
    data: gansu,
    name: "gansu"
  },
  青海: {
    data: qinghai,
    name: "qinghai"
  },
  宁夏: {
    data: ningxia,
    name: "ningxia"
  },
  新疆: {
    data: xinjiang,
    name: "xinjiang"
  },
  北京: {
    data: beijing,
    name: "beijing"
  },
  天津: {
    data: tianjin,
    name: "tianjin"
  },
  重庆: {
    data: chongqing,
    name: "chongqing"
  },
  香港: {
    data: xianggang,
    name: "xianggang"
  },
  澳门: {
    data: aomen,
    name: "aomen"
  },
  台湾: {
    data: taiwan,
    name: "taiwan"
  }
};
import { initStyle, getBasicConfig } from "../common";
export default {
  props: {
    theme: String
  },
  data() {
    return {
      styles: {},
      white: {
        backgroundColor: "#ffffff",
        color: "#000000"
      },
      black: {
        backgroundColor: "#2b2e37",
        color: "white"
      },
      widthHeight: [720, 300],
      position: [0, 0],
      background: "",
      mapBackground: "#323c48",
      splitColor: "#111111",
      emphasisColor: "#2a333d",
      scatterColor: "#02FF96",
      opacity: 100,
      resetStyle: null,
      rotateDeg: 0,
      scatter: {
        place: "china",
        list: [
          {
            type: "china",
            data: {
              id: "110000",
              cp: [116.405285, 39.904989],
              name: "背景",
              title: 3333
            }
          }
        ]
      }
    };
  },
  created() {
    getBasicConfig.bind(this)();
  },
  mounted() {
    this.initMap();
  },
  methods: {
    resetComp(bool) {
      if (bool) {
        this.map && this.map.resize();
      }
    },
    initStyle(bool) {
      initStyle(bool, this, styles => {
        this.$data.highConfig = this.highConfig;
        this.styles = styles;
        this.renderMap();
      });
    },
    getMapOpt(place, title) {
      let mapBgColor = (this.baisicConfig["地图背景颜色"] || {}).value || "";
      let splitColor = (this.baisicConfig["分界色"] || {}).value || "";
      let emphasisColor = (this.baisicConfig["悬停区域颜色"] || {}).value || "";
      let backgroundColor = (this.baisicConfig["背景颜色"] || {}).value || "";
      place = place || "china";
      let series = this.getScatterSeries(
        this.$data.highConfig["散点列表"].list,
        place
      );
      let option = {
        backgroundColor: backgroundColor,
        title: {
          text: title || "全国地图",
          left: "center",
          top: 10,
          textStyle: {
            color: "#ffffff"
          }
        },
        tooltip: {
          trigger: "item",
          formatter: params => {
            console.log(params);
            return "test";
          }
          // position:['10%','10%'],
        },
        geo: {
          map: place,
          zoom: 1.05,
          // show: true,
          //   label: {},
          scaleLimit: {
            min: 0.5,
            max: 50
          },
          roam: true, //是否允许鼠标滚动放大，缩小
          label: {
            //图形上的文本标签，可用于说明图形的一些数据信息
            show: false, //是否显示文本
            color: "#ffffff", //文本颜色
            emphasis: {
              show: true,
              color: "#ffffff"
            }
          },
          itemStyle: {
            normal: {
              areaColor: mapBgColor,
              borderColor: splitColor
            },
            emphasis: {
              areaColor: emphasisColor
            }
          },
          emphasis: {
            //高亮状态下的多边形和标签样式。
            label: {
              //文本
              color: "#ffffff"
            },
            itemStyle: {
              //区域
              areaColor: "#24252A"
            }
          }
        },
        series
      };
      console.log(place);
      this.highConfig["散点列表"].place = place;

      // this.highConfig["散点列表"].place = place;
      return option;
    },
    getScatterSeries(list, place) {
      let scatterColor = (this.baisicConfig["散点颜色"] || {}).value || "";
      let data = list.filter(li => {
        return li.type === place;
      });
      data = data.map(da => {
        return {
          value: da.data.cp,
          name: da.data.name
        };
      });
      let series = [
        {
          type: "effectScatter", //样试（散点）
          coordinateSystem: "geo", //该系列使用的坐标系
          data: data,
          symbolSize: 15,
          itemStyle: {
            //样试。
            normal: {
              //默认样试
              color: scatterColor,
              shadowBlur: 10,
              shadowColor: "#333"
            }
          },
          label: {
            normal: {
              formatter: "{a}",
              position: "right",
              show: false
            }
          },
          showEffectOn: "render",
          rippleEffect: {
            //涟漪特效相关配置。
            brushType: "stroke", //波纹的绘制方式
            scale: 3 //波纹范围
          },
          zlevel: 1,
          hoverAnimation: true //鼠标移入放大圆
        }
      ];
      return series;
    },
    //显示中国地图
    showChinaMap() {
      let option = this.getMapOpt();
      this.map.setOption(option, true);
    },
    //显示各省地图
    getProvinceMapOpt(provinceName) {
      let provinceConfig = provinceMap[provinceName];
      if (!provinceConfig) {
        return;
      }
      echarts.registerMap(provinceConfig.name, provinceConfig.data);
      let option = this.getMapOpt(provinceConfig.name, provinceName);
      this.map.setOption(option, true);
      this.currentPlace = provinceConfig.name;
      this.currentPlaceName = provinceName;
      this.$el.querySelector("#back_btn").classList.remove("back_hide");
    },
    initMap() {
      var dom = this.$el.querySelector("#map-chart");
      this.map = echarts.init(dom);
      this.map.on("click", param => {
        event.stopPropagation(); // 阻止冒泡
        // 重新渲染各省份地图
        this.getProvinceMapOpt(param.name);
      });
    },
    renderMap() {
      let currentPlace = this.currentPlace || "china";
      let currentPlaceName = this.currentPlaceName || "全国地图";
      let option = this.getMapOpt(currentPlace, currentPlaceName);
      if (option && typeof option === "object") {
        this.map.setOption(option, true);
      }
    },
    backToChina(event) {
      event.preventDefault();
      event.stopPropagation();
      if (this.currentPlace === "china") {
        return;
      }
      this.currentPlace = "china";
      this.currentPlaceName = "全国地图";
      this.renderMap();
      this.$el.querySelector("#back_btn").classList.add("back_hide");
    }
  }
};
</script>

<style>
.map-container {
  width: 100%;
  height: 100%;
  position: relative;
}
.map-container a {
  font-size: 16px;
  color: #ffffff;
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 2;
  cursor: pointer;
}
.map-chart {
  width: 100%;
  height: 100%;
  background: #404a59;
}

.back_hide {
  display: none;
}
</style>
