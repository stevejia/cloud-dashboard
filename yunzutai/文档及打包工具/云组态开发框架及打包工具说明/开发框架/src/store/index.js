import Vue from "vue";
import Vuex from "vuex";
import commonConfig from "@/config.json";
import { commonRequest } from "@/api/request.js";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    loadData: false,
    $chint: {
      $request: commonRequest
    },
    permiss: [],
    runtime: true,
    config: commonConfig,
    deviceList: [], //测点集合
    pointGroup: {}, //点位组，定时相关信息
    authorityList: [
      {
        id: "5a359b2f88d644c2ab034d51514fa218",
        label: "超级管理员",
        password: "65535",
        grade: "65535",
        counter: 0
      }
    ]
  },
  mutations: {
    setConfig() {
      // state.config = data;
    },
    setDeviceList(state, data) {
      state.deviceList = data;
    },
    setPointGroup(state, data) {
      state.pointGroup = data;
    },
    setPermiss(state, data) {
      state.permiss = data;
    },
    setLoadData(state, data) {
      state.loadData = data;
    }
  },
  actions: {
    setLoadData({ commit }, data) {
      commit("setLoadData", data);
    },
    setConfig({ commit }, data) {
      commit("setConfig", data);
    },
    setPermiss({ commit }, data) {
      commit("setPermiss", data);
    },
    setDeviceList({ commit }, data) {
      commit("setDeviceList", data);
    },
    setPointGroup({ commit }, data) {
      commit("setPointGroup", data);
    }
  },
  modules: {},
  getters: {
    theme: state => state.config.stylesConfig.theme["主题切换"].value
  }
});
