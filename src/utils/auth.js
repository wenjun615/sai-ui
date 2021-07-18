import Cookies from "js-cookie";

const authHeader = "Authorization";

export function getToken() {
  return Cookies.get(authHeader);
}

export function setToken(token) {
  return Cookies.set(authHeader, token);
}

export function removeToken() {
  return Cookies.remove(authHeader);
}
