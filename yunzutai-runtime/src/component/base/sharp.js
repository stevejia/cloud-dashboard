export default function translateConfig(item) {
  let config = {
    white: {
      borderColor: item.white.color || "#000000"
    },
    black: {
      borderColor: item.black.color || "#FFFFFF"
    }
  };
  let left = item.showLeft ? "左箭头," : "";
  let right = item.showLeft ? "右箭头," : "";
  let border = item.borderStyle === "dashed" ? "实线/虚线" : "";
  let compConfig = {
    white: config.white,
    black: config.black,
    baisicConfig: {
      样式: {
        type: "mul-checkbox",
        label: ["左箭头", "右箭头", "实线/虚线"],
        value: (left + right + border).split(",")
      },
      颜色: {
        type: "color-select",
        value: config[item.theme].borderColor
      },
      线条粗细: {
        type: "slider",
        status: 1,
        range: [1, 10],
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
