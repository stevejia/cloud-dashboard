const externals = {
  vue: "Vue",
  "vue-router": "VueRouter",
  vuex: "Vuex",
  axios: "axios",
  echarts: "echarts",
  xlsx: "XLSX",
  moment: "moment"
};
const cdn = {
  css: [],
  js: [
    "https://chintcloud.oss-cn-shanghai.aliyuncs.com/prd/cloud-config/library/vue.min.js",
    "https://chintcloud.oss-cn-shanghai.aliyuncs.com/prd/cloud-config/library/vue-router.min.js",
    "https://chintcloud.oss-cn-shanghai.aliyuncs.com/prd/cloud-config/library/vuex.min.js",
    "https://chintcloud.oss-cn-shanghai.aliyuncs.com/prd/cloud-config/library/axios.min.js",
    "https://chintcloud.oss-cn-shanghai.aliyuncs.com/prd/cloud-config/library/echarts.min.js",
    "https://chintcloud.oss-cn-shanghai.aliyuncs.com/prd/cloud-config/library/xlsx.min.js",
    "https://chintcloud.oss-cn-shanghai.aliyuncs.com/prd/cloud-config/library/moment.min.js"
  ]
};
const config = {
  lintOnSave: false,
  publicPath: "./",
  productionSourceMap: false,
  css: {
    extract: true
  },
  chainWebpack: config => {
    // config
    //   .plugin("webpack-bundle-analyzer")
    //   .use(require("webpack-bundle-analyzer").BundleAnalyzerPlugin);
    config.plugin("html").tap(args => {
      if (process.env.NODE_ENV === "production") {
        args[0].cdn = cdn;
      }
      return args;
    });
    // 移除 prefetch 插件
    config.plugins.delete("prefetch");
    // 移除 preload 插件
    config.plugins.delete("preload");
  },
  configureWebpack: () => {
    return {
      externals: externals,
      performance: { hints: false }
    };
  }
};
module.exports = { config };
