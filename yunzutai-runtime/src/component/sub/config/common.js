function changeEchartsTheme(theme, config) {
  console.log(234);
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
    2.0 + index * 5,
    8 + index * 5,
    6.4 + index * 5,
    23.2 + index * 5,
    32.6 + index * 5,
    76.7 + index * 5,
    162.2 + index * 5,
    193.2 + index * 5,
    212.6 + index * 5,
    176.7 + index * 5,
    202.2 + index * 5,
    246.7 + index * 5,
    272.2 + index * 5,
    116.4 + index * 5,
    123.2 + index * 5,
    132.6 + index * 5,
    176.7 + index * 5,
    162.2 + index * 5,
    193.2 + index * 5,
    212.6 + index * 5,
    176.7 + index * 5,
    202.2 + index * 5,
    246.7 + index * 5,
    272.2 + index * 5
  ];
  let lineData = [];
  lineData.push(
    2 + index * 2,
    4.5 + index * 2,
    10.2 + index * 2,
    12.3 + index * 2,
    15.2 + index * 2,
    16.5 + index * 2,
    18 + index * 2,
    23.2 + index * 2,
    22.6 + index * 2,
    16.7 + index * 2,
    26.2 + index * 2,
    29.2 + index * 2,
    27.7 + index * 2,
    10.2 + index * 2,
    23.2 + index * 2,
    22.6 + index * 2,
    16.7 + index * 2,
    26.2 + index * 2,
    12.3 + index * 2,
    15.2 + index * 2,
    16.5 + index * 2,
    18 + index * 2,
    29.2 + index * 2,
    27.7 + index * 2
  );
  let obj = {
    white: item.white,
    black: item.black,
    name: item.name,
    type: type,
    data: targetData,
    itemStyle: {
      normal: {
        color: item.itemStyle.normal.color
      }
    }
  };
  if (type === "bar") {
    obj.data = barData;
  } else {
    obj.data = lineData;
    obj.yAxisIndex = 1;
  }
  return obj;
}

export { changeEchartsTheme, getChartSeries, changeCompareThem };
