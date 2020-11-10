function changeEchartsTheme(theme, config) {
  var arr = config.value;
  for (let i = 0; i < arr.length; i++) {
    arr[i].itemStyle.normal.color = arr[i][theme];
  }
}
function changeCompareThem(theme, arr) {
  for (let i = 0; i < arr.length; i++) {
    arr[i].itemStyle.normal.color = arr[i][theme];
  }
}
// 柱状折线图
function getChartSeries(item, type, index = 0) {
  let targetData;
  let barData = [
    14 + index * 5,
    15 + index * 5,
    18 + index * 5,
    16.4 + index * 5,
    17 + index * 5,
    23.2 + index * 5,
    25.6 + index * 5,
    32.6 + index * 5,
    20.0 + index * 5,
    76.7 + index * 5,
    135.6 + index * 5,
    162.2 + index * 5
  ];
  let lineData = [
    2 + index * 2,
    3.2 + index * 2,
    3.8 + index * 2,
    4.5 + index * 2,
    6.3 + index * 2,
    10.2 + index * 2,
    12.3 + index * 2,
    15.2 + index * 2,
    15.1 + index * 2,
    16.5 + index * 2,
    17 + index * 2,
    18 + index * 2
  ];
  let yAxisIndex = null;
  if (type === "bar") {
    targetData = barData;
    yAxisIndex = null;
  } else {
    targetData = lineData;
    yAxisIndex = 1;
  }
  return {
    white: item.white,
    black: item.black,
    name: item.name,
    type: type,
    data: targetData,
    itemStyle: {
      normal: {
        color: item.itemStyle.normal.color
      }
    },
    yAxisIndex: yAxisIndex
  };
}
//当前耗能图
function getCurrentchart(item, type, index = 0) {
  let targetData;
  let barData = [
    144 + index * 10,
    163 + index * 10,
    168 + index * 10,
    140 + index * 10,
    143 + index * 10,
    147 + index * 10,
    82 + index * 10,
    136 + index * 10,
    154 + index * 10,
    196 + index * 10,
    150 + index * 10,
    91 + index * 10,
    95 + index * 10,
    200 + index * 10,
    54 + index * 10,
    172 + index * 10,
    50 + index * 10,
    58 + index * 10,
    127 + index * 10,
    178 + index * 10,
    122 + index * 10,
    172 + index * 10,
    100 + index * 10,
    112 + index * 10,
    91 + index * 10,
    95 + index * 10,
    200 + index * 10,
    54 + index * 10,
    172 + index * 10,
    50 + index * 10
  ];
  let lineData = [
    18 + index * 3,
    20 + index * 3,
    20 + index * 3,
    18 + index * 3,
    20 + index * 3,
    18 + index * 3,
    19 + index * 3,
    20 + index * 3,
    20 + index * 3,
    18 + index * 3,
    19 + index * 3,
    19 + index * 3,
    19 + index * 3,
    18 + index * 3,
    20 + index * 3,
    20 + index * 3,
    19 + index * 3,
    20 + index * 3,
    19 + index * 3,
    18 + index * 3,
    19 + index * 3,
    18 + index * 3,
    19 + index * 3,
    19 + index * 3,
    18 + index * 3,
    19 + index * 3,
    20 + index * 3,
    20 + index * 3,
    18 + index * 3,
    19 + index * 3
  ];
  // 饼图数据

  let yAxisIndex = null;
  if (type === "bar") {
    targetData = barData;
    yAxisIndex = null;
  } else {
    targetData = lineData;
    yAxisIndex = 1;
  }
  return {
    white: item.white,
    black: item.black,
    name: item.name,
    type: type,
    data: targetData,
    itemStyle: {
      normal: {
        color: item.itemStyle.normal.color
      }
    },
    yAxisIndex: yAxisIndex
  };
}

export {
  changeEchartsTheme,
  getChartSeries,
  changeCompareThem,
  getCurrentchart
};
