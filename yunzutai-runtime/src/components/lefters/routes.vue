<template>
  <div>
    <ul class="routesUl" :style="fontStyle" v-if="routes.length">
      <li
        v-for="(item, index) in routes"
        :key="item.id"
        :style="index !== routes.length - 1 ? spaceColor : {}"
        @click.stop="selectRoute(item)"
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
              v-for="_item in item.children"
              :key="_item.id"
              @click.stop="selectRoute(_item, item)"
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
  </div>
</template>

<script>
import { guid, packFont } from "@/util/common.js";
import webPages from "@/config/webSource.json";
import systemPages from "@/config/systemSource.json";
import menuIcons from "@/config/menuIcons.json";
import { getUploadJsList } from "@/api/server.js";
import { getUser } from "@/util/localStorage.js";
import { getUserAuthorityType } from "@/api/user.js";
export default {
  data() {
    return {
      routesStats: false,
      arrowTarget: [],
      fontStyle: {}, //字体样式
      otherStyle: {}, //路由字体和背景
      menuStyles: {}, //弹窗样式
      spaceColor: {}, //菜单间隔颜色
      dialogType: null, //弹窗显示否
      currentSelectRoute: "", //目前选择的一级路由
      currentSelectChildrenRoute: "", //目前选择的二级路由
      routes: this.$store.state.config.routeConfig.routes,
      routesVisible: false,
      routesLinkPages: [],
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
    let pages = this.$store.state.config.routeConfig.pages;
    let routes = this.$store.state.config.routeConfig.routes;
    let userInfo = {};
    let cacheUserInfo = getUser();
    let admin = cacheUserInfo.admin || {};
    if (cacheUserInfo && admin) {
      userInfo = {
        authorityLevel: admin.authorityLevel,
        userLevel: admin.userLevel,
        menus: JSON.parse(admin.menu) || []
      };
    }
    this.getUserAuthorityTypes().then(datas => {
      if (datas.permissionCategory == "1") {
        let menuIds = datas.menuIds;
        let arrs = [];
        for (let j = 0; j < menuIds.length; j++) {
          for (let i = 0; i < routes.length; i++) {
            if (routes[i].id == menuIds[j]) {
              arrs.push(routes[i]);
            }
          }
        }
        routes = arrs;
      } else {
        routes = this.filterRoutes(pages, routes, userInfo);
      }
      this.routes = routes;
      this.$parent.$refs.pages.initNumber(this.routes);
      this.$nextTick(() => {
        if (
          this.$route.query.sharePageId &&
          this.$route.query.shareToken &&
          this.$route.query.shareAll == "0"
        ) {
          let obj = JSON.parse(JSON.stringify(this.routes[0]));
          obj.linkPage = this.$route.query.sharePageId;
          obj.origin = "local";
          this.selectRoute(obj);
        } else if (
          this.$route.query.sharePageId &&
          this.$route.query.shareToken &&
          this.$route.query.shareAll == "1"
        ) {
          let linkPage = this.$route.query.sharePageId;
          let routes = this.routes;
          let objs = routes.filter(item => {
            return item.linkPage == linkPage;
          });
          this.selectRoute(objs[0]);
        } else {
          if (this.routes.length) {
            this.selectRoute(this.routes[0]);
          }
        }

        // let selectedMenu = this.$store.state.selectedMenu;
        // let level1 =
        //   (selectedMenu && selectedMenu.menu) ||
        //   this.$store.state.config.routeConfig.currentSelectRoute;
        // let level2 =
        //   (selectedMenu && selectedMenu.subMenu) ||
        //   this.$store.state.config.routeConfig.currentSelectChildrenRoute;
        // let item, childrenItem;
        // this.routes.some(route => {
        //   if (route.id === level1) {
        //     item = route;
        //     childrenItem = route.children.find(_item => {
        //       return _item.id === level2;
        //     });
        //   }
        // });
        // if (childrenItem) {
        //   this.arrowTarget = [item.id];
        //   this.currentSelectRoute = item.id;
        //   this.selectRoute(childrenItem, item);
        // } else if (item) {
        //   this.selectRoute(item);
        // } else {
        //   //默认打开第一个页面
        //   this.$parent.$refs.pages.selectPages();
        // }
      });
    });
  },
  methods: {
    //获取角色菜单列表
    async getUserAuthorityTypes() {
      let cacheUserInfo = getUser();
      let datas = await getUserAuthorityType({
        userId: cacheUserInfo.admin.id,
        subId: this.$store.state.subProjectId
      });
      return datas.data;
    },
    filterRoutes(pages, routes, userInfo) {
      let visiblePages = pages.filter(pg => {
        return +pg.role <= userInfo.authorityLevel;
      });
      let visibleRoutes = routes.filter(route => {
        let isVisible = this.isVisible(visiblePages, route, userInfo);
        if (isVisible && route.children && route.children.length) {
          route.children = route.children.filter(rc => {
            let childVisible = this.isVisible(visiblePages, rc, userInfo);
            return childVisible;
          });
        }
        return isVisible;
      });
      return visibleRoutes;
    },
    isVisible(pages, route, userInfo) {
      let isAdmin = userInfo.userLevel !== 0;
      let pageNotLinked = !route.linkPage;
      if (isAdmin !== 0 && pageNotLinked) {
        return false;
      }
      //本地页面
      let conditionLocal =
        pages.filter(vp => {
          return vp.id === route.linkPage;
        }).length > 0;
      //用户系统菜单的配置当前与项目的系统页面的字段值无法一一对应
      //后续如果实现了意义对应 这里的代码可以注释
      let menus = userInfo.menu || [];
      let hardcodeMenus = menus.map(me => {
        switch (me) {
          case "commitLog":
            return "操作日志";
          case "userManage":
            return "用户管理";
        }
      });
      // 系统页面
      //如果是管理员 默认可以看到所有的系统页面（如果配置了）
      let conditionSystem =
        hardcodeMenus.filter(me => {
          return me === route.linkPage;
        }).length > 0;
      //第三方上传页面 默认所有用户都可见

      let conditionOther = false;
      if (route.origin === "other") {
        conditionOther = true;
      }
      //远程页面 判断逻辑写在这里
      let conditionRemote = false;
      if (route.origin === "remote") {
        conditionRemote = true;
      }
      return (
        isAdmin ||
        conditionLocal ||
        conditionSystem ||
        conditionOther ||
        conditionRemote
      );
    },
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
    showDialog(type, item, childrenItem) {
      this.operateRoute = item;
      this.operateChildRoute = childrenItem;
      this.menuStyles = {
        left: event.layerX + "px",
        top: event.clientY - event.screenY + event.clientY + "px"
      };
      this.dialogType = type;
    },
    clearDialog() {
      this.dialogType = null;
    },
    createRoute() {
      this.routesVisible = true;
      this.getRouteLinkPages(true);
      this.clearDialog();
      this.routeForm.icon = menuIcons[0].icon;
    },
    editRoute() {
      if (this.operateChildRoute) {
        this.routeForm = JSON.parse(JSON.stringify(this.operateChildRoute));
      } else {
        this.routeForm = JSON.parse(JSON.stringify(this.operateRoute));
        this.operateRoute = null;
      }

      this.routesVisible = true;
      this.getRouteLinkPages(true);
      this.clearDialog();
    },
    // 选择图标
    choiceIcon() {
      this.iconClz = this.routeForm.icon;
      this.dlogIcon = true;
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
        let userLevel = getUser().admin.userLevel;
        let isEmpty = this.pagesEmpty(item, parentItem, userLevel);
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
          if (!isEmpty) return;
          this.$drag.layout.$refs.tabMenus.updateTitle(
            item.name,
            "",
            item.icon
          );
        } else {
          if (!isEmpty) return;
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
          this.currentSelectChildrenRoute = item.id;
        }
        console.log(item);
        this.$parent.selectPage(item);
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
    pagesEmpty(item, parentItem, userLevel) {
      if (userLevel == 1) {
        if (!item.linkPage) {
          return false;
        }
      }
      return true;
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
          } else {
            this.routes = this.routes.filter(route => {
              return route !== this.operateRoute;
            });
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });

      this.clearDialog();
    },
    addRoute() {
      let message = "";
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
        message = "名称重复";
      }
      if (this.routeForm.name === "" || this.routeForm.icon === "") {
        message = "名称或图标必填";
      }
      if (message) {
        this.$message({
          message: message,
          type: "warning"
        });
        return;
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
      this.routeForm = {
        name: "",
        icon: "",
        origin: "local", //local,remote,system
        type: "single", //页面类型
        otherType: "0",
        linkPage: "",
        children: []
      };
      this.routesVisible = false;
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
