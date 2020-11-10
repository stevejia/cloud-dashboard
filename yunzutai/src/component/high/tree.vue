<template>
  <div class="symbolComp" :style="styles">
    <TreeComp
      v-if="treeData.length"
      :fontSize="fontSize"
      :treeData="treeData"
      :selectColor="selectColor"
      :color="color"
    ></TreeComp>
    <template v-else
      ><div class="tisi">单击鼠标右键创建自己的树图形把^_^</div></template
    >
  </div>
</template>
<script>
import translateConfig from "./swichConfig/tree.js";
import TreeComp from "@/components/tree/treeComp.vue";
export default {
  components: {
    TreeComp
  },
  props: {
    theme: String
  },
  watch: {
    "$store.getters.theme": function() {
      this.themeChange();
    }
  },
  methods: {
    init() {
      this.$drag.collectTree(this.$parent);
      if (this.$store.state.runtime) {
        this.treeData = this.treeInit(this.treeData);
      }
    },
    treeInit(data) {
      return data.map(item => {
        item.selected = false;
        if (item.children) {
          item.children = this.treeInit(item.children);
        }
        return item;
      });
    },
    translateConfig(item) {
      return translateConfig(item);
    },
    themeChange() {
      let theme = this[this.theme];
      this.baisicConfig["字体"].value[2] = theme.color;
      this.baisicConfig["背景颜色"].value = theme.backgroundColor;
      this.baisicConfig["边框颜色"].value = theme.borderColor;
      this.baisicConfig["字体"].value[3] = theme.selectColor;
      this.initStyle(true);
    },
    getSearchData() {
      let items = [];
      this.getTreeSelected([...this.treeData], items);
      return items;
    },
    getTreeSelected(arr, items) {
      arr.forEach(item => {
        if (item.selected) {
          if (item.type === "file") {
            let pointIds = item.linkData.pointIds;
            let statisticsType = item.linkData.statisticsType;
            if (statisticsType !== "" && pointIds.length) {
              items.push({
                pointId: pointIds.slice(-1)[0],
                statisticsType: statisticsType,
                name: item.name
              });
            }
          } else {
            if (item.children && item.children.length) {
              this.getTreeSelected(item.children, items);
            }
          }
        }
      });
    },
    getSearchDatas(type) {
      let items = [];
      this.getTreeSelecteds(this.treeData, items, type);
      return items;
    },
    getTreeSelecteds(arr, items, type) {
      if (type) {
        arr.forEach(item => {
          if (item.selected) {
            if (item.type === "file") {
              let pointIds = item.linkData.pointIds;
              let statisticsType = item.linkData.statisticsType;
              if (statisticsType !== "" && pointIds.length) {
                items.push({
                  pointId: pointIds.slice(-1)[0],
                  statisticsType: statisticsType,
                  name: item.name
                });
              }
            } else {
              let _items = [];
              this.getTreeSelecteds(item.children, _items, type);
              if (_items.length) {
                items.push({
                  name: item.name,
                  childs: _items
                });
              }
            }
          }
        });
      } else {
        arr.forEach(item => {
          if (item.selected) {
            if (item.type === "file") {
              let pointIds = item.linkData.pointIds;
              let statisticsType = item.linkData.statisticsType;
              if (statisticsType !== "" && pointIds.length) {
                items.push({
                  pointId: pointIds.slice(-1)[0],
                  statisticsType: statisticsType,
                  name: item.name,
                  childs: []
                });
              }
            } else {
              if (item.children && item.children.length) {
                this.getTreeSelecteds(item.children, items);
              }
            }
          }
        });
      }
    },
    initStyle(bool) {
      let theme = this[this.theme];
      theme.color = this.baisicConfig["字体"].value[2];
      theme.backgroundColor = this.baisicConfig["背景颜色"].value;
      theme.borderColor = this.baisicConfig["边框颜色"].value;
      theme.selectColor = this.baisicConfig["字体"].value[3];
      this.fontSize = parseInt(this.baisicConfig["字体"].value[0].slice(0, -2));
      this.color = theme.color;
      this.selectColor = this.baisicConfig["字体"].value[3];

      this.name = this.baisicConfig["名称"].value;
      this.styles = {
        background: theme.backgroundColor,
        border: `${this.baisicConfig["边框粗细"].value}px ${this.baisicConfig["边框样式"].value} ${this.baisicConfig["边框颜色"].value}`,
        opacity: this.baisicConfig["显示度"].value / 100
      };
      if (this.currentItem) {
        let config = this.highConfig["树形图"];
        this.currentItem.linkData.pointIds = config.pointIds;
        this.currentItem.linkData.statisticsType = config.statisticsType;
      }
      if (!bool) {
        this.$parent.initStyle(
          this.baisicConfig["尺寸"].value,
          this.baisicConfig["位置"].value,
          this.baisicConfig["旋转角度"].value
        );
      }
    }
  },
  data() {
    return {
      name: "",
      fontSize: 16,
      color: "",
      linkPages: [],
      selectColor: "",
      treeData: [],
      currentItem: null, //当前操作的元素，编辑态使用
      styles: {},
      white: {
        backgroundColor: "#FFFFFF",
        color: "rgb(69, 90, 100)",
        borderColor: "rgb(69, 90, 100)",
        selectColor: "rgb(69, 90, 100)"
      },
      black: {
        backgroundColor: "rgb(24, 25, 29)",
        color: "rgb(178, 221, 255)",
        borderColor: "#B2DDFF",
        selectColor: "#B2DDFF"
      },
      highConfig: {
        树形图: {
          type: "treeConfig",
          currentItem: "",
          pointIds: [],
          statisticsType: ""
        }
      },
      baisicConfig: {
        尺寸: {
          type: "widthHeight",
          label: ["宽度", "高度"],
          value: [0, 0]
        },
        位置: {
          type: "widthHeight",
          label: ["横轴", "纵轴"],
          value: [0, 0]
        },
        线条1: {
          type: "line"
        },
        名称: {
          type: "input",
          value: "树形图"
        },
        字体: {
          type: "fontSelect",
          value: ["16px", "", "rgb(178, 221, 255)", "#B2DDFF"]
        },
        背景颜色: {
          type: "color-select",
          value: "rgb(24, 25, 29)"
        },
        边框颜色: {
          type: "color-select",
          value: "#B2DDFF"
        },
        边框样式: {
          type: "select",
          label: [
            { label: "实体边框", value: "solid" },
            { label: "虚线边框", value: "dashed" }
          ],
          value: "dashed"
        },
        边框粗细: {
          type: "slider",
          status: 1,
          range: [0, 10],
          value: 0
        },
        显示度: {
          type: "slider",
          status: 1,
          range: [0, 100],
          value: 100
        },
        线条2: {
          type: "line"
        },

        旋转角度: {
          type: "slider",
          status: 1,
          range: [0, 360],
          value: 0
        }
      }
    };
  }
};
</script>

<style lang="less" scoped>
.symbolComp {
  width: calc(100%);
  height: calc(100%);
  box-sizing: border-box;
  overflow: hidden;
}
.tisi {
  height: calc(100%);
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  width: calc(100%);
  padding: 10px;
  font-size: 12px;
}
</style>
