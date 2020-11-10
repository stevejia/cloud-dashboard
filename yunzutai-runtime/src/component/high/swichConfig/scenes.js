import { translateFontFamily } from "@/component/translate.js";

const iconList = [
  {
    label: "上班",
    value: "/static/img/sub/scene/work.svg"
  },
  {
    label: "下班",
    value: "/static/img/sub/scene/offwork.svg"
  },
  {
    label: "值班",
    value: "/static/img/sub/scene/onduty.svg"
  },
  {
    label: "放假",
    value: "/static/img/sub/scene/holiday.svg"
  },
  {
    label: "节能",
    value: "/static/img/sub/scene/energysave.svg"
  },
  {
    label: "回家",
    value: "/static/img/sub/scene/gohome.svg"
  },
  {
    label: "离家",
    value: "/static/img/sub/scene/leavehome.svg"
  },
  {
    label: "迎宾",
    value: "/static/img/sub/scene/welcome.svg"
  },
  {
    label: "休闲",
    value: "/static/img/sub/scene/xiuxian.svg"
  },
  {
    label: "演讲",
    value: "/static/img/sub/scene/speech.svg"
  },
  {
    label: "明亮",
    value: "/static/img/sub/scene/mingliang.svg"
  },
  {
    label: "舒适",
    value: "/static/img/sub/scene/shushi.svg"
  },
  {
    label: "讨论",
    value: "/static/img/sub/scene/discuss.svg"
  },
  {
    label: "手动",
    value: "/static/img/sub/scene/hand.svg"
  },
  {
    label: "自动",
    value: "/static/img/sub/scene/automatic.svg"
  },
  {
    label: "全开",
    value: "/static/img/sub/scene/quankai.svg"
  },
  {
    label: "全关",
    value: "/static/img/sub/scene/quanguan.svg"
  }
];
export default function translateConfig(item) {
  let config = {
    white: {
      //由于测试组件只有一个样式，将其提升为变量color
      字体2: item.white.fontColor || "#455A64",
      图标颜色: item.white.imgColor || "#3573C1",
      背景颜色: item.white.backgroundColor || "#FFFFFF",
      边框颜色: item.white.borderColor || "#DDDDDD"
    },
    black: {
      字体2: item.black.fontColor || "#B2DDFF",
      图标颜色: item.black.imgColor || "#B2DDFF",
      背景颜色: item.black.backgroundColor || "#24252A",
      边框颜色: item.black.borderColor || "rgba(0,0,0,0)"
    }
  };
  let compConfig = {
    white: config.white,
    black: config.black,
    highConfig: {
      点位组关联: {
        type: "select",
        label: [],
        value: item.pointId
      }
    },
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
      线条: {
        type: "line"
      },
      名称: {
        type: "input",
        value: item.title
      },
      线条1: {
        type: "line"
      },
      选择小图标: {
        type: "select",
        label: iconList,
        value: item.icon
      },
      "前景占比（0% - 100%）": {
        type: "inputNumber",
        status: false,
        range: [0, 99],
        value: item.iconWeight
      },
      线条2: {
        type: "line"
      },
      字体: {
        type: "fontThrees",
        value: [item.fontSize, translateFontFamily(item.fontFamily), ""]
      },
      图标颜色: {
        type: "color-select",
        value: ""
      },
      背景颜色: {
        type: "color-select",
        value: ""
      },
      边框颜色: {
        type: "color-select",
        value: ""
      },
      边框粗细: {
        type: "slider",
        status: 1,
        range: [0, 10],
        value: item.borderWidth
      },
      显示度: {
        type: "slider",
        status: 1,
        range: [0, 100],
        value: item.opacity * 100 //显示度，南京存储是小数，
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
        value: item.gRotate //旋转
      }
    }
  };
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
