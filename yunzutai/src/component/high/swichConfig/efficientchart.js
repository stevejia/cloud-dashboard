import { translateFontFamily } from "../../translate.js";
export default function translateConfig(item) {
  console.log(item);
  let transforms = transform(item.subData[0].transform);
  let config = {
    white: {
      标题字体2: item.white.option.titleColor || "#000000",
      查询条件字体2: item.white.timeColor || "#41464d",
      背景颜色: item.white.backgroundColor || "#fff",
      按钮颜色: item.white.buttonColor || "#3573C1",
      图表内容字体2: item.white.option.chartColor || "#000000",
      数据字体2: "#3573C1",
      描述字体2: "#333333",
      energyColor: "#000000",
      energyColorNumber: "#428bca"
    },
    black: {
      标题字体2: item.black.option.titleColor || "#B2DDFF",
      查询条件字体2: item.black.timeColor || "#b2ddff",
      背景颜色: item.black.backgroundColor || "",
      按钮颜色: item.black.buttonColor || "rgb(53, 115, 193)",
      图表内容字体2: item.black.option.chartColor || "#89a7c2",
      数据字体2: item.black.dataFontColor || "#ffffff",
      描述字体2: item.black.labelFontColor || "#b2ddff",
      energyColor: "#b2ddff",
      energyColorNumber: "#ffffff"
    }
  };
  let compConfig = {
    subData: item.subData,
    white: config.white,
    black: config.black,
    timeType: item.timeType,
    totalData: item.totalData,
    highConfig: {
      添加数据: {
        type: "explain"
      },
      基准耗能曲线: {
        type: "dataTree",
        value: item.dtsource[0].datum
      },
      实际耗能曲线: {
        type: "dataTree",
        value: item.dtsource[0].dev
      },
      线条0: {
        type: "line"
      },
      数据类型: {
        type: "select",
        label: [
          {
            label: "耗能统计",
            value: 1
          },
          {
            label: "供能统计",
            value: 2
          },
          {
            label: "实时值",
            value: 3
          },
          {
            label: "平均值",
            value: 4
          },
          {
            label: "最大值",
            value: 5
          },
          {
            label: "最小值",
            value: 6
          }
        ],
        value: item.dtsource[0].devType
      },
      数据关联: {
        type: "explain"
      },
      树形图: {
        type: "dependtree",
        value: item.treeId
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
      线条0: {
        type: "line"
      },
      显示位置: {
        type: "select",
        label: [
          {
            label: "图表在下",
            value: 0
          },
          {
            label: "图表在上",
            value: 1
          }
        ],
        value: item.flexDirection == "column" ? 0 : 1
      },
      线条1: {
        type: "line"
      },
      图表标题: {
        type: "input",
        value: item.option[0].title.text
      },
      线条2: {
        type: "line"
      },
      坐标设置: {
        type: "coordinate",
        value: item.coordinate == "fixed" ? 0 : 1,
        label: [
          { label: "固定范围", value: 0 },
          { label: "自动范围", value: 1 }
        ],
        options: [
          [
            { title: "最小值", value: item.option[0].yAxis[0].min },
            { title: "最大值", value: item.option[0].yAxis[0].max },
            {
              title: "单位(柱状)",
              value: item.option[0].yAxis[0].name.match(/\(([^)]*)\)/)[1]
            }
          ],
          [
            { title: "最小值", value: item.option[0].yAxis[1].min },
            { title: "最大值", value: item.option[0].yAxis[1].max },
            {
              title: "单位(折线)",
              value: item.option[0].yAxis[1].name.match(/\(([^)]*)\)/)[1]
            }
          ]
        ]
      },
      线条3: {
        type: "line"
      },
      查询条件字体: {
        type: "fontThree",
        value: [
          item.timeFontSize + "px",
          translateFontFamily(item.timeFamily),
          ""
        ]
      },
      标题字体: {
        type: "fontThree",
        value: [
          item.option[0].title.textStyle.fontSize + "px",
          item.option[0].title.textStyle.fontFamily,
          ""
        ]
      },
      图表内容字体: {
        type: "fontThree",
        value: [
          item.option[0].legend.textStyle.fontSize + "px",
          translateFontFamily(item.option[0].legend.textStyle.fontFamily),
          ""
        ]
      },
      数据字体: {
        type: "fontThree",
        value: [
          item.dataFontSize + "px",
          translateFontFamily(item.dataFontFamily),
          ""
        ]
      },
      描述字体: {
        type: "fontThree",
        value: [
          item.labelFontSize + "px",
          translateFontFamily(item.labelFontFamily),
          ""
        ]
      },
      背景颜色: {
        type: "color-select",
        value: ""
      },
      按钮颜色: {
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
      线条4: {
        type: "line"
      },
      旋转角度: {
        type: "slider",
        status: 1,
        range: [0, 360],
        value: item.gRotate
      },
      线条5: {
        type: "line"
      },
      能量转换类型: {
        type: "energy",
        value: transforms,
        label: ["转二氧化碳", "转标煤", "转人民币", "转树"]
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
function transform(transform) {
  let arr = [];
  for (let index = 0; index < transform.length; index++) {
    arr.push(transform[index].label);
  }
  return arr;
}
