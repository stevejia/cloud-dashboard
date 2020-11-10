<!--添加/编辑用户-->
<template>
  <el-form
    :model="userForm"
    :rules="rules"
    ref="userForm"
    label-width="125px"
    class="Tethys-userManage-style-form"
  >
    <el-form-item label="用户名：" prop="loginName">
      <el-input
        v-model.trim="userForm.loginName"
        placeholder="支持中/英文、数字和下划线，长度限制4~20个字符"
      ></el-input>
    </el-form-item>
    <el-form-item label="密码：" prop="loginPwd" v-if="!rows">
      <el-input
        v-model.trim="userForm.loginPwd"
        type="password"
        name="password"
        placeholder="请输入密码"
        autocomplete="new-password"
      ></el-input>
    </el-form-item>
    <el-form-item
      label="确认密码："
      prop="confirmPassword"
      required
      v-if="!rows"
    >
      <el-input
        v-model.trim="userForm.confirmPassword"
        type="password"
        name="confirmPassword"
        placeholder="请再次输入密码"
        autocomplete="new-password"
      ></el-input>
    </el-form-item>
    <el-form-item label="手机号码：" prop="mobile">
      <el-input
        v-model.trim="userForm.mobile"
        placeholder="请输入手机号码"
      ></el-input>
    </el-form-item>
    <el-form-item label="邮箱：" prop="email">
      <el-input
        v-model.trim="userForm.email"
        placeholder="请输入邮箱地址"
      ></el-input>
    </el-form-item>
    <el-form-item label="用户类型：" prop="userLevel">
      <el-select
        v-model="userForm.userLevel"
        placeholder="请选择用户类型"
        :popper-class="customCls"
        :disabled="rows && rows.userLevel === 2"
      >
        <el-option
          v-for="user in userType"
          :key="user.id"
          :label="user.name"
          :value="user.id"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="状态：" prop="status">
      <el-radio-group
        v-model="userForm.status"
        :disabled="rows && rows.userLevel === 2"
      >
        <el-radio :label="true">启用</el-radio>
        <el-radio :label="false">禁用</el-radio>
      </el-radio-group>
    </el-form-item>
  </el-form>
</template>

<script>
import { addUser, editUser } from "@/api/user.js";
export default {
  name: "userForm",
  props: ["rows", "subId", "theme"],
  data() {
    let confirmPwd = (rule, value, callback) => {
      if (!value && !this.userForm.loginPwd) {
        return callback(new Error("请再次输入密码!"));
      } else if (this.userForm.loginPwd !== value) {
        return callback(new Error("密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      userForm: {
        loginName: "",
        loginPwd: "",
        confirmPassword: "",
        mobile: "",
        email: "",
        userLevel: "",
        status: true,
        appList: [this.subId],
        domain: window.sessionStorage.getItem("Domain")
      },
      isLoaded: false,
      userType: [
        {
          name: "普通用户",
          id: 0
        },
        {
          name: "管理员",
          id: 1
        }
      ],
      rules: {
        loginName: [
          {
            required: true,
            message: "用户名必填",
            trigger: ["blur", "change"]
          },
          {
            min: 4,
            max: 20,
            message: "长度限制 4~20 个字符",
            trigger: ["blur", "change"]
          },
          {
            pattern: /^[\u4e00-\u9fa5_#a-zA-Z0-9]+$/,
            trigger: ["blur", "change"],
            message: "仅支持中/英文、数字和下划线"
          }
        ],
        loginPwd: [
          {
            required: true,
            message: "密码不能为空",
            trigger: ["blur", "change"]
          },
          {
            min: 6,
            max: 12,
            message: "长度在 6 到 12 个字符",
            trigger: ["blur", "change"]
          }
        ],
        confirmPassword: [
          {
            validator: confirmPwd,
            trigger: ["blur", "change"]
          }
        ],
        mobile: [
          {
            required: true,
            message: "手机号必填",
            trigger: ["blur", "change"]
          },
          {
            pattern: /^((1[3,5,8,9,7][0-9])|(14[5,7])|(17[0,6,7,8])|(19[7]))\d{8}$/,
            trigger: ["blur", "change"],
            message: "手机号格式错误"
          }
        ],
        email: [
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"]
          }
        ],
        userLevel: [
          {
            required: true,
            message: "用户类型必选",
            trigger: ["blur", "change"]
          }
        ]
      }
    };
  },

  components: {},

  computed: {
    customCls() {
      return this.theme ? "black-theme-select-style" : "";
    }
  },

  mounted() {},

  methods: {
    initUserForm() {
      if (this.rows) {
        this.userForm = {
          ...this.rows
        };
        this.userForm.appList = this.rows.appList;
        if (this.rows.userLevel === 2) {
          this.userType.push({ name: "超级管理员", id: 2 });
        } else {
          this.resetUserType();
        }
      } else {
        this.resetUserType();
        this.$refs.userForm.resetFields();
      }
    },
    //提交用户表单信息
    submitUserInfo() {
      if (this.isLoaded) return;
      this.$refs.userForm.validate(valid => {
        if (valid) {
          if (!this.rows) {
            addUser(this.userForm).then(res => {
              if (res.statusCode === 200) {
                this.$message({
                  type: "success",
                  message: "添加成功！"
                });
                this.resetForm("handle");
              }
            });
          } else {
            let params = {
              ...this.userForm,
              Id: this.rows.id
            };
            editUser(params).then(res => {
              if (res.statusCode === 200) {
                this.$message({
                  type: "success",
                  message: "编辑成功！"
                });
                this.resetForm("handle");
              }
            });
          }
        } else {
          return false;
        }
      });
    },
    //关闭前重置表单
    resetForm(type) {
      this.isLoaded = false;
      this.resetUserType();
      this.$emit("succDone", false, type);
    },
    resetUserType() {
      this.userType = this.userType.filter(user => {
        return user.id !== 2;
      });
    }
  }
};
</script>
