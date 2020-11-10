<template>
  <div class="comp">
    <div style="height:calc(40% - 3px)">
      <div class="title">
        <el-dropdown @command="handleCommand" trigger="click">
          <div class="more-menu">
            {{ title }}<i class="el-icon-arrow-down el-icon--right"></i>
          </div>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              v-for="item in baseList"
              :key="item.type"
              :command="item.name"
              >{{ item.name }}</el-dropdown-item
            >
          </el-dropdown-menu>
        </el-dropdown>
        <div class="righttop" @click.stop="goBack">
          <img src="@/assets/image/mapbtn.png" alt="" />
        </div>
      </div>
      <div class="body">
        <div class="nuantong" v-if="title == '暖通空调'">
          <ul v-if="status">
            <li
              v-for="(item, index) in baseList[0].children"
              :key="index"
              :class="['mapbtn', { 'mapbtn-sel': isActive == index }]"
              @click.stop="selectChild(index)"
            >
              {{ item.name }}
            </li>
          </ul>
        </div>
        <sub-unit
          v-if="showSubUnit"
          :list="imgs"
          :currentItem="currentItem"
        ></sub-unit>
      </div>
    </div>
    <div class="line moveLine"></div>
    <compConfig
      style="height:calc(60%)"
      ref="compConfig"
      :targetType="currentItem.type"
    ></compConfig>
  </div>
</template>
<script>
import map from "./../differentClassJson/map.json";
import compConfig from "./config.vue";
import subUnit from "./component/modelSvg.vue";
export default {
  components: {
    compConfig,
    subUnit
  },
  data() {
    return {
      index1: 0,
      index2: 0,
      index3: 0,
      title: map[0].name,
      selectValue: "暖通空调",
      baseList: map,
      currentItem: map[0].children[0].children[0],
      isActive: 0,
      status: true, //判断显示暖通空调的图片
      showSubUnit: false,
      imgs: []
    };
  },
  mounted() {
    this.currentItem = map[0].children[0].children[0];
  },
  methods: {
    initType(type, vm) {
      let [index1, index2, index3] = vm.$data._myIndex.split("-");
      let arr = [
        "暖通空调",
        "照明设备",
        "环境传感",
        "电力电子",
        "符号系列",
        "其他系列"
      ];
      this.handleCommand(arr[index1]);
      if (index1 == 0) {
        this.index1 = index1;
        this.index2 = index2;
        this.selectChild(index2);
        this.index3 = index3;
        this.currentItem =
          map[this.index1].children[this.index2].children[this.index3];
      } else {
        this.index1 = index1;
        this.index2 = index2;
        this.currentItem = map[this.index1].children[this.index2];
      }
    },
    selectSymbol(item) {
      this.$parent.currentVm = null;
      this.currentItem = item;
      this.$nextTick(() => {
        this.$refs.compConfig.initConfig();
      });
    },
    handleCommand(command) {
      this.title = command;
      this.imgs = [];
      switch (command) {
        case "暖通空调":
          this.index1 = 0;
          this.status = true;
          this.showSubUnit = false;
          break;
        case "照明设备":
          this.index1 = 1;
          this.showSubUnit = true;
          this.imgs = this.baseList[1].children;
          break;
        case "环境传感":
          this.index1 = 2;
          this.showSubUnit = true;
          this.imgs = this.baseList[2].children;
          break;
        case "电力电子":
          this.index1 = 3;
          this.showSubUnit = true;
          this.imgs = this.baseList[3].children;
          break;
        case "符号系列":
          this.index1 = 4;
          this.showSubUnit = true;
          this.imgs = this.baseList[4].children;
          break;
        case "其他系列":
          this.index1 = 5;
          this.showSubUnit = true;
          this.imgs = this.baseList[5].children;
          break;
      }
    },
    // 选择通暖空调
    selectChild(index) {
      this.index2 = index;
      this.isActive = index;
      this.status = false;
      this.showSubUnit = true;
      this.imgs = this.baseList[0].children[index].children;
    },
    goBack() {
      if (this.title == "暖通空调") {
        this.status = true;
        this.showSubUnit = false;
      }
    }
  }
};
</script>
<style lang="less" scoped>
.comp {
  height: calc(100%);
  width: calc(100%);
  background: #373e4a;
  color: #e9e9e9;
  font-size: 14px;
  .title {
    border-bottom: 1px solid transparent;
    background-color: #737881;
    height: 35px;
    line-height: 35px;
    text-align: center;
    position: relative;
    .more-menu {
      color: #ffffff;
    }
    .righttop {
      position: absolute;
      right: 0;
      top: 0;
      img {
        height: 21px;
        width: 21px;
        padding: 7px 6px;
      }
    }
  }
  .line {
    background-color: #ddd;
    border-top: 8px solid #373e4a;
    height: 1px;
    cursor: s-resize;
  }
  .body {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 0 10px 10px;
    box-sizing: border-box;
    flex-wrap: wrap;
    overflow: overlay;
    height: calc(100% - 36px);
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
    .imgDiv {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-around;
      cursor: move;
      width: 100px;
      height: 100px;
      box-sizing: border-box;
      box-sizing: border-box;
      border: 1px solid transparent;
      &.active {
        border: 1px solid white;
      }
      .iconfont {
        cursor: move;
        font-size: 46px;
      }
    }
    .mapbtn {
      text-align: center;
      line-height: 29px;
      float: left;
      height: 29px;
      width: 98px;
      border: 1px solid #ccc;
      border-radius: 4px;
      margin-top: 16px;
      cursor: pointer;
    }
    .mapbtn:nth-child(even) {
      margin-left: 20px;
    }
    .mapbtn:hover {
      background-color: rgb(0, 100, 255);
      border: 1px solid rgb(0, 100, 255);
    }
    .mapbtn-sel {
      background-color: rgb(0, 100, 255);
      border: 1px solid rgb(0, 100, 255);
    }
  }
}
</style>
