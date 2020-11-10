import DomOperate from "./domOperate";
import RotateResize from "./rotateResize";
import GuideLine from "./guideLine";
const LEFT_KEYCODE = 37;
const UP_KEYCODE = 38;
const RIGHT_KEYCODE = 39;
const DOWN_KEYCODE = 40;

class Drag extends DomOperate {
  constructor() {
    super();
    this.keyDownFn = this.keyDown.bind(this);
    document.addEventListener("keydown", this.keyDownFn);
    this.initMouseWheelEvent();
  }
  init(vm) {
    this.draging = false;
    this.startFn = this.starts.bind(this);
    this.endFn = this.ends.bind(this);
    this.keyUpFn = this.keyUp.bind(this);

    document.addEventListener("mousedown", this.startFn);
    document.addEventListener("mouseup", this.endFn);
    document.addEventListener("keyup", this.keyUpFn);
    window.onbeforeunload = () => {
      return "请先保存编辑数据，再离开当前页面！";
    };
    this.initRotateResize();
    super.init(vm);
    this.initGuideLine(this.$vm?.$el);
  }
  initRotateResize() {
    this.rotateResize = new RotateResize(this);
  }
  initGuideLine(containerEl) {
    this.guidLine = new GuideLine(containerEl);
  }
  initMouseWheelEvent() {
    this.scaleFn = this.scale.bind(this);
    try {
      //除了火狐、IE的写法                                //火狐兼容写法
      window.addEventListener("mousewheel", this.scaleFn) ||
        window.addEventListener("DOMMouseScroll", this.scaleFn);
    } catch (e) {
      //IE兼容写法
      window.attachEvent("mousewheel", this.scaleFn);
    }
  }
  keyUp(event) {
    if (event.keyCode === 27) {
      this.$vm.$chint.offFullScreen();
    }
    if (window.getSelection().type !== "None") return;
    if (46 == event.keyCode) {
      this.$vm.$refs.contextmenu.deleteVm();
      // this.$history.setHistory(2);
    }
    //ctrol
    if (event.ctrlKey) {
      switch (event.keyCode) {
        case 67:
          //复制ctrol+c
          if (this.vms) {
            this.$vm.$refs.contextmenu.startCopy();
          } else {
            this.$vm.$message({
              type: "warning",
              message: "请选择拷贝对象"
            });
          }
          break;
        case 86:
          //粘贴ctrol+v
          if (this.copyConfig && this.copyConfig.length) {
            this.$vm.$refs.contextmenu.endCopy();
          } else {
            this.$vm.$message({
              type: "warning",
              message: "请先拷贝元素"
            });
          }
          break;
        default:
          break;
      }
    }
  }

  keyDown(event) {
    if (window.getSelection().type !== "None") return;
    let keycode = event.keyCode;
    if (this.vms) {
      if (keycode === LEFT_KEYCODE) {
        event.stopPropagation();
        event.preventDefault();
        this.vms.$data.left--;
        this.vms.resizeHeight();
      } else if (keycode === UP_KEYCODE) {
        event.stopPropagation();
        event.preventDefault();
        this.vms.$data.top--;
        this.vms.resizeHeight();
      } else if (keycode === RIGHT_KEYCODE) {
        event.stopPropagation();
        event.preventDefault();
        this.vms.$data.left++;
        this.vms.resizeHeight();
      } else if (keycode === DOWN_KEYCODE) {
        event.stopPropagation();
        event.preventDefault();
        this.vms.$data.top++;
        this.vms.resizeHeight();
      }
    }
    const Z_KEYCODE = 90;
    const Y_KEYCODE = 89;
    if (event.ctrlKey) {
      event.preventDefault();
      event.stopPropagation();
      switch (event.keyCode) {
        case Z_KEYCODE:
          //回退ctrol+z
          this.$history.goBack(this);
          break;
        case Y_KEYCODE:
          this.$history.forward(this);
          break;
        default:
          break;
      }
    }
  }

