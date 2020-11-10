<template>
  <div class="comp">
    <el-collapse v-model="activeName" accordion>
      <el-collapse-item title="点位组集合" name="1">
        <div
          v-if="showAdd || pointGroup.length === 0"
          style="text-align:center;"
        >
          <el-button type="primary" size="small" @click="addPoint(1)"
            >新增点位组</el-button
          >
        </div>
        <template v-else>
          <div
            class="pointDiv"
            v-for="(item, index) in pointGroup"
            :key="item.id"
          >
            <div class="pointBlock">
              <el-input v-model="item.name">
                <template slot="append">
                  <i
                    @click="readyPoints(item)"
                    class="el-icon-setting"
                    style="font-size: 16px; cursor: pointer"
                    title="配置点位组"
                  ></i>
                  <!-- <span @click="readyPoints(item)" class="iconfont icon-yuanqu"></span> -->
                  <i
                    class="el-icon-delete"
                    style="font-size: 16px; cursor: pointer; margin-left: 10px;"
                    @click="deletes(item, index)"
                    title="删除点位组"
                  ></i>
                </template>
              </el-input>
              <i
                class="el-icon-circle-plus-outline"
                style="cursor: pointer; font-size: 16px; color: #ffffff; position: absolute; right: -20px; top: calc(50% - 8px);"
                @click="addPoint(2)"
                v-show="index + 1 === pointGroup.length"
                title="添加点位组"
              ></i>
              <!-- <div class="divFlex">
                <div @click="addPoint(2)" v-show="index + 1 === pointGroup.length" class="add">+</div>
                <div @click="deletes(item, index)" v-show="pointGroup.length !== 1" class="delete">-</div>
              </div>-->
            </div>
            <!-- <div class="divFlex">
              <div @click="addPoint(2)" v-show="index + 1 === pointGroup.length" class="add">+</div>
              <div @click="deletes(item, index)" v-show="pointGroup.length !== 1" class="delete">-</div>
            </div>-->
          </div>
        </template>
      </el-collapse-item>
      <el-collapse-item title="权限集合" name="2">
        <div class="pointDiv">
          <div class="pointBlock">
            <el-input value="系统权限" class="sysAuto" disabled>
              <template slot="append">
                <i
                  @click="showAutoDialog"
                  class="el-icon-setting"
                  style="font-size: 16px; cursor: pointer"
                  title="配置权限"
                ></i>
              </template>
            </el-input>
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>
    <div class="bottomDiv">- 我是有底线的 -</div>
    <el-dialog
      title="点位组合页面"
      class="point-dialog"
      :visible.sync="pointDialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :before-close="closePointDialog"
      :append-to-body="true"
    >
      <div class="err-alert-container">
        <el-alert
          :title="errTitle"
          type="error"
          :closable="false"
          v-if="errTitle"
          style="width:100%; height:34px;"
        ></el-alert>
      </div>

      <el-table
        ref="tableRef"
        :data="
          piTs.filter((currentValue, index) => {
            return currentPage * 10 > index && index >= currentPage * 10 - 10;
          })
        "
        row-key="id"
        border
        style="width: 100%"
        max-height="394"
        :highlight-current-row="false"
        :row-style="{ height: '0px' }"
        :cell-style="{ padding: '0px' }"
        @selection-change="handleSelectChange"
      >
        <el-table-column
          type="selection"
          align="center"
          width="50"
        ></el-table-column>
        <el-table-column
          type="index"
          :index="indexMethodPit"
          label="序号"
          width="60"
          align="center"
        ></el-table-column>
        <el-table-column prop="pit" label="点位设备" align="center">
          <template slot-scope="scope">
            <!-- 级联选择器 -->
            <el-cascader
              :ref="`cascader-point${scope.$index}`"
              v-model="scope.row.pit"
              :options="$store.state.deviceList"
              size="small"
              :props="{ value: 'id', label: 'name', expandTrigger: 'hover' }"
              clearable
              @change="onSelectPointChange(scope.$index, scope.row)"
            ></el-cascader>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="点位名称" align="center">
          <template slot-scope="scope">
            <el-input
              size="small"
              v-model.trim="scope.row.name"
              placeholder="请输入点位名称"
            ></el-input>
          </template>
        </el-table-column>

        <el-table-column prop="address" label="操作" align="center" width="140">
          <template slot="header">
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-document-delete"
              circle
              title="批量删除点位"
              @click="batchDelete"
            ></el-button>
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-document-add"
              circle
              title="批量添加点位"
              @click="onAddMulPt"
            ></el-button>
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-plus"
              circle
              title="添加点位"
              @click="onAddPt"
            ></el-button>
          </template>
          <template slot-scope="scope">
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-close"
              circle
              title="删除点位"
              @click="removePoint(scope.$index)"
            ></el-button>
            <el-button
              type="success"
              size="mini"
              icon="el-icon-top"
              circle
              title="上移"
              @click="handleSort(SORT_UP, scope.$index)"
            ></el-button>
            <el-button
              type="success"
              size="mini"
              icon="el-icon-bottom"
              circle
              title="下移"
              @click="handleSort(SORT_DOWN, scope.$index)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="footer">
        <el-pagination
          background
          style="text-align: right;"
          layout="prev, pager, next,total"
          :total="piTs.length"
          :current-page.sync="currentPage"
        ></el-pagination>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button
          size="mini"
          class="btn-determine"
          @click="okPointDialog"
          style="width:115px"
          >确 定</el-button
        >
        <el-button
          size="mini"
          class="btn-cancel"
          @click="closePointDialog"
          style="width:115px"
          >取 消</el-button
        >
      </div>
    </el-dialog>
    <el-dialog
      title="点位批量添加"
      width="25%"
      top="30vh"
      :visible.sync="showMulPointDialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :append-to-body="true"
    >
      <el-cascader
        v-model="mulPoints"
        ref="cascader-mul-point"
        :options="$store.state.deviceList"
        size="small"
        style="width: 100%"
        :props="{ multiple: true, value: 'id', label: 'name' }"
        clearable
        collapse-tags
      ></el-cascader>
      <div slot="footer" class="dialog-footer">
        <el-button
          size="mini"
          class="btn-determine"
          @click="addMulPt"
          style="width:60px"
          >确 定</el-button
        >
        <el-button
          size="mini"
          class="btn-cancel"
          @click="showMulPointDialog = false"
          style="width:60px"
          >取 消</el-button
        >
      </div>
    </el-dialog>

    <el-dialog
      title="权限组合页面"
      class="auth-dialog"
      :visible.sync="authDialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :before-close="closeAuthDialog"
      :append-to-body="true"
    >
      <div class="err-alert-container">
        <el-alert
          :title="errTitle"
          type="error"
          :closable="false"
          v-if="errTitle"
          style="width:100%; height:34px;"
        ></el-alert>
      </div>

      <el-table
        ref="tableRef"
        :data="
          authForm.list.filter((currentValue, index) => {
            return (
              authForm.currentPage * 10 > index &&
              index >= authForm.currentPage * 10 - 10
            );
          })
        "
        row-key="id"
        border
        style="width: 100%"
        max-height="394"
        :highlight-current-row="false"
        :row-style="{ height: '0px' }"
        :cell-style="{ padding: '0px' }"
      >
        <el-table-column
          type="index"
          :index="indexAuthList"
          label="序号"
          width="60"
          align="center"
        ></el-table-column>
        <el-table-column prop="label" label="权限名称" align="center">
          <template slot-scope="scope">
            <el-input
              size="small"
              v-model.trim="scope.row.label"
              placeholder="请输入权限名称"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="grade" label="权限等级" align="center">
          <template slot-scope="scope">
            <el-input
              size="small"
              v-model.trim="scope.row.grade"
              placeholder="请输入权限等级"
              :disabled="scope.row.grade == '65535'"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="password" label="权限密码" align="center">
          <template slot-scope="scope">
            <el-input
              size="small"
              v-model.trim="scope.row.password"
              placeholder="请输入权限密码"
            ></el-input>
          </template>
        </el-table-column>

        <el-table-column prop="address" label="操作" align="center" width="140">
          <template slot="header">
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-plus"
              circle
              title="添加权限"
              @click="onAddAuth"
            ></el-button>
          </template>
          <template slot-scope="scope">
            <div
              v-if="
                scope.row.grade != '65535' || indexAuthList(scope.$index) != 1
              "
            >
              <el-button
                type="danger"
                size="mini"
                icon="el-icon-close"
                circle
                title="删除权限"
                @click="removeAuth(scope.$index)"
              ></el-button>
              <el-button
                type="success"
                size="mini"
                icon="el-icon-top"
                circle
                title="上移"
                @click="handleAuthSort('up', scope.$index)"
              ></el-button>
              <el-button
                type="success"
                size="mini"
                icon="el-icon-bottom"
                circle
                title="下移"
                @click="handleAuthSort('down', scope.$index)"
              ></el-button>
            </div>
            <div v-else>-</div>
          </template>
        </el-table-column>
      </el-table>
      <div class="footer">
        <el-pagination
          background
          style="text-align: right;"
          layout="prev, pager, next,total"
          :total="authForm.list.length"
          :current-page.sync="authForm.currentPage"
        ></el-pagination>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button
          size="mini"
          class="btn-determine"
          @click="okAuthDialog"
          style="width:115px"
          >确 定</el-button
        >
        <el-button
          size="mini"
          class="btn-cancel"
          @click="closeAuthDialog"
          style="width:115px"
          >取 消</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { guid } from "@/util/common.js";
