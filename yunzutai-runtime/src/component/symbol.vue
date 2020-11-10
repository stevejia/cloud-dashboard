<template>
  <div
    class="symbolDiv"
    @mousedown="selectSymbol"
    @mouseenter="showContainer"
    @mouseleave="hideContainer"
    :style="styles"
  >
    <div class="content">
      <component
        ref="comp"
        :is="currentComp"
        :theme="$store.getters.theme"
      ></component>
    </div>
  </div>
</template>

<script>
import { getComp } from "@/util/common.js";
export default {
  data() {
    return {
      id: null,
      isCompose: false,
      currentComp: null,
      type: null,
      classes: null,
      transform: 0,
      width: 300,
      height: 200,
      left: 20,
      top: 100,
      locked: false,
      zIndex: 10,
      compConfig: null
    };
  },
  mounted() {
    this.currentComp = getComp(this.type);
    if (this.type === "container") {
      this.$el.style.display = "none";
    }
    this.$nextTick(() => {
      let comp = this.$refs.comp;
      Object.assign(comp.$data, this.compConfig);
      Object.assign(comp, this.compConfig);
      let config = this.$refs.comp.baisicConfig;
      if (config["尺寸"]) {
        config["尺寸"].value = [this.width, this.height];
      }
      if (config["位置"]) {
        config["位置"].value = [this.left, this.top];
      }
      if (config["旋转角度"]) {
        config["旋转角度"].value = this.transform;
      }

      comp.init && comp.init();
      comp.themeChange ? comp.themeChange() : comp.initStyle(true);
      this.$drag.collect(comp, this);
    });
  },
  methods: {
    getConfig() {
      let compData = this.$refs.comp.$data;
      let _comps = compData.comps;
      let _compconfigs = compData.compconfigs;
      _compconfigs = _comps.map((myCompConfig, index) => {
        myCompConfig = myCompConfig.map(compVm => {
          if (compVm.type === "compose") {
            return {
              ...compVm.getConfig(index),
              _linkComp: null
            };
          } else {
            return {
              ...compVm.$data,
              currentComp: null,
              compConfig: compVm.$refs.comp
                ? compVm.$refs.comp.$data
                : compVm.$data
            };
          }
        });
        return myCompConfig;
      });
      this.$refs.comp.$data.compconfigs = _compconfigs;
      return {
        ...this.$data,
        currentComp: null,
        compConfig: {
          ...this.$refs.comp.$data,
          comps: [[], [], []]
        }
      };
    },
    resizeHeight() {
      let config = this.$refs.comp.baisicConfig;
      if (
        config["尺寸"] &&
        (config["尺寸"].value[0] !== this.width ||
          config["尺寸"].value[1] !== this.height)
      ) {
        config["尺寸"].value = [this.width, this.height];
        this.heightChange = true;
        this.$refs.comp.resetComp && this.$refs.comp.resetComp();
      }
      if (config["位置"]) {
        config["位置"].value = [this.left, this.top];
      }
      if (config["旋转角度"]) {
        config["旋转角度"].value = this.transform;
      }
    },
    resetStyle() {
      let config = this.$refs.comp.baisicConfig;
      if (
        config["尺寸"] &&
        (config["尺寸"].value[0] !== this.width ||
          config["尺寸"].value[1] !== this.height)
      ) {
        config["尺寸"].value = [this.width, this.height];
      }
      if (config["位置"]) {
        config["位置"].value = [this.left, this.top];
      }
      if (config["旋转角度"]) {
        config["旋转角度"].value = this.transform;
      }
      if (this.heightChange) {
        this.heightChange = false;
        this.$refs.comp.resetComp && this.$refs.comp.resetComp(true);
      }
    },
    initStyle([width, height], [left, top], transform) {
      this.width = width;
      this.height = height;
      this.left = left;
      this.top = top;
      this.transform = transform;
    },
    contextmenu(event) {
      this.selectSymbol(event);
      this.$drag.showContextmenu(this);
    },
    confirms(remind) {
      return new Promise(resolve => {
        if (remind) {
          this.$confirm("确定执行吗?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            closeOnClickModal: false
          })
            .then(() => {
              resolve();
            })
            .catch(() => {});
        } else {
          resolve();
        }
      });
    },
    //切换页面
    changePage(remind, pageId) {
      this.confirms(remind).then(() => {
        let leftVm = this.$drag.$left;
        let routeVm = leftVm.$refs.routes;
        let pageVm = leftVm.$refs.pages;
        let childrenItem = null;
        let route = null;
        routeVm.routes.find(item => {
          if (item.linkPage === pageId) {
            route = item;
            return true;
          }
          if (item.children) {
            childrenItem = item.children.find(_item => {
              return _item.linkPage === pageId;
            });
            if (childrenItem) {
              route = item;
              return true;
            }
          }
        });
        if (childrenItem) {
          routeVm.selectRoute(childrenItem, route);
        } else if (route) {
          routeVm.selectRoute(route);
        } else {
          let page = pageVm.pages.find(item => {
            return item.id === pageId;
          });
          leftVm.selectPage({
            linkPage: page.id,
            type: page.type,
            origin: "local",
            pages: page.pages
          });
        }
      });
    },
    //执行脚本
    runtimeJsContent(remind, str) {
      this.confirms(remind).then(() => {
        new Function(str).apply(this.$chint);
      });
    },

    //显示容器
    bindContainer(remind, eventConfig, containerType) {
      this.$drag
        .bindContainer(remind, eventConfig, containerType, this.confirms)
        .then(() => {});
    },
    //开关切换
    openOff(remind, eventConfig, vm) {
      this.confirms(remind).then(() => {
        this.$drag.openOff(eventConfig, vm).then(res => {
          let type = "success";
          if (res !== "操作成功") {
            type = "warning";
          }
          this.$message({
            type: type,
            message: res
          });
        });
      });
    },
    //赋值
    assignValue(remind, eventConfig, vm) {
      this.confirms(remind).then(() => {
        this.$drag.assignValue(eventConfig, vm).then(res => {
          let type = "success";
          if (res !== "操作成功") {
            type = "warning";
          }
          this.$message({
            type: type,
            message: res
          });
        });
      });
    },
    showContainer() {
      let comp = this.$refs.comp;
      let events = comp && comp.highConfig && comp.highConfig["事件"];
      if (!events) return;
      events.value.forEach(type => {
        if (type.order !== undefined) {
          switch (type.order) {
            case 4:
              this.bindContainer(events.remind, type, "promptDialog");
              break;
            default:
              break;
          }
        }
      });
    },
    hideContainer() {
      let comp = this.$refs.comp;
      let events = comp && comp.highConfig && comp.highConfig["事件"];
      if (!events) return;
      events.value.forEach(type => {
        if (type.order !== undefined) {
          switch (type.order) {
            case 4:
              this.bindContainer(events.remind, type, "promptDialog");
              break;
            default:
              break;
          }
        }
      });
    },
    selectSymbol() {
      let comp = this.$refs.comp;
      let events;
      if (comp && comp.highConfig) {
        events = comp.highConfig["事件"];
      }

      if (!events) return;
      //     { label: "切换页面", value: 0 },
      // { label: "开关切换", value: 1 },
      // { label: "执行脚本", value: 2 },
      // { label: "赋值", value: 3 },
      // { label: "绑定容器", value: 4 }
      events.value.forEach(type => {
        if (type.order !== undefined) {
          let vm = null;
          if (this.type === "开关按钮") {
            vm = this.$refs.comp;
          }
          switch (type.order) {
            case 0:
              this.changePage(events.remind, type.pageId);
              break;
            case 1:
              //开关切换
              this.openOff(events.remind, type, vm);
              break;
            case 2:
              if (this.type === "开关按钮") {
                this.runtimeJsContent(
                  events.remind,
                  vm.isOn ? type.open.jscotent : type.off.jscotent
                );
              } else {
                this.runtimeJsContent(events.remind, type.jsContent);
              }

              break;
            case 3:
              this.assignValue(events.remind, type, vm);
              break;
            case 4:
              this.bindContainer(events.remind, type, "dialog");
              break;
            default:
              break;
          }
        }
      });
    }
  },
  beforeDestroy() {
    if (this.$parentEl) {
      this.$parentEl.removeChild(this.$el);
    }
    if (this.type === "container") {
      //如果是容器，则需要继续删除容器属性
      this.$drag.deleteContainerVms(this);
    }
  },
  computed: {
    styles() {
      return {
        width: this.width + "px",
        height: this.height + "px",
        left: this.left + "px",
        top: this.top + "px",
        transform: `rotate(${this.transform}deg)`,
        zIndex: this.zIndex
      };
    }
  }
};
</script>

