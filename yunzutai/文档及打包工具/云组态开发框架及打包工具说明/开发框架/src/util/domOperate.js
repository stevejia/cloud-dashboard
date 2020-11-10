import Collections from "./collections";
class DomOperate extends Collections {
  init(vm) {
    this.currentPageId = null;
    this.layout = vm.$parent;
    this.$vm = vm; //home
    this.$left = vm.$parent.$refs.lefters;
    this.$right = vm.$parent.$refs.righters;
    this.centerConfigs = vm.$store.state.config.centerConfigs;
    super.init();
  }
  initPageConfig(pageId) {
    let oldConfig = this.centerConfigs[this.currentPageId];
    let config = this.centerConfigs[pageId];
    if (this.currentPageId !== pageId) {
      if (this.currentPageId) {
        oldConfig.comps.forEach(comp => {
          comp.$el.style.display = "none";
        });
      }

      if (!config) {
        this.centerConfigs[pageId] = {
          zIndex: 3,
          compConfigs: [],
          comps: []
        };
      }
      config = this.centerConfigs[pageId];
      let compConfigs = config.compConfigs;
      this.currentPageId = pageId;
      if (config.comps.length === 0) {
        compConfigs.forEach(config => {
          this._createSymbol(config);
        });
      } else {
        config.comps.forEach(comp => {
          comp.$el.style.display = "";
        });
      }
    }
  }
  getLocation() {
    let padding = parseInt(this.$vm.wholeStyle.padding.slice(0, -2));
    return {
      top: this.layout.mainTop + padding,
      left: this.layout.mainLeft + 200 + padding
    };
  }
  _createSymbol(config) {
    let vm = this.$vm.$symbols(this.$vm, config);
    this.addInstance(vm);
  }
  /**
   * 创建图元，由于滚动条和padding原因，需要设置初始left和top
   * @param {*} config 创建图元的属性，包含type和默认宽和高
   */
  createSymbol(config) {
    this.clearVms();
    let scrollLeft = document.querySelector(".home").scrollLeft;
    let scrollTop = document.querySelector(".home").scrollTop;
    let { top, left } = this.getLocation();
    this.vms = this.$vm.$symbols(this.$vm, config, {
      left: this.x - left + scrollLeft - config.width / 2,
      top: this.y - top + scrollTop - config.height / 2,
      zIndex: this.centerConfigs[this.currentPageId].zIndex
    });

    this.addInstance(this.vms);
    this.setOperation(this.vms);
  }
  //创建遮罩
  createMark() {
    this.clearVms();
    let scrollLeft = document.querySelector(".home").scrollLeft;
    let scrollTop = document.querySelector(".home").scrollTop;
    let { top, left } = this.getLocation();
    this.vms = this.$vm.$marks(
      this.$vm,
      {},
      {
        left: this.x - left + scrollLeft,
        top: this.y - top + scrollTop
      }
    );
  }
  /**
   * 获取选中所有图元
   * @param {*} param0
   */
  getMultiSymbols({ width, height, left, top }) {
    let instances = this.centerConfigs[this.currentPageId].comps;
    let vms = instances.filter(vm => {
      if (
        vm.left >= left &&
        vm.top >= top &&
        vm.width <= width &&
        vm.height <= height
      ) {
        return true;
      }
    });
    if (vms.length === 1) {
      this.vms = vms[0];
      this.setOperation(this.vms);
    } else {
      this.vms = vms;
      this.setMultOperation();
    }
  }
  //右侧显示对应菜单
  showMenu(vm) {
    this.$right.showMenu(vm);
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
      } else {
        this.vms.$el.className = "symbolDiv";
      }
      this.vms = null;
    }
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
  }
  addMultOperation(vm) {
    let bool = this.vms instanceof Array;
    if (!bool) {
      this.vms.$el.classList.remove("single");
      this.vms.$el.classList.add("multiple");
      this.vms = [this.vms];
    }
    vm.$el.classList.add("multiple");
    this.vms.push(vm);
    this.showMenu(vm);
  }
  //选中当前组件，添加选中样式
  setOperation(vm) {
    this.clearVms();
    this.vms = vm;
    if (this.vms.$el.classList.length === 1) {
      this.vms.$el.classList.add("single");
    }
    this.showMenu(vm);
  }
}

export default DomOperate;
