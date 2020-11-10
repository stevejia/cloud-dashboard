<template>
  <div
    class="datacomparison-container"
    :style="styles"
    @click="toggleMode($event)"
  >
    <div :class="['icon', status ? 'active' : '']" :style="iconStyles"></div>
    <!-- <div class="icon" :style="iconStyles"></div> -->
    <p>
      <span class="tag" :style="tagStyles">{{ title }}</span>
    </p>
    <el-dialog
      title="请输入密码"
      :visible.sync="showPasswordDialog"
      width="30%"
      :append-to-body="true"
    >
      <el-input v-model="password"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showPasswordDialog = false">取 消</el-button>
        <el-button type="primary" @click="onConfirmPassword">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { initStyle, getBasicConfig, changeTheme } from "../common";
import { bulkSet } from "@/api/bulk.js";
const originHeight = 130;
const originFontSize = 10;
const originTextFontSize = 16;
const originPercent = 47;
const originPadding = 0.9;
const originWH = 2.4;
let lastHeight = 130;
let lastTag = "上班";
// const mapUnit = {
//   用电量: "Kwh",
//   用水量: "t",
//   用气量: "m³",
//   耗热量: "Kwh"
// };

const mapTag = {
  上班: {
    icon: "work"
  },
  下班: {
    icon: "offwork"
  },
  值班: {
    icon: "onduty"
  },
  放假: {
    icon: "holiday"
  },
  节能: {
    icon: "energysave"
  },
  回家: {
    icon: "gohome"
  },
  离家: {
    icon: "leavehome"
  },
  迎宾: {
    icon: "welcome"
  },
  演讲: {
    icon: "speech"
  },
  讨论: {
    icon: "discuss"
  },
  手动: {
    icon: "hand"
  },
  自动: {
    icon: "automatic"
  },
  明亮: {
    icon: "bright"
  },
  舒适: {
    icon: "comfortable"
  },
  休闲: {
    icon: "leisure"
  },
  全开: {
    icon: "fullopen"
  },
  全关: {
    icon: "alloff"
  }
};
const yztPermiss = [
  {
    counter: 0,
    grade: "65535",
    id: "5a359b2f88d644c2ab034d51514fa218",
    label: "超级管理员",
    password: "123456"
  },
  {
    counter: 1,
    grade: "1",
    id: "edf25a60a19a11eaac6c1584933b5f45",
    label: "权限名称2",
    password: "111111"
  },
  {
    counter: 1,
    grade: "9999999",
    id: "edf25a60a19a11eaac6c1584933b5f45",
    label: "权限名称3",
    password: "222222"
  }
];

let currentPermissId = "";

