import request from "@/utils/request";

export function login(data) {
  return request({
    url: "/user/login",
    method: "post",
    data,
  });
}

export function loadInfo() {
  return request({
    url: "/user/loadInfo",
    method: "get",
  });
}

export function logout() {
  return request({
    url: "/user/logout",
    method: "post",
  });
}
