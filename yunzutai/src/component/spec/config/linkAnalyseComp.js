// import {
//     translateEvent,
//     translateVisible,
//     translateOpacity,
//     translateColor,
//     translateColorChange
//     // translateFontFamily
//   } from "@/component/translate.js";
export default function translateConfig(item) {
  let config = {
    white: {
      color: item.white.color || "#FFFFFF"
    },
    black: {
      color: item.black.color || "#000000"
    }
  };
  let compConfig = {
    white: config.white,
    black: config.black,
    highConfig: {},
    baisicConfig: {
      尺寸: {
        type: "widthHeight",
        label: ["宽度", "高度"],
        value: [item.gWidth, item.gHeight] //位置属性
      },
      位置: {
        type: "widthHeight",
        label: ["横轴", "纵轴"],
        value: [item.gLeft, item.gTop] //位置属性
      },
      线条: {
        type: "line"
      },
      字体样式: {
        type: "font",
        value: ["", "normal", "", ""]
      },
      显示度: {
        type: "slider",
        status: 1,
        range: [0, 100],
        value: item.opacity * 100 //显示度，南京存储是小数，
      },
      样式还原: {
        type: "resetStyle"
      },
      线条1: {
        type: "line"
      },
      旋转角度: {
        type: "slider",
        status: 1,
        range: [0, 360],
        value: item.gRotate //旋转
      }
    }
  };
  //这些数值必须反还
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
