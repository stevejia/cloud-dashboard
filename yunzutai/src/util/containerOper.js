import DateOper from "./dateOper";
//容器管理器
class ContainerOper extends DateOper {
  init() {
    this.containerVms = {};
    super.init();
  }
  deleteContainerVms(vm) {
    let id = vm.$parentEl.getAttribute("id").slice(5);
    let target = this.containerVms[id].indexOf(vm);
    this.containerVms[id].splice(target, 1);
  }
  isNeedContainer(vm) {
    let id = vm.id;
    let comps = this.centerConfigs[this.currentPageId].comps;
    return comps.find(comp => {
      let config = comp.$refs.comp;
      config = config ? config.highConfig : null;
      if (config && JSON.stringify(config).indexOf(id) !== -1) {
        return true;
      }
    });
  }
  //校验元素是否拖放到容器中
  containerCheck(event, config, bool) {
    let target = null;
    let newConfig = null;
    let id = this.currentPageId;
    if (config._type === "自定义") {
      config = config.config;
    }
    (this.containerVms[id] || []).forEach(vm => {
      if (!vm) return;
      let nowConfig = this.checkInner(event, vm, config, bool);
      if (nowConfig) {
        if (!target || target.zIndex < vm.zIndex) {
          target = vm;
          newConfig = nowConfig;
        }
      }
    });
    if (target) {
      let contain = target.$refs.comp;
      let containConfig = contain.baisicConfig["容器"];
      if (containConfig.blockContent) {
        //改容器被锁定
        return false;
      }
      let dom = contain.$el.querySelector(".body");
      let zIndex;
      if (config.zIndex) {
        zIndex = config.zIndex;
      } else {
        zIndex = contain.zIndex;
        contain.zIndex++;
      }
      let _vm;
      let left = newConfig.x < 0 ? 0 : newConfig.x;
      let top = newConfig.y < 0 ? 0 : newConfig.y;
      if (config.type === "compose") {
        let vmsArray = [];
        config._linkComp.forEach(item => {
          item = JSON.parse(JSON.stringify(item));
          let vm = this.$vm.$symbols(target, dom, {
            ...item,
            left: item.left + left,
            top: item.top + top,
            zIndex: this.centerConfigs[this.currentPageId].zIndex++
          });
          contain.comps[containConfig.currentTabIndex].push(vm);
          vmsArray.push(vm);
        });
        _vm = this.startCompose(vmsArray);
      } else {
        this.vms = this.$vm.$symbols(target, dom, config, {
          left: left,
          top: top,
          zIndex: zIndex
        });
        _vm = this.vms;
        contain.comps[containConfig.currentTabIndex].push(_vm);
      }
      this.$vm.$message("组件被放入容器内!");

      if (!bool) {
        this.$vm.$nextTick(() => {
          _vm.resetStyle();
          this.showMenu(_vm);
        });
        this.setOperation(this.vms);
      }
      return _vm;
    }
    return false;
  }
  //判断当前event是否在元素中
  checkInner(event, vm, config, bool) {
    if (vm.$el.style.display === "none") return;
    let scrollEl = this.$vm.$el.querySelector("#page-" + this.currentPageId)
      .parentElement;
    let scrollLeft = scrollEl.scrollLeft;
    let scrollTop = scrollEl.scrollTop;
    let { top, left } = this.getLocation();
    let addLeft = bool ? 0 : config.width / 2;
    let addTop = bool ? 0 : config.height / 2;
    let otherTop = this.currentPageType === "single" ? 0 : 50;
    let x = event.clientX - left + scrollLeft;
    let y = event.clientY - top - otherTop + scrollTop;
    if (
      x < vm.left ||
      x > vm.left + vm.width ||
      y < vm.top ||
      y > vm.top + vm.height
    ) {
      return false;
    }
    return {
      x: x - addLeft - vm.left,
      y: y - addTop - vm.top
    };
  }
  //加载容器页签
  loadContainerTab(tabIndex, vm) {
    let contain = vm.$refs.comp;
    let compconfigs = contain.compconfigs;
    let comps = contain.comps;
    let dom = contain.$el.querySelector(".body");
    let compConfig = compconfigs[tabIndex];
    let comp = comps[tabIndex];
    if (compConfig.length === comp.length) return; //说明已经加载过
    compConfig.forEach(compCon => {
      if (compCon.type === "compose") {
        //组合
        let comps = contain.comps[tabIndex];
        let vms = compCon.linkCompIndexs.map(index => {
          return comps[index];
        });
        this.startCompose(vms, compCon, true, tabIndex);
      } else {
        let createVm = this.$vm.$symbols(vm, dom, compCon);
        contain.comps[tabIndex].push(createVm);
      }
    });
  }
  //收集容器
  collectContainer(vm) {
    let id = vm.$parentEl.getAttribute("id").slice(5);
    let config = this.containerVms[id];
    if (!config) {
      this.containerVms[id] = [];
    }
    this.containerVms[id].push(vm);
    //初始化容器，需要初始化容器内部配置
    this.loadContainerTab(0, vm);
  }
}
export default ContainerOper;