// import {  } from "@/api/api.js";
// import { getPointsData,getTree } from "@/api/server.js";

export default {
  data() {
    return {
      activeName: "1",
      props: { multiple: true },
      pointGroup: [],
      pointDialog: false,
      currentPage: 1,

      // pointTreeList: [],
      //点位组 包含的点位设备列表 dialog数据源
      pointPiTs: null,
      piTs: [],
      selectedRows: [],
      SORT_UP: 0,
      SORT_DOWN: 1,
      showMulPointDialog: false,
      mulPoints: [],
      errTitle: "",
      authDialog: false,
      authForm: {
        list: [],
        currentPage: 1
      }
    };
  },
  mounted() {
    this.pointGroup = this.$store.state.pointGroup.pointGroup;
    this.pointTreeList = this.$store.state.deviceList;
  },
  computed: {
    showAdd() {
      return this.pointGroup.length === 0;
    },
    authList() {
      return this.$store.state.authorityList;
    }
  },
  methods: {
    // async getGroupPoint() {
    //   let { body } = await getPointsData({
    //     pid: this.$store.getters.projectId
    //   });
    //   // body = body;
    //   let pointGroup = body.pointGroup;
    //   this.pointGroup = pointGroup;
    // },
    // async getPointTree() {
    //   let { data: pointTreeList } = await getTree({
    //     projectId: this.$store.getters.projectId
    //   });
    //   this.pointTreeList = pointTreeList;
    // },
    //组装点位
    readyPoints(item) {
      this.errTitle = "";
      this.pointDialog = true;
      this.pointPiTs = item;
      this.o_piTs = [...item.piTs];
      this.piTs = [...item.piTs];
      console.log(this.piTs);
      // console.log(item);
    },
    //添加单个点位
    onAddPt() {
      this.errTitle = "";
      this.piTs.unshift({
        id: guid(),
        name: null,
        pit: []
      });
    },
    onAddMulPt() {
      this.mulPoints = [];
      this.showMulPointDialog = true;
    },
    addMulPt() {
      this.errTitle = "";
      let ref = this.$refs["cascader-mul-point"];
      let checkedNodes = ref.getCheckedNodes();
      checkedNodes = checkedNodes.filter(cn => {
        return !cn.children || cn.children.length === 0;
      });
      console.log(checkedNodes);
      let pointList = this.mulPoints.map((mp, index) => {
        let node = checkedNodes[index];
        let name = node.pathLabels.join("/");
        return {
          id: guid(),
          name,
          pit: mp
        };
      });
      this.piTs = [...this.piTs, ...pointList];
      console.log(this.mulPoints);
      this.showMulPointDialog = false;
    },
    onSelectPointChange(index, item) {
      let checkedNode =
        this.$refs[`cascader-point${index}`].getCheckedNodes()[0] || {};
      item.name = (checkedNode.pathLabels || []).join("/");
    },
    //选取数据
    handleSelectChange(val) {
      console.log(val);
      this.selectedRows = val;
      // return true;
    },
    batchDelete() {
      this.errTitle = "";
      if (this.selectedRows.length === 0) {
        this.$message({
          message: "请至少选择一个点位!",
          type: "warning",
          duration: 3000,
          showClose: true
        });
        return;
      }
      this.$confirm(`确认删除选中数据?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        dangerouslyUseHTMLString: true,
        closeOnClickModal: false
      })
        .then(() => {
          let ids = this.selectedRows.map(sr => {
            return sr.id;
          });
          this.piTs = this.piTs.filter(pt => {
            return ids.indexOf(pt.id) === -1;
          });
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //关闭弹窗
    closePointDialog() {
      let o_piTsJson = JSON.stringify(this.o_piTs);
      let c_piTsJson = JSON.stringify(this.piTs);
      if (o_piTsJson === c_piTsJson) {
        this.pointDialog = false;
        return;
      }
      this.$confirm(`数据尚未保存，是否退出？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        closeOnClickModal: false
      })
        .then(() => {
          this.pointDialog = false;
        })
        .catch(() => {});
    },
    //页面序号
    indexMethodPit(index) {
      return index + (this.currentPage - 1) * 10 + 1;
    },
    removePoint(index) {
      let pitName = this.piTs[index].name;
      this.$confirm(`确认删除点位 <b>${pitName}</b>?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        dangerouslyUseHTMLString: true,
        closeOnClickModal: false
      })
        .then(() => {
          this.errTitle = "";
          this.piTs.splice(index, 1);
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //移动位置
    handleSort(type, index) {
      let targetIndex = null;
      if (type === this.SORT_UP) {
        if (index <= 0) {
          this.$message({
            message: "已经是第一条数据啦!",
            type: "warning",
            duration: 3000,
            showClose: true
          });
          return;
        }
        targetIndex = index--;
      } else if (type === this.SORT_DOWN) {
        if (index >= this.piTs.length - 1) {
          this.$message({
            message: "已经是最后一条数据啦!",
            type: "warning",
            duration: 3000,
            showClose: true
          });
        }
        targetIndex = index++;
      }
      let tempPiTs = [...this.piTs];
      let targetItem = tempPiTs[targetIndex];
      let currentItem = tempPiTs[index];
      this.piTs.splice(index, 1, targetItem);
      this.piTs[targetIndex] = currentItem;
    },
    okPointDialog() {
      this.errTitle = "";
      let piTs = [...this.piTs];
      let nameEmptyList = [];
      let pitEmptyList = [];
      piTs.forEach((pt, index) => {
        let { name, pit } = pt;
        if (!name) {
          nameEmptyList.push(index + 1);
        }
        if (!pit || pit.length === 0) {
          pitEmptyList.push(index + 1);
        }
      });
      if (nameEmptyList.length > 0) {
        let indexStr = nameEmptyList.join(", ");
        this.errTitle += `序号${indexStr}的点位名称为空;`;
      }
      if (pitEmptyList.length > 0) {
        let indexStr = pitEmptyList.join(", ");
        this.errTitle += `序号${indexStr}的点位设备为空;`;
      }
      if (this.errTitle) {
        return;
      }
      this.pointPiTs.piTs = piTs;
      this.pointDialog = false;
    },
    deletes(item, index) {
      this.$confirm(`请确认删除点位组:${item.name}?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        closeOnClickModal: false
      })
        .then(() => {
          let { counter } = item;
          if (counter > 0) {
            this.$message.warning("该点位组被绑定，删除前请解绑！");
            return;
          }
          this.pointGroup.splice(index, 1);
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //新增点位
    addPoint() {
      this.pointGroup = this.pointGroup || [];
      let point = {
        counter: 0,
        id: guid(),
        name: "点位组-" + (this.pointGroup.length + 1),
        piTs: []
      };
      this.pointGroup.push(point);
    },
    // 显示权限弹窗
    showAutoDialog() {
      this.authDialog = true;
      this.authForm.list = JSON.parse(JSON.stringify(this.authList));
    },
    // 权限页面序号
    indexAuthList(index) {
      return index + (this.authForm.currentPage - 1) * 10 + 1;
    },
    // 权限数据移动操作
    handleAuthSort(type, index) {
      // type: up/down，上移下移
      console.log(type);
      let targetIndex = null;
      if (type === "up") {
        if (index <= 1) {
          this.$message({
            message: "不允许上移!",
            type: "warning",
            duration: 3000,
            showClose: true
          });
          return;
        }
        targetIndex = index--;
      } else if (type === "down") {
        if (index >= this.authForm.list.length - 1) {
          this.$message({
            message: "当前是最后一条数据啦!",
            type: "warning",
            duration: 3000,
            showClose: true
          });
          return;
        }
        targetIndex = index++;
      }
      let temps = [...this.authForm.list];
      let targetItem = temps[targetIndex];
      let currentItem = temps[index];
      this.authForm.list.splice(index, 1, targetItem);
      this.authForm.list[targetIndex] = currentItem;
    },
    removeAuth(index) {
      this.errTitle = "";
      let item = this.authForm.list[index];
      if (item.counter > 0) {
        this.$message({
          message: "该权限已经被绑定，删除前请解绑!",
          type: "warning",
          duration: 3000,
          showClose: true
        });
        return;
      }
      this.$confirm(`请确认删除权限等级<b>${item.grade}</b>？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        closeOnClickModal: false,
        dangerouslyUseHTMLString: true
      })
        .then(() => {
          this.authForm.list.splice(index, 1);
        })
        .catch(() => {});
    },
    onAddAuth() {
      this.errTitle = "";
      this.authForm.list.push({
        id: guid(),
        label: "权限名称" + (this.authForm.list.length + 1),
        password: "",
        grade: "",
        counter: 0
      });
    },
    okAuthDialog() {
      this.errTitle = "";
      let piTs = [...this.authForm.list];
      let nameEmptyList = [];
      for (let i = 0; i < piTs.length; i++) {
        let { label, grade, password } = piTs[i];
        if (!label) {
          this.errTitle = `序号${i + 1}的权限名称为空`;
          break;
        }
        if (!grade) {
          this.errTitle = `序号${i + 1}的权限等级为空`;
          break;
        }
        if (!password) {
          this.errTitle = `序号${i + 1}的权限密码为空`;
          break;
        }
        if (grade >= 65535 && i != 0) {
          this.errTitle = `序号${i + 1}的权限等级超出范围(应低于65535)`;
          break;
        }
        if (password.length < 3 || password.length > 15) {
          this.errTitle = `序号${i +
            1}的权限密码长度超出范围，密码长度限定3-15位`;
          break;
        }
        nameEmptyList.push(label);
        if (nameEmptyList.indexOf(label) != i) {
          this.errTitle = `序号${nameEmptyList.indexOf(label) + 1}与序号${i +
            1}的权限名称重复`;
          break;
        }
      }
      if (this.errTitle) {
        return;
      }
      this.authDialog = false;
      this.$store.dispatch("setAuthList", piTs);
    },
    closeAuthDialog() {
      let o_piTsJson = JSON.stringify(this.authList);
      let c_piTsJson = JSON.stringify(this.authForm.list);
      if (o_piTsJson === c_piTsJson) {
        this.authDialog = false;
        return;
      }
      this.$confirm(`数据尚未保存，是否退出？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        closeOnClickModal: false
      })
        .then(() => {
          this.authDialog = false;
        })
        .catch(() => {});
    }
  }
};
</script>

