import { translateColorChange, translateFontFamily } from "./../translate.js";
export default function translateConfig(item) {
  let fonts = translateFontFamily(item.fontFamily);
  let config = {
    white: {
      backgroundColor: item.white.backgroundColor || "rgba(8,114,184,0)",
      borderColor: item.white.borderColor || "#000000",
      color: item.white.color || "#000000"
    },
    black: {
      backgroundColor: item.black.backgroundColor || "rgba(8,114,184,0)",
      borderColor: item.black.borderColor || "#FFFFFF",
      color: item.black.color || "#FFFFFF"
    }
  };
  let compConfig = {
    white: config.white,
    black: config.black,
    highConfig: {
      添加响应: {
        type: "explain"
      },
      颜色切换: {
        type: "eventColorChange",
        value: translateColorChange(item.numberhighinfo, item.password)
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
      进制: {
        type: "deciaml",
        value: [
          {
            label: [
              {
                label: "二进制",
                value: 2
              },
              {
                label: "十进制",
                value: 10
              },
              {
                label: "十六进制",
                value: 16
              }
            ],
            value: item.dataHex
          },
          {
            label: [
              {
                label: "0",
                value: 0
              },
              {
                label: "1",
                value: 1
              },
              {
                label: "2",
                value: 2
              },
              {
                label: "3",
                value: 3
              }
            ],
            value: item.dataDec
          },
          item.dataUnit,
          item.number
        ]
      },
      线条2: {
        type: "line"
      },
      文本样式: {
        type: "font-align",
        value: [
          item.fontSize + "px",
          fonts,
          item.lineHeight || "",
          item.ftAlign,
          item.alAlign
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
      边框颜色: {
        type: "color-select",
        value: config[item.theme].borderColor
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
