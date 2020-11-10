<template>
  <div class="comps">
    <div class="block">
      <div class="title">锁定内容</div>
      <el-checkbox
        v-model="config.blockContent"
        @change="onChange(null, true)"
      ></el-checkbox>
    </div>
    <div class="block">
      <div class="title">启用多页</div>
      <el-checkbox
        v-model="config.useMul"
        @change="onChange(null, true)"
      ></el-checkbox>
    </div>
    <div class="block row">
      <div class="rowDiv">
        <div class="title">悬浮提示框</div>
        <el-checkbox
          v-model="config.promptDialog"
          @change="dialogChange(1)"
        ></el-checkbox>
      </div>
      <div class="rowDiv">
        <div class="title">弹框</div>
        <el-checkbox
          v-model="config.dialog"
          @change="dialogChange(2)"
        ></el-checkbox>
      </div>
    </div>
    <template v-if="config.dialog">
      <div class="block">
        <div class="title">弹窗阴影</div>
        <el-checkbox
          v-model="config.dialogShadow"
          @change="onChange(null, true)"
        ></el-checkbox>
      </div>
    </template>
    <div class="block">
      <div class="title">启用标题</div>
      <el-checkbox
        v-model="config.useTitle"
        @change="onChange(null, true)"
      ></el-checkbox>
    </div>
    <template v-if="config.useTitle">
      <div class="block">
        <div class="title">启用标题</div>
        <el-input
          v-model="config.title"
          placeholder="请输入内容"
          @input="onChange"
          @change="onChange"
          @blur="onChange(null, true)"
          @keyup.enter.native="onChange(null, true)"
        ></el-input>
      </div>
      <div class="block">
        <div class="title">标题位置</div>
        <el-select
          v-model="config.titleAlign"
          placeholder="请选择"
          @change="onChange(null, true)"
        >
          <el-option
            v-for="item in titleAlign"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <div class="block">
        <div class="title">标题字体样式</div>
        <div class="body">
          <div class="rows">
            <select
              v-model="config.titleFont[0]"
              @change="onChange(null, true)"
            >
              <option
                v-for="item in fontSize14To36"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></option>
            </select>
          </div>
          <div class="rows">
            <select
              v-model="config.titleFont[1]"
              @change="onChange(null, true)"
            >
              <option
                v-for="item in fontFamily"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></option>
            </select>
          </div>
          <div class="rows">
            <span>A</span>
            <div class="text-color">
              <color-picker v-model="titleColor" @change="setColor(1)" />
            </div>
          </div>
        </div>
      </div>
      <div class="block">
        <div class="title">标题线条色</div>
        <color-picker
          v-model="config.titleBottomLine"
          @change="onChange(null, true)"
        />
      </div>
    </template>

    <div class="block">
      <div class="title">背景颜色</div>
      <color-picker
        v-model="config.background"
        @change="onChange(null, true)"
      />
    </div>
    <div class="block">
      <div class="title">发光色</div>
      <color-picker v-model="config.boxShadom" @change="onChange(null, true)" />
    </div>
    <div class="block">
      <div class="title">圆角</div>
      <div class="sliders">
        <el-slider
          v-model="config.borderRadius"
          :min="0"
          :max="40"
          @change="onChange"
          @input="onChange"
          show-input
          >></el-slider
        >
      </div>
    </div>
    <div class="block">
      <div class="title">显示度</div>
      <div class="sliders">
        <el-slider
          v-model="config.opacity"
          :min="0"
          :max="100"
          show-input
          @change="onChange"
          @input="onChange"
          @blur="onChange(null, true)"
          @keyup.enter.native="onChange(null, true)"
        ></el-slider>
      </div>
    </div>
    <div class="block">
      <el-button type="primary" size="small" @click="onChangeInit"
        >样式还原</el-button
      >
    </div>
    <template v-if="config.useMul">
      <div class="block">
        <div class="title">标签高度</div>
        <el-input
          v-model="config.tabHeight"
          placeholder="请输入内容"
          @input="onChange"
          @change="onChange"
          @blur="onChange(null, true)"
          @keyup.enter.native="onChange(null, true)"
        ></el-input>
      </div>
      <div class="block">
        <div class="title">标签背景颜色</div>
        <color-picker
          v-model="config.tabBackground"
          @change="onChange(null, true)"
        />
      </div>
      <div class="block">
        <div class="title">字体</div>
        <div class="body">
          <div class="rows">
            <select v-model="config.tabFont[0]" @change="onChange(null, true)">
              <option
                v-for="item in fontSize14To36"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></option>
            </select>
          </div>
          <div class="rows">
            <select v-model="config.tabFont[1]" @change="onChange(null, true)">
              <option
                v-for="item in fontFamily"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></option>
            </select>
          </div>
          <div class="rows">
            <span>A</span>
            <div class="text-color">
              <color-picker v-model="tabColor" @change="setColor(3)" />
            </div>
          </div>
          <div class="rows">
            <span>选中</span>
            <div class="text-color">
              <color-picker v-model="tabSelectColor" @change="setColor(4)" />
            </div>
          </div>
        </div>
      </div>
      <div class="block">
        <div class="title">页面选择</div>
        <el-select
          placeholder="请选择"
          v-model="config.currentTabIndex"
          @change="onChanges(4)"
        >
          <el-option
            v-for="(item, index) in config.tabList"
            :key="item.value"
            :label="item.label"
            :value="index"
            draggable="true"
          >
            <div
              class="lis"
              @mousedown.stop="dragstart(item, index)"
              @dragover.stop="dragover(item, index)"
              @drop.stop="drop"
            >
              <span style="float: left">{{ item.label }}</span>
              <span
                v-show="config.tabList.length > 1"
                @click.stop
                class="iconEl"
              >
                <i
                  @click="deleteTab(index)"
                  class="el-icon-delete"
                  style="color:red"
                ></i>
              </span>
            </div>
          </el-option>
          <li disabled class="el-select-dropdown__item" @click.stop>
            <span @click.stop class="iconEl">
              <i @mouseup.stop="addTab" class="el-icon-circle-plus"></i>
            </span>
          </li>
        </el-select>
      </div>

      <div class="line"></div>
      <div class="block">
        <div class="title">当前页面名称</div>
        <el-input
          v-model="tabName"
          placeholder="请输入内容"
          @input="onChanges(3)"
          @change="onChanges(3)"
        ></el-input>
      </div>
    </template>
  </div>
