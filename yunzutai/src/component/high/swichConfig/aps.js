import { translateFontFamily } from "@/component/translate.js";
export default function translateConfig(item) {
  let config = {
    white: {
      表格标题字体2: item.white.titleColor || "rgba(0,0,0,1)",
      表格头部字体2: item.white.cellFontColor || "#FFFFFF",
      单元格字体2: item.white.cellFontColor || "#67757C",
      背景颜色: item.white.backgroundColor || "#FFFFFF",
      标题背景颜色: "#3573C1",
      单元格背景颜色: "#FFFFFF",
      边框颜色: "rgba(221, 221, 221,1)"
    },
    black: {
      表格标题字体2: item.black.titleColor || "#FFFFFF",
      表格头部字体2: item.black.cellFontColor || "#FFFFFF",
      单元格字体2: item.black.cellFontColor || "#FFFFFF",
      背景颜色: item.black.backgroundColor || "#18191D",
      标题背景颜色: "#24252A",
      单元格背景颜色: "#18191D",
      边框颜色: "rgba(67, 74, 90,1)"
    }
  };
  let compConfig = {
    white: config.white,
    black: config.black,
    highConfig: {
      点位组关联: {
        type: "select",
        label: [],
        value: item.pointId
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
      线条: {
        type: "line"
      },
      表格标题: {
        type: "input",
        value: item.title
      },
      表格标题字体: {
        type: "fontThree",
        value: [
          item.titleFontSize + "px",
          translateFontFamily(item.titleFontFamily),
          ""
        ]
      },
      表格头部字体: {
        type: "fontThree",
        value: [item.fontSize + "px", translateFontFamily(item.fontFamily), ""]
      },
      单元格字体: {
        type: "fontThree",
        value: [item.fontSize + "px", translateFontFamily(item.fontFamily), ""]
      },
      背景颜色: {
        type: "color-select",
        value: ""
      },
      标题背景颜色: {
        type: "color-select",
        value: ""
      },
      单元格背景颜色: {
        type: "color-select",
        value: ""
      },
      边框颜色: {
        type: "color-select",
        value: ""
      },
      是否启用分页器: {
        type: "checkbox",
        value: true
      },
      表格高度: {
        type: "slider",
        status: 1,
        range: [0, 1000],
        value: item.tbHeight
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