  scale(event) {
    if (this.hideTimeout) {
      window.clearTimeout(this.hideTimeout);
      this.hideTimeout = null;
    }

    const MIN_SCALE = 0.1;
    const MAX_SCALE = 3;
    let scaleUnit = 0.1;
    if (!event.ctrlKey) {
      return;
    }
    let scale = Number(this.$vm.config["页面缩放"].value || 1);
    let delta = event.wheelDelta;
    if (scale <= MIN_SCALE && delta < 0) {
      return;
    }
    if (scale >= MAX_SCALE && delta > 0) {
      return;
    }
    // if (scale === 1) {
    //   return;
    // }
    console.log(event);
    //delta 大于0 scale放大 delta小于0 scale缩小
    scaleUnit = delta > 0 ? scaleUnit : -scaleUnit;
    scale += scaleUnit;
    scale = scale.toFixed(1);
    this.$vm.config["页面缩放"].value = scale;
    this.$vm.showScaleTip = true;
    this.$vm.scaleTipOpacity = 100;
    this.$vm.initStyle();
    this.hideTimeout = setTimeout(() => {
      this.$vm.showScaleTip = true;
      this.$vm.scaleTipOpacity = 0;
    }, 1000);
    console.log(this, scaleUnit, scale);
  }

  starts(e) {
    console.log("starts");
    let scale = Number(this.$vm.config["页面缩放"].value || 1);
    this.scale = scale;
    this.selected = false;
    if (e.ctrlKey || this.draging) return;
    if (!this.isNotLocalPage && !this.currentPageId) return;
    this.startX = this.x = e.clientX;
    this.startY = this.y = e.clientY;
    /**
     * status代表目前的动作，在move中科院做特别的处理
     * 0代表创建元素，拖动元素
     * 1代码改变元素宽高
     * 2多选状态
     */
    let status = null;
    let direction = null;
    let index = null;
    let className = e.target.className;
    let parentElementClassName = e.target.parentElement.className;
    if (className.indexOf("imgDiv") !== -1) {
      //添加新元素
      this.clearVms();
      this.cloneNode(e.target);
      status = 0;
      this.hideContextmenu();
    } else if (parentElementClassName.indexOf("imgDiv") != -1) {
      //添加新元素
      this.clearVms();
      this.cloneNode(e.target.parentElement);
      status = 0;
      this.hideContextmenu();
    } else if (className.indexOf("taglen") != -1) {
      //改变元素宽高属性
      if (this.vms.locked) return;
      status = 1;
      index = +e.target.getAttribute("index");
      direction = this.getDirection(className);
      this.rotateResize.init(this.vms.$data, ".symbolDiv", this.vms);
      this.rotateResize.resize(event, this.vms.$data, index, this.scale);
      this.hideContextmenu();
      return;
    } else if (className.indexOf("dragDiv") != -1 && !this.$contextmenuKey) {
      this.hideContextmenu();
      this.clearVms();
      let dom = document.querySelector("#page-" + this.currentPageId);
      let { width: mWidth, height: mHeight, left: mLeft, top: mTop } = {
        width: dom.offsetWidth,
        height: dom.offsetHeight,
        left: 0,
        top: 0
      };
      this.$markContainer = { mWidth, mHeight, mLeft, mTop };
      status = 3;
      this.showMark();
      this.showMenu({ classes: 66 });
    } else if (className.indexOf("rotate") > -1) {
      status = 4;
      let { width, height, left, top } = this.vms.$el.getBoundingClientRect();
      let { transform } = this.vms;
      this.rotateCenter = {
        x: left + width / 2,
        y: top + height / 2
      };
      this.startPos = {
        x: this.x - this.rotateCenter.x,
        y: this.y - this.rotateCenter.y
      };
      this.start_deg = this.o_rotateDeg = transform;
      this.hideContextmenu();
    } else if (
      this.vms &&
      !this.vms.length &&
      this.vms.id &&
      this.vms.$el.contains(e.target)
    ) {
      //改变元素位置属性&&(this.vms&&this.vms.$el===e.target)
      if (
        this.vms.locked &&
        !this.$contextmenuKey &&
        !document.querySelector(".menuUl").contains(e.target)
      ) {
        if (this.vms.type === "container") {
          let {
            width: mWidth,
            height: mHeight,
            left: mLeft,
            top: mTop
          } = this.vms;
          this.$markContainer = { mWidth, mHeight, mLeft, mTop, vm: this.vms };
        } else if (this.vms.$parent.type === "container") {
          let {
            width: mWidth,
            height: mHeight,
            left: mLeft,
            top: mTop
          } = this.vms.$parent;
          this.$markContainer = {
            mWidth,
            mHeight,
            mLeft,
            mTop,
            vm: this.vms.$parent
          };
        }
        this.hideContextmenu();
        status = 3;
        this.showMark();
      } else {
        status = 2;
      }
    } else if (
      className.indexOf("symbolComp") != -1 ||
      className == "markView symbolMark"
    ) {
      status = 2;
    } else if (className.indexOf("moveLine") != -1) {
      this.ddom = e.target;
      status = 5;
      this.hideContextmenu();
    } else if (className.indexOf("contents") != -1) {
      this.clearVms();
      this.hideContextmenu();
      this.showMenu({ classes: 66 });
    } else {
      if (!document.querySelector(".menuUl").contains(e.target)) {
        this.hideContextmenu();
      }
    }
    if (status === null) return;
    console.log("开始");
    document.onmousemove = event => {
      this.hideContextmenu();
      this.moves(event, status, direction, index);
      this.draging = true;
    };
    this.dragStatus = status;
  }
  cloneNode(el) {
    this.vms = el.cloneNode(true);
    this.vms.classList.add("moving");
    let width = el.offsetWidth;
    let height = el.offsetHeight;
    this.vms.isClone = true;
    this.vms.style.position = "absolute";
    this.vms.style.width = width + "px";
    this.vms.style.height = height + "px";
    this.vms.style.left = this.x - width / 2 + "px";
    this.vms.style.top = this.y - height / 2 + "px";
    this.vms.style.zIndex = 2000;
    document.body.appendChild(this.vms);
  }
  moves(event, status, direction) {
    let x = Math.round((event.clientX - this.x) / this.scale);
    let y = Math.round((event.clientY - this.y) / this.scale);
    if (status === 5) {
      var myParent = this.ddom.parentElement;
      var top = myParent.children[0];
      var bottom = myParent.children[2];
      var allHeight = myParent.offsetHeight;
      var myTopHeight =
        (parseFloat(top.style.height.split("(")[1].split("%")[0]) / 100) *
        allHeight;
      myTopHeight = myTopHeight + y;
      var a = (100 * myTopHeight) / allHeight;
      if (a <= 15) {
        a = 15;
      }
      var b = 100 - a;
      top.style.height = `calc(${a}% - 3px)`;
      bottom.style.height = `calc(${b}%)`;
      this.x = event.clientX;
      this.y = event.clientY;
    }
    if (!this.$mark.used) {
      if (!this.vms) return;
      if (!(this.vms instanceof Array)) {
        if (this.vms.locked || this.vms.isCompose) return;
      } else if (
        this.vms.length &&
        (this.vms[0].locked || this.vms[0].isCompose)
      ) {
        return;
      }
    }

    switch (status) {
      case 0:
        var width = this.vms.offsetWidth;
        var height = this.vms.offsetHeight;
        console.log(width, height);
        this.vms.style.top = event.clientY - width / 2 + "px";
        this.vms.style.left = event.clientX - height / 2 + "px";
        break;
      case 1:
        if (direction.indexOf("top") != -1) {
          this.backFn(vm => {
            let height = vm.height - y;
            if (height <= 0) {
              return;
            }
            vm.top = vm.top + y;
            vm.height = vm.height - y;
          });
        }
        if (direction.indexOf("left") != -1) {
          this.backFn(vm => {
            let width = vm.width - x;
            if (width <= 0) {
              return;
            }
            vm.left = vm.left + x;
            vm.width = vm.width - x;
          });
        }
        if (direction.indexOf("right") != -1) {
          this.backFn(vm => {
            vm.width = vm.width + x;
          });
        }
        if (direction.indexOf("bottom") != -1) {
          this.backFn(vm => {
            vm.height = vm.height + y;
          });
        }
        break;
      case 2:
        this.backFn(vm => {
          var parentWidth = vm.$parentEl.clientWidth;
          var parentHeight = vm.$parentEl.clientHeight;
          if (vm.left + x < -vm.width / 2) {
            vm.left = -vm.width / 2;
          } else if (vm.left + x > parentWidth - vm.width / 2) {
            vm.left = parentWidth - vm.width / 2;
          } else {
            vm.left = vm.left + x;
          }
          if (vm.top + y < -vm.height / 2) {
            vm.top = -vm.height / 2;
          } else if (vm.top + y > parentHeight - vm.height / 2) {
            vm.top = parentHeight - vm.height / 2;
          } else {
            vm.top = vm.top + y;
          }
          !(this.vms instanceof Array) &&
            this.vms.$el.classList.add("re-positioning");
          // console.log(this.centerConfigs[this.currentPageId].comps);
          let pageComps = this.centerConfigs[this.currentPageId].comps;
          this.guidLine.showGuidLines(
            pageComps,
            this.vms instanceof Array ? this.vms : [this.vms],
            this.scale,
            event
          );
        });
        break;
      case 3:
        if (Math.abs(this.$mark.width) > 2 && Math.abs(this.$mark.height) > 2) {
          this.$mark.showMark = true;
        }
        var { mWidth, mHeight, mLeft, mTop } = this.$markContainer;
        var padding = parseInt(this.$vm.otherStyle.padding.slice(0, -2));
        var newWidth = this.$mark.width + x;
        var newHeight = this.$mark.height + y;
        var rwidth = mWidth + mLeft + padding - this.$mark.left;
        var rheight = mHeight + mTop + padding - this.$mark.top;
        var lwidth = mLeft + padding - this.$mark.left;
        var lheight = mTop + padding - this.$mark.top;
        if (newWidth > 0) {
          this.$mark.width = newWidth > rwidth ? rwidth : newWidth;
        } else {
          this.$mark.width = newWidth > lwidth ? newWidth : lwidth;
        }
        if (newHeight > 0) {
          this.$mark.height = newHeight > rheight ? rheight : newHeight;
        } else {
          this.$mark.height = newHeight > lheight ? newHeight : lheight;
        }

        this.$mark.resetStyle();
        break;

      case 4:
        var { pageX, pageY } = event;
        var current = {
          x: pageX - this.rotateCenter.x,
          y: pageY - this.rotateCenter.y
        };
        var DEG_SCALE = 3;
        var o_rotateDeg = this.o_rotateDeg;
        var back_roateDeg = this.vms.transform;
        var rotateDeg = this.calcDeg(
          current,
          this.startPos,
          o_rotateDeg,
          back_roateDeg,
          DEG_SCALE
        );
        this.vms.transform = rotateDeg;
        this.end_deg = rotateDeg;
        this.startPos = current;
        this.vms.resizeHeight();
        break;
      default:
        break;
    }

    this.x = event.clientX;
    this.y = event.clientY;
  }

