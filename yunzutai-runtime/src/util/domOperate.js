// import webPages from "@/config/webSource.json";
import systemPages from "@/config/systemSource.json";
import ContextMenu from "./contextMenu";
import { getUploadJs } from "@/api/server.js";
import loadJs from "./loadJs.js";
import EditorHistory from "./history";

class DomOperate extends ContextMenu {
  init(vm) {
    this.paramsLocked = 0;
    this.mulIds = [];
    this.$contextmenuKey = false;
    this.currentPageType = null;
    this.currentPageId = null;
    this.layout = vm.$parent;
    this.$vm = vm; //home
    this.$markContainer = null;
    this.$mark = this.$vm.$refs.compMark;
    this.$tabMenus = vm.$parent.$refs.tabMenus;
    this.$left = vm.$parent.$refs.lefters;
    this.$right = vm.$parent.$refs.righters;
    this.centerConfigs = vm.$store.state.config.centerConfigs;
    this.selectedId = null; // 当前选中的组件id
    super.init();
    // this.initHistory();
  }
  initHistory() {
    this.$history = new EditorHistory(this);
    this.$history.setHistory(0);
  }

  readyLoad(page) {
    //准备加载页面
    return new Promise(resolve => {
      let list = this.$vm.pageList;
      let loaded = true;
      let index = list.findIndex(_page => {
        return page.linkPage === _page.linkPage;
      });
      if (index === -1) {
        list.push(page);
        loaded = false;
      }
      setTimeout(() => {
        resolve(loaded);
      }, 0);
    });
  }
  addParamsLocked() {
    this.paramsLocked++;
    this.layout.$nextTick(() => {
      if (this.paramsLocked !== 2) {
        this.$chint.pageParams = null;
      }
      this.paramsLocked = 0;
      console.log("当前页面参数:", this.$chint.pageParams, this.paramsLocked);
    });
  }
  readyMulLoad(mulId) {
    return new Promise(resolve => {
      let index = this.mulIds.findIndex(id => {
        return id === mulId;
      });
      let loaded = true;
      if (index === -1) {
        this.mulIds.push(mulId);
        loaded = false;
      }
      resolve(loaded);
    });
  }
  //加载本地页面
  loadLocal(page, callback) {
    let pageId = page.linkPage;
    this.readyLoad(page).then(loaded => {
      if (!loaded) {
        let dom = this.$vm.$el.querySelector("#page-" + pageId);
        if (!this.centerConfigs[pageId]) {
          this.centerConfigs[pageId] = {
            white: {
              backImage: ""
            },
            black: {
              backImage: ""
            },
            zIndex: 3,
            compConfigs: [],
            comps: []
          };
        }
        console.log;
        let theme = this.$vm.$store.getters.theme;
        let backImage = this.centerConfigs[pageId][theme].backImage;
        this.$vm.config["上传中心区域背景图"].value.imgUrl = backImage;
        this.centerConfigs[pageId].loaded = true;
        if (page.type !== "multi") {
          this.$vm.initStyle();
          let compConfigs = this.centerConfigs[pageId].compConfigs;
          compConfigs.forEach(config => {
            this._createSymbol(dom, config);
          });
        }
      } else {
        if (page.type === "single") {
          let theme = this.$vm.$store.getters.theme;
          let backImage = this.centerConfigs[pageId][theme].backImage;
          this.$vm.config["上传中心区域背景图"].value.imgUrl = backImage;
          this.$vm.initStyle();
          //将当前页面关联的树组件渲染出来
          let comps = this.centerConfigs[pageId].comps;
          comps.forEach(comp => {
            if (comp.type === "树形关联图") {
              this.dependTree(comp.id);
            }
          });
        }
      }
      //多页面的时候还要初始化子页面
      if (page.type === "multi") {
        this.loadmulLocal(page.pages[0].id);
      } else {
        this.layout.$nextTick(() => {
          this.readyData();
        });
      }

      callback && callback();
    });
  }
  deletePage(id, item) {
    //如果该页面正在显示，先隐藏
    let bool = false;
    if (id === this.$vm.linkPageId) {
      this.$vm.linkPageId = "";
      this.vms = null;
      bool = true;
    }
    this.$vm.$nextTick(() => {
      let config = this.centerConfigs[id];
      if (!config) return;
      let comps = config.comps;
      comps.forEach(comp => {
        if (comp.type !== "树形关联图") {
          comp.$destroy();
        } else {
          this.isDeleteTree(comp);
        }
      });
      delete this.centerConfigs[id];
      if (item.type === "multi") {
        item.pages.forEach(page => {
          let _config = this.centerConfigs[page.id] || { comps: [] };
          let _comps = _config.comps;
          _comps.forEach(_comp => {
            if (_comp.type !== "树形关联图") {
              _comp.$destroy();
            } else {
              this.isDeleteTree(_comp);
            }
          });
          delete this.centerConfigs[page.id];
        });
      }
      if (bool) {
        this.$vm.$nextTick(() => {
          this.currentPageType = null;
          this.currentPageId = null;
        });
      }
    });
  }
  //加载多页面
  loadmulLocal(currentId) {
    this.readyMulLoad(currentId).then(loaded => {
      if (!loaded) {
        let dom = this.$vm.$el.querySelector("#page-" + currentId);
        if (!this.centerConfigs[currentId]) {
          this.centerConfigs[currentId] = {
            white: {
              backImage: ""
            },
            black: {
              backImage: ""
            },
            zIndex: 3,
            compConfigs: [],
            comps: []
          };
        }
        let theme = this.$vm.$store.getters.theme;
        let backImage = this.centerConfigs[currentId][theme].backImage;
        this.$vm.config["上传中心区域背景图"].value.imgUrl = backImage;
        this.$vm.initStyle();
        let compConfigs = this.centerConfigs[currentId].compConfigs;
        this.centerConfigs[currentId].loaded = true;
        compConfigs.forEach(config => {
          this._createSymbol(dom, config);
        });
      } else {
        let theme = this.$vm.$store.getters.theme;
        let backImage = this.centerConfigs[currentId][theme].backImage;
        this.$vm.config["上传中心区域背景图"].value.imgUrl = backImage;
        this.$vm.initStyle();
        //将当前页面关联的树组件渲染出来
        let comps = this.centerConfigs[currentId].comps;
        comps.forEach(comp => {
          if (comp.type === "树形关联图") {
            this.dependTree(comp.id);
          }
        });
      }
      this.layout.$nextTick(() => {
        this.readyData();
      });
    });
  }
  //加载远程页面
  loadRemote(page) {
    let newPage = {
      ...page,
      linkPage: page.id
    };
    this.readyLoad(newPage).then(loaded => {
      if (!loaded) {
        let dom = this.$vm.$el.querySelector("#page-" + page.id);
        this.$vm.$remoteSymbols(this.$vm, dom, page);
      }
    });
  }
  //加载系统页面
  loadSystem(page) {
    let newPage = {
      ...page,
      linkPage: page.id
    };
    this.readyLoad(newPage).then(loaded => {
      if (!loaded) {
        return;
      }
    });
  }
  //加载远程js
  loadUploadJs(page) {
    let pageId = window.config.uploadJsPreUrl + page.linkPage.split("----")[1];
    this.readyLoad(page).then(loaded => {
      if (!loaded) {
        let dom = this.$vm.$el.querySelector("#page-" + page.linkPage);
        getUploadJs({ fileUrl: pageId + ".js" }).then(res => {
          loadJs(res, dom, this.$vm);
        });
      }
    });
  }
  initPageConfig(config) {
    /**
     * id:路由id
     * linkPage:关联页面id
     * origin：本地local,系统vue system,远程remote
     * type:single multi单页面多页面
     */
    let { linkPage, origin } = config;
    let myPage;
    switch (origin) {
      case "remote":
        // var singlePages = webPages.filter(page => {
        //   return page.type === type;
        // });
        // myPage = singlePages.find(page => {
        //   return page.id === linkPage;
        // });
        this.loadRemote(config);
        break;
      case "system":
        myPage = systemPages.find(page => {
          return page.id === linkPage;
        });
        this.loadSystem(myPage);
        break;
      case "other":
        this.loadUploadJs(config);
        break;
      default:
        this.loadLocal(config, this.initHistory.bind(this));
        break;
    }
  }
  getLocation() {
    let padding = parseInt(this.$vm.otherStyle.padding.slice(0, -2));
    return {
      top: this.layout.mainTop + padding,
      left: this.layout.mainLeft + 200 + padding
    };
  }
  //创建自定义
  createCustomSymbol(event, config) {
    if (!this.currentPageId) return;
    let scrollEl = this.$vm.$el.querySelector("#page-" + this.currentPageId)
      .parentElement;
    let scrollLeft = scrollEl.scrollLeft;
    let scrollTop = scrollEl.scrollTop;
    let { top, left } = this.getLocation();
    let dom = this.$vm.$el.querySelector("#page-" + this.currentPageId);
    let addLeft = config.width / 2;
    let addTop = config.height / 2;
    let otherTop = this.currentPageType === "single" ? 0 : 50;

    let _left = event.x - left + scrollLeft - addLeft;
    let _top = event.y - top - otherTop + scrollTop - addTop;
    _left = _left < 0 ? 0 : _left;
    _top = _top < 0 ? 0 : _top;

    let vmsArray = [];
    config._linkComp.forEach(item => {
      item = JSON.parse(JSON.stringify(item));
      let vm = this.$vm.$symbols(this.$vm, dom, {
        ...item,
        left: item.left + _left,
        top: item.top + _top,
        zIndex: this.centerConfigs[this.currentPageId].zIndex
      });
      vmsArray.push(vm);
      this.addInstance(vm);
    });
    return this.startCompose(vmsArray);
  }
  _createSymbol(dom, config) {
    config = JSON.parse(JSON.stringify(config));
    let vm = null;
    if (config.type === "compose") {
      //组合
      let comps = this.centerConfigs[this.currentPageId].comps;
      let vms = config.linkCompIndexs.map(index => {
        return comps[index];
      });
      this.startCompose(vms, config, true);
      // vm = this.$vm.$composeSymbols(this.$vm, dom, config);
    } else {
      if (config.type === "树形关联图") {
        config = this.getTreeConfig(config.id);
        if (!config) return;
      }
      vm = this.$vm.$symbols(this.$vm, dom, config);
      this.addInstance(vm);
    }
  }
  //只有拖动离右边一定距离才能创建
  checkCreateSymbol(event, config, bool) {
    if (config.classes === 1) {
      let imgConfig = this.imgRemember.get(config.type);
      if (imgConfig) {
        config.width = imgConfig.width;
        config.height = imgConfig.height;
      }
    }

    //校验是否拖放到容器中,和添加自定义组件
    if (
      document.body.offsetWidth - event.clientX > 300 &&
      !!this.currentPageId
    ) {
      if (config.type === "树形关联图") return false;
      let vm =
        config.type !== "container"
          ? this.containerCheck(event, config, bool)
          : false;
      if (vm !== null && vm !== undefined) {
        //一旦拖动到容器中，则走容器添加元素方式
        return vm;
      }
      return false;
    }
    return true;
  }
  /**
   * 创建图元，由于滚动条和padding原因，需要设置初始left和top
   * @param {*} config 创建图元的属性，包含type和默认宽和高
   */
  createSymbol(config, newConfig, bool) {
    if (!this.currentPageId) return;
    let scrollEl = this.$vm.$el.querySelector("#page-" + this.currentPageId)
      .parentElement;
    let scrollLeft = scrollEl.scrollLeft;
    let scrollTop = scrollEl.scrollTop;
    let { top, left } = this.getLocation();
    let dom = this.$vm.$el.querySelector("#page-" + this.currentPageId);
    let addLeft = !bool ? config.width / 2 : 0;
    let addTop = !bool ? config.height / 2 : 0;
    let otherTop = this.currentPageType === "single" ? 0 : 50;
    // let _left = (newConfig.x - left + scrollLeft - addLeft)/parseFloat(this.$vm.config["页面缩放"].value);
    // let _top = (newConfig.y - top - otherTop + scrollTop - addTop)/parseFloat(this.$vm.config["页面缩放"].value);
    let _left = newConfig.x - left + scrollLeft - addLeft;
    let _top = newConfig.y - top - otherTop + scrollTop - addTop;
    this.vms = this.$vm.$symbols(this.$vm, dom, config, {
      left: _left < 0 ? 0 : _left,
      top: _top < 0 ? 0 : _top,
      zIndex: this.centerConfigs[this.currentPageId].zIndex
    });
    this.addInstance(this.vms);
    if (!bool) {
      this.setOperation(this.vms);
    }
    return this.vms;
  }
  //创建遮罩
  showMark() {
    if (!this.currentPageId) return;
    // this.clearVms();
    this.$mark.used = true;
    let padding = parseInt(this.$vm.otherStyle.padding.slice(0, -2));

    let { top, left } = this.getLocation();
    // this.$mark.$el.style.display = "block";
    this.$mark.left = this.x - left + padding;
    this.$mark.top = this.y - top + padding;
    // this.vms = this.$mark;
  }
  /**
   * 获取选中所有图元
   * @param {*} param0
   */
  getMultiSymbols({ width, height, left, top }, rule) {
    let scrollEl = this.$vm.$el.querySelector("#page-" + this.currentPageId)
      .parentElement;
    let scrollLeft = scrollEl.scrollLeft;
    let scrollTop = scrollEl.scrollTop;
    let padding = parseInt(this.$vm.otherStyle.padding.slice(0, -2));
    left = left + scrollLeft - padding;
    top = top + scrollTop - padding;
    let vms;
    let instances;
    if (this.$markContainer && this.$markContainer.vm) {
      let containerVm = this.$markContainer.vm.$refs.comp;
      left = left - this.$markContainer.vm.left;
      top = top - this.$markContainer.vm.top;
      instances =
        containerVm.comps[containerVm.baisicConfig["容器"].currentTabIndex];
    } else {
      instances = this.centerConfigs[this.currentPageId].comps;
    }
    let check1 = vm => {
      return (
        vm.left >= left &&
        vm.top >= top &&
        vm.width + vm.left <= left + width &&
        vm.height + vm.top <= height + top &&
        !vm.locked &&
        !vm.isCompose
      );
    };
    let check2 = vm => {
      let bool = !(
        vm.left + vm.width < left ||
        vm.left > left + width ||
        vm.top + vm.height < top ||
        vm.top > top + height
      );
      return bool && !vm.locked && !vm.isCompose;
    };
    let check = rule ? check1 : check2;
    vms = instances.filter(vm => {
      if (check(vm)) {
        return true;
      }
    });

    if (vms.length === 1) {
      this.vms = vms[0];
      this.setOperation(this.vms);
    } else if (vms.length > 1) {
      this.vms = vms;
      this.setMultOperation();
    }
  }
  //右侧显示对应菜单
  showMenu(vm) {
    if (vm.classes !== null) {
      this.$right.showMenuWhatever(vm, "basic");
    }
  }

