<template>
  <div class="symbolComp" :style="style">
    <div
      @mouseup="hideContainer"
      class="icon"
      :style="{ display: baisicConfig['容器'].dialog ? 'block' : 'none' }"
    >
      <i class="el-dialog__close el-icon el-icon-close"></i>
    </div>
    <div class="tabs" :style="tabStyle">
      <div
        @mouseup="tabSelect(index)"
        :class="
          baisicConfig['容器'].currentTab === index ? 'tab active' : 'tab'
        "
        :style="{
          color:
            baisicConfig['容器'].currentTabIndex === index
              ? baisicConfig['容器'].tabFont[3]
              : baisicConfig['容器'].tabFont[2]
        }"
        v-for="(item, index) in baisicConfig['容器'].tabList"
        :key="item.value"
      >
        {{ item.label }}
        <div
          class="lines"
          :style="lineStyle"
          v-if="index !== baisicConfig['容器'].tabList.length - 1"
        ></div>
      </div>
    </div>
    <div class="container" :style="containerStyle">
      <div class="title" :style="titleStyle">
        {{ baisicConfig["容器"].title }}
      </div>
      <div
        class="body"
        :style="{
          height: baisicConfig['容器'].useTitle
            ? 'calc(100% - 40px)'
            : 'calc(100%)'
        }"
      ></div>
    </div>
  </div>
</template>

