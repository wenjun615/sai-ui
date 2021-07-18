import Vue from "vue";
import VueRouter from "vue-router";
import Home from "@/views/Home";
import Login from "@/views/Login";
import Authority from "@/views/authority/Authority";
import User from "@/views/authority/user/User";
import Role from "@/views/authority/role/Role";
import Menu from "@/views/authority/menu/Menu";
import Resource from "@/views/authority/resource/Resource";

Vue.use(VueRouter);

// 所有权限通用路由
export const constantRoutes = [
  {
    path: "/",
    name: "首页",
    component: Home,
    hidden: true,
    children: [
      {
        path: "/home/user",
        component: User,
      },
      {
        path: "/home/role",
        component: Role,
      },
      {
        path: "/home/menu",
        component: Menu,
      },
      {
        path: "/home/resource",
        component: Resource,
      },
    ],
  },
  {
    path: "/login",
    name: "登录",
    component: Login,
    hidden: true,
  },
  {
    path: "/error",
    name: "错误",
    component: () => import("@/views/error/Error"),
    hidden: true,
  },
];

// 异步挂载的路由，根据权限动态加载的路由
export const asyncRoutes = [
  {
    path: "/authority",
    name: "权限列表",
    component: Authority,
    meta: {
      roles: ["admin"],
    },
    children: [
      {
        path: "/user",
        redirect: "/home/user",
        name: "用户",
        meta: {
          roles: ["admin"],
        },
      },
      {
        path: "/role",
        redirect: "/home/role",
        name: "角色列表",
        meta: {
          roles: ["admin"],
        },
      },
      {
        path: "/menu",
        redirect: "/home/menu",
        name: "菜单列表",
        meta: {
          roles: ["admin"],
        },
      },
      {
        path: "/resource",
        redirect: "/home/resource",
        name: "资源列表",
        meta: {
          roles: ["admin"],
        },
      },
    ],
  },
  // 404 页面路由最后加载，如果放在前面，则会拦截所有路径
  {
    path: "*",
    redirect: "/error",
    hidden: true,
  },
];

const createRouter = () =>
  new VueRouter({
    routes: constantRoutes,
  });

const router = createRouter();

// 重置路由，防止 addRoutes 重复添加路由
export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher;
}

export default router;
