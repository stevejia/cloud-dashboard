<template>
  <div class="user-content">
    <div class="search">
      <el-input
        placeholder="搜索项目名称"
        clearable
        style="width:413px;height:42px;margin-right:20px"
        v-model="searchKey"
        @clear="search"
      ></el-input>
      <el-button type="primary" icon="el-icon-search" @click="search"
        >搜索</el-button
      >
      <el-button
        type="primary"
        style="float:right"
        icon="el-icon-delete"
        :disabled="multipleSelection.length == 0"
        @click="handleUserDelete(2)"
        >批量删除</el-button
      >
      <el-button
        type="primary"
        style="float:right"
        icon="el-icon-circle-plus-outline"
        @click="showForm(0)"
        >新增</el-button
      >
    </div>
    <div class="ptable" v-loading="loading">
      <el-table
        :data="tableData"
        height="100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column
          type="index"
          label="序号"
          align="center"
          width="100"
        ></el-table-column>
        <el-table-column
          prop="loginName"
          label="用户名"
          align="center"
        ></el-table-column>
        <el-table-column prop="userLevel" label="用户等级" align="center">
          <template slot-scope="{ row }">{{
            row.userLevel === 1 ? "管理员" : "普通用户"
          }}</template>
        </el-table-column>
        <!-- <el-table-column prop="appList" label="应用选择" align="center">
          <template slot-scope="{ row }">
            <el-cascader
              :options="{ multiple: true }"
              :props="projectList"
              collapse-tags
              clearable
            ></el-cascader>
          </template>
        </el-table-column> -->
        <el-table-column
          prop="mobile"
          label="手机号码"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="email"
          label="邮箱"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="addTime"
          label="创建时间"
          align="center"
        ></el-table-column>

        <el-table-column prop="status" label="状态" align="center">
          <template slot-scope="{ row }">
            <span>{{ row.status ? "正常" : "禁止登陆" }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="操作" align="center">
          <template slot-scope="{ row }">
            <span @click="showForm(1, row)">
              <i class="icon el-icon-edit-outline" title="编辑用户"></i>
            </span>
            <span @click="handleReset(row.id)" style="margin:0 5px">
              <i class="icon el-icon-refresh" title="重置密码"></i>
            </span>
            <span @click="handleUserDelete(1, row.id, row.loginName)">
              <i class="icon el-icon-delete" title="删除用户"></i>
            </span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <router-link to="/Project/List">
      <el-button type="primary" style="marginTop: 30px;">项目列表</el-button>
    </router-link>
    <el-pagination
      style="float:right;margin-right: 80px;margin-top: 30px;"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagination.currentPage"
      :page-sizes="[5, 10, 100, 200, 500]"
      :page-size="pagination.pageSize"
      background
      layout="total, sizes, prev, pager, next, jumper"
      :total="pagination.totalItems"
    ></el-pagination>
    <el-dialog
      :title="userForm.type == 0 ? '新增用户' : '修改用户'"
      :visible.sync="userInfoDialog"
      :close-on-click-modal="false"
      width="550px"
    >
      <el-form
        :model="userForm"
        ref="userForm"
        label-width="100px"
        :rules="ruleValidate"
      >
        <el-form-item label="登录账号" prop="loginName">
          <el-input
            v-model="userForm.loginName"
            placeholder="请输入用户名"
            required
          />
        </el-form-item>
        <el-form-item
          label="登录密码"
          prop="loginPwd"
          v-if="userForm.type == 0"
        >
          <el-input
            type="password"
            v-model="userForm.loginPwd"
            placeholder="请输入登录密码"
            required
          />
        </el-form-item>
        <el-form-item label="用户等级" prop="userLevel">
          <el-select v-model="userForm.userLevel" style="width:100%">
            <el-option
              v-for="item in levelList"
              :label="item.name"
              :value="item.id"
              :key="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="应用选择" prop="appList">
          <el-cascader
            v-model="userForm.appList"
            style="width:100%"
            popper-class="app-check"
            :options="projectList"
            :props="{
              multiple: true,
              emitPath: false,
              value: 'id',
              label: 'name'
            }"
            collapse-tags
            clearable
            @change="handleProjectChange"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-switch
            v-model="userForm.status"
            active-text="启用"
            inactive-text="禁用"
          >
          </el-switch>
        </el-form-item>
        <el-form-item label="手机号码" prop="mobile">
          <el-input
            v-model="userForm.mobile"
            placeholder="请输入手机号"
            clearable
          />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input
            v-model="userForm.email"
            placeholder="请输入邮箱"
            clearable
          />
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            type="textarea"
            :rows="2"
            placeholder="请输入内容"
            v-model="userForm.remark"
          >
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleUserOk('userForm')"
          >确 定</el-button
        >
        <el-button @click="handleUserCancel('userForm')">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="重置密码"
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
// import { mapGetters } from "vuex";
import {
  getUserList,
  getProjectListRun,
  addUser,
  editUser,
  deleteUser,
  resetUser
} from "../api/usermanage";
export default {
  data() {
    // change pass
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
      ruleValidate: {
        loginName: [
          { required: true, message: "请输入登录账号", trigger: "blur" }
        ],
        loginPwd: [
          {
            required: true,
            message: "请输入登录密码",
            trigger: "blur"
          },
          {
            max: 16,
            min: 6,
            message: "密码长度必须在6-16位之间",
            trigger: "blur"
          }
        ],
        userLevel: [
          { required: true, message: "请选择用户等级", trigger: "blur" }
        ],
        appList: [
          { required: true, message: "请选择应用列表", trigger: "change" }
        ],
        status: [{ required: true }],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          {
            pattern: /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|13[0-9]|19[89])\d{8}$/,
            message: "请输入11位正确的手机号"
          }
        ],
        email: [
          {
            type: "email",
            message: "请输入正确的邮箱格式",
            trigger: "blur"
          }
        ]
      },
      ruleValidate2: {
        newLoginPwd: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 12, message: "长度在 6 到 12 个字符", trigger: "blur" }
        ],
        checkPassword: [
          { required: true, message: "请再次输入密码" },
          { validator: validatePass2, trigger: "blur" }
        ]
      },
      userForm: {
        type: 0,
        loginName: "",
        loginPwd: "",
        userLevel: "",
        appList: [],
        status: true,
        email: "",
        mobile: ""
      },
      passForm: {
        newLoginPwd: "",
        checkPassword: ""
      },
      loading: false,
      // 用户等级
      levelList: [
        {
          name: "普通用户",
          id: 0
        },
        {
          name: "管理员",
          id: 1
        }
      ],
      tableData: [],
      projectList: [],
      searchKey: "", //搜索框绑定的值
      userInfoDialog: false,
      userPassDialog: false,
      pagination: {
        currentPage: 1,
        pageSize: 10,
        totalItems: 1,
        totalPages: 1
      },
      multipleSelection: [],
      getUserInfo: {
        domain: this.$store.state.domain,
        loginName: "admin",
        headPic: null,
        sex: 1,
        mobile: "13113113111",
        status: true,
        isSingleLogin: false,
        email: null,
        loginDate: "2020-07-14 14:05:54",
        upLoginDate: "2020-07-14 13:56:09",
        userLevel: 1,
        addTime: "2020-07-07 18:39:14",
        modifyTime: "2020-07-09 15:15:26",
        id: "5329efb3235147a99358631914d652fc",
        sort: 637297439549699100,
        remark: null
      }
    };
  },
  // computed: {
  //   ...mapGetters(["getUserInfo"])
  // },
  async created() {
    this.getPageList();
    this.getProjectList();
  },
  methods: {
    async getPageList() {
      this.loading = true;
      const { domain } = this.getUserInfo;
      const obj = {
        domain: domain,
        PageIndex: this.pagination.currentPage,
        PageSize: this.pagination.pageSize,
        Key: this.searchKey
      };
      try {
        const res = await getUserList(obj);
        if (res.data !== null) {
          const {
            currentPage,
            items,
            pageSize,
            totalItems,
            totalPages
          } = res.data;
          this.pagination.pageSize = pageSize;
          this.pagination.currentPage = currentPage;
          this.pagination.totalItems = totalItems;
          this.pagination.totalPages = totalPages;
          this.tableData = items;
        }
        this.loading = false;
      } catch (error) {
        this.loading = false;
      }
    },
    async getProjectList() {
      const { domain } = this.getUserInfo;
      //获取项目列表
      let params = {
        Domain: domain,
        PageIndex: 1,
        PageSize: 1000
      };
      const res = await getProjectListRun(params);
      const { data, statusCode } = res;
      if (statusCode == 200) {
        let arr = [];
        data.forEach(project => {
          const index = arr.findIndex(item => item.id === project.projectId);
          if (index === -1) {
            arr.push({
              id: project.projectId,
              name: project.projectName,
              children: [
                {
                  id: project.appId,
                  name: project.appName
                }
              ]
            });
          } else {
            const subIndex = arr[index].children.findIndex(
              item => item.id === project.appId
            );
            if (subIndex === -1) {
              arr[index].children.push({
                id: project.appId,
                name: project.appName
              });
            }
          }
        });
        this.projectList = arr;
      } else {
        this.$message({ message: res.message, type: "error" });
      }
    },
    handleProjectChange() {},
    search() {
      this.getPageList();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleSizeChange(val) {
      this.pagination.pageSize = val;
      this.getPageList();
    },
    handleCurrentChange(val) {
      this.pagination.currentPage = val;
      this.getPageList();
    },
    showForm(type, row) {
      //新建/编辑用户
      this.userForm.type = type;
      if (row) {
        const {
          loginName,
          userLevel,
          mobile,
          email,
          appList,
          status,
          remark,
          id
        } = row;
        this.userForm.loginName = loginName;
        this.userForm.userLevel = userLevel == 1 ? 1 : 0;
        this.userForm.mobile = mobile;
        this.userForm.email = email;
        this.userForm.status = status;
        this.userForm.appList = appList;
        this.userForm.remark = remark;
        this.userForm.Id = id;
      } else {
        //重置表单
        if (this.$refs.userForm) {
          this.$refs.userForm.resetFields();
        }
        this.userForm.loginName = "";
        this.userForm.userLevel = "";
        this.userForm.mobile = "";
        this.userForm.email = "";
        this.userForm.status = true;
        this.userForm.appList = [];
        this.userForm.remark = "";
      }
      this.userInfoDialog = true;
    },
    //重置用户密码
    handleReset(id) {
      this.userPassDialog = true;
      this.passForm.id = id;
      this.passForm.newLoginPwd = "";
      this.passForm.checkPassword = "";
    },
    handlePassOk(formName) {
      this.$refs[formName].validate(async valid => {
        if (!valid) return;
        const params = {
          id: this.passForm.id,
          newLoginPwd: this.passForm.newLoginPwd
        };
        const res = await resetUser(params);
        const { statusCode, message } = res;
        if (statusCode === 200) {
          this.$message({ message: "修改密码成功!", type: "success" });
          this.userPassDialog = false;
        } else {
          this.$message({ message: message, type: "error" });
        }
      });
    },
    //提交模态框
    handleUserOk(formName) {
      this.$refs[formName].validate(async valid => {
        if (!valid) return;
        let res;
        let obj = {
          domain: this.getUserInfo.domain,
          loginName: this.userForm.loginName,
          mobile: this.userForm.mobile,
          status: this.userForm.status,
          remark: this.userForm.remark,
          email: this.userForm.email,
          userLevel: this.userForm.userLevel,
          appList: this.userForm.appList
        };
        if (this.userForm.type == 0) {
          obj.loginPwd = this.userForm.loginPwd;
          res = await addUser(obj);
        } else {
          obj.Id = this.userForm.Id;
          res = await editUser(obj);
        }
        let { statusCode, message } = res;
        if (statusCode === 200) {
          // 修改用户信息，重新保存vuex
          // this.$store.state.userInfo = null;
          // window.sessionStorage.removeItem("userInfo");
          // await this.$store.dispatch("setUserInfo");
          this.getPageList();
          this.$message({
            message: this.userForm.type == 0 ? "添加成功!" : "修改成功!",
            type: "success"
          });
        } else {
          this.$message({
            message: this.userForm.type == 0 ? `添加失败!` : `${message}!`,
            type: "error"
          });
        }
        this.userInfoDialog = false;
      });
    },
    //取消编辑或添加
    handleUserCancel(formName) {
      this.$refs[formName].resetFields();
      this.userInfoDialog = false; //关闭dialog
      this.userPassDialog = false; //关闭dialog
    },
    //删除用户
    handleUserDelete(type, Ids = "", loginName) {
      if (type == 2) {
        //批量删除
        for (let i = 0; i < this.multipleSelection.length; i++) {
          const item = this.multipleSelection[i];
          if (item.loginName === this.getUserInfo.loginName) {
            this.$message({
              message: "无法删除当前登录用户!",
              type: "warning"
            });
            return;
          }
          if (item.id) {
            Ids += i == 0 ? item.id : "," + item.id;
          }
        }
      }
      if (loginName && loginName === this.getUserInfo.loginName) {
        this.$message({ message: "无法删除当前登录用户!", type: "warning" });
        return;
      }
      this.$confirm("确认是否删除所选用户?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        closeOnClickModal: false
      }).then(async () => {
        const res = await deleteUser({ Ids });
        const { statusCode } = res;
        if (statusCode === 200) {
          this.getPageList();
          this.$message({ message: "删除成功!", type: "success" });
        } else {
          this.$message({ message: "删除失败!", type: "error" });
        }
      });
    }
  }
};
</script>
<style scoped>
/* 分页1，2，3数据li标签 */
/* .el-pagination.is-background .el-pager li {
  border-color: #4a5053;
  background-color: #202429;
} */
/* 分页前面箭头 */
/* .el-pagination.is-background .btn-prev {
  background-color: #202429;
} */
/* 分页后面箭头 */
/* .el-pagination.is-background .btn-next {
  background-color: #202429;
} */

