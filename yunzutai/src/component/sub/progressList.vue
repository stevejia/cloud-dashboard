<template>
  <div class="symbolComp" :style="styles">
    <div class="header" :style="headStyle">
      <span @click="sortList(true)">
        <!-- <i class="icon el-icon-s-fold"></i> -->
        {{ baisicConfig["标题名称"].value }}
      </span>
    </div>
    <div
      class="pro-wrapper"
      v-for="(item, index) in pList"
      :key="index"
      @click="tapStation"
    >
      <span class="valueText row-reverse" :style="fontStyle">{{
        item.plantName
      }}</span>
      <el-progress
        class="el-progress"
        :percentage="item.performance"
        :show-text="false"
        ref="elProgress"
      ></el-progress>
      <span class="percentText" :style="percentFontStyle"
        >{{ item.performance }}%</span
      >
    </div>
  </div>
</template>
<script>
import mixin from "@/component/mixin.js";
import { getPerformanceList } from "@/api/sub.js";
export default {
  mixins: [mixin],
  props: {
    theme: String
  },
  methods: {
    init() {
      let routes = this.$chint.getRouteList();
      let routeArr = [];
      routes.map(item => {
        let obj = {
          label: item.name,
          value: item.name
        };
        routeArr.push(obj);
        item.children.map(i => {
          let obj2 = {
            label: i.name,
            value: item.name + "/" + i.name
          };
          routeArr.push(obj2);
        });
      });
      this.highConfig["菜单跳转"].label = routeArr;
      if (!this.$store.state.runtime) return;
      let param = {
        sort: this.sortType
      };
      getPerformanceList(param).then(res => {
        if (res.code != 200) {
          this.$message({
            message: res.msg,
            type: "error",
            duration: 3000,
            showClose: true
          });
          return;
        }
        this.pList = res.data;
        if (this.pList.length > this.highConfig["最大条数"].value) {
          this.pList.splice(
            this.highConfig["最大条数"].value,
            this.pList.length - this.highConfig["最大条数"].value
          );
        }
        this.initStyle();
      });
    },
    initStyle(bool) {
      this.startInitStyle();
      this.$nextTick(() => {
        for (let i = 0; i < this.$refs.elProgress.length; i++) {
          let item = this.$refs.elProgress[i];
          let proOuter = item.$el.getElementsByClassName(
            "el-progress-bar__outer"
          )[0];
          let proInner = item.$el.getElementsByClassName(
            "el-progress-bar__inner"
          )[0];
          proOuter.style.backgroundColor = this.baisicConfig[
            "进度条背景颜色"
          ].value;
          proOuter.style.border = `${this.baisicConfig["边框粗细"].value}px solid ${this.baisicConfig["边框颜色"].value}`;
          proOuter.style.height = this.baisicConfig["数据条高度"].value + "px";
          proInner.style.backgroundColor = this.baisicConfig["填充颜色"].value;
        }
      });

      this.styles = {
        opacity: this.baisicConfig["显示度"].value / 100,
        backgroundColor: this.baisicConfig["背景颜色"].value
      };

      let font = this.baisicConfig["名称字体样式"].value;
      this.fontStyle = {
        fontSize: font[0],
        fontFamily: font[1],
        fontWeight: font[2],
        color: font[3]
      };
      let font2 = this.baisicConfig["进度字体样式"].value;
      this.percentFontStyle = {
        fontSize: font2[0],
        fontFamily: font2[1],
        fontWeight: font2[2],
        color: font2[3]
      };
      let font3 = this.baisicConfig["标题字体样式"].value;
      this.headStyle = {
        fontSize: font3[0],
        fontFamily: font3[1],
        fontWeight: font3[2],
        color: font3[3],
        height: this.baisicConfig["标题高度"].value + "px",
        backgroundColor: this.baisicConfig["标题背景颜色"].value
      };
      this.endInitStyle(bool);
    },

    // 列表排序，改变sortType
    sortList() {
      this.sortType = this.sortType == "asc" ? "desc" : "asc";
      this.init();
    },

    // 进入相应电站
    tapStation() {
      this.$chint.routerPush(this.highConfig["菜单跳转"].value);
    }
  },
  data() {
    return {
      styles: {},
      fontStyle: {},
      percentFontStyle: {},
      headStyle: {},
      sortType: "asc", // asc正序，desc倒序
      pList: [
        {
          plantId: "",
          plantName: "默认名称1",
          performance: 30
        },
        {
          plantId: "",
          plantName: "默认名称2",
          performance: 40
        }
      ],
      black: {
        标题背景颜色: "rgba(47, 63, 165, 0.3)",
        背景颜色: "rgba(36, 36, 45, 0.5)",
        标题字体样式3: "#fff",
        名称字体样式3: "#fff",
        进度字体样式3: "#fff",
        进度条背景颜色: "rgb(130, 136, 166)",
        填充颜色: "rgb(86, 206, 118)",
        边框颜色: "#000"
      },
      white: {
        标题背景颜色: "rgba(47, 63, 165, 0.3)",
        背景颜色: "rgba(0, 0, 0, 0)",
        标题字体样式3: "#fff",
        名称字体样式3: "#24252A",
        进度字体样式3: "#24252A",
        进度条背景颜色: "#DADCDF",
        填充颜色: "#E53F3F",
        边框颜色: "#000"
      },
      highConfig: {
        添加响应: {
          type: "explain"
        },
        最大条数: {
          type: "input",
          inputType: "number",
          value: 3
        },
        菜单跳转: {
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
        线条1: {
          type: "line"
        },
        标题名称: {
          type: "input",
          value: "标题"
        },
        标题高度: {
          type: "input",
          inputType: "number",
          value: 40
        },
        标题背景颜色: {
          type: "color-select",
          value: "rgba(0, 0, 0, 0)"
        },
        标题字体样式: {
          type: "fontStyle",
          value: ["14px", "", "normal", "#E53F3F"]
        },
        线条2: {
          type: "line"
        },
        背景颜色: {
          type: "color-select",
          value: "rgba(0, 0, 0, 0)"
        },
        边框颜色: {
          type: "color-select",
          value: "#000"
        },
        进度条背景颜色: {
          type: "color-select",
          value: "#24252A"
        },
        填充颜色: {
          type: "color-select",
          value: "#E53F3F"
        },
        边框粗细: {
          type: "slider",
          status: 1,
          range: [0, 10],
          value: 0
        },
        数据条高度: {
          type: "slider",
          status: 1,
          range: [1, 30],
          value: 12
        },
        名称字体样式: {
          type: "fontStyle",
          value: ["14px", "", "normal", "#E53F3F"]
        },
        进度字体样式: {
          type: "fontStyle",
          value: ["14px", "", "normal", "#E53F3F"]
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
  box-sizing: border-box;
  overflow: hidden;
  .header {
    display: flex;
    align-items: center;
    padding-left: 20px;
    > span {
      cursor: pointer;
    }
    .icon {
      margin-right: 4px;
    }
  }
  .pro-wrapper {
    position: relative;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    padding: 0 20px;
    margin-top: 20px;
    box-sizing: border-box;
    cursor: pointer;
    // &:nth-child(2) {
    //   margin-top: 15px;
    // }
    .valueText {
      width: 30%;
      min-width: 100px;
      box-sizing: border-box;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .percentText {
      position: absolute;
      right: 40px;
    }
  }
  .el-progress {
    flex: 1;
    padding: 0 10px;
    font-size: 100%;
  }
  .valueText {
    text-align: center;
    &.none {
      display: none;
    }
    &.row-reverse {
      padding-right: 20px;
    }
    &.row {
      order: 9;
      padding-left: 20px;
    }
    &.column-reverse {
      width: 100%;
    }
    &.column {
      order: 9;
      width: 100%;
    }
  }
  /deep/ .el-progress-bar__outer {
    box-sizing: border-box;
  }
}
</style>
