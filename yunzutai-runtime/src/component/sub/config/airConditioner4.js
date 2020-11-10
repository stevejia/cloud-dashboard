import { translateFontFamily } from "@/component/translate.js";
export default function translateConfig(item) {
  let config = {
    white: {
      字体2: item.black.fontColor || "#455A64",
      "背景颜色-1": item.black.backgroundColor || "#fff",
      "背景颜色-2": item.black.backgroundColor2 || "#eee",
      边框颜色: item.black.borderColor || "rgba(0, 0, 0, 0)"
    },
    black: {
      字体2: item.black.fontColor || "#fff",
      "背景颜色-1": item.black.backgroundColor || "#18191D",
      "背景颜色-2": item.black.backgroundColor2 || "#24252A",
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
      标题: {
        type: "input",
        value: item.title
      },
      线条2: {
        type: "line"
      },
      字体: {
        type: "fontThrees",
        value: [item.fontSize, translateFontFamily(item.fontFamily), ""]
      },
      "背景颜色-1": {
        type: "color-select",
        value: ""
      },
      "背景颜色-2": {
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
      "当前温度--响应": {
        type: "dataTree",
        value: item.dtsource.curTemp[0].dev
      },
      线条2: {
        type: "line"
      },
      "设定温度--响应": {
        type: "dataTree",
        value: item.dtsource.setTemp[0].dev
      },
      "设定温度--控制": {
        type: "dataTree",
        value: item.dtsource.setTemp[1].dev
      },
      线条3: {
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
            iconClass: "iconcooling-black"
          },
          {
            name: "制热",
            value: item.dtsource.model[0].value[1],
            inputType: "number",
            iconClass: "iconheating-black"
          },
          {
            name: "通风",
            value: item.dtsource.model[0].value[2],
            inputType: "number",
            iconClass: "iconairness-black"
          },
          {
            name: "除湿",
            value: item.dtsource.model[0].value[3],
            inputType: "number",
            iconClass: "iconwet-black"
          }
        ]
      },
      "模式--控制": {
        type: "dataTree",
        value: item.dtsource.model[1].dev
      },
      模式控制值: {
        type: "mulInput",
        title: "控制值",
        value: [
          {
            name: "制冷",
            value: item.dtsource.model[1].value[0],
            inputType: "number"
          },
          {
            name: "制热",
            value: item.dtsource.model[1].value[1],
            inputType: "number"
          },
          {
            name: "通风",
            value: item.dtsource.model[1].value[2],
            inputType: "number"
          },
          {
            name: "除湿",
            value: item.dtsource.model[1].value[3],
            inputType: "number"
          }
        ]
      },
      线条4: {
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
            name: "自动",
            value: item.dtsource.winds[0].value[0],
            inputType: "number",
            iconClass: "iconauto-black"
          },
          {
            name: "低风",
            value: item.dtsource.winds[0].value[1],
            inputType: "number",
            iconClass: "iconlow-black"
          },
          {
            name: "中风",
            value: item.dtsource.winds[0].value[2],
            inputType: "number",
            iconClass: "iconmid-black"
          },
          {
            name: "高风",
            value: item.dtsource.winds[0].value[3],
            inputType: "number",
            iconClass: "iconhigh-black"
          }
        ]
      },
      "风速--控制": {
        type: "dataTree",
        value: item.dtsource.winds[1].dev
      },
      风速控制值: {
        type: "mulInput",
        title: "控制值",
        value: [
          {
            name: "自动",
            value: item.dtsource.winds[1].value[0],
            inputType: "number"
          },
          {
            name: "低风",
            value: item.dtsource.winds[1].value[1],
            inputType: "number"
          },
          {
            name: "中风",
            value: item.dtsource.winds[1].value[2],
            inputType: "number"
          },
          {
            name: "高风",
            value: item.dtsource.winds[1].value[3],
            inputType: "number"
          }
        ]
      },
      线条5: {
        type: "line"
      },
      curTemp: item.curTemp,
      setTemp: item.setTemp,
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
