import { fontFamily } from "@/components/differentClass/pack/common";

function getDateType(text) {
  const dateTypes = [
    {
      text: "小时",
      value: "h"
    },
    {
      text: "日",
      value: "d"
    },
    {
      text: "周",
      value: "w"
    },
    {
      text: "季度",
      value: "h"
    },
    {
      text: "年",
      value: "y"
    }
  ];
  let dateType =
    dateTypes.find(dt => {
      return dt.text === text;
    }) || {};
  return dateType.value || text;
}

function getDateTypes(types) {
  const dateTypes = [
    {
      text: "小时",
      value: "h"
    },
    {
      text: "日",
      value: "d"
    },
    {
      text: "周",
      value: "w"
    },
    {
      text: "季度",
      value: "h"
    },
    {
      text: "年",
      value: "y"
    }
  ];
  let typesConfig = dateTypes.map((dt, index) => {
    return (
      types.filter(type => {
        return type === dt.text;
      }).length > 0 || types[index]
    );
  });
  return typesConfig;
}

function getFontFamily(family) {
  let fm =
    fontFamily.find(fFam => {
      return fFam.label === family;
    }) || {};
  return fm.value || family;
}
// import { getDateType, getDateTypes, getFontFamily } from "@/util/util.js";
export function initStyle(bool, ins, callback, mapKeys) {
  let _compData = ins.$data;
  let theme = ins[ins.theme];
  let baisicConfig = _compData.baisicConfig;
  let highConfig = _compData.highConfig;
  if (mapKeys) {
    for (let prop in mapKeys) {
      let map = mapKeys[prop];
      let config = null;
      if (baisicConfig) {
        config = baisicConfig[prop];
      }
      if (!config) {
        config = highConfig[prop];
      }

      if (config) {
        let color = null;
        if (map.length === 1) {
          color = config[map[0]];
        } else if (map.length === 2) {
          color = config[map[0]][map[1]];
        } else if (map.length === 5) {
          color = config[map[0]][map[1]][map[2]][map[3]][map[4]];
        }
        theme[prop] = color;
      }
    }
  }

  let colorConfig = baisicConfig["字体样式"];
  if (colorConfig) {
    theme.color = colorConfig.value[0];
  }

  let borderColorConfig = baisicConfig["边框颜色"];
  if (borderColorConfig) {
    theme.borderColor = borderColorConfig.value;
  }

  let textConfig = baisicConfig["文本内容"];
  if (textConfig) {
    _compData.text = textConfig.value;
  }
  let fontConfig = baisicConfig["文本样式"];
  let styles = {};
  if (fontConfig) {
    let font = fontConfig.value;
    styles.fontSize = font[0];
    styles.fontFamily = font[1];
    styles.lineHeight = font[2];
    styles.justifyContent = font[3];
    styles.alignItems = font[4];
  }

  let fontAlignConfig = baisicConfig["字体样式"];
  if (fontAlignConfig) {
    let fontAlign = fontAlignConfig.value;
    styles.color = fontAlign[0];
    styles.fontWeight = fontAlign[1];
    styles.fontStyle = fontAlign[2];
    styles.textDecoration = fontAlign[3];
  }
  let backgroundConfig = baisicConfig["背景颜色"];
  if (backgroundConfig) {
    let background = backgroundConfig.value || theme.backgroundColor;
    styles.backgroundColor = background;
  }
  let borderWidthConfig = baisicConfig["边框粗细"];
  if (borderWidthConfig && borderColorConfig) {
    let _borderWidth = borderWidthConfig.value;
    let _borderColor = borderColorConfig.value;
    styles.border = `${_borderWidth}px solid ${_borderColor}`;
  }

  let opacityConfig = baisicConfig["显示度"];
  if (opacityConfig) {
    let opacity = opacityConfig.value;
    styles.opacity = opacity / 100;
  }

  let monitorConfig = baisicConfig["地址"];
  if (monitorConfig) {
    let monitorSrc = monitorConfig.value;
    _compData.videoSrc = monitorSrc;
  }
  // let font = baisicConfig["文本样式"].value;
  // let fontAlign = baisicConfig["字体样式"].value;
  if (!bool) {
    ins.$parent.initStyle(
      baisicConfig["尺寸"].value,
      baisicConfig["位置"].value,
      baisicConfig["旋转角度"].value
    );
  }
  callback && callback(styles);
}

