import { translateFontFamily } from "@/component/translate.js";
export default function translateConfig(item) {
  let config = {
    white: {
      字体样式2: item.white.fontColor || "#000",
      边框颜色: item.white.borderColor || "#eee",
      背景颜色: item.white.backgroundColor || "rgba(0, 0, 0, 0)",
      发光色: item.white.lineColor || "#3573C1",
      iconColor: item.white.iconColor || "#000"
    },
    black: {
      字体样式2: item.black.fontColor || "#fff",
      边框颜色: item.black.borderColor || "#404753",
      背景颜色: item.black.backgroundColor || "rgba(0, 0, 0, 0)",
      发光色: item.black.lineColor || "#3573C1",
      iconColor: item.black.iconColor || "#fff"
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
      标题内容: {
        type: "input",
        value: item.title
      },
      标题位置: {
        type: "select",
        label: [
          {
            label: "左",
            value: "flex-start"
          },
          {
            label: "中间",
            value: "center"
          },
          {
            label: "右",
            value: "flex-end"
          }
        ],
        value: item.position || "flex-start"
      },
      线条2: {
        type: "line"
      },
      字体样式: {
        type: "fontThree",
        value: [item.fontSize + "px", translateFontFamily(item.fontFamily), ""]
      },
      背景颜色: {
        type: "color-select",
        value: ""
      },
      发光色: {
        type: "color-select",
        value: ""
      },
      边框颜色: {
        type: "color-select",
        value: ""
      },
      是否启用小图标: {
        type: "iconCheckbox",
        note: "123",
        value: {
          iconStatus: item.showIcon || false,
          iconUrl: item.icon || "/static/img/sub/title/electric.svg",
          color: item.iconColor
        }
      },
      边框粗细: {
        type: "slider",
        status: 1,
        range: [1, 10],
        value: item.borderWidth || 1
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
      线条3: {
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
