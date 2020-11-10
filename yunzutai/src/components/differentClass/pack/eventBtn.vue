<template>
  <div class="comps">
    <div class="title" style="height:20px;">
      <el-checkbox v-model="config.ditto" @change="changeDittoAll"
        >同上</el-checkbox
      >
      <el-checkbox v-model="config.remind">确认提示</el-checkbox>
    </div>
    <template v-for="(item, index) in eventList">
      <div class="bodys" :key="index">
        <el-select
          v-model="item.order"
          placeholder="请选择"
          @change="change(item, index)"
          clearable
        >
          <el-option
            v-for="item in eventOption"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <template v-if="item.order === 1">
          <div class="marginTop10">
            <div class="marginTop10">开事件</div>
            <el-checkbox v-model="item.open.tjenable">条件</el-checkbox>
            <el-cascader
              v-if="item.open.tjenable"
              popper-class="rightattr-cascader"
              v-model="item.open.predev"
              :props="props"
              clearable
            ></el-cascader>
            <div class="row rowend" v-if="item.open.tjenable">
              <select
                v-model="item.open.predevchar"
                @change="onChange(null, true)"
              >
                <option
                  v-for="item in operList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></option>
              </select>
              <input v-model="item.open.prenum" />
            </div>
            <div class="marginTop10">切换</div>
            <el-cascader
              ref="cascader"
              v-if="showOpen"
              popper-class="rightattr-cascader"
              v-model="item.open.curdevchar"
              :props="props"
              clearable
            ></el-cascader>
            <div class="row rowspace rowAlignCenter">
              <div><input style="width:40px" v-model="item.open.setnum" /></div>
              <div>设置值</div>
            </div>
          </div>
          <div class="marginTop10">
            <div class="marginTop10 offDitto">
              <p>关事件</p>
              <el-checkbox v-model="item.off.ditto" @change="changeDitto(item)"
                >同上</el-checkbox
              >
            </div>
            <el-checkbox v-model="item.off.tjenable">条件</el-checkbox>
            <el-cascader
              v-if="item.off.tjenable && showOpen"
              popper-class="rightattr-cascader"
              v-model="item.off.predev"
              :props="props"
              clearable
            ></el-cascader>
            <div class="row rowend" v-if="item.off.tjenable">
              <select
                v-model="item.off.predevchar"
                @change="onChange(null, true)"
              >
                <option
                  v-for="item in operList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></option>
              </select>
              <input v-model="item.off.prenum" />
            </div>
            <div class="marginTop10">切换</div>
            <el-cascader
              v-if="showOpen"
              popper-class="rightattr-cascader"
              v-model="item.off.curdevchar"
              :props="props"
              clearable
            ></el-cascader>
            <div class="row rowspace rowAlignCenter">
              <div><input style="width:40px" v-model="item.off.setnum" /></div>
              <div>设置值</div>
            </div>
          </div>
        </template>
        <template v-else-if="item.order === 2">
          <div class="marginTop10">
            <div>开脚本</div>
            <el-input
              class="marginTop10"
              type="textarea"
              :autosize="{ minRows: 6, maxRows: 10 }"
              placeholder="输入js语言..."
              v-model="item.open.jscotent"
            >
            </el-input>
            <div class="marginTop10">关脚本</div>
            <el-input
              class="marginTop10"
              type="textarea"
              :autosize="{ minRows: 6, maxRows: 10 }"
              placeholder="输入js语言..."
              v-model="item.off.jscotent"
            >
            </el-input>
          </div>
        </template>
        <template v-else-if="item.order === 3">
          <div class="marginTop10">
            <div class="marginTop10">开赋值</div>
            <el-checkbox v-model="item.open.tjenable">条件</el-checkbox>
            <el-cascader
              v-if="item.open.tjenable && showOpen"
              popper-class="rightattr-cascader"
              v-model="item.open.predev"
              :props="props"
              clearable
            ></el-cascader>
            <div class="row rowend" v-if="item.open.tjenable">
              <select v-model="item.open.fzchar" @change="onChange(null, true)">
                <option
                  v-for="item in operList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></option>
              </select>
              <input v-model="item.open.prenum" />
            </div>
            <div class="marginTop10">赋值</div>
            <div>
              <template v-for="(assign, assignIndex) in item.open.valueList">
                <div :key="assignIndex" class="marginTop10">
                  <el-cascader
                    v-if="showOpen"
                    popper-class="rightattr-cascader"
                    v-model="assign.curdev"
                    :props="props"
                    clearable
                  ></el-cascader>
                  <div class="row rowstart rowAlignCenter">
                    <div style="padding-right:15px;">
                      <span style="padding-right:5px;">=</span
                      ><input style="width:40px" v-model="assign.curnum" />
                    </div>
                    <div
                      style="margin-right:15px;"
                      class="btn adds"
                      @click="addss(item.open, assignIndex)"
                      v-show="assignIndex + 1 === item.open.valueList.length"
                    >
                      添加
                    </div>
                    <div
                      class="btn dels"
                      @click="deletess(item.open, assignIndex)"
                      v-show="item.open.valueList.length !== 1"
                    >
                      删除
                    </div>
                  </div>
                </div>
              </template>
            </div>
          </div>

          <div class="marginTop10">
            <div class="marginTop10 offDitto">
              <p>关赋值</p>
              <el-checkbox v-model="item.off.ditto" @change="changeDitto(item)"
                >同上</el-checkbox
              >
            </div>
            <el-checkbox v-model="item.off.tjenable">条件</el-checkbox>
            <el-cascader
              v-if="item.off.tjenable && showOpen"
              popper-class="rightattr-cascader"
              v-model="item.off.predev"
              :props="props"
              clearable
            ></el-cascader>
            <div class="row rowend" v-if="item.off.tjenable">
              <select v-model="item.off.fzchar" @change="onChange(null, true)">
                <option
                  v-for="item in operList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></option>
              </select>
              <input v-model="item.off.prenum" />
            </div>
            <div class="marginTop10">赋值</div>
            <div>
              <template v-for="(assign, assignIndex) in item.off.valueList">
                <div :key="assignIndex" class="marginTop10">
                  <el-cascader
                    v-if="showOpen"
                    popper-class="rightattr-cascader"
                    v-model="assign.curdev"
                    :props="props"
                    clearable
                  ></el-cascader>
                  <div class="row rowstart rowAlignCenter">
                    <div style="padding-right:15px;">
                      <span style="padding-right:5px;">=</span
                      ><input style="width:40px" v-model="assign.curnum" />
                    </div>
                    <div
                      style="margin-right:15px;"
                      class="btn adds"
                      @click="addss(item.off, assignIndex)"
                      v-show="assignIndex + 1 === item.off.valueList.length"
                    >
                      添加
                    </div>
                    <div
                      class="btn dels"
                      @click="deletess(item.off, assignIndex)"
                      v-show="item.off.valueList.length !== 1"
                    >
                      删除
                    </div>
                  </div>
                </div>
              </template>
            </div>
          </div>
        </template>
        <div class="divFlex">
          <div
            @click="adds(index)"
            v-show="index + 1 === eventList.length"
            class="add"
          >
            +
          </div>
          <div
            @click="deletes(index)"
            v-show="eventList.length !== 1"
            class="delete"
          >
            -
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { operateList } from "./common";
export default {
  props: {
    title: String,
    config: Object,
    onChange: Function
  },
  data() {
    const eventLists = [
      { label: "开关切换", value: 1 },
      { label: "执行脚本", value: 2 },
      { label: "赋值", value: 3 }
    ];
    return {
      props: [],
      operList: operateList,
      eventOption: eventLists,
      showOpen: true,
      eventList: this.config.value
    };
  },
  created() {
    this.request();
  },
  methods: {
    request() {
      let self = this;
      self.props = {
        label: "name",
        lazy: true,
        lazyLoad(node, resolve) {
          let { data, root } = node;
          setTimeout(() => {
            let params = [];
            if (!root && data.childNodes) {
              params = data.childNodes;
            } else {
              params = self.$store.state.deviceList || [];
            }
            const nodes = Array.from(params).map(item => ({
              value: item.id,
              name: item.name,
              disabled: item.disabled,
              leaf: !item.children,
              childNodes: item.children
            }));
            resolve(nodes);
          }, 400);
        }
      };
    },
    addss(item, assignIndex) {
      item.valueList.splice(assignIndex + 1, 0, {
        pointId: [],
        value: ""
      });
    },
    deletess(item, assignIndex) {
      item.valueList.splice(assignIndex, 1);
    },
    change(item) {
      item.open = {
        valueList: [{}],
        tjenable: false
      };
      item.off = {
        valueList: [{}],
        tjenable: false
      };
    },
    adds(index) {
      this.eventList.splice(index + 1, 0, {
        order: "",
        open: {},
        off: {}
      });
      this.config.value = this.eventList;
    },
    deletes(index) {
      this.eventList.splice(index, 1);
      this.config.value = this.eventList;
    },
    // 同上
    changeDitto(item) {
      if (!item.off.ditto) return;
      this.showOpen = false;
      item.off.curdevchar = item.open.curdevchar;
      this.$nextTick(() => {
        item.off.curdevchar = item.open.curdevchar;
        this.showOpen = true;
      });
      if (item.open.setnum == "0") {
        item.off.setnum = "1";
      } else {
        item.off.setnum = "0";
      }
    },
    // 全部同上
    changeDittoAll() {
      let self = this;
      console.log(this.config.ditto);
      if (!this.config.ditto) return;
      let values = this.$parent.config["显示切换"].value;
      self.showOpen = false;
      self.$nextTick(() => {
        let eventList = self.eventList;
        for (let i = 0; i < eventList.length; i++) {
          if (eventList[i].order === 1) {
            eventList[i].open.curdevchar = values;
            eventList[i].off.curdevchar = values;
          } else if (eventList[i].order === 3) {
            for (let j = 0; j < eventList[i].open.valueList.length; j++) {
              eventList[i].open.valueList[j].curdev = values;
            }
            for (let j = 0; j < eventList[i].off.valueList.length; j++) {
              eventList[i].off.valueList[j].curdev = values;
            }
          }
        }
        self.showOpen = true;
      });
    }
  }
};
</script>
<style lang="less" scoped>
.title {
  display: flex;
}
.bodys {
  margin-top: 5px;
  .divFlex {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
  }
  .add,
  .delete {
    width: 40px;
    font-size: 40px;
    text-align: center;
  }
  & /deep/ .el-color-picker {
    margin-right: 10px;
  }
  .line {
    background: #ddd;
    width: 6px;
    height: 2px;
    margin: 0 3px;
  }
  input {
    width: 67px;
    height: 30px;
    padding: 0;
    box-sizing: border-box;
  }
}
input,
select {
  border-radius: 4px;
  width: calc(100%);
  height: 30px;
  border: none;
  font-size: 12px;
  box-sizing: border-box;
  width: 40px;
}
select + input {
  margin-left: 10px;
}
input {
  margin-right: 5px;
}
.btn {
  margin-top: 5px;
  height: 25px;
  width: 45px;
  background: #3573c1;
  color: #fff;
  border: 0;
  cursor: pointer;
  line-height: 25px;
  text-align: center;
  &.adds {
    background: #3573c1;
  }
  &.dels {
    background: #f56c6c;
  }
}
.offDitto {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
