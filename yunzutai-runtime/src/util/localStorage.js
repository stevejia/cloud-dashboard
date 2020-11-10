const tokenKey = "tethys_token";
const refreshkey = "tethys_refreshToken";
const userInfo = "tethys_userInfo";
export function getToken() {
  return window.sessionStorage.getItem(tokenKey);
}
export function setToken(token) {
  return window.sessionStorage.setItem(tokenKey, "bearer " + token);
}
export function setRefreshToken(token) {
  return window.sessionStorage.setItem(refreshkey, token);
}
export function getRefreshToken() {
  return window.sessionStorage.getItem(refreshkey);
}
//用于登录记住用户信息
export function setUser(user) {
  return window.sessionStorage.setItem(userInfo, JSON.stringify(user));
}
export function getUser() {
  return JSON.parse(window.sessionStorage.getItem(userInfo));
}

export function clear() {
  // window.sessionStorage.removeItem(tokenKey);
  // window.sessionStorage.removeItem(refreshkey);
  // window.sessionStorage.removeItem(userInfo);
  localStorage.clear();
  sessionStorage.clear();
}
