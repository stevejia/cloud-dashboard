<template>
  <div>
    <ul class="pagesUl" v-if="pages.length">
      <li
        v-for="item in pages"
        :key="item.id"
        @click="
          selectPage({
            linkPage: item.id,
            type: item.type,
            origin: 'local',
            pages: item.pages
          })
        "
      >
        <div class="pagesDiv">
          <el-checkbox :value="item.id === currentSelectPage">{{
            item.name
          }}</el-checkbox>
          <span class="right themeColor">{{ item.number || 0 }}</span>
        </div>
      </li>
    </ul>
    <div class="views" v-else>页面列表</div>

    <!-- <div class="typeDialog" v-show="dialogType" :style="menuStyles">
      <ul>
        <template v-if="dialogType === 1">
          <li @mousedown.stop="createPage">
            <div class="item">新建页面</div>
          </li>
          <li @mousedown.stop="createUploadPage">
            <div class="item">上传页面</div>
          </li>
        </template>
        <template v-else-if="dialogType === 2">
          <li @mousedown.stop="editPage"><div class="item">编辑页面</div></li>
          <li @mousedown.stop="deletePage">
            <div class="item">删除页面</div>
          </li>
        </template>
      </ul>
    </div> -->
    <el-dialog
      title="上传页面"
      :visible.sync="pagesUploadVisible"
      :before-close="cancel"
    >
      <el-form
        :model="updForm"
        ref="updForm"
        :rules="updRules"
        label-width="100px"
      >
        <el-form-item label="页面名称" prop="name">
          <el-input
            v-model="updForm.name"
            placeholder="请输入页面名称"
            autocomplete="off"
          ></el-input>
        </el-form-item>

        <el-form-item label="页面类型" prop="pageType">
          <el-select v-model="updForm.pageType">
            <el-option label="光伏" value="0"></el-option>
            <el-option label="仪器仪表" value="1"></el-option>
            <el-option label="低压" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="上传脚本">
          <input
            ref="input"
            hidden
            type="file"
            name="file"
            @change="handleChange"
            accept="text/javascript"
          />
          <el-input
            placeholder="请上传js文件"
            disabled=""
            v-model="fileName"
          ></el-input>
          <el-button size="small" type="primary" @click="selectFile"
            >点击上传</el-button
          >
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="startSubmit">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="新建页面"
      :visible.sync="pagesVisible"
      :before-close="resetForm"
    >
      <el-form :model="pageForm" label-width="80px">
        <el-form-item label="页面名称" :rules="{ required: true }">
          <el-input
            v-model="pageForm.name"
            placeholder="请输入菜单名称"
            autocomplete="off"
          ></el-input>
        </el-form-item>

        <el-form-item
          label="页面类型"
          v-show="!editAble"
          :rules="{ required: true }"
        >
          <el-select v-model="pageForm.type">
            <el-option label="单页面" value="single"></el-option>
            <el-option label="多页面" value="multi"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="页面权限" :rules="{ required: true }">
          <el-select v-model="pageForm.role">
            <el-option label="零级权限" value="0"></el-option>
            <el-option label="一级权限" value="1"></el-option>
            <el-option label="二级权限" value="2"></el-option>
            <el-option label="三级权限" value="3"></el-option>
            <el-option label="四级权限" value="4"></el-option>
            <el-option label="五级权限" value="5"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="菜单隐藏">
          <el-select v-model="pageForm.showStatus" placeholder="选择页面">
            <el-option label="显示菜单" value="1"></el-option>
            <el-option label="隐藏菜单" value="2"></el-option>
            <el-option label="全屏显示" value="3"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm">取 消</el-button>
        <el-button type="primary" @click="addPage">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { guid } from "@/util/common.js";
