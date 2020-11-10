<template>
  <div
    id="particles-js"
    :style="{ backgroundImage: 'url(' + loginInfo.bg + ')' }"
  >
    <div class="loginmodel">
      <div class="login-logo">
        <img :src="loginInfo.logo" />
      </div>
      <div class="loginbox">
        <p>登录您的账户</p>
        <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules">
          <el-form-item prop="loginName">
            <el-input
              type="text"
              v-model="loginForm.loginName"
              placeholder="请输入账号"
              prefix-icon="el-icon-user"
              class="name"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-tooltip
              v-model="capsTooltip"
              content="已开启大写"
              placement="top"
              manual
            >
              <el-input
                type="password"
                v-model="loginForm.password"
                class="pwd"
                ref="password"
                placeholder="请输入密码"
                prefix-icon="el-icon-lock"
                show-password
                @keyup.native="checkCapslock"
                @blur="capsTooltip = false"
                @keyup.enter.native="enterProjectList"
              ></el-input>
            </el-tooltip>
          </el-form-item>
          <el-form-item prop="verifyCode">
            <el-input
              v-model="loginForm.verifyCode"
              placeholder="请输入验证码"
              prefix-icon="el-icon-key"
              @keyup.enter.native="enterProjectList"
            ></el-input>
            <img
              :src="imgSrc"
              alt="验证码"
              @click="changeCode()"
              style="vertical-align: middle"
              class="codeImg"
            />
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              class="btn"
              @click="enterProjectList"
              :loading="isLoading"
              :disabled="isLoading"
              >登录</el-button
            >
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
//这俩是背景特效相关的js
import { particlesJS } from "@/util/particles.min";
import { name, obj } from "@/util/particles.config";
import loginTitle from "@/assets/image/common/login_title.png";
import {
  login,
  verifyCode,
  getUserInfo,
  getLoginConfig,
  GetModel
} from "@/api/runApi.js";
import { getRunProjectList } from "@/api/usermanage";
// eslint-disable-next-line no-unused-vars
import { setToken, setRefreshToken, setUser } from "@/util/localStorage";
let Domain = window.location.hostname;
let timer = null;
export default {
  data() {
    return {
      loginTitle,
      loginForm: {
        loginName: "",
        password: "",
        code: "", //验证码
        num: "" //验证码编号
      },
      loginFormRules: {
        loginName: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 20, message: "长度在 3 到 20 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 20, message: "长度在 6 到 20 个字符", trigger: "blur" }
        ],
        verifyCode: [
          { required: true, message: "请输入验证码", trigger: "blur" },
          { min: 6, max: 6, message: "验证码为6个字符", trigger: "blur" }
        ]
      },
      imgSrc: "", //验证码图片
      capsTooltip: false,
      isLoading: false, //是否正在加载中
      loginInfo: {
        logo: "" || loginTitle,
        bg: "" || require("../assets/image/bg.jpg"),
        favicon: "",
        title: "正泰云组态平台"
      },
      appCound: 0
    };
  },
  created() {
    this.$store.dispatch("setLoadData", false);
    this.$store.dispatch("setShareData", false);
    this.$store.dispatch("setConfig", null);
    this.getCode();
    // this.getModel();
  },
  mounted() {
    //绘制背景特效
    particlesJS(name, obj);

    timer = setInterval(() => {
      if (this.$store.state.loginInfo.title == undefined) {
        this.loginInfo = this.$store.state.loginInfo;
      } else {
        this.loginInfo = this.$store.state.loginInfo;
        clearInterval(timer);
      }
    }, 200);
  },
  methods: {
    async getModel() {
      let data = await GetModel({
        Domain: window.location.protocol + "//" + Domain + "/#/Login"
      });
      this.appCound = data.data.appCount;
      let { body } = await getLoginConfig({ pid: data.data.appId });
      let save_data = body[0].save_data;
      if (save_data.loginPage == undefined) {
        this.loginInfo = {
          logo: save_data?.Logo?.value?.imgUrl || loginTitle,
          bg:
            save_data["背景图"]?.value?.imgUrl ||
            require("../assets/image/bg.jpg"),
          favicon: save_data["页面标签"]?.value?.imgUrl,
          title: save_data["页面标题"]?.value || "正泰云组态平台"
        };
      } else {
        this.loginInfo = {
          logo: save_data.loginPage.logo || loginTitle,
          bg: save_data.loginPage.bg || require("../assets/image/bg.jpg"),
          favicon: save_data.loginPage.favicon,
          title: save_data.loginPage.title || "正泰云组态平台"
        };
      }

      document.querySelector(
        "link[type='image/x-icon']"
      ).href = this.loginInfo.favicon;
      document.title = this.loginInfo.title;
    },
    async getCode() {
      try {
        // let baseURL = this.$http.baseURL.base;
        let res = await verifyCode();
        this.imgSrc = res.data;
      } catch (err) {
        console.log(err);
      }
    },
    changeCode() {
      this.getCode();
    },
    enterProjectList() {
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return this.$message.error("输入验证失败");
        this.isLoading = true;
        let loginForm = {
          LoginName: this.loginForm.loginName,
          Password: this.loginForm.password,
          Domain: window.location.hostname,
          VerifyCode: this.loginForm.verifyCode
        };
        let res = await login(loginForm);
        if (res.statusCode === 200) {
          this.$message({
            message: res.message,
            type: "success"
          });
          sessionStorage.setItem("userPwd", this.loginForm.password);
          setToken(res.data.accessToken.tokenContent);
          setRefreshToken(res.data.refreshToken.tokenContent);
          let params = {
            Domain: Domain,
            Key: "",
            PageIndex: 1,
            PageSize: 100
          };
          let { data } = await getRunProjectList(params);
          let { items } = data;
          this.getUserInfo(items);
        } else if (res.statusCode === 1010003) {
          this.loginForm.verifyCode = "";
          this.$message({
            message: res.message,
            type: "error"
          });
          this.getCode();
        } else {
          /* this.$message({
            message: res.message,
            type: "error"
          }); */
        }
        this.isLoading = false;
      });
    },
    async getUserInfo(items) {
      let res = await getUserInfo();
      if (res.statusCode === 200) {
        setUser(res.data);
        if (items.length === 1) {
          let item = items[0];
          this.$store.dispatch("setProjectInfo", item).then(() => {
            this.$router.replace({
              name: "load"
            });
          });
          return;
        } else {
          this.$router.push({
            path: "/project/list"
          });
        }
        this.$store.dispatch("setAccount", res.data);
      }
    },
    checkCapslock({ shiftKey, key } = {}) {
      if (key && key.length === 1) {
        if (
          (shiftKey && key >= "a" && key <= "z") ||
          (!shiftKey && key >= "A" && key <= "Z")
        ) {
          this.capsTooltip = true;
        } else {
          this.capsTooltip = false;
        }
      }
      if (key === "CapsLock" && this.capsTooltip === true) {
        this.capsTooltip = false;
      }
    }
  },
  destroyed() {
    clearInterval(timer);
  }
};
</script>

