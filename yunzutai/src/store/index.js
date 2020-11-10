import Vue from "vue";
import Vuex from "vuex";
import commonConfig from "@/config/config.json";
import { getComp } from "@/util/common.js";
import base from "@/components/differentClassJson/base.json";
import sub from "@/components/differentClassJson/sub.json";
import high from "@/components/differentClassJson/high.json";
import spec from "@/components/differentClassJson/spec.json";
import { guid } from "@/util/common.js";
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    permiss: [],
    loadData: false,
    runtime: false, //是否是运行状态
    screenFull: false, //是否全屏状态
    config: commonConfig,
    deviceList: [], //测点集合
    pointGroup: {}, //点位组，定时相关信息
    authorityList: [],
    userInfo: {} || sessionStorage.getItem("userInfo"), //用户信息
    projectId: sessionStorage.getItem("ProjectId") || "",
    subProjectId: sessionStorage.getItem("SubProjectId") || "",
    history: [],
    domain: sessionStorage.getItem("Domain") || "",
    loginInfo: {},
    bgColor: ""
  },
  mutations: {
    setConfig(state, data) {
      state.config = data;
    },
    setDeviceList(state, data) {
      state.deviceList = data;
    },
    setPointGroup(state, data) {
      state.pointGroup = data;
    },
    SET_ACCOUNT(state, platform) {
      state.userInfo = platform;
      sessionStorage.setItem("userInfo", platform);
    },
    setLoadData(state, data) {
      state.loadData = data;
    },
    setProjectInfo(state, data) {
      sessionStorage.setItem("SubProjectId", data.subProjectId);
      sessionStorage.setItem("ProjectId", data.projectId);
      sessionStorage.setItem("Domain", data.domain);
      state.projectId = data.projectId;
      state.domain = data.domain;
      state.subProjectId = data.subProjectId;
    },
    setHistory(state, history) {
      state.history = [...history];
    },
    updateConfig(state, data) {
      state.config = data;
      state.domain = data.domain;
    },
    setAuthList(state, data) {
      state.authorityList = data;
    }
  },
  actions: {
    setLoadData({ commit }, data) {
      commit("setLoadData", data);
    },
    setConfig({ commit }, data) {
      if (data) {
        data = tranlateData(data);
      } else {
        data = commonConfig;
      }
      let authList = [
        {
          id: guid(),
          label: "超级管理员",
          password: "65535",
          grade: "65535",
          counter: 0
        }
      ];
      commit("setAuthList", data.authorityList || authList);
      commit("setConfig", data);
    },
    setDeviceList({ commit }, data) {
      commit("setDeviceList", data);
    },
    setPointGroup({ commit }, data) {
      commit("setPointGroup", data);
    },
    setAccount({ commit }, platForm) {
      commit("SET_ACCOUNT", platForm);
    },
    setProjectInfo({ commit }, data) {
      commit("setProjectInfo", data);
    },
    setAuthList({ commit }, data) {
      commit("setAuthList", data);
    }
  },
  modules: {},
  getters: {
    theme: state => state.config.stylesConfig.theme["主题切换"].value,
    getInfo: state => state.userInfo,
    pointGroup: state => state.pointGroup.pointGroup || [],
    projectId: state => state.projectId,
    history: state => state.history
  }
});

