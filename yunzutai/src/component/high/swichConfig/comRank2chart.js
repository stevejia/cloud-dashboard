import { translateFontFamily } from "../../translate.js";
export default function translateConfig(item) {
  console.log(11, item);
  let barDatas = chartSeries(item.dtsource);
  let config = {
    white: {
      标题字体2: item.white.option.titleColor || "#000000",
      查询条件字体2: item.white.timeColor || "#41464d",
      背景颜色: item.white.backgroundColor || "#fff",
      按钮颜色: item.white.buttonbc || "#3573C1",
      图表内容字体2: item.white.option.chartColor || "#000000"
    },
    black: {
      标题字体2: item.black.option.titleColor || "#B2DDFF",
      查询条件字体2: item.black.timeColor || "#b2ddff",
      背景颜色: item.black.backgroundColor || "",
      按钮颜色: item.black.buttonbc || "rgb(53, 115, 193)",
      图表内容字体2: item.black.option.chartColor || "#89a7c2"
    }
  };
  let compConfig = {
    barSeries: barDatas,
    white: config.white,
    black: config.black,
    highConfig: {
      柱状图: {
        type: "explain"
      },
      数据源: {
        type: "composeSeriesData",
        chartType: "bar",
        limtLength: 4,
        value: barDatas
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
      线条1: {
        type: "line"
      },
      标题: {
        type: "input",
        value: item.option.title.text
      },
      线条2: {
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
          item.option.title.textStyle.fontSize + "px",
          translateFontFamily(item.option.title.textStyle.fontFamily),
          ""
        ]
      },
      图表内容字体: {
        type: "fontThree",
        value: [
          item.option.xAxis.axisLabel.fontSize + "px",
          translateFontFamily(item.option.xAxis.axisLabel.fontFamily),
          ""
        ]
      },
      背景颜色: {
        type: "color-select",
        value: ""
      },
      按钮颜色: {
        type: "color-select",
        value: "rgb(53, 115, 193)"
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

// 输入数据格式
function chartSeries(dtsource) {
  let barDatas = [];
  for (let i = 0; i < dtsource.length; i++) {
    let obj = {
      name: dtsource[i].name,
      status: 0,
      data: dtsource[i].value,
      itemStyle: null,
      devType: [
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
      pointId: dtsource[i].dev,
      devValue: dtsource[i].devType
    };
    barDatas.push(obj);
  }
  return barDatas;
}
