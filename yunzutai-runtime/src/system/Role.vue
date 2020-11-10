<template>
  <div class>
    <div class="top-part">
      <el-button class="add-role-btn-style" @click="addRole">
        <span class="el-icon-plus"></span>添加角色
      </el-button>
    </div>
    <custom-table
      :head="headData"
      :data="tableData"
      :showIndex="showIndex"
      :tableOption="tableOption"
      @handleButton="handleButton"
    ></custom-table>
    <custom-pagination
      :total="total"
      :page="pageData.pageNum"
      :limit="pageData.pageSize"
      v-show="total !== 0"
      @pagination="changeSize"
    ></custom-pagination>

    <!-- Dialog -->
    <custom-dialog
      :title="dialog.title"
      :visible.sync="dialog.visible"
      @submitAction="submitAction"
    >
      <template slot="content">
        <role-form
          ref="roleManageForm"
          @succDone="dialogClose"
          :subId="subId"
          :row="rows"
        ></role-form>
      </template>
    </custom-dialog>
  </div>
</template>

<script>
import customTable from "./components/Table";
import customDialog from "./components/Dialog";
import RoleForm from "./components/RoleForm";
import customPagination from "./components/Pagination";
import { getRolesList, deleteRole } from "@/api/user.js";

export default {
  props: ["subId"],
  data() {
    return {
      headData: [
        {
          prop: "roleName",
          label: "角色名称"
        },
        {
          prop: "description",
          label: "描述"
        }
      ],
      tableData: [
        {
          name: "admin",
          description: "角色描述测试"
        },
        {
          name: "巡检角色",
          description: "巡检角色描述测试"
        }
      ],
      tableOption: {
        label: "操作",
        options: [
          {
            methods: "edit",
            label: "编辑"
          },
          {
            methods: "delete",
            label: "删除"
          }
        ]
      },
      showIndex: {
        show: true,
        label: "序号"
      },
      dialog: {
        title: "添加角色",
        visible: false
      },
      total: 0,
      pageData: {
        pageNum: 1,
        pageSize: 10
      },
      rows: null
    };
  },

  components: {
    customTable,
    customDialog,
    RoleForm,
    customPagination
  },

  computed: {},

  /* watch: {
    'dialog.visible'(val) {
      console.log(val)
    }
  }, */
  mounted() {
    this.getRoleLists();
  },

  methods: {
    addRole() {
      this.setDialog("添加角色", null);
      this.initForm();
    },
    initForm() {
      this.$nextTick(() => {
        this.$refs.roleManageForm.initRoleForm();
      });
    },
    changeSize({ page }) {
      this.pageData.pageNum = page;
      this.getRoleLists();
    },
    //角色列表
    getRoleLists() {
      getRolesList(this.pageData).then(res => {
        if (res.code === "200") {
          let datas = res.data;
          this.total = datas && datas.count;
          this.tableData = (datas && datas.list) || [];
        }
      });
    },
    submitAction() {
      this.$refs.roleManageForm.submitRoleManage();
    },
    dialogClose(val, type) {
      this.dialog.visible = val;
      if (type) {
        this.getRoleLists();
      }
    },
    handleButton({ methods, row }) {
      if (methods === "edit") {
        this.setDialog("编辑角色", row);
        this.initForm();
      } else {
        this.deleteRole(row.id);
      }
    },
    //删除角色
    deleteRole(id) {
      this.$confirm("确定要删除该角色?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteRole(id).then(res => {
            if (res.code === "200") {
              this.$message({
                type: "success",
                message: "删除成功！"
              });
              this.pageData.pageNum = 1;
              this.getRoleLists();
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
    setDialog(title, row) {
      this.dialog.title = title;
      this.dialog.visible = true;
      this.rows = row;
    }
  }
};
</script>
<style lang="less" scoped></style>
