import { translateFontFamily } from "@/component/translate.js";
export default function translateConfig(item) {
  let config = {
    white: {
      数据条边框颜色: item.white.barBorder || "#000",
      数据条背景颜色: item.white.barColor || "#DADCDF",
      数据条前景颜色: item.white.fwColor || "#3573C1",
      滑块边框颜色: item.white.slideBorder || "#B2DDFF",
      滑块填充颜色: item.white.slideColor || "#3573C1",
      color: item.white.textColor || "#E53F3F"
    },
    black: {
      数据条边框颜色: item.black.barBorder || "#000",
      数据条背景颜色: item.black.barColor || "#7C95A8",
      数据条前景颜色: item.black.fwColor || "#3573C1",
      滑块边框颜色: item.black.slideBorder || "#B2DDFF",
      滑块填充颜色: item.black.slideColor || "#3573C1",
      color: item.black.textColor || "#E53F3F"
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
      数据条边框颜色: {
        type: "color-select",
        value: ""
      },
      数据条背景颜色: {
        type: "color-select",
        value: ""
      },
      数据条前景颜色: {
        type: "color-select",
        value: ""
      },
      滑块边框颜色: {
        type: "color-select",
        value: ""
      },
      滑块填充颜色: {
        type: "color-select",
        value: ""
      },
      边框粗细: {
        type: "slider",
        status: 1,
        range: [0, 10],
        value: item.borderWidth
      },
      数据条高度: {
        type: "slider",
        status: 1,
        range: [1, 30],
        value: item.barHeight || 3
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
      线条2: {
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
      最小值: {
        type: "input",
        inputType: "number",
        value: item.min
      },
      最大值: {
        type: "input",
        inputType: "number",
        value: item.max
      },
      步长值: {
        type: "input",
        inputType: "number",
        value: item.step
      },
      数据位置: {
        type: "select",
        label: [
          {
            label: "无",
            value: "none"
          },
          {
            label: "右",
            value: "row"
          },
          {
            label: "左",
            value: "row-reverse"
          },
          {
            label: "上",
            value: "column-reverse"
          },
          {
            label: "下",
            value: "column"
          }
        ],
        value: item.flexDirection || "none"
      },
      数据单位: {
        type: "input",
        value: item.unit
      },
      字体样式: {
        type: "fontStyle",
        value: [
          item.textSize + "px",
          translateFontFamily(item.textFont),
          item.textWeight,
          item.textColor || "#E53F3F"
        ]
      },
      线条1: {
        type: "line"
      },
      数据: {
        type: "dataTreeLinkage",
        params: [
          {
            title: "显示数据",
            value: item.highbar.bitShow.dev
          },
          {
            title: "发送数据",
            value: item.highbar.bitSend.dev,
            sameAbove: false
          }
        ]
      },
      sliderVal: item.value
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
