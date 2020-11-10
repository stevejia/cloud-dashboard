import { translateVisible, translateOpacity } from "./../translate.js";
export default function translateConfig(item) {
  let config = {
    white: {
      mapBg: item.white.mapBg || ""
    },
    black: {
      mapBg: item.black.mapBg || ""
    }
  };
  let compConfig = {
    imUrl: item.src.slice(1),
    white: config.white,
    black: config.black,
    highConfig: {
      添加响应: {
        type: "explain"
      },
      可见: {
        type: "eventVisible",
        value: translateVisible(item.mapres)
      },
      线条1: {
        type: "line"
      },
      闪烁: {
        type: "eventOpacity",
        value: translateOpacity(item.mapres)
      },
      线条2: {
        type: "line"
      },
      显示度: {
        type: "eventMap",
        value: item.mapres.opacdev,
        opacityRange: [item.mapres.opacRangeMin, item.mapres.opacRangeMax],
        dataRange: [item.mapres.opacDataMin, item.mapres.opacDataMax]
      }
    },
    baisicConfig: {
      固定比例: {
        type: "checkbox",
        value: false
      },
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
      线条1: {
        type: "line"
      },
      翻转: {
        type: "btnRotate",
        value: [item.turnRox, item.turnRoy]
      },
      线条2: {
        type: "line"
      },
      背景颜色: {
        type: "color-select-row",
        modifyColor: false,
        value: [
          { title: "背景颜色", value: config[item.theme].mapBg },
          { title: "图素颜色", value: "" }
        ]
      },
      显示度: {
        type: "slider",
        status: 1,
        range: [0, 100],
        value: item.mapbgOpacity * 100
      },
      旋转角度: {
        type: "slider",
        status: 1,
        range: [0, 360],
        value: item.gRotate
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
