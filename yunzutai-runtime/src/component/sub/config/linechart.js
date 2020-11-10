import { translateFontFamily } from "../../translate.js";
export default function translateConfig(item) {
  console.log(11, item);
  let barDatas = chartSeries(
    item.dtsource,
    item.option.series,
    item.white.option.dataColor,
    item.black.option.dataColor
  );
  let config = {
    white: {
      标题字体2: item.white.option.titleColor || "#000000",
      背景颜色: item.white.backgroundColor || "#fff",
      图表内容字体2: item.white.option.chartColor || "#000000"
    },
    black: {
      标题字体2: item.black.option.titleColor || "#B2DDFF",
      背景颜色: item.black.backgroundColor || "",
      图表内容字体2: item.black.option.chartColor || "#89a7c2"
    }
  };
  let compConfig = {
    barSeries: barDatas,
    white: config.white,
    black: config.black,
    highConfig: {
      添加响应: {
        type: "explain"
      },
      数据源: {
        type: "composeSeriesData",
        collectId: true,
        chartType: "line",
        limtLength: 16,
        value: barDatas,
        category: "linechart"
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
      实时数据最大个数: {
        type: "input",
        value: item.maxNum
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
            { title: "最小值", value: item.option.yAxis.min },
            { title: "最大值", value: item.option.yAxis.max },
            {
              title: "单位(柱状)",
              value: item.option.yAxis.name.match(/\(([^)]*)\)/)[1]
            }
          ]
        ]
      },
      线条3: {
        type: "line"
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
          item.option.legend.textStyle.fontSize + "px",
          translateFontFamily(item.option.legend.textStyle.fontFamily),
          ""
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
function chartSeries(dtsource, series, whites, blacks) {
  let barDatas = [];
  for (let i = 0; i < dtsource.length; i++) {
    let obj = {
      name: series[i].name,
      type: series[i].type,
      data: series[i].data,
      itemStyle: series[i].itemStyle,
      status: 0,
      smooth: series[i].smooth,
      white: whites[i],
      black: blacks[i],
      pointId: dtsource[i].dev,
      devValue: dtsource[i].devType
    };
    barDatas.push(obj);
  }
  return barDatas;
}
