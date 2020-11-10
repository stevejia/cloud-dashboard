<template>
  <div class="comps">
    <div v-for="(item, index) in config.list" :key="index">
      <div class="wrapper" v-if="item.type === config.place">
        <div class="title">散点位置</div>
        <div class="select-custom">
          <el-select
            v-model="item.data"
            placeholder="请选择"
            @change="onSelectionChange"
            value-key="id"
            filterable
          >
            <el-option
              v-for="opt in selectOptions"
              :key="opt.id"
              :label="opt.name"
              :value="opt"
            ></el-option>
          </el-select>

          <i class="el-icon-delete delete-icon" @click="onDelete(index)"></i>
        </div>
      </div>
    </div>
    <i v-if="!isEmpty" class="el-icon-plus add-icon" @click="onAdd"></i>
    <el-button v-if="isEmpty" type="primary" @click="onAdd">添加散点</el-button>
  </div>
</template>
<script>
import china from "echarts/map/json/china.json";
import shanghai from "echarts/map/json/province/shanghai.json";
import hebei from "echarts/map/json/province/hebei.json";
import shanxi from "echarts/map/json/province/shanxi.json";
import neimenggu from "echarts/map/json/province/neimenggu.json";
import liaoning from "echarts/map/json/province/liaoning.json";
import jilin from "echarts/map/json/province/jilin.json";
import heilongjiang from "echarts/map/json/province/heilongjiang.json";
import jiangsu from "echarts/map/json/province/jiangsu.json";
import zhejiang from "echarts/map/json/province/zhejiang.json";
import anhui from "echarts/map/json/province/anhui.json";
import fujian from "echarts/map/json/province/fujian.json";
import jiangxi from "echarts/map/json/province/jiangxi.json";
import shandong from "echarts/map/json/province/shandong.json";
import henan from "echarts/map/json/province/henan.json";
import hubei from "echarts/map/json/province/hubei.json";
import hunan from "echarts/map/json/province/hunan.json";
import guangdong from "echarts/map/json/province/guangdong.json";
import guangxi from "echarts/map/json/province/guangxi.json";
import hainan from "echarts/map/json/province/hainan.json";
import sichuan from "echarts/map/json/province/sichuan.json";
import guizhou from "echarts/map/json/province/guizhou.json";
import yunnan from "echarts/map/json/province/yunnan.json";
import xizang from "echarts/map/json/province/xizang.json";
import shanxi1 from "echarts/map/json/province/shanxi1.json";
import gansu from "echarts/map/json/province/gansu.json";
import qinghai from "echarts/map/json/province/qinghai.json";
import ningxia from "echarts/map/json/province/ningxia.json";
import xinjiang from "echarts/map/json/province/xinjiang.json";
import beijing from "echarts/map/json/province/beijing.json";
import tianjin from "echarts/map/json/province/tianjin.json";
import chongqing from "echarts/map/json/province/chongqing.json";
import xianggang from "echarts/map/json/province/xianggang.json";
import aomen from "echarts/map/json/province/aomen.json";
import taiwan from "echarts/map/json/province/taiwan.json";
export default {
  props: ["config", "theme", "onChange"],
  data() {
    return {
      provinceMap: {
        china,
        shanghai,
        hebei,
        shanxi,
        neimenggu,
        liaoning,
        jilin,
        heilongjiang,
        jiangsu,
        zhejiang,
        anhui,
        fujian,
        jiangxi,
        shandong,
        henan,
        hubei,
        hunan,
        guangdong,
        guangxi,
        hainan,
        sichuan,
        guizhou,
        yunnan,
        xizang,
        shanxi1,
        gansu,
        qinghai,
        ningxia,
        xinjiang,
        beijing,
        tianjin,
        chongqing,
        xianggang,
        aomen,
        taiwan
      },
      selectOptions: [],
      scatterList: [],
      isEmpty: false
    };
  },
  mounted() {
    let options = this.getOptions("china");
    this.config.list = [...this.config.list];
    this.selectOptions = options;
    this.checkIsEmpty();
  },
  computed: {},
  watch: {
    "config.place": function(place) {
      let options = this.getOptions(place);
      this.selectOptions = options;
      this.checkIsEmpty();
    }
  },
  methods: {
    onSelectionChange() {
      this.onChange(null, true);
    },
    checkIsEmpty() {
      let place = this.config.place;
      let list = this.config.list;
      let matchedList = list.filter(li => {
        return li.type === place;
      });
      this.isEmpty = matchedList.length <= 0;
    },
    getOptions(place) {
      let data = this.provinceMap[place];
      let features = data.features;
      let options = features.map(fea => {
        return {
          id: fea.id,
          name: fea.properties.name,
          cp: fea.properties.cp
        };
      });
      return options;
    },
    onAdd() {
      this.config.list.push({
        type: this.config.place,
        data: {
          cp: [],
          name: null
        }
      });
      this.checkIsEmpty();
      this.onChange(null, true);
    },
    onDelete(index) {
      let newestList = this.config.list.filter((li, idx) => {
        return li && index !== idx;
      });
      this.config.list = newestList;
      this.checkIsEmpty();
      this.onChange(null, true);
    }
  }
};
</script>
<style scoped>
.wrapper {
  padding-bottom: 15px;
}

.select-custom {
  position: relative;
}

.el-select {
  width: calc(100% - 30px);
}

.add-icon {
  float: right;
  font-size: 16px;
  margin-left: 5px;
  color: #409eff;
  cursor: pointer;
  position: absolute;
  bottom: 38px;
  right: -10px;
}
.delete-icon {
  font-size: 16px;
  margin-left: 5px;
  color: #f56c6c;
  cursor: pointer;
}

.comps {
  position: relative;
}
</style>
