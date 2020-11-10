import {
  addToEndReactive,
  createEffect,
  addToReactive,
  reactive,
  getEndTriggerList
} from "./reactive";
import { bulkGet, bulkSet } from "@/api/bulk.js";
import { guid } from "@/util/common";
import {
  timerBulkCtrl,
  timerBulkSet,
  timerTask,
  apsTask,
  apsBulkSet,
  apsBulkCtrl
} from "@/api/bulk.js";
let options = [
  {
    label: "周一",
    value: 1
  },
  {
    label: "周二",
    value: 2
  },
  {
    label: "周三",
    value: 3
  },
  {
    label: "周四",
    value: 4
  },
  {
    label: "周五",
    value: 5
  },
  {
    label: "周六",
    value: 6
  },
  {
    label: "周日",
    value: 7
  }
];
function getPtgPoints(ptgPonitsList) {
  let { ptgPoints } = this.$vm.$store.state.pointGroup;
  return ptgPonitsList.map(item => {
    let id = item.id;
    let p = ptgPoints.find(item => {
      return item.id === id;
    });
    if (p && p.piTs.length) {
      return {
        pointIds: p.piTs.map(ii => {
          return ii.pit;
        }),
        value: item.value
      };
    }
  });
}
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
      inputPlaceholder: "请输入设置值",
      closeOnClickModal: false
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
  fontResponse: (vm, config, dragSelf) => {
    let pointId = config.value.pointId;
    if (pointId.length && config.value.status) {
      let point = pointId.slice(-1)[0];
      let computedFn = function(target, valueList, val) {
        if (val[0] !== null) {
          val = val[0];
          let _config = valueList.find(item => {
            item.min =
              item.min === "" || item.min === null
                ? Number.MIN_SAFE_INTEGER
                : item.min;
            item.max =
              item.max === "" || item.max === null
                ? Number.MAX_SAFE_INTEGER
                : item.max;
            if (val >= item.min && val <= item.max) {
              return true;
            }
          });
          if (_config) {
            target.text = _config.text;
          }
        }
      };

      let effect = createEffect(
        vm,
        config.value.valueList,
        [point],
        computedFn
      );
      addToReactive(point, effect);
      dragSelf.addPoints(point);
    }
  },
  // eventMapNumber
  degree: (vm, config, dragSelf) => {
    let sameStatus = config.sameStatus;
    let pointId = config.value[0].pointId;
    config.value.forEach((item, index) => {
      if (index !== 0 && !sameStatus) {
        pointId = item.pointId;
      }
      if (pointId.length) {
        let point = pointId.slice(-1)[0];
        let computedFn = function(target, item, val) {
          if (val[0] !== null) {
            val = val[0];
            let bool = eval(val + item.oper + item.value);
            if (bool) {
              config.currentImage = item.imgUrl;
              target.initStyle(true);
            }
          }
        };
        let effect = createEffect(vm, item, [point], computedFn);
        addToReactive(point, effect);
        dragSelf.addPoints(point);
      }
    });
  },
  eventMap: (vm, config, dragSelf) => {
    let pointId = config.value;
    if (pointId.length) {
      let point = pointId.slice(-1)[0];
      let computedFn = function(target, config, val) {
        if (val[0] !== null) {
          val = val[0];
          let dataRange = config.dataRange;
          let opacityRange = config.opacityRange;
          if (val >= dataRange[0] && val <= dataRange[1]) {
            let per =
              (opacityRange[1] - opacityRange[0]) /
              (dataRange[1] - dataRange[0]);
            let b = opacityRange[1] - dataRange[1] * per;
            let x = val * per + b;
            target.$el.style.opacity = x / 100;
          } else {
            target.$el.style.opacity = 1;
          }
        }
      };
      let effect = createEffect(vm, config, [point], computedFn);
      addToReactive(point, effect);
      dragSelf.addPoints(point);
    }
  },
  //可见
  eventVisible: (vm, config, dragSelf) => {
    let pointId = config.value.pointId;
    let value = config.value.rule;
    if (pointId.length && value !== "") {
      let point = pointId.slice(-1)[0];
      let computedFn = function(target, hopeValue, val) {
        val = val[0];
        if (val !== null) {
          if (hopeValue === 1) {
            if (val !== 0) {
              target.$el.style.display = "";
            } else {
              target.$el.style.display = "none";
            }
          } else {
            if (val === 0) {
              target.$el.style.display = "";
            } else {
              target.$el.style.display = "none";
            }
          }
        }
      };
      let effect = createEffect(vm, value, [point], computedFn);
      addToReactive(point, effect);

      dragSelf.addPoints(point);
    }
  },
  eventOpacity: (vm, config, dragSelf) => {
    let pointId = config.value.pointId;
    let value = config.value.rule;
    if (pointId.length && value !== "") {
      let point = pointId.slice(-1)[0];
      let computedFn = function(target, hopeValue, val) {
        val = val[0];
        if (val !== null) {
          if (hopeValue === 1) {
            if (val !== 0) {
              target.$el.classList.add("shine");
            } else {
              target.$el.classList.remove("shine");
            }
          } else {
            if (val === 0) {
              target.$el.classList.add("shine");
            } else {
              target.$el.classList.remove("shine");
            }
          }
        }
      };
      let effect = createEffect(vm, value, [point], computedFn);
      addToReactive(point, effect);

      dragSelf.addPoints(point);
    }
  },
  eventColor: (vm, config, dragSelf) => {
    let pointId = config.value.pointId;
    let colorList = config.value.colorList;
    if (pointId.length && colorList.length) {
      let point = pointId.slice(-1)[0];

      let computedFn = function(target, hopeList, val) {
        if (val[0] !== null) {
          let hope = hopeList.find(hope => {
            if (
              (hope.start === "" || val[0] >= hope.start) &&
              (hope.end === "" || val[0] <= hope.end)
            ) {
              target.eventColorChange(hope.color);
              return true;
            }
          });
          if (!hope) {
            target.eventColorChange(target.oldColor);
          }
        }
      };
      vm.oldColor = vm.eventColor();
      let effect = createEffect(vm, colorList, [point], computedFn);
      addToReactive(point, effect);

      dragSelf.addPoints(point);
    }
  },
  eventColorChange: (vm, config, dragSelf) => {
    let pointId = config.value.pointId;
    if (pointId.length) {
      let point = pointId.slice(-1)[0];
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

      dragSelf.addPoints(point);
    }
  },
  测点搜集: (vm, points, dragSelf) => {
    let bool = points.some(item => {
      return item.length;
    });
    if (points.length && bool) {
      let pointIds = [];
      points.forEach(pointId => {
        if (pointId.length) {
          pointId = pointId.slice(-1)[0];
          pointIds.push(pointId);
          dragSelf.addPoints(pointId);
        } else {
          pointIds.push(null);
        }
      });
      let computedFn = function(target, ll, val) {
        target.pointIdChange(val);
      };
      let effect = createEffect(vm, null, pointIds, computedFn);
      addToEndReactive(effect);
    }
  },
  event: (vm, config, dragSelf) => {
    let eventList = config.value;
    if (!eventList.length) return;
    let bool = vm.$parent.type === "开关按钮";
    if (bool) {
      eventList.forEach(eventConfig => {
        let { open, off, order } = eventConfig;
        if (order === 1) {
          let { predev, curdevchar } = open;
          if (predev && predev.length) {
            addToReactive(predev.slice(-1)[0]);

            dragSelf.addPoints(predev.slice(-1)[0]);
          }
          if (curdevchar && curdevchar.length) {
            addToReactive(curdevchar.slice(-1)[0]);
            dragSelf.addPoints(curdevchar.slice(-1)[0]);
          }
          predev = off.predev;
          curdevchar = off.curdevchar;
          if (predev && predev.length) {
            addToReactive(predev.slice(-1)[0]);
            dragSelf.addPoints(predev.slice(-1)[0]);
          }
          if (curdevchar && curdevchar.length) {
            addToReactive(curdevchar.slice(-1)[0]);
            dragSelf.addPoints(curdevchar.slice(-1)[0]);
          }
        } else if (order === 3) {
          let { predev, valueList } = open;
          if (predev && predev.length) {
            addToReactive(predev.slice(-1)[0]);
            dragSelf.addPoints(predev.slice(-1)[0]);
          }
          valueList.forEach(item => {
            let { curdev } = item;
            if (curdev.length) {
              addToReactive(curdev.slice(-1)[0]);
              dragSelf.addPoints(curdev.slice(-1)[0]);
            }
          });
          predev = off.predev;
          valueList = off.valueList;
          if (predev && predev.length) {
            addToReactive(predev.slice(-1)[0]);
            dragSelf.addPoints(predev.slice(-1)[0]);
          }
          valueList.forEach(item => {
            let { curdev } = item;
            if (curdev.length) {
              addToReactive(curdev.slice(-1)[0]);
              dragSelf.addPoints(curdev.slice(-1)[0]);
            }
          });
        }
      });
      return;
    }

    eventList.forEach(eventConfig => {
      if (eventConfig.order === 1) {
        let { permitPointId, pointId } = eventConfig;
        if (permitPointId && permitPointId.length) {
          addToReactive(permitPointId.slice(-1)[0]);

          dragSelf.addPoints(permitPointId.slice(-1)[0]);
        }
        if (pointId && pointId.length) {
          addToReactive(pointId.slice(-1)[0]);

          dragSelf.addPoints(pointId.slice(-1)[0]);
        }
      } else if (eventConfig.order === 3) {
        let { permitPointId, result } = eventConfig;
        if (permitPointId && permitPointId.length) {
          addToReactive(permitPointId.slice(-1)[0]);
          dragSelf.addPoints(permitPointId.slice(-1)[0]);
        }
        result.forEach(item => {
          let { pointId } = item;
          if (pointId.length) {
            addToReactive(pointId.slice(-1)[0]);
            dragSelf.addPoints(pointId.slice(-1)[0]);
          }
        });
      }
    });
  }
};
class Collections {
  init() {
    if (!this.layout.$store.state.runtime) return;
    this.pageConfig = {}; //所有页面的测点合集,定时集合，排程集合
    for (let key in this.centerConfigs) {
      this.pageConfig[key] = {
        points: new Set(),
        pointsId: null,
        timer: [],
        timerId: null,
        aps: [],
        apsId: null
      };
    }
    this.currentPageConfig = this.pageConfig[this.currentPageId];
    this.currentPagePoints = []; //当前页面的测点合集
    this.currentPageTimer = [];
    this.currentPageAps = [];
    // super.init();
  }
  //开始当前测点轮询请求，页面加载完成之后触发
  readyData() {
    if (!this.layout.$store.state.runtime) return;
    this.currentPageConfig = this.pageConfig[this.currentPageId];
    if (!this.currentPageConfig) return;
    let id = guid();
    //页面测点
    this.currentPagePoints = [...this.currentPageConfig.points]; //获取当前页面测点合集
    this.currentPageConfig.pointsId = id;
    if (this.currentPagePoints.length) {
      this.startGetData(id);
    }

    //页面定时
    this.currentPageTimer = this.currentPageConfig.timer;
    this.currentPageConfig.timerId = id;
    if (this.currentPageTimer.length) {
      this.startTimer(id);
    }
    //页面排程
    this.currentPageAps = this.currentPageConfig.aps;
    this.currentPageConfig.apsId = id;
    if (this.currentPageAps.length) {
      this.startAps(id);
    }
  }
  //开始测点搜集
  collect(vm) {
    let eventConfig = vm.highConfig;
    let collectPointIds = vm.$data.collectPointIds;
    if (collectPointIds) {
      let _fn = eventTypeToFn["测点搜集"];
      _fn(vm, collectPointIds, this);
    }
    for (let key in eventConfig) {
      let type = eventConfig[key].type;
      let fn = eventTypeToFn[type];
      if (fn) {
        fn(vm, eventConfig[key], this);
      }
    }
  }
  //将测点添加到points
  addPoints(pointId) {
    this.pageConfig[this.currentPageId].points.add(pointId);
  }
  //颜色可输入
  colorInput(config, vm) {
    return new Promise(resolve => {
      if (config.writeable) {
        let pointId = config.pointId;
        if (!pointId.length) {
          vm.$message({
            type: "warning",
            message: "测点没绑定"
          });
          return;
        }

        pointId = pointId.slice(-1)[0];
        let targetValue = null;

        fn(vm).then(res => {
          targetValue = res;
          if (config.passwordStatus) {
            vm.$prompt("", "请输入密码", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              inputPlaceholder: "请输入密码",
              closeOnClickModal: false
            })
              .then(({ value }) => {
                // let permiss = vm.$store.state.permiss;
                let permiss = vm.$store.state.authorityList;
                let checkRole = permiss.find(item => {
                  return item.id === config.role;
                });
                if (checkRole && checkRole.password !== value) {
                  vm.$message({
                    type: "error",
                    message: "密码错误"
                  });
                  return;
                }
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
  assignValue(eventConfig, vm) {
    return new Promise(resolve => {
      if (vm) {
        let config = null;
        if (vm.isOn) {
          config = eventConfig.open;
        } else {
          config = eventConfig.off;
        }
        let { fzchar, predev, prenum, valueList, tjenable } = config;
        if (valueList.length === 0) resolve("没有绑定测点");
        let status = true;
        if (tjenable) {
          status = false;
          if (predev && predev.length) {
            let permitNeed = reactive[predev.slice(-1)[0]];
            if (permitNeed != null) {
              let bool = eval(permitNeed + fzchar + prenum);
              if (bool) {
                status = true;
              }
            }
          }
        }
        if (status) {
          let pointIds = [];
          valueList.forEach(item => {
            let { curdev, curnum } = item;
            if (curdev.length && curnum != "") {
              pointIds.push({
                pointId: curdev.slice(-1)[0],
                value: curnum
              });
            }
          });
          resolve("操作成功");
          bulkSet(pointIds).then(() => {});
        } else {
          resolve("已启用条件，当前条件不符合!");
        }
        return;
      }
      let { permit, permitPointId, oper, operValue, result } = eventConfig;
      if (result.length === 0) resolve("没有绑定测点");
      let status = true;
      if (permit) {
        status = false;
        if (permitPointId && permitPointId.length) {
          let permitNeed = reactive[permitPointId.slice(-1)[0]];
          if (permitNeed != null) {
            let bool = eval(permitNeed + oper + operValue);
            if (bool) {
              status = true;
            }
          }
        }
      }
      if (status) {
        let pointIds = [];
        result.forEach(item => {
          let { pointId, value } = item;
          if (pointId.length && value != "") {
            pointIds.push({
              pointId: pointId.slice(-1)[0],
              value
            });
          }
        });
        resolve("操作成功");
        bulkSet(pointIds).then(() => {});
      } else {
        resolve("已启用条件，当前条件不符合!");
      }
    });
  }
  //事件：容器
  bindContainer(remind, eventConfig, containerType, confirms) {
    return new Promise(resolve => {
      let id = this.currentPageId;
      let containerVm = this.containerVms[id].find(item => {
        return item.id === eventConfig.pageId;
      });
      if (containerVm) {
        let comp = containerVm.$refs.comp;

        let container = comp.baisicConfig["容器"];
        if (container[containerType]) {
          if (containerType === "dialog") {
            confirms(remind).then(() => {
              let containerDisplay = containerVm.$el.style.display;
              containerVm.$el.style.display =
                containerDisplay === "none" ? "" : "none";
            });
          } else {
            let containerDisplay = containerVm.$el.style.display;
            containerVm.$el.style.display =
              containerDisplay === "none" ? "" : "none";
          }
        }
      }
      resolve();
    });
  }
  //事件：开关切换
  openOff(eventConfig, vm) {
    return new Promise(resolve => {
      if (vm) {
        let config = null;
        if (vm.isOn) {
          config = eventConfig.open;
        } else {
          config = eventConfig.off;
        }
        let {
          curdevchar,
          predev,
          predevchar,
          prenum,
          setnum,
          tjenable
        } = config;

        if (!curdevchar.length) {
          resolve("没有绑定测点");
          return;
        }
        let status = true;
        if (tjenable) {
          status = false;
          if (predev && predev.length) {
            let permitNeed = reactive[predev.slice(-1)[0]];
            if (permitNeed != null) {
              let bool = eval(permitNeed + predevchar + prenum);
              if (bool) {
                status = true;
              }
            }
          }
        }
        if (status) {
          let targetId = curdevchar.slice(-1)[0];
          resolve("操作成功");
          bulkSet([{ pointId: targetId, value: setnum }]);
        } else {
          resolve("已启用条件，当前条件不符合!");
        }
        return;
      }
      let {
        permit,
        permitPointId,
        oper,
        operValue,
        pointId,
        okVal,
        noVal
      } = eventConfig;
      if (!pointId.length) {
        resolve("没有绑定测点");
        return;
      }
      let status = true;
      if (permit) {
        status = false;
        if (permitPointId && permitPointId.length) {
          let permitNeed = reactive[permitPointId.slice(-1)[0]];
          if (permitNeed != null) {
            let bool = eval(permitNeed + oper + operValue);
            if (bool) {
              status = true;
            }
          }
        }
      }
      if (status && pointId.length) {
        let targetId = pointId.slice(-1)[0];
        let targetValue = null;
        console.log(reactive[targetId]);
        if (reactive[targetId] == noVal) {
          targetValue = okVal;
        } else {
          targetValue = noVal;
        }
        bulkSet([{ pointId: targetId, value: targetValue }]).then(() => {
          resolve("操作成功");
        });
      } else {
        resolve("已启用条件，当前条件不符合!");
      }
    });
  }
  endGetData() {
    this.points.clear();
  }
  //定时状态改变
  timerBulkCtrl(id, taskData) {
    let appId = this.$vm.$store.state.pointGroup.pid;
    timerBulkCtrl({
      appId: appId,
      componentId: "timer_" + id,
      taskData: taskData
    });
  }
  //排程状态改变
  apsBulkCtrl(id, taskData) {
    let appId = this.$vm.$store.state.pointGroup.pid;
    apsBulkCtrl({
      appId: appId,
      componentId: "aps_" + id,
      taskData: taskData
    });
  }
  //定时列表初始化或者变化
  dealTimer(vm, config, status) {
    let timerList = this.pageConfig[this.currentPageId].timer;
    let index = timerList.findIndex(item => {
      return item.config.id === config.id;
    });
    if (index !== -1) {
      if (config.timerOneList.length) {
        timerList[index].config = config;
      } else {
        timerList.splice(index, 1);
      }
    } else if (config.timerOneList.length) {
      timerList.push({ vm, config });
    }
    if (!timerList.length) {
      vm.tableConfig.defaultData = [];
      vm.requestData();
      return;
    }
    let appId = this.$vm.$store.state.pointGroup.pid;
    timerBulkSet({
      appId: appId,
      componentId: "timer_" + vm.$parent.id,
      taskData: config.timerOneList.map(item => {
        let _config = item;
        return {
          cycle: _config.roundType,
          points: getPtgPoints.call(this, item.ptgPonitsList),
          taskId: _config.id,
          time: _config.time
        };
      })
    }).then(() => {
      if (status) {
        let id = guid();
        this.currentPageConfig.timerId = id;
        this.startTimer(id);
      }
    });
  }
  dealAps(vm, config, status) {
    let apsList = this.pageConfig[this.currentPageId].aps;
    let index = apsList.findIndex(item => {
      return item.config.id === config.id;
    });
    if (index !== -1) {
      if (config.apsOneList.length) {
        apsList[index].config = config;
      } else {
        apsList.splice(index, 1);
      }
    } else if (config.apsOneList.length) {
      apsList.push({ vm, config });
    }
    if (!apsList.length) {
      vm.tableConfig.defaultData = [];
      vm.requestData();
      return;
    }
    let appId = this.$vm.$store.state.pointGroup.pid;
    apsBulkSet({
      appId: appId,
      componentId: "aps_" + vm.$parent.id,
      taskData: config.apsOneList.map(item => {
        let _config = item;
        return {
          points: getPtgPoints.call(this, item.ptgPonitsList),
          taskId: _config.id,
          time: _config.time
        };
      })
    }).then(() => {
      if (status) {
        let id = guid();
        this.currentPageConfig.apsId = id;
        this.startAps(id);
      }
    });
  }
  //定时启动
  startTimer(timerId) {
    let appId = this.$vm.$store.state.pointGroup.pid;
    let timers = this.currentPageTimer.map(item => {
      let val = item.config;
      let id = val.id;
      let data = {
        appId: appId,
        componentId: val.id,
        taskData: val.timerOneList.map(_item => {
          return _item.id;
        })
      };
      return { id, data };
    });
    timers = timers.filter(item => {
      return item.data.taskData.length;
    });
    if (!timers.length) return;
    timerTask(timers).then(res => {
      res.data.forEach((_item, index) => {
        let timer = this.currentPageTimer[index];
        let tableData = _item.data.data.taskData;
        let myData = tableData.map((item, index) => {
          let val = timer.config.timerOneList[index];
          if (!val) return null;
          let date = new Date(val.time);
          return {
            taskId: item.taskId,
            name: val.name,
            date: date.getHours() + ":" + ("0" + date.getMinutes()).slice(-2),
            cycle: val.roundType.map(item => {
              return options[item - 1].label;
            }),
            stateDepict: item.runStateString,
            state: item.ctrlState,
            runState: item.runState
          };
        });
        timer.vm.tableConfig.defaultData = myData.filter(item => {
          return item;
        });
        timer.vm.requestData();
      });
      this._interTimer(timerId);
    });
  }
  startAps(apsId) {
    let appId = this.$vm.$store.state.pointGroup.pid;
    let apss = this.currentPageAps.map(item => {
      let val = item.config;
      let id = val.id;
      let data = {
        appId: appId,
        componentId: val.id,
        taskData: val.apsOneList.map(_item => {
          return _item.id;
        })
      };
      return { id, data };
    });
    apss = apss.filter(item => {
      return item.data.taskData.length;
    });
    if (!apss.length) return;
    apsTask(apss).then(res => {
      res.data.forEach((_item, index) => {
        let aps = this.currentPageAps[index];
        let tableData = _item.data.data.taskData;
        let myData = tableData.map((item, index) => {
          let val = aps.config.apsOneList[index];
          if (!val) return null;
          let date = new Date(val.time);
          return {
            taskId: item.taskId,
            name: val.name,
            date:
              date.getFullYear() +
              "/" +
              (date.getMonth() + 1) +
              "/" +
              date.getDate() +
              " " +
              date.getHours() +
              ":" +
              ("0" + date.getMinutes()).slice(-2),
            stateDepict: item.runStateString,
            state: item.ctrlState,
            runState: item.runState
          };
        });
        aps.vm.tableConfig.defaultData = myData.filter(item => {
          return item;
        });
        aps.vm.requestData();
      });
      this._interAps(apsId);
    });
  }
  _interTimer(timerId) {
    if (
      this.currentPageTimer.length &&
      this.currentPageConfig.timerId === timerId
    ) {
      setTimeout(() => {
        this.startTimer(timerId);
      }, 4000);
    }
  }
  _interAps(apsId) {
    if (this.currentPageAps.length && this.currentPageConfig.apsId === apsId) {
      setTimeout(() => {
        this.startAps(apsId);
      }, 4000);
    }
  }

  //轮训数据
  startGetData(id) {
    bulkGet({
      pointIds: this.currentPagePoints
    }).then(res => {
      let pointVals = res.data || [];
      pointVals.forEach(point => {
        reactive[point.pointId] = point.value;
      });
      getEndTriggerList();
      this._interValFn(id);
    });
  }
  _interValFn(id) {
    if (
      this.currentPagePoints.length &&
      this.currentPageConfig.pointsId === id
    ) {
      setTimeout(() => {
        this.startGetData(id);
      }, 1000);
    }
  }
}

export default Collections;
