export default function translateConfig(item) {
  let config = {
    white: {
      标尺颜色: item.white.option.rodcolor || "#455A64",
      填充颜色: item.white.option.incolor || "#33A566",
      背景颜色: item.white.option.barBg || "#DADCDF",
      边框颜色: item.white.option.borderColor || "rgba(255, 255, 255, 0)"
    },
    black: {
      标尺颜色: item.black.option.rodcolor || "#B2DDFF",
      填充颜色: item.black.option.incolor || "#3573C1",
      背景颜色: item.black.option.barBg || "#24252A",
      边框颜色: item.black.option.borderColor || "rgba(255, 255, 255, 0)"
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
      多表单: {
        type: "mulInput",
        value: [
          { name: "最小值", inputType: "number", value: item.config.min },
          { name: "最大值", inputType: "number", value: item.config.max },
          { name: "单位", value: item.option.yAxis.name }
        ]
      },
      线条2: {
        type: "line"
      },
      边框颜色: {
        type: "color-select",
        value: ""
      },
      背景颜色: {
        type: "color-select",
        value: ""
      },
      填充颜色: {
        type: "color-select",
        value: ""
      },
      标尺颜色: {
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
      显示数据: {
        type: "dataTree",
        value: item.dtsource[0].dev
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
