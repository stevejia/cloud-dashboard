const VERTICAL = 1;
const HORIZONTAL = 0;
//1.5px趋近
const APPROACHING_SCALE = 1.5;
const EDITOR_CENTER_BORDER_WIDTH = 2;
const DIR_LEFT = "DIR_LEFT";
const DIR_VERTICAL = "DIR_VERTICAL";
const DIR_RIGHT = "DIR_RIGHT";
const DIR_TOP = "DIR_TOP";
const DIR_BOTTOM = "DIR_BOTTOM";
const DIR_HORIZONTAL = "DIR_HORIZONTAL";
const DIRECTION_CONFIG = {
  DIR_LEFT: 0,
  DIR_VERTICAL: 0.5,
  DIR_RIGHT: 1,
  DIR_TOP: 0,
  DIR_HORIZONTAL: 0.5,
  DIR_BOTTOM: 1
};
class GuideLine {
  constructor(parentEl) {
    this.position = { left: null };
    this.parentEl = parentEl;
  }
  showGuidLines(comps, currentComps, scale, event) {
    let availableComps = comps.filter(comp => {
      return !comp.deleted;
    });
    let { pageX, pageY } = event;
    //记录触发事件时 鼠标的位置 用于判断有辅助线的情况下 移动APPROACHING_SCALE后 辅助线消失的逻辑
    this.pageX = pageX;
    this.pageY = pageY;
    this.containerEl = currentComps[0].$el.parentElement.parentElement;
    // this.createDistanceLine(100, 100, 200, 300);
    this.scale = scale;
    this.clearLines();
    this.currentCompIds = currentComps.map(comp => {
      return comp.id;
    });
    this.showLeftGuideLine(availableComps, currentComps);
    this.showTopGuideLine(availableComps, currentComps);
    this.showVerticalCenterLines(availableComps, currentComps);
    this.showHorizontalCenterLines(availableComps, currentComps);
    this.showRightGuideLines(availableComps, currentComps);
    this.showBottomGuideLines(availableComps, currentComps);
  }
  showTopGuideLine(comps, currentComps) {
    this.genLines(comps, currentComps, DIR_TOP);
  }

  showLeftGuideLine(comps, currentComps) {
    this.genLines(comps, currentComps, DIR_LEFT);
  }

  /**
   * 当若干个组件处于垂直居中的时候
   * @param {page的组件} comps
   * @param {当前拖动的组件} currentComps
   */
  showVerticalCenterLines(comps, currentComps) {
    this.genLines(comps, currentComps, DIR_VERTICAL);
  }

  showRightGuideLines(comps, currentComps) {
    this.genLines(comps, currentComps, DIR_RIGHT);
  }
  /**
   * 当若干个组件处于垂直居中的时候
   * @param {page的组件} comps
   * @param {当前拖动的组件} currentComps
   */
  showHorizontalCenterLines(comps, currentComps) {
    this.genLines(comps, currentComps, DIR_HORIZONTAL);
  }

  /**
   * 当若干个组件处于垂直居中的时候
   * @param {page的组件} comps
   * @param {当前拖动的组件} currentComps
   */
  showBottomGuideLines(comps, currentComps) {
    this.genLines(comps, currentComps, DIR_BOTTOM);
  }

  genLines(comps, currentComps, position) {
    if (!comps || !comps.length) {
      return;
    }

    if (!currentComps || !currentComps) {
      return;
    }

    //目前只支持单个组件拖动对齐
    let currentComp = currentComps[0];
    if (
      position === DIR_LEFT ||
      position === DIR_VERTICAL ||
      position === DIR_RIGHT
    ) {
      this.genVerticalLines(comps, currentComp, position);
    } else if (
      position === DIR_TOP ||
      position === DIR_HORIZONTAL ||
      position === DIR_BOTTOM
    ) {
      this.genHorizontalLines(comps, currentComp, position);
    }
  }

