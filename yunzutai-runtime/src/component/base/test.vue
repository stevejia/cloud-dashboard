<template>
  <!-- 组件内容不细说，该有的都有，该有的样式变化要有变化 -->
  <div class="symbolComp" @click="goPages" :style="styles">我是dema</div>
</template>
<script>
//必要---保持一致：配置转换器，命名规范：test.vue test.js
import translateConfig from "./test.js";
import mixin from "@/component/mixin.js";
export default {
  mixins: [mixin],
  methods: {
    goPages() {
      // console.log(this.$chint.getCurrentPageConfig());
      // console.log(this.$chint.getCurrentPageID());
      // this.$chint.routerPush("页面");
      this.$chint
        .request({
          url: "http://cloudconfigserver.cloud.techsel.net/api/pointsdata",
          // url: window.config.requestUrl + "/api/pointsdata",
          methods: "get",
          info: "获取点位配置",
          params: {
            pid: "1ef1ea58892748a3baac2c46ba9dd5ec"
          }
        })
        .then(res => {
          console.log(res);
        });
    },
    toSearch(val) {
      if (this.$store.state.runtime) {
        console.log(val);
        //val是一个对象，是日期选择器返回的对象
      }
    },
    getData() {
      if (this.$store.state.runtime) {
        let treeId = this.highConfig["树形图"].value;
        if (treeId) {
          console.log(this.$drag.getTreeData(treeId));
          //获取当前绑定的树组件数据
        }
      }
    },

    //配置转换：必要---保持一致：读取南京配置之后，对应的配置要转换成我们自身的配置，该方法是入口，会传入南京这个组件的配置
    translateConfig(item) {
      return translateConfig(item);
    },
    //组件初始化调用，在拿到最新数据之后，在这里设置高度与字体大小初始比例
    init() {
      console.log("init");
    },
    //resetComp（bool）高度变化，字体跟着变化，可以进行样式属性重新赋值
    //bool：false----高度一直在变化，这个时候不能进行图表重绘
    //bool：true---高度最后一次变化，这个时候应该进行图表重绘
    resetComp(bool) {
      console.log(bool);
    },
    /**
     * 必要：当配置属性更改之后，组件需要做响应的动作，
     * @param {Bollean} bool 配置更改触发initStyle，会执行this.$parent.initStyle方法，其余都不会
     */

    //bool: true表示是右侧属性变化触发的initStyle事件,不应该手动调用这个方法
    //type:变化源,那个基础属性变化触发了这个方法，需要在属性vue中使用：onChange(this.title)
    initStyle(bool, type) {
      console.log(type);
      let { theme, baisicConfig } = this.startInitStyle();

      //这里进行一些当前组件属性的转换与使用
      this.styles = {
        color: theme.color
      };
      console.log(baisicConfig);

      this.endInitStyle(bool);
    }
  },
  data() {
    return {
      styles: {}, //最终应用到template上面，内容由initStyle负责
      white: {
        //由于测试组件只有一个样式，将其提升为变量color
        字体样式0: "#000000"
      },
      black: {
        字体样式0: "#FFFFFF"
      },
      //高级属性，对于已有的属性：可见，闪烁，颜色切换，颜色响应，
      //以及基础事件（切换页面,绑定容器等）这些功能均已实现，运行态功能也已实现
      //如果发现新的高级属性有这样的功能：测点值变换，需要响应到当前组件，这个时候需要报备一下，
      //且对于这些事件的数据转换规则，我已在tranlate.js中包含（日期组件，树形图没有--没有对应的实例）
      highConfig: {
        添加响应: {
          type: "explain"
        },
        可见: {
          type: "eventVisible",
          value: {
            pointId: [],
            rule: ""
          }
        },
        添加事件1: {
          type: "explain"
        },
        闪烁: {
          type: "eventOpacity",
          value: {
            pointId: [],
            rule: ""
          }
        },
        添加事件2: {
          type: "explain"
        },
        颜色切换: {
          type: "eventColorChange",
          value: {
            pointId: "",
            highColor: "",
            highValue: "",
            lowColor: "",
            lowValue: "",
            writeable: false,
            passwordStatus: false,
            role: ""
          }
        },
        添加事件3: {
          type: "explain"
        },
        颜色响应: {
          type: "eventColor",
          value: {
            pointId: [],
            colorList: [
              {
                color: "",
                start: "",
                end: ""
              }
            ]
          }
        },
        添加事件5: {
          type: "explain"
        },
        事件: {
          type: "event",
          remind: false,
          value: [
            {
              order: "",
              result: [{ pointId: [], value: "" }]
            }
          ]
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
          value: [0, 0]
        },
        位置: {
          type: "widthHeight",
          label: ["横轴", "纵轴"],
          value: [0, 0]
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
          value: 100
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
          value: 0
        }
      }
    };
  }
};
</script>

<style lang="less" scoped>
.symbolComp {
  width: calc(100%);
  height: calc(100%);
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  white-space: pre;
  overflow: hidden;
}
</style>