export function getBasicConfig() {
  let baisicConfig = {};
  let highConfig = {};
  let data = this.$data;
  for (let prop in data) {
    getBasicPropConfig(prop, data, baisicConfig);
    getHighPropConfig(prop, data, highConfig);
  }
  if (!this.$data.baisicConfig) {
    this.$data.baisicConfig = baisicConfig;
    this.baisicConfig = baisicConfig;
    this._data.baisicConfig = baisicConfig;
  }
  if (!this.$data.highConfig) {
    this.$data.highConfig = highConfig;
    this.highConfig = highConfig;
    this._data.highConfig = highConfig;
  }
}

function getBasicPropConfig(prop, data, config) {
  let dataConfig = data[prop];
  switch (prop) {
    //专业-监控 地址属性
    case "videoSrc":
      config["地址"] = {
        type: "textarea",
        value: dataConfig
      };
      break;
    case "widthHeight":
      config["尺寸"] = {
        type: "widthHeight",
        label: ["宽度", "高度"],
        value: dataConfig
      };
      break;
    case "position":
      config["位置"] = {
        type: "widthHeight",
        label: ["横轴", "纵轴"],
        value: dataConfig
      };
      break;
    case "borderWidth":
      config["边框粗细"] = {
        type: "slider",
        status: 1,
        range: [0, 10],
        value: dataConfig
      };
      break;
    case "borderColor":
      config["边框颜色"] = {
        type: "color-select",
        value: dataConfig
      };
      break;
    case "opacity":
      config["显示度"] = {
        type: "slider",
        status: 1,
        range: [0, 100],
        value: dataConfig
      };
      break;
    case "resetStyle_":
      config["样式还原"] = {
        type: "resetStyle"
      };
      break;
    case "rotateDeg":
      config["旋转角度"] = {
        type: "slider",
        status: 1,
        range: [0, 360],
        value: dataConfig
      };
      break;
    case "dateTypes":
      config["日期类型"] = {
        type: "dateType",
        values: getDateTypes(dataConfig[0]),
        time: [dataConfig[2], dataConfig[3]],
        fastSelect: dataConfig[4],
        value: getDateType(dataConfig[1]),
        label: ["小时", "日", "周", "月", "季度", "年"]
      };
      break;

    case "font":
      dataConfig[1] = getFontFamily(dataConfig[1]);
      config["字体"] = {
        type: "fontThrees",
        value: dataConfig
      };
      break;
    case "searchFont":
      dataConfig[1] = getFontFamily(dataConfig[1]);
      config["查询条件字体"] = {
        type: "fontThree",
        value: dataConfig
      };
      break;
    case "titleFont":
      dataConfig[1] = getFontFamily(dataConfig[1]);
      config["标题字体"] = {
        type: "fontThree",
        value: dataConfig
      };
      break;
    case "contentFont":
      dataConfig[1] = getFontFamily(dataConfig[1]);
      config["内容字体"] = {
        type: "fontThree",
        value: dataConfig
      };
      break;
    case "btnColor":
      config["按钮颜色"] = {
        type: "color-select",
        value: dataConfig
      };
      break;
    case "background":
      config["背景颜色"] = {
        type: "color-select",
        value: dataConfig
      };
      break;
    case "mapBackground":
      config["地图背景颜色"] = {
        type: "color-select",
        value: dataConfig
      };
      break;
    case "splitColor":
      config["分界色"] = {
        type: "color-select",
        value: dataConfig
      };
      break;
    case "emphasisColor":
      config["悬停区域颜色"] = {
        type: "color-select",
        value: dataConfig
      };
      break;
    case "scatterColor":
      config["散点颜色"] = {
        type: "color-select",
        value: dataConfig
      };
      break;
    case "headerColor":
      config["标题背景颜色"] = {
        type: "color-select",
        value: dataConfig
      };
      break;
    case "bodyColor":
      config["单元格背景颜色"] = {
        type: "color-select",
        value: dataConfig
      };
      break;
    case "title":
      config["标题"] = {
        type: "input",
        value: dataConfig
      };
      break;
    case "coordinate":
      config["坐标设置"] = {
        type: "coordinate",
        value: dataConfig[0],
        label: [
          {
            label: "固定范围",
            value: 0
          },
          {
            label: "自动范围",
            value: 1
          }
        ],
        options: dataConfig.filter((i, index) => {
          return i && index !== 0;
        })
      };
      break;
    case "tableHeight":
      config["表格高度"] = {
        type: "slider",
        status: 1,
        range: [0, 1000],
        value: dataConfig
      };
      break;
    case "tableHeaderFont":
      dataConfig[1] = getFontFamily(dataConfig[1]);
      config["表格标题字体"] = {
        type: "fontThree",
        value: dataConfig
      };
      break;
    case "tableBodyFont":
      dataConfig[1] = getFontFamily(dataConfig[1]);
      config["单元格字体"] = {
        type: "fontThree",
        value: dataConfig
      };

      break;
    case "smallIcon":
      config["选择小图标"] = {
        type: "select",
        label: [
          {
            label: "SOS",
            value: "SOS"
          },
          {
            label: "闯入",
            value: "breakinto"
          },
          {
            label: "火警",
            value: "firealarm"
          },
          {
            label: "健康",
            value: "health"
          },
          {
            label: "门磁",
            value: "gatesensor"
          },
          {
            label: "溢水",
            value: "overflow"
          },
          {
            label: "过压",
            value: "guoya"
          },
          {
            label: "欠压",
            value: "qianya"
          },
          {
            label: "低频",
            value: "dipin"
          },
          {
            label: "高频",
            value: "gaopin"
          },
          {
            label: "漏电",
            value: "loudian"
          },
          {
            label: "过流",
            value: "guoliu"
          },
          {
            label: "故障",
            value: "guzhang"
          },
          {
            label: "压差",
            value: "yacha"
          }
        ],
        value: dataConfig
      };
      break;
    case "smallIcon2":
      config["选择小图标"] = {
        type: "select",
        label: [
          {
            label: "温度",
            value: "温度"
          },
          {
            label: "湿度",
            value: "湿度"
          },
          {
            label: "CO2",
            value: "CO2"
          },
          {
            label: "甲醛",
            value: "甲醛"
          },
          {
            label: "PM2.5",
            value: "PM2.5"
          },
          {
            label: "PM10",
            value: "PM10"
          },
          {
            label: "光照度",
            value: "光照度"
          },
          {
            label: "VOC",
            value: "VOC"
          }
        ],
        value: dataConfig
      };
      break;
    case "smallIcon3":
      config["选择小图标"] = {
        type: "select",
        label: [
          {
            label: "上班",
            value: "上班"
          },
          {
            label: "下班",
            value: "下班"
          },
          {
            label: "值班",
            value: "值班"
          },
          {
            label: "放假",
            value: "放假"
          },
          {
            label: "节能",
            value: "节能"
          },
          {
            label: "回家",
            value: "回家"
          },
          {
            label: "离家",
            value: "离家"
          },
          {
            label: "迎宾",
            value: "迎宾"
          },
          {
            label: "演讲",
            value: "演讲"
          },
          {
            label: "讨论",
            value: "讨论"
          },
          {
            label: "手动",
            value: "手动"
          },
          {
            label: "自动",
            value: "自动"
          },
          {
            label: "明亮",
            value: "明亮"
          },
          {
            label: "舒适",
            value: "舒适"
          },
          {
            label: "休闲",
            value: "休闲"
          },
          {
            label: "全开",
            value: "全开"
          },
          {
            label: "全关",
            value: "全关"
          }
        ],
        value: dataConfig
      };
      break;
    case "scenePercent":
      config["前景占比（0% - 100%）"] = {
        type: "inputNumber",
        value: dataConfig,
        range: [0, 99],
        status: false
      };
      break;

    case "dateTypeSelect":
      config["时间类型选择"] = {
        type: "select",
        label: [
          {
            label: "小时",
            value: "小时"
          },
          {
            label: "日",
            value: "日"
          },
          {
            label: "周",
            value: "周"
          },
          {
            label: "月",
            value: "月"
          },
          {
            label: "季度",
            value: "季度"
          },
          {
            label: "年",
            value: "年"
          }
        ],
        value: dataConfig
      };
      break;
    case "dataTypeSelect":
      config["数据类型选择"] = {
        type: "select",
        label: [
          {
            label: "用电量",
            value: "用电量"
          },
          {
            label: "用水量",
            value: "用水量"
          },
          {
            label: "用气量",
            value: "用气量"
          },
          {
            label: "耗热量",
            value: "耗热量"
          }
        ],
        value: dataConfig
      };
      break;
    case "triangleBackground":
      config["三角区域颜色"] = {
        type: "color-select",
        value: dataConfig
      };
      break;
    case "tagSelect":
      config["选择标签"] = {
        type: "select",
        label: [
          {
            label: "温度",
            value: "温度"
          },
          {
            label: "湿度",
            value: "湿度"
          },
          {
            label: "CO2",
            value: "CO2"
          },
          {
            label: "甲醛",
            value: "甲醛"
          },
          {
            label: "PM2.5",
            value: "PM2.5"
          },
          {
            label: "PM10",
            value: "PM10"
          },
          {
            label: "光照度",
            value: "光照度"
          },
          {
            label: "VOC",
            value: "VOC"
          }
        ],
        value: dataConfig
      };
      break;

    case "iconTagFont":
      config["图素标签样式"] = {
        type: "fontThrees",
        value: dataConfig
      };
      break;
    case "valueFont":
      config["数值单位样式"] = {
        type: "fontThrees",
        value: dataConfig
      };
      break;
    case "verticalLineColor":
      config["竖线颜色"] = {
        type: "color-select",
        value: dataConfig
      };
      break;
    case "iconColor":
      config["图标颜色"] = {
        type: "color-select",
        value: dataConfig
      };
      break;

    case "modeBackground":
      console.log(dataConfig);
      config["模式按钮背景颜色"] = {
        type: "mode-background",
        value: dataConfig
      };
  }
}

