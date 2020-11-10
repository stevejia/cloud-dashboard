import { commonRequest } from "@/api/request";

class Chint {
  constructor(drag) {
    this.drag = drag;
    this.pageParams = null;
    this.drag.$chint = this;
  }
  //请求数据
  request(params) {
    return new Promise(resolve => {
      commonRequest(params).then(res => {
        resolve(res);
      });
    });
  }
  //获取当前页面配置
  getCurrentPageConfig() {
    let pageId = this.drag.currentPageId;
    let config = this.drag.centerConfigs[pageId];
    let { white, black } = config;
    return {
      white,
      black
    };
  }
  //获取当前页面id
  getCurrentPageID() {
    let pageId = this.drag.currentPageId;
    return pageId;
  }
  //左侧导航切换
  toggleLeftTab(status) {
    this.drag.$tabMenus.hideLeft(status);
  }
  //判断当前是否为全屏
  isFullScreen() {
    return document.fullscreen;
  }
  // 进入全屏
  onFullScreen(element) {
    element = element || document.documentElement;
    element.requestFullscreen();
  }
  // 退出全屏
  offFullScreen() {
    if (this.isFullScreen()) {
      document.exitFullscreen();
    }
  }
  // 路由跳转
  // 实时监控/告(预)警
  routerPush(pageName, query) {
    let paths = pageName.split("/");
    let $routes = this.drag.$left.$refs.routes;
    let routes = $routes.routes;
    let targets = [];
    paths.forEach((path, index) => {
      routes.find(route => {
        if (route.name === path) {
          if (index !== paths.length - 1) {
            targets.push(route);
            routes = route.children;
          } else {
            targets.push(route);
          }
          return true;
        }
      });
    });
    if (query) {
      this.pageParams = query;
    }
    this.drag.paramsLocked++;
    $routes.selectRoutes(...targets.reverse());
  }
  // 清除当前页面参数
  clearPageParams() {
    this.pageParams = null;
  }
  // 获取当前页面传入的参数
  getCurrentPageParams() {
    return this.pageParams;
  }
  // 获取页面列表
  getPageList() {
    let pages = this.drag.$left.$refs.pages.pages;
    return pages;
  }
  // 获取菜单列表
  getRouteList() {
    let routes = this.drag.$left.$refs.routes.routes;
    return routes;
  }
}
export default Chint;
