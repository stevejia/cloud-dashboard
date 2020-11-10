import Vue from "vue";
function commonRequest({ url, methods, params, headers }) {
  if (methods === "get" || methods === "delete") {
    var addUrl = "";
    for (var key in params) {
      addUrl += "&" + key + "=" + params[key];
    }
    if (addUrl) {
      url = url + "?" + addUrl.substring(1);
    }
  }
  if (headers) {
    for (var k in headers) {
      Vue.prototype.$axios.defaults.headers.common[k] = headers[k];
    }
  }
  return new Promise((resolve, reject) => {
    Vue.prototype.$axios[methods + ""](url, params)
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err);
      });
  });
}

export { commonRequest };