<style>
#particles-js {
  width: 100%;
  height: 100%;
  position: relative;
  background-image: url(../assets/image/bg.jpg);
  background-position: 50% 50%;
  background-size: cover;
  background-repeat: no-repeat;
  margin-left: auto;
  margin-right: auto;
}
.btn.el-button,
.loginbox .el-input {
  margin-left: 120px;
  width: 340px;
  height: 37px;
  border-radius: 4px;
}
.loginbox .name {
  margin-top: 20px;
}
.loginbox .btn {
  color: white;
  line-height: 37px;
  font-size: 20px;
  padding: 0;
}
.loginbox .focusing {
  outline-width: 0;
}

.loginbox .el-form-item__error {
  left: 135px;
}
</style>

<style lang="less" scoped>
.loginmodel {
  z-index: 100;
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  .loginbox {
    margin: 40px auto 0;
    width: 580px;
    height: 340px;
    background-color: #fcfcfc;
    border-radius: 8px;
    overflow: hidden;
    p {
      margin-left: 120px;
      margin-top: 45px;
      font-size: 21px;
      height: 10px;
      color: #686868;
    }
    .codeImg {
      position: absolute;
      width: 90px;
      height: 36px;
      right: 134px;
      top: 3px;
      cursor: pointer;
    }
  }
  .login-logo {
    min-height: 32%;
    max-height: 40%;
    padding-top: 50px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    -webkit-box-align: end;
    -ms-flex-align: end;
    align-items: flex-end;

    img {
      max-width: 580px;
    }
  }
}
</style>