const themeMappingKeys = {
  字体: ["value", 2],
  背景颜色: ["value"],
  边框颜色: ["value"]
};
let initialWhite = null;
let initialBlack = null;
export default {
  props: ["theme"],
  data() {
    return {
      styles: {},
      textStyles: {},
      iconStyles: {},
      tagStyles: {},
      triangleStyles: {},
      verticalLineStyles: {},
      white: {
        字体: "#455A64",
        背景颜色: "#FFFFFF",
        边框颜色: "#FFFFFF"
      },
      black: {
        字体: "#B2DDFF",
        背景颜色: "#24252A",
        边框颜色: "rgba(0, 0, 0, 0)"
      },
      widthHeight: [400, originHeight],
      position: [0, 0],
      title: "上班模式",
      smallIcon3: "上班",
      scenePercent: 47,
      font: [16, "Microsoft Yahei", "#b2ddff"],
      // background: "",
      modeBackground: [true, "#ffffff", "#ffffff"],
      borderColor: "#FFFFFF",
      borderWidth: 1,
      opacity: 100,
      resetStyle_: null,
      rotateDeg: 0,
      trend: 10,
      tagIcon: "temp",
      webinfos: {
        eventable: true,
        numconfirm: true,
        render: false,
        permissId: "5a359b2f88d644c2ab034d51514fa218",
        visdev: [
          "4ae0a89cfa334dd6a22682bed01b9e7c",
          "5a84c98b9b7d4379ba9ede79578e0929",
          "3a495b23613941078341232b29ee09ec"
        ],
        vistf: 0,
        wbEventList: [
          {
            closenum: "1",
            curdevchar: [
              "6a261f57d90140f38117ce2f9a3af063",
              "c7d281fcb2dd4d359e80950f89b42337"
            ],
            startnum: "0"
          }
        ]
      },
      status: true,
      password: "",
      showPasswordDialog: false
    };
  },
  created() {
    getBasicConfig.bind(this)();
    let { black, white } = this;
    initialWhite = JSON.parse(JSON.stringify(white));
    initialBlack = JSON.parse(JSON.stringify(black));
    this.changeTheme(this.$store.getters.theme);
  },
  mounted() {
    // this.timer = setInterval(() => {
    //   let val = Math.random() >= 0.5 ? 1 : 0;
    //   this.pointIdChange(val);
    // }, 3000);
  },
  watch: {
    "$store.getters.theme"(newVal) {
      if (!newVal) {
        return;
      }
      this.changeTheme(newVal, true);
    }
  },
  methods: {
    returnConfig() {
      let point = this.highConfig["数据源"].value.pointId;
      let collectPointIds = [[...point]];
      return {
        collectPointIds,
        white: this.white,
        black: this.black,
        highConfig: this.highConfig,
        baisicConfig: this.baisicConfig
      };
    },
    resetComp(bool) {
      if (!bool) {
        console.log(this.baisicConfig);
        this.calcBaseFontSize();
        // console.log(this.baisicConfig);
      }
    },
    initStyle(bool) {
      initStyle(
        bool,
        this,
        styles => {
          this.styles = { ...this.styles, ...styles };
          let modeBgConfig = this.baisicConfig["模式按钮背景颜色"];
          if (modeBgConfig) {
            let modeBgData = modeBgConfig.value;
            let status = modeBgData[0];
            let openColor = modeBgData[1];
            let closeColor = modeBgData[2];

            let bgColor = openColor;
            if (!status) {
              bgColor = closeColor;
            }
            this.styles.backgroundColor = bgColor;
            this.status = status;
          }
          this.calcBaseFontSize();

          let titleConfig = this.baisicConfig["标题"];
          if (titleConfig) {
            let title = titleConfig.value;
            if (title) {
              this.title = title;
            }
          }

          let iStyles = {};
          let percentConfig = this.baisicConfig["前景占比（0% - 100%）"];
          if (percentConfig) {
            let percent = percentConfig.value || 60;
            let newPadding = (percent / originPercent) * originPadding;
            let widthHeight = (percent / originPercent) * originWH;
            iStyles.padding = `${newPadding}em`;
            iStyles.width = `${widthHeight}em`;
            iStyles.height = `${widthHeight}em`;
            iStyles.minWidth = `${widthHeight}em`;
            iStyles.minHeight = `${widthHeight}em`;
          }
          let tagConfig = this.baisicConfig["选择小图标"];
          if (tagConfig) {
            let tag = tagConfig.value;
            if (tag) {
              let tagInfo = mapTag[tag] || {};
              this.tagIcon = tagInfo.icon;
              iStyles.backgroundImage = `url('/static/img/sub/mode/${tagInfo.icon}.svg')`;
              if (lastTag !== tag) {
                this.title = `${tag}模式`;
                this.baisicConfig["标题"].value = this.title;
                lastTag = tag;
              }
            }
          }

          let itFontConfig = this.baisicConfig["字体"];
          let tagStyles = {};
          if (itFontConfig) {
            let itFont = itFontConfig.value;
            if (itFont && itFont.length) {
              tagStyles.color = itFont[2];
              tagStyles.fontSize = `${itFont[0]}px`;
              tagStyles.fontFamily = itFont[1];
            }
          }
          this.tagStyles = tagStyles;
          this.iconStyles = iStyles;
        },
        themeMappingKeys
      );
    },
    resetStyle() {
      this.white = { ...initialWhite };
      this.black = { ...initialBlack };
      this.changeTheme(this.$store.getters.theme);
    },
    themeChangeCallback(theme) {
      let bgColor = this[theme]["背景颜色"];
      let modeBgConfig = this.baisicConfig["模式按钮背景颜色"].value;
      modeBgConfig[1] = bgColor;
      modeBgConfig[2] = bgColor;
      this.baisicConfig["模式按钮背景颜色"].value = modeBgConfig;
    },
    changeTheme(themeName, isChange) {
      changeTheme.bind(this)(
        themeName,
        themeMappingKeys,
        isChange,
        this.themeChangeCallback
      );
    },
    calcBaseFontSize() {
      let whConfig = this.baisicConfig["尺寸"];
      if (whConfig) {
        let widthHeight = whConfig.value;
        if (widthHeight && widthHeight.length === 2) {
          let oFont = [...this.baisicConfig["字体"].value];
          let height = widthHeight[1];
          let newFontSize = 10;
          let newTextFontSize = oFont[0];
          if (+height === lastHeight) {
            this.textStyles = {
              ...this.textStyles,
              ...{ fontSize: `${newTextFontSize}px` }
            };
            return;
          }
          let scale = height / originHeight;
          newFontSize = Math.floor(originFontSize * scale);
          newTextFontSize = Math.floor(originTextFontSize * scale);
          let fontSizeStyle = `${newFontSize}px`;
          this.styles = { ...this.styles, ...{ fontSize: fontSizeStyle } };
          //   this.baisicConfig[""]
          console.log(newTextFontSize);
          oFont[0] = newTextFontSize;
          this.baisicConfig["字体"].value = oFont;

          this.tagStyles = {
            ...this.tagStyles,
            ...{ fontSize: `${newTextFontSize}px` }
          };
          lastHeight = height;
        }
      }
    },
    toggleMode(event) {
      if (!this.$store.getters.runtime) {
        return;
      }
      event.stopPropagation();
      event.preventDefault();
      // webinfos: {
      //   eventable: true,
      //   numconfirm: false,
      //   render: false,
      //   visdev: [],
      //   vistf: 0,
      //   wbEventList: [
      //     {
      //       closenum: "",
      //       curdevchar: -1,
      //       startnum: ""
      //     }
      //   ]
      // },
      const { pointId: visdev, rule: vistf } = this.highConfig["数据源"].value;
      if (!visdev || visdev.length === 0) {
        this.$message({
          type: "warning",
          message: "未绑定响应位号"
        });
        return;
      }
      const {
        numconfirm,
        render,
        eventable,
        wbEventList,
        permissId
      } = this.highConfig["模式切换"].data;
      currentPermissId = permissId;
      let flag = wbEventList.some(we => {
        return !we.curdevchar || we.curdevchar.length === 0;
      });
      if (flag) {
        this.$message({
          type: "warning",
          message: "未绑定控制位号"
        });
        return;
      }

      flag = wbEventList.every(we => {
        return we.startnum !== "" && we.closenum !== "";
      });

      if (!flag) {
        this.$message({
          type: "warning",
          message: "需要填写开启和关闭控制值"
        });
        return;
      }
      if (eventable) {
        this.$confirm("确定执行吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消"
        })
          .then(() => {
            if (numconfirm) {
              this.showPasswordDialog = true;
              this.password = "";
            } else {
              this.setMode();
            }
          })
          .catch(() => {});
      } else {
        alert(2);
      }
      console.log(permissId, vistf, render);
    },
    onConfirmPassword() {
      console.log(this.password);
      this.showPasswordDialog = false;
      const item = yztPermiss.find(per => {
        return per.password === this.password;
      });
      if (!item) {
        this.$message({ type: "error", message: "密码错误!" });
        return;
      }
      const bindItem = yztPermiss.find(per => {
        return per.id === currentPermissId;
      });
      if (!bindItem) {
        this.$message({ type: "error", message: "权限等级数据异常!" });
        return;
      }
      if (bindItem.grade > item.grade) {
        this.setMode();
      } else {
        this.$message({ type: "error", message: "权限等级不足!" });
      }
    },
    async setMode() {
      console.log("setMode");
      const { pointId: visdev, rule: vistf } = this.highConfig["数据源"].value;
      let pointValues = [
        {
          pointId: visdev[visdev.length - 1],
          value: vistf
        }
      ];
      let data = await bulkSet(pointValues);
      let statusCode = data.statusCode;
      if (statusCode == 200) {
        this.$message({ message: data.message, type: "success" });
      } else {
        this.$message({ message: data.message, type: "warning" });
      }
    },
    pointIdChange(val) {
      const { rule: vistf } = this.highConfig["数据源"].value;
      this.status = val === +vistf;
    }
  }
};
</script>

