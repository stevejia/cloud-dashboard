import { groupGet, groupBulkGet } from "@/api/bulk.js";
import { getStatisticsProportion } from "@/api/sub.js";
import Collections from "./collections";
const config = {
  statistics: {
    name: "能耗标签",
    time: 60000,
    request: groupGet
  },
  currentenergychart: {
    name: "当前能耗图",
    time: 60000,
    request: groupBulkGet
  },
  环图: {
    name: "环图",
    time: 4000,
    request: getStatisticsProportion
  },
  环图2: {
    name: "环图",
    time: 4000,
    request: getStatisticsProportion
  },
  饼图: {
    name: "环图",
    time: 4000,
    request: getStatisticsProportion
  }
};
const _interVal = function() {
  if (this.collects.length && this.currentPageId === this.pageId) {
    setTimeout(() => {
      this.startRequest();
    }, this.time);
  }
};
const startRequest = function() {
  let _data = this.collects.map(item => {
    return {
      id: item.vm.$parent.id,
      data: item.data
    };
  });
  let data = this.formatter ? this.formatter(this.collects) : _data;
  this.request(data)
    .then(res => {
      res.data.forEach(item => {
        let vm = this.collects.find(__item => {
          return __item.vm.$parent.id === item.id;
        });
        if (vm) {
          vm.vm.pointIdChange(item.data);
        }
      });
      this._interVal();
    })
    .catch(() => {
      this._interVal();
    });
};
class FolieShifte extends Collections {
  init() {
    this.folieShiftes = {};
    super.init();
  }
  addShifte(vm, data) {
    let myConfig = config[vm.$parent.type];
    if (!this.folieShiftes[myConfig.name]) {
      this.folieShiftes[myConfig.name] = {
        pageId: this.currentPageId,
        ...myConfig,
        collects: [
          {
            vm: vm,
            data: data
          }
        ],
        _interVal,
        startRequest
      };
    } else {
      let collects = this.folieShiftes[myConfig.name].collects;
      let collect = collects.find(item => {
        return item.vm === vm;
      });
      if (collect) {
        collect.data = data;
      } else {
        collects.push({
          vm: vm,
          data: data
        });
      }
    }
  }
  readyData() {
    for (let key in this.folieShiftes) {
      let val = this.folieShiftes[key];
      val.currentPageId = this.currentPageId;
      if (val.pageId === this.currentPageId) {
        val.startRequest();
      }
    }
    super.readyData();
  }
}
export default FolieShifte;
