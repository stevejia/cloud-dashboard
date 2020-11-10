import Vue from "vue";
import symbol from "@/component/symbol";
import composeSymbol from "@/component/compose";
import remoteSymbol from "@/component/remoteSymbol";
import { guid } from "@/util/common.js";

let instance;
let RemoteSymbolConstructor = Vue.extend(remoteSymbol);

const remoteSymbols = function(domVm, dom, config) {
  instance = new RemoteSymbolConstructor({
    data: {
      ...config
    }
  });

  instance.$parent = domVm;
  instance.$store = domVm.$store;
  instance.$parentEl = dom;
  instance.vm = instance.$mount();
  dom.append(instance.vm.$el);
  instance.dom = instance.vm.$el;
  instance.vm.visible = true;

  return instance.vm;
};
Vue.prototype.$remoteSymbols = remoteSymbols;

let SymbolConstructor = Vue.extend(symbol);

const symbols = function(domVm, dom, config, otherConfig) {
  instance = new SymbolConstructor({
    data: {
      id: guid(),
      ...config,
      ...otherConfig
    }
  });

  instance.$parent = domVm;
  instance.$store = domVm.$store;
  instance.$parentEl = dom;
  instance.vm = instance.$mount();
  dom.append(instance.vm.$el);
  instance.dom = instance.vm.$el;
  instance.vm.visible = true;
  return instance.vm;
};
Vue.prototype.$symbols = symbols;

let ComposeConstructor = Vue.extend(composeSymbol);
const composeSymbols = function(domVm, dom, config) {
  instance = new ComposeConstructor({
    data: {
      id: guid(),
      ...config
    }
  });
  instance.$parent = domVm;
  instance.$parentEl = dom;
  instance.vm = instance.$mount();
  dom.append(instance.vm.$el);
  instance.vm.visible = true;
  instance.dom = instance.vm.$el;

  return instance.vm;
};

Vue.prototype.$composeSymbols = composeSymbols;
