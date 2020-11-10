<template>
  <div class="header" :style="bodyStyle">
    <div class="left" v-show="logoVisible || subVisible">
      <img
        v-show="logoVisible"
        :src="logoUrl"
        :style="{ height: config['启用Logo'].num + '%' }"
      />
      <span v-show="subVisible" :style="subStyle">{{ subtitle }}</span>
    </div>
    <div class="center" :style="titleLocation">
      <div :style="titleShadow">
        <span :data-content="title" :style="titleStyle">{{ title }}</span>
      </div>
    </div>
    <div class="right">
      <div
        v-show="config['启用天气'].value[4]"
        :style="skyStyle"
        class="weather"
      >
        <i
          :style="{ marginRight: '10px', fontSize: weatherImgSize + 'px' }"
          :class="['iconfont', imgs]"
        ></i>
        <span>{{ weatherInfo }}</span>
      </div>
      <div v-show="config['启用运行时间'].value" class="runtime">
        {{ appRunTimeText }}
      </div>
      <Screenfull class="hover-effect" />
      <div class="icon messege" @click="showWarnDialog">
        <el-badge is-dot class="item">
          <span class="iconfont iconxiaoxi"></span>
        </el-badge>
      </div>
      <el-dropdown
        @command="handleCommand"
        trigger="click"
        placement="bottom-end"
      >
        <div class="icon el-dropdown-link cirle-box">
          <span class="iconfont iconmorentouxiang"></span>
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
            :title="loginName"
            style=" white-space: nowrap;overflow: hidden; text-overflow: ellipsis;"
            command="1"
          >
            <span class="iconfont iconwode1" style="margin-right: 4px;"></span>
            {{ loginName }}
          </el-dropdown-item>
          <el-dropdown-item command="1">
            <span class="iconfont iconxiugai" style="margin-right: 4px;"></span
            >修改密码
          </el-dropdown-item>
          <el-dropdown-item command="2" divided>
            <span class="iconfont iconjiben" style="margin-right: 4px;"></span
            >项目列表
          </el-dropdown-item>
          <el-dropdown-item command="3" divided v-if="admin.userLevel == 1">
            <span class="iconfont iconwode1" style="margin-right: 4px;"></span
            >用户管理
          </el-dropdown-item>
          <el-dropdown-item command="4" divided>
            <div @click.stop="() => {}" style="display:inline-block;">
              <el-checkbox v-model="alarmSound"></el-checkbox>
            </div>
            <span> 启动报警声音</span>
          </el-dropdown-item>
          <el-dropdown-item command="5" divided>
            <span class="iconfont iconRight" style="margin-right: 4px;"></span
            >退出
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-dialog
      title="修改密码"
      append-to-body
      :close-on-click-modal="false"
      :visible.sync="userPassDialog"
      width="30%"
    >
      <el-form
        :model="passForm"
        ref="passForm"
        label-width="120px"
        :rules="ruleValidate2"
      >
        <el-form-item label="旧密码" prop="oldLoginPwd">
          <el-input
            type="password"
            v-model="passForm.oldLoginPwd"
            placeholder="请输入新密码"
            required
          />
        </el-form-item>
        <el-form-item label="新密码" prop="newLoginPwd">
          <el-input
            type="password"
            v-model="passForm.newLoginPwd"
            placeholder="请输入新密码"
            required
          />
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPassword">
          <el-input
            type="password"
            v-model="passForm.checkPassword"
            placeholder="请再次输入新密码"
            required
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handlePassOk('passForm')"
          >确 定</el-button
        >
        <el-button @click="handleUserCancel('passForm')">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import logoBlack from "@/assets/image/chnt-b.svg";
