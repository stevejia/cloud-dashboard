import { translateFontFamily } from "@/component/translate.js";
export default function translateConfig(item) {
  let config = {
    white: {
      titleColor: item.black.option.titleColor || "#333",
      legColor: item.black.option.chartColor || "#333",
      backgroundColor: item.black.backgroundColor || "rgb(255, 255, 255)",
      disableColor: "#ccc",
      disEmpColor: "#ccc"
    },
    black: {
      titleColor: item.black.option.titleColor || "#fff",
      legColor: item.black.option.chartColor || "#B2DDFF",
      backgroundColor: item.black.backgroundColor || "rgba(0, 0, 0, 0)",
      disableColor: "#58555F",
      disEmpColor: "#58555F"
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
      标题位置: {
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
      说明文字: {
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
        value: `${item.option.legend.x}_${item.option.legend.y}`
      },
      线条2: {
        type: "line"
      },
      图表标题字体: {
        type: "fontThree",
        value: [
          item.option.title.textStyle.fontSize + "px",
          translateFontFamily(item.option.title.textStyle.fontFamily),
          item.option.title.textStyle.color
        ]
      },
      图表内容字体: {
        type: "fontThree",
        value: [
          item.option.legend.textStyle.fontSize + "px",
          translateFontFamily(item.option.legend.textStyle.fontFamily),
          item.option.legend.textStyle.color
        ]
      },
      环内字体: {
        type: "fontAbleSet",
        typeParam: { fontSize: true, fontFamily: true },
        value: [
          item.option.series[0].data[0].label.normal.rich.a.fontSize + "px",
          translateFontFamily(
            item.option.series[0].data[0].label.normal.rich.a.fontFamily
          )
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
        type: "pieNestedSeries",
        value: getSeriesData(),
        dataType: item.dataType,
        white: item.white.option.dataColor,
        black: item.black.option.dataColor
      }
    }
  };
  function getSeriesData() {
    let res = [];
    item.dtsource.forEach(i => {
      let data = {
        type: "pie",
        radius: ["30%", "40%"],
        hoverAnimation: false,
        clockwise: false,
        avoidLabelOverlap: true,
        labelLine: {
          show: false
        },
        totalAmount: i.total,
        totalPointId: i.dev[0],
        pointId: i.dev[1],
        valueUnit: i.unit,
        data: [
          {
            value: i.value,
            name: i.label,
            label: {
              show: true,
              position: "center",
              padding: [40, 0, 0, 0]
            }
          },
          {
            value: 0,
            name: "",
            emphasis: {
              itemStyle: {
                color: "#58555F"
              }
            },
            itemStyle: {
              color: "#58555F"
            }
          }
        ]
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