  genVerticalLines(comps, currentComp, position) {
    let compareComps = comps.filter(comp => {
      return (this.currentCompIds || []).indexOf(comp.id) === -1;
    });
    let offset = DIRECTION_CONFIG[position];
    let {
      left: curLeft,
      top: curTop,
      width: curWidth,
      height: curHeight
    } = currentComp;
    let curVerticalCenter = curLeft + curWidth * offset;
    let matchedComps = compareComps.filter(ccomp => {
      // let { left, top, width, height } = ccomp;
      let { left, width } = ccomp;
      let center = left + width * offset;
      // return left === curLeft;
      return Math.abs(curVerticalCenter - center) <= APPROACHING_SCALE;
    });
    if (matchedComps && matchedComps.length && currentComp) {
      let matchedComp = matchedComps[0];
      let { left: mLeft, width: mWidth } = matchedComp;
      currentComp.left = mLeft + mWidth * offset - curWidth * offset;
      let minTop = curTop;
      let maxTop = curTop + curHeight;

      // let topDistanceLeft = curLeft;
      let marginTop = Number.MAX_SAFE_INTEGER;
      let marginTopWidth = curWidth;
      let marginBottom = Number.MAX_SAFE_INTEGER;
      let marginBottomWidth = curWidth;
      // let bottomDistanceLeft = curLeft;
      matchedComps.forEach(mc => {
        minTop = Math.min(mc.top, minTop);
        maxTop = Math.max(mc.top + mc.height, maxTop);
        let mt = curTop - mc.top - mc.height;
        if (mt > 0) {
          if (mt <= marginTop) {
            marginTopWidth = Math.min(mc.width, marginTopWidth);
            // topDistanceLeft = mc.left;
          }
          marginTop = Math.min(mt, marginTop);
        }
        // mt = mt < 0 ? 0 : mt;
        let mb = mc.top - (curTop + curHeight);
        // mb = mb < 0 ? 0 : mb;
        if (mb > 0) {
          if (mb <= marginBottom) {
            marginBottomWidth = Math.min(mc.width, marginBottomWidth);
            // bottomDistanceLeft = mc.left;
          }
          marginBottom = Math.min(mb, marginBottom);
        }
        let newLeft = mLeft + mWidth * offset - curWidth * offset;
        // currentComp.left = mc.left;
        currentComp.left = newLeft;
        curLeft = newLeft;
      });
      if (marginTop !== Number.MAX_SAFE_INTEGER) {
        let left = curLeft + curWidth * offset;
        let right = left;
        let top = curTop - marginTop;
        let bottom = curTop;
        this.createDistanceLine(left, right, top, bottom);

        // marginTop = null;
      }
      if (marginBottom !== Number.MAX_SAFE_INTEGER) {
        let left = curLeft + curWidth * offset;
        let right = left;
        let top = curTop + curHeight;
        let bottom = curTop + curHeight + marginBottom;
        this.createDistanceLine(left, right, top, bottom);
        // marginBottom = null;
      }
      console.log(marginTop, marginBottom);
      this.createVerticalLine(curLeft + curWidth * offset, minTop, maxTop);
    }
  }

  genHorizontalLines(comps, currentComp, position) {
    let compareComps = comps.filter(comp => {
      return (this.currentCompIds || []).indexOf(comp.id) === -1;
    });
    let offset = DIRECTION_CONFIG[position];
    let {
      left: curLeft,
      top: curTop,
      width: curWidth,
      height: curHeight
    } = currentComp;
    let curHorizontalCenter = curTop + curHeight * offset;
    let matchedComps = compareComps.filter(ccomp => {
      // let { left, top, width, height } = ccomp;
      let { top, height } = ccomp;
      let center = top + height * offset;
      // return left === curLeft;
      return Math.abs(curHorizontalCenter - center) <= APPROACHING_SCALE;
    });
    if (matchedComps && matchedComps.length && currentComp) {
      let matchedComp = matchedComps[0];
      let { top: mTop, height: mHeight } = matchedComp;
      currentComp.top = mTop + mHeight * offset - curHeight * offset;
      let minLeft = curLeft;
      let maxLeft = curLeft + curWidth;

      // let topDistanceLeft = curLeft;
      let marginLeft = Number.MAX_SAFE_INTEGER;
      let marginLeftHeight = curHeight;
      let marginRight = Number.MAX_SAFE_INTEGER;
      let marginRightHeight = curHeight;
      // let bottomDistanceLeft = curLeft;
      matchedComps.forEach(mc => {
        minLeft = Math.min(mc.left, minLeft);
        maxLeft = Math.max(mc.left + mc.width, maxLeft);
        let ml = curLeft - mc.left - mc.width;
        if (ml > 0) {
          if (ml <= marginLeft) {
            marginLeftHeight = Math.min(mc.height, marginLeftHeight);
            // topDistanceLeft = mc.left;
          }
          marginLeft = Math.min(ml, marginLeft);
        }
        // mt = mt < 0 ? 0 : mt;
        let mr = mc.left - (curLeft + curWidth);
        // mb = mb < 0 ? 0 : mb;
        if (mr > 0) {
          if (mr <= marginRight) {
            marginRightHeight = Math.min(mc.height, marginRightHeight);
            // bottomDistanceLeft = mc.left;
          }
          marginRight = Math.min(mr, marginRight);
        }
        let newTop = mTop + mHeight * offset - curHeight * offset;
        // currentComp.left = mc.left;
        currentComp.top = newTop;
        curTop = newTop;
      });
      if (marginLeft !== Number.MAX_SAFE_INTEGER) {
        let top = curTop + curHeight * offset;
        let bottom = top;
        let left = curLeft - marginLeft;
        let right = curLeft;
        // let left = curLeft + curWidth * offset;
        // let right = left;
        // let top = curTop - marginTop;
        // let bottom = curTop;
        this.createDistanceLine(left, right, top, bottom);

        // marginTop = null;
      }
      if (marginRight !== Number.MAX_SAFE_INTEGER) {
        let top = curTop + curHeight * offset;
        let bottom = top;
        let left = curLeft + curWidth;
        let right = curLeft + curWidth + marginRight;

        // let left = curLeft + curWidth * offset;
        // let right = left;
        // let top = curTop + curHeight;
        // let bottom = curTop + curHeight + marginBottom;
        this.createDistanceLine(left, right, top, bottom);
        // marginBottom = null;
      }
      // console.log(marginTop, marginBottom);
      this.createHorizontalLine(curTop + curHeight * offset, minLeft, maxLeft);
    }
  }