<style lang="less" scoped>
.themeWhite {
  .symbolDiv {
    color: black;
    &.multiple {
      background: rgba(222, 232, 255, 0.8);
      border: 1px dashed #4c84ff;
      box-sizing: border-box;
      &.oper {
        border-color: #ff4c4c;
      }
    }
  }
  .taglen-top {
    border-top: 1px dashed #000;
    .left,
    .right {
      border: solid 1px #000;
      background-color: #fff;
    }
    &::before {
      border: 1px solid #000;
      background: #fff;
    }
  }
  .taglen-left {
    border-left: 1px dashed #000;
    &::after {
      border: 1px solid #000;
      background: #fff;
    }
  }
  .taglen-right {
    border-right: 1px dashed #000;
    &::after {
      border: 1px solid #000;
      background: #fff;
    }
  }
  .taglen-bottom {
    border-bottom: 1px dashed #000;
    .left,
    .right {
      border: solid 1px #000;
      background-color: #fff;
    }
    &::after {
      border: 1px solid #000;
      background: #fff;
    }
  }
}
.themeBlack {
  .symbolDiv {
    color: white;
    &.multiple {
      background: rgba(222, 232, 255, 0.8);
      border: 1px dashed #4c84ff;
      box-sizing: border-box;
      &.oper {
        border-color: #ff4c4c;
      }
    }
  }
  .taglen-top {
    border-top: 1px dashed #fff;
    .left,
    .right {
      border: solid 1px #fff;
      background-color: #000;
    }
    &::before {
      border: 1px solid #fff;
      background: #000;
    }
  }
  .taglen-left {
    border-left: 1px dashed #fff;
    &::after {
      border: 1px solid #fff;
      background: #000;
    }
  }
  .taglen-right {
    border-right: 1px dashed #fff;
    &::after {
      border: 1px solid #fff;
      background: #000;
    }
  }
  .taglen-bottom {
    border-bottom: 1px dashed #fff;
    .left,
    .right {
      border: solid 1px #fff;
      background-color: #000;
    }
    &::after {
      border: 1px solid #fff;
      background: #000;
    }
  }
}

