import { translateFontFamily } from "@/component/translate.js";
export default function translateConfig(item) {
  let config = {
    white: {
      color: item.black.option.textColor || "#333",
      legColor: "#333",
      backgroundColor: item.black.backgroundColor || "rgb(255, 255, 255)"
    },
    black: {
      color: item.black.option.textColor || "#fff",
      legColor: "#B2DDFF",
      backgroundColor: item.black.backgroundColor || "rgba(0, 0, 0, 0)"
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
      名称: {
        type: "input",
        value: item.option.title.text
      },
      显示位置: {
        type: "select",
        label: [
          {
            label: "上",
            value: "center_top"
          },
          {
            label: "下",
            value: "center_bottom"
          },
          {
            label: "左",
            value: "left_middle"
          },
          {
            label: "右",
            value: "right_middle"
          },
          {
            label: "左上",
            value: "left_top"
          },
          {
            label: "右上",
            value: "right_top"
          },
          {
            label: "左下",
            value: "left_bottom"
          },
          {
            label: "右下",
            value: "right_bottom"
          }
        ],
        value: `${item.option.title.x}_${item.option.title.y}`
      },
      线条2: {
        type: "line"
      },
      字体: {
        type: "fontThree",
        value: [
          item.option.title.textStyle.fontSize + "px",
          translateFontFamily(item.option.title.textStyle.fontFamily),
          item.option.title.textStyle.color
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
      },
      线条4: {
        type: "line"
      },
      默认时间选择: {
        type: "select",
        label: [
          {
            label: "实时",
            value: "center_top"
          },
          {
            label: "当日",
            value: "center_bottom"
          }
        ],
        value: "center_top"
      }
    },
    highConfig: {
      添加响应: {
        type: "explain"
      },
      数据添加: {
        type: "seriesData",
        chartType: "pie",
        value: getSeriesData(),
        white: item.white.option.dataColor,
        black: item.black.option.dataColor
      }
    }
  };
  function getSeriesData() {
    let res = [];
    item.dtsource.forEach((i, index) => {
      let data = {
        name: i.label,
        value: item.option.series[0].data[index].value,
        pointId: i.dev
      };
      res.push(data);
    });
    return res;
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