<style scoped>
.datacomparison-container {
  font-size: 10px;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding-left: 1.5em;
  padding-right: 1.5em;
  box-sizing: border-box;
  white-space: nowrap;
  overflow: hidden;
  position: relative;
}

.datacomparison-container .date {
  position: absolute;
  left: 0.25em;
  top: 0.25em;
  font-size: 1.2em;
}

.datacomparison-container .icon {
  font-size: 1em;
  /* padding: 0.9em; */

  width: 2.4em;
  height: 2.4em;
  padding: 0.9em;
  background-color: #3573c1;
  display: inline-block;
  background-repeat: no-repeat;
  background-size: 60% 60%;
  background-position: 50%;
  /* margin-right: 1.2em; */
  border-radius: 50%;
  vertical-align: middle;
  /* margin-right: 1.2em; */
  position: relative;
}

.datacomparison-container .icon.active {
  background-color: #e53f3f;
}

.left {
  font-size: 1em;
  padding-right: 1.2em;
  display: flex;
  align-items: center;
  width: 50%;
  box-sizing: border-box;
  color: rgb(241, 146, 28);
  overflow: hidden;
}
.line {
  height: 40%;
  width: 2px;
  background: #18191d;
}
.right {
  font-size: 1em;
  color: #b2ddff;
  padding-left: 1.2em;
  width: calc(50% - 2px);
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
}

.right .top {
  margin: 0;
  padding: 0;
}

.right .bottom {
  margin: 0;
  padding: 0;
  margin-top: 0.8em;
}

.datacomparison-container .left .tag {
  color: #f1921c;
}

.text-content {
  font-size: 1em;
  min-width: 8.4em;
  display: flex;
  align-items: center;
}

.text-content .alarm {
  color: #e53f3f !important;
}

.point {
  background: #e53f3f;
  border-radius: 100%;
}
</style>
