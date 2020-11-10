<template>
  <div class="comps">
    <div class="title" style="height:20px;">
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
          ></el-option>
        </el-select>
        <template v-if="item.order === 0">
          <el-select
            class="marginTop10"
            v-model="item.pageId"
            placeholder="请选择"
            clearable
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </template>
        <template v-else-if="item.order === 1">
          <div class="marginTop10">
            <el-checkbox v-model="item.permit">条件</el-checkbox>
            <el-cascader
              v-if="item.permit"
              popper-class="rightattr-cascader"
              v-model="item.permitPointId"
              :props="props"
              clearable
            ></el-cascader>
            <div class="row rowend" v-if="item.permit">
              <select v-model="item.oper" @change="null, true" clearable>
                <option
                  v-for="item in operList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></option>
              </select>
              <input v-model="item.operValue" />
            </div>
            <div class="marginTop10">切换</div>
            <el-cascader
              popper-class="rightattr-cascader"
              v-model="item.pointId"
              :props="props"
              clearable
            ></el-cascader>
            <div class="row rowspace rowAlignCenter">
              <div>开启值</div>
              <div>
                <input style="width:40px" v-model="item.okVal" />
              </div>
              <div>关闭值</div>
              <div>
                <input style="width:40px" v-model="item.noVal" />
              </div>
            </div>
          </div>
        </template>
        <template v-else-if="item.order === 2">
          <div class="marginTop10">
            <el-input
              type="textarea"
              :autosize="{ minRows: 6, maxRows: 10 }"
              placeholder="输入js语言..."
              v-model="item.jsContent"
            ></el-input>
          </div>
        </template>
        <template v-else-if="item.order === 3">
          <div class="marginTop10">
            <el-checkbox v-model="item.permit">条件</el-checkbox>
            <el-cascader
              v-if="item.permit"
              popper-class="rightattr-cascader"
              v-model="item.permitPointId"
              :props="props"
              clearable
            ></el-cascader>
            <div class="row rowend" v-if="item.permit">
              <select
                v-model="item.oper"
                @change="onChange(null, true)"
                clearable
              >
                <option
                  v-for="item in operList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></option>
              </select>
              <input v-model="item.operValue" />
            </div>
            <div class="marginTop10">结果</div>
            <div>
              <template v-for="(assign, assignIndex) in item.result">
                <div :key="assignIndex" class="marginTop10">
                  <el-cascader
                    popper-class="rightattr-cascader"
                    v-model="assign.pointId"
                    :props="props"
                    clearable
                  ></el-cascader>
                  <div class="row rowstart rowAlignCenter">
                    <div style="padding-right:15px;">
                      <span style="padding-right:5px;">=</span>
                      <input style="width:40px" v-model="assign.value" />
                    </div>
                    <div
                      style="margin-right:15px;"
                      class="btn adds"
                      @click="addss(item.result, assignIndex)"
                      v-show="assignIndex + 1 === item.result.length"
                    >
                      添加
                    </div>
                    <div
                      class="btn dels"
                      @click="deletess(item.result, assignIndex)"
                      v-show="item.result.length !== 1"
                    >
                      删除
                    </div>
                  </div>
                </div>
              </template>
            </div>
          </div>
        </template>
        <template v-else-if="item.order === 4">
          <el-select
            class="marginTop10"
            v-model="item.pageId"
            placeholder="请选择"
            clearable
          >
            <el-option
              v-for="item in containerList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </template>
        <div class="divFlex">
          <div
            @click="adds(index)"
            v-show="index + 1 === eventList.length && eventList.length <= 4"
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
import { eventLists, operateList } from "./common";
import { getPages } from "@/util/common.js";
export default {
  props: {
    title: String,
    config: Object,
    onChange: Function
  },
  data() {
    return {
      ids: "2",
      props: [],
      operList: operateList,
      options: [],
      containerList: [],
      eventOption: eventLists,
      eventList: this.config.value
    };
  },
  created() {
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
  mounted() {
    this.options = getPages(this).filter(page => {
      return page.value !== this.$drag.currentPageId;
    });
    this.containerList = this.getContainerList();
  },
  methods: {
    getContainerList() {
      let id = this.$drag.currentPageId;
      if (!id) return [];
      let currentPageContainer = (
        this.$drag.containerVms[this.$drag.currentPageId] || []
      ).filter(item => {
        let compData = item.$refs.comp.baisicConfig["容器"];
        return (
          item.$parentEl
            .getAttribute("id")
            .indexOf(this.$drag.currentPageId) !== -1 &&
          (compData.promptDialog || compData.dialog)
        );
      });
      return currentPageContainer.map(item => {
        return {
          label: item.$refs.comp.baisicConfig["名称"].value,
          value: item.id
        };
      });
    },
    addss(item, assignIndex) {
      item.splice(assignIndex + 1, 0, {
        pointId: [],
        value: ""
      });
      this.ids = Math.random();
    },
    deletess(item, assignIndex) {
      item.splice(assignIndex, 1);
      this.ids = Math.random();
    },
    change(item, index) {
      this.eventList.splice(index, 1, {
        order: item.order,
        result: [
          {
            pointId: [],
            value: ""
          }
        ]
      });
      this.config.value = this.eventList;
      if (item.order === 4) {
        this.containerList = this.getContainerList();
      }
    },
    adds(index) {
      this.eventList.splice(index + 1, 0, {
        order: "",
        result: [
          {
            pointId: [],
            value: ""
          }
        ]
      });
      this.config.value = this.eventList;
    },
    deletes(index) {
      this.eventList.splice(index, 1);
      this.config.value = this.eventList;
    }
  }
};
</script>
<style lang="less" scoped>
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
</style>
