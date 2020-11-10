<template>
  <div class="symbolDiv" @click.stop="selectSymbol" :style="styles">
    <div class="content">
      <component
        ref="comp"
        :is="currentComp"
        :theme="$store.getters.theme"
      ></component>
    </div>
  </div>
</template>

<script>
import { getComp } from "@/util/common.js";
export default {
  data() {
    return {
      currentComp: null,
      type: null,
      classes: null,
      transform: 0,
      width: 300,
      height: 200,
      left: 20,
      top: 100,
      zIndex: 10,
      compConfig: null
    };
  },
  mounted() {
    this.currentComp = getComp(this.type);
    this.$nextTick(() => {
      let comp = this.$refs.comp;
      Object.assign(comp.$data, this.compConfig);
      comp.initStyle(true);
      this.$drag.collect(comp);
    });
  },
  methods: {
    resetStyle() {
      let config = this.$refs.comp.baisicConfig;
      if (config["尺寸"]) {
        config["尺寸"].value = [this.width, this.height];
        config["位置"].value = [this.left, this.top];
      }
    },
    initStyle([width, height], [left, top], transform) {
      this.width = width;
      this.height = height;
      this.left = left;
      this.top = top;
      this.transform = transform;
    },
    confirms(remind) {
      return new Promise(resolve => {
        if (remind) {
          this.$confirm("确定执行吗?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消"
          })
            .then(() => {
              resolve();
            })
            .catch(() => {});
        } else {
          resolve();
        }
      });
    },
    //切换页面
    changePage(remind, pageId) {
      this.confirms(remind).then(() => {
        this.$drag.$left.selectPage(pageId);
      });
    },
    //执行脚本
    runtimeJsContent(remind, str) {
      this.confirms(remind).then(() => {
        eval(str);
      });
    },
    //开关切换
    openOff(remind, eventConfig) {
      this.confirms(remind).then(() => {
        this.$drag.openOff(eventConfig).then(res => {
          this.$message({
            type: "success",
            message: res
          });
        });
      });
    },
    //赋值
    assignValue(remind, eventConfig) {
      this.confirms(remind).then(() => {
        this.$drag.assignValue(eventConfig).then(res => {
          this.$message({
            type: "success",
            message: res
          });
        });
      });
    },
    selectSymbol() {
      let comp = this.$refs.comp;
      let events = comp.highConfig["事件"];
      if (!events) return;
      //     { label: "切换页面", value: 0 },
      // { label: "开关切换", value: 1 },
      // { label: "执行脚本", value: 2 },
      // { label: "赋值", value: 3 },
      // { label: "绑定容器", value: 4 }
      events.value.forEach(type => {
        if (type.order !== undefined) {
          switch (type.order) {
            case 0:
              this.changePage(events.remind, type.pageId);
              break;
            case 1:
              //开关切换
              this.openOff(events.remind, type);
              break;
            case 2:
              this.runtimeJsContent(events.remind, type.jsContent);
              break;
            case 3:
              this.assignValue(events.remind, type);
              break;
            case 4:
              break;
            default:
              break;
          }
        }
      });
      console.log("操作");
    }
  },
  beforeDestroy() {
    this.$parent.$el.children[0].removeChild(this.$el);
  },
  computed: {
    styles() {
      return {
        width: this.width + "px",
        height: this.height + "px",
        left: this.left + "px",
        top: this.top + "px",
        transform: `rotate(${this.transform}deg)`,
        zIndex: this.zIndex
      };
    }
  }
};
</script>

<style lang="less" scoped>
.themeWhite {
  .symbolDiv {
    color: black;
    &.multiple {
      background: rgba(222, 232, 255, 0.8);
      border: 1px dashed #4c84ff;
      box-sizing: border-box;
    }
  }
}
.themeBlack {
  .symbolDiv {
    color: white;
    &.multiple {
      background: rgba(222, 232, 255, 0.8);
    }
  }
}

.symbolDiv {
  position: absolute;

  // transition: top 0.2s, left 0.2s;
  &.single {
    .tagLens {
      display: block;
    }
  }

  .content {
    height: 100%;
    width: 100%;
    z-index: 2;
    overflow: hidden;
  }
}
</style>