  createHorizontalLine(top, minLeft, maxLeft) {
    minLeft -= 5;
    maxLeft += 10;
    this.createLine(minLeft, maxLeft, top, top, HORIZONTAL);
    // let left = (left + right) / 2;
    // let top = minTop +
    // this.createDisLine(left, top, width, distance, VERTICAL);
  }
  createVerticalLine(left, minTop, maxTop) {
    minTop -= 5;
    maxTop += 10;
    this.createLine(left, left, minTop, maxTop, VERTICAL);
    // let left = (left + right) / 2;
    // let top = minTop +
    //     this.createDisLine(left, top, width, distance, VERTICAL);
  }
  createLine(minLeft, maxLeft, minTop, maxTop, direction) {
    let lineWidth = maxLeft - minLeft;
    let lineHeight = maxTop - minTop;
    let computedStyle = getComputedStyle(this.containerEl);
    let paddingLeft = +computedStyle.paddingLeft.split("px")[0];
    let paddingTop = +computedStyle.paddingTop.split("px")[0];
    let borderWidth = EDITOR_CENTER_BORDER_WIDTH;
    let lineEl = document.createElement("div");
    lineEl.style.position = "absolute";
    lineEl.style.left = `${(minLeft + borderWidth) * this.scale +
      paddingLeft}px`;
    lineEl.style.top = `${(minTop + borderWidth) * this.scale + paddingTop}px`;
    lineEl.style.width = `${lineWidth * this.scale}px`;
    lineEl.style.height = `${lineHeight * this.scale}px`;
    lineEl.style.zIndex = 1499;
    lineEl.boxSizing = "border-box";
    lineEl.classList.add("guide-line");
    if (direction === HORIZONTAL) {
      lineEl.style.borderTop = "1px dashed red";
    } else if (direction === VERTICAL) {
      lineEl.style.borderLeft = "1px dashed red";
    }

    this.containerEl.append(lineEl);
  }

  createDistanceLine(left, right, top, bottom) {
    let width = right - left;
    let height = bottom - top;
    let distance = Math.max(width, height);
    let computedStyle = getComputedStyle(this.containerEl);
    let paddingLeft = +computedStyle.paddingLeft.split("px")[0];
    let paddingTop = +computedStyle.paddingTop.split("px")[0];
    let borderWidth = EDITOR_CENTER_BORDER_WIDTH;
    // let template = `<div class="guide-line" style="position: absolute; left: ${left}px; top: ${top}px;">
    //   <div class="tick-top" style=""></div>
    //   <div style="position: absolute; left: 0px; top: 0px; width: ${width || 1}px; height: ${height || 1}px; background: red; "></div>
    //   <div style="position: absolute; left: 20px; top: ${distance / 2 - 7}px; ">${distance}</div>
    // </div>`;
    let template = `<div class="guide-line" style="position: absolute; left: ${(left +
      borderWidth) *
      this.scale +
      paddingLeft}px; top: ${(top + borderWidth) * this.scale +
      paddingTop}px; z-index: 1499;">
      ${
        width === 0
          ? `<div class="tick-top" style="width: 10px; position: absolute; left: -5px; top: 0; height: 1px; background: red;"></div>
        <div class="tick-bottom" style="width: 10px; position: absolute; left: -5px; top: ${(distance -
          1) *
          this.scale}px; height: 1px; background: red;"></div>`
          : ""
      }
      ${
        height === 0
          ? `<div class="tick-top" style="width: 1px; position: absolute; left: 0px; top: -5px; height: 10px; background: red;"></div>
        <div class="tick-bottom" style="width: 1px; position: absolute; left: ${(distance -
          1) *
          this.scale}px; top: -5px; height: 10px; background: red;"></div>`
          : ""
      }
      <div style="position: absolute; left: 0px; top: 0px; width: ${width *
        this.scale || 1}px; height: ${height * this.scale ||
      1}px; background: red; "></div>
      ${
        width === 0
          ? `<div style="position: absolute; left: 10px; top: ${(distance / 2 -
              7) *
              this.scale}px; color: red;">${distance}</div>`
          : ""
      }
      ${
        height === 0
          ? `<div style="position: absolute; left: ${(distance / 2 - 7) *
              this.scale}px; top: 10px; color: red;">${distance}</div>`
          : ""
      }
    </div>`;
    let node = document.createRange().createContextualFragment(template);
    this.containerEl.append(node);
  }
  // createDisLine(min, max, distance, direction) {

  // }
  clearLines() {
    let allLines = document.querySelectorAll("._home .contents .guide-line");
    allLines.forEach(line => {
      line.remove();
    });
  }
}

export default GuideLine;