</template>

<script>
import { fontFamily, fontSize14To36 } from "./common";
import { getComp, guid } from "@/util/common.js";
export default {
  props: {
    title: String,
    config: Object,
    onChange: Function
  },
  data() {
    return {
      dragItem: null,
      dragIndex: null,
      tabSelectColor: this.config.tabFont[3],
      tabColor: this.config.tabFont[2],
      tabName: this.config.tabList[this.config.currentTabIndex].label,
      titleColor: this.config.titleFont[2],
      fontFamily: fontFamily,
      fontSize14To36: fontSize14To36,
      titleAlign: [
        { label: "左", value: "left" },
        { label: "中", value: "center" },
        { label: "右", value: "right" }
      ],
      borderRadius: this.config.borderRadius,
      opacity: this.config.opacity
    };
  },
  methods: {
    dragstart(item, index) {
      console.log(1, item, index);
      this.dragItem = item;
      this.dragIndex = index;
    },
    dragover(item, index) {
      console.log(item, index);
      if (index !== this.dragIndex) {
        this.config.tabList = this.config.tabList.map(tab => {
          if (tab === this.dragItem) {
            return item;
          } else if (tab === item) {
            return this.dragItem;
          }
          return tab;
        });
        if (this.config.currentTabIndex === index) {
          this.config.currentTabIndex = this.dragIndex;
        } else if (this.config.currentTabIndex === this.dragIndex) {
          this.config.currentTabIndex = index;
        }
        if (this.config.oldCurrentTabIndex === index) {
          this.config.oldCurrentTabIndex = this.dragIndex;
        } else if (this.config.oldCurrentTabIndex === this.dragIndex) {
          this.config.oldCurrentTabIndex = index;
        }

        let compconfigs = this.$drag.vms.$refs.comp.compconfigs;
        let olds = compconfigs.splice(index, 1, compconfigs[this.dragIndex]);
        compconfigs.splice(this.dragIndex, 1, olds[0]);
        let comps = this.$drag.vms.$refs.comp.comps;
        let old = comps.splice(index, 1, comps[this.dragIndex]);
        comps.splice(this.dragIndex, 1, old[0]);
        this.dragIndex = index;
      }
      event.preventDefault();
    },
    drop() {
      console.log(3);
      event.preventDefault();
    },

    deleteTab(index) {
      let targetIndex = this.config.currentTabIndex;
      if (targetIndex >= index) {
        targetIndex = targetIndex - 1;
      }

      let tab = this.config.tabList.splice(index, 1);
      let len = this.config.tabList.length;
      if (this.tabName === tab[0].label) {
        let nowTab = this.config.tabList[len - 1];
        this.tabName = nowTab.label;
        targetIndex = len - 1;
      }
      this.config.currentTabIndex = targetIndex;
      this.config.oldCurrentTabIndex = targetIndex;
      //清除配置
      let comp = this.$drag.vms.$refs.comp;
      comp.deleteTab(index);
      this.onChange(null, true);
    },
    addTab() {
      this.config.tabList.push({
        label: "默认名称" + (this.config.tabList.length + 1),
        value: guid()
      });
      let comp = this.$drag.vms.$refs.comp;
      comp.addTab();
      this.onChange(null, true);
    },
    onChangeInit() {
      if (this.$drag.vms) {
        this.$parent.$parent.bool = false;
        this.$parent.$parent.baisicConfig = null;
        let comp = getComp(this.$drag.vms.type).data();
        this.$drag.vms.$refs.comp.resetStyle(comp);
        this.$drag.layout.$refs.righters.currentVm = null;
        this.$drag.showMenu(this.$drag.vms);
        this.$nextTick(() => {
          this.$parent.$parent.bool = true;
        });
      }
      this.onChange("resetStyle", true);
    },
    check() {
      return true;
    },
    dialogChange(type) {
      let isNeed = this.$drag.isNeedContainer(this.$drag.vms);
      let bool = true;
      switch (type) {
        case 1:
          if (this.config.promptDialog) {
            this.config.dialog = false;
          } else if (!this.config.promptDialog && !this.config.dialog) {
            if (isNeed) {
              this.config.promptDialog = true;
              bool = false;
              this.$message({
                type: "warning",
                message: "容器已被绑定，取消失败"
              });
            }
          }
          break;
        case 2:
          if (this.config.dialog) {
            this.config.promptDialog = false;
          } else if (!this.config.promptDialog && !this.config.dialog) {
            if (isNeed) {
              this.config.dialog = true;
              bool = false;
              this.$message({
                type: "warning",
                message: "容器已被绑定，取消失败"
              });
            }
          }

          break;
        default:
          break;
      }
      if (bool) {
        this.onChange("initDialog", true);
      }
    },
    setColor(type) {
      switch (type) {
        case 1:
          this.config.titleFont[2] = this.titleColor;
          break;
        case 2:
          this.config.opacity = this.opacity;
          break;
        case 3:
          this.config.tabFont[2] = this.tabColor;
          break;
        case 4:
          this.config.tabFont[3] = this.tabSelectColor;
          break;
        default:
          break;
      }

      this.onChange(null, true);
    },
    onChanges(type) {
      switch (type) {
        case 1:
          this.config.borderRadius = this.borderRadius;
          break;
        case 2:
          this.config.opacity = this.opacity;
          break;
        case 3:
          this.config.tabList[this.config.currentTabIndex].label = this.tabName;
          break;
        case 4:
          this.tabName = this.config.tabList[this.config.currentTabIndex].label;
          break;
        default:
          break;
      }

      this.onChange(null, true);
    }
  }
};
</script>
<style lang="less" scoped>
.lis {
  position: relative;
  height: calc(100%);
  width: calc(100%);
}
.iconEl {
  float: right;
  color: #8492a6;
  font-size: 13px;
}
.rowDiv {
  flex: 1;
}
.sliders {
  padding-left: 12px;
}
.line {
  background: #ddd;
  width: 6px;
  height: 2px;
  margin: 0 3px;
}
.block {
  margin-top: 10px;
}
.body {
  height: 28px;
  line-height: 28px;
  background: white;
  color: #282828;
  border-radius: 4px;
  .rows {
    height: calc(100%);
    position: relative;
    flex: 1;
    text-align: center;
    cursor: pointer;
    box-sizing: border-box;
    position: relative;
    .text-color {
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      opacity: 0;
    }
    select {
      border-radius: 4px;
      width: calc(100%);
      height: 28px;
      border: none;
      font-size: 12px;
    }
    span {
      font-size: 20px;
    }
  }
  .rows + .rows {
    &::before {
      content: "";
      position: absolute;
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
      top: 2px;
      left: 0.5px;
      height: 24px;
      width: 1px;
      background: #cccccc;
    }
  }
}
</style>
