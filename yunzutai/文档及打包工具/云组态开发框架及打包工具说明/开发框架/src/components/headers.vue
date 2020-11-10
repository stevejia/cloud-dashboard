<template>
  <div class="header" :style="bodyStyle">
    <div class="left" v-show="logoVisible || subVisible">
      <img v-show="logoVisible" :src="logoUrl" />
      <span v-show="subVisible" :style="subStyle">{{ subtitle }}</span>
    </div>
    <div class="center" :style="titleLocation">
      <span :data-content="title" :style="titleStyle">{{ title }}</span>
    </div>
    <div class="right">
      <div v-show="config['天气'].value[4]" :style="skyStyle" class="weather">
        123123
      </div>
      <div v-show="config['运行时间'].value" class="runtime">
        安全运行99天9时9分9秒
      </div>
      <div class="icon"><span class="iconfont el-icon-full-screen"></span></div>
      <div class="icon">
        <span class="iconfont el-icon-bell"></span>
      </div>
      <div class="icon">
        <span
          class="iconfont el-icon-user-solid
"
        ></span>
      </div>
    </div>
  </div>
</template>

<script>
import logo from "@/assets/image/chnt-b.svg";
import { packFont } from "@/util/common.js";
export default {
  props: {
    config: Object
  },
  data() {
    return {
      bodyStyle: {},
      logoUrl: "",
      logoVisible: true,
      subVisible: true,
      title: "",
      titleStyle: {},
      titleLocation: {},
      subtitle: "",
      subStyle: {},
      skyStyle: {}
    };
  },
  created() {
    this.initStyle();
  },
  methods: {
    initStyle() {
      this.skyStyle = this.config["天气"].value[4]
        ? packFont(this.config["天气"].value)
        : {};
      this.title = this.config["标题"].value[0];
      let textShadows = this.config["标题阴影"].value;
      let sliderGradient = !this.config["标题渐变色"].hidden
        ? {}
        : {
            "--deg": this.config["标题渐变色"].value[1] + "deg",
            "--gradient": this.config["标题渐变色"].value[0]
          };
      this.titleLocation = {
        justifyContent: this.config["标题位置"].value
      };
      this.titleStyle = Object.assign(
        packFont(this.config["标题"].value.slice(1)),
        {
          textShadow: textShadows[4] ? textShadows.slice(0, -1).join(" ") : ""
        },
        sliderGradient
      );
      this.logoUrl = this.config["Logo"].value[0] || logo;
      this.logoVisible = this.config["Logo"].value[2];
      this.subVisible = this.config["副标题"].value[5];
      this.subtitle = this.config["副标题"].value[0];
      this.subStyle = packFont(this.config["副标题"].value.slice(1));
      this.bodyStyle = {
        background: this.config["背景色"].value,
        boxShadow: this.config["边框发光色"].value + " 0px 0px 10px 0px inset"
      };
    }
  }
};
</script>
<style lang="less" scoped>
.header {
  color: white;
  display: flex;
  width: calc(100%);
  flex-direction: row;
  .left {
    width: 200px;
    height: calc(100%);
    display: flex;
    flex-direction: column;
    text-align: center;
    justify-content: center;
    img {
      height: 22px;
      padding-bottom: 5px;
    }
  }
  .right {
    min-width: 200px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
    font-size: 14px;
    .weather {
      margin-right: 30px;
    }
    .runtime {
      margin-right: 30px;
    }
    .icon {
      margin-right: 30px;
    }
  }
  .center {
    flex: 1;
    height: calc(100%);
    position: relative;
    display: flex;
    align-items: center;
    padding-left: 25px;
    span {
      position: relative;
      &::after {
        position: absolute;
        content: attr(data-content);
        text-decoration: none;
        left: 0px;
        z-index: 2;
        color: var(--gradient);
        -webkit-mask-image: -webkit-gradient(
          linear,
          left top,
          left bottom,
          from(var(--deg)),
          color-stop(#000),
          to(transparent)
        );
        -webkit-mask-image: linear-gradient(var(--deg), #000, transparent);
        -webkit-mask-size: 100% 100%;
      }
    }
  }
}
</style>
