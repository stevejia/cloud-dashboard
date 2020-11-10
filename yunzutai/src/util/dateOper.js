import TreeOper from "./treeOper";
class DateOper extends TreeOper {
  init() {
    this.dateSelectVms = {}; //日期组件
    this.dateSelectTargetContainer = {}; //日期组件如果在容器中
    super.init();
  }
  removeLink(vm) {
    let highConfig = vm.$refs.comp.highConfig;
    if (highConfig && highConfig["日期组件"]) {
      this.dependDateSelect(highConfig["日期组件"].oldValue, "");
    }
  }
  dependDateSelect(oldId, id) {
    let pageId = this.currentPageId;
    if (!pageId) return [];
    let vms = this.dateSelectVms[pageId] || [];
    let oldVm, currentVm;
    vms.forEach(vm => {
      if (vm.id === oldId) {
        oldVm = vm;
      } else if (vm.id === id) {
        currentVm = vm;
      }
    });
    let currentVmId = this.vms.id;
    let linkVmIds, index;
    if (oldId) {
      linkVmIds = oldVm.$refs.comp.linkVmIds;
      index = linkVmIds.indexOf(currentVmId);
      linkVmIds.splice(index, 1);
    }
    if (id) {
      linkVmIds = currentVm.$refs.comp.linkVmIds;
      // index = linkVmIds.indexOf(currentVmId)
      linkVmIds.push(this.vms.id);
    }
  }
  //获取日期下拉列表
  getDateSelectList() {
    let pageId = this.currentPageId;
    if (!pageId) return [];

    let vms = this.dateSelectVms[pageId] || [];
    vms = vms.filter(vm => {
      let type = vm.$parent.type;
      if (type && type === "container") {
        return (
          vm.$parent === this.vms.$parent &&
          this.dateSelectTargetContainer[vm.id] ===
            vm.$parent.$refs.comp.baisicConfig["容器"].currentTabIndex
        );
      }
      return true;
    });
    return vms.map(item => {
      return {
        label: item.$refs.comp.name,
        value: item.id
      };
    });
  }
  deleteDateSelect(vm) {
    let id = null;
    if (vm.$parent.type === "container") {
      id = vm.$parent.$parentEl.getAttribute("id").slice(5);
    } else {
      id = vm.$parentEl.getAttribute("id").slice(5);
    }
    let target = this.dateSelectVms[id].indexOf(vm);
    this.dateSelectVms[id].splice(target, 1);
  }
  isNeedDateSelect(vm) {
    if (vm.$refs.comp.linkVmIds.length) {
      return true;
    }
    return false;
  }
  collectDateSelect(vm) {
    let id = null;
    if (vm.$parent.type === "container") {
      id = vm.$parent.$parentEl.getAttribute("id").slice(5);
      let tab = vm.$parent.$refs.comp.baisicConfig["容器"].currentTabIndex;
      this.dateSelectTargetContainer[vm.id] = tab;
    } else {
      id = vm.$parentEl.getAttribute("id").slice(5);
    }

    let config = this.dateSelectVms[id];
    if (!config) {
      this.dateSelectVms[id] = [];
    }
    this.dateSelectVms[id].push(vm);
  }
}

export default DateOper;
