<template>
  <div
    class="symbolComp"
    :style="styles"
    @click="doPoints"
    @contextmenu.prevent.stop="$drag.showCompContextMenu('scenes', $parent)"
  >
    <img
      class="icon"
      @mousedown.prevent=""
      :src="baisicConfig['选择小图标'].value"
      :style="imgStyle"
    />
    <span class="text" :style="textStyle">{{
      baisicConfig["名称"].value
    }}</span>
  </div>
</template>
<script>
import { setPointsData } from "@/api/server.js";
import mixin from "@/component/mixin.js";
import { bulkSet } from "@/api/bulk.js";
import translateConfig from "./swichConfig/scenes.js";
const iconList = [
  {
    label: "上班",
    value: "/static/img/sub/scene/work.svg"
  },
  {
    label: "下班",
    value: "/static/img/sub/scene/offwork.svg"
  },
  {
    label: "值班",
    value: "/static/img/sub/scene/onduty.svg"
  },
  {
    label: "放假",
    value: "/static/img/sub/scene/holiday.svg"
  },
  {
    label: "节能",
    value: "/static/img/sub/scene/energysave.svg"
  },
  {
    label: "回家",
    value: "/static/img/sub/scene/gohome.svg"
  },
  {
    label: "离家",
    value: "/static/img/sub/scene/leavehome.svg"
  },
  {
    label: "迎宾",
    value: "/static/img/sub/scene/welcome.svg"
  },
  {
    label: "休闲",
    value: "/static/img/sub/scene/xiuxian.svg"
  },
  {
    label: "演讲",
    value: "/static/img/sub/scene/speech.svg"
  },
  {
    label: "明亮",
    value: "/static/img/sub/scene/mingliang.svg"
  },
  {
    label: "舒适",
    value: "/static/img/sub/scene/shushi.svg"
  },
  {
    label: "讨论",
    value: "/static/img/sub/scene/discuss.svg"
  },
  {
    label: "手动",
    value: "/static/img/sub/scene/hand.svg"
  },
  {
    label: "自动",
    value: "/static/img/sub/scene/automatic.svg"
  },
  {
    label: "全开",
    value: "/static/img/sub/scene/quankai.svg"
  },
  {
    label: "全关",
    value: "/static/img/sub/scene/quanguan.svg"
  }
];
export default {
  mixins: [mixin],
  destroyed() {
    if (this.$store.state.runtime) return;
    let compId = this.$parent.id;
    let bool = false;
    let sceneList = this.$store.state.pointGroup.sceneList.filter(item => {
      if (item.id !== "scenes_" + compId) {
        return true;
      } else {
        bool = true;
      }
    });
    if (bool) {
      setPointsData({
        ...this.$store.state.pointGroup,
        sceneList: sceneList
      });
    }
  },
  methods: {
    translateConfig(data) {
      return translateConfig(data);
    },
    rename(name) {
      if (!name) {
        name =
          iconList.find(item => {
            return item.value === this.baisicConfig["选择小图标"].value;
          }).label + "场景";
      }
      this.baisicConfig["名称"].value = name;
    },
    doPoints() {
      if (!this.$store.state.runtime) return;
      let id = this.highConfig["点位组关联"].value;
      if (id) {
        let sceneConfig = this.$store.state.pointGroup.sceneList.find(item => {
          return item.id === "scenes_" + this.$parent.id;
        });
        let ptgPoints = this.$store.state.pointGroup.ptgPoints;
        if (sceneConfig && sceneConfig.ptgPonitsList.length) {
          sceneConfig.ptgPonitsList.forEach(item => {
            let ptg = ptgPoints.find(_item => {
              return _item.id === item.id;
            });
            if (ptg && ptg.piTs) {
              let piTs = ptg.piTs.map(p => {
                return {
                  pointId: p.pit,
                  value: item.value
                };
              });
              bulkSet(piTs).then(() => {
                this.$message({
                  type: "success",
                  message: "操作成功"
                });
              });
            }
          });
        }
      } else {
        this.$message({
          type: "warning",
          message: "没有绑定点位组!"
        });
      }
    },
    init() {
      if (this.$store.state.runtime) {
        let compId = this.$parent.id;
        let config = this.$store.state.pointGroup.sceneList.find(item => {
          return item.id === "scenes_" + compId;
        });
        if (config && config.customSceneName) {
          this.baisicConfig["名称"].value = config.customSceneName;
        }
      }

      this.initLv();
    },
    initLv() {
      let n = this.baisicConfig["前景占比（0% - 100%）"].value;
      let height = this.baisicConfig["尺寸"].value[1];
      this.fsizeRatio = (
        this.baisicConfig["字体"].value[0] /
        (height * n * 0.01)
      ).toFixed(3);
      this.iconSize =
        parseInt(height * n * 0.01 * Math.pow(10, 3)) / Math.pow(10, 3) / 2;
    },
    resetComp() {
      let { theme, baisicConfig } = this.startInitStyle();
      let n = baisicConfig["前景占比（0% - 100%）"].value;
      let height = baisicConfig["尺寸"].value[1];
      let fontSize = Math.round(
        baisicConfig["尺寸"].value[1] * n * 0.01 * this.fsizeRatio
      );
      baisicConfig["字体"].value = [
        fontSize,
        baisicConfig["字体"].value[1],
        baisicConfig["字体"].value[2]
      ];
      this.iconSize =
        parseInt(height * n * 0.01 * Math.pow(10, 3)) / Math.pow(10, 3) / 2;
      this.setStyle(theme, baisicConfig);
    },
    setStyle(theme, baisicConfig) {
      // //这里进行一些当前组件属性的转换与使用
      this.styles = {
        backgroundColor: theme["背景颜色"],
        border: `${baisicConfig["边框粗细"].value}px solid ${baisicConfig["边框颜色"].value}`,
        opacity: baisicConfig["显示度"].value / 100
      };
      this.imgStyle = {
        color: theme["图标颜色"],
        width: this.iconSize + "px",
        height: this.iconSize + "px",
        marginBottom: baisicConfig["尺寸"].value[1] / 10 + "px",
        left: "-" + baisicConfig["尺寸"].value[0] + "px",
        filter: `drop-shadow(${baisicConfig["尺寸"].value[0]}px 0px)`
      };
      this.textStyle = {
        fontSize: baisicConfig["字体"].value[0] + "px",
        fontFamily: baisicConfig["字体"].value[1],
        color: theme["字体2"]
      };
    },
    initStyle(bool, type) {
      let { theme, baisicConfig } = this.startInitStyle();
      if (type === "字体") {
        this.initLv();
      } else if (type === "前景占比（0% - 100%）") {
        this.initLv();
        // let n = baisicConfig["前景占比（0% - 100%）"].value;
        // let height = baisicConfig["尺寸"].value[1];
        // let fontSize = Math.round(height * n * 0.01 * this.fsizeRatio);
        // baisicConfig["字体"].value = [
        //   fontSize,
        //   baisicConfig["字体"].value[1],
        //   baisicConfig["字体"].value[2]
        // ];
      } else if (type === "选择小图标") {
        baisicConfig["名称"].value =
          iconList.find(item => {
            return item.value === baisicConfig["选择小图标"].value;
          }).label + "场景";
      }

      this.setStyle(theme, baisicConfig);

      this.endInitStyle(bool);
    }
  },
  data() {
    return {
      iconSize: 0,
      fsizeRatio: 0,
      styles: {},
      imgStyle: {},
      textStyle: {},
      white: {
        //由于测试组件只有一个样式，将其提升为变量color
        字体2: "#455A64",
        图标颜色: "#3573C1",
        背景颜色: "#FFFFFF",
        边框颜色: "#DDDDDD"
      },
      black: {
        字体2: "#B2DDFF",
        图标颜色: "#B2DDFF",
        背景颜色: "#24252A",
        边框颜色: "rgba(0,0,0,0)"
      },
      highConfig: {
        点位组关联: {
          type: "select",
          label: [],
          value: ""
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
        线条: {
          type: "line"
        },
        名称: {
          type: "input",
          value: "上班场景"
        },
        线条1: {
          type: "line"
        },
        选择小图标: {
          type: "select",
          label: iconList,
          value: "/static/img/sub/scene/work.svg"
        },
        "前景占比（0% - 100%）": {
          type: "inputNumber",
          status: false,
          range: [1, 99],
          value: 68
        },
        线条2: {
          type: "line"
        },
        字体: {
          type: "fontThrees",
          value: [16, "", ""]
        },
        图标颜色: {
          type: "color-select",
          value: ""
        },
        背景颜色: {
          type: "color-select",
          value: ""
        },
        边框颜色: {
          type: "color-select",
          value: ""
        },
        边框粗细: {
          type: "slider",
          status: 1,
          range: [0, 10],
          value: 1
        },
        显示度: {
          type: "slider",
          status: 1,
          range: [0, 100],
          value: 100
        },
        样式还原: {
          type: "resetStyle"
        },
        线条3: {
          type: "line"
        },
        旋转角度: {
          type: "slider",
          status: 1,
          range: [0, 360],
          value: 0
        }
      }
    };
  }
};
</script>

<style lang="less" scoped>
.symbolComp {
  width: calc(100%);
  height: calc(100%);
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  flex-direction: column;
  white-space: pre;
  overflow: hidden;
  .icon {
    margin: 0 auto 12px;
    position: relative;
  }
  .text {
    text-align: center;
    white-space: nowrap;
  }
}
</style>
