import { translateFontFamily } from "@/component/translate.js";
export default function translateConfig(item) {
  let config = {
    white: {
      "数据字体/颜色/大小2": item.white.dataColor || "#455A64",
      "字体/颜色/大小2": item.white.textColor || "#99ABB4",
      上升颜色: item.white.riseColor || "#E73F3E",
      平衡颜色: item.white.fairColor || "#F1921C",
      下降颜色: item.white.declineColor || "#3573C1",
      背景颜色: item.white.backgroundColor || "#fff",
      边框颜色: item.white.borderColor || "#ddd"
    },
    black: {
      "数据字体/颜色/大小2": item.black.dataColor || "#B2DDFF",
      "字体/颜色/大小2": item.black.textColor || "#B2DDFF",
      上升颜色: item.black.riseColor || "#E73F3E",
      平衡颜色: item.black.fairColor || "#F1921C",
      下降颜色: item.black.declineColor || "#3573C1",
      背景颜色: item.black.backgroundColor || "#24252A",
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
      时间类型选择: {
        type: "select",
        label: [
          {
            label: "小时",
            value: "小时"
          },
          {
            label: "日",
            value: "日"
          },
          {
            label: "周",
            value: "周"
          },
          {
            label: "月",
            value: "月"
          },
          {
            label: "季度",
            value: "季度"
          },
          {
            label: "年",
            value: "年"
          }
        ],
        value: item.statisticsList.time
      },
      线条2: {
        type: "line"
      },
      图标样式选择: {
        type: "select",
        label: [
          {
            label: "电",
            value: "elec"
          },
          {
            label: "气",
            value: "air"
          },
          {
            label: "水",
            value: "water"
          },
          {
            label: "热",
            value: "hot"
          },
          {
            label: "经济",
            value: "econ"
          }
        ],
        value: getImgType(item.statisticsList.label)
      },
      线条3: {
        type: "line"
      },
      "字体/颜色/大小": {
        type: "fontThrees",
        value: [item.textFontSize, translateFontFamily(item.textFontFamily), ""]
      },
      "数据字体/颜色/大小": {
        type: "fontThrees",
        value: [item.dataFontSize, translateFontFamily(item.dataFontFamily), ""]
      },
      "上升(下降)字体/字体大小": {
        type: "fontAbleSet",
        typeParam: { fontSize: "input", fontFamily: true },
        value: [
          item.percentFontSize,
          translateFontFamily(item.percentFontFamily)
        ]
      },
      上升颜色: {
        type: "color-select",
        value: ""
      },
      平衡颜色: {
        type: "color-select",
        value: ""
      },
      下降颜色: {
        type: "color-select",
        value: ""
      },
      背景颜色: {
        type: "color-select",
        value: "#24252A"
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
      线条4: {
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
      数据关联: {
        type: "explain"
      },
      绑定位号: {
        type: "dataTree",
        value: item.dev
      },
      statisticInfo: {
        data: item.statisticsList.data,
        percentage: item.statisticsList.percentage
      }
    }
  };
  function getImgType(name) {
    const obj = {
      "耗电(kWh)": "elec",
      "耗气(m³)": "air",
      "耗水(t)": "water",
      "耗热(kWh)": "hot",
      "花费(￥)": "econ"
    };
    return obj[name];
  }
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
