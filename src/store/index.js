import Vue from "vue";
import Vuex from "vuex";
import { removeToken, setToken } from "@/utils/auth";
import { loadInfo, login, logout } from "@/api/user";
import { constantRoutes, asyncRoutes, resetRouter } from "@/router";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    name: "",
    icon: "",
    roles: [],
    routes: [],
    addRoutes: [],
  },
  mutations: {
    SET_NAME(state, name) {
      state.name = name;
    },
    SET_ICON(state, icon) {
      state.icon = icon;
    },
    SET_ROLES(state, roles) {
      state.roles = roles;
    },
    SET_ROUTES(state, routes) {
      state.addRoutes = routes;
      // concat() 用于连接两个或多个数组，不改变原有数组
      state.routes = constantRoutes.concat(routes);
    },
  },
  actions: {
    login({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        const { username, password } = userInfo;
        login({ username, password })
          .then((response) => {
            const token = response.data;
            setToken(token);
            resolve();
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    loadInfo({ commit }) {
      return new Promise((resolve, reject) => {
        loadInfo()
          .then((response) => {
            const { name, icon, roles } = response.data;
            commit("SET_NAME", name);
            commit("SET_ICON", icon);
            commit("SET_ROLES", roles);
            resolve(response.data);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    logout({ commit }) {
      return new Promise((resolve, reject) => {
        logout()
          .then(() => {
            commit("SET_NAME", "");
            commit("SET_ICON", "");
            commit("SET_ROLES", []);
            commit("SET_ROUTES", []);
            removeToken();
            resetRouter();
            resolve();
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    resetUserInfo({ commit }) {
      return new Promise((resolve) => {
        commit("SET_NAME", "");
        commit("SET_ICON", "");
        commit("SET_ROLES", []);
        removeToken();
        resolve();
      });
    },
    generateRoutes({ commit }, roles) {
      return new Promise((resolve) => {
        let accessedRoutes;
        if (roles.includes("admin")) {
          accessedRoutes = asyncRoutes || [];
        } else {
          accessedRoutes = filterAsyncRoutes(asyncRoutes, roles);
        }
        commit("SET_ROUTES", accessedRoutes);
        resolve(accessedRoutes);
      });
    },
  },
  modules: {},
});

// 获取当前登录用户角色能够访问的路由
function filterAsyncRoutes(routes, roles) {
  const res = [];
  routes.forEach((route) => {
    const temp = { ...route };
    if (hasPermission(temp, roles)) {
      if (temp.children) {
        temp.children = filterAsyncRoutes(temp.children, roles);
      }
      res.push(temp);
    }
  });
  return res;
}

// 当前登录用户角色是否能够访问 route 路由
function hasPermission(route, roles) {
  if (route.meta && route.meta.roles && route.meta.roles.length > 0) {
    // some() 检测数组元素是否满足指定条件，若满足则返回 true，并且剩下的元素不再执行检测，若没有满足条件的元素，则返回 false
    return roles.some((role) => route.meta.roles.includes(role.name));
  } else {
    // 不需要角色就能访问
    return true;
  }
}