import logoWhite from "@/assets/image/chnt-w.svg";
import { packFont } from "@/util/common.js";
import Screenfull from "../component/screenfull/index";
import { getUser, clear } from "../util/localStorage";
import { getWeather, getAppRunTime } from "@/api/runApi.js";
import { ChangePassword } from "../api/usermanage";
export default {
  components: {
    Screenfull
  },
  data() {
    let validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入新密码"));
      } else if (value !== this.passForm.newLoginPwd) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      admin: {},
      weatherInfo: "",
      appRunTimeText: "",
      theme: null,
      white: {
        isLogo: false, //是否启用自定义logo
        logoUrl: "",
        color: "", //标题颜色
        deg: 0, //渐变角度
        gradColor: "", //渐变颜色
        topBackground: "#3573c1", //北京
        titleSdColor: "#1E88E5", //标题阴影颜色
        subColor: "#FC4B6C", //副标题颜色
        shadow: "" //边框方光色
      },
      black: {
        isLogo: false,
        logoUrl: "",
        color: "#FFFFFF",
        deg: 0,
        gradColor: "",
        topBackground: "#2d3035",
        titleSdColor: "#1E88E5",
        subColor: "#FC4B6C",
        shadow: ""
      },
      config: {
        标题: {
          type: "inputFontStyle",
          value: ["新能源科技有限公司", "22px", "", "normal", "#FFFFFF"]
        },
        启用标题渐变色: {
          type: "slider-gradient",
          used: true,
          range: [0, 360],
          value: ["", 0]
        },
        启用标题阴影: {
          type: "shadowStyle",
          value: ["", "2px", "2px", "2px", false]
        },
        标题位置: {
          type: "select",
          label: [
            {
              label: "左",
              value: "flex-start"
            },
            {
              label: "居中",
              value: "center"
            },
            {
              label: "右",
              value: "flex-end"
            }
          ],
          value: "flex-start"
        },
        启用副标题: {
          type: "inputFontStyle",
          note: "启用",
          value: ["能效综合平台", "14px", "", "normal", "#FFFFFF", true]
        },
        背景色: {
          type: "color-select",
          value: "#2d3035"
        },
        边框发光色: {
          type: "color-select",
          value: "rgba(255, 255, 255, 0)"
        },
        样式还原: {
          type: "resetStyle"
        },
        线条1: {
          type: "line"
        },
        隐藏顶部导航: {
          type: "checkbox",
          note: "启用",
          value: false
        },
        线条2: {
          type: "line"
        },
        启用Logo: {
          type: "logo",
          note: "启用",
          num: 36,
          value: ["", false, true]
        },
        线条3: {
          type: "line"
        },
        启用运行时间: {
          type: "checkbox",
          note: "启用",
          value: false
        },
        线条4: {
          type: "line"
        },
        启用天气: {
          type: "sky",
          note: "启用",
          value: ["14px", "", "", "rgba(255,255,255,1)", false, "上海"]
        }
      },
      bodyStyle: {},
      logoUrl: "",
      logoVisible: true,
      subVisible: true,
      title: "",
      titleStyle: {},
      titleShadow: {},
      titleLocation: {},
      subtitle: "",
      subStyle: {},
      skyStyle: {},
      weatherImgSize: 21,
      imgs: "iconqingtian",
      city: "上海",
      loginName: "",
      userPassDialog: false, //修改密码
      passForm: {
        id: "",
        oldLoginPwd: "",
        newLoginPwd: "",
        checkPassword: ""
      },
      ruleValidate2: {
        oldLoginPwd: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 12, message: "长度在 6 到 12 个字符", trigger: "blur" }
        ],
        newLoginPwd: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 12, message: "长度在 6 到 12 个字符", trigger: "blur" }
        ],
        checkPassword: [
          { required: true, message: "请再次输入密码" },
          { validator: validatePass2, trigger: "blur" }
        ]
      },
      alarmSound: false, //启动报警声音
      warnPage: {
        type: "",
        pageId: ""
      }
    };
  },
  watch: {
    "$store.getters.theme"(val) {
      this.theme = val;
      this.config["标题"].value[4] = this[val].color;
      this.config["背景色"].value = this[val].topBackground;
      this.config["启用标题渐变色"].value = [
        this[val].gradColor,
        this[val].deg
      ];
      this.config["启用标题阴影"].value[0] = this[val].titleSdColor;
      this.config["启用副标题"].value[4] = this[val].subColor;
      this.config["边框发光色"].value = this[val].shadow;
      this.config["启用Logo"].value[0] = this[val].logoUrl;
      this.config["启用Logo"].value[1] = this[val].isLogo;
      this.themeChange();
    }
  },
  created() {
    this.theme = this.$store.getters.theme;
    let topConfig = this.$store.state.config.stylesConfig.topConfig;
    Object.assign(this.config, topConfig.config);
    Object.assign(this.white, topConfig.white);
    Object.assign(this.black, topConfig.black);
    this.initStyle();
    this.loginName = getUser().admin.loginName;
    this.admin = getUser().admin;
    let warnConfig = this.$store.state.config.routeConfig.warnPage;
    this.warnPage = { ...warnConfig };
    console.log(this.warnPage);
  },
  mounted() {
    this.getWeathers();
  },
  methods: {
    themeChange() {
      this.initStyle();
    },
    initStyle(order) {
      let theme = this[this.theme];
      if (order === "resetStyle") {
        if (this.theme === "white") {
          theme.topBackground = "#3573c1";
          theme.color = "#FFFFFF";
          theme.deg = 0;
          theme.gradColor = "";
          theme.titleSdColor = "#1E88E5";
          theme.subColor = "#FC4B6C";
          theme.shadow = "";
        } else if (this.theme === "black") {
          theme.topBackground = "#2d3035";
          theme.color = "#FFFFFF";
          theme.deg = 0;
          theme.gradColor = "";
          theme.titleSdColor = "#1E88E5";
          theme.subColor = "#FC4B6C";
          theme.shadow = "";
        }

        this.config = {
          ...this.config,
          标题: {
            type: "inputFontStyle",
            value: ["新能源科技有限公司", "22px", "", "normal", "#FFFFFF"]
          },
          启用标题渐变色: {
            type: "slider-gradient",
            used: true,
            status: 1,
            range: [0, 360],
            value: ["", 0]
          },
          启用标题阴影: {
            type: "shadowStyle",
            value: ["", "2px", "2px", "2px", false]
          },
          标题位置: {
            type: "select",
            label: [
              {
                label: "左",
                value: "flex-start"
              },
              {
                label: "居中",
                value: "center"
              },
              {
                label: "右",
                value: "flex-end"
              }
            ],
            value: "flex-start"
          },
          启用副标题: {
            type: "inputFontStyle",
            note: "启用",
            value: ["能效综合平台", "14px", "", "normal", "#FFFFFF", true]
          },
          背景色: {
            type: "color-select",
            value: theme.topBackground
          },
          边框发光色: {
            type: "color-select",
            value: "rgba(255, 255, 255, 0)"
          }
        };
      }
      theme.topBackground = this.config["背景色"].value;
      theme.color = this.config["标题"].value[4];
      theme.deg = this.config["启用标题渐变色"].value[1];
      theme.gradColor = this.config["启用标题渐变色"].value[0];
      theme.titleSdColor = this.config["启用标题阴影"].value[0];
      theme.subColor = this.config["启用副标题"].value[4];
      theme.shadow = this.config["边框发光色"].value;

      this.skyStyle = this.config["启用天气"].value[4]
        ? packFont(this.config["启用天气"].value)
        : {};
      if (this.skyStyle && this.skyStyle.fontSize) {
        this.weatherImgSize =
          Number(this.skyStyle.fontSize.substring(0, 2)) + 7;
      }
      if (this.config["启用运行时间"].value) {
        this.getAppRunTime(this.$route.query.subProjectId);
      }
      this.title = this.config["标题"].value[0];

      this.titleStyle = !this.config["启用标题渐变色"].used
        ? {
            "--deg": "0deg"
          }
        : {
            "--deg": `${this.config["启用标题渐变色"].value[1]}deg`,
            "--gradient": this.config["启用标题渐变色"].value[0]
          };
      let shadow = this.config["启用标题阴影"].value;

      this.titleShadow = Object.assign(
        {
          textShadow: shadow[4]
            ? `${shadow[1]} ${shadow[2]} ${shadow[3]} ${shadow[0]}`
            : ""
        },
        packFont(this.config["标题"].value.slice(1))
      );
      this.titleLocation = {
        justifyContent: this.config["标题位置"].value
      };
      theme.isLogo = this.config["启用Logo"].value[1];
      if (theme.isLogo) {
        this.logoUrl = this.config["启用Logo"].value[0];
      } else {
        this.logoUrl =
          this.config["启用Logo"].value[0] ||
          (this.theme === "black" ? logoBlack : logoWhite);
      }
      theme.logoUrl = this.config["启用Logo"].value[0];
      this.logoVisible = this.config["启用Logo"].value[2];
      this.subVisible = this.config["启用副标题"].value[5];
      this.subtitle = this.config["启用副标题"].value[0];
      this.subStyle = packFont(this.config["启用副标题"].value.slice(1));
      this.bodyStyle = {
        background: this.config["背景色"].value,
        boxShadow: this.config["边框发光色"].value + " 0px 0px 10px 0px inset"
      };
    },
    getWeathers() {
      if (this.config["启用天气"].value[4]) {
        let city = this.config["启用天气"].value.slice(-1)[0];
        let citys = city[city.length - 1];
        getWeather(citys).then(res => {
          let data = res.data;
          this.weatherInfo = `${data.wea} ${data.tem1}°C~${data.tem2}°C ${data.win} ${data.win_speed} ${data.date} ${data.week} ${citys}`;
          switch (data.wea_img) {
            case "yu":
              this.imgs = "iconxiayu1";
              break;
            case "yin":
              this.imgs = "iconyintian1";
              break;
            case "yun":
              this.imgs = "iconduoyun1";
              break;
            case "xue":
              this.imgs = "iconxiaxue1";
              break;
            default:
              this.imgs = "iconqingtian";
              break;
          }
        });
      }
    },
    async getAppRunTime(projectId) {
      let { data: time } = await getAppRunTime({ AppId: projectId });
      this.getDhms(time);
      if (this.runTimeTimer) {
        clearTimeout(this.runTimeTimer);
        this.runTimeTimer = null;
      }
      this.runTimeTimer = setInterval(() => {
        time += 1000;
        this.getDhms(time);
      }, 1000);
    },

    getDhms(time) {
      if (time == +time) {
        let oneDay = 24 * 60 * 60 * 1000;
        let oneHour = 60 * 60 * 1000;
        let oneMinute = 60 * 1000;
        let onSecond = 1000;
        let days = Math.floor(time / oneDay);
        time = time - days * oneDay;
        let hours = Math.floor(time / oneHour);
        time = time - hours * oneHour;
        let minutes = Math.floor(time / oneMinute);
        time = time - minutes * oneMinute;
        let seconds = Math.floor(time / onSecond);
        seconds = seconds < 10 ? `0${seconds}` : seconds;
        minutes = minutes < 10 ? `0${minutes}` : minutes;

        let appRunTimeText = `安全运行${days}天${hours}时${minutes}分${seconds}秒`;
        if (days === 0) {
          appRunTimeText = `安全运行${hours}时${minutes}分${seconds}秒`;
          if (hours === 0) {
            appRunTimeText = `安全运行${minutes}分${seconds}秒`;
            if (minutes === 0) {
              appRunTimeText = `安全运行${seconds}秒`;
            }
          }
        }
        this.appRunTimeText = appRunTimeText;
      }
    },

    handleCommand(command) {
      if (command == "1") {
        this.handleReset();
      } else if (command == "2") {
        this.onProjectList();
      } else if (command == "3") {
        this.goUserManage();
      } else if (command == "5") {
        this.onLogout();
      }
    },
    //重置用户密码
    handleReset() {
      this.userPassDialog = true;
      this.passForm.id = getUser().admin.id;
      this.passForm.oldLoginPwd = "";
      this.passForm.newLoginPwd = "";
      this.passForm.checkPassword = "";
    },
    handlePassOk(formName) {
      this.$refs[formName].validate(async valid => {
        if (!valid) return;
        const params = {
          id: this.passForm.id,
          oldLoginPwd: this.passForm.oldLoginPwd,
          newLoginPwd: this.passForm.newLoginPwd
        };
        const res = await ChangePassword(params);
        const { statusCode } = res;
        if (statusCode === 200) {
          this.$message({ message: "修改密码成功!", type: "success" });
          this.userPassDialog = false;
        }
      });
    },
    // 去用户管理
    goUserManage() {
      this.$confirm("是否确定返回用户管理页?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        closeOnClickModal: false
      })
        .then(() => {
          let routes = this.$parent.$refs.lefters.$refs.routes.routes;
          let items = routes.filter(item => {
            if (item.linkPage == "用户管理" && item.type == "single") {
              return item;
            }
          });
          this.$parent.$refs.lefters.$refs.routes.selectRoute(
            items[0],
            undefined
          );
        })
        .catch(() => {});
    },
    onProjectList() {
      this.$confirm("是否确定返回项目列表页?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        closeOnClickModal: false
      })
        .then(() => {
          // 跳转到项目列表页面
          this.$router.replace("/project/list");
        })
        .catch(() => {});
    },
    onLogout() {
      this.$confirm("是否确定退出系统?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        closeOnClickModal: false
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "退出成功!"
          });
          clear();
          this.$store.dispatch("setShareData", false);
          // 跳转到登录页面
          this.$router.replace("/Login");
        })
        .catch(() => {});
    },
    handleUserCancel(formName) {
      this.$refs[formName].resetFields();
      this.userPassDialog = false; //关闭dialog
    },
    showWarnDialog() {
      let routes = this.$chint.getRouteList();
      let target, parentItem;
      for (let item of routes) {
        if (item.linkPage === this.warnPage.pageId) {
          target = item;
          break;
        }
        for (let i of item.children) {
          if (i.linkPage === this.warnPage.pageId) {
            target = i;
            parentItem = item;
            break;
          }
        }
        if (target) break;
      }
      if (!target) {
        this.$message({
          type: "warning",
          message: "未找到界面!"
        });
        return;
      }
      this.$drag.$left.$refs.routes.selectRoutes(target, parentItem);
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
    min-width: 200px;
    width: 200px;
    height: calc(100%);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    img {
      height: 22px;
      padding-bottom: 5px;
      max-width: 100%;
    }
  }
  .right {
    min-width: 200px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
    font-size: 14px;
    margin-right: 20px;
    .weather {
      white-space: normal;
      margin-right: 30px;
      display: flex;
      align-items: center;
    }
    .runtime {
      white-space: normal;
      margin-right: 30px;
    }
    .icon {
      /deep/.el-badge__content {
        background-color: #e6a23c;
      }
      .iconxiaoxi {
        font-size: 20px;
        &:hover {
          color: #409eff;
        }
      }
    }
    .cirle-box {
      background-color: rgba(0, 0, 0, 0.2);
      width: 34px;
      height: 34px;
      line-height: 34px;
      border-radius: 50%;
      color: #fff;
      font-size: 16px;
      text-align: center;
      cursor: pointer;
      .iconmorentouxiang {
        &:hover {
          color: #3573c1;
        }
      }
    }
    .messege {
      margin-right: 30px;
    }
  }
  .center {
    flex: 1;
    height: calc(100%);
    position: relative;
    display: flex;
    align-items: center;
    div {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      span {
        position: relative;
        display: inline-block;
        &::after {
          position: absolute;
          content: attr(data-content);
          text-decoration: none;
          top: 0;
          left: 0;
          z-index: 2;
          color: var(--gradient);
          -webkit-mask-image: linear-gradient(var(--deg), #000, transparent);
          -webkit-mask-size: 100% 100%;
        }
      }
    }
  }
}
/* dialog样式 */
/deep/.el-dialog {
  border-radius: 10px;
  overflow: hidden;
  /deep/.el-dialog__header {
    background-color: #373e4a;
    border-bottom: #373e4a;
    color: #ffffff;
    .el-dialog__title {
      color: #ffffff;
    }
    .el-icon-close {
      color: #ffffff;
    }
  }
  /deep/.el-dialog__body {
    color: #fff;
    background-color: #2b303c;
    /deep/.el-form-item__label {
      color: #fff;
    }
    .el-input__inner,
    .el-textarea__inner {
      background-color: #353c48;
      border-color: #556174;
      color: #fff;
    }
  }
  /deep/.el-dialog__footer {
    background-color: #373e4a;
    text-align: center;
    .el-button--primary,
    .el-button--default {
      padding: 6px 20px;
      width: 115px;
      border-radius: 8px;
      background-color: #556174;
    }
    .el-button--default {
      border-color: #556174;
      color: #fff;
    }
    .el-button--success {
      color: #fff;
      background-color: #67c23a;
      border-color: #67c23a;
      padding: 5px 6px !important;
      font-size: 12px;
      border-radius: 3px;
    }
  }
}
</style>
