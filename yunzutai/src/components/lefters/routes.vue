<template>
  <div @contextmenu.prevent.stop="$drag.showTreeContextMenu('routes')">
    <ul class="routesUl" :style="fontStyle" v-if="routes.length">
      <li
        draggable="true"
        @dragstart="dragstart(item, index)"
        @dragover="dragover(item, index)"
        @drop="drop"
        v-for="(item, index) in routes"
        :key="item.id"
        :style="index !== routes.length - 1 ? spaceColor : {}"
        @click.stop="selectRoute(item)"
        @contextmenu.prevent.stop="$drag.showTreeContextMenu('routes', item)"
      >
        <div
          class="routesDiv"
          :style="
            currentSelectRoute === item.id && !currentSelectChildrenRoute
              ? otherStyle
              : null
          "
        >
          <span :class="'iconfont ' + item.icon"></span>
          <span class="title wrapper">{{ item.name }}</span>
          <i
            v-show="item.children.length"
            :class="
              arrowTarget.indexOf(item.id) !== -1
                ? 'icon el-icon-arrow-right active'
                : 'icon el-icon-arrow-right'
            "
          ></i>
        </div>
        <transition name="fade">
          <ul
            class="subItem"
            v-if="item.children.length && arrowTarget.indexOf(item.id) !== -1"
          >
            <li
              v-for="(_item, _index) in item.children"
              :key="_item.id"
              @click.stop="selectRoute(_item, item)"
              @contextmenu.prevent.stop="
                $drag.showTreeContextMenu('routes_child', _item)
              "
              draggable="true"
              @dragstart.stop="dragstart(_item, _index, item)"
              @dragover.stop="dragover(_item, _index, item)"
              @drop.stop="drop"
            >
              <div
                class="routesDiv"
                :style="
                  currentSelectChildrenRoute === _item.id ? otherStyle : {}
                "
              >
                <span :class="'iconfont ' + _item.icon"></span>
                <span class="title wrapper">{{ _item.name }}</span>
              </div>
            </li>
          </ul>
        </transition>
      </li>
    </ul>
    <div class="views" v-else>菜单列表</div>

    <el-dialog
      custom-class="dialogs"
      :title="dialogTitle"
      center
      :visible.sync="routesVisible"
      :before-close="resetForm"
      :append-to-body="true"
      :close-on-click-modal="false"
    >
      <el-form
        :model="routeForm"
        label-width="80px"
        :rules="myrules"
        ref="myrules"
      >
        <el-form-item label="菜单名称" prop="name">
          <el-input
            v-model="routeForm.name"
            placeholder="请输入菜单名称"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="绑定图标">
          <div class="divIcons">
            <span :class="routeForm.icon ? 'active' : ''">
              <i :class="'iconfont ' + routeForm.icon"></i>
              <i
                :class="routeForm.icon ? 'el-icon-delete' : 'el-icon-plus'"
                @click.stop="choiceIcons"
              ></i>
            </span>
            <el-button type="primary" plain size="mini" @click.stop="choiceIcon"
              >选择图标</el-button
            >
          </div>
        </el-form-item>
        <el-form-item label="页面来源">
          <el-select
            v-model="routeForm.origin"
            style="width:300px"
            @change="getRouteLinkPages(false)"
          >
            <el-option label="本地页面" value="local"></el-option>
            <el-option label="远程页面" value="remote"></el-option>
            <el-option label="系统页面" value="system"></el-option>
            <el-option label="其他页面" value="other"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-show="routeForm.origin === 'local'" label="页面类型">
          <el-select
            style="width:300px"
            v-model="routeForm.type"
            @change="getRouteLinkPages(false)"
          >
            <el-option label="单页面" value="single"></el-option>
            <el-option label="多页面" value="multi"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-show="routeForm.origin === 'remote'" label="页面类型">
          <el-select
            style="width:300px"
            v-model="routeForm.remoteType"
            @change="getRouteLinkPages(false)"
          >
            <el-option label="内嵌" value="embedded"></el-option>
            <el-option label="跳转" value="jump"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-show="routeForm.origin === 'other'" label="页面类型">
          <el-select
            style="width:300px"
            v-model="routeForm.otherType"
            @change="getRouteLinkPages(false)"
          >
            <el-option label="光伏" value="0"></el-option>
            <el-option label="仪器仪表" value="1"></el-option>
            <el-option label="低压" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="关联页面"
          prop="remoteUrl"
          v-show="routeForm.origin === 'remote'"
        >
          <el-input
            v-model="routeForm.remoteUrl"
            placeholder="请输入网页地址"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item v-show="routeForm.origin !== 'remote'" label="关联页面">
          <el-select
            style="width:300px"
            v-model="routeForm.linkPage"
            placeholder="请选择页面"
            clearable
          >
            <el-option
              v-for="item in routesLinkPages"
              :key="item.name"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addRoute">确 定</el-button>
        <el-button @click="resetForm">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="选择图标"
      :visible.sync="dlogIcon"
      custom-class="icon-dialog"
      append-to-body
      :close-on-click-modal="false"
    >
      <div class="icon-list_box">
        <ul class="icon-list__content">
          <li
            v-for="(item, index) in menuIcons"
            :key="index"
            :class="{ 'border-checked': iconClz === item.icon }"
            @click="iconClz = item.icon"
          >
            <span :class="'iconfont ' + item.icon"></span>
          </li>
        </ul>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dlogIcon = false">取 消</el-button>
        <el-button
          type="primary"
          @click="
            routeForm.icon = iconClz;
            dlogIcon = false;
          "
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { guid, packFont } from "@/util/common.js";
import webPages from "@/config/webSource.json";
import systemPages from "@/config/systemSource.json";
import menuIcons from "@/config/menuIcons.json";
import { getUploadJsList } from "@/api/server.js";
export default {
  data() {
    var myName = (rule, value, callback) => {
      let routes = this.routes;
      if (this.operateRoute) {
        routes = this.operateRoute.children;
      }
      let bool = routes.find(route => {
        return (
          route.name === this.routeForm.name && this.routeForm.id !== route.id
        );
      });
      if (bool) {
        callback(new Error("同级菜单不能同名!"));
        return;
      }
      if (this.routeForm.name === "") {
        callback(new Error("请输入页面名称!"));
        return;
      }
      callback();
    };

    var myRemoteUrl = (rule, value, callback) => {
      if (this.routeForm.origin == "remote") {
        if (value != "" && value) {
          var reg = /^([hH][tT]{2}[pP]:\/\/|[hH][tT]{2}[pP][sS]:\/\/)(([A-Za-z0-9-~]+)\.)+([A-Za-z0-9-/])+$/;
          if (!reg.test(value)) {
            callback(new Error("地址格式错误!"));
            return;
          } else {
            callback();
            return;
          }
        } else {
          callback(new Error("地址不能为空!"));
          return;
        }
      }
      callback();
    };
    return {
      routesStats: false,
      dialogTitle: "",
      arrowTarget: [],
      fontStyle: {}, //字体样式
      otherStyle: {}, //路由字体和背景
      spaceColor: {}, //菜单间隔颜色
      currentSelectRoute: "", //目前选择的一级路由
      currentSelectChildrenRoute: "", //目前选择的二级路由
      routes: this.$store.state.config.routeConfig.routes,
      routesVisible: false,
      routesLinkPages: [],
      myrules: {
        name: [
          { required: true, trigger: "blur", validator: myName } // message: '请选择名称'
        ],
        remoteUrl: [
          { required: true, trigger: "blur", validator: myRemoteUrl } // message: '请选择名称'
        ]
      },
      routeForm: {
        name: "",
        icon: "",
        origin: "local", //local,remote,system
        type: "single", //页面类型
        otherType: "0",
        remoteType: "embedded",
        linkPage: "",
        children: [],
        role: "0",
        pages: [],
        remoteUrl: ""
      },
      operateRoute: null, //操作的一级路由
      operateChildRoute: null, //操作的二级路由
      dragParentItem: null,
      dragItem: null,
      dragIndex: null,
      menuIcons, //图标库
      dlogIcon: false, //选择图标
      iconClz: ""
    };
  },
  watch: {
    routes: {
      handler(val) {
        this.$parent.$refs.pages.initNumber(val);
      },
      deep: true
    }
  },
  mounted() {
    this.$parent.$refs.pages.initNumber(this.routes);
    this.$nextTick(() => {
      let level1 = this.$store.state.config.routeConfig.currentSelectRoute;
      let level2 = this.$store.state.config.routeConfig
        .currentSelectChildrenRoute;
      let item, childrenItem;
      this.routes.some(route => {
        if (route.id === level1) {
          item = route;
          childrenItem = route.children.find(_item => {
            return _item.id === level2;
          });
        }
      });
      if (childrenItem) {
        this.arrowTarget = [item.id];
        this.currentSelectRoute = item.id;
        this.selectRoute(childrenItem, item);
      } else if (item) {
        this.selectRoute(item);
      } else {
        //默认打开第一个页面
        this.$parent.$refs.pages.selectPages();
      }
    });
  },
  methods: {
    dragstart(item, index, parentEl) {
      this.dragParentItem = parentEl;
      this.dragItem = item;
      this.dragIndex = index;
    },
    dragover(item, index, parentEl) {
      if (index !== this.dragIndex && this.dragParentItem === parentEl) {
        if (!parentEl) {
          this.routes = this.routes.map(route => {
            if (route === this.dragItem) {
              return item;
            } else if (route === item) {
              return this.dragItem;
            }
            return route;
          });
        } else {
          this.dragParentItem.children = this.dragParentItem.children.map(
            route => {
              if (route === this.dragItem) {
                return item;
              } else if (route === item) {
                return this.dragItem;
              }
              return route;
            }
          );
        }

        this.dragIndex = index;
      }
      event.preventDefault();
    },
    drop() {
      event.preventDefault();
    },
    //右击显示菜单
    // showDialog(type, item, childrenItem) {
    //   this.operateRoute = item;
    //   this.operateChildRoute = childrenItem;
    //   this.menuStyles = {
    //     left: event.layerX + "px",
    //     top: event.clientY - event.screenY + event.clientY + "px"
    //   };
    // },
    createRoute() {
      if (this.operateRoute) {
        this.dialogTitle = "添加二级菜单";
      } else {
        this.dialogTitle = "添加菜单";
      }

      this.routesVisible = true;
      this.getRouteLinkPages(true);
      this.routeForm.icon = menuIcons[0].icon;
    },
    editRoute() {
      if (this.operateChildRoute) {
        this.dialogTitle = "编辑二级菜单";
      } else {
        this.dialogTitle = "编辑菜单";
      }
      if (this.operateChildRoute) {
        this.routeForm = JSON.parse(JSON.stringify(this.operateChildRoute));
      } else {
        this.routeForm = JSON.parse(JSON.stringify(this.operateRoute));
        this.operateRoute = null;
      }

      this.routesVisible = true;
      this.getRouteLinkPages(true);
    },
    // 选择图标
    choiceIcon() {
      this.iconClz = this.routeForm.icon;
      this.dlogIcon = true;
    },
    choiceIcons() {
      if (this.routeForm.icon) {
        this.routeForm.icon = "";
      } else {
        this.choiceIcon();
      }
    },
    selectRoutes(item, parentItem) {
      if (parentItem) {
        this.arrowTarget = [parentItem.id];
      }
      this.selectRoute(...arguments);
    },
    selectRoute(item, parentItem) {
      try {
        if (
          this.$store.state.runtime &&
          item.origin == "remote" &&
          item.remoteType == "jump"
        ) {
          window.open(item.remoteUrl);
          return;
        }
        this.$drag.addParamsLocked();
        if (!parentItem) {
          let indexs = this.arrowTarget.indexOf(item.id);
          if (indexs !== -1) {
            this.arrowTarget.splice(indexs, 1);
          } else {
            if (this.routesStats) {
              this.arrowTarget = [item.id];
            } else {
              this.arrowTarget.push(item.id);
            }
          }
          this.$drag.layout.$refs.tabMenus.updateTitle(
            item.name,
            "",
            item.icon
          );
        } else {
          this.$drag.layout.$refs.tabMenus.updateTitle(
            parentItem.name,
            item.name,
            item.icon
          );
        }
        if (!parentItem) {
          this.currentSelectRoute = item.id;
          this.currentSelectChildrenRoute = null;
        } else {
          this.currentSelectRoute = parentItem.id;
          this.currentSelectChildrenRoute = item.id;
        }
        this.$parent.selectPage(item);
        // 分享id
        sessionStorage.setItem("shareRouteId", item.linkPage);
        //路由切换
        if (!item.linkPage) {
          this.$message({
            type: "warning",
            message: "当前菜单未关联任何界面!"
          });
          return;
        }
      } catch (error) {
        this.$message({
          type: "warning",
          message: "路由跳转失败"
        });
        this.$drag.paramsLocked++;
      }
    },
    deleteRoute() {
      this.$confirm(`确认删除该菜单项?`, "删除菜单", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        closeOnClickModal: false
      })
        .then(() => {
          if (this.operateChildRoute) {
            this.operateRoute.children = this.operateRoute.children.filter(
              route => {
                return route !== this.operateChildRoute;
              }
            );
            if (this.operateChildRoute.id === this.currentSelectRoute) {
              this.$drag.layout.$refs.tabMenus.updateTitle(null, "", null);
            }
          } else {
            this.routes = this.routes.filter(route => {
              return route !== this.operateRoute;
            });
            if (this.operateRoute.id === this.currentSelectRoute) {
              this.$drag.layout.$refs.tabMenus.updateTitle(null, "", null);
            }
          }
          this.operateRoute = null;
          this.operateChildRoute = null;
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    addRoute() {
      this.$refs["myrules"].validate(valid => {
        if (valid) {
          let routes = this.routes;
          if (this.operateRoute) {
            routes = this.operateRoute.children;
          }
          if (this.routeForm.origin == "remote") {
            this.routeForm.linkPage = guid();
          }
          if (!this.routeForm.id) {
            routes.push({
              id: guid(),
              ...this.routeForm
            });
          } else {
            routes = routes.map(route => {
              if (route.id === this.routeForm.id) {
                return this.routeForm;
              }
              return route;
            });
          }
          routes = JSON.parse(JSON.stringify(routes));
          if (this.operateRoute) {
            this.operateRoute.children = routes;
            if (this.currentSelectChildrenRoute === this.routeForm.id) {
              this.$drag.layout.$refs.tabMenus.updateTitle(
                this.operateRoute.name,
                this.routeForm.name,
                this.routeForm.icon
              );
            }
          } else {
            this.routes = routes;
            if (this.currentSelectRoute === this.routeForm.id) {
              this.$drag.layout.$refs.tabMenus.updateTitle(
                this.routeForm.name,
                "",
                this.routeForm.icon
              );
            }
          }

          this.resetForm();
          this.routesVisible = false;
        } else {
          return false;
        }
      });
    },
    /**
     * bool
     */
    getRouteLinkPages(bool) {
      if (!bool) {
        this.routeForm.linkPage = "";
      }
      //页面来源变更，更改对应关联页面
      switch (this.routeForm.origin) {
        case "local":
          this.routesLinkPages = this.$parent.$refs.pages.pages.filter(page => {
            return page.type === this.routeForm.type;
          });
          break;
        case "remote":
          this.routesLinkPages = webPages.filter(page => {
            return page.type === this.routeForm.type;
          });
          break;
        case "system":
          this.routesLinkPages = systemPages;
          break;
        case "other":
          getUploadJsList({ pageType: this.routeForm.otherType }).then(res => {
            this.routesLinkPages = res.data.map(item => {
              return {
                name: item.name,
                id:
                  item.id +
                  "----" +
                  item.fileAddr
                    .split(window.config.uploadJsPreUrl)[1]
                    .slice(0, -3)
              };
            });
          });
          break;
        default:
          break;
      }
    },
    resetForm() {
      this.routesVisible = false;
      this.routeForm = {
        name: "",
        icon: "",
        origin: "local", //local,remote,system
        type: "single", //页面类型
        otherType: "0",
        remoteType: "embedded",
        linkPage: "",
        children: [],
        remoteUrl: ""
      };
      this.$refs["myrules"].resetFields();
    },
    //折叠或打开菜单
    initRoutes(bool) {
      if (bool) {
        this.arrowTarget = this.arrowTarget.slice(0, 1);
      }
    },
    //初始化样式
    initStyle() {
      let config = this.$parent.config;
      this.fontStyle = packFont(config["字体样式"].value);
      this.otherStyle = {
        color: config["选中的字体颜色"].value,
        background: config["选中的条目颜色"].value
      };
      let color = config["间隔线色"].value;
      let linear = config["间隔线的渐变范围"].value;
      let pre = `linear-gradient(90deg, transparent ${50 -
        linear[0]}%, ${color}, transparent ${50 +
        linear[0]}%) 1 0 / 1 / 0 stretch`;
      let borderImage = linear[1] ? "none 100% / 1 / 0 stretch" : pre;
      this.spaceColor = {
        borderImage: borderImage,
        borderBottom: "1px solid " + color
      };
      this.routesStats = config["菜单折叠"].value;
    }
  }
};
</script>
<style lang="less" scoped>
.divIcons {
  width: 300px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  span {
    margin-right: 30px;
    height: 60px;
    width: 60px;
    border: 1px dashed #c0c4cc;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    .el-icon-plus {
      font-size: 18px;
    }
    .el-icon-delete {
      font-size: 18px;
      transition: opacity 0.3s;
      opacity: 0;
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0px;
      right: 0px;
      color: #fff;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: rgba(0, 0, 0, 0.7);
    }
    &.active {
      &:hover,
      &:active {
        .el-icon-delete {
          opacity: 1;
        }
      }
    }
    cursor: pointer;
    .iconfont {
      font-size: 30px;
    }
  }
}
/deep/ .dialogs {
  width: 450px;
  .el-dialog__title {
    font-weight: bold;
  }
  input {
    text-align: center;
    width: 300px;
  }
}
.routesUl {
  height: calc(100%);
  overflow: overlay;
  padding-bottom: 100px;
  box-sizing: border-box;
}
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
.routesDiv {
  height: 45px;
  line-height: 45px;
  box-sizing: border-box;
  border-bottom: 1px solid #2b2e37;
  padding: 0 20px 0 17px;
  position: relative;
  display: flex;
  align-items: center;
  .title {
    margin-left: 10px;
    max-width: 110px;
    display: inline-block;
  }
  .icon {
    position: absolute;
    right: 20px;
    top: calc(50% - 7px);
    transition: all 0.5s;
    transform: rotate(0deg);
    &.active {
      transform: rotate(90deg);
    }
  }
}
.subItem {
  .routesDiv {
    padding: 0 20px 0 40px;
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

.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
.el-dialog__body {
  padding: 20px 20px;
}
.icon-dialog {
  width: 800px;
}
/deep/.el-dialog__header {
  font-weight: 700;
  padding-bottom: 10px;
  border-bottom: 1px solid #ccc;
}
.icon-list_box {
  height: 400px;
  overflow: auto;
}
.icon-list__content {
  font-size: 40px;
  display: flex;
  flex-wrap: wrap;
  li {
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 2px;
    height: 70px;
    width: 74px;
    border: 2px solid transparent;
    &:hover {
      color: #409eff;
      cursor: pointer;
    }
    &:active {
      border-color: #409eff;
    }
    .iconfont {
      font-size: 37px;
    }
  }
}
.border-checked {
  border-color: #409eff !important;
}
</style>
