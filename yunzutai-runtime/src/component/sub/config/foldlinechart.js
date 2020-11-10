import { translateFontFamily } from "../../translate.js";
export default function translateConfig(item) {
  // let dateObj = selectDate(item.dateType, item.time);

  // console.log(dateObj);
  let barDatas = chartSeries(
    item.dtsource,
    item.option.series,
    item.white.option.dataColor,
    item.black.option.dataColor
  );
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
      添加响应: {
        type: "explain"
      },
      数据源: {
        type: "composeSeriesData",
        chartType: "line",
        limtLength: 16,
        value: barDatas,
        category: "foldlinechart"
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
          item.option.legend.textStyle.fontSize + "px",
          translateFontFamily(item.option.legend.textStyle.fontFamily),
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
      // 线条5: {
      //   type: "line"
      // },
      // 日期类型: {
      //   type: "dateType",
      //   values: dateObj.itemsInArr,
      //   time: [item.starttime, item.endtime],
      //   label: ["小时", "日", "周", "月", "季度", "年"],
      //   value: dateObj.items
      // }
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
// 输出时间日期
// function selectDate(dateType, time) {
//   let arr = ["小时", "日", "周", "月", "季度", "年"];
//   let times = ["h", "d", "W", "M", "q", "y"];
//   let itemsInArr = (a1, a2) => {
//     let m = [];
//     for (let i = 0; i < a2.length; i++) {
//       m[a2[i]] = a2[i];
//     }
//     let existsList = [];
//     for (let i = 0; i < a1.length; i++) {
//       existsList.push(typeof m[a1[i]] != "undefined");
//     }
//     return existsList;
//   };
//   let items = "h";
//   for (let i = 0; i < arr.length; i++) {
//     if (time == arr[i]) {
//       items = times[i];
//       break;
//     }
//   }
//   let obj = {
//     items: items,
//     itemsInArr: itemsInArr(arr, dateType)
//   };
//   return obj;
// }
// 输入数据格式
function chartSeries(dtsource, series, whites, blacks) {
  let barDatas = [];
  for (let i = 0; i < dtsource.length; i++) {
    let obj = {
      name: series[i].name,
      status: 0,
      data: series[i].data,
      itemStyle: series[i].itemStyle,
      type: series[i].type,
      smooth: series[i].smooth,
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
      white: whites[i],
      black: blacks[i],
      pointId: dtsource[i].dev,
      devValue: dtsource[i].devType
    };
    barDatas.push(obj);
  }
  return barDatas;
}
