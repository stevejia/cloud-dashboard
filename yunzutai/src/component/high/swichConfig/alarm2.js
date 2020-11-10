import { translateFontFamily } from "@/component/translate.js";

export default function translateConfig(item) {
  console.log(item);
  let config = {
    white: {
      标题字体2: item.white.titleColor || "#333333",
      内容字体2: item.white.textColor || "#455A64",
      标题线条颜色: item.white.titleBorderColor || "#AEAEAE",
      背景颜色: item.white.backgroundColor || "rgba(0,0,0,0)",
      按钮颜色: item.white.buttonbc || "#3573C1"
    },
    black: {
      标题字体2: item.black.titleColor || "#FFFFFF",
      内容字体2: item.black.textColor || "#B2DDFF",
      标题线条颜色: item.black.titleBorderColor || "#404753",
      背景颜色: item.black.backgroundColor || "rgba(0,0,0,0)",
      按钮颜色: item.black.buttonbc || "#7182B6"
    }
  };
  let compConfig = {
    white: config.white,
    black: config.black,
    highConfig: {
      报警页面关联: {
        type: "select",
        label: [],
        value: item.pageId
      }
    },
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
      标题: {
        type: "input",
        value: item.title
      },
      标题位置: {
        type: "select",
        label: [
          {
            label: "左",
            value: "left"
          },
          {
            label: "中",
            value: "center"
          }
        ],
        value: item.titlePosition
      },
      线条2: {
        type: "line"
      },
      模式选择: {
        type: "select",
        label: [
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
        value: item.dateType
      },
      线条3: {
        type: "line"
      },
      最大数据条数: {
        type: "input",
        value: item.maxCount
      },
      线条4: {
        type: "line"
      },
      标题字体: {
        type: "fontThree",
        value: [
          item.titleFontSize + "px",
          translateFontFamily(item.titleFontFamily),
          ""
        ]
      },
      内容字体: {
        type: "fontThree",
        value: [item.fontSize + "px", translateFontFamily(item.fontFamily), ""]
      },
      标题线条颜色: {
        type: "color-select",
        value: ""
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
        value: item.opacity * 100 //显示度，南京存储是小数，
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
