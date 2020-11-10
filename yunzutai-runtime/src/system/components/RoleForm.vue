<!--角色表单操作-->
<template>
  <el-form
    :model="roleForm"
    :rules="rules"
    ref="roleForm"
    label-width="125px"
    class="Tethys-userManage-style-form"
  >
    <el-form-item label="角色名称：" prop="roleName">
      <el-input
        v-model.trim="roleForm.roleName"
        placeholder="支持中/英文、数字和下划线，长度限制4~30个字符"
      ></el-input>
    </el-form-item>
    <el-form-item label="角色描述：" prop="description">
      <el-input
        v-model.trim="roleForm.description"
        type="textarea"
        rows="5"
        maxlength="100"
        placeholder="请输入描述，字数限长100个字符"
        :show-word-limit="true"
      ></el-input>
    </el-form-item>
    <el-form-item label="角色权限设置：" :prop="'menuIds' || 'apiIds'">
      <ul class="perms-list">
        <li v-for="(tree, index) in rolePerms" :key="index">
          <div class="perm-title">{{ tree.page }}</div>
          <el-tree
            node-key="id"
            :data="tree.perms"
            :props="defaultProps"
            :default-checked-keys="tree.defaultChecked"
            show-checkbox
            @check="getCheckTree"
          ></el-tree>
        </li>
      </ul>
    </el-form-item>
  </el-form>
</template>

<script>
import { getPermisions, addRoles, editRoles, getRoleInfo } from "@/api/user";
export default {
  props: ["subId", "row"],
  name: "roleForm",
  data() {
    let checkedIds = (rule, value, callback) => {
      if (value && value.length === 0 && this.roleForm.apiIds.length === 0) {
        return callback(new Error("请选择该角色所拥有的权限"));
      } else {
        return callback();
      }
    };
    return {
      roleForm: {
        roleName: "",
        description: "",
        menuIds: [],
        apiIds: []
      },
      rules: {
        roleName: [
          {
            required: true,
            message: "角色名称必填",
            trigger: ["blur", "change"]
          },
          {
            min: 4,
            max: 30,
            message: "长度在 4 到 30 个字符",
            trigger: ["blur", "change"]
          },
          {
            pattern: /^[\u4e00-\u9fa5_#a-zA-Z0-9]+$/,
            trigger: ["blur", "change"],
            message: "仅支持中/英文、数字和下划线"
          }
        ],
        menuIds: {
          required: true,
          messag: "请选择角色所拥有的权限",
          validator: checkedIds,
          trigger: "blur"
        }
      },
      defaultProps: {
        label: "name",
        children: "children"
      },

      rolePerms: [
        {
          page: "页面权限",
          id: "menusIds",
          perms: [],
          defaultChecked: [], //默认选中
          parentIds: [] //父节点id
        },
        {
          page: "API权限",
          id: "apiIds",
          perms: [],
          defaultChecked: [],
          parentIds: []
        }
      ],
      isLoaded: false
    };
  },

  components: {},

  computed: {},

  mounted() {},

  methods: {
    //获取菜单列表
    getMenuList() {
      return getPermisions({
        subId: this.subId
      }).then(res => {
        if (res.code === "200") {
          let datas = res.data;
          this.rolePerms[0].perms = (datas && datas.menuList) || [];
          this.rolePerms[1].perms = (datas && datas.apiList) || [];
          if (this.row) {
            datas.menuList.map(this.getParentIds);
            datas.apiList.map(this.getParentIds);
          }
          return datas;
        }
      });
    },
    //递归获取所有父菜单ID
    getParentIds(item) {
      if (item.children.length === 0) return;
      if (item.children.length > 0) {
        item.children.map(this.getParentIds);
        item.origin
          ? this.rolePerms[0].parentIds.push(item.id)
          : this.rolePerms[1].parentIds.push(item.id);
      }
    },
    initRoleForm() {
      this.rolePerms[0].parentIds = [];
      this.rolePerms[1].parentIds = [];
      if (!this.row) {
        this.getMenuList();
        this.roleForm.menuIds = [];
        this.roleForm.apiIds = [];
        this.rolePerms[0].defaultChecked = [];
        this.rolePerms[1].defaultChecked = [];
        this.$refs.roleForm.resetFields();
      } else {
        this.getRoleInfos();
      }
    },
    //获取角色信息
    async getRoleInfos() {
      await this.getMenuList();
      getRoleInfo({ roleId: this.row.id }).then(res => {
        if (res.code === "200") {
          let datas = res.data;
          let menuIds = [...new Set(datas && datas.menusIds)];
          let apiIds = [...new Set(datas && datas.apiIds)];
          this.roleForm.roleName = datas && datas.roleName;
          this.roleForm.description = datas && datas.description;
          this.roleForm.menuIds = menuIds;
          this.roleForm.apiIds = apiIds;
          //过滤掉选中节点的父节点
          this.rolePerms[0].defaultChecked = menuIds.filter(item => {
            return !this.rolePerms[0].parentIds.includes(item);
          });
          this.rolePerms[1].defaultChecked = apiIds.filter(item => {
            return !this.rolePerms[1].parentIds.includes(item);
          });
        }
      });
    },
    //获取选择的节点和半选中的节点
    getCheckTree(data, node) {
      data.origin
        ? this.getCheckedIds(node, "menuIds")
        : this.getCheckedIds(node, "apiIds");
    },
    getCheckedIds(node, arr) {
      this.roleForm[arr] = node.checkedKeys;
      if (node.halfCheckedNodes.length > 0) {
        node.halfCheckedNodes.map(node => {
          this.roleForm[arr].push(node.id);
        });
      }
      return [...new Set(this.roleForm[arr])];
    },
    //提交表单
    submitRoleManage() {
      if (this.isLoaded) return;
      this.$refs.roleForm.validate(valid => {
        if (valid) {
          let params = {
            ...this.roleForm,
            subId: this.subId
          };
          if (!this.row) {
            addRoles(params).then(res => {
              if (res.code === "200") {
                this.$message({
                  type: "success",
                  message: "添加成功！"
                });
                this.resetForm("handle");
              }
            });
          } else {
            params["id"] = this.row.id;
            editRoles(params).then(res => {
              if (res.code === "200") {
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
      this.$emit("succDone", false, type);
    }
  }
};
</script>
<style lang="less" scoped>
.Tethys-userManage-style-form {
  .perms-list {
    display: flex;
    max-height: 350px;
    height: 200px;
    overflow-y: auto;
    &::-webkit-scrollbar {
      width: 4px;
      height: 4px;
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 5px;
      -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
      background: rgba(255, 255, 255, 0.3);
    }
    > li {
      flex: 1;
      margin-left: 10px;
      .perm-title {
        font-size: 14px;
        color: #abb4c3;
      }
    }
  }
}
.Theme-black {
  .Tethys-userManage-style-form {
    /deep/.el-tree {
      background: #1b1d24;
      color: #dfe8ff;
      /deep/.el-tree-node__content:hover,
      .el-tree-node:focus > .el-tree-node__content {
        background: #237ae4;
      }
      /deep/.el-checkbox__inner {
        border: 1px solid #30333a;
        background-color: #121212;
      }
    }
  }
}
</style>
