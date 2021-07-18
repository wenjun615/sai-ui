import axios from "axios";
import store from "@/store";
import { getToken } from "@/utils/auth";
import { Message, MessageBox } from "element-ui";

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 5000,
});

service.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers["Authorization"] = "Bearer " + token;
    }
    return config;
  },
  (error) => {
    console.log(error);
    return Promise.reject(error);
  }
);

service.interceptors.response.use(
  (response) => {
    const res = response.data;
    if (res.code !== 200) {
      console.log(res.code);
      Message({
        message: res.message || "Error",
        type: "error",
        duration: 5 * 1000,
      });
      if (res.code === 401) {
        MessageBox.confirm("未登录或登录过期，是否重新登录？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          store.dispatch("resetUserInfo").then(() => {
            // 刷新当前文档，相当于浏览器刷新按钮
            location.reload();
          });
        });
      }
      return Promise.reject(new Error(res.message || "Error"));
    }
    return res;
  },
  (error) => {
    console.log(error);
    Message({
      message: error.message,
      type: "error",
      duration: 5 * 1000,
    });
    return Promise.reject(error);
  }
);

export default service;
