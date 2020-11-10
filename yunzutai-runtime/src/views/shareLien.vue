<template>
  <div></div>
</template>
<script>
// import { getConfig } from "@/api/server.js";
// import { getTree, getPointsData } from "@/api/server.js";
import { getUserInfo } from "@/api/runApi.js";
import { setToken, setUser } from "@/util/localStorage";
import { getTree, getPointsData, getConfig } from "@/api/server.js";
let Domain = window.location.hostname;
export default {
  data() {
    return {
      loading: null
    };
  },
  created() {
    this.getShareLien();
  },
  methods: {
    async getShareLien() {
      this.loading = this.$loading({
        lock: true,
        text: "准备数据中",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      setToken(this.$route.query.shareToken);
      let res = await getUserInfo();
      setUser(res.data);
      let row = {
        domain: Domain,
        appId: this.$route.query.SubProjectId,
        projectId: this.$route.query.ProjectId
      };
      this.$store.dispatch("setProjectInfo", row);
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
          let query = {
            shareToken: this.$route.query.shareToken,
            sharePageId: this.$route.query.sharePageId,
            SubProjectId: this.$route.query.SubProjectId,
            ProjectId: this.$route.query.ProjectId,
            shareAll: this.$route.query.shareAll
          };
          this.$store.dispatch("setShareData", true);
          this.loading.close();
          this.$router.replace({
            name: "home",
            query: query
          });
        });
      });
    }
  }
};
</script>
