/* eslint-disable no-unused-vars */
import router from "@/router";
import { getToken } from "@/util/localStorage.js";
import store from "./../store/index";
const white = ["login"];
router.beforeEach((to, from, next) => {
  const token = getToken();
  if (token) {
    if (to.name === "login") {
      next({
        name: "projectList"
      });
    } else if (to.name === "home" && !store.state.loadData) {
      next({
        name: "load"
      });
    } else if (white.includes(to.name)) {
      next();
    } else {
      next();
    }
  } else {
    if (white.includes(to.name)) {
      next();
    } else {
      next({
        name: "login"
      });
    }
  }
});