  calcDeg(current, origin, o_rotateDeg, o_backupDeg, deg_scale) {
    let o = Math.sqrt(origin.x * origin.x + origin.y * origin.y);
    let c = Math.sqrt(current.x * current.x + current.y * current.y);
    let z = Math.sqrt(
      Math.pow(current.x - origin.x, 2) + Math.pow(current.y - origin.y, 2)
    );
    let cosZ = (Math.pow(o, 2) + Math.pow(c, 2) - Math.pow(z, 2)) / (2 * o * c);
    let zPI = Math.acos(cosZ);
    let zDeg = 180 / (Math.PI / zPI);
    //叉乘判断鼠标顺序 为负值 标识逆时针 为正值 表示顺时针
    let crossMultiply = origin.x * current.y - origin.y * current.x;
    let newDeg = Number(o_rotateDeg + zDeg);
    if (crossMultiply < 0) {
      newDeg = Number(o_rotateDeg - zDeg);
    }
    if (newDeg >= 360) {
      newDeg = 0;
    } else if (newDeg < 0) {
      newDeg = 360 + newDeg;
    }
    this.o_rotateDeg = o_rotateDeg = newDeg;
    if (o_backupDeg % 90 === 0) {
      if (
        o_rotateDeg >
          (o_backupDeg === 0 ? (crossMultiply < 0 ? 360 : 0) : o_backupDeg) -
            deg_scale &&
        o_rotateDeg <
          (o_backupDeg === 0 ? (crossMultiply < 0 ? 360 : 0) : o_backupDeg) +
            deg_scale
      ) {
        return o_backupDeg;
      }
    } else {
      if (newDeg % 90 >= 90 - deg_scale && newDeg % 90 < 90) {
        newDeg = 90 * (Math.floor(newDeg / 90) + 1);
      } else if (newDeg % 90 <= deg_scale && newDeg % 90 > 0) {
        newDeg = 90 * Math.floor(newDeg / 90);
      }
    }
    newDeg = Math.round(newDeg >= 360 ? 0 : newDeg);

    return newDeg;
  }

