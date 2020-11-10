<template>
  <div :class="['tethys-user-manage', { 'theme-black': theme }]">
    <div class="top-part">
      <div class="btns">
        <el-button class="add-role-btn-style" @click="addUser">
          <span class="el-icon-plus"></span>添加用户
        </el-button>
        <el-button
          class="add-role-btn-style"
          @click="deleteUsers('batch')"
          v-show="selectedRows.length > 0"
          >删除</el-button
        >
      </div>

      <div class="search-box">
        <el-input
          type="text"
          v-model="pageData.Key"
          clearable
          placeholder="请输入用户名查询"
        />
        <el-button @click="searchUser">
          <span class="el-icon-search"></span>
        </el-button>
      </div>
    </div>
    <custom-table
      :head="headData"
      :data="tableData"
      :showSelection="showSelection"
      :showIndex="showIndex"
      :tableOption="tableOption"
      @handleButton="handleButton"
      @handleSelectionChange="getSelectedUsers"
    ></custom-table>
    <custom-pagination
      :total="total"
      :page="pageData.PageIndex"
      :limit="pageData.PageSize"
      v-show="total !== 0"
      @pagination="changePageNum"
    ></custom-pagination>
    <!-- Dialog -->
    <custom-dialog
      :title="dialog.title"
      :visible.sync="dialog.visible"
      :isShowBtn="isShowBtn"
      @submitAction="submitAction"
    >
      <template slot="content">
        <user-form
          v-show="dialog.type === 'user'"
          :rows="rows"
          ref="userInfoForm"
          :subId="subId"
          :theme="theme"
          @succDone="dialogClose"
        ></user-form>
        <setting-permission
          v-show="dialog.type === 'setting'"
          :isSupAdmin="isSupAdmin"
          :rows="rows"
          :subId="subId"
          :theme="theme"
          ref="permsSettingForm"
          @succDone="dialogClose"
        ></setting-permission>
        <reset-password-form
          v-show="dialog.type === 'reset'"
          :user-id="rows && rows.id"
          ref="resetPwdForm"
          @succDone="dialogClose"
        ></reset-password-form>
      </template>
    </custom-dialog>
  </div>
</template>

