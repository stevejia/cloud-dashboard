import store from "@/store";
// const INIT = 0;
// const PAGE_BASI_CCONFIG_CHANGE = 1;
const PAGE_HIGH_CONFIG_CHANGE = 2;
const THEME_CONFIG_CHANGE = 4;
const TOP_CONFIG_CHANGE = 5;
const CENTER_CONFIG_CHANGE = 6;
const LEFT_CONFIG_CHANGE = 7;
const USER_CONFIG_CHANGE = 8;
class EditorHistory {
  constructor(editorIns) {
    // this.setHistory(editorIns);
    this.resetHistory();
    this.editor = editorIns;
    this.index = 0;
  }
  //当pageId change 的时候
  resetHistory() {
    store.commit("setHistory", []);
  }

  /**
   *
   * @param {*} operation 0 for 初始化  1 for 页面基本属性改动 2 for 页面高级属性改动  4 for 主题改动 5 for顶部编辑改动 6 for 中心区域编辑改动 7 for 左侧导航栏改动 8 for 用户入口编辑改动
   */
  setHistory(operation = 0) {
    let editorIns = this.editor;
    let histories = store.getters.history;
    histories = histories.splice(0, histories.length + this.index);

    let history = {
      operation
    };

    //获取当前页面的 center configs
    let historyCenterConfigs = this.getHistoryCenterConfigs(editorIns);
    let selectedCompIds = editorIns.vms
      ? editorIns.vms instanceof Array
        ? editorIns.vms.map(vm => vm.id)
        : [editorIns.vms.id]
      : null;
    history.centerConfigs = historyCenterConfigs;
    history.selectedCompIds = selectedCompIds;
    //初始化设置 layout的config 主题 顶部 中心区域 左侧 用户入口的配置
    //TODO::
    let layout = editorIns?.layout;
    if (layout && layout?.config) {
      let allConfig = editorIns.layout.config;
      //初始化设置主题的配置
      let themeConfig = this.clone(allConfig.theme);
      if (themeConfig) {
        history.themeConfig = this.clone(themeConfig);
      }
      //初始化设置顶部的配置
      let headers = layout.$refs.headers;
      let { white, black, config } = headers;
      let topConfig = this.clone({ white, black, config });
      if (topConfig) {
        console.log(topConfig);
        history.topConfig = topConfig;
      }
      //初始化设置中心区域的配置

      let center = editorIns?.$vm;
      let { white: cWhite, black: cBlack, config: cConfig } = center;
      let centerConfig = this.clone({
        white: cWhite,
        black: cBlack,
        config: cConfig
      });
      if (centerConfig) {
        history.centerConfig = centerConfig;
      }
      //初始化设置左侧菜单栏的配置
      let lefters = editorIns?.$left;
      let { white: lWhite, black: lBlack, config: lConfig } = lefters;
      let leftConfig = this.clone({
        white: lWhite,
        black: lBlack,
        config: lConfig
      });
      if (leftConfig) {
        history.leftConfig = leftConfig;
      }
      //初始化设置用户入口的配置
      let userConfig = this.clone(allConfig.userConfig);
      if (userConfig) {
        history.userConfig = userConfig;
      }
    }
    histories.push(history);
    // console.log(histories);
    store.commit("setHistory", histories);
    this.index = 0;
  }

