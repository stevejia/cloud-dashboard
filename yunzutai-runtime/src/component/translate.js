import {
  operateList,
  fontFamily
} from "@/components/differentClass/pack/common";
//字体转换
function translateFontFamily(fami) {
  fami = fami || "默认字体";
  let item = fontFamily.find(p => {
    return p.label === fami;
  }).value;
  return item;
}
//degreee动画
function translateAnimation(info) {
  return info.wbRespList.map(item => {
    return {
      imgUrl: item.backgroundImage,
      oper: item.predevchar === -1 ? "" : operateList[item.predevchar].value,
      pointId: item.visdev,
      sourceValue: item.inventoryType,
      value: item.prenum
    };
  });
}
//eventColorChange颜色切换
function translateColorChange(info, password) {
  return {
    pointId: info.numvisdev,
    highColor: info.numhighc,
    highValue: info.numhigh,
    lowColor: info.numloghc,
    lowValue: info.numlogh,
    writeable: info.numwritable,
    passwordStatus: info.numconfirm,
    role: password
  };
}
//eventBtn类型转换
function translateEventBtn(info) {
  return info.eventList.map(_item => {
    let order = _item.dataIndex;
    let oper = _item.eventValues[order];
    if (order === 1) {
      return {
        order: order,
        open: {
          ...oper.open,
          predevchar: operateList[oper.open.predevchar].value
        },
        off: {
          ...oper.off,
          predevchar: operateList[oper.off.predevchar].value
        }
      };
    } else if (order === 2) {
      return {
        order: order,
        open: oper.open,
        off: oper.off
      };
    } else if (order === 3) {
      return {
        order: order,
        open: {
          ...oper.open,
          fzchar: operateList[oper.open.fzchar].value
        },
        off: {
          ...oper.off,
          fzchar: operateList[oper.off.fzchar].value
        }
      };
    }
  });
}
//event类型转换
function translateEvent(info) {
  return info.wbEventList.map(_item => {
    let order = _item.dataIndex;
    let oper = _item.eventValues[order];
    if (order === 0) {
      return {
        order: order,
        pageId: oper.pageID
      };
    } else if (order === 1) {
      return {
        order: order,
        noVal: oper.closenum,
        okVal: oper.startnum,
        oper: operateList[oper.predevchar].value,
        operValue: oper.prenum,
        permit: oper.tjenable,
        permitPointId: oper.predev,
        pointId: oper.curdevchar
      };
    } else if (order === 2) {
      return {
        order: order,
        jsContent: oper.jscotent
      };
    } else if (order === 3) {
      return {
        order: order,
        oper: operateList[oper.fzchar].value,
        operValue: oper.prenum,
        permit: oper.tjenable,
        permitPointId: oper.predev,
        result: oper.valueList.map(a => {
          return {
            pointId: a.curdev,
            value: a.curnum
          };
        })
      };
    } else if (order === 4) {
      return {
        order: order,
        pageId: oper.ctnerID
      };
    } else {
      return {
        order: ""
      };
    }
  });
}

//可见类型转换
function translateVisible(info) {
  return {
    pointId: info.visdev,
    rule: info.vistf == 1 ? 1 : info.vistf === "" ? "" : -1
  };
}
//闪烁类型转换
function translateOpacity(info) {
  return {
    pointId: info.twindev,
    rule: info.twintf == 1 ? 1 : info.twintf === "" ? "" : -1
  };
}
//颜色响应转换
function translateColor(info) {
  return {
    pointId: info.c1dev,
    colorList: info.wbcolorList.map(item => {
      return {
        color: item.color,
        start: item.c1showcs,
        end: item.c1showce
      };
    })
  };
}

export {
  translateEvent,
  translateVisible,
  translateOpacity,
  translateColor,
  translateColorChange,
  translateAnimation,
  translateFontFamily,
  translateEventBtn
};