function getHighPropConfig(prop, data, config) {
  switch (prop) {
    //专业-监控 地址属性
    case "h_chartConfig":
      var hChartConfig3 = data[prop];
      hChartConfig3.forEach((hcc, idx) => {
        config[hcc.label] = {
          type: "explain"
        };
        config[idx === 0 ? "数据源" : `数据源${idx}`] = {
          type: "composeSeriesData2",
          chartType: hcc.type,
          limtLength: hcc.limtLength,
          value: [
            {
              label: hcc.label,
              name: hcc.name,
              value: 100,
              pointId: [],
              rule: "",
              itemStyle: {
                normal: {
                  color: hcc.color
                }
              },
              index: hcc.index,
              noOperate: hcc.noOperate,
              cantAdd: hcc.cantAdd,
              noDateType: hcc.noDateType,
              stack: hcc.stack,
              needChange: true,
              key: hcc.key,
              devType: [
                {
                  label: "耗能统计",
                  value: 1
                },
                {
                  label: "供能统计",
                  value: 2
                },
                {
                  label: "实时值",
                  value: 3
                },
                {
                  label: "平均值",
                  value: 4
                },
                {
                  label: "最大值",
                  value: 5
                },
                {
                  label: "最小值",
                  value: 6
                }
              ],
              devValue: null
            }
          ]
        };
      });
      break;
    case "h_chartConfig3":
      config["添加数据"] = {
        type: "explain"
      };
      var hChartConfig = data[prop];
      hChartConfig.forEach((hcc, idx) => {
        config[idx === 0 ? "数据源" : `数据源${idx}`] = {
          type: "composeSeriesData3",
          chartType: hcc.type,
          limtLength: hcc.limtLength,
          value: [
            {
              label: hcc.label,
              name: hcc.name,
              value: 100,
              pointId: [],
              rule: "",
              itemStyle: {
                normal: {
                  color: hcc.color
                }
              },
              index: hcc.index,
              cantAdd: hcc.cantAdd,
              noOperate: hcc.noOperate,
              noDateType: hcc.noDateType,
              stack: hcc.stack,
              needChange: true,
              key: hcc.key,
              devType: [
                {
                  label: "耗能统计",
                  value: 1
                },
                {
                  label: "供能统计",
                  value: 2
                },
                {
                  label: "实时值",
                  value: 3
                },
                {
                  label: "平均值",
                  value: 4
                },
                {
                  label: "最大值",
                  value: 5
                },
                {
                  label: "最小值",
                  value: 6
                }
              ],
              devValue: null
            }
          ]
        };
      });
      break;
    case "h_refTree":
      config["数据关联"] = {
        type: "explain"
      };
      config["树形图"] = {
        type: "dependtree",
        value: data[prop]
      };
      break;
    case "scatter":
      config["添加散点"] = {
        type: "explain"
      };
      config["散点列表"] = {
        type: "scatter",
        list: data[prop].list,
        place: data[prop].place
      };
      break;
    case "webInfoes":
      var data1 = data[prop];
      config["添加响应"] = {
        type: "explain"
      };
      config["数据源"] = {
        type: "dataTree",
        pointId: data1.visdev,
        lineHide: true
      };
      config["报警范围"] = {
        type: "numRanges",
        values: data1.vistf.map(vf => {
          return [vf.minVistf, vf.maxVistf];
        })
      };
      break;
    case "dev":
      config["数据关联"] = {
        type: "explain"
      };
      config["绑定位号"] = {
        type: "dataTree",
        value: data[prop],
        lineHide: true
      };
      break;

    case "dtsource":
      config["添加响应"] = {
        type: "explain"
      };
      config["数据源"] = {
        type: "dataTree",
        pointId: data[prop][0].dev,
        devType: data[prop][0].devType,
        lineHide: true
      };
      break;

    case "webinfos":
      config["添加响应"] = {
        type: "explain"
      };
      config["数据源"] = {
        type: "eventVisible",
        value: {
          pointId: data[prop].visdev,
          rule: data[prop].vistf
        }
      };
      config["添加事件"] = {
        type: "explain"
      };
      config["模式切换"] = {
        type: "modeToggle",
        data: data[prop]
      };
      break;
  }
}

export function changeTheme(themeName, mapKey, isChange, callback) {
  let theme = this[themeName];

  let compData = this.$data;
  let baisicConfig = compData.baisicConfig;
  let highConfig = compData.highConfig;
  // let highConfig = compData.highConfig;
  for (let prop in mapKey) {
    let color = theme[prop];
    let map = mapKey[prop];
    let config = null;
    if (baisicConfig) {
      config = baisicConfig[prop];
      if (!config) {
        config = highConfig[prop];
      }
      if (config) {
        if (map.length === 1) {
          config[map[0]] = color;
        } else if (map.length === 2) {
          config[map[0]][map[1]] = color;
        } else if (map.length === 5) {
          config[map[0]][map[1]][map[2]][map[3]][map[4]] = color;
        }
      }
    }
  }

  callback && callback(themeName);
  this.baisicConfig = baisicConfig;
  this._data.baisicConfig = baisicConfig;
  isChange && this.initStyle();
  // this.initStyle.bind(this)();
}
