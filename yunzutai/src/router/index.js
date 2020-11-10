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
    path: "/projectList",
    component: () =>
      import(
        /* webpackChunkName: "about" */ "../views/projectList/projectList.vue"
      ),
    name: "projectList"
  },
  {
    path: "/projectMap",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/projectList/map.vue"),
    name: "projectMap"
  }
];

const router = new VueRouter({
  routes
});

export default router;