function tranlateData(data) {
  if (data.centerConfigs) {
    let centerConfigs = data.centerConfigs;
    for (let key in centerConfigs) {
      centerConfigs[key] = JSON.parse(centerConfigs[key]);
      if (!centerConfigs[key].white) {
        centerConfigs[key].white = {
          backImage: ""
        };
        centerConfigs[key].black = {
          backImage: ""
        };
      }
    }
    data.treeConfigList = JSON.parse(data.treeConfigList);
    let stylesConfig = data.stylesConfig;
    let routeConfig = data.routeConfig;
    if (stylesConfig.white && stylesConfig.black) {
      //配置转换,历史信息不保存
      data.stylesConfig = {
        theme: {
          主题切换: {
            type: "select",
            label: [
              {
                label: "主题一",
                value: "black"
              },
              {
                label: "主题二",
                value: "white"
              }
            ],
            value: "black"
          }
        },
        topConfig: {
          white: {},
          black: {},
          config: {}
        },
        leftConfig: {
          config: {},
          white: {},
          black: {}
        },
        centerConfig: {
          config: {},
          white: {},
          black: {}
        },
        userConfig: {
          config: {}
        }
      };
    }
    if (stylesConfig.userConfig.config !== undefined) {
      delete stylesConfig.userConfig.config;
    }
    if (stylesConfig.theme["页面选项"].label.length === 3) {
      stylesConfig.theme["页面选项"].label = [
        {
          label: "固定尺寸",
          value: "0"
        },
        {
          label: "适应宽度",
          value: "1"
        },
        {
          label: "适应全部",
          value: "2"
        },
        {
          label: "铺满尺寸",
          value: "3"
        }
      ];
    }
    if (stylesConfig.theme["页面大小"].checked === undefined) {
      stylesConfig.theme["页面大小"].checked = false;
      let [width, height] = stylesConfig.theme["页面大小"].value;
      routeConfig.width = width;
      routeConfig.height = height;
      routeConfig.pageState = "0";
      routeConfig.pages = routeConfig.pages.map(item => {
        item.widht = width;
        item.height = height;
        item.pageState = "0";
        return item;
      });
    }
  } else {
    // console.log(data);
    let center = data.yzt_frame.center;
    let left = data.yzt_frame.nav;
    let header = data.yzt_frame.header;
    let theme = data.yzt_theme;
    let weather = data.yzt_weather;
    let routes = data.yzt_menulist;
    let pages = data.yzt_page;
    let comps = data.yzt_component;
    data = {
      pid: data.pid,
      stylesConfig: {
        theme: {
          主题切换: {
            type: "select",
            label: [
              {
                label: "主题一",
                value: "black"
              },
              {
                label: "主题二",
                value: "white"
              }
            ],
            value: theme
          },
          线条: {
            type: "line"
          },
          页面选项: {
            type: "select",
            label: [
              {
                label: "固定尺寸",
                value: "1"
              },
              {
                label: "适应宽度",
                value: "2"
              },
              {
                label: "适应全部",
                value: "3"
              }
            ],
            value: center.adapt + ""
          }
        },
        topConfig: {
          white: {
            isLogo: header.white.isLogo,
            runColor: header.white.runColor,
            logoUrl: header.white.logoUrl,
            color: header.white.color,
            deg: header.white.deg,
            gradColor: header.white.gradColor,
            topBackground: header.white.bgColor || "#3573c1",
            titleSdColor: header.white.titleSdColor,
            subColor: header.white.subColor,
            shadow: header.white.shadow
          },
          black: {
            isLogo: header.black.isLogo,
            runColor: header.black.runColor,
            logoUrl: header.white.logoUrl,
            color: header.black.color,
            deg: header.black.deg,
            gradColor: header.black.gradColor,
            topBackground: header.black.bgColor || "#2d3035",
            titleSdColor: header.black.titleSdColor,
            subColor: header.black.subColor,
            shadow: header.black.shadow
          },
          config: {
            标题: {
              type: "inputFontStyle",
              value: [
                header.text,
                header.size + "px",
                header.font,
                header.weight,
                header[theme].color
              ]
            },
            启用标题渐变色: {
              type: "slider-gradient",
              used: header.isgradColor,
              range: [0, 360],
              value: [header[theme].gradColor, header[theme].deg]
            },
            启用标题阴影: {
              type: "shadowStyle",
              value: [
                header[theme].titleSdColor,
                header.vshadow + "px",
                header.hshadow + "px",
                header.blur + "px",
                header.isTshadow
              ]
            },
            标题位置: {
              type: "select",
              label: [
                {
                  label: "左",
                  value: "flex-start"
                },
                {
                  label: "居中",
                  value: "center"
                },
                {
                  label: "右",
                  value: "flex-end"
                }
              ],
              value:
                header.titleCenter === "left"
                  ? "flex-start"
                  : header.titleCenter === "center"
                  ? "center"
                  : "flex-end"
            },
            启用副标题: {
              type: "inputFontStyle",
              note: "启用",
              value: [
                header.subtitle,
                header.subSize + "px",
                header.subFont,
                header.subWeight,
                header[theme].subColor,
                header.subHidden
              ]
            },
            背景色: {
              type: "color-select",
              value:
                header[theme].bgColor ||
                (theme === "white" ? "#3573c1" : "#2d3035")
            },
            边框发光色: {
              type: "color-select",
              value: header[theme].shadow
            },
            样式还原: {
              type: "resetStyle"
            },
            线条1: {
              type: "line"
            },
            隐藏顶部导航: {
              type: "checkbox",
              note: "启用",
              value: header.noTopbar
            },
            线条2: {
              type: "line"
            },
            启用Logo: {
              type: "logo",
              note: "启用",
              value: [
                header[theme].logoUrl,
                header[theme].isLogo,
                header.noLogo
              ]
            },
            线条3: {
              type: "line"
            },
            启用运行时间: {
              type: "checkbox",
              note: "启用",
              value: header.isRunTime
            },
            线条4: {
              type: "line"
            },
            启用天气: {
              type: "sky",
              note: "启用",
              value: [
                weather.textFontSize + "px",
                weather.textFont,
                "",
                weather.textColor,
                weather.isCity,
                weather.city
              ]
            }
          }
        },
        leftConfig: {
          white: {
            divider: left.white.divider,
            shadow: left.white.shadow,
            chkItemColor: left.white.chkItemColor,
            fontColor: left.white.color || "rgb(85, 85, 85)",
            selectItemColor: left.white.chkItemColor || "rgb(53, 115, 193)",
            bgColor: left.white.bgColor || "rgb(255, 255, 255)"
          },
          black: {
            divider: left.black.divider,
            shadow: left.black.shadow,
            chkItemColor: left.black.chkItemColor,
            fontColor: left.black.color || "#B7C0CD",
            selectItemColor: left.black.chkItemColor || "#2B2E37",
            bgColor: left.black.bgColor || "#24252A"
          },
          config: {
            字体样式: {
              type: "fontStyle",
              value: [
                left.size + "px",
                left.font,
                left.weight,
                left[theme].color ||
                  (theme === "white" ? "rgb(85, 85, 85)" : "#B7C0CD")
              ]
            },
            选中的字体颜色: {
              type: "color-select",
              value: left[theme].chkTextColor
            },
            选中的条目颜色: {
              type: "color-select",
              value:
                left[theme].chkItemColor ||
                (theme === "white" ? "rgb(53, 115, 193)" : "#2B2E37")
            },
            背景色: {
              type: "color-select",
              value:
                left[theme].bgColor ||
                (theme === "white" ? "rgb(255, 255, 255)" : "#24252A")
            },
            边框发光色: {
              type: "color-select",
              value: left[theme].shadow
            },
            间隔线色: {
              type: "color-select",
              value: left[theme].divider
            },
            间隔线的渐变范围: {
              type: "linear-gradient",
              note: "取消渐变色",
              value: [left.gradient, left.noRange]
            },
            样式还原: {
              type: "resetStyle"
            },
            线条: {
              type: "line"
            },
            菜单折叠: {
              type: "checkbox",
              backFn: null,
              value: left.menufold
            }
          }
        },
        centerConfig: {
          white: {
            centerBackground: center.white.bgColor || "#e2ecf1",
            otherColor: center.white.dotColor
          },
          black: {
            centerBackground: center.black.bgColor || "#2B2E37",
            otherColor: center.black.dotColor
          },
          config: {
            页面缩放: {
              type: "zoom",
              value: "1 x"
            },
            外边距: {
              type: "slider",
              range: [0, 15],
              value: 15
            },
            线条1: {
              type: "line"
            },
            背景色: {
              type: "color-select",
              value:
                center[theme].bgColor ||
                (theme === "white" ? "#e2ecf1" : "#2B2E37")
            },
            栅格色: {
              type: "color-select",
              value: center[theme].dotColor
            },
            样式还原: {
              type: "resetStyle"
            },
            线条2: {
              type: "line"
            },
            容器列表: {
              type: "containerSelect",
              value: ["", false]
            },
            线条3: {
              type: "line"
            },
            上传中心区域背景图: {
              type: "upload-image",
              value: {
                imgUrl: ""
              }
            }
          }
        },
        userConfig: {
          页面标题: {
            type: "input",
            value: data.yzt_login.title
          },
          页面标签: {
            type: "upload-image",
            value: {
              imgUrl: data.yzt_login.favicon
            }
          },
          Logo: {
            type: "upload-image",
            value: {
              imgUrl: data.yzt_login.logo
            }
          },
          背景图: {
            type: "upload-image",
            value: {
              imgUrl: data.yzt_login.bg
            }
          }
        }
      },
      routeConfig: {
        currentSelectRoute: "",
        currentSelectChildrenRoute: null,
        routes: routes.map(item => {
          return {
            name: item.name,
            icon: item.icon,
            origin: item.from,
            type: item.type === "opage" ? "single" : "multi",
            otherType: "0",
            linkPage: getPageId(item.id),
            children: [],
            role: "0",
            pages: [],
            id: item.key
          };
        }),
        pages: pages
          .filter(item => {
            return item.name !== "操作日志" && item.name !== "用户管理";
          })
          .map(item => {
            let pages = [];
            if (item.type === "mpage") {
              pages = getMultiConfig(item.id, comps);
            }
            return {
              id: item.id,
              name: item.name,
              number: item.size,
              pages: pages,
              role: item.authority,
              showStatus: parseInt(item.isHide) + 1 + "",
              type: item.type === "opage" ? "single" : "multi"
            };
          }),
        warnPage: {
          pageId: header.warn.pageId,
          type:
            header.warn.type === "opage"
              ? "single"
              : header.warn.type === "mpage"
              ? "multi"
              : "system"
        }
      },
      centerConfigs: getCenterConfigs(comps, theme),
      treeConfigList: getTreeConfigs(data.yzt_treelist, theme),
      authorityList: data.yzt_permiss
    };
  }
  return data;
}
/**
 * 对树列表进行序列化
 * @param {组件列表} comps
 * @param {主题} theme
 */
