<!--重置密码-->
<template>
  <el-form
    :model="ruleForm"
    :rules="rules"
    ref="resetForm"
    label-width="125px"
    class="Tethys-userManage-style-form"
  >
    <el-form-item label="新密码：" prop="newLoginPwd">
      <el-input
        v-model.trim="ruleForm.newLoginPwd"
        type="password"
        placeholder="请输入新密码"
      ></el-input>
    </el-form-item>
    <el-form-item label="确认密码：" prop="confirmPassword" required>
      <el-input
        v-model.trim="ruleForm.confirmPassword"
        type="password"
        placeholder="请再次输入密码"
      ></el-input>
    </el-form-item>
  </el-form>
</template>

<script>
import { resetPassword } from "@/api/user.js";
export default {
  name: "resetPassword",
  props: ["userId"],
  data() {
    let confirmPwd = (rule, value, callback) => {
      if (!value && !this.ruleForm.newLoginPwd) {
        return callback(new Error("请再次输入密码!"));
      } else if (this.ruleForm.newLoginPwd !== value) {
        return callback(new Error("密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        newLoginPwd: "",
        confirmPassword: ""
      },
      rules: {
        newLoginPwd: [
          {
            required: true,
            message: "新密码不能为空",
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
        ]
      }
    };
  },

  components: {},

  computed: {},

  mounted() {},

  methods: {
    //重置密码
    submitNewPassword() {
      this.$refs.resetForm.validate(valid => {
        if (valid) {
          let params = {
            newLoginPwd: this.ruleForm.newLoginPwd,
            id: this.userId
          };
          resetPassword(params).then(res => {
            if (res.statusCode === 200) {
              this.$message({
                type: "success",
                message: "重置成功！"
              });
              this.$emit("succDone", false);
            }
          });
        } else {
          return false;
        }
      });
    }
  }
};
</script>
<style lang="less" scoped></style>
