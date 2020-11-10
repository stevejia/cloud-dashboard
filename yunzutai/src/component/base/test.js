import {
  translateEvent,
  translateVisible,
  translateOpacity,
  translateColor,
  translateColorChange
  // translateFontFamily
} from "@/component/translate.js";

//对于translateFontFamily方法，南京获取font-family得到汉字，需要调用该方法转换：translateFontFamily(item.fontFamily)
export default function translateConfig(item) {
  let config = {
    white: {
      //参照item中属性，找到对应的属性赋值，因为南京的默认属性为空字符串，所以有了 “||”
      color: item.white.color || "#FFFFFF"
    },
    black: {
      color: item.black.color || "#000000"
    }
  };
  //该配置属性，只需要提供 white，black,basicConfig，highConfig
  //特别注意，南京的某些属性比如显示度，并不是 item.opacity（举个列子），所以要多测试测试
  //里面的样式，是不需要赋值的，因为你在themeChange的时候已经做了，所以这个themeChange是必要的
  let compConfig = {
    white: config.white,
    black: config.black,
    highConfig: {
      添加响应: {
        type: "explain"
      },
      可见: {
        type: "eventVisible",
        value: translateVisible(item.wbinfos) //可见属性转换，注意传参，有可能不是这个属性
      },
      添加事件1: {
        type: "explain"
      },
      闪烁: {
        type: "eventOpacity",
        value: translateOpacity(item.wbinfos) //闪烁属性转换，注意传参，有可能不是这个属性
      },
      添加事件2: {
        type: "explain"
      },
      颜色切换: {
        type: "eventColorChange",
        value: translateColorChange(item.numberhighinfo, item.password) //颜色切换属性转换，注意传参，有可能不是这个属性
      },
      添加事件3: {
        type: "explain"
      },
      颜色响应: {
        type: "eventColor",
        value: translateColor(item.wbinfos) //颜色响应属性转换，注意传参，有可能不是这个属性
      },
      添加事件5: {
        type: "explain"
      },
      事件: {
        type: "event",
        remind: item.wbinfos.evenable,
        value: translateEvent(item.wbinfos) //事件属性转换，注意传参，有可能不是这个属性
      },
      添加事件6: {
        type: "explain"
      },
      数据关联: {
        type: "explain"
      },
      日期组件: {
        type: "dependDateSelect",
        oldValue: "",
        value: ""
      },
      树形图: {
        type: "dependtree",
        value: ""
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
      字体样式: {
        type: "font",
        value: ["", "normal", "", ""]
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
      线条1: {
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
