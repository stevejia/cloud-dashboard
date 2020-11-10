export default function translateConfig(item) {
  let config = {
    white: {
      backgroundColor: item.white.backgroundColor || "#FFFFFF",
      borderColor: item.white.borderColor || "#DDDDDD"
    },
    black: {
      backgroundColor: item.black.backgroundColor || "rgba(8,114,184,0)",
      borderColor: item.black.borderColor || "#FFFFFF"
    }
  };
  let compConfig = {
    white: config.white,
    black: config.black,
    baisicConfig: {
      地址: {
        status: 1,
        type: "textarea",
        value: item.websrc
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
      背景颜色: {
        type: "color-select",
        value: config[item.theme].backgroundColor
      },

      边框颜色: {
        type: "color-select",
        value: config[item.theme].borderColor
      },
      边框粗细: {
        type: "slider",
        status: 1,
        range: [1, 10],
        value: item.borderWidth
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
      线条: {
        type: "line"
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