.symbolDiv {
  position: absolute;

  // transition: top 0.2s, left 0.2s;
  &.single {
    > .tagLens {
      display: block;
    }
  }

  .content {
    height: 100%;
    width: 100%;
    z-index: 2;
    & /deep/ .symbolComp {
      overflow: hidden;
    }
  }
  .markView.symbolMark {
    display: none;
  }
  &.multiple {
    .markView.symbolMark {
      display: block;
    }
  }
  .tagLens {
    display: none;
    .taglen-top {
      box-sizing: border-box;
      position: absolute;
      height: 10px;
      top: -10px;
      left: -9px;
      right: -9px;

      cursor: n-resize;
      .left {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        position: absolute;
        left: -7px;
        top: -7px;
        cursor: nw-resize;
        z-index: 1;
      }
      .right {
        width: 12px;
        height: 12px;

        border-radius: 50%;

        position: absolute;
        right: -7px;
        top: -7px;
        cursor: ne-resize;
        z-index: 1;
      }
      &::before {
        content: "";
        width: 10px;
        height: 10px;

        position: absolute;
        left: 50%;
        top: -6px;
        margin-left: -6px;
      }
    }
    .taglen-left {
      box-sizing: border-box;
      position: absolute;
      width: 10px;
      top: -9px;
      left: -10px;
      bottom: -9px;

      cursor: w-resize;
      &::after {
        content: "";
        width: 10px;
        height: 10px;

        position: absolute;
        top: 50%;
        left: -6px;
        margin-top: -6px;
      }
    }
    .taglen-right {
      position: absolute;
      top: -9px;
      right: -10px;
      bottom: -9px;
      width: 10px;

      cursor: e-resize;
      &::after {
        content: "";
        width: 10px;
        height: 10px;

        position: absolute;
        top: 50%;
        right: -6px;
        margin-top: -6px;
      }
    }
    .taglen-bottom {
      position: absolute;
      bottom: -10px;
      left: -9px;
      right: -9px;
      height: 10px;

      cursor: s-resize;
      .left {
        width: 12px;
        height: 12px;

        border-radius: 50%;

        position: absolute;
        left: -7px;
        bottom: -7px;
        cursor: sw-resize;
        z-index: 1;
      }
      .right {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        position: absolute;
        right: -7px;
        bottom: -7px;
        cursor: nw-resize;
        z-index: 1;
      }
      &::after {
        content: "";
        width: 10px;
        height: 10px;

        position: absolute;
        left: 50%;
        bottom: -6px;
        margin-left: -6px;
      }
    }
  }
}
</style>