  /**
   * 获取当前页面的 配置信息
   * @param {当前drag实例化对象} editorIns
   */
  getHistoryCenterConfigs(editorIns) {
    //获取当前页面的 center configs
    let cconfigs = editorIns.centerConfigs;

    let historyCenterConfigs = {};

    for (let key in cconfigs) {
      let pageConfig = cconfigs[key];

      let newCompConfigs = pageConfig.comps.map(comp => {
        let compData = { id: comp.id, deleted: comp.deleted };
        let compConfig = comp.compConfig;
        if (compConfig) {
          let { baisicConfig, highConfig, white, black } = compConfig;
          let storeConfig = this.clone({
            baisicConfig,
            highConfig,
            white,
            black
          });
          compData.compConfig = storeConfig;
        }
        // let compConfig = this.clone(comp.compConfig);
        // let compData = { compConfig, id: comp.id, deleted: comp.deleted };
        if (comp.$refs.comp) {
          let cConfig = comp.$refs.comp.$data;
          if (cConfig) {
            // console.log(cConfig);
            let { baisicConfig, highConfig, white, black } = cConfig;
            let nConfig = this.clone({
              baisicConfig,
              highConfig,
              white,
              black
            });
            compData.compConfig = nConfig;
          }
        }
        return compData;
      });

      let newPageConfig = {
        compConfigs: this.clone(newCompConfigs),
        comps: [...pageConfig.comps]
      };

      historyCenterConfigs[key] = newPageConfig;
    }
    return historyCenterConfigs;
  }
  clone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }
  goBack() {
    this.index--;
    this._historyChange(this.index, true);
  }
  forward() {
    this.index++;
    this._historyChange(this.index);
  }

  _historyChange(index, isBack) {
    let history = this.getHistory(index);
    if (history) {
      this.update(history);
    } else {
      if (isBack) {
        console.log("向后没有更多历史了");
        this.index++;
      } else {
        console.log("向前没有更多历史了");
        this.index--;
      }
    }
  }
  update(history) {
    let editorIns = this.editor;

    let operation = history.operation;

    let activeName = this.getActiveName(operation);
    if (activeName) {
      let righters = editorIns.layout.$refs.righters;
      let type66 = righters.$refs.type66;
      type66.activeName = activeName;
    }

    this.updateTheme(editorIns, history.themeConfig);
    this.updateTop(editorIns, history.topConfig);
    this.updateCenter(editorIns, history.centerConfig);
    this.updateLeft(editorIns, history.leftConfig);
    this.updateUserLogin(editorIns, history.userConfig);
    this.updatePage(editorIns, history);
  }

  getActiveName(operation) {
    let activeName = "";
    switch (operation) {
      case THEME_CONFIG_CHANGE:
        activeName = "1";
        break;
      case TOP_CONFIG_CHANGE:
        activeName = "2";
        break;
      case CENTER_CONFIG_CHANGE:
        activeName = "3";
        break;
      case LEFT_CONFIG_CHANGE:
        activeName = "4";
        break;
      case USER_CONFIG_CHANGE:
        activeName = "5";
    }
    return activeName;
  }

  updatePage(editorIns, history) {
    let historyCenterConfigs = history.centerConfigs[editorIns.currentPageId];
    let currentCenterConfigs = editorIns.centerConfigs[editorIns.currentPageId];

    let compIds = historyCenterConfigs.compConfigs.map(cc => {
      return cc.id;
    });
    console.log(compIds.length);
    currentCenterConfigs.compConfigs = currentCenterConfigs.compConfigs.filter(
      ccc => {
        return compIds.indexOf(ccc.id) > -1;
      }
    );
    // let _compConfigs = this.clone(currentCenterConfigs.compConfigs);
    // this.clone(Object.assign(_compConfigs, this.clone(historyCenterConfigs.compConfigs)));
    // currentCenterConfigs.compConfigs = _compConfigs;
    Object.assign(
      currentCenterConfigs.compConfigs,
      this.clone(historyCenterConfigs.compConfigs)
    );
    // currentCenterConfigs.compConfigs.forEach(ccs => {
    //   let hcs = historyCenterConfigs.compConfigs.find(cce => {
    //     return cce.id === ccs.id;
    //   });
    //   if (hcs) {
    //     Object.assign(ccs, hcs);
    //   }
    // });
    let historyComps = historyCenterConfigs.comps;
    let currentComps = currentCenterConfigs.comps;
    let allComps = this.combineComps(currentComps, historyComps);
    currentCenterConfigs.comps = allComps;

    let currentCompConfigs = currentCenterConfigs.compConfigs;
    allComps.forEach(comp => {
      var compConfig = currentCompConfigs.find(cc => {
        return cc.id === comp.id;
      });
      editorIns.clearVms();
      if (compConfig) {
        Object.assign(comp.$refs["comp"].$data, compConfig.compConfig);
        Object.assign(comp.$refs["comp"], compConfig.compConfig);
        comp.$nextTick(() => {
          comp.$refs["comp"].initStyle();
          comp.deleted = compConfig.deleted;
          [comp.left, comp.top] = compConfig.compConfig.baisicConfig[
            "位置"
          ].value;
          [comp.width, comp.height] = compConfig.compConfig.baisicConfig[
            "尺寸"
          ].value;
          compConfig.compConfig.baisicConfig["尺寸"].value = [
            comp.width,
            comp.height
          ];
          comp.transform = compConfig.compConfig.baisicConfig["旋转角度"].value;
          comp.locked = compConfig.locked;
          comp.zIndex = compConfig.zIndex;
        });
      } else {
        comp.deleted = true;
      }
      if (
        history.selectedCompIds &&
        history.selectedCompIds.indexOf(comp.id) > -1
      ) {
        let operation = history.operation;
        let currentType =
          operation === PAGE_HIGH_CONFIG_CHANGE ? "high" : "basic";
        comp.$nextTick(() => {
          editorIns.setOperationWhatever(comp, currentType);
        });
      } else {
        editorIns.showMenu({ classes: 66 });
      }
    });
  }

  updateTheme(editorIns, config) {
    let cloneConfig = this.clone(config);
    Object.assign(editorIns.layout.themeConfig, cloneConfig);
    Object.assign(editorIns.layout.$data.themeConfig, cloneConfig);
    let newTheme = editorIns.layout.themeConfig["主题切换"].value;
    let storedConfig = store.state.config;
    storedConfig.stylesConfig.theme["主题切换"].value = newTheme;
    store.commit("setConfig", storedConfig);
    editorIns.layout.initStyle();
    // editorIns.$vm.initStyle();
  }
  updateTop(editorIns, config) {
    let headers = editorIns.layout.$refs.headers;
    let cloneConfig = this.clone(config);
    Object.assign(headers.$data, cloneConfig);
    Object.assign(headers, cloneConfig);
    headers.initStyle();
  }
  updateCenter(editorIns, config) {
    let cloneConfig = this.clone(config);
    let center = editorIns.$vm;
    Object.assign(center, cloneConfig);
    Object.assign(center.$data, cloneConfig);
    center.initStyle();
  }
  updateLeft(editorIns, config) {
    let cloneConfig = this.clone(config);
    let left = editorIns.layout.$refs.lefters;
    Object.assign(left.$data, cloneConfig);
    Object.assign(left, cloneConfig);
    left.initStyle();
  }
  updateUserLogin(editorIns, config) {
    let cloneConfig = this.clone(config);
    let layout = editorIns.layout;
    Object.assign(layout.userConfig, cloneConfig);
    Object.assign(layout.$data.userConfig, cloneConfig);
    layout.initStyle();
  }

  getHistory(index) {
    let histories = store.getters.history;
    let realIndex = histories.length + index - 1;
    return histories[realIndex];
  }

  combineComps(targetList, sourceList) {
    let shouldAddSourceList = sourceList.filter(sl => {
      return targetList.every(tl => {
        return tl.id !== sl.id;
      });
    });
    return [...targetList, ...shouldAddSourceList];
  }
}

export default EditorHistory;
