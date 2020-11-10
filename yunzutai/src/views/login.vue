<template>
  <div id="particles-js">
    <div class="box">
      <div class="loginmodel">
        <img :src="loginTitleUrl" class="titleImg" />
        <div class="loginbox">
          <p>登录您的账户</p>
          <el-form
            ref="loginFormRef"
            :model="loginForm"
            :rules="loginFormRules"
          >
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
  </div>
</template>

<script>
//这俩是背景特效相关的js
import { particlesJS } from "@/util/particles.min";
import { name, obj } from "@/util/particles.config";
import loginTitle from "@/assets/image/common/login_title1.png";
import { login, verifyCode, userInfo } from "@/api/server.js";
// eslint-disable-next-line no-unused-vars
import { setToken, setRefreshToken, setUser } from "@/util/localStorage";
export default {
  data() {
    return {
      loginTitleUrl: loginTitle,
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
      isLoading: false //是否正在加载中
    };
  },
  created() {
    this.$store.dispatch("setLoadData", false);
    this.$store.dispatch("setConfig", null);
    this.getCode();
  },
  mounted() {
    //绘制背景特效
    particlesJS(name, obj);
  },
  methods: {
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
        let res = await login({ ...this.loginForm });
        if (res.statusCode === 200) {
          this.$message({
            message: res.message,
            type: "success"
          });
          setToken(res.data.accessToken.tokenContent);
          setRefreshToken(res.data.refreshToken.tokenContent);
          this.getUserInfo();
          this.$router.push({
            path: "/projectList"
          });
        } else if (res.statusCode === 1010003) {
          this.loginForm.verifyCode = "";
          this.$message({
            message: res.message,
            type: "error"
          });
          this.getCode();
        } else {
          this.$message({
            message: res.message,
            type: "error"
          });
        }
        this.isLoading = false;
      });
      //   this.$refs.loginFormRef.validate(async valid => {
      //     if (!valid) return this.$message.error("输入验证失败");
      //     this.isLoading = true;
      //     let baseURL = this.$http.baseURL.base;
      //     let res = await this.$http.post(
      //       this.$http.api.login,
      //       this.loginForm,
      //       {},
      //       baseURL
      //     );
      //     if (!res) {
      //       this.isLoading = false;
      //       this.$message.error("登录超时");
      //       this.changeCode();
      //     } else {
      //       if (res.statusCode === 200) {
      //         this.isLoading = false;
      //         const { accessToken, refreshToken } = res.data;
      //         this.$storage.saveToken(accessToken.tokenContent);

      //         this.$storage.saveItem("expireTime", accessToken.expires);
      //         this.$storage.saveItem("refreshToken", refreshToken.tokenContent);
      //         try {
      //           let baseURL = this.$http.baseURL.base;
      //           let { data, statusCode, message } = await this.$http.post(
      //             this.$http.api.getUserInfo,
      //             {},
      //             {},
      //             baseURL
      //           );
      //           if (statusCode === 200) {
      //             let { loginName, organizeName } = data.admin;
      //             this.$storage.saveItem("organizeName", organizeName);
      //             this.$storage.saveItem("loginName", loginName);
      //             this.$message.success(message);
      //             this.isLoading = false;
      //             this.$router.push("/ProjectList");
      //           } else {
      //             this.isLoading = false;
      //             this.$message.error(message);
      //             this.changeCode();
      //           }
      //         } catch (err) {
      //           this.isLoading = false;
      //         }
      //       } else {
      //         this.isLoading = false;
      //         this.$message.error(res.message);
      //         this.changeCode();
      //       }
      //     }
      //   });
    },
    getUserInfo() {
      userInfo().then(res => {
        if (res.statusCode === 200) {
          // 将用户信息存到localStorage中
          setUser(res.data);
          this.$store.dispatch("setAccount", res.data);
        }
      });
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
  height: 462px;
  width: 578px;
  position: absolute;
  left: 50%;
  top: 50%;
  margin-left: -290px;
  margin-top: -231px;
  .titleImg {
    width: 100%;
    height: 78px;
  }
  .loginbox {
    margin-top: 44px;
    height: 352px;
    background-color: rgba(252, 252, 252, 1);
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
}
</style>
