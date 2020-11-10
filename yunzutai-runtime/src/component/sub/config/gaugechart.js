import { translateFontFamily } from "@/component/translate.js";
export default function translateConfig(item) {
  let config = {
    white: {
      backgroundColor: item.white.backgroundColor || "rgb(255, 255, 255)",
      titleColor: item.white.option.titleColor || "#333",
      numColor: item.white.option.percentColor || "#333"
    },
    black: {
      backgroundColor: item.black.backgroundColor || "rgba(0, 0, 0, 0)",
      titleColor: item.black.option.titleColor || "#fff",
      numColor: item.black.option.percentColor || "#34A8C2"
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
      标题: {
        type: "input",
        value: item.option.title.text
      },
      最小刻度值: {
        type: "input",
        inputType: "number",
        value: item.option.series.min
      },
      最大刻度值: {
        type: "input",
        inputType: "number",
        value: item.option.series.max
      },
      单位: {
        type: "input",
        value: item.option.series.data[0].unit
      },
      刻度段数: {
        type: "input",
        inputType: "number",
        value: item.option.series.splitNumber
      },
      线条2: {
        type: "line"
      },
      表盘名称字体: {
        type: "fontThree",
        value: [
          item.option.title.textStyle.fontSize + "px",
          translateFontFamily(item.option.title.textStyle.fontFamily),
          item.option.title.textStyle.color
        ]
      },
      表盘数值字体: {
        type: "fontThree",
        value: [
          item.option.series.detail.textStyle.fontSize + "px",
          translateFontFamily(item.option.series.detail.textStyle.fontFamily),
          item.option.series.detail.textStyle.color
        ]
      },
      背景颜色: {
        type: "color-select",
        value: ""
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
    },
    highConfig: {
      添加响应: {
        type: "explain"
      },
      数据添加: {
        type: "seriesData",
        chartType: "gauge",
        value: [
          {
            name: item.option.series.name,
            value: item.option.series.data[0].value,
            pointId: item.dtsource[0].dev
          }
        ],
        white: [item.white.option.pointerColor],
        black: [item.black.option.pointerColor]
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
