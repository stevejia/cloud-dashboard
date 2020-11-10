<template>
  <div class="project-map-container">
    <i
      title="返回项目列表"
      class="iconfont iconjiben project-list-icon"
      @click="gotoProjectList"
    ></i>
    <div id="background">
      <div id="mapChart"></div>
    </div>
  </div>
</template>
<script>
import echarts from "echarts";
import "echarts/map/js/china";
import WarpDrive from "@/util/starrySky.js";
import { getProjectList } from "@/api/usermanage";
export default {
  data() {
    return {};
  },
  mounted() {
    this.initStarrySky();
    this.listProject(this.initProjectMap);
    this.contentEl = document.querySelector(".content");

    this.contentEl.classList.remove("content");
  },
  methods: {
    initStarrySky() {
      let width = window.innerWidth;
      let height = window.innerHeight;
      const settings = {
        width: width,
        height: height,
        autoResize: true,
        autoResizeMinWidth: null,
        autoResizeMaxWidth: null,
        autoResizeMinHeight: null,
        autoResizeMaxHeight: null,
        addMouseControls: true,
        addTouchControls: true,
        hideContextMenu: true,
        starCount: 4444,
        starBgCount: 2222,
        starBgColor: { r: 2, g: 123, b: 201 },
        starBgColorRangeMin: 10,
        starBgColorRangeMax: 40,
        starColor: { r: 2, g: 123, b: 201 },
        starColorRangeMin: 70,
        starColorRangeMax: 100,
        starfieldBackgroundColor: { r: 6, g: 14, b: 26 },
        starDirection: 1,
        starSpeed: 15,
        starSpeedMax: 150,
        starSpeedAnimationDuration: 2,
        starFov: 200,
        starFovMin: 250,
        starFovAnimationDuration: 2,
        starRotationPermission: true,
        starRotationDirection: -1,
        starRotationSpeed: 0.0,
        starRotationSpeedMax: 1.5,
        starRotationAnimationDuration: 8,
        starWarpLineLength: 1.0,
        starWarpTunnelDiameter: 1000,
        starFollowMouseSensitivity: 0.015,
        starFollowMouseXAxis: true,
        starFollowMouseYAxis: true
      };
      this.warpDrive = new WarpDrive(
        document.querySelector("#background"),
        settings
      );
    },
    async listProject(callback) {
      let { data } = await getProjectList({
        pageIndex: 0,
        pageSize: 1000000
      });
      callback(data.items);
    },
    initProjectMap(projectList) {
      var mapChart = echarts.init(document.getElementById("mapChart"));
      let data = projectList.map(item => {
        return {
          projectName: item.projectName,
          subProjectName: item.subProjectName,
          value: [item.longitude, item.latitude],
          projectId: item.projectId,
          subProjectId: item.subProjectId,
          domain: item.domain
        };
      });
      const option = {
        title: {
          left: "center"
        },
        tooltip: {
          trigger: "item",
          formatter: params => {
            return (
              "项目名称：" +
              params.data.projectName +
              "<br/>" +
              "应用名称：" +
              params.data.subProjectName
            );
          }
          // position:['10%','10%'],
        },
        grid: {
          top: "0%",
          left: "0",
          bottom: "0%"
        },
        //要显示散点图，必须填写这个配置
        geo: {
          map: "china",
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
            color: "#CCC", //文本颜色
            emphasis: {
              show: false
            }
          },
          itemStyle: {
            normal: {
              areaColor: "#027BC9",
              borderColor: "#fff"
            },
            emphasis: {
              areaColor: "#0287DD"
            }
          },
          emphasis: {
            //高亮状态下的多边形和标签样式。
            label: {
              //文本
              color: "#ccc"
            },
            itemStyle: {
              //区域
              areaColor: "#24252A"
            }
          }
        },
        series: [
          {
            type: "effectScatter", //样试（散点）
            coordinateSystem: "geo", //该系列使用的坐标系
            data: data,
            symbolSize: function() {
              return 15;
            },
            itemStyle: {
              //样试。
              normal: {
                //默认样试
                color: "#02FF96",
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
        ]
      };
      mapChart.setOption(option);
      window.onresize = () => {
        mapChart.resize();
      };
      mapChart.on("click", compData => {
        let data = compData.data;
        if (data) {
          this.gotoProject(data);
        }
      });
    },
    gotoProjectList() {
      this.$router.push({
        name: "projectList"
      });
    },
    //项目列表条目点击事件
    gotoProject(data) {
      this.$store.dispatch("setProjectInfo", data).then(() => {
        this.$router.replace({
          name: "load"
        });
      });
    }
  },
  beforeDestroy() {
    this.warpDrive.pause();
    this.warpDrive = null;
    this.contentEl.classList.add("content");
  }
};
</script>
<style scoped>
#mapChart {
  width: 100%;
  height: 100%;
  position: absolute;
}
#background {
  width: 100vw;
  height: 100vh;
}
.content {
  padding: 0 !important;
}

.project-map-container {
  position: relative;
  width: 100%;
  height: 100%;
}
.project-list-icon {
  position: absolute;
  right: 10px;
  top: 10px;
  cursor: pointer;
  font-size: 32px;
  z-index: 10;
}
</style>
