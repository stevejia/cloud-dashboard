import {
  translateEventBtn,
  translateFontFamily
} from "@/component/translate.js";
export default function translateConfig(item) {
  console.log(item);
  let styleAlign = "center";
  if (item.align == "left") {
    styleAlign = "flex-start";
  } else if (item.align == "right") {
    styleAlign = "flex-end";
  }
  let config = {
    white: {
      字体3: item.white.color || "#000000",
      background: "#dadcdf"
    },
    black: {
      字体3: item.black.color || "#ffffff",
      background: "#000000"
    }
  };
  let compConfig = {
    white: config.white,
    black: config.black,
    isOn: item.turn == 1 ? true : false,
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
      背景颜色: {
        type: "color-select",
        value: "#000000"
      },
      按钮颜色: {
        type: "color-select",
        value: "#3573C1"
      },
      字体: {
        type: "fontFour",
        value: [
          item.size + "px",
          translateFontFamily(item.font),
          styleAlign,
          ""
        ]
      },
      样式还原: {
        type: "resetStyle"
      },
      线条2: {
        type: "line"
      },
      开状态文本: {
        type: "input",
        value: item.text[0]
      },
      关状态文本: {
        type: "input",
        value: item.text[1]
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
    },
    highConfig: {
      添加响应: {
        type: "explain"
      },
      显示切换: {
        type: "dataTree",
        value: item.respevent.respData.btvisdev
      },
      添加事件: {
        type: "explain"
      },
      事件: {
        type: "eventBtn",
        remind: item.respevent.evEnable,
        value: translateEventBtn(item.respevent)
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
