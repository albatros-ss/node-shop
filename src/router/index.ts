import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import store from "../store/index";
import Home from "../views/Home.vue";
import Add from "../views/Add.vue";
import Card from "../views/Card.vue";
import Courses from "../views/Courses.vue";
import Orders from "../views/Orders.vue";
import Auth from "../views/Auth.vue";
import ResetPassword from "../views/ResetPassword.vue";
import ConfirmEmail from "../views/ConfirmEmail.vue";
import Profile from "../views/Profile.vue";
import emptyPage from "../views/EmptyPage.vue";

const cleanTemp = {
  template: "<div><router-view></router-view></div>",
};

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "Home",
    component: Home,
    meta: { title: "Home" },
  },
  {
    path: "/courses",
    name: "Courses",
    component: Courses,
    meta: { title: "Courses" },
    children: [],
  },
  {
    path: "/add",
    name: "Add",
    component: Add,
    meta: { title: "Add Course" },
  },
  {
    path: "/card",
    name: "Card",
    component: Card,
    meta: { title: "Card" },
  },
  {
    path: "/orders",
    name: "Orders",
    component: Orders,
    meta: { title: "Orders" },
  },
  {
    path: "/auth",
    name: "Auth",
    component: Auth,
    meta: { title: "Auth" },
  },
  {
    path: "/course/:id",
    component: cleanTemp,
    children: [
      {
        path: "",
        name: "Course",
        meta: { title: "Course" },
        component: () => import("../views/Course.vue"),
      },
      {
        path: "edit",
        name: "CourseEdit",
        meta: { title: "CourseEdit" },
        component: () => import("../views/CourseEdit.vue"),
      },
    ],
  },
  {
    path: "/password/:token",
    name: "ResetPassword",
    component: ResetPassword,
    meta: { title: "Reset Password" },
  },
  {
    path: "/confirm/:token",
    name: "ConfirmEmail",
    component: ConfirmEmail,
    meta: { title: "Confirm Email" },
  },
  {
    path: "/profile",
    name: "Profile",
    component: Profile,
    meta: { title: "Profile" },
  },
  {
    path: "*",
    name: "emptyPage",
    component: emptyPage,
    meta: { title: "Empty Page" },
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  document.title = to.meta.title ? to.meta.title : "node-shop";
  if (
    to.name !== "Home" &&
    to.name !== "Auth" &&
    to.name !== "Courses" &&
    to.name !== "ResetPassword" &&
    to.name !== "ConfirmEmail" &&
    to.name !== "Profile"
  ) {
    if (store.state.isAuth) {
      next();
    } else {
      next({ name: "Home" });
    }
  } else {
    next();
  }
});

export { router, routes };
