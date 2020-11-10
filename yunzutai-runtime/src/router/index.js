import Vue from "vue";
import VueRouter from "vue-router";
import layout from "@/components/layout.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: "/login"
  },
  {
    path: "/login",
    name: "login",
    component: () =>
      import(/* webpackChunkName: "login" */ "../views/login.vue")
  },
  {
    path: "/shareLien",
    name: "shareLien",
    component: () =>
      import(/* webpackChunkName: "login" */ "../views/shareLien.vue")
  },
  {
    path: "/load",
    name: "load",
    component: () => import(/* webpackChunkName: "login" */ "../views/load.vue")
  },
  {
    path: "/home",
    component: layout,
    children: [
      {
        path: "/home",
        component: () =>
          import(/* webpackChunkName: "about" */ "../views/home.vue"),
        name: "home"
      }
    ]
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
  },
  {
    path: "/project",
    component: () =>
      import(/* webpackChunkName: "project" */ "../views/project/layout.vue"),
    redirect: "/project/list",
    children: [
      {
        path: "list",
        component: () =>
          import(/* webpackChunkName: "list" */ "../views/project/list"),
        name: "projectList"
      },
      {
        path: "map",
        component: () =>
          import(/* webpackChunkName: "list" */ "../views/project/list/map"),
        name: "projectMap"
      },
      {
        path: "user",
        component: () =>
          import(/* webpackChunkName: "user" */ "../views/project/user"),
        name: "userList"
      }
    ]
  }
];

const router = new VueRouter({
  routes
});

export default router;