function getTreeConfigs(comps, theme) {
  return comps.map(item => {
    let data = item.vueData;
    data.theme = theme;
    data.linkPages = item.counter.map(p => {
      return p.pageId;
    });
    let comp = getComp("树形关联图");
    let [
      compConfig,
      width,
      height,
      left,
      top,
      gRotate,
      laylck,
      zIndex
    ] = comp.methods.translateConfig(data);
    return {
      classes: 3,
      compConfig: compConfig,
      currentComp: null,
      height: height,
      id: item.id,
      isCompose: item.group,
      left: left,
      locked: laylck,
      name: "树形关联图",
      top: top,
      transform: gRotate,
      type: "树形关联图",
      width: width,
      zIndex: zIndex
    };
  });
}
/**
 * 对组件进行序列化
 * @param {组件列表} comps
 */
function getCenterConfigs(comps, theme) {
  let data = {};
  comps.forEach(comp => {
    if (comp.type !== "opage") {
      getCenterConfig(data, comp, [], theme);
      comp.pageCompts.forEach(item => {
        getCenterConfig(data, item, item.components, theme);
      });
    } else {
      getCenterConfig(data, comp, comp.pageCompts, theme);
    }
  });
  return data;
}
/**
 * 获取页面配置
 * @param {配置对象} data
 * @param {当前页面配置} comp
 * @param {当前页面图元列表} components
 */
