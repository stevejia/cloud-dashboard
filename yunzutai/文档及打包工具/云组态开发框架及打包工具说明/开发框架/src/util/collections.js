import {
  startReactive,
  createEffect,
  addToReactive,
  reactive
} from "./reactive";
import { bulkGet, bulkSet } from "@/api/bulk.js";
/**
 * 创建方法,addToReactive,createEffect
 * @param {String} str 方法实体
 * @param {String} returnValue 默认的返回值
 * @param {String} params 方法参数
 */
export function createFunction(
  str,
  returnValue = "return res",
  params = "res"
) {
  let content = str + "\n" + returnValue;
  return new Function(params, content);
}
function fn(vm) {
  return new Promise(resolve => {
    vm.$prompt("", "设置", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      inputPlaceholder: "请输入设置值"
    })
      .then(({ value }) => {
        resolve(value);
      })
      .catch(() => {
        vm.$message({
          type: "info",
          message: "取消输入"
        });
      });
  });
}
let eventTypeToFn = {
  可见: (vm, config, dragSelf) => {
    let pointId = config.value.pointId;
    let value = config.value.rule;
    if (pointId.length === 3 && value) {
      let point = pointId[2];
      let computedFn = function(target, hopeValue, val) {
        if (val[0] !== null) {
          if (hopeValue == val[0]) {
            target.$el.style.display = "";
          } else {
            target.$el.style.display = "none";
          }
        }
      };
      let effect = createEffect(vm, value, [point], computedFn);
      addToReactive(point, effect);
      dragSelf.points.add(point);
    }
  },
  闪烁: (vm, config, dragSelf) => {
    let pointId = config.value.pointId;
    let value = config.value.rule;
    if (pointId.length === 3 && value) {
      let point = pointId[2];
      let computedFn = function(target, hopeValue, val) {
        if (val[0] !== null) {
          if (hopeValue == val[0]) {
            target.$el.classList.add("shine");
          } else {
            target.$el.classList.remove("shine");
          }
        }
      };
      let effect = createEffect(vm, value, [point], computedFn);
      addToReactive(point, effect);
      dragSelf.points.add(point);
    }
  },
  颜色响应: (vm, config, dragSelf) => {
    let pointId = config.value.pointId;
    let colorList = config.value.colorList;
    if (pointId.length === 3 && colorList.length) {
      let point = pointId[2];
      let computedFn = function(target, hopeList, val) {
        if (val[0] !== null) {
          hopeList.some(hope => {
            if (val[0] >= hope.start && val[0] <= hope.end) {
              target.baisicConfig["字体样式"].value[0] = hope.color;
              target.initStyle();
              return true;
            }
          });
        }
      };
      let effect = createEffect(vm, colorList, [point], computedFn);
      addToReactive(point, effect);
      dragSelf.points.add(point);
    }
  },
  颜色切换: (vm, config, dragSelf) => {
    let pointId = config.value.pointId;
    if (pointId.length === 3) {
      let point = pointId[2];
      let computedFn = function(target, config, val) {
        if (val[0] !== null) {
          if (val[0] >= config.highValue) {
            target.initStyle(true, config.highColor, val[0]);
          } else if (val[0] <= config.lowValue) {
            target.initStyle(true, config.lowColor, val[0]);
          } else {
            target.initStyle(true, null, val[0]);
          }
        }
      };
      let effect = createEffect(vm, config.value, [point], computedFn);
      addToReactive(point, effect);
      dragSelf.points.add(point);
    }
  },
  事件: (vm, config, dragSelf) => {
    let eventList = config.value;
    eventList.forEach(eventConfig => {
      if (eventConfig.order === 1) {
        let { permitPointId, pointId } = eventConfig;
        if (permitPointId && permitPointId.length === 3) {
          addToReactive(permitPointId[2]);
          dragSelf.points.add(permitPointId[2]);
        }
        if (pointId && pointId.length === 3) {
          addToReactive(pointId[2]);
          dragSelf.points.add(pointId[2]);
        }
      } else if (eventConfig.order === 3) {
        let { permitPointId, result } = eventConfig;
        if (permitPointId && permitPointId.length === 3) {
          addToReactive(permitPointId[2]);
          dragSelf.points.add(permitPointId[2]);
        }
        result.forEach(item => {
          let { pointId } = item;
          if (pointId.length === 3) {
            addToReactive(pointId[2]);
            dragSelf.points.add(pointId[2]);
          }
        });
      }
    });
  }
};
class Collections {
  init() {
    this.points = new Set();
    startReactive();
  }
  //测点搜集
  collect(vm) {
    let eventConfig = vm.highConfig;
    for (let key in eventConfig) {
      let fn = eventTypeToFn[key];
      //存在该事件配置，根据事件type，拿去响应属性
      if (fn) {
        fn(vm, eventConfig[key], this);
      }
    }
    console.log(this.points);
  }
  //颜色可输入
  colorInput(config, vm) {
    return new Promise(resolve => {
      if (config.writeable) {
        // eslint-disable-next-line no-unused-vars
        let pointId = config.pointId;
        if (pointId.length !== 3) {
          resolve("测点没绑定");
          return;
        }

        pointId = pointId[2];
        let targetValue = null;

        fn(vm).then(res => {
          targetValue = res;
          if (config.passwordStatus) {
            vm.$prompt("", "请输入密码", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              inputPlaceholder: "请输入密码"
            })
              .then(({ value }) => {
                let permiss = vm.$store.state.permiss;
                let checkRole = permiss.find(item => {
                  return item.id === config.role;
                });
                if (checkRole && checkRole.password === value) {
                  resolve("操作成功");
                  bulkSet([
                    { pointId: pointId, value: targetValue }
                  ]).then(() => {});
                }
              })
              .catch(() => {
                vm.$message({
                  type: "info",
                  message: "取消输入"
                });
              });
          } else {
            resolve("操作成功");
            bulkSet([{ pointId: pointId, value: targetValue }]).then(() => {});
          }
        });
      }
    });
  }
  //事件：赋值
  assignValue(eventConfig) {
    return new Promise(resolve => {
      let { permit, permitPointId, oper, operValue, result } = eventConfig;
      if (result.length === 0) resolve("没有绑定测点");
      let status = true;
      if (permit) {
        status = false;
        let permitNeed = reactive[permitPointId[2]];
        if (permitNeed != null) {
          let bool = eval(permitNeed + oper + operValue);
          if (bool) {
            status = true;
          }
        }
      }
      if (status) {
        let pointIds = [];
        result.forEach(item => {
          let { pointId, value } = item;
          if (pointId.length === 3 && value != "") {
            pointIds.push({
              pointId: pointId[2],
              value
            });
          }
        });
        resolve("操作成功");
        bulkSet(pointIds).then(() => {});
      } else {
        resolve("条件不允许");
      }
    });
  }
  //事件：开关切换
  openOff(eventConfig) {
    return new Promise(resolve => {
      let {
        permit,
        permitPointId,
        oper,
        operValue,
        pointId,
        okVal,
        noVal
      } = eventConfig;
      if (pointId.length !== 3) resolve("没有绑定测点");
      let status = true;
      if (permit) {
        status = false;
        let permitNeed = reactive[permitPointId[2]];
        if (permitNeed != null) {
          let bool = eval(permitNeed + oper + operValue);
          if (bool) {
            status = true;
          }
        }
      }
      if (status) {
        let targetId = pointId[2];
        let targetValue = null;
        if (eventConfig.currentValue === noVal) {
          targetValue = okVal;
        } else {
          targetValue = noVal;
        }
        resolve("操作成功");
        bulkSet([{ pointId: targetId, value: targetValue }]).then(() => {
          eventConfig.currentValue = targetValue;
        });
      } else {
        resolve("条件不允许");
      }
    });
  }
  //轮训数据
  startGetData() {
    bulkGet({
      pointIds: [...this.points]
    }).then(res => {
      let pointVals = res.data;
      pointVals.forEach(point => {
        reactive[point.pointId] = point.value;
      });
      this._interValFn();
    });
  }
  _interValFn() {
    if (this.points.size) {
      setTimeout(() => {
        this.startGetData();
      }, 1000);
    }
  }
}

export default Collections;
