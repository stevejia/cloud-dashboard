import Vue from "vue";
import VueRouter from "vue-router";
import layout from "@/components/layout.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    component: layout,
    redirect: "/home",
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
  }
];

const router = new VueRouter({
  routes
});

export default router;
