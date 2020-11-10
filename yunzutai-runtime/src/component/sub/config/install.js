import { translateFontFamily } from "@/component/translate.js";
export default function translateConfig(item) {
  let config = {
    white: {
      标签字体2: item.white.fontColor || "#3573C1",
      数值单位字体2: item.white.valueFontColor || "#455A64",
      竖线颜色: item.white.lineColor || "#3573C1",
      背景颜色: item.white.backgroundColor || "#DFE5EA",
      边框颜色: item.white.borderColor || "#ddd"
    },
    black: {
      标签字体2: item.black.fontColor || "#F1921C",
      数值单位字体2: item.black.valueFontColor || "#B2DDFF",
      竖线颜色: item.black.lineColor || "#18191D",
      背景颜色: item.black.backgroundColor || "#24252A",
      边框颜色: item.black.borderColor || "rgba(0, 0, 0, 0)"
    }
  };
  let compConfig = {
    white: config.white,
    black: config.black,
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
      线条1: {
        type: "line"
      },
      标签标题: {
        type: "input",
        value: item.titleName
      },
      线条2: {
        type: "line"
      },
      单位: {
        type: "input",
        value: item.unit
      },
      线条3: {
        type: "line"
      },
      标签字体: {
        type: "fontThrees",
        value: [item.fontSize, translateFontFamily(item.fontFamily), ""]
      },
      数值单位字体: {
        type: "fontThrees",
        value: [
          item.valueFontSize,
          translateFontFamily(item.valueFontFamily),
          ""
        ]
      },
      竖线颜色: {
        type: "color-select",
        value: ""
      },
      背景颜色: {
        type: "color-select",
        value: "#24252A"
      },
      边框颜色: {
        type: "color-select",
        value: ""
      },
      边框粗细: {
        type: "slider",
        status: 1,
        range: [0, 10],
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
      线条4: {
        type: "line"
      },
      旋转角度: {
        type: "slider",
        status: 1,
        range: [0, 360],
        value: item.gRotate
      }
    },
    highConfig: {
      添加数据: {
        type: "explain"
      },
      数据源: {
        type: "dataTree",
        value: item.dtsource.dev
      },
      线条: {
        type: "line"
      },
      可写入: {
        type: "writeable",
        value: {
          writeable: item.isset,
          passwordStatus: item.numconfirm,
          role: item.password
        }
      },
      installVal: item.value
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
