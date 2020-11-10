import DomOperate from "./domOperate";
class Drag extends DomOperate {
  init(vm) {
    // this.draging = false;
    this.startFn = this.starts.bind(this);
    // this.endFn = this.ends.bind(this);
    this.keyUpFn = this.keyUp.bind(this);
    // document.addEventListener("mousedown", this.startFn);
    // document.addEventListener("mouseup", this.endFn);
    document.addEventListener("keyup", this.keyUpFn);
    document.addEventListener("click", this.startFn);
    // this.initRotateResize();
    super.init(vm);
  }
  keyUp(event) {
    if (event.keyCode === 27) {
      this.$vm.$chint.offFullScreen();
    }
  }
  starts(e) {
    if (!document.querySelector(".menuUl").contains(e.target)) {
      this.hideContextmenu();
    }
  }
  destory() {
    document.removeEventListener("click", this.startFn);
    document.removeEventListener("keyup", this.keyUpFn);
  }
}
export default Drag;
