import Vue from "vue";
import symbol from "@/component/symbol";

let instance;
let SymbolConstructor = Vue.extend(symbol);
const symbols = function(domVm, config, otherConfig) {
  instance = new SymbolConstructor({
    data: {
      ...config,
      ...otherConfig
    }
  });

  instance.$parent = domVm;
  instance.$store = domVm.$store;
  instance.vm = instance.$mount();
  domVm.$refs.dragDom.append(instance.vm.$el);
  instance.dom = instance.vm.$el;
  instance.vm.visible = true;

  return instance.vm;
};

Vue.prototype.$symbols = symbols;
