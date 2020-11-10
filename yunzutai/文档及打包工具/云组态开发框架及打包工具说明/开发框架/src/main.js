import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/util/axios'
import '@/util/comp.js'
import Grag from '@/util/drag.js'
import '@/assets/css/common.less'
import ColorPicker from '@/components/ColorPicker/index.vue'
Vue.component('ColorPicker', ColorPicker)

document.documentElement.addEventListener('contextmenu', (ev) => {
  ev.preventDefault()
})

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)
Vue.prototype.$drag = new Grag()
window.config = {}
if (window.location.host.indexOf(':18088') !== -1) {
  window.config = {
    requestUrl: 'http://dev-tethys-api.chintcloud.net/common/api/v2.0/visual',
    dataCenterUrl: '',
    runtimeUrl: 'http://dev-tethys-ui-runtime.chintcloud.net/#/home',
  }
} else if (window.location.host.startsWith('dev-tethys-ui')) {
  window.config = {
    requestUrl: 'http://dev-tethys-api.chintcloud.net/common/api/v2.0/visual',
    dataCenterUrl: '',
    runtimeUrl: 'http://dev-tethys-ui-runtime.chintcloud.net/#/home',
  }
} else if (window.location.host.startsWith('tethys-ui')) {
  window.config = {
    requestUrl: 'http://tethys-api.chint.com/common/api/v2.0/visual',
    dataCenterUrl: '',
    runtimeUrl: 'http://tethys-ui-runtime.chint.com/#/home',
  }
}

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app')
