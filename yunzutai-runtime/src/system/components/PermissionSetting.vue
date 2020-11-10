<!--权限设置-->
<template>
  <el-form
    :model="settingForm"
    :rules="rules"
    ref="settingForm"
    label-width="125px"
    class="Tethys-userManage-style-form Tethys-userManage-style-settingPerms"
  >
    <el-form-item
      label="权限方式："
      prop="permissionCategory"
      required
      v-if="!isSupAdmin"
    >
      <el-radio-group
        v-model="settingForm.permissionCategory"
        @change="switchType"
      >
        <el-radio :label="0">权限等级</el-radio>
        <el-radio :label="1">选择角色</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item
      label="权限等级："
      prop="authorityLevel"
      v-if="isUserLevel || isSupAdmin"
    >
      <el-select
        v-model="settingForm.authorityLevel"
        placeholder="请选择用户等级"
        key="permLevel"
        :disabled="rows && rows.userLevel !== 0"
        :popper-class="customCls"
      >
        <el-option
          v-for="level in authorityLevels"
          :key="level.id"
          :label="level.label"
          :value="level.id"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item
      label="功能权限："
      prop="menu"
      v-if="isUserLevel || isSupAdmin"
    >
      <el-checkbox-group v-model="settingForm.menu" :disabled="isSupAdmin">
        <el-checkbox label="commitLog">日志管理</el-checkbox>
        <el-checkbox label="userManage" v-if="isSupAdmin"
          >用户权限管理</el-checkbox
        >
      </el-checkbox-group>
    </el-form-item>
    <el-form-item
      label="选择角色："
      prop="roleIds"
      v-if="!isUserLevel && !isSupAdmin"
    >
      <el-select
        v-model="settingForm.roleIds"
        placeholder="请选择角色"
        key="permRole"
        multiple
        clearable
        :popper-class="customCls"
      >
        <el-option
          v-for="role in roleList"
          :key="role.id + role.roleName"
          :label="role.roleName"
          :value="role.id"
        ></el-option>
      </el-select>
    </el-form-item>
  </el-form>
</template>

<script>
import {
  changeUserLevel,
  getRolesList,
  getUserAuthorityType,
  setRoleAuthority
} from "@/api/user.js";
export default {
  props: ["isSupAdmin", "rows", "subId", "theme"],
  data() {
    let checkedRoles = (rule, value, callback) => {
      if (value && value.length === 0) {
        return callback(new Error("请选择角色!"));
      } else {
        callback();
      }
    };
    return {
      authorityLevels: [
        {
          label: "超级权限",
          id: 65535
        },
        {
          label: "零级权限",
          id: 0
        },
        {
          label: "一级权限",
          id: 1
        },
        {
          label: "二级权限",
          id: 2
        },
        {
          label: "三级权限",
          id: 3
        },
        {
          label: "四级权限",
          id: 4
        },
        {
          label: "五级权限",
          id: 5
        }
      ],
      roleList: [],
      settingForm: {
        permissionCategory: 0,
        authorityLevel: null,
        //authorityLevel: this.isSupAdmin ? 65535 : null,
        menu: [],
        roleIds: []
      },
      rules: {
        authorityLevel: [
          {
            required: true,
            message: "请选择用户等级!",
            trigger: ["blur"]
          }
        ],
        roleIds: [
          {
            required: true,
            trigger: ["blur"],
            validator: checkedRoles
          }
        ]
      }
    };
  },

  components: {},

  computed: {
    isUserLevel() {
      return this.settingForm.permissionCategory === 0;
    },
    customCls() {
      return this.theme ? "black-theme-select-style" : "";
    }
  },

  mounted() {},

  methods: {
    initPermForm() {
      this.settingForm.roleIds = [];
      if (this.rows) {
        this.getCurrentUserAuthority();
      }
    },
    //提交设置
    submitPermissionStting() {
      this.$refs.settingForm.validate(valid => {
        if (valid) {
          if (this.settingForm.permissionCategory === 0) {
            //权限等级
            let params = {
              authorityLevel: this.settingForm.authorityLevel,
              loginName: this.rows && this.rows.loginName,
              menu: JSON.stringify(this.settingForm.menu),
              appId: window.sessionStorage.getItem("ProjectId")
            };
            changeUserLevel(params).then(res => {
              if (res.statusCode === 200) {
                this.successTips("等级设置成功！");
              }
            });
          } else {
            let params = {
              permissionCategory: this.settingForm.permissionCategory,
              userId: this.rows.id,
              roleIds: this.settingForm.roleIds,
              subId: this.subId
            };
            setRoleAuthority(params).then(res => {
              if (res.statusCode === 200) {
                this.successTips("角色设置成功！");
              }
            });
          }
        } else {
          return false;
        }
      });
    },
    successTips(msg) {
      this.$message({
        type: "success",
        message: msg
      });
      this.$refs.settingForm.clearValidate();
      this.$emit("succDone", false, "setting");
    },
    //切换权限方式
    switchType(type) {
      if (type === 1) {
        this.getAllRolesList();
      }
    },
    //获取当前用户的权限类型
    async getCurrentUserAuthority() {
      try {
        if (this.rows && this.rows.sysRoles) {
          await this.getAllRolesList();
        }
        getUserAuthorityType({ userId: this.rows.id, subId: this.subId }).then(
          res => {
            if (res.statusCode === 200) {
              let datas = res.data;
              this.settingForm.permissionCategory =
                datas && datas.permissionCategory;
              let isCurRole = this.settingForm.permissionCategory === 1;
              if (isCurRole) {
                //角色
                this.settingForm.roleIds = (datas && datas.roleIds) || [];
                this.settingForm.authorityLevel = null;
              } else {
                //等级
                this.settingForm.authorityLevel =
                  this.rows.userLevel !== 0 ? 65535 : this.rows.authorityLevel;
                this.settingForm.menu = this.isSupAdmin
                  ? ["commitLog", "userManage"]
                  : JSON.parse(this.rows.menu) || [];
              }
            }
          }
        );
      } catch (error) {
        console.log(error);
      }
    },
    //获取角色列表
    getAllRolesList() {
      return getRolesList({
        pageNum: 1,
        pageSize: 1000
      })
        .then(res => {
          if (res.code === "200") {
            let datas = res.data;
            this.roleList = (datas && datas.list) || [];
          }
          return this.roleList;
        })
        .catch(err => err);
    }
  }
};
</script>
<style lang="less" scoped>
.Tethys-userManage-style-settingPerms {
  .el-radio-group {
    /deep/.el-radio-button__inner {
      padding: 10px 14px;
      background: #1b1d24;
      border: 1px solid #237ae4;
      color: #237ae4;
    }
    .el-radio-button.is-active {
      /deep/.el-radio-button__inner {
        color: #fff;
      }
    }
    /deep/.el-radio-button__orig-radio:checked + .el-radio-button__inner {
      background-color: #237ae4;
      border-color: #237ae4;
    }
    /deep/.el-radio-button:first-child .el-radio-button__inner {
      border-radius: 2px 0 0 2px;
    }
    /deep/.el-radio-button:last-child .el-radio-button__inner {
      border-radius: 0 2px 2px 0;
    }
  }
}
.Theme-black {
  .Tethys-userManage-style-settingPerms {
    /deep/.el-tag.el-tag--info {
      background-color: #30333a;
      border-color: #30333a;
      color: #909399;
      border-radius: 2px;
    }
  }
}
</style>