<script>
import { guid } from "@/util/common";
import translateConfig from "./container.js";
export default {
  props: {
    theme: String
  },
  watch: {
    "$store.getters.theme": function() {
      this.themeChange();
    }
  },
  //销毁之前先销毁其他元素
  beforeDestroy() {
    this.$drag.deleteContainerVms(this.$parent);
    this.comps.forEach(comp => {
      comp.forEach(item => {
        item.$destroy();
      });
    });
  },
  methods: {
    init() {
      this.baisicConfig["容器"].currentTabIndex = 0;
      this.baisicConfig["容器"].oldCurrentTabIndex = 0;
      this.$drag.collectContainer(this.$parent);
    },
    translateConfig(item) {
      return translateConfig(item);
    },
    resetStyle(data) {
      this[this.theme] = data[this.theme];
      this.baisicConfig = {
        ...this.baisicConfig,
        容器: {
          ...this.baisicConfig["容器"],
          borderRadius: 0,
          opacity: 100
        }
      };
      this.themeChange();
    },
    hideContainer() {
      this.baisicConfig["容器"].hide = true;
      this.$parent.$el.style.display = "none";
    },
    tabSelect(index) {
      this.$drag.loadContainerTab(index, this.$parent);
      let container = this.baisicConfig["容器"];
      container.currentTabIndex = index;
      this.changetab(container.oldCurrentTabIndex, container.currentTabIndex);
      container.oldCurrentTabIndex = container.currentTabIndex;
    },
    deleteTab(index) {
      let comp = this.comps[index];
      comp.forEach(item => {
        item.$destroy();
      });
      this.comps.splice(index, 1);
      this.compconfigs.splice(index, 1);
    },
    addTab() {
      this.compconfigs.push([]);
      this.comps.push([]);
    },
    themeChange() {
      let theme = this[this.theme];
      let container = this.baisicConfig["容器"];
      container.titleFont[2] = theme.titleColor;
      container.titleBottomLine = theme.titleBottomLine;
      container.boxShadom = theme.boxShadom;
      container.tabFont[3] = theme.selColor;
      container.tabFont[2] = theme.tabColor;

      container.background = container.promptDialog
        ? theme.prompBackground
        : container.dialog
        ? theme.dialogBackground
        : theme.background;
      container.tabBackground = container.promptDialog
        ? theme.tabPrompBackground
        : container.dialog
        ? theme.tabDialogBackground
        : theme.tabBackground;

      this.initStyle(true);
    },
    initDialog() {
      let theme = this[this.theme];
      let container = this.baisicConfig["容器"];
      container.background = container.promptDialog
        ? theme.prompBackground
        : container.dialog
        ? theme.dialogBackground
        : theme.background;
      container.tabBackground = container.promptDialog
        ? theme.tabPrompBackground
        : container.dialog
        ? theme.tabDialogBackground
        : theme.tabBackground;
    },
    changetab(oldIndex, valIndex) {
      this.comps[oldIndex].forEach(comp => {
        comp.$el.style.display = "none";
      });
      this.comps[valIndex].forEach(comp => {
        comp.$el.style.display = "";
      });
    },
    initStyle(bool, order) {
      if (order === "initDialog") {
        this.initDialog();
      }
      let theme = this[this.theme];
      let container = this.baisicConfig["容器"];
      theme.titleColor = container.titleFont[2];
      theme.titleBottomLine = container.titleBottomLine;
      theme.boxShadom = container.boxShadom;
      theme.tabColor = container.tabFont[2];
      theme.selColor = container.tabFont[3];

      if (container.oldCurrentTabIndex !== container.currentTabIndex) {
        this.changetab(container.oldCurrentTabIndex, container.currentTabIndex);
        container.oldCurrentTabIndex = container.currentTabIndex;
      }
      this.lineStyle = {
        background: container.tabFont[2]
      };
      this.style = {
        opacity: container.opacity / 100,
        background: container.background,
        borderRadius: container.borderRadius + "px",
        boxShadow:
          container.dialog && container.dialogShadow
            ? `rgba(0, 0, 0, 0.4) 3px 3px 3px 2px`
            : ""
      };
      this.titleStyle = {
        display: container.useTitle ? "block" : "none",
        textAlign: container.titleAlign,
        fontSize: container.titleFont[0],
        fontFamily: container.titleFont[1],
        color: container.titleFont[2],
        borderBottom: `1px solid ${container.titleBottomLine}`
      };
      this.containerStyle = {
        height: container.useMul
          ? `calc(100% - ${container.tabHeight}px)`
          : "calc(100%)",
        color: container.boxShadom
      };
      this.tabStyle = {
        display: container.useMul ? "flex" : "none",
        height: container.tabHeight + "px",
        color: "#FFFFFF",
        background: container.tabBackground,
        borderBottom: `1px solid ${theme.tabBorderBottom}`,
        fontSize: container.tabFont[0],
        fontFamily: container.tabFont[1]
      };
      if (container.hide) {
        this.hideContainer();
      }
      if (!bool) {
        this.$parent.initStyle(
          this.baisicConfig["尺寸"].value,
          this.baisicConfig["位置"].value
        );
      }
    }
  },
  data() {
    return {
      zIndex: 3,
      comps: [[], [], []],
      compconfigs: [[], [], []],
      style: {},
      containerStyle: {},
      titleStyle: {},
      tabStyle: {},
      lineStyle: {},
      white: {
        background: "#FFFFFF", //无状态背景颜色
        prompBackground: "#rgba(53,115,193,0.2)", //悬浮状态背景颜色
        dialogBackground: "#FFFFFF", //弹出状态背景颜色
        boxShadom: "rgba(8,114,184,0)", //发光色
        titleColor: "#455A64", //标题
        titleBottomLine: "#E7E7E7", //标题线色
        tabBackground: "#FFFFFF", //无状态标签背景
        tabPrompBackground: "#rgba(53,115,193,0.5)", //悬浮状态标签背景
        tabDialogBackground: "#FFFFFF", //弹出状态标签背景
        tabColor: "#6d849a", //标签颜色
        selColor: "#0064FF", //选中颜色

        tabBorderBottom: "#ddd",
        lineColor: "rgba(63, 66, 75, 1)"
      },
      black: {
        background: "#1c2163", //无状态背景颜色
        prompBackground: "rgba(53, 115, 193, 0.25)", //悬浮状态背景颜色
        dialogBackground: "rgb(28, 33, 99)", //弹出状态背景颜色
        boxShadom: "#0872B8", //发光色
        titleColor: "#FFFFFF", //标题
        titleBottomLine: "#303A91", //标题线色

        tabBackground: "#2F3138", //无状态标签背景
        tabPrompBackground: "rgba(53,115,193,0.5)", //悬浮状态标签背景
        tabDialogBackground: "#2F3138", //弹出状态标签背景
        tabColor: "#6d849a", //标签颜色
        selColor: "#0064FF", //选中颜色

        tabBorderBottom: "rgba(63, 66, 75, 1)",
        lineColor: "rgba(63, 66, 75, 1)"
      },
      baisicConfig: {
        名称: {
          type: "input",
          value: "容器"
        },
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
        容器: {
          hide: false,
          type: "container",
          blockContent: false, //锁定类容
          useMul: false, //启用多页
          promptDialog: false, //悬浮类型
          dialog: false, //弹窗类型
          dialogShadow: false, //弹窗阴影
          useTitle: false, //使用标题
          title: "标题",
          titleAlign: "left",
          titleFont: ["14px", "", ""],
          titleBottomLine: "",
          background: "",
          boxShadom: "",
          borderRadius: 0,
          opacity: 100,
          tabHeight: "36",
          tabBackground: "",
          tabFont: ["14px", "", "", ""],
          oldCurrentTabIndex: 0,
          currentTabIndex: 0,
          tabList: [
            {
              label: "默认名称1",
              value: guid()
            }
          ]
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
  white-space: pre;
  overflow: hidden;
  .icon {
    cursor: pointer;
    z-index: 1;
    box-sizing: border-box;
    position: absolute;
    right: 10px;
    top: 10px;
    background: white;
    color: #909399;
    height: 16px;
    border-radius: 16px;
  }
  .container {
    box-shadow: 0px 0px 10px 0px inset;
    .title {
      margin: 0px 20px 0 20px;
      line-height: 40px;
      height: 40px;
      box-sizing: border-box;
    }
    .body {
      position: relative;
    }
  }
  .tabs {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-direction: row;
    box-sizing: border-box;

    .tab {
      display: flex;
      align-items: center;
      justify-content: center;
      height: calc(100%);
      box-sizing: content-box;
      position: relative;
      padding: 0 5px;
      .lines {
        position: absolute;
        right: -6px;
        top: calc(50% - 6px);
        margin: 0 6px;
        width: 1px;
        height: 13px;
      }
    }
  }
}
</style>