import { uploadJs, checkUploadJsName } from "@/api/server.js";
export default {
  data() {
    var validateName = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入名称!"));
      } else {
        const { pageType } = this.updForm;
        const params = {
          fileName: value,
          pageType
        };
        checkUploadJsName(params).then(
          res => {
            if (!res.data.flag) {
              callback(new Error("名称重复，请修改!"));
            } else {
              callback();
            }
          },
          err => callback(err)
        );
      }
    };
    return {
      updForm: {
        name: "",
        pageType: "",
        info: "",
        file: null
      },
      fileName: "",
      updRules: {
        name: [
          { required: true, trigger: "blur", validator: validateName } // message: '请选择名称'
        ],
        pageType: [
          { required: true, message: "请选择类型", trigger: "change" }
        ],
        file: [{ required: true, message: "请选择脚本", trigger: "change" }]
      },
      pagesUploadVisible: false,

      menuStyles: {}, //右击菜单样式
      pageNumber: {},
      currentSelectPage: null, //当前选中
      pages: this.$store.state.config.routeConfig.pages,
      pagesVisible: false,

      pageForm: {
        name: "",
        type: "single",
        role: "0",
        targetId: "",
        pages: [
          {
            id: guid(),
            name: "默认页面"
          }
        ],
        showStatus: "1" //1显示菜单，2隐藏菜单，3全屏显示
      },
      operatePage: null, //当前操作的页面
      editAble: false,
      mulPages: [],
      mulLinkPageId: {}
    };
  },
  methods: {
    selectFile() {
      this.$refs.input.value = null;
      this.$refs.input.click();
    },
    handleChange(ev) {
      const files = ev.target.files;
      if (!files) return;
      const file = files[0];
      this.fileName = file.name;
      this.updForm.file = file;
    },
    //开始上传
    startSubmit() {
      this.$refs["updForm"].validate(valid => {
        if (valid) {
          const headers = { "Content-Type": "multipart/form-data" };
          const forms = new FormData();
          Object.keys(this.updForm).forEach(key => {
            forms.append(key, this.updForm[key]);
          });
          uploadJs(forms, headers).then(() => {
            this.cancel();
          });
        } else {
          return false;
        }
      });
    },
    cancel() {
      this.pagesUploadVisible = false;
      this.fileName = "";
      this.updForm = {
        name: "",
        pageType: "",
        info: "",
        file: null
      };
      this.$refs.input.value = null;
    },
    //初始化页面引用次数
    initNumber(routes) {
      this.pageNumber = {};
      this.count(routes);
      this.pages = this.pages.map(page => {
        page.number = this.pageNumber[page.id] || 0;
        return page;
      });
    },
    count(routes) {
      routes.forEach(route => {
        if (route.linkPage) {
          if (!this.pageNumber[route.linkPage]) {
            this.pageNumber[route.linkPage] = 1;
          } else {
            this.pageNumber[route.linkPage]++;
          }
        }
        if (route.children.length) {
          this.count(route.children);
        }
      });
    },
    selectPages() {
      let item = this.pages[0];
      if (item) {
        this.selectPage({
          linkPage: item.id,
          type: item.type,
          origin: "local",
          pages: item.pages
        });
      }
    },
    setStyles(item) {
      if (item && this.$drag.layout.themeConfig["页面大小"].checked) {
        this.$drag.layout.themeConfig["页面大小"].value = [
          item.width || 1920,
          item.height || 1080
        ];
        this.$drag.layout.themeConfig["页面选项"].value = item.pageState;
      }
    },
    selectPage(item) {
      //页面切换
      // if (item.origin === "system" || item.origin === "remote") {
      //   return;
      // }
      this.currentSelectPage = item.linkPage;
      let page = this.pages.find(_page => {
        return _page.id === item.linkPage;
      });
      this.setStyles(page);
      if (page) {
        this.currentPageId = item.linkPage;
        item.role = page.role;
        item.showStatus = page.showStatus;
        item.pages = page.pages;
        if (page.type === "multi") {
          this.mulPages = page.pages;
          let dom = this.$drag.$vm.$el.querySelector("#page-" + item.linkPage);
          if (!dom) {
            this.$drag.currentPageId = this.mulPages[0].id;
            this.mulLinkPageId[item.linkPage] = this.mulPages[0].id;
            this.$drag.$vm.mulLinkPageId = this.mulPages[0].id;
          } else {
            this.$drag.$vm.mulLinkPageId = this.mulLinkPageId[item.linkPage];
            this.$drag.currentPageId = this.mulLinkPageId[item.linkPage];
          }
          this.$drag.currentPageType = "multi";
          this.$drag.$vm.initMulPages(this.mulPages);
        } else {
          this.$drag.currentPageType = "single";
          this.$drag.currentPageId = item.linkPage;
        }
      }
      if (this.$drag.$vm.linkPageId !== item.linkPage) {
        this.$nextTick(() => {
          this.$drag.$vm.linkPageId = item.linkPage;
          if (item.origin == "remote") {
            this.$drag.$vm.linkPageId = item.id;
          }
          if (item.linkPage) {
            this.$drag.initPageConfig(item);
            if (this.$store.state.runtime) {
              if (item.showStatus === "1") {
                this.$chint.toggleLeftTab(true);
              } else if (item.showStatus === "2") {
                this.$chint.toggleLeftTab(false);
              } else if (item.showStatus === "3") {
                this.$chint.onFullScreen(document.querySelector("._home"));
              }
            }
          }
        });
      }
    },
    createPage() {
      this.pagesVisible = true;
    },
    createUploadPage() {
      this.pagesUploadVisible = true;
    },
    editPage() {
      this.editAble = true;
      this.pageForm = JSON.parse(JSON.stringify(this.operatePage));
      this.pagesVisible = true;
    },
    deletePage() {
      this.$confirm(`确认删除页面${this.operatePage.name}?`, "删除页面", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        closeOnClickModal: false
      })
        .then(() => {
          if (this.operatePage.number) {
            this.$message({
              type: "warning",
              message: "请先解除页面关联!"
            });
            return;
          }
          this.pages = this.pages.filter(page => {
            return page.name !== this.operatePage.name;
          });
          this.$drag.deletePage(this.operatePage.id, this.operatePage);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    addPage() {
      let message = "";
      let bool = this.pages.find(page => {
        return page.name === this.pageForm.name && this.pageForm.id != page.id;
      });
      if (bool) {
        message = "名称重复";
      }
      if (this.pageForm.name === "") {
        message = "名称必填";
      }
      if (message) {
        this.$message({
          type: "warning",
          message: message
        });
        return;
      }

      if (!this.pageForm.id) {
        this.pages.push({
          id: guid(),
          ...this.pageForm
        });
      } else {
        this.pages = this.pages.map(page => {
          if (page.id === this.pageForm.id) {
            return { ...page, ...this.pageForm };
          }
          return page;
        });
      }
      this.editAble = false;
      this.operatePage = null;
      this.resetForm();
    },
    resetForm() {
      this.pageForm = {
        name: "",
        type: "single",
        role: "0",
        pages: [
          {
            id: guid(),
            name: "默认页面"
          }
        ],
        showStatus: "1" //1显示菜单，2隐藏菜单，3全屏显示
      };
      this.pagesVisible = false;
      this.editAble = false;
    },
    initStyle() {}
  }
};
</script>

<style lang="less" scoped>
.views {
  height: calc(100%);
  width: calc(100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  color: rgb(183, 192, 205);
  opacity: 0.3;
}
.pagesUl {
  font-size: 14px;
  color: rgb(183, 192, 205);
  .pagesDiv {
    height: 45px;
    line-height: 45px;
    box-sizing: border-box;
    padding: 0 20px 0 17px;
    transition: 0.18s;
    // position: relative;
    .right {
      position: absolute;
      right: 20px;
      font-weight: 700px;
    }
  }
}
.typeDialog {
  position: absolute;
  z-index: 1;
  ul {
    background: white;
    background-clip: padding-box;
    border-radius: 0.25rem;
    border: 1px solid rgba(0, 0, 0, 0.15);
    margin: 0;
    padding: 10px 0;
    .item {
      box-sizing: border-box;
      padding: 0 20px;
      width: 150px;
      height: 30px;
      line-height: 30px;
    }
  }
}
</style>
