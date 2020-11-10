const tokenKey = "tethys_token";
const refreshkey = "tethys_refreshToken";
const userInfo = "tethys_userInfo";
export function getToken() {
  return window.localStorage.getItem(tokenKey);
}
export function setToken(token) {
  return window.localStorage.setItem(tokenKey, token);
}
export function setRefreshToken(token) {
  return window.localStorage.setItem(refreshkey, token);
}
export function getRefreshToken() {
  return window.localStorage.getItem(refreshkey);
}
//用于登录记住用户信息
export function setUser(user) {
  return window.localStorage.setItem(userInfo, JSON.stringify(user));
}
export function getUser() {
  return JSON.parse(window.localStorage.getItem(userInfo));
}

export function clear() {
  window.localStorage.removeItem(tokenKey);
  window.localStorage.removeItem(refreshkey);
  window.localStorage.removeItem(userInfo);
  sessionStorage.clear();
}
