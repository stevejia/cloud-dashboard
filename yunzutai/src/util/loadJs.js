import { commonRequest } from "@/api/request.js";
import myEcharts from "echarts";
import Vue from "vue";
function loadJs(res, dom, parent) {
  // eslint-disable-next-line no-unused-vars
  let echarts = myEcharts;
  let js = `window.` + res.slice(4);
  let VueComp = eval(js);
  let CompConstructor = Vue.extend(VueComp.default);

  let instance = new CompConstructor({});
  instance.$store = {
    state: {
      $chint: {
        $request: commonRequest
      }
    }
  };
  instance.$parent = parent;
  instance.$parentEl = dom;
  instance.vm = instance.$mount();

  dom.append(instance.vm.$el);
  instance.vm.visible = true;
  instance.dom = instance.vm.$el;
}
export default loadJs;
