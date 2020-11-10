import { translateEvent, translateAnimation } from "@/component/translate.js";

export default function translateConfig(item) {
  let config = {
    white: {
      background: item.black.backgroundColor || "rgba(0,0,0,0)",
      lineColor: item.black.lineColor || "#455A64",
      liBack: "#455a64"
    },
    black: {
      background: item.black.backgroundColor || "rgba(0,0,0,0)",
      lineColor: item.black.lineColor || "#DDDDDD",
      liBack: "#ddd"
    }
  };
  let compConfig = {
    white: config.white,
    black: config.black,
    highConfig: {
      动画: {
        type: "degree",
        currentImage: item.backgroundImage,
        sameStatus: item.wbinfos.isUnite,
        value: translateAnimation(item.wbinfos)
      },
      添加事件5: {
        type: "explain"
      },
      事件: {
        type: "event",
        remind: item.wbinfos.evenable,
        value: translateEvent(item.wbinfos) //事件属性转换，注意传参，有可能不是这个属性
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
      灯光宽高属性: {
        type: "widthHeight",
        label: ["宽", "高"],
        value: [item.lightWidth, item.lightHeight]
      },
      线条1: {
        type: "line"
      },
      水平灯光数量: {
        type: "input",
        value: item.rowNum
      },
      垂直灯光数量: {
        type: "input",
        value: item.colNum
      },
      线条2: {
        type: "line"
      },
      可控边距: {
        type: "input",
        value: item.controlWidth,
        default: 100,
        status: true
      },
      线条4: {
        type: "line"
      },
      背景颜色: {
        type: "color-select",
        value: ""
      },
      连接线颜色: {
        type: "color-select",
        value: ""
      },
      连接线粗细: {
        type: "slider",
        status: 1,
        range: [0, 10],
        value: item.lineWidth
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
      线条5: {
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