<style lang="less" scoped>
.point-dialog /deep/ .el-dialog__body {
  position: relative;
  padding-top: 40px !important;
}
.err-alert-container {
  position: absolute;
  left: 0;
  top: 0;
  padding: 0 20px;
  box-sizing: border-box;
  width: 100%;
}
.comp {
  height: calc(100%);
  width: calc(100%);
  background: #373e4a;
  overflow: overlay;
  .pointDiv {
    .pointBlock {
      margin-top: 15px;
      display: flex;
      flex-direction: row;
      position: relative;
      /deep/ .el-input__inner {
        height: 30px;
      }
      /deep/ .el-input-group__append {
        padding: 0 10px;
      }
      .iconfont {
        height: 30px;
        width: 60px;
        font-size: 18px;
        border: 1px solid #282828;
        background: #f5f7fa;
        box-sizing: border-box;
        text-align: center;
        color: #909399;
        border-top-right-radius: 4px;
        border-bottom-right-radius: 4px;
      }
    }
  }
  &::-webkit-scrollbar {
    width: 4px;
    height: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: #e3e3e3;
    border-radius: 4px;
  }
  &::-webkit-scrollbar-resizer {
    background: #ff0bee;
  }
  & /deep/ .el-collapse {
    border-top: 0px;
    border-bottom: 1px solid #24252a;
  }
  & /deep/ .el-collapse-item__header {
    background: #737881;
    border-bottom: 1px solid #24252a;
    color: white;
    padding-left: 20px;
  }
  & /deep/ .el-collapse-item__wrap {
    border-bottom: 0px;
  }
  & /deep/ .el-collapse-item__content {
    background: #373e4a;
    color: #e9e9e9;
    padding: 16px 25px 40px;
    box-sizing: border-box;
  }
  & /deep/ .el-collapse-item__header {
    height: 36px;
    line-height: 36px;
  }
  .bottomDiv {
    text-align: center;
    color: #c0c4cc;
    font-size: 12px;
    padding-bottom: 20px;
  }
  /deep/ .el-table th {
    padding: 2px 0;
  }
  .sysAuto.is-disabled /deep/ .el-input__inner {
    color: #606266;
  }
}
.auth-dialog /deep/ .el-dialog__body {
  position: relative;
  padding-top: 36px !important;
  .is-disabled .el-input__inner {
    background-color: transparent;
    border-color: #dcdfe6;
    color: #9e9e9e;
  }
  .el-input__inner {
    height: 40px;
    line-height: 40px;
    border: none;
    background-color: transparent;
    text-align: center;
  }
}
</style>
