<template>
  <div class="symbolComp" :style="styles">
    <div class="canvas-wrapper">
      <!--canvas 绘制区-->
      <canvas ref="canvas" width="800" height="600"></canvas>
      <div
        class="drawLine"
        ref="drawWrapper"
        @mousedown="tapZone"
        @mouseup="drawMouseup"
        @mousemove="drawMove"
      >
        <div class="point-wrapper">
          <template v-for="item in pointArr">
            <div v-for="(item2, index2) in item" :key="item2.id">
              <div
                class="mini-box point-can"
                :class="{ curPoint: curPoint.id == item2.id }"
                :style="{ left: item2.x + 'px', top: item2.y + 'px' }"
                @mousedown.stop.prevent="pointMousedown(item2, index2, item)"
                @dblclick="pointClick(item, index2)"
              ></div>
              <div
                class="mini-cir"
                v-for="(item3, index3) in item2.circle"
                v-show="item3 && item3.show"
                :key="index3"
                :style="{ left: item3.x + 'px', top: item3.y + 'px' }"
                @mousedown.stop.prevent="circleMousedown(item2, index3)"
              ></div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import mixin from "@/component/mixin.js";
export default {
  mixins: [mixin],
  props: {
    theme: String
  },
  methods: {
    init() {
      if (!this.$store.state.runtime) return;
    },
    initStyle(bool) {
      this.startInitStyle();

      this.styles = {
        opacity: this.baisicConfig["显示度"].value / 100,
        backgroundColor: this.baisicConfig["背景颜色"].value
      };

      this.drawPath();
      this.endInitStyle(bool);
    },

    // 点击创建锚点
    tapZone(e) {
      if (e.button == 2) return; // 右键不运行
      let point = {
        x: e.offsetX - 6,
        y: e.offsetY - 6,
        circle: []
      };
      let length = this.pointArr.length; // 线条组长度
      let curPoints = []; // 当前线条
      let idStr = Math.floor(Math.random() * 10000);
      // 判断当前是否已有线段
      if (length) {
        for (let i = 0; i < this.pointArr.length; i++) {
          const item = this.pointArr[i];
          if (item.length <= 1) continue;
          for (let n = 0; n < item.length; n++) {
            let index = n - 1;
            // console.log(n, item[n]);
            if (n == 0 && item[0].isClose) {
              index = item.length - 1;
            } else if (n == 0) {
              continue;
            }
            // console.log(item[index], item[n]);
            let res = this.inBezier(item[index], item[n], [
              point.x + 6,
              point.y + 6
            ]);
            if (res) {
              point.id = `line${i}_` + "po" + idStr;
              if (n == 0 && item[0].isClose) {
                delete item[0].isClose;
                point.isClose = true;
              }
              item.splice(n, 0, point);
              this.drawPath();
              this.curPoint = point;
              return;
            }
          }
        }
        curPoints = this.pointArr[length - 1];
        // 判断最后一条线段是否已闭合
        if (curPoints[0] && curPoints[0].isClose) {
          point.id = `line${length}_` + "po" + idStr;
          this.pointArr.push([point]);
        } else {
          point.id = `line${length - 1}_` + "po" + idStr;
          curPoints.push(point);
        }
      } else {
        point.id = "line0_" + "po" + idStr;
        this.pointArr.push([point]);
      }
      this.curPoint = point;
      this.drawPath();
    },

    // 锚点鼠标按下事件
    pointMousedown(item, index, lineItem) {
      this.curPoint = item;
      if (window.event.altKey) {
        this.keyState.alt = true;
        this.curTarget = item;
      } else if (window.event.ctrlKey) {
        this.keyState.ctrl = true;
        this.curTarget = item;
      } else if (index == 0 && !item.isClose && lineItem.length > 2) {
        item.isClose = true;
      }
      // 隐藏多余圆点辅助线
      this.toggleCircle(lineItem, index);
      this.drawPath();
    },

    // 锚点鼠标松开事件
    drawMouseup() {
      this.keyState.alt = false;
      this.keyState.ctrl = false;
    },

    // 锚点拖动事件
    drawMove(e) {
      let dom = this.$refs.drawWrapper.getBoundingClientRect();
      // 计算鼠标在画布上的相对坐标
      let eDomX = e.pageX - dom.left - 6;
      let eDomY = e.pageY - dom.top - 6;
      if (this.keyState.ctrl) {
        if (this.curTarget.circle) {
          // 拖动锚点
          if (this.curTarget.circle.length) {
            // 圆点跟随锚点变化
            this.curPoint.circle = [
              {
                x: eDomX - this.curPoint.x + this.curPoint.circle[0].x,
                y: eDomY - this.curPoint.y + this.curPoint.circle[0].y,
                online: this.curPoint.circle[0].online,
                show: true
              },
              {
                x: eDomX - this.curPoint.x + this.curPoint.circle[1].x,
                y: eDomY - this.curPoint.y + this.curPoint.circle[1].y,
                show: true
              }
            ];
          }
          this.curPoint.x = eDomX;
          this.curPoint.y = eDomY;
        } else {
          // 拖动圆点
          this.curTarget[0].x = eDomX;
          this.curTarget[0].y = eDomY;
          this.curTarget[0].show = true;
          this.curTarget[1].show = true;
          if (this.curTarget[0].online || this.curTarget[1].online) {
            let X = this.curTarget[0].x - this.curTarget[2].x; // 当前点击圆点与锚点的距离
            let Y = this.curTarget[0].y - this.curTarget[2].y;
            let cX = this.curTarget[1].x - this.curTarget[2].x;
            let cY = this.curTarget[1].y - this.curTarget[2].y;

            let sLength = Math.sqrt(X * X + Y * Y); // 计算当前圆点与锚点的长度
            let cLength = Math.sqrt(cX * cX + cY * cY); // 计算与当前点击圆点成对的另一个圆点与锚点的长度

            if (sLength && cLength) {
              let mul1 = (X / sLength).toFixed(2);
              let mul2 = (Y / sLength).toFixed(2);
              // 根据当前圆点相对于锚点的位置设置与之对应的圆点的坐标，使得当前圆点与对应圆点永远在一条直线上
              this.curTarget[1].x = this.curTarget[2].x - cLength * mul1;
              this.curTarget[1].y = this.curTarget[2].y - cLength * mul2;
            }
          }
        }
        this.drawPath();
      }
      if (this.keyState.alt) {
        if (this.curTarget.circle) {
          // 拖动锚点
          if (!this.curPoint.circle.length) {
            this.curPoint.circle = [
              { x: eDomX, y: eDomY, online: true, show: true },
              { x: eDomX, y: eDomY, show: true }
            ];
          } else {
            this.curPoint.circle = [
              { x: eDomX, y: eDomY, online: true, show: true },
              {
                x: 2 * this.curPoint.x - eDomX,
                y: 2 * this.curPoint.y - eDomY,
                show: true
              }
            ];
          }
        } else {
          // 拖动圆点
          this.curTarget[0].x = eDomX;
          this.curTarget[0].y = eDomY;
          this.curTarget[0].show = true;
          this.curTarget[1].show = true;
          if (this.curTarget[0].online) this.curTarget[0].online = false;
          if (this.curTarget[1].online) this.curTarget[1].online = false;
        }
        this.drawPath();
      }
    },

    // 圆点按下事件
    circleMousedown(item, index) {
      this.curTarget = [item.circle[index], item.circle[index ? 0 : 1], item];
      if (window.event.altKey) {
        this.keyState.alt = true;
      }
      if (window.event.ctrlKey) {
        this.keyState.ctrl = true;
      }
    },

    // 双击删除锚点
    pointClick(item, index) {
      let delItem = item.splice(index, 1);
      // console.log(item, delItem);
      if (item.length <= 2 && item[0] && item[0].isClose) {
        item[0].isClose = false;
      } else if (item.length > 2 && index == 0 && delItem[0].isClose) {
        item[0].isClose = true;
      }
      this.drawPath();
    },

    // 隐藏/显示 圆点辅助线
    toggleCircle(points, index) {
      let pointArr = this.pointArr;
      for (let i = 0; i < pointArr.length; i++) {
        pointArr[i].forEach(item => {
          if (item.circle.length) {
            item.circle[0].show = false;
            item.circle[1].show = false;
          }
        });
      }
      if (points[index].circle.length) {
        points[index].circle[0].show = true;
        points[index].circle[1].show = true;
      }
      if (points[index - 1] && points[index - 1].circle.length) {
        points[index - 1].circle[1].show = true;
      }
      if (points[index + 1] && points[index + 1].circle.length) {
        points[index + 1].circle[0].show = true;
      }
      if (
        index == 0 &&
        points.length > 2 &&
        points[0].isClose &&
        points[points.length - 1].circle.length
      ) {
        points[points.length - 1].circle[1].show = true;
      } else if (
        index == points.length - 1 &&
        points.length > 2 &&
        points[0].isClose &&
        points[0].circle.length
      ) {
        points[0].circle[1].show = true;
      }
    },

    // 描绘线段
    drawPath() {
      let pointArr = this.pointArr;
      let canvas = this.$refs.canvas;
      let ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, 800, 600);
      ctx.strokeStyle = this.baisicConfig["线条颜色"].value;
      ctx.lineWidth = 1;
      // 虚线，绘制圆点与锚点的连线
      ctx.setLineDash([3]);
      for (let i = 0; i < pointArr.length; i++) {
        const points = pointArr[i];
        points.forEach(item => {
          if (item.circle.length) {
            ctx.beginPath();
            if (item.circle[0].show && item.circle[1].show) {
              ctx.moveTo(item.circle[0].x + 6, item.circle[0].y + 6);
              ctx.lineTo(item.x + 6, item.y + 6);
              ctx.lineTo(item.circle[1].x + 6, item.circle[1].y + 6);
            } else if (item.circle[0].show) {
              ctx.moveTo(item.circle[0].x + 6, item.circle[0].y + 6);
              ctx.lineTo(item.x + 6, item.y + 6);
            } else if (item.circle[1].show) {
              ctx.moveTo(item.x + 6, item.y + 6);
              ctx.lineTo(item.circle[1].x + 6, item.circle[1].y + 6);
            }
            ctx.stroke();
          }
        });
      }
      // 实线，绘制锚点间的连线
      ctx.setLineDash([]);
      ctx.lineWidth = this.baisicConfig["线条粗细"].value;
      // 绘制不同线段
      pointArr.forEach(points => {
        ctx.beginPath();
        // 绘制同一条线上的锚点连线
        for (let i = 0; i < points.length; i++) {
          let item = points[i];
          let preItem = points[i - 1];
          if (i == 0) {
            ctx.moveTo(item.x + 6, item.y + 6);
          } else {
            this.drawBezier(preItem, item, ctx);
          }
        }
        if (points[0] && points[0].isClose) {
          this.drawBezier(points[points.length - 1], points[0], ctx);
          ctx.stroke();
          ctx.closePath();
          ctx.fillStyle = this.baisicConfig["填充颜色"].value;
          ctx.fill();
        } else {
          ctx.stroke();
        }
      });
    },

    // 贝塞尔曲线绘制判断
    drawBezier(preItem, item, ctx) {
      if (preItem.circle.length && !item.circle.length) {
        ctx.quadraticCurveTo(
          preItem.circle[1].x + 6,
          preItem.circle[1].y + 6,
          item.x + 6,
          item.y + 6
        );
      } else if (!preItem.circle.length && item.circle.length) {
        ctx.quadraticCurveTo(
          item.circle[0].x + 6,
          item.circle[0].y + 6,
          item.x + 6,
          item.y + 6
        );
      } else if (preItem.circle.length && item.circle.length) {
        ctx.bezierCurveTo(
          preItem.circle[1].x + 6,
          preItem.circle[1].y + 6,
          item.circle[0].x + 6,
          item.circle[0].y + 6,
          item.x + 6,
          item.y + 6
        );
      } else {
        ctx.lineTo(item.x + 6, item.y + 6);
      }
    },

    // 计算坐标点是否在曲线上
    inBezier(preItem, item, param) {
      let x1 = preItem.x + 6;
      let y1 = preItem.y + 6;
      let x2 = item.x + 6;
      let y2 = item.y + 6;
      let [x, y] = param;
      let res;
      let flag = false;
      if (
        (preItem.circle.length && !item.circle.length) ||
        (!preItem.circle.length && item.circle.length)
      ) {
        let cx = preItem.circle[1]
          ? preItem.circle[1].x + 6
          : item.circle[0].x + 6;
        let cy = preItem.circle[1]
          ? preItem.circle[1].y + 6
          : item.circle[0].y + 6;
        let a = x2 + x1 - 2 * cx;
        let b = 2 * cx - 2 * x1;
        let c = x1 - x;
        res = this.twocalculation(a, b, c);
        for (let i = 0; i < res.length; i++) {
          let t = res[i];
          if (1 < t || t < 0) continue;
          let y3 = (1 - t) * (1 - t) * y1 + 2 * t * (1 - t) * cy + t * t * y2;
          if (y - 10 < y3 && y3 < y + 10) {
            flag = true;
            break;
          }
        }
      } else if (preItem.circle.length && item.circle.length) {
        let cx1 = preItem.circle[1].x + 6;
        let cy1 = preItem.circle[1].y + 6;
        let cx2 = item.circle[0].x + 6;
        let cy2 = item.circle[0].y + 6;
        let a = x2 + 3 * cx1 - 3 * cx2 - x1;
        let b = 3 * x1 - 6 * cx1 + 3 * cx2;
        let c = 3 * cx1 - 3 * x1;
        let d = x1 - x;

        res = this.threecalculation(a, b, c, d);
        for (let i = 0; i < res.length; i++) {
          let t = res[i];
          if (1 < t || t < 0) continue;
          let y3 =
            y1 * (1 - t) * (1 - t) * (1 - t) +
            3 * cy1 * t * (1 - t) * (1 - t) +
            3 * cy2 * t * t * (1 - t) +
            y2 * t * t * t;
          if (y - 2 < y3 && y3 < y + 2) {
            flag = true;
            break;
          }
        }
      } else {
        let t = (x - x1) / (x2 - x1);
        let y3 = y1 + (y2 - y1) * t;
        if (
          y - 5 < y3 &&
          y3 < y + 5 &&
          ((x1 <= x && x <= x2) || (x2 <= x && x <= x1))
        ) {
          flag = true;
        }
      }
      return flag;
    },

    // 一元二次求根
    twocalculation(a, b, c) {
      let D = Math.sqrt(b * b - 4 * a * c);
      let x1 = (-b + D) / (2 * a);
      let x2 = (-b - D) / (2 * a);
      return [x1, x2];
    },
    // 一元三次方求根
    threecalculation(a, b, c, ld) {
      let rd = 0;
      let d = ld - rd; //移项使得右边为零
      let A = b * b - 3 * a * c;
      let B = b * c - 9 * a * d;
      let C = c * c - 3 * b * d; //三个重根判别式
      let detal = B * B - 4 * A * C; //总判别式
      let x1, x2, x3;

      if (A == 0 && B == 0) {
        x1 = -c / b;
        x2 = -b / (3 * a);
        x3 = (-3 * d) / c;
      } else if (detal > 0) {
        let X1 = A * b + 3 * a * ((1 / 2) * (-B + Math.sqrt(detal)));
        let X2 = A * b + 3 * a * ((1 / 2) * (-B - Math.sqrt(detal)));
        let Y1, Y2;
        //负数开立方会返回Null,所以要做一下操作
        if (X1 >= 0) {
          Y1 = Math.pow(X1, 1 / 3);
        } else {
          Y1 = -Math.pow(-X1, 1 / 3);
        }
        if (X2 >= 0) {
          Y2 = Math.pow(X2, 1 / 3);
        } else {
          Y2 = -Math.pow(-X2, 1 / 3);
        }
        x1 = (-b - Y1 - Y2) / (3 * a);
        x2 = (-2 * b + Y1 + Y2) / (6 * a);
        // x2_real = (-2 * b + Y1 + Y2) / (6 * a);
        // x3_real = x2_real;
        // x2_virtual = (Math.sqrt(3) * (Y1 - Y2)) / (6 * a);
        // x3_virtual = -x2_virtual;
      } else if (detal == 0) {
        x1 = -b / a + B / A;
        x2 = -B / (2 * A);
        x3 = x2;
      } else {
        let T = (2 * A * b - 3 * a * B) / (2 * Math.sqrt(A * A * A));
        let Xita = Math.acos(T);
        x1 = (-b - 2 * Math.sqrt(A) * Math.cos(Xita / 3)) / (3 * a);
        x2 =
          (-b +
            Math.sqrt(A) *
              (Math.cos(Xita / 3) + Math.sin(Xita / 3) * Math.sqrt(3))) /
          (3 * a);
        x3 =
          (-b +
            Math.sqrt(A) *
              (Math.cos(Xita / 3) - Math.sin(Xita / 3) * Math.sqrt(3))) /
          (3 * a);
      }
      return [x1, x2, x3];
    }
  },
  data() {
    return {
      styles: {},
      black: {
        背景颜色: "rgba(36, 36, 45, 0.5)",
        填充颜色: "rgba(0, 0, 0, 0)",
        线条颜色: "#1984ec"
      },
      white: {
        背景颜色: "rgba(36, 36, 45, 0.5)",
        填充颜色: "rgba(0, 0, 0, 0)",
        线条颜色: "#1984ec"
      },
      baisicConfig: {
        尺寸: {
          type: "widthHeight",
          label: ["宽度", "高度"],
          value: [0, 0]
        },
        位置: {
          type: "widthHeight",
          label: ["横轴", "纵轴"],
          value: [0, 0]
        },
        线条1: {
          type: "line"
        },
        背景颜色: {
          type: "color-select",
          value: ""
        },
        填充颜色: {
          type: "color-select",
          value: ""
        },
        线条颜色: {
          type: "color-select",
          value: ""
        },
        线条粗细: {
          type: "slider",
          status: 1,
          range: [0, 10],
          value: 1
        },
        显示度: {
          type: "slider",
          status: 1,
          range: [0, 100],
          value: 100
        },
        样式还原: {
          type: "resetStyle"
        },
        线条2: {
          type: "line"
        },
        旋转角度: {
          type: "slider",
          status: 1,
          range: [0, 360],
          value: 0
        }
      },
      pointArr: [],
      keyState: {
        alt: false,
        ctrl: false
      },
      curPoint: {},
      curTarget: {}
    };
  }
};
</script>

<style lang="less" scoped>
.symbolComp {
  width: calc(100%);
  height: calc(100%);
  box-sizing: border-box;
  overflow: hidden;
  .canvas-wrapper {
    position: relative;
    text-align: left;
    .drawLine {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 999;
      width: 800px;
      height: 600px;
      border-bottom: 1px solid #333;
      border-right: 1px solid #333;
      .point-wrapper {
        position: relative;
        .mini-box {
          position: absolute;
          width: 9px;
          height: 9px;
          border: 1px solid #1984ec;
          background-color: #ffffff;
          cursor: pointer;
          &.curPoint {
            background: #1984ec;
          }
        }
        .mini-cir {
          position: absolute;
          display: inline-block;
          width: 9px;
          height: 9px;
          border: 1px solid #1984ec;
          background-color: #ffffff;
          border-radius: 5px;
        }
      }
    }
  }
}
</style>
