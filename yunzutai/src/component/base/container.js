import { translateFontFamily } from "./../translate.js";
export default function translateConfig(item) {
  console.log(item);
  let config = {
    white: {
      background: item.white.containerCss.backgroundColor || "#FFFFFF", //无状态背景颜色
      prompBackground:
        item.white.promptCss.backgroundColor || "#rgba(53,115,193,0.2)", //悬浮状态背景颜色
      dialogBackground: item.white.DialogCss.backgroundColor || "#FFFFFF", //弹出状态背景颜色
      boxShadom: item.white.borderShadow || "rgba(8,114,184,0)", //发光色
      titleColor: item.white.titleColor || "#455A64", //标题
      titleBottomLine: item.white.titleBorderColor || "#E7E7E7", //标题线色
      tabBackground: item.white.tabcontainerCss.backgroundColor || "#FFFFFF", //无状态标签背景
      tabPrompBackground:
        item.white.tabpromptCss.backgroundColor || "#rgba(53,115,193,0.5)", //悬浮状态标签背景
      tabDialogBackground: item.white.tabDialogCss.backgroundColor || "#FFFFFF", //弹出状态标签背景
      tabColor: item.white.defColor || "#6d849a", //标签颜色
      selColor: item.white.selColor || "#0064FF", //选中颜色
      tabBorderBottom: "#ddd",
      lineColor: "rgba(63, 66, 75, 1)"
    },
    black: {
      background: item.black.containerCss.backgroundColor || "#1c2163", //无状态背景颜色
      prompBackground:
        item.black.promptCss.backgroundColor || "rgba(53, 115, 193, 0.25)", //悬浮状态背景颜色
      dialogBackground:
        item.black.DialogCss.backgroundColor || "rgb(28, 33, 99)", //弹出状态背景颜色
      boxShadom: item.black.borderShadow || "#0872B8", //发光色
      titleColor: item.black.titleColor || "#FFFFFF", //标题
      titleBottomLine: item.black.titleBorderColor || "#303A91", //标题线色

      tabBackground: item.black.tabcontainerCss.backgroundColor || "#2F3138", //无状态标签背景
      tabPrompBackground:
        item.black.tabpromptCss.backgroundColor || "rgba(53,115,193,0.5)", //悬浮状态标签背景
      tabDialogBackground: item.black.tabDialogCss.backgroundColor || "#2F3138", //弹出状态标签背景
      tabColor: item.black.defColor || "#6d849a", //标签颜色
      selColor: item.black.selColor || "#0064FF", //选中颜色

      tabBorderBottom: "rgba(63, 66, 75, 1)",
      lineColor: "rgba(63, 66, 75, 1)"
    }
  };
  let compConfig = {
    compconfigs: item.compconfigs,
    white: config.white,
    black: config.black,
    baisicConfig: {
      名称: {
        type: "input",
        value: item.label
      },
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
      容器: {
        hide: !item.gShow,
        type: "container",
        blockContent: item.lockChd,
        useMul: item.moreable,
        promptDialog: item.isPrompt,
        dialog: item.isDialog,
        dialogShadow: item.isShadow,
        useTitle: item.showTitle,
        title: item.title,
        titleAlign: item.titlePosition,
        titleFont: [
          item.titleSize + "px",
          translateFontFamily(item.titleFont),
          config[item.theme].titleColor
        ],
        titleBottomLine: config[item.theme].titleBottomLine,
        background: config[item.theme].backgroundColor,
        boxShadom: config[item.theme].boxShadom,
        borderRadius: item.borderRadius,
        opacity: item.opacity * 100,
        tabHeight: item.tabHeight,
        tabBackground: "",
        tabFont: [
          item.defSize + "px",
          translateFontFamily(item.defFamily),
          config[item.theme].tabColor,
          config[item.theme].selColor
        ],
        oldCurrentTabIndex: 0,
        currentTabIndex: 0,
        tabList: item.tabList.map(item => {
          return {
            label: item.label,
            value: item.id
          };
        })
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
