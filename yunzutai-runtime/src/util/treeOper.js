import { guid } from "@/util/common.js";
import FolieShifte from "./folieShifte.js";
class TreeOper extends FolieShifte {
  init() {
    this.treeConfigs = this.$vm.$store.state.config.treeConfigList || [];
    this.treeCollection = [];
    this.treeVms = {};
    super.init();
  }
  //判断当前的树是否能被删除
  isNeedTree(vm) {
    let id = vm.id;
    let comps = this.centerConfigs[this.currentPageId].comps;
    let bool = comps.find(comp => {
      let config = comp.$refs.comp;
      config = config ? config.highConfig : null;
      if (
        config &&
        JSON.stringify(config).indexOf(id) !== -1 &&
        !comp.deleted
      ) {
        return true;
      }
    });
    if (!bool) {
      this.deleteTree(vm);
    }
    return bool;
  }
  isDeleteTree(vm) {
    let linkPages = vm.$refs.comp.linkPages;
    let index = linkPages.findIndex(link => {
      return link === this.currentPageId;
    });
    linkPages.splice(index, 1);
    if (!linkPages.length) {
      // let target = this.treeConfigs.findIndex(config => {
      //   return config.id === vm.id;
      // });
      // this.treeConfigs.splice(target, 1);
      vm.deleted = true;
    } else {
      vm.$parentEl.removeChild(vm.$el);
    }
  }
  //删除树组件
  deleteTree(vm) {
    let vms = this.treeVms[this.currentPageId];
    let index = vms.findIndex(item => {
      return item === vm;
    });
    if (index != -1) {
      vms.splice(index, 1);
    }
  }
  getTreeData(treeId) {
    let vms = this.treeVms[this.currentPageId];
    let treeVm = vms.find(vm => {
      return vm.id === treeId;
    });
    return treeVm.$refs.comp.getSearchData();
  }
  getTreeDataName(treeId) {
    let vms = this.treeVms[this.currentPageId];
    let treeVm = vms.find(vm => {
      return vm.id === treeId;
    });
    let treeData = treeVm.$children[0].treeData;
    let treeName = [];
    for (let i = 0; i < treeData.length; i++) {
      if (treeData[i].children.length > 0) {
        for (let j = 0; j < treeData[i].children.length; j++) {
          if (
            treeData[i].children[j].selected &&
            treeData[i].children[j].linkData.pointIds.length > 0
          ) {
            let name = treeData[i].name + "/" + treeData[i].children[j].name;
            treeName.push(name);
          }
        }
      }
    }
    return treeName;
  }
  getTreeDatas(treeId, type) {
    let vms = this.treeVms[this.currentPageId];
    let treeVm = vms.find(vm => {
      return vm.id === treeId;
    });
    return treeVm.$refs.comp.getSearchDatas(type);
  }
  //将树组件绑定到当前页面
  dependTree(id) {
    let vms = this.treeVms[this.currentPageId];
    if (!vms) {
      this.treeVms[this.currentPageId] = [];
    }
    vms = this.treeVms[this.currentPageId];
    let vm = vms.find(item => {
      return item.id === id;
    });
    let dom = this.$vm.$el.querySelector("#page-" + this.currentPageId);
    //判断当前页面是否已存在该树组件
    if (!vm) {
      //判断该树有没有渲染过，将该元素移植到当前页面中
      vm = this.treeCollection.find(item => {
        return item.id === id;
      });
      if (vm) {
        this.addLinkPages(vm);
        dom.appendChild(vm.$el);
        vm.$parentEl = dom;
        vms.push(vm);
        this.addInstance(vm);
      } else {
        //没有渲染过的树组件根据配置重新渲染一次
        this._createSymbol(dom, { type: "树形关联图", id: id });
      }
    } else {
      this.addLinkPages(vm);
      dom.appendChild(vm.$el);
      vm.$parentEl = dom;
    }
  }
  addLinkPages(vm) {
    let linkPages = vm.$refs.comp.linkPages;
    let index = linkPages.findIndex(link => {
      return link === this.currentPageId;
    });
    if (index === -1) {
      linkPages.push(this.currentPageId);
    }
  }

  //获取树选择列表
  getTreeList() {
    return this.treeConfigs.map(item => {
      let currentConfig = this.treeCollection.find(config => {
        if (config.id === item.id) {
          return true;
        }
        return false;
      });
      if (currentConfig) {
        return {
          label: currentConfig.$refs.comp.name,
          value: currentConfig.id
        };
      }
      return {
        label: item.compConfig.name,
        value: item.id
      };
    });
  }

  /**
   * 获取树形图
   * @param {tree的ID} id
   */
  getTreeConfig(id) {
    let vm = this.treeCollection.find(item => {
      return item.id === id;
    });
    if (vm) {
      this.dependTree(id);
      return;
    }
    return this.treeConfigs.find(item => {
      if (item.id === id) {
        return true;
      }
      return;
    });
  }
  collectTree(vm) {
    this.addLinkPages(vm);
    let config = this.treeConfigs.find(item => {
      if (item.id === vm.id) {
        return true;
      }
      return;
    });
    if (!config) {
      this.treeConfigs.push({ id: vm.id });
    }
    let id = vm.$parentEl.getAttribute("id").slice(5);
    config = this.treeVms[id];
    if (!config) {
      this.treeVms[id] = [];
    }
    this.treeVms[id].push(vm);
    this.treeCollection.push(vm);
  }
  treeCopy(name) {
    let item = JSON.parse(JSON.stringify(this.operTreeItem));
    item.name = name;
    item.id = guid();
    this.operTreeItemParent.push(item);
  }

  //更改为子集
  treeChangeTypeFloder() {
    this.operTreeItem.type = "floder";
    this.operTreeItem.children = [];
  }
  //更改为子项
  treeChangeTypeFile() {
    this.operTreeItem.type = "file";
    delete this.operTreeItem.children;
  }
  //项排序
  treeSort() {}
  //重命名项
  treeRename(name) {
    this.operTreeItem.name = name;
  }
  //删除项
  treeDelete() {
    let parentItems = this.operTreeItemParent;
    let index = parentItems.findIndex(item => {
      return item === this.operTreeItem;
    });
    if (index !== -1) {
      parentItems.splice(index, 1);
    }
  }
  /**
   *
   * @param {新建的名称} name
   * @param {类型} type
   * @param {父级} parent
   */
  addTree(name, type) {
    let target;
    let parent;
    if (this.operTreeItem) {
      parent = this.operTreeItem;
      target = this.operTreeItem.children;
    } else {
      parent = null;
      target = this.vms.$refs.comp.treeData;
    }
    target.push({
      id: guid(),
      type: type === "子集" ? "floder" : "file",
      selected: false,
      expanded: false,
      linkData: {
        pointIds: [],
        statisticsType: ""
      },
      name: name,
      children: []
    });
    if (parent) {
      parent.selected = false;
    }
  }
  /**
   * 校验新建的列表名称是否重复
   * @param {新建的名称} name
   * @param {同级子集} sameChild
   */
  checkNameRepect(name) {
    if (name === "") {
      return "请输入有效的名称!";
    }
    let sameChild = this.operTreeItem
      ? this.operTreeItem.children
      : this.vms.$refs.comp.treeData;
    let index = sameChild.findIndex(child => {
      if (this.operTreeItem) {
        return child.name === name && child.id !== this.operTreeItem.id;
      }
      return child.name === name;
    });
    if (index !== -1) {
      return "同层级不允许出现相同的名称!";
    }
    return true;
  }
}

export default TreeOper;
