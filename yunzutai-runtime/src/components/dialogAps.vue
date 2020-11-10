<template>
  <div class="compDialog">
    <el-dialog
      :visible.sync="dialogVisible"
      title="编辑排程"
      width="900px"
      :close-on-click-modal="false"
      :before-close="cancel"
    >
      <div class="body">
        <div class="lefts">
          <div class="title">
            <div>排程列表</div>
            <div style="height: 20px;line-height: 20px;">
              <i @mousedown="sortaps" title="排序" class="el-icon-d-caret"></i>
              <i @mousedown="addaps" title="添加排程" class="el-icon-plus"></i>
            </div>
          </div>
          <div class="content">
            <ul class="tab-ul" v-if="apsSelectId">
              <li v-for="(item, index) in apsOneList" :key="index">
                <div class="tab-li">
                  <input
                    placeholder="请输入排程名称"
                    @mousedown.stop="apsSelects(item.id)"
                    :class="
                      apsSelectId === item.id
                        ? 'tab-input selected'
                        : 'tab-input'
                    "
                    v-model="item.name"
                    type="text"
                  />
                  <div @mousedown.stop="deleteaps(index)" class="icon">
                    <span class="el-icon-close"></span>
                  </div>
                </div>
              </li>
            </ul>
            <div class="no-data" v-else>请添加排程</div>
          </div>
        </div>
        <div class="rights">
          <div class="title">
            <div>组合列表</div>
          </div>
          <div class="content">
            <div class="content-title" v-if="apsSelectId">
              <div class="title1">组合选择：</div>
              <div class="title2">
                <el-select
                  class="selectClass"
                  v-model="ptgSelectId"
                  @change="ptgSelectIdChange"
                  placeholder="请选择组合"
                >
                  <el-option
                    v-for="item in ptgPoints"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
                <i
                  @mousedown="addPtgGroups"
                  title="全选点位"
                  class="el-icon-folder-add"
                ></i>
              </div>
              <div class="title3">
                <el-date-picker
                  size="small"
                  type="datetime"
                  class="selectClass"
                  format="yyyy-MM-dd HH:mm"
                  style="width: 100%"
                  :clearable="false"
                  v-model="currentItemConfig.time"
                  placeholder="请选择时间"
                ></el-date-picker>
              </div>
            </div>
            <div class="content-ul" v-if="apsSelectId">
              <div class="content-div">
                <ul
                  class="ul-content"
                  v-if="currentItemConfig.ptgPonitsList.length"
                >
                  <li
                    v-for="(item, index) in currentItemConfig.ptgPonitsList"
                    :key="index"
                  >
                    <div class="liBody">
                      <div class="label">{{ getPtgName(item.id) }}</div>
                      <input
                        class="labelInput"
                        placeholder="请输入数值"
                        v-model="item.value"
                      />
                      <div
                        @mousedown.stop="deletePointGroup(index)"
                        class="icon"
                      >
                        <span class="el-icon-close"></span>
                      </div>
                    </div>
                  </li>
                </ul>
                <div class="no-data" v-else>暂无数据</div>
              </div>
            </div>
            <div class="no-data" v-else>暂无数据</div>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <button class="cancel" @click="cancel">取 消</button>
        <button class="sure" type="primary" @click="sure">确 定</button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getPointsData, setPointsData } from "@/api/server.js";