function getCenterConfig(data, comp, components, theme) {
  let dateCollection = [];
  data[comp.id] = {
    white: {
      backImage: comp.bgUrl?.white
    },
    black: {
      backImage: comp.bgUrl?.black
    },
    zIndex: components.length + 1,
    compConfigs: getCompConfig(components, theme, comp.id, dateCollection),
    comps: []
  };
  for (var i = 0; i < dateCollection.length; i++) {
    let item = dateCollection[i];
    data[comp.id].compConfigs.forEach(_item => {
      if (_item.id !== item.id) {
        if (JSON.stringify(_item).indexOf(item.id) != -1) {
          item.compConfig.linkVmIds.push(_item.id);
        }
      }
    });
  }
}
let tBase = [
  "text",
  "number",
  "line",
  "rect",
  "round",
  "animation",
  "ctner",
  "webview"
];
let tSub = [
  "button",
  "title",
  "slidebar",
  "progressbar",
  "date",
  "time",
  "barchart",
  "piechart",
  "ringchart",
  "ring2chart",
  "gaugechart",
  "historylinechart",
  "foldlinechart",
  "foldlinenochart",
  "linechart",
  "realtimechart",
  "mode",
  "mode2",
  "environment",
  "environment2",
  "aircon1",
  "aircon2",
  "aircon3",
  "aircon4",
  "light1",
  "light2",
  "table",
  "historytable",
  "statisticstable",
  "energytable",
  "datacomparison",
  "security",
  "statistics",
  "install",
  "mapchart"
];
let tHigh = [
  "linebarchart",
  "combinedchart",
  "copchart",
  "comparechart",
  "statisticschart",
  "efficientchart",
  "forecastchart",
  "tree",
  "rank2chart",
  "currentenergychart",
  "scenes",
  "timer",
  "aps",
  "alarm",
  "alarm2"
];
let tSpec = ["transformerchart", "freezingchart", "correlatchart", "monitor"];
function getCompConfig(components, theme, pageId, dateCollection) {
  let arr = [];
  components.forEach(item => {
    if (item.model) {
      arr.push(item);
    } else if (item.group) {
      //为组合组件
      let indexs = [];
      item.children.forEach(ii => {
        let index = arr.push(ii);
        indexs.push(index - 1);
      });

      let data = item.vueData[item.id];
      arr.push({
        id: item.id,
        currentPageId: pageId,
        linkComps: [],
        linkCompIndexs: indexs,
        type: "compose",
        classes: null,
        width: data.gWidth,
        height: data.gHeight,
        left: data.gLeft,
        top: data.gTop,
        locked: false,
        zIndex: data.gZindex
      });
    }
  });

  let comps = arr.map(item => {
    let classes =
      item.model === "base"
        ? 0
        : item.model === "map"
        ? 1
        : item.model === "sub"
        ? 2
        : item.model === "high"
        ? 3
        : item.model === "spec"
        ? 4
        : null;
    let compType;
    if (classes === 0) {
      compType = base[tBase.indexOf(item.type)];
    } else if (classes === 1) {
      compType = { name: "图库", type: "图库" };
    } else if (classes === 2) {
      compType = sub[tSub.indexOf(item.type)];
    } else if (classes === 3) {
      compType = high[tHigh.indexOf(item.type)];
    } else if (classes === 0) {
      compType = spec[tSpec.indexOf(item.type)];
    } else {
      return item;
    }
    if (!compType) return;
    if (compType.type === "树形关联图") {
      return {
        id: item.vueData.cId,
        type: "树形关联图"
      };
    }
    let data = item.vueData[item.model + "_" + item.type];
    data.theme = theme;
    let comp = getComp(compType.type);
    //如果该配置为容器，需要额外配置树形
    if (compType.type === "container") {
      data.compconfigs = data.tabList.map(p => {
        return getCompConfig(p.components, theme, pageId, dateCollection);
      });
    }
    data.gHeight = Math.round(data.gHeight);
    let [
      compConfig,
      width,
      height,
      left,
      top,
      gRotate,
      laylck,
      zIndex
    ] = comp.methods.translateConfig(data);
    let obj = {
      classes: classes,
      compConfig: compConfig,
      currentComp: null,
      height: height,
      id: item.id,
      isCompose: item.group,
      left: left,
      locked: laylck,
      name: compType.name,
      top: top,
      transform: gRotate,
      type: compType.type,
      width: width,
      zIndex: zIndex
    };
    if (compType.type === "日期选择器") {
      dateCollection.push(obj);
    }
    return obj;
  });
  return comps.filter(comp => {
    return comp;
  });
  //
}
/**
 * 对特殊页面进行id转换
 * @param {页面id} id
 */
function getPageId(id) {
  if (id === "commitLog") {
    return "操作日志";
  } else if (id === "userManage") {
    return "用户管理";
  }
  return id;
}
/**
 * 获取多页面配置
 * @param {页面id} id
 * @param {所有页面集合} comps
 */
function getMultiConfig(id, comps) {
  let comp = comps.find(comp => {
    return comp.id === id;
  });
  return comp.pageCompts.map(item => {
    return {
      id: item.id,
      name: item.name
    };
  });
}
