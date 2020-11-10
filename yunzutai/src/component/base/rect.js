import { translateEvent, translateColor } from "./../translate.js";
export default function translateConfig(item) {
  let config = {
    white: {
      backgroundColor: item.white.backgroundColor || "#FFFFFF",
      borderColor: item.white.borderColor || "#DDDDDD",
      sliderGradient: item.white.gradColor || "rgba(0,0,0,0)"
    },
    black: {
      backgroundColor: item.black.backgroundColor || "rgba(8,114,184,0)",
      borderColor: item.black.borderColor || "#FFFFFF",
      sliderGradient: item.black.gradColor || "rgba(0,0,0,0)"
    }
  };
  let compConfig = {
    white: config.white,
    black: config.black,
    highConfig: {
      颜色响应: {
        type: "eventColor",
        value: translateColor(item.wbinfos)
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
      上传背景图: {
        type: "upload-image",
        status: 1,
        value: {
          imgUrl: item.backgroundImage ? item.backgroundImage.slice(4, -1) : "",
          fash: item.backgroundSize
            ? item.backgroundSize
            : item.backgroundPosition
        }
      },
      样式: {
        type: "select",
        label: [
          {
            label: "实线",
            value: "solid"
          },
          {
            label: "虚线",
            value: "dashed"
          }
        ],
        value: item.borderStyle
      },
      背景颜色: {
        type: "color-select",
        value: config[item.theme].backgroundColor
      },
      启用标题渐变色: {
        type: "slider-gradient",
        used: item.isgradColor,
        range: [0, 360],
        value: [config[item.theme].gradColor, item.gradDeg]
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
      圆角: {
        type: "slider",
        status: 1,
        range: [0, 100],
        value: item.borderRadius
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
