<template>
  <div class="home" :style="wholeStyle">
    <div ref="dragDom" class="dragDiv dragss" :style="styles">
      <clean-manage v-if="linkId === '清洗管理'"></clean-manage>
      <home-index v-if="linkId === '主页'"></home-index>
      <power-station-monitoring
        v-if="linkId === '电站监控'"
      ></power-station-monitoring>
      <area-manage v-if="linkId === '区域管理'"></area-manage>
      <!-- <string-monitor v-if="linkId === '监控管理'"></string-monitor> -->
      <device-info v-if="linkId === '设备信息'"></device-info> 
      <power-station-manage v-if="linkId === '电站管理'"></power-station-manage>
      <alarm-rules v-if="linkId === '告(预)警'"></alarm-rules>
      <device-manage v-if="linkId === '设备管理'"></device-manage>
      <worksheets-manage v-if="linkId === '工单管理'"></worksheets-manage>
      <div class="views" v-if="!linkId">请选择组态页面</div>
    </div>
  </div>
</template>
<script>
import cleanManage from '@/items/mochalITOM_cleanManage/cleanManage.vue'
import homeIndex from '@/items/home/HomeIndex.vue'
// import stringMonitor from '@/items/montoring_string/stringMonitor.vue'
import powerStationMonitoring from '@/items/powerStationMonitoring/powerStationMonitoring.vue'
import areaManage from '@/items/systemManage_areaManage/areaManage.vue'
import deviceInfo from '@/items/systemManage_deviceInfo/deviceInfo.vue'
import powerStationManage from '@/items/systemManage_powerStationManage/powerStationManage.vue'
import alarmRules from '@/items/monitoring_alarm/alarmRules.vue'
import deviceManage from '@/items/mochaITOM_deviceManage/deviceManage.vue'
import worksheetsManage from '@/items/mochaITOM_worksheetsManage/worksheets.vue'

import { setToken } from '@/util/localStorage.js'
import { getPointsData, permiss, getConfig } from '@/api/server.js'
import { getTree } from '@/api/api.js'

export default {
  components: {
    cleanManage,
    homeIndex,
    deviceInfo,
    areaManage,
    powerStationMonitoring,
    deviceManage,
    worksheetsManage,
    alarmRules,
    powerStationManage,
  },
  inject: ['reload'],
  data() {
    return {
      config: null,
      styles: {},
      wholeStyle: {},
      linkId: null,
    }
  },
  created() {
    this.initStyle();
    if (!this.$store.state.loadData) {
      //setToken(this.$route.query.token);
      setToken(
        ' eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRob3JpdHkiOiJQUk9KRUNUX0FETUlOIiwidGVuYW50SWQiOiJkMThlODU5MDQwNDk0NjAwYjQxMGNmOGQ4MzA0NDZmZCIsImlkIjoiOWE0ZWU4ZWMzMzFjNDcxMWE0OTgxNWZmYTg0YjEwMmMiLCJ0b2tlblR5cGUiOiJ0b2tlbiIsImV4cCI6MTYyODc0NTgwMiwicHJvamVjdElkIjoiMWVhNjM3NDM5ZmUxMzUwYTc3OGNkY2NhMzUzNDRmOSIsImlhdCI6MTU5NzIwOTgwMiwidXNlcm5hbWUiOiJhZG1pbiJ9.BL2sI0foOQVJvUuEK_jKIjhAuaylH1VpKt-zew-R4NS8prNQysyTssqiCiPkYrMwb68RkUSYP4XetLMnGrchp3SevXcNXHYuQXwnRv_LvCAngMdrTjlN5BofbwxGevO65nA4X8AF034VlU7esin0lkBhkBCSrXaODXW47aNLmzw'
      )
      this.$store.dispatch('setLoadData', true)
      getConfig({ pid: this.$route.query.subProjectId }).then(res => {
        if (res.data) {
          let centerConfigs = res.data.centerConfigs
          for (let key in centerConfigs) {
            centerConfigs[key] = JSON.parse(centerConfigs[key])
          }
          this.$store.dispatch('setConfig', res.data)
          this.reload()
        }
      })
      getPointsData().then(res => {
        this.$store.dispatch('setPointGroup', res.body)
      })
      permiss().then(res => {
        this.$store.dispatch('setPermiss', res.body.yzt_permiss)
      })
      getTree().then(res => {
        this.$store.dispatch('setDeviceList', res.data)
      })
    }
  },
  mounted() {
    this.$drag.init(this)
    this.$drag.startGetData()
  },
  watch: {
    linkId(val) {
      this.$drag.initPageConfig(val)
    },
  },
  methods: {
    initStyle(lefts) {
      this.config = this.$parent.config.centerConfig
      let top =
        this.$parent.mainTop +
        4 +
        this.config['外边距'].value * 2 +
        (window.screen.height > window.document.body.clientHeight ? 143 : 0)
      let left = !lefts || lefts === 0 ? 200 : 0

      this.styles = {
        height: this.config['页面大小(非数字则无效)'].value[1] - top + 'px',
        width:
          this.config['页面大小(非数字则无效)'].value[0] -
          left -
          this.config['外边距'].value * 2 +
          'px',
        backgroundImage: `radial-gradient(circle, ${
          this.config['栅格色'].value
        } 20%, transparent 10%)`,
      }
      this.wholeStyle = {
        padding: this.config['外边距'].value + 'px',
        background: this.config['背景色'].value,
      }
    },
  },
}
</script>

<style lang="less" scoped>
.home {
  height: calc(100%);
  width: calc(100%);
  background: rgb(43, 46, 55);
  box-sizing: border-box;
  //overflow: auto;
  overflow: overlay;
  &::-webkit-scrollbar {
    width: 4px;
    height: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: #e3e3e3;
    border-radius: 4px;
  }
  &::-webkit-scrollbar-resizer {
    background: #ff0bee;
  }
  .dragDiv {
    //overflow: hidden;
    background-size: 10px 10px;
    box-sizing: border-box;
    position: relative;
    .views {
      width: 100%;
      height: 100%;
      background-size: 10px 10px;
      position: relative;
      color: #e6a23c;
      font-size: 35px;
      text-align: center;
      position: relative;
      top: 20%;
    }
  }
}
</style>