<script>
import { getUsersList, deleteUser, getCurrentUserInfo } from "@/api/user.js";
import { getUser } from "@/util/localStorage";
import customTable from "./components/Table";
import customPagination from "./components/Pagination";
import customDialog from "./components/Dialog";
import userForm from "./components/UserForm";
import settingPermission from "./components/PermissionSetting";
import resetPasswordForm from "./components/ResetPasswordForm";
export default {
  props: ["subId"],
  data() {
    return {
      headData: [
        {
          prop: "loginName",
          label: "用户名"
        },
        {
          prop: "userLevel",
          label: "用户类型",
          filterFn: "this.setUserLevel(scope.row[prop])"
        },
        {
          prop: "mobile",
          label: "手机",
          headAlign: "center",
          align: "center"
        },
        {
          prop: "email",
          label: "邮箱",
          headAlign: "center",
          align: "center"
        },
        {
          prop: "authorityLevel",
          label: "用户等级",
          headAlign: "center",
          align: "center",
          filterFn: "this.setAuthorityLevel(scope.row[prop])"
        },
        {
          prop: "sysRoles",
          label: "角色",
          headAlign: "center",
          align: "center",
          filterFn: "this.getUserRole(scope.row[prop])"
        },
        {
          prop: "status",
          label: "状态",
          headAlign: "center",
          align: "center",
          filterFn: "this.setUserStatus(scope.row[prop])"
        }
      ],
      tableData: [],
      showSelection: true,
      showIndex: true,
      defaultSort: {
        prop: "userLevel",
        order: "descending"
      },
      tableOption: {
        label: "操作",
        headAlign: "center",
        align: "center",
        mwidth: "120",
        options: [
          {
            label: "权限设置",
            methods: "setting"
          },
          {
            label: "重置密码",
            methods: "resetPwd"
          },
          {
            label: "编辑",
            methods: "edit"
          },
          {
            label: "删除",
            methods: "delete"
          }
        ]
      },
      pageData: {
        PageIndex: 1,
        PageSize: 10,
        domain: window.sessionStorage.getItem("Domain"),
        Key: "",
        subId: this.subId
      },
      total: 0,
      selectedRows: [],
      isSupAdmin: false,
      userInfo: getUser(),
      isShowBtn: true,
      rows: null,
      dialog: {
        title: "",
        type: "user",
        visible: false
      }
    };
  },

  components: {
    customTable,
    customDialog,
    userForm,
    resetPasswordForm,
    settingPermission,
    customPagination
  },

  computed: {
    theme() {
      return this.$store.getters.theme === "black";
    }
  },

  mounted() {
    this.getUsersLists();
  },

  methods: {
    //执行表单操作
    submitAction() {
      this.$nextTick(() => {
        if (this.dialog.type === "user") {
          this.$refs.userInfoForm.submitUserInfo();
        } else if (this.dialog.type === "reset") {
          this.$refs.resetPwdForm.submitNewPassword();
        } else if (this.dialog.type === "setting") {
          this.$refs.permsSettingForm.submitPermissionStting();
        }
      });
    },
    changePageNum({ page }) {
      this.pageData.PageIndex = page;
      this.getUsersLists();
    },
    //获取用户列表
    getUsersLists() {
      let subId = this.$store.state.subProjectId;
      let parmas = { ...this.pageData, subId };
      getUsersList(parmas).then(res => {
        let datas = res && res.data;
        this.total = (datas && datas.totalItems) || 0;
        this.tableData = (datas && datas.items) || [];
      });
    },
    //获取已选择的表格行
    getSelectedUsers(selection) {
      this.selectedRows = selection;
    },
    searchUser() {
      this.pageData.PageIndex = 1;
      this.getUsersLists();
    },
    //添加用户
    addUser() {
      this.rows = null;
      this.setDialog("添加用户", "user", null);
    },
    //不能删除当前登录用户
    unableDelete(name) {
      let curUseName =
        this.userInfo && this.userInfo.admin && this.userInfo.admin.loginName;
      if (!curUseName) {
        curUseName = this.getUserInfo();
      }
      if (name && name === curUseName) {
        this.$message({
          message: "无法删除当前登录用户!",
          type: "warning"
        });
        return true;
      }
      return false;
    },
    getUserInfo() {
      return getCurrentUserInfo().then(res => {
        return res.data && res.data.admin && res.data.loginName;
      });
    },
    //删除用户
    deleteUsers(type, ids = "", name) {
      if (type === "batch") {
        for (let k = 0; k < this.selectedRows.length; k++) {
          let item = this.selectedRows[k];
          if (this.unableDelete(item.loginName)) return;
          if (item.id) {
            ids += k === 0 ? item.id : "," + item.id;
          }
        }
      }
      if (this.unableDelete(name)) return;
      this.$confirm("确定要删除所选用户?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteUser({ Ids: ids }).then(res => {
            if (res.statusCode === 200) {
              this.$message({
                type: "success",
                message: "删除成功"
              });
              this.searchUser();
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //按钮操作
    handleButton({ methods, row }) {
      if (methods === "setting") {
        // 0:普通用户1:管理员2:超级管理员(初始)
        this.isSupAdmin = row.userLevel === 2;
        this.setDialog("权限设置", "setting", row);
        this.$nextTick(() => {
          this.$refs.permsSettingForm.initPermForm();
        });
      } else if (methods === "resetPwd") {
        this.setDialog("重置密码", "reset", row);
      } else if (methods === "edit") {
        this.setDialog("编辑用户", "user", row);
      } else {
        this.deleteUsers("single", row.id, row.loginName);
      }
    },
    dialogClose(val, type) {
      this.dialog.visible = val;
      if (type) {
        this.searchUser();
      }
    },
    setDialog(title, type, row) {
      this.dialog.title = title;
      this.dialog.visible = true;
      this.dialog.type = type;
      this.rows = row;

      this.isShowBtn = !(this.dialog.type === "setting" && this.isSupAdmin);

      this.$nextTick(() => {
        if (this.dialog.type === "user") {
          this.$refs.userInfoForm.initUserForm();
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>
.tethys-user-manage {
  .top-part {
    display: flex;
    justify-content: space-between;
    .search-box {
      width: 260px;
      height: 36px;
      //background: rgba(38, 38, 38, 0.65);
      border-radius: 4px;
      border: 1px solid #e1e6f0;
      display: flex;
      /deep/.el-input__inner {
        background: transparent;
        border: none;
        height: 36px;
        line-height: 36px;
        color: #abb4c3;
      }
      /deep/.el-button {
        background: transparent;
        border: none;
        height: 36px;
        color: #abb4c3;
        width: 36px;
        text-align: center;
        padding: 0;
      }
    }
  }
  &.theme-black {
    .top-part {
      .search-box {
        background: rgba(38, 38, 38, 0.65);
        border: 1px solid #676767;
        /deep/.el-input__inner {
          color: #abb4c3;
        }
        /deep/.el-button {
          color: #fff;
        }
      }
    }
  }
}
</style>
