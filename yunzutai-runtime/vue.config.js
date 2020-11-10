const developConfig = require("./vue.develop.js");
const productConfig = require("./vue.product.js");

let config = null;
if (process.env.NODE_ENV === "production") {
  config = productConfig.config;
} else {
  config = developConfig.config;
}
module.exports = {
  ...config,
  pwa: {
    iconPaths: {
      favicon32: "./favicon.ico",
      favicon16: "./favicon.ico",
      appleTouchIcon: "./favicon.ico",
      maskIcon: "./favicon.ico",
      msTileImage: "./favicon.ico"
    }
  }
};