  showMenuWhatever(vm, currType) {
    if (vm.classes !== null) {
      this.$right.showMenuWhatever(vm, currType);
    }
  }
  /**
   * 根据图元样式，判定当前想更改图元的属性范围
   * @param {String} className 元素样式
   */
  getDirection(className) {
    if (className.indexOf("taglen-top") != -1) {
      return "top";
    } else if (className.indexOf("taglen-bottom") != -1) {
      return "bottom";
    } else if (className.indexOf("taglen-left") != -1) {
      return "left";
    } else if (className.indexOf("taglen-right") != -1) {
      return "right";
    } else {
      return className.slice(7);
    }
  }
  //清楚图元选中状态
  clearVms() {
    if (this.vms) {
      if (this.vms instanceof Array) {
        this.vms.forEach(vm => {
          vm.$el.className = "symbolDiv";
        });
      } else if (this.vms.$el) {
        this.vms.$el.className = "symbolDiv";
      }
    }
    this.selectedId = null;
    this.selected = false;
    this.vms = null;
  }
  addInstance(vm) {
    let val = this.centerConfigs[this.currentPageId];
    val.zIndex++;
    val.comps.push(vm);
  }
  setMultOperation() {
    this.vms.forEach(vm => {
      vm.$el.classList.add("multiple");
    });
    if (!this.vms.length) {
      this.vms = null;
    }
  }
  checkVmType(vm1, vm2) {
    if (
      (vm1.$parent.type === "container" && vm2.$parent.type !== "container") ||
      (vm1.$parent.type !== "container" && vm2.$parent.type === "container")
    ) {
      return false;
    }
    return true;
  }
  selectOperation(event, vm) {
    let vms = this.vms;
    let bool = vms instanceof Array;
    if (bool && event.ctrlKey) {
      let _vmIndex = vms.findIndex(item => {
        return item === vm;
      });
      if (_vmIndex !== -1) {
        let removeVm = vms.splice(_vmIndex, 1);
        removeVm[0].$el.className = "symbolDiv";
        if (vms.length === 1) {
          this.setOperation(vms[0]);
        }
        return;
      }
    }
    if (!vms || vms === vm) {
      this.setOperation(vm);
      return;
    }
    if (event.ctrlKey) {
      if (bool) {
        if (!this.checkVmType(vms[0], vm)) {
          this.setOperation(vm);
        } else {
          this.addMultOperation(vm);
        }
      } else {
        if (!this.checkVmType(vms, vm)) {
          this.setOperation(vm);
        } else {
          this.addMultOperation(vm);
        }
      }
    } else {
      if (bool) {
        if (vms.indexOf(vm) === -1) {
          if (!this.checkVmType(vms[0], vm)) {
            this.setOperation(vm);
          } else {
            this.addMultOperation(vm);
          }
        }
      } else {
        this.setOperation(vm);
      }
    }
  }
  addMultOperation(vm) {
    if (vm.$el.className.indexOf("multiple") !== -1) {
      return;
    }
    let bool = this.vms instanceof Array;
    if (vm.locked) {
      vm.$message({
        type: "warning",
        message: "该组件已被锁定!"
      });
      return;
    }

    if (!bool) {
      if (this.vms.locked) {
        this.vms.$message({
          type: "warning",
          message: "该组件已被锁定!"
        });
        return;
      }
      this.vms.$el.classList.remove("single");
      this.vms.$el.classList.remove("oper");
      this.vms.$el.classList.add("multiple");
      this.vms = [this.vms];
    }
    vm.$el.classList.add("multiple");
    this.vms.push(vm);
    this.vms.sort((a, b) => {
      return a.zIndex - b.zIndex;
    });
    this.showMenu(vm);
  }
  //选中当前组件，添加选中样式
  setOperation(vm) {
    this.clearVms();
    this.selectedId = vm.id;
    this.vms = vm;
    if (this.vms.$el.classList.length === 1) {
      this.vms.$el.classList.add("single");
    }
    this.showMenu(vm);
  }
  setOperationWhatever(vm, currType) {
    this.clearVms();
    this.vms = vm;
    if (this.vms.$el.classList.length === 1) {
      this.vms.$el.classList.add("single");
    }
    this.showMenuWhatever(vm, currType);
  }
}

export default DomOperate;
