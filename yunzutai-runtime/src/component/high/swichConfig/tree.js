import { translateFontFamily } from "./../../translate.js";
function tranlateTreeData(data) {
  return data.map(item => {
    if (item.children) {
      item.children = tranlateTreeData(item.children);
      return {
        children: item.children,
        expanded: item.toggle,
        id: item.id,
        linkData: { pointIds: [], statisticsType: "" },
        name: item.label,
        selected: item.checked,
        type: "floder"
      };
    }
    return {
      children: [],
      expanded: item.toggle,
      id: item.id,
      linkData: { pointIds: item.data.point, statisticsType: item.data.type },
      name: item.label,
      selected: item.checked,
      type: item.children ? "floder" : "file"
    };
  });
}
export default function translateConfig(item) {
  let config = {
    white: {
      backgroundColor: item.white.bgColor || "#FFFFFF",
      color: item.white.textColor || "rgb(69, 90, 100)",
      borderColor: item.white.borderColor || "rgb(69, 90, 100)",
      selectColor: item.white.checkColor || "rgb(69, 90, 100)"
    },
    black: {
      backgroundColor: item.black.bgColor || "rgb(24, 25, 29)",
      color: item.black.textColor || "rgb(178, 221, 255)",
      borderColor: item.black.borderColor || "#B2DDFF",
      selectColor: item.black.checkColor || "#B2DDFF"
    }
  };
  let compConfig = {
    linkPages: item.linkPages,
    treeData: tranlateTreeData(item.treeList),
    white: config.white,
    black: config.black,
    highConfig: {
      树形图: {
        type: "treeConfig",
        currentItem: "",
        pointIds: [],
        statisticsType: ""
      }
    },
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
      名称: {
        type: "input",
        value: item.label
      },
      字体: {
        type: "fontSelect",
        value: [
          item.fontSize + "px",
          translateFontFamily(item.fontFamily),
          "",
          ""
        ]
      },
      背景颜色: {
        type: "color-select",
        value: ""
      },
      边框颜色: {
        type: "color-select",
        value: ""
      },
      边框样式: {
        type: "select",
        label: [
          { label: "实体边框", value: "solid" },
          { label: "虚线边框", value: "dashed" }
        ],
        value: item.borderStyle
      },
      边框粗细: {
        type: "slider",
        status: 1,
        range: [0, 10],
        value: item.borderSize
      },
      显示度: {
        type: "slider",
        status: 1,
        range: [0, 100],
        value: item.opacity * 100
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
