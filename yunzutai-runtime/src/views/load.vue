<template>
  <div></div>
</template>
<script>
import { getConfig } from "@/api/server.js";
import { getTree, getPointsData } from "@/api/server.js";
export default {
  data() {
    return {
      loading: null
    };
  },
  created() {
    this.loading = this.$loading({
      lock: true,
      text: "准备数据中",
      spinner: "el-icon-loading",
      background: "rgba(0, 0, 0, 0.7)"
    });
    this.$store.dispatch("setLoadData", true);
    getPointsData({ pid: this.$store.state.subProjectId }).then(res => {
      let data = res.body || {
        apsList: [],
        sceneList: [],
        ptgPoints: [],
        timerList: [],
        pointGroup: []
      };
      this.$store.dispatch("setPointGroup", data);
    });
    getTree({
      projectId: this.$store.state.projectId
    }).then(res => {
      this.$store.dispatch("setDeviceList", res.data);
      getConfig({ pid: this.$store.state.subProjectId }).then(res => {
        let data = res.data || res.body;
        if (data) {
          this.$store.dispatch("setConfig", data);
        }
        this.loading.close();
        this.$router.replace({
          name: "home"
        });
      });
    });
  }
};
</script>