  backFn(fn) {
    let obj = this.vms;
    if (obj instanceof Array) {
      obj.forEach(vm => {
        fn(vm);
        vm.resetStyle();
      });
      return;
    } else {
      fn(obj);
      obj.resetStyle();
    }
  }
  ends(event) {
    this.guidLine.clearLines();
    if (!this.$contextmenuKey) {
      this.$contextmenuKey = false;
    }
    console.log("结束");
    this.draging = false;
    this.x = null;
    this.y = null;
    document.onmousemove = null;
    this.copyEvent = event;
    if (this.$mark.used) {
      this.$mark.showMark = false;
      // this.$mark.$el.style.display = "none";
      this.getMultiSymbols(this.$mark.config, this.$mark.height > 0);
      this.$mark.width = 0;
      this.$mark.height = 0;
      this.$mark.used = false;
      this.$markContainer = null;
    }

    let { pageX: eX, pageY: eY } = event;

    let positionChanged = eX !== this.startX || eY !== this.startY;

    if (this.vms) {
      !(this.vms instanceof Array) &&
        this.vms?.$el?.classList?.remove("re-positioning");
      if (this.dragStatus === 2 && positionChanged) {
        //拖拽组件 位置变换了 记录历史
        if (positionChanged) {
          this.vms.$nextTick(() => {
            this.$history.setHistory(1);
          });
        }
      }

      //旋转操作下记录历史
      if (this.dragStatus === 4) {
        if (this.start_deg !== this.end_deg) {
          this.vms.$nextTick(() => {
            this.$history.setHistory(1);
          });
        }
      }
      if (this.vms.isClone) {
        this.vms.isClone = false;
        let config = JSON.parse(this.vms.getAttribute("data-config"));
        document.body.removeChild(this.vms);
        let checkCreate = this.checkCreateSymbol(event, config);
        if (checkCreate) return;
        let scale = this.$vm.config["页面缩放"].value;
        let _vm;
        if (config._type === "自定义") {
          _vm = this.createCustomSymbol(event, config.config);
        } else {
          _vm = this.createSymbol(config, {
            x: event.clientX / scale,
            y: event.clientY / scale
          });
        }

        this.$vm.$nextTick(() => {
          this.showMenu(_vm);
          this.$vm.$nextTick(() => {
            this.$history.setHistory(3);
          });
        });
      } else if (
        this.vms &&
        !(this.vms instanceof Array) &&
        !(this.vms instanceof HTMLElement)
      ) {
        // this.vms.resetStyle();
      }
    }
    this.dragStatus = null;
  }

  destory() {
    document.removeEventListener("mousedown", this.startFn);
    document.removeEventListener("mouseup", this.endFn);
    document.removeEventListener("keyup", this.keyUpFn);
    window.onbeforeunload = null;
  }
}
export default Drag;
