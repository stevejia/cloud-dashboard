import { translateFontFamily } from "@/component/translate.js";
export default function translateConfig(item) {
  let config = {
    white: {
      字体2: item.white.fontColor || "#fff",
      "背景颜色-关闭状态": item.white.backgroundColor || "#B2DDFF",
      边框颜色: item.white.borderColor || "rgba(0, 0, 0, 0)"
    },
    black: {
      字体2: item.black.fontColor || "#fff",
      "背景颜色-关闭状态": item.black.backgroundColor || "#B2DDFF",
      边框颜色: item.black.borderColor || "rgba(0, 0, 0, 0)"
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
      字体: {
        type: "fontThrees",
        value: [item.fontSize, translateFontFamily(item.fontFamily), ""]
      },
      背景开启: {
        type: "mulInput",
        title: "背景颜色-开启状态",
        value: [
          { name: "制冷", value: "#3573C1", inputType: "colorShow" },
          { name: "制热", value: "#F1921C", inputType: "colorShow" },
          { name: "通风", value: "#33A567", inputType: "colorShow" }
        ]
      },
      "背景颜色-关闭状态": {
        type: "color-select",
        value: ""
      },
      边框颜色: {
        type: "color-select",
        value: ""
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
      添加数据: {
        type: "explain"
      },
      "启停--响应": {
        type: "dataTree",
        value: item.dtsource.state[0].dev
      },
      启停响应值: {
        type: "mulInput",
        title: "响应值",
        value: [
          {
            name: "关",
            value: item.dtsource.state[0].value[0],
            inputType: "number"
          },
          {
            name: "开",
            value: item.dtsource.state[0].value[1],
            inputType: "number"
          }
        ]
      },
      "启停--控制": {
        type: "dataTree",
        value: item.dtsource.state[1].dev
      },
      启停控制值: {
        type: "mulInput",
        title: "控制值",
        value: [
          {
            name: "关",
            value: item.dtsource.state[1].value[0],
            inputType: "number"
          },
          {
            name: "开",
            value: item.dtsource.state[1].value[1],
            inputType: "number"
          }
        ]
      },
      线条1: {
        type: "line"
      },
      "温度--响应": {
        type: "dataTree",
        value: item.dtsource.temp[0].dev
      },
      线条2: {
        type: "line"
      },
      "模式--响应": {
        type: "dataTree",
        value: item.dtsource.model[0].dev
      },
      模式响应值: {
        type: "mulInput",
        title: "响应值",
        value: [
          {
            name: "制冷",
            value: item.dtsource.model[0].value[0],
            inputType: "number",
            iconClass: "iconcooling-black",
            color: "#3573C1"
          },
          {
            name: "制热",
            value: item.dtsource.model[0].value[1],
            inputType: "number",
            iconClass: "iconheating-black",
            color: "#F1921C"
          },
          {
            name: "通风",
            value: item.dtsource.model[0].value[2],
            inputType: "number",
            iconClass: "iconairness-black",
            color: "#33A567"
          }
        ]
      },
      线条3: {
        type: "line"
      },
      "风速--响应": {
        type: "dataTree",
        value: item.dtsource.winds[0].dev
      },
      风速响应值: {
        type: "mulInput",
        title: "响应值",
        value: [
          {
            name: "低风",
            value: item.dtsource.winds[0].value[0],
            inputType: "number",
            iconClass: "iconlow"
          },
          {
            name: "中风",
            value: item.dtsource.winds[0].value[1],
            inputType: "number",
            iconClass: "iconmid"
          },
          {
            name: "高风",
            value: item.dtsource.winds[0].value[2],
            inputType: "number",
            iconClass: "iconhigh"
          }
        ]
      },
      线条4: {
        type: "line"
      },
      temperature: item.temperature,
      state: item.state,
      model: item.model,
      winds: item.winds
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
