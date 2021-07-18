import router from "@/router";
import { getToken } from "@/utils/auth";
import store from "@/store";
import { Message } from "element-ui";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

// 隐藏进度环
NProgress.configure({ showSpinner: false });

router.beforeEach(async (to, from, next) => {
  NProgress.start();
  if (getToken()) {
    if (to.path === "/login") {
      next("/");
    } else {
      const hasRoles = store.state.roles && store.state.roles.length > 0;
      if (hasRoles) {
        next();
      } else {
        try {
          // 因为 loadInfo 是异步方法，await 表示等待这个异步方法的结果
          const { roles } = await store.dispatch("loadInfo");
          const accessedRoutes = await store.dispatch("generateRoutes", roles);
          // 添加动态路由
          accessedRoutes.forEach((accessedRoute) => {
            router.addRoute(accessedRoute);
          });
          /*
          当因为 addRoutes 未完成而找不到路由时，一旦当前访问路径匹配不到路由时，会再次执行 beforeEach，直到匹配正确路由
          并设置不能通过浏览器后退历史记录
          确保至少有一个路由出口（最后加入的 * 404 路由），否则会无限循环
           */
          next({ ...to, replace: true });
        } catch (error) {
          await store.dispatch("resetUserInfo");
          Message.error(error.message || "发生错误");
          next(`/login?redirect=${to.path}`);
        }
      }
    }
  } else {
    if (to.path === "/login") {
      next();
    } else {
      next(`/login?redirect=${to.path}`);
    }
  }
});

router.afterEach(() => {
  NProgress.done();
});
