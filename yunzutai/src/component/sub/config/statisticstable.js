import { translateFontFamily } from "@/component/translate.js";
export default function translateConfig(item) {
  let dateObj = selectDate(item.dateType, item.time);
  let config = {
    white: {
      查询条件字体2: item.white.timeColor || "#41464D",
      表格标题字体2: item.white.titleColor || "rgba(0,0,0,1)",
      表格头部字体2: item.white.headerFontColor || "#FFFFFF",
      单元格字体2: item.white.cellFontColor || "#67757C",
      背景颜色: item.white.backgroundColor || "#FFFFFF",
      标题背景颜色: item.white.headerBgColor || "#3573C1",
      单元格背景颜色: item.white.cellBgColor || "#FFFFFF",
      边框颜色: item.white.borderColor || "rgba(221, 221, 221,1)",
      按钮颜色: item.white.buttonbc || "#3573c1"
    },
    black: {
      查询条件字体2: item.black.timeColor || "#b2ddff",
      表格标题字体2: item.black.timeColor || "#FFFFFF",
      表格头部字体2: item.black.timeColor || "#FFFFFF",
      单元格字体2: item.black.timeColor || "#B2DDFF",
      背景颜色: item.black.timeColor || "#18191D",
      标题背景颜色: item.black.timeColor || "#24252A",
      单元格背景颜色: item.black.timeColor || "#18191D",
      边框颜色: item.black.timeColor || "rgba(67, 74, 90,1)",
      按钮颜色: item.black.timeColor || "#3573c1"
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
      表格标题: {
        type: "input",
        value: item.title
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
      表格标题字体: {
        type: "fontThree",
        value: [
          item.titleFontSize + "px",
          translateFontFamily(item.titleFamily),
          ""
        ]
      },
      表格头部字体: {
        type: "fontThree",
        value: [
          item.headerFontSize + "px",
          translateFontFamily(item.headerFontFamily),
          ""
        ]
      },
      单元格字体: {
        type: "fontThree",
        value: [
          item.cellFontSize + "px",
          translateFontFamily(item.cellFontFamily),
          ""
        ]
      },
      背景颜色: {
        type: "color-select",
        value: ""
      },
      标题背景颜色: {
        type: "color-select",
        value: ""
      },
      单元格背景颜色: {
        type: "color-select",
        value: ""
      },
      边框颜色: {
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
      日期类型: {
        type: "dateType",
        values: dateObj.itemsInArr,
        time: [item.starttime, item.endtime],
        label: ["小时", "日", "周", "月", "季度", "年"],
        value: dateObj.items
      }
    },
    highConfig: {
      数据关联: {
        type: "explain"
      },
      树形图: {
        type: "dependtree",
        value: item.treeId
      }
    }
  };
  // 输出时间日期
  function selectDate(dateType, time) {
    let arr = ["小时", "日", "周", "月", "季度", "年"];
    let times = ["h", "d", "W", "M", "q", "y"];
    let itemsInArr = (a1, a2 = []) => {
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
