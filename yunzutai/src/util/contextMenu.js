import ContainerOper from "./containerOper.js";
class ContextMenu extends ContainerOper {
  init() {
    this.$contextmenu = this.$vm.$refs.contextmenu;
    //图标类操作
    this.targetVm = null;
    //上下移动准备
    this.linkVms = [];
    //场景
    this.operComp = null;
    //操作的树组件原始
    this.operTreeItem = null;
    this.operTreeItemParent = null;
    //复制准备
    this.copyConfig = null;
    this.copyVms = [];
    this.copyContainer = null;
    this.copyEvent = null;
    this.curentVmIndex = null;
    //图像记忆
    this.imgRemember = new Map();
    //常用组件列表
    this.composeToVmsList = [
      {
        name: "新增的",
        type: "新增的",
        _type: "自定义",
        config: {
          id: "fa1adfb2-43b2-49fc-8637-ec0577853080",
          linkComps: [],
          currentPageId: "af2e1ed2-0377-4d09-b014-922b92fc4713",
          width: 380,
          height: 237,
          left: 93,
          top: 256,
          zIndex: 9,
          linkCompIndexs: [0, 1],
          type: "compose",
          classes: null,
          locked: false,
          _linkComp: [
            {
              id: "6830d992-2fa8-4357-bf52-646b1b340250",
              width: 223,
              height: 119,
              type: "text",
              classes: 0,
              name: "文本",
              imUrl: "iconwenben",
              left: 0,
              top: 118,
              zIndex: 3,
              isCompose: true,
              currentComp: null,
              transform: 0,
              locked: false,
              compConfig: {
                white: {
                  背景颜色: "rgba(8,114,184,0)",
                  边框颜色: "#000000",
                  字体样式0: "#000000"
                },
                black: {
                  背景颜色: "rgba(8,114,184,0)",
                  边框颜色: "#FFFFFF",
                  字体样式0: "#FFFFFF"
                },
                highConfig: {
                  添加响应: { type: "explain" },
                  可见: {
                    type: "eventVisible",
                    value: { pointId: [], rule: "" }
                  },
                  闪烁: {
                    type: "eventOpacity",
                    value: { pointId: [], rule: "" }
                  },
                  颜色响应: {
                    type: "eventColor",
                    value: {
                      pointId: [],
                      colorList: [{ color: "", start: "", end: "" }]
                    }
                  },
                  线条: { type: "line" },
                  启用文字响应: {
                    type: "fontResponse",
                    value: {
                      status: false,
                      pointId: [],
                      valueList: [{ text: "", min: null, max: null }]
                    }
                  },
                  添加事件: { type: "explain" },
                  事件: {
                    type: "event",
                    remind: true,
                    value: [
                      {
                        order: 2,
                        result: [{ pointId: [], value: "" }],
                        jsContent:
                          'this.routerPush("456",{name:"我是从123跳转过来的"})'
                      }
                    ]
                  }
                },
                baisicConfig: {
                  文本内容: { type: "textarea", value: "文本我是老的" },
                  尺寸: {
                    type: "widthHeight",
                    label: ["宽度", "高度"],
                    value: [223, 119]
                  },
                  位置: {
                    type: "widthHeight",
                    label: ["横轴", "纵轴"],
                    value: [93, 374]
                  },
                  线条1: { type: "line" },
                  文本样式: {
                    type: "font-align",
                    value: ["12px", "", "", "center", "center"]
                  },
                  字体样式: {
                    type: "font",
                    value: ["#FFFFFF", "normal", "", ""]
                  },
                  背景颜色: {
                    type: "color-select",
                    value: "rgba(8,114,184,0)"
                  },
                  边框粗细: {
                    type: "slider",
                    status: 1,
                    range: [0, 10],
                    value: 0
                  },
                  边框颜色: { type: "color-select", value: "#FFFFFF" },
                  显示度: {
                    type: "slider",
                    status: 1,
                    range: [0, 100],
                    value: 100
                  },
                  样式还原: { type: "resetStyle" },
                  线条: { type: "line" },
                  旋转角度: {
                    type: "slider",
                    status: 1,
                    range: [0, 360],
                    value: 0
                  }
                }
              },
              heightChange: false,
              deleted: false,
              modifyColor: false
            },
            {
              id: "82953d83-7e4c-4919-b856-39490f97f099",
              width: 100,
              height: 44,
              type: "开关按钮",
              classes: 2,
              name: "开关按钮",
              imUrl: "iconkaiguananniu",
              left: 280,
              top: 0,
              zIndex: 9,
              isCompose: true,
              currentComp: null,
              transform: 0,
              locked: false,
              modifyColor: false,
              compConfig: {
                collectPointIds: [[]],
                white: {
                  字体3: "#6cc044",
                  背景颜色: "#000000",
                  按钮颜色: "#3573C1"
                },
                black: {
                  字体3: "#6cc044",
                  背景颜色: "#000000",
                  按钮颜色: "#3573C1"
                },
                highConfig: {
                  添加响应: { type: "explain" },
                  显示切换: { type: "dataTree", value: [] },
                  添加事件: { type: "explain" },
                  事件: {
                    type: "eventBtn",
                    remind: false,
                    ditto: false,
                    value: [
                      {
                        order: "",
                        open: { valueList: [{}] },
                        off: { valueList: [{}] }
                      }
                    ]
                  }
                },
                baisicConfig: {
                  尺寸: {
                    type: "widthHeight",
                    label: ["宽度", "高度"],
                    value: [100, 44]
                  },
                  位置: {
                    type: "widthHeight",
                    label: ["横轴", "纵轴"],
                    value: [373, 256]
                  },
                  线条1: { type: "line" },
                  背景颜色: { type: "color-select", value: "#000000" },
                  按钮颜色: { type: "color-select", value: "#3573C1" },
                  字体: {
                    type: "fontFour",
                    value: ["12px", "", "center", "#6cc044"]
                  },
                  样式还原: { type: "resetStyle" },
                  线条2: { type: "line" },
                  开状态文本: { type: "input", value: "ON" },
                  关状态文本: { type: "input", value: "OFF" },
                  线条3: { type: "line" },
                  旋转角度: {
                    type: "slider",
                    status: 1,
                    range: [0, 360],
                    value: 0
                  }
                }
              },
              heightChange: false,
              deleted: false
            }
          ]
        }
      }
    ];
    super.init();
  }
  //加入到常用组件
  composeToVms(vm) {
    this.layout
      .$prompt("", "请输入新组件名称", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPlaceholder: "请输入",
        closeOnClickModal: false
      })
      .then(({ value }) => {
        if (value) {
          let vms = vm || this.vms;
          let config = vms.getConfig(undefined, true);
          this.composeToVmsList.push({
            name: value,
            type: value,
            config: config
          });
          console.log(config);
        }
      })
      .catch(() => {
        this.layout.$message({
          type: "info",
          message: "取消输入"
        });
      });
  }
  //取消组合
  unCompose(bool, vm) {
    let vms = vm || this.vms;
    let comps, dom;
    if (vms.$parent.type === "container") {
      let compData = vms.$parent.$refs.comp;
      let container = compData.baisicConfig["容器"];
      comps = compData.comps[container.currentTabIndex];
      dom = compData.$el.querySelector(".body");
    } else {
      comps = this.centerConfigs[this.currentPageId].comps;
      dom = this.$vm.$el.querySelector("#page-" + this.currentPageId);
    }
    let targetIndex = -1;
    let linkComps = vms.linkComps;
    comps.forEach((comp, index) => {
      if (comp === vms) {
        targetIndex = index;
      }
    });
    linkComps.forEach(comp => {
      comp.left = comp.left + vms.left;
      comp.top = comp.top + vms.top;
      dom.appendChild(comp.$el);
      comp.$parentEl = dom;
      comp.resetStyle();
      if (bool) {
        comp.isCompose = false;
      }
    });
    comps[targetIndex].$destroy();
    comps.splice(targetIndex, 1);
    return linkComps;
  }
  //开始组合
  /**
   *
   * @param {*} composeVm
   * @param {*} config
   * @param {*} status
   * @param {*} index 给容器使用
   */
  startCompose(composeVm, config, status, index) {
    // 2020-09-27 change this.vms => this.vms.filter(comp => !comp.deleted) for removing deleted components to avoid not influence the link index of conpose
    let composeVms = composeVm || this.vms.filter(comp => !comp.deleted);
    if (!this.currentPageId) return;
    let bool = true;
    composeVms.some(vm => {
      if (vm.type === "container" || vm.type === "树形关联图") {
        bool = false;
      }
    });
    if (!bool) {
      this.$vm.$message("树形图和容器不能参与组合~");
      return;
    }
    let { left, width, top, height } = this.getMulOption(composeVms);
    let vms = [];
    composeVms.forEach(vm => {
      if (vm.compose === "compose") {
        vms.push(...vm.linkComps);
        this.unCompose(false, vm);
      } else {
        vm.isCompose = true;
        vms.push(vm);
      }
    });
    return this.createCompose(
      vms,
      left,
      width,
      top,
      height,
      config,
      status,
      index
    );
  }
  //创建组合元素
  createCompose(vms, left, width, top, height, config, status, index) {
    let bool = vms[0].$parent.type === "container";
    let dom = this.$vm.$el.querySelector("#page-" + this.currentPageId);
    let domVm = this.$vm;
    if (bool) {
      dom = vms[0].$parent.$refs.comp.$el.querySelector(".body");
      domVm = vms[0].$parent;
    }
    vms.sort((a, b) => {
      return a.zIndex - b.zIndex;
    });
    let zIndex = vms[vms.length - 1].zIndex;
    this.clearVms();
    let newConfig = config
      ? { ...config, linkComps: vms }
      : {
          linkComps: vms,
          currentPageId: this.currentPageId,
          width: width,
          height: height,
          left: left,
          top: top,
          zIndex: zIndex
        };

    this.vms = this.$vm.$composeSymbols(domVm, dom, newConfig);
    this.vms.$el.querySelector(".markView.symbolMark").style.zIndex = zIndex;
    let vmDom = this.vms.$el.querySelector(".content");
    vms.forEach(vm => {
      vm.left = vm.left - left;
      vm.top = vm.top - top;
      vmDom.appendChild(vm.$el);
      vm.$parentEl = vmDom;
    });
    if (bool) {
      let compData = vms[0].$parent.$refs.comp;
      let container = compData.baisicConfig["容器"];
      if (index === undefined) {
        index = container.currentTabIndex;
      }
      if (index !== container.currentTabIndex) {
        this.vms.$el.style.display = "none";
      }
      compData.comps[index].push(this.vms);
      compData.zIndex++;
    } else {
      this.centerConfigs[this.currentPageId].zIndex = zIndex + 1;
      this.centerConfigs[this.currentPageId].comps.push(this.vms);
    }
    if (!status) {
      this.setOperation(this.vms);
    }
    return this.vms;
  }
  /**
   *
   * @param {*} item
   * @param {*} parentItem
   */
  showTreeContextMenu(item, parentItem) {
    if (this.$vm.$store.state.runtime) return;
    this.showContextmenu(this.vms, item, parentItem);
  }
  /**
   * 场景
   * @param {String} item
   * @param {*} parentItem
   */
  showCompContextMenu(item, parentComp) {
    if (!this.$vm.$store.state.runtime) {
      this.showContextmenu(this.vms);
    } else {
      this.showContextmenu(this.vms, item, parentComp);
    }
  }
  //显示菜单
  showContextmenu(vm, item, parentItem) {
    this.$contextmenuKey = true;
    let showMenu = this.getMenu(vm, item, parentItem);
    this.$contextmenuKey = false;
    if (!showMenu) return;
    let scale = this.$vm.scale;
    let { x, y } = window.document.body.getClientRects()[0];
    let scrollLeft = document.querySelector(".home").scrollLeft;
    let scrollTop = document.querySelector(".home").scrollTop;
    let { top, left } = this.getLocation();
    let padding = parseInt(this.$vm.otherStyle.padding.slice(0, -2));
    this.$contextmenu.left =
      (event.clientX - x) / scale[0] - left + padding + scrollLeft;
    this.$contextmenu.top =
      (event.clientY - y) / scale[1] - top + padding + scrollTop;
    this.$contextmenu.showMenu = showMenu;
  }
  //隐藏菜单
  hideContextmenu() {
    this.$contextmenu.showMenu = "";
  }
  //获取多个元素在当前页面中的顺序下标
  getTargetIndexs(_vms) {
    let vms = _vms || this.vms;
    let targetIndex = [];
    vms.forEach(vm => {
      let index = this.getTargetIndex(vm);
      targetIndex.push(index);
    });
    return targetIndex;
  }
  //获取耽搁元素在当前页面中的顺序下标
  getTargetIndex(vms, comps) {
    comps = comps || this.centerConfigs[this.currentPageId].comps;
    return comps.findIndex(comp => {
      if (comp === vms) {
        return true;
      }
    });
  }
  //获取多个元素范围
  getMulOption(copyVms) {
    let operVms = copyVms || this.vms;
    if (!operVms.length || operVms.length <= 1) return {};
    operVms.sort((a, b) => {
      return a.left - b.left;
    });
    let left = operVms[0].left;
    operVms.sort((a, b) => {
      return a.top - b.top;
    });
    let top = operVms[0].top;
    operVms.sort((a, b) => {
      return a.left + a.width - b.left - b.width;
    });
    let val = operVms[operVms.length - 1];
    let width = val.left + val.width - left;
    operVms.sort((a, b) => {
      return a.top + a.height - b.top - b.height;
    });
    val = operVms[operVms.length - 1];
    let height = val.top + val.height - top;
    return { left, top, width, height };
  }
  //显示右击菜单
  getMenu(vm, item, parentItem) {
    this.linkVms = [];
    let showMenu = "";
    if (item) {
      this.operComp = parentItem;
      if (item === "pages") {
        if (parentItem) {
          showMenu += ",683,684,685,";
        } else {
          showMenu += ",681,682,";
        }
      } else if (item === "routes") {
        if (parentItem) {
          showMenu += ",692,693,694,";
        } else {
          showMenu += ",691,";
        }
      } else if (item === "routes_child") {
        showMenu += ",695,696,";
      } else if (item === "scenes") {
        //场景右键
        showMenu += ",671,672,";
      } else if (item === "timer") {
        //定时右键
        showMenu += ",673,672,";
      } else if (item === "aps") {
        //排程右键
        showMenu += ",674,672,";
      } else {
        this.operTreeItem = item;
        this.operTreeItemParent = parentItem
          ? parentItem.children
          : this.vms.$refs.comp.treeData;
        showMenu += ",62,65,66,";
        if (item.type === "file") {
          showMenu += ",631,";
        } else if (item.type === "floder") {
          showMenu += ",61,632,";
          if (!item.children.length) {
            showMenu += ",6321,";
          }
        }
        showMenu += ",64,";
        if (this.operTreeItemParent.length > 1) {
          showMenu += ",641,";
        }
      }

      return showMenu;
    }
    this.operTreeItem = null;
    this.operTreeItemParent = null;
    if (this.$vm.$store.state.runtime) return;
    if (this.copyConfig) {
      this.copyEvent = event;
      showMenu += ",5,";
    }
    if (!vm) return showMenu;
    showMenu += ",1,";
    if (this.vms instanceof Array && this.vms.length >= 2) {
      showMenu += ",4,41,";
      this.vms.forEach(instance => {
        if (
          instance === vm &&
          Array.from(vm.$el.classList).indexOf("oper") === -1
        ) {
          this.targetVm = vm;
          vm.$el.classList.add("oper");
        } else {
          instance.$el.classList.remove("oper");
        }
      });
    } else {
      if (vm.classes === 1) {
        showMenu += ",img,";
        if (this.imgRemember.get(vm.type)) {
          showMenu += ",imgCancel,";
        }
      }
      if (vm.type === "compose") {
        showMenu += ",42,";
        showMenu += ",421,";
      }
      if (vm.type === "树形关联图") {
        showMenu += ",61,";
      }
      let { width, height, left, top } = vm;
      let instances;
      if (vm.$parent.type == "container") {
        let compData = vm.$parent.$refs.comp;
        let container = compData.baisicConfig["容器"];
        instances = compData.comps[container.currentTabIndex];
      } else {
        instances = this.centerConfigs[this.currentPageId].comps;
      }

      this.linkVms = instances.filter(instance => {
        if (
          instance.left >= left + width ||
          instance.top >= top + height ||
          instance.left + instance.width <= left ||
          instance.height + instance.top <= top ||
          instance.locked ||
          instance.isCompose
        ) {
          return false;
        }
        return true;
      });
      this.linkVms.sort((a, b) => {
        return a.zIndex - b.zIndex;
      });
      this.curentVmIndex = this.linkVms.findIndex(item => {
        return item === vm;
      });
      if (this.linkVms.length >= 2) {
        if (this.curentVmIndex === 0) {
          showMenu += ",3,31,33,";
        } else if (this.curentVmIndex === this.linkVms.length - 1) {
          showMenu += ",3,32,34,";
        } else {
          showMenu += ",3,31,32,33,34,";
        }
      }
    }
    if (vm.locked) {
      showMenu += ",22,";
    } else {
      showMenu += ",21,";
    }
    return showMenu;
  }
}
export default ContextMenu;
