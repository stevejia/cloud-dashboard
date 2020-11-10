import { translateFontFamily } from "../../translate.js";
export default function translateConfig(item) {
  console.log(item);
  let dateObj = selectDate(item.queryIntervalList, item.queryInterval);
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
      按钮颜色: item.black.buttonColor || "rgb(53, 115, 193)",
      图表内容字体2: item.black.option.chartColor || "#89a7c2"
    }
  };
  let compConfig = {
    barSeries: [
      {
        name: item.option[0].series[0].name,
        type: item.option[0].series[0].type,
        black: "#3573c1",
        white: "#1e88e5",
        itemStyle: item.option[0].series[0].itemStyle,
        data: item.option[0].series[0].data
      },
      {
        name: item.option[0].series[1].name,
        type: item.option[0].series[1].type,
        black: "#e53f3f",
        white: "#7460ee",
        itemStyle: item.option[0].series[1].itemStyle,
        data: item.option[0].series[1].data
      }
    ],
    lineSeries: [
      {
        name: item.option[1].series[0].name,
        type: item.option[1].series[0].type,
        black: "#3573c1",
        white: "#1e88e5",
        itemStyle: item.option[1].series[0].itemStyle,
        data: item.option[1].series[0].data
      },
      {
        name: item.option[1].series[1].name,
        type: item.option[1].series[1].type,
        black: "#e53f3f",
        white: "#7460ee",
        itemStyle: item.option[1].series[1].itemStyle,
        data: item.option[1].series[1].data
      }
    ],
    white: config.white,
    black: config.black,
    highConfig: {
      添加响应: {
        type: "explain"
      },
      数据源: {
        type: "composeSeriesData",
        chartType: "bar",
        limtLength: 4,
        value: [
          {
            name: "柱状名称",
            value: 100,
            pointId: item.dtsource[0].dev,
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
            devValue: item.dtsource[0].devType,
            type: 1
          }
        ]
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
      坐标设置: {
        type: "coordinate",
        value: item.coordinate == "fixed" ? 0 : 1,
        label: [
          { label: "固定范围", value: 0 },
          { label: "自动范围", value: 1 }
        ],
        options: [
          [
            { title: "最小值", value: item.option[0].yAxis.min },
            { title: "最大值", value: item.option[0].yAxis.max },
            {
              title: "电量",
              value: item.option[0].yAxis.name.match(/\(([^)]*)\)/)[1]
            }
          ],
          [
            { title: "最小值", value: item.option[1].yAxis.min },
            { title: "最大值", value: item.option[1].yAxis.max },
            {
              title: "变化率",
              value: item.option[1].yAxis.name.match(/\(([^)]*)\)/)[1]
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
          translateFontFamily(item.option[0].title.textStyle.fontFamily),
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
      },
      线条5: {
        type: "line"
      },
      查询间隔: {
        type: "dateType",
        values: dateObj.itemsInArr,
        time: [item.starttime, item.endtime],
        label: ["小时", "日", "周", "月", "季度", "年"],
        value: dateObj.items,
        name: "查询间隔"
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
// 输出时间日期
function selectDate(dateType, time) {
  let arr = ["日", "周", "月", "季度", "年"];
  let times = ["d", "W", "M", "q", "y"];
  let itemsInArr = (a1, a2) => {
    let m = [];
    for (let i = 0; i < a2.length; i++) {
      m[a2[i]] = a2[i];
    }
    let existsList = [];
    for (let i = 0; i < a1.length; i++) {
      existsList.push(typeof m[a1[i]] != "undefined");
    }
    return existsList;
  };
  let items = "h";
  for (let i = 0; i < arr.length; i++) {
    if (time == arr[i]) {
      items = times[i];
      break;
    }
  }
  let obj = {
    items: items,
    itemsInArr: itemsInArr(arr, dateType)
  };
  return obj;
}
