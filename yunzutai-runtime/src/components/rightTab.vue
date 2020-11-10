<template>
  <div
    :class="locked ? 'locked rightTab' : 'rightTab'"
    :style="{ width: `${showPropertyMenu ? 300 : 0}px` }"
  >
    <span
      @mousedown.stop="toggleMenu"
      :class="[
        'iconfont',
        `${showPropertyMenu ? 'iconzhankai' : 'iconshouqi'}`,
        'toggleicon'
      ]"
    ></span>
    <div class="body">
      <div class="component" v-show="showPropertyMenu">
        <compCommon ref="type66" v-show="currentClass === 66"></compCommon>
        <compBase ref="type0" v-show="currentClass === 0"></compBase>
        <compMap ref="type1" v-show="currentClass === 1"></compMap>
        <compSub ref="type2" v-show="currentClass === 2"></compSub>
        <compHigh ref="type3" v-show="currentClass === 3"></compHigh>
        <compSpec ref="type4" v-show="currentClass === 4"></compSpec>
        <compSystem ref="type6" v-show="currentClass === 5"></compSystem>
        <compCustomSymbol
          ref="type7"
          v-show="currentClass === 6"
        ></compCustomSymbol>
      </div>
    </div>
    <div class="menu" @mousedown="clearVms">
      <div
        @mousedown.stop="
          currentClass = index;
          showPropertyMenu = true;
          $drag.clearVms();
          $drag.hideContextmenu();
        "
        :class="currentClass === index ? 'active menuItem' : 'menuItem'"
        v-for="(item, index) in list"
        :key="item.name + index"
      >
        <div>
          <span :class="'iconfont ' + item.icon"></span>
        </div>
        <div class="title">{{ item.name }}</div>
      </div>
      <div style="margin-top:220px;"></div>
      <div
        @mousedown.stop="deal(item)"
        class="menuItem"
        v-for="(item, index) in otherList"
        :key="item.name + index"
      >
        <div>
          <span :class="'iconfont ' + item.icon"></span>
        </div>
        <div class="title">{{ item.name }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { setConfig, setPointsData, getPointsData } from "@/api/server.js";
import compCommon from "./differentClass/common";
import compBase from "./differentClass/base";
import compHigh from "./differentClass/high";
import compMap from "./differentClass/map";
import compSpec from "./differentClass/spec";
import compSub from "./differentClass/sub";
import compSystem from "./differentClass/system";
import compCustomSymbol from "./differentClass/customSymbol";
export default {
  components: {
    compBase,
    compHigh,
    compSub,
    compSpec,
    compMap,
    compCommon,
    compSystem,
    compCustomSymbol
  },
  data() {
    return {
      treeConfig: new Map(),
      locked: false,
      currentClass: 66,
      currentVm: null,
      list: [
        {
          name: "基本",
          icon: "iconjiben"
        },
        {
          name: "图库",
          icon: "icontuku"
        },
        {
          name: "组件",
          icon: "iconzujian"
        },
        {
          name: "高级",
          icon: "icongaoji"
        },
        {
          name: "专业",
          icon: "iconzhuanye"
        },
        {
          name: "系统",
          icon: "iconxitong"
        },
        {
          name: "自定义",
          icon: "iconxitong"
        }
      ],
      otherList: [
        {
          name: "同步",
          icon: "icontongbu"
        },
        {
          name: "保存",
          icon: "iconbaocun"
        },
        {
          name: "运行",
          icon: "iconyunxing"
        }
      ],
      showPropertyMenu: true
    };
  },
  methods: {
    clearVms() {
      this.$drag.clearVms();
      this.$drag.hideContextmenu();
      this.$drag.showMenu({ classes: 66 });
    },
    showMenu(vm) {
      this.currentClass = vm.classes;
      // this.showPropertyMenu = true;
      let target = this.$refs["type" + this.currentClass];
      if (this.currentVm && this.currentVm.type === "树形关联图") {
        let comp = this.currentVm.$refs.comp;
        if (comp) {
          comp.currentItem = null;
          comp.highConfig["树形图"] = {
            type: "treeConfig",
            currentItem: "",
            pointIds: [],
            statisticsType: ""
          };
        }
      }
      if (target.$refs.compConfig) {
        target.initType(vm.type, vm);
        if (this.currentVm !== vm) {
          target.$refs.compConfig.baisicConfig = null;
          target.$refs.compConfig.highConfig = null;
          target.$refs.compConfig.currentType = "basic";
          if (vm.$refs && vm.$refs.comp) {
            this.currentVm = vm;
            this.$nextTick(() => {
              target.$refs.compConfig.bool = false;
              target.$refs.compConfig.baisicConfig = vm.$refs.comp.baisicConfig;
              target.$refs.compConfig.highConfig = vm.$refs.comp.highConfig;
              target.$refs.compConfig.currentComp = vm.$refs.comp;
              this.$nextTick(() => {
                target.$refs.compConfig.bool = true;
              });
            });
          } else {
            target.$refs.compConfig.initConfig();
          }
        }
      }
    },
    showMenuWhatever(vm, currType) {
      this.currentClass = vm.classes;
      // this.showPropertyMenu = true;
      let target = this.$refs["type" + this.currentClass];
      if (this.currentVm && this.currentVm.type === "树形关联图") {
        let comp = this.currentVm.$refs.comp;
        if (comp) {
          comp.currentItem = null;
          comp.highConfig["树形图"] = {
            type: "treeConfig",
            currentItem: "",
            pointIds: [],
            statisticsType: ""
          };
        }
      }
      if (target.$refs.compConfig) {
        target.initType(vm.type, vm);
        target.$refs.compConfig.baisicConfig = null;
        target.$refs.compConfig.highConfig = null;
        target.$refs.compConfig.currentType = currType || "basic";
        if (vm.$refs && vm.$refs.comp) {
          this.currentVm = vm;
          this.$nextTick(() => {
            target.$refs.compConfig.bool = false;
            target.$refs.compConfig.baisicConfig = vm.$refs.comp.baisicConfig;
            target.$refs.compConfig.highConfig = vm.$refs.comp.highConfig;
            target.$refs.compConfig.currentComp = vm.$refs.comp;
            this.$nextTick(() => {
              target.$refs.compConfig.bool = true;
            });
          });
        } else {
          target.$refs.compConfig.initConfig();
        }
      }
    },
    //获取树的配置
    getTreeConfigList() {
      let configs = [];
      for (let [key, value] of this.treeConfig) {
        let config = value;
        if (!config) {
          config = this.$drag.treeConfigs.find(item => {
            return item.id === key;
          });
        }
        configs.push(config);
      }
      return JSON.stringify(configs);
    },
    getCompConfig(comp) {
      if (comp.type === "compose") {
        return {
          ...comp.getConfig(),
          _linkComp: null
        };
      } else if (comp.type === "container") {
        return comp.getConfig();
      } else if (comp.type === "树形关联图") {
        let treeConfig = {
          ...comp.$data,
          currentComp: null,
          compConfig: {
            ...comp.$refs.comp.$data,
            currentItem: null,
            highConfig: {
              树形图: {
                type: "treeConfig",
                currentItem: "",
                pointIds: [],
                statisticsType: ""
              }
            }
          }
        };
        if (!this.treeConfig.get(treeConfig.id)) {
          this.treeConfig.set(treeConfig.id, treeConfig);
        }
        return {
          id: treeConfig.id,
          type: treeConfig.type
        };
      } else {
        return comp.returnConfig();
      }
    },
    deal(item) {
      this.$drag.clearVms();
      this.$drag.hideContextmenu();
      let left, centerConfigs, newConfigs, config;
      switch (item.name) {
        case "同步":
          this.operPointData();
          break;
        case "运行":
          window.open(
            `${window.config.agreement}${this.$store.state.domain}/#/login`
          );
          // window.open(`http://10.125.23.158:18088/#/project/list`);
          break;
        case "保存":
          left = this.$drag.$left;
          centerConfigs = this.$drag.centerConfigs;
          newConfigs = {};

          var _myPageConfigs = {};
          left.$refs.pages.pages.forEach(item => {
            if (item.type === "single") {
              _myPageConfigs[item.id] = true;
            } else if (item.type === "multi") {
              _myPageConfigs[item.id] = true;
              item.pages.forEach(p => {
                _myPageConfigs[p.id] = true;
              });
            }
          });

          for (let key in centerConfigs) {
            if (!_myPageConfigs[key]) continue;
            let val = centerConfigs[key];
            let comps = val.comps;
            let _compConfigs = val.compConfigs;
            // console.log(_compConfigs);
            //过滤掉 状态是deleted的组件配置
            _compConfigs = _compConfigs.filter(cc => {
              return !cc.deleted;
            });
            //过滤掉 状态是deleted的组件
            comps = comps.filter(comp => {
              return !comp.deleted;
            });
            let zIndex = 4;
            if (val.loaded) {
              comps.sort((a, b) => {
                return a.zIndex - b.zIndex;
              });
              comps = comps.map(item => {
                item.zIndex = zIndex++;
                return item;
              });
              _compConfigs = comps.map(item => {
                return this.getCompConfig(item);
              });
            } else {
              _compConfigs.sort((a, b) => {
                return a.zIndex - b.zIndex;
              });

              _compConfigs = _compConfigs.map(item => {
                item.zIndex = zIndex++;
                if (item.type === "树形关联图") {
                  if (!this.treeConfig.get(item.id)) {
                    this.treeConfig.set(item.id, null);
                  }
                }
                return item;
              });
            }
            newConfigs[key] = JSON.stringify({
              zIndex: val.zIndex,
              compConfigs: _compConfigs,
              comps: []
            });
          }
          var topRef = this.$drag.layout.$refs.headers;
          var leftRef = this.$drag.layout.$refs.lefters;
          var headerRef = this.$drag.layout.$refs.headers;
          var centerRef = this.$drag.$vm;
          config = {
            pid: this.$store.state.subProjectId,
            version: 1,
            stylesConfig: {
              theme: this.$drag.layout.themeConfig,
              topConfig: {
                white: topRef.white,
                black: topRef.black,
                config: topRef.config
              },
              leftConfig: {
                config: JSON.parse(JSON.stringify(leftRef.config)),
                white: leftRef.white,
                black: leftRef.black
              },
              centerConfig: {
                config: centerRef.config,
                white: centerRef.white,
                black: centerRef.black
              },
              userConfig: this.$drag.layout.userConfig
            },
            routeConfig: {
              width: this.$store.state.config.routeConfig.width,
              height: this.$store.state.config.routeConfig.height,
              pageState: this.$store.state.config.routeConfig.pageState,
              currentSelectRoute: left.$refs.routes.currentSelectRoute,
              currentSelectChildrenRoute:
                left.$refs.routes.currentSelectChildrenRoute,
              routes: left.$refs.routes.routes,
              pages: left.$refs.pages.pages,
              warnPage: {
                type: headerRef.warnPage.type,
                pageId: headerRef.warnPage.pageId
              }
            },
            centerConfigs: newConfigs,
            treeConfigList: this.getTreeConfigList(),
            authorityList: this.$store.state.authorityList
          };
          setConfig(config).then(res => {
            if (res.statusCode === 200) {
              this.$message({
                type: "success",
                message: "保存成功"
              });
            }
          });
          var systemIns = this.$refs["type6"];
          if (systemIns) {
            var pointGroup = systemIns.pointGroup;
            var subProjectId = this.$store.state.subProjectId;
            var params = {
              pid: subProjectId,
              pointGroup: [...pointGroup]
            };
            setPointsData(params).then(() => {
              this.operPointData();
            });
          }
          break;

        default:
          break;
      }
    },
    operPointData() {
      getPointsData({ pid: this.$store.state.subProjectId }).then(res => {
        let data = res.body || {
          apsList: [],
          sceneList: [],
          ptgPoints: [],
          timerList: [],
          pointGroup: []
        };
        this.$store.dispatch("setPointGroup", data);
      });
    },
    toggleMenu() {
      this.showPropertyMenu = !this.showPropertyMenu;
    }
  }
};
</script>

<style lang="less" scoped>
.rightTab {
  display: flex;
  flex-direction: row;
  transition: right 0.3s;
  position: relative;
  .toggleicon {
    position: absolute;
    left: -29px;
    bottom: 30px;
    background: #373e4a;
    padding: 5px;
    color: rgb(183, 192, 205);
  }
  &.locked {
    right: -300px !important;
  }

  .icons {
    height: 30px;
    width: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #777e8a;
    margin-top: 700px;
    .iconfont {
      font-size: 20px;
    }
    background: #373e4a;
  }
  .body {
    width: 240px;
    height: calc(100%);
    color: #e9e9e9;
    box-shadow: 0px 3px 8px 0px rgba(0, 0, 0, 0.7);
    background-color: #373e4a;
    position: relative;

    .component {
      height: calc(100%);
      // margin: 0 10px 0 0 ;
    }
    .shows {
      position: absolute;
      top: 0px;
      right: -240px;
      transition: right 0.2s ease;
      &.active {
        right: 0px;
      }
    }
  }
  .menu {
    height: calc(100%);
    overflow: auto;
    z-index: 1;
    width: 60px;
    background: #23272e;
    overflow: auto;
    .menuItem {
      cursor: pointer;
      box-sizing: border-box;
      height: 60px;
      height: 60px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      color: #777e8a;
      font-size: 12px;
      .title {
        margin-top: 6px;
      }
      &:hover {
        background: rgb(17, 19, 20);
      }
      &.active {
        background: rgb(0, 100, 255);
        color: rgb(255, 255, 255);
      }
    }
  }
}
</style>