/* //表格颜色 */
.ptable .el-table__header th {
  padding: 0;
  height: 42px;
  background-color: #409eff !important;
  color: #fff;
  box-shadow: -2px -2px 8px #63696e;
}
.ptable .el-table tr {
  background-color: #202429 !important;
  font-size: 16px;
  color: #f2f6fc;
}
.ptable .el-table tr:hover > td {
  background-color: #63696e !important;
}

/* //上箭头 */
.ptable .el-table .ascending .sort-caret.ascending {
  border-bottom-color: #63696e;
}
/* 下箭头 */
.ptable .el-table .descending .sort-caret.descending {
  border-top-color: #63696e;
}
/* 搜索框和前往页面输入框 */
.ptable .search .el-input__inner {
  background: #202429;
  border: 1px solid #32383f;
}
/* 表格颜色 */
.ptable .el-table td,
.ptable .el-table th.is-leaf {
  border: 1px solid #32383f;
}
/* 设置完表格颜色，但是表格底部线还是白色，其实是背景色导致的 */
.ptable .el-table::before {
  background-color: #32383f;
}
/* 设置完表格颜色，但是表格右部线还是白色，其实是背景色导致的 */
.ptable .el-table,
.ptable .el-table__expanded-cell {
  /* background-color: #32383f; */
  background-color: #05090f;
}
.el-table th > .cell {
  padding-left: 14px;
  padding-right: 14px;
}

/* 右边滚动条 */
.ptable
  .el-table--scrollable-y
  .el-table__body-wrapper::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  background-color: #b2ddff;
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
}
.searchBtn {
  margin-left: 5px;
}
</style>
<style lang="less" scoped>
/deep/ .el-loading-mask {
  background-color: rgba(55, 62, 74, 0.8);
}
.user-content {
  height: 100%;
  width: 100%;
  .search {
    margin-bottom: 22px;
  }
  .ptable {
    height: calc(100% - 126px);
  }
}
.icon {
  cursor: pointer;
  margin-right: 10px;
}
.el-icon-delete {
  margin-right: 0;
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
    }
    .el-button--default {
      background-color: #556174;
      border-color: #556174;
      color: #fff;
    }
  }
}
</style>
<style>
.app-check {
  z-index: 20001 !important;
}
</style>
