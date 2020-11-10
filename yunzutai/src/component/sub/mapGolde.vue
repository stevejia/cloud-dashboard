<template>
  <div class="symbolComp" :style="styles">
    <div class="maps">
      <div :id="container" :style="stylesMap"></div>
    </div>
  </div>
</template>
<script>
import mixin from "@/component/mixin.js";
var provinces = [
  {
    name: "北京市",
    center: [116.405285, 39.904989],
    type: 0,
    subDistricts: "北京中国帝都"
  },
  {
    name: "上海市",
    center: [121.38162, 31.11246],
    subDistricts: ""
  },
  {
    name: "天津市",
    center: [117.190182, 39.125596],
    subDistricts: "天津相声发源地"
  },

  {
    name: "广东省",
    center: [113.280637, 23.125178],
    subDistricts: ""
  },
  {
    name: "重庆市",
    center: [106.504962, 29.533155],
    subDistricts: ""
  },
  {
    name: "贵州省",
    center: [106.713478, 26.578343],
    subDistricts: ""
  }
];
export default {
  mixins: [mixin],
  props: {
    theme: String
  },

  data() {
    return {
      styles: {},
      stylesMap: {},
      white: {
        color: ""
      },
      black: {
        color: "#FFFFFF"
      },
      highConfig: {
        添加散点: {
          type: "explain"
        },
        散点: {
          type: "coordinateMap",
          list: provinces,
          limtLength: 50,
          value: [121.38162, 31.11246]
        }
      },
      baisicConfig: {
        尺寸: {
          type: "widthHeight",
          label: ["宽度", "高度"],
          value: [0, 0]
        },
        位置: {
          type: "widthHeight",
          label: ["横轴", "纵轴"],
          value: [0, 0]
        },
        线条1: {
          type: "line"
        },
        地图主题: {
          type: "select",
          label: [
            {
              label: "标准",
              value: "normal"
            },
            {
              label: "幻影黑",
              value: "dark"
            },
            {
              label: "月光银",
              value: "light"
            },
            {
              label: "远山黛",
              value: "whitesmoke"
            },
            {
              label: "草色青",
              value: "fresh"
            },
            {
              label: "雅士灰",
              value: "grey"
            },
            {
              label: "涂鸦",
              value: "graffiti"
            },
            {
              label: "马卡龙",
              value: "macaron"
            },
            {
              label: "靛青蓝",
              value: "blue"
            },
            {
              label: "极夜蓝",
              value: "darkblue"
            },
            {
              label: "酱籽",
              value: "wine"
            }
          ],
          value: "normal"
        },
        线条2: {
          type: "line"
        },
        旋转角度: {
          type: "slider",
          status: 1,
          range: [0, 360],
          value: 0
        }
      },
      mapData: {
        center: [104.063266, 30.578026],
        zoom: 12
      },
      container: "container",
      maps: "",
      infoWindow: "",
      bgColor: ""
    };
  },
  watch: {
    "$store.state.bgColor": function(vals, olds) {
      // let theme = this[this.theme];
      // console.log(123, this.$store.state.bgColor, vals, olds);
      if (vals !== olds) {
        this.getMap(vals);
      }
    }
  },
  mounted() {
    // this.$store.state.bgColor
  },
  methods: {
    initStyle(bool) {
      this.startInitStyle();
      console.log(123);
      this.getMap();
      this.endInitStyle(bool);
    },
    getMap() {
      let AMap = window.AMap;
      let mapStyle = this.baisicConfig["地图主题"].value;
      let backgroundColor = this.$parent.$parent.config["背景色"].value;
      var Num = "";
      for (var i = 0; i < 6; i++) {
        Num += Math.floor(Math.random() * 10);
      }
      this.container = this.container + Num;
      this.$nextTick(() => {
        this.stylesMap = {
          width: this.baisicConfig["尺寸"].value[0] - 80 + "px",
          height: this.baisicConfig["尺寸"].value[1] - 80 + "px"
        };
        var maps = new AMap.Map(this.container, {
          resizeEnable: true, //是否监控地图容器尺寸变化
          mapStyle: `amap://styles/${mapStyle}`,
          zoom: 4,
          center: [103.823557, 36.058039],
          pitch: 0
        });
        // maps.setFitView();
        new AMap.DistrictSearch({
          extensions: "all",
          subdistrict: 0
        }).search("中国", function(status, result) {
          // 外多边形坐标数组和内多边形坐标数组
          var outer = [
            new AMap.LngLat(-360, 90, true),
            new AMap.LngLat(-360, -90, true),
            new AMap.LngLat(360, -90, true),
            new AMap.LngLat(360, 90, true)
          ];
          var holes = result.districtList[0].boundaries;

          var pathArray = [outer];
          pathArray.push.apply(pathArray, holes);
          var polygon = new AMap.Polygon({
            pathL: pathArray,
            //线条颜色，使用16进制颜色代码赋值。默认值为#006600
            strokeColor: backgroundColor,
            strokeWeight: 4,
            //轮廓线透明度，取值范围[0,1]，0表示完全透明，1表示不透明。默认为0.9
            strokeOpacity: 0.5,
            //多边形填充颜色，使用16进制颜色代码赋值，如：#FFAA00
            fillColor: backgroundColor,
            //多边形填充透明度，取值范围[0,1]，0表示完全透明，1表示不透明。默认为0.9
            fillOpacity: 1,
            //轮廓线样式，实线:solid，虚线:dashed
            strokeStyle: "solid",
            /*勾勒形状轮廓的虚线和间隙的样式，此属性在strokeStyle 为dashed 时有效， 此属性在
              ie9+浏览器有效 取值：
              实线：[0,0,0]
              虚线：[10,10] ，[10,10] 表示10个像素的实线和10个像素的空白（如此反复）组成的虚线
              点画线：[10,2,10]， [10,2,10] 表示10个像素的实线和2个像素的空白 + 10个像素的实
              线和10个像素的空白 （如此反复）组成的虚线*/
            strokeDasharray: [10, 2, 10]
          });
          polygon.setPath(pathArray);
          maps.add(polygon);
        });
        this.maps = maps;
        // this.drewIcon(maps);

        this.markersMosever(maps);
      });
    },
    drewIcon(map) {
      let AMap = window.AMap;
      var markers = []; //province见Demo引用的JS文件
      for (var i = 0; i < provinces.length; i += 1) {
        var marker;
        if (provinces[i].type === 0) {
          var icon = new AMap.Icon({
            image: "https://vdata.amap.com/icons/b18/1/2.png",
            size: new AMap.Size(24, 24)
          });
          marker = new AMap.Marker({
            icon: icon,
            position: provinces[i].center,
            offset: new AMap.Pixel(-12, -12),
            zIndex: 101,
            title: provinces[i].name,
            map: map
          });
        } else {
          marker = new AMap.Marker({
            position: provinces[i].center,
            title: provinces[i].name,
            map: map
          });
        }
        markers.push(marker);
      }

      this.markersMosever(map);
    },
    markersMosever(map) {
      let AMap = window.AMap;
      var infoWindow = new AMap.InfoWindow({ offset: new AMap.Pixel(0, -30) });
      this.infoWindow = infoWindow;
      var lnglats = provinces;
      for (var i = 0; i < lnglats.length; i++) {
        var marker = new AMap.Marker({
          position: lnglats[i].center,
          map: map,
          title: lnglats[i].name
        });
        marker.content =
          "<div style='color:#000'>地名：" + lnglats[i].name + "</div>";
        marker.content +=
          "<div style='color:#000'>简介：" +
          (lnglats[i].subDistricts || lnglats[i].name + "的简介") +
          "</div>";
        (marker.content +=
          "<div style='color:#000'>经纬度：" + lnglats[i].center),
          +"</div>";

        marker.on("mouseover", this.infoOpen);
        marker.on("mouseout", this.infoClose);
        marker.on("click", this.newMAp);
      }
      map.setFitView();
    },
    newMAp(e) {
      //map.setCenter(e.target.getPosition());
      let AMap = window.AMap;
      let map = this.maps;
      map.setZoomAndCenter(6, e.target.getPosition());
      var infoWindow = new AMap.InfoWindow({ offset: new AMap.Pixel(0, -30) });
      infoWindow.setContent(e.target.content);
      infoWindow.open(map, e.target.getPosition());
      this.infoWindow = infoWindow;
    },

    infoClose(e) {
      let map = this.maps;
      this.infoWindow.close(map, e.target.getPosition());
    },
    infoOpen(e) {
      let map = this.maps;
      this.infoWindow.setContent(e.target.content);
      this.infoWindow.open(map, e.target.getPosition());
    },
    // 重绘
    resetComp(bool) {
      if (bool) {
        // console.log(this.maps);
        this.stylesMap = {
          width: this.baisicConfig["尺寸"].value[0] - 80 + "px",
          height: this.baisicConfig["尺寸"].value[1] - 80 + "px"
        };
      }
    }
  }
};
</script>
<style lang="less" scoped>
.maps {
  margin-left: 40px;
  margin-top: 40px;
}
</style>
<style lang="less" scoped>
.markers {
  border: 1px solid red;
  color: #000;
}
.taiwan {
  border: 1px solid red;
  color: #000;
}
</style>
