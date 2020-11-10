<template>
  <div class="box">
    <div class="top">
      <span>{{ organizeName }}云组态中心</span>
      <div class="rightinfo">
        <Screenfull class="right-menu-item hover-effect" />
        <i class="el-icon-user"></i>
        <div class="loginName">{{ loginName }}</div>
        <el-button icon="el-icon-switch-button" @click="onLogout"></el-button>
      </div>
    </div>
    <div class="content">
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
import Screenfull from "./components/screenFull";
import { clear } from "@/util/localStorage.js";
export default {
  name: "ProjectList",
  components: {
    Screenfull
  },
  data() {
    return {
      loginName: "",
      organizeName: "" //标题
    };
  },
  methods: {
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
          // 跳转到登录页面
          this.$router.replace("/Login");
        })
        .catch(() => {});
    }
  }
};
</script>

<style lang="less" scoped>
.box {
  height: 100%;
  .top {
    height: 60px;
    background-color: #202429;
    position: relative;
    span {
      line-height: 60px;
      color: #00ccff;
      font-size: 26px;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate3d(-50%, -50%, 0);
    }
    .rightinfo .el-button {
      float: left;
      height: 60px;
      width: 40px;
      background-color: #3573c1;
      color: #fff;
      border-style: none;
      border-radius: 0px;
      padding: 0;
      margin-left: 35px;
    }
    .rightinfo .el-button:focus,
    .rightinfo .el-button:hover {
      background-color: #3573c1;
      color: #fff;
      opacity: 0.9;
    }
    .rightinfo {
      justify-content: flex-end;
      display: flex;
      align-items: center;
      .right-menu-item {
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 20px;
        color: #fff;
        margin-right: 20px;
        vertical-align: text-bottom;
        &.hover-effect {
          cursor: pointer;
          // transition: background 0.3s;
          &:hover {
            // background: rgba(0, 0, 0, 0.3);
          }
        }
      }
      i {
        font-size: 18px;
        color: #fff;
        margin-right: 10px;
      }
      .loginName {
        color: #fff;
        text-align: center;
      }
    }
  }
  .content {
    height: calc(100% - 177px);
    background-color: #05090f;
    padding: 77px 80px 40px;
  }
}
</style>
