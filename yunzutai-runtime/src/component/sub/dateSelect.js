import { translateFontFamily } from "./../translate.js";
export default function translateConfig(item) {
  let config = {
    white: {
      color: item.white.color || "#41464D",
      background: item.white.backgroundColor || "rgba(53, 115, 193,0)",
      btnBackGround: item.white.buttonColor || "#3573C1",
      radioBack: "rgba(53, 115, 193,0)",
      btnColor: "#FFFFFF"
    },
    black: {
      color: item.black.color || "#B2DDFF",
      background: item.black.backgroundColor || "rgba(53, 115, 193,0)",
      btnBackGround: item.black.buttonColor || "rgb(53, 115, 193)",
      radioBack: "#B2DDFF",
      btnColor: "#B2DDFF"
    }
  };
  let dateType = {
    小时: "h",
    日: "d",
    周: "W",
    月: "M",
    季度: "q",
    年: "y"
  };
  let compConfig = {
    linkVmIds: [],
    beginTime: item.beginTime,
    endTime: item.endtime,
    intervalUnit: dateType[item.time],
    white: config.white,
    black: config.black,
    baisicConfig: {
      尺寸: {
        type: "widthHeight",
        label: ["宽度", "高度"],
        value: [item.gWidth, item.gHeight]
      },
      位置: {
        type: "widthHeight",
        label: ["横轴", "纵轴"],
        value: [item.gLeft, item.gTop]
      },
      线条: {
        type: "line"
      },
      名称: {
        type: "input",
        value: item.label
      },
      字体: {
        type: "fontThree",
        value: [item.fontSize + "px", translateFontFamily(item.fontFamily), ""]
      },
      背景颜色: {
        type: "color-select",
        value: ""
      },
      按钮颜色: {
        type: "color-select",
        value: ""
      },
      显示度: {
        type: "slider",
        status: 1,
        range: [0, 100],
        value: item.opacity * 100
      },
      样式还原: {
        type: "resetStyle"
      },
      线条2: {
        type: "line"
      },
      旋转角度: {
        type: "slider",
        status: 1,
        range: [0, 360],
        value: item.gRotate
      },
      日期类型: {
        type: "dateTypeCheckbox",
        value: item.dateType
      }
    }
  };
  return [
    compConfig,
    item.gWidth,
    item.gHeight,
    item.gLeft,
    item.gTop,
    item.gRotate,
    item.laylck,
    item.gZindex
  ];
}