import { guid } from "@/util/common.js";
export default {
  data() {
    return {
      pointId: null, //组件选中点位组id
      compId: null, //组件
      composePointId: null, //当前编辑组合选取的点位
      pointGroup: [], //点位组列表
      ptgPoints: [], //组合列表
      apsList: [],
      apsOneList: [],
      apsSelectId: "", //当前选中的定时项
      apsConfig: { id: "", apsOneList: [] }, //定时配置
      currentItemConfig: null, //右侧配置项
      ptgSelectId: "", //组合选中id
      oldData: null,
      dialogVisible: false
    };
  },
  watch: {
    dialogVisible(val) {
      if (val) {
        this.init(); //加载点位组
      }
    }
  },
  methods: {
    //通过定时选取组合项
    apsSelects(id) {
      if (this.apsSelectId !== id) {
        this.ptgSelectId = "";
        this.apsSelectId = id;
        this.currentItemConfig = this.apsOneList.find(item => {
          return item.id === this.apsSelectId;
        });
      }
    },
    //获取名称
    getPtgName(id) {
      let item = this.ptgPoints.find(_item => {
        return _item.id === id;
      });
      if (item) {
        return item.name;
      }
      return id;
    },
    //添加所有组合
    addPtgGroups() {
      this.$prompt("", "全选组合", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPlaceholder: "请输入批量设置值",
        closeOnClickModal: false
      })
        .then(({ value }) => {
          this.ptgPoints.forEach(_item => {
            let label = this.currentItemConfig.ptgPonitsList.find(item => {
              return item.id === _item.id;
            });
            if (!label) {
              this.currentItemConfig.ptgPonitsList.push({
                id: _item.id,
                value: value
              });
            }
          });
          this.$message({
            type: "success",
            message: "添加成功!"
          });
        })
        .catch(() => {});
    },
    //删除
    deletePointGroup(index) {
      this.$confirm("此操作将删除该组合, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        closeOnClickModal: false
      })
        .then(() => {
          this.currentItemConfig.ptgPonitsList.splice(index, 1);
        })
        .catch(() => {});
    },
    //选中组合切换
    ptgSelectIdChange() {
      let label = this.currentItemConfig.ptgPonitsList.find(item => {
        return item.id === this.ptgSelectId;
      });
      if (!label) {
        this.currentItemConfig.ptgPonitsList.push({
          id: this.ptgSelectId,
          value: ""
        });
      }
    },
    //排序
    sortaps() {
      this.apsOneList.reverse();
    },
    //添加定时列表
    addaps() {
      this.apsOneList.push({
        id: guid(),
        name: "排程" + this.apsOneList.length,
        ptgPonitsList: [],
        roundType: [],
        stateDepict: "关",
        status: 0,
        time: ""
      });
      if (this.apsSelectId === "") {
        this.apsSelectId = this.apsOneList[0].id;
        this.currentItemConfig = this.apsOneList[0];
      }
    },
    //删除定时项
    deleteaps(index) {
      this.$confirm("此操作将删除该定时, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        closeOnClickModal: false
      })
        .then(() => {
          let oldId = this.apsOneList[index].id;
          this.apsOneList.splice(index, 1);
          if (oldId === this.apsSelectId) {
            if (this.apsOneList.length) {
              this.apsSelects(this.apsOneList[0].id);
            } else {
              this.apsSelectId = "";
            }
          }
        })
        .catch(() => {});
    },
    //取消弹框
    cancel() {
      if (this.oldData !== JSON.stringify(this.apsOneList)) {
        this.$confirm("数据尚未保存,是否退出?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          closeOnClickModal: false
        })
          .then(() => {
            this.apsSelectId = "";
            this.apsOneList = [];
            this.apsConfig = { id: "", apsOneList: [] };
            this.currentItemConfig = null;
            this.ptgSelectId = "";

            this.dialogVisible = false;
          })
          .catch(() => {});
      } else {
        this.apsSelectId = "";
        this.apsOneList = [];
        this.apsConfig = { id: "", apsOneList: [] };
        this.currentItemConfig = null;
        this.ptgSelectId = "";

        this.dialogVisible = false;
      }
    },
    sure() {
      for (var i = 0; i < this.apsOneList.length; i++) {
        let val = this.apsOneList[i];
        if (!val.time) {
          this.$message({
            type: "warning",
            message: val.name + "未选择时间!"
          });
          return;
        }
        if (val.ptgPonitsList.length === 0) {
          this.$message({
            type: "warning",
            message: val.name + "未选择组合!"
          });
          return;
        }
        for (var j = 0; j < val.ptgPonitsList.length; j++) {
          if (val.ptgPonitsList[j].value === "") {
            this.$message({
              type: "warning",
              message: val.name + "有组合数值为空!"
            });
            return;
          }
        }
      }
      let target = null;
      this.apsList = this.apsList.map(item => {
        if (item.id === "aps_" + this.compId) {
          target = item;
          item.apsOneList = this.apsOneList;
        }
        return item;
      });
      if (!target) {
        target = {
          id: "aps_" + this.compId,
          apsOneList: this.apsOneList
        };
        this.apsList.push(target);
      }
      setPointsData({
        ...this.$store.state.pointGroup,
        apsList: this.apsList
      }).then(() => {
        this.$drag.dealAps(this.$drag.operComp.$refs.comp, target, true);
        this.apsSelectId = "";
        this.apsOneList = [];
        this.apsConfig = { id: "", apsOneList: [] };
        this.currentItemConfig = null;
        this.ptgSelectId = "";

        this.dialogVisible = false;
      });
    },

    //弹窗初始化
    init() {
      this.getPointsData({ pid: this.$store.state.subProjectId }).then(() => {
        this.compId = this.$drag.operComp.id;
        this.pointId = this.$drag.operComp.$refs.comp.highConfig[
          "点位组关联"
        ].value;
        let label = this.apsList.find(item => {
          return item.id === "aps_" + this.compId;
        });
        this.ptgSelectId = "";
        this.currentItemConfig = null;
        if (label) {
          this.apsOneList = label.apsOneList;
          if (this.apsOneList.length) {
            this.apsSelectId = this.apsOneList[0].id;
            this.currentItemConfig = this.apsOneList[0];
          }
        }
        this.oldData = JSON.stringify(this.apsOneList);
      });
    },

    //获取点位组数据
    getPointsData() {
      return new Promise(resolve => {
        getPointsData({ pid: this.$store.state.subProjectId }).then(res => {
          let data = res.body || {
            apsList: [],
            sceneList: [],
            ptgPoints: [],
            timerList: [],
            pointGroup: []
          };
          this.$store.dispatch("setPointGroup", data);
          this.ptgPoints = data.ptgPoints;
          this.pointGroup = data.pointGroup;
          this.apsList = data.apsList;
          resolve();
        });
      });
    }
  }
};
</script>
<style lang="less" scoped>
.inline {
  display: inline-block;
  input {
    box-sizing: border-box;
    width: 70px;
    background: transparent;
    border: none;
    border-bottom: 1px solid white;
    font-size: 14px;
    color: white;
  }
}
.compDialog {
  & /deep/ .el-dialog {
    margin-top: 15vh;
    border-radius: 10px;
    .el-dialog__header {
      background-color: #373e4a;
      border-bottom: #373e4a;
      border-radius: 10px 10px 0 0;
      height: 50px;
      box-sizing: border-box;
      padding: 0 20px 0 30px;
      font-size: 15px;
      line-height: 50px;
      .el-dialog__title {
        color: #fff;
        line-height: 24px;
        font-size: 18px;
      }
      .el-dialog__close {
        color: #fff;
      }
    }
    .el-dialog__body {
      padding: 30px 50px !important;
      color: #fff;
      background-color: #2b303c;
      .body {
        height: calc(100%);
        width: calc(100%);
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        height: 350px;
        .no-data {
          height: calc(100%);
          width: calc(100%);
          display: flex;
          justify-content: center;
          align-items: center;
          color: #8c96a5;
          font-size: 16px;
        }
        .lefts {
          width: 265px;
          box-sizing: border-box;
          border: 1px solid #556174;
          background-color: #373e4a;
          height: calc(100%);
          .title {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            padding: 0 20px;
            height: 34px;
            font-weight: bold;
            background-color: #556174;
            i {
              margin: 0 0 0 8px;
              cursor: pointer;
              &:hover,
              &:active {
                color: #409eff;
              }
            }
          }
          .content {
            height: calc(100% - 34px);
            padding: 20px;
            padding-right: 10px;
            box-sizing: border-box;
            .tab-ul {
              height: calc(100%);
              overflow: overlay;
              padding-right: 15px;
              li + li {
                margin-top: 10px;
              }
              .tab-li {
                display: flex;
                justify-content: center;
                flex-direction: row;
                .tab-input {
                  height: 30px;
                  width: calc(100% - 30px);
                  padding-right: 35px;
                  color: #fff;
                  border: 1px solid #556174;
                  background-color: transparent;
                  padding: 0 40px 0 10px;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                  overflow: hidden;
                  cursor: pointer;
                  box-sizing: border-box;
                  &::-webkit-input-placeholder {
                    color: #bdcada;
                    opacity: 0.5;
                  }
                  &.selected {
                    color: #409eff;
                  }
                }
                .icon {
                  span {
                    background-color: #d0d5dc;
                    color: #000;
                    width: 18px;
                    line-height: 18px;
                    text-align: center;
                    height: 18px;
                    border-radius: 50%;
                    transform: scale(0.8);
                  }
                  background-color: #556174;
                  height: 30px;
                  width: 30px;
                  line-height: 30px;
                  text-align: center;
                }
              }
            }
          }
        }
        .rights {
          border: 1px solid #556174;
          background-color: #373e4a;
          width: 515px;
          box-sizing: border-box;
          .title {
            height: 34px;
            padding: 0 20px;
            font-weight: bold;
            line-height: 34px;
            font-weight: bold;
            background-color: #556174;
          }
          .content {
            height: calc(100% - 34px);
            padding: 20px 20px 20px 20px;
            box-sizing: border-box;
            .content-ul {
              margin-top: 10px;
              height: calc(100% - 44px);
              display: flex;
              justify-content: flex-end;
              .content-div {
                padding: 15px 5px 15px 15px;
                box-sizing: border-box;
                border: 1px solid #556174;
                height: calc(100%);
                width: calc(100% - 70px);
              }
              .ul-content {
                width: calc(100%);
                padding-right: 15px;
                height: calc(100%);
                box-sizing: border-box;
                overflow: overlay;
                li + li {
                  margin-top: 2px;
                }
                .liBody {
                  display: flex;
                  flex-direction: row;
                  align-items: center;
                  height: 30px;
                  position: relative;
                  .label {
                    padding-left: 14px;
                    height: 30px;
                    line-height: 30px;
                    flex: 3;
                    background-color: #556174;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    overflow: hidden;
                  }
                  .labelInput {
                    margin-left: 2px;
                    height: 30px;
                    line-height: 30px;
                    flex: 2;
                    border: 1px solid #556174;
                    color: #fff;
                    padding: 0 10px;
                    outline: none;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    overflow: hidden;
                    cursor: pointer;
                    box-sizing: border-box;
                    background-color: #556174;
                    &::-webkit-input-placeholder {
                      color: #bdcada;
                      opacity: 0.5;
                    }
                  }
                  .icon {
                    position: absolute;
                    right: 0px;
                    top: 0px;
                    background-color: #373e4a;
                    border: 1px solid #556174;
                    cursor: pointer;
                    box-sizing: border-box;
                    width: 30px;
                    height: 30px;
                    line-height: 30px;
                    text-align: center;
                    .el-icon-close {
                      background-color: #d0d5dc;
                      color: #000;
                      width: 18px;
                      line-height: 18px;
                      text-align: center;
                      height: 18px;
                      border-radius: 50%;
                      transform: scale(0.8);
                    }
                  }
                }
              }
            }
            .content-title {
              width: calc(100%);
              display: flex;
              flex-direction: row;
              justify-content: space-between;
              align-items: center;
              .title1 {
                width: 70px;
              }
              .title2 {
                flex: 1;
                display: flex;
                align-items: center;
                flex-direction: row;
                .el-icon-folder-add {
                  font-size: 24px;
                  padding-left: 5px;
                }
              }
              .title3 {
                margin: 0px 10px;
                flex: 1;
              }
              .title4 {
                flex: 1;
              }
            }
          }
        }
      }
    }
    .el-dialog__footer {
      background-color: #373e4a;
      padding: 0;
      height: 58px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 0 0 10px 10px;
    }
  }
}
.cancel {
  background-color: rgba(85, 97, 116, 1);
  color: #fff;
  padding: 6px 20px;
  width: 115px;
  border-radius: 8px;
  outline: none;
  border-width: 0px;
  cursor: pointer;
}
.sure {
  cursor: pointer;
  outline: none;
  background-color: #377be4;
  border-width: 0px;
  color: #fff;
  padding: 6px 20px;
  width: 115px;
  border-radius: 8px;
  margin-left: 10px;
}
.selectClass /deep/ .el-input__inner {
  background-color: #353c48;
  border-color: #556174;
  color: #fff;
  width: calc(100%);
  height: 32px;
  line-height: 32px;
  padding-right: 30px;
  border-radius: 0px;
  outline: none;
  &::-webkit-input-placeholder {
    color: #bdcada;
    opacity: 0.5;
  }
}
.selectClass /deep/ .el-input__icon {
  line-height: 32px;
}
</style>
