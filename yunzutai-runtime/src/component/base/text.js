import {
  translateEvent,
  translateVisible,
  translateOpacity,
  translateColor,
  translateFontFamily
} from "./../translate.js";
export default function translateConfig(item) {
  let fonts = translateFontFamily(item.fontFamily);
  let config = {
    white: {
      背景颜色: item.white.backgroundColor || "rgba(8,114,184,0)",
      边框颜色: item.white.borderColor || "#FFFFFF",
      字体样式0: item.white.color || "#FFFFFF"
    },
    black: {
      背景颜色: item.black.backgroundColor || "rgba(8,114,184,0)",
      边框颜色: item.black.borderColor || "#000000",
      字体样式0: item.black.color || "#000000"
    }
  };
  let compConfig = {
    text: item.text,
    white: config.white,
    black: config.black,
    highConfig: {
      添加响应: {
        type: "explain"
      },
      可见: {
        type: "eventVisible",
        value: translateVisible(item.wbinfos)
      },
      闪烁: {
        type: "eventOpacity",
        value: translateOpacity(item.wbinfos)
      },
      颜色响应: {
        type: "eventColor",
        value: translateColor(item.wbinfos)
      },
      线条: {
        type: "line"
      },
      启用文字响应: {
        type: "fontResponse",
        value: {
          status: item.wbinfos.istextRes,
          pointId: item.wbinfos.textdev,
          valueList: item.wbinfos.wbtextList.map(_item => {
            return {
              min: _item.tshows,
              max: _item.tshowe,
              text: _item.text
            };
          })
        }
      },
      添加事件: {
        type: "explain"
      },
      事件: {
        type: "event",
        remind: item.wbinfos.evenable,
        value: translateEvent(item.wbinfos)
      }
    },
    baisicConfig: {
      文本内容: {
        type: "textarea",
        value: item.text
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
      文本样式: {
        type: "font-align",
        value: [
          item.fontSize + "px",
          fonts,
          item.lineHeight || "",
          item.ftAlign || "center",
          item.alAlign || "center"
        ]
      },
      字体样式: {
        type: "font",
        value: [
          config[item.theme].color,
          item.fontWeight,
          item.fontStyle,
          item.textDecoration
        ]
      },
      背景颜色: {
        type: "color-select",
        value: config[item.theme].backgroundColor
      },
      边框粗细: {
        type: "slider",
        status: 1,
        range: [0, 10],
        value: item.borderWidth
      },
      边框颜色: {
        type: "color-select",
        value: config[item.theme].borderColor
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
