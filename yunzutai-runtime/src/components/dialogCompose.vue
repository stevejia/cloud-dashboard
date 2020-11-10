<template>
  <div class="compDialog">
    <el-dialog
      :visible.sync="dialogVisible"
      title="编辑组合"
      width="900px"
      :close-on-click-modal="false"
      :before-close="cancel"
    >
      <div class="body">
        <div class="lefts">
          <div class="title">
            <div>组合列表</div>
            <div style="height: 20px;line-height: 20px;">
              <div
                class="inline"
                @mouseenter="searchBool = true"
                @mouseleave="searchBool = false"
              >
                <i class="el-icon-search"></i>
                <input
                  @input="search"
                  v-show="searchBool"
                  v-model="searchData"
                />
              </div>

              <i @mousedown="sortPtg" title="排序" class="el-icon-d-caret"></i>
              <i
                @mousedown="addPtg('')"
                title="添加组合"
                class="el-icon-plus"
              ></i>
              <i
                @mousedown="addPtgs"
                title="批量添加"
                class="el-icon-folder-add"
              ></i>
            </div>
          </div>
          <div class="content">
            <ul class="tab-ul" v-if="ptgPointss.length">
              <li v-for="(item, index) in ptgPointss" :key="index">
                <div class="tab-li">
                  <input
                    placeholder="请输入组合名称"
                    @mousedown.stop="ptgSelect(index)"
                    :class="
                      ptgSelectId === item.id
                        ? 'tab-input selected'
                        : 'tab-input'
                    "
                    v-model="item.name"
                    type="text"
                  />
                  <div @mousedown.stop="deletePtg(index)" class="icon">
                    <span class="el-icon-close"></span>
                  </div>
                </div>
              </li>
            </ul>
            <div class="no-data" v-else>请添加组合</div>
          </div>
        </div>
        <div class="rights">
          <div class="title">
            <div>点位列表</div>
          </div>
          <div class="content">
            <div class="content-title" v-if="ptgSelectId">
              <div class="content-left">点位选择：</div>
              <div class="content-right">
                <el-select
                  class="selectClass"
                  v-model="composePointId"
                  @change="composePointIdChange"
                  placeholder="请选择点位"
                >
                  <el-option
                    v-for="item in currentPointGroup"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
                <i
                  @mousedown="addPointGroups"
                  title="全选点位"
                  class="el-icon-folder-add"
                ></i>
              </div>
            </div>
            <div class="content-ul" v-if="ptgSelectId">
              <div class="content-div">
                <ul class="ul-content" v-if="currentItemPointGroup.length">
                  <li
                    v-for="(item, index) in currentItemPointGroup"
                    :key="index"
                  >
                    <div class="liBody">
                      <div class="label">{{ item.pName }}</div>
                      <input
                        class="labelInput"
                        placeholder="备注"
                        v-model="item.remarks"
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
            <div class="no-data" v-else>请添加组合</div>
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
      searchBool: false,
      searchData: "",
      pointId: null, //组件选中点位组id
      compId: null, //组件
      currentPointGroup: [], //组件选中点位组列表
      currentItemPointGroup: [], //当前项绑定的点位组列表
      composePointId: null, //当前编辑组合选取的点位
      pointGroup: [], //点位组列表
      ptgPoints: [], //组合列表
      ptgPointss: [], //搜索使用
      ptgSelectId: "",
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
    search() {
      this.ptgPointss = this.ptgPoints.filter(item => {
        return item.name.indexOf(this.searchData) !== -1;
      });
    },
    cancel() {
      if (this.oldData !== JSON.stringify(this.ptgPoints)) {
        this.$confirm("数据尚未保存,是否退出?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          closeOnClickModal: false
        })
          .then(() => {
            this.ptgSelectId = "";
            (this.searchBool = false),
              (this.searchData = ""),
              (this.dialogVisible = false);
          })
          .catch(() => {});
      } else {
        this.ptgSelectId = "";
        (this.searchBool = false),
          (this.searchData = ""),
          (this.dialogVisible = false);
      }
    },
    sure() {
      for (var i = 0; i < this.ptgPoints.length; i++) {
        let val = this.ptgPoints[i];
        if (val.piTs.length === 0) {
          this.$message({
            type: "warning",
            message: val.name + "未添加点位!"
          });
          return;
        }
      }
      setPointsData({
        ...this.$store.state.pointGroup,
        ptgPoints: this.ptgPoints
      }).then(() => {
        this.ptgSelectId = "";
        (this.searchBool = false),
          (this.searchData = ""),
          (this.dialogVisible = false);
      });
    },
    //点位删除时间
    deletePointGroup(index) {
      this.$confirm("此操作将删除该点位, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        closeOnClickModal: false
      })
        .then(() => {
          this.currentItemPointGroup.splice(index, 1);
        })
        .catch(() => {});
    },
    //点位选择时间
    composePointIdChange() {
      let pit = this.currentPointGroup.find(item => {
        return item.id === this.composePointId;
      });

      let index = this.currentItemPointGroup.findIndex(item => {
        return item.pit === pit.pit.slice(-1)[0];
      });
      if (index === -1) {
        this.currentItemPointGroup.push({
          pName: pit.name,
          pit: pit.pit.slice(-1)[0],
          remarks: ""
        });
        this.$nextTick(() => {
          this.composePointId = null;
        });
      }
    },
    //弹窗初始化
    init() {
      this.getPointsData({ pid: this.$store.state.subProjectId }).then(() => {
        this.compId = this.$drag.operComp.id;
        this.pointId = this.$drag.operComp.$refs.comp.highConfig[
          "点位组关联"
        ].value;
        this.currentPointGroup = this.pointGroup.find(item => {
          return item.id === this.pointId;
        }).piTs;
        if (this.ptgPoints.length) {
          this.ptgSelectId = this.ptgPoints[0].id;
          this.currentItemPointGroup = this.ptgPoints[0].piTs;
        } else {
          this.ptgSelectId = "";
          this.currentItemPointGroup = [];
        }
      });
    },
    //选中
    ptgSelect(index) {
      if (this.ptgSelectId !== this.ptgPointss[index].id) {
        this.composePointId = "";
        this.ptgSelectId = this.ptgPointss[index].id;
        this.currentItemPointGroup = this.ptgPointss[index].piTs;
      }
    },
    //排序
    sortPtg() {
      this.ptgPointss.reverse();
    },
    //添加组合
    addPtg(name, piTs = []) {
      let addPtg = {
        comId: this.compId, //组件id
        id: guid(),
        name: name || "默认名称" + this.ptgPoints.length,
        pgId: this.pointId, //点位组id
        piTs: piTs
      };
      this.ptgPoints.push(addPtg);
      this.ptgSelectId = addPtg.id;
      this.currentItemPointGroup = addPtg.piTs;
      this.search();
    },
    //批量添加当前组合goups
    addPointGroups() {
      this.$confirm("是否确定?", "全选点位", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        closeOnClickModal: false
      })
        .then(() => {
          this.currentPointGroup.forEach(item => {
            let pitId = item.pit.slice(-1)[0];
            if (
              !this.currentItemPointGroup.find(_item => {
                return _item.pit === pitId;
              })
            ) {
              this.currentItemPointGroup.push({
                pName: item.name,
                pit: pitId,
                remarks: ""
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
    //批量添加
    addPtgs() {
      this.$confirm("是否确定?", "批量添加组合", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        closeOnClickModal: false
      })
        .then(() => {
          this.currentPointGroup.forEach(item => {
            if (
              !this.ptgPoints.find(_item => {
                return _item.name === item.name;
              })
            ) {
              this.addPtg(item.name, [
                { pName: item.name, pit: item.pit.slice(-1)[0], remarks: "" }
              ]);
            }
          });
          this.$message({
            type: "success",
            message: "添加成功!"
          });
        })
        .catch(() => {});
    },
    //删除组合
    deletePtg(index) {
      this.$confirm("此操作将删除该组合, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        closeOnClickModal: false
      })
        .then(() => {
          let del = this.ptgPointss[index];
          let _index = this.ptgPoints.findIndex(item => {
            return item.id === del.id;
          });
          this.ptgPoints.splice(_index, 1);
          if (this.ptgSelectId === del.id) {
            this.ptgSelectId = this.ptgPoints.length
              ? this.ptgPoints[0].id
              : "";
            if (this.ptgSelectId) {
              this.currentItemPointGroup = this.ptgPoints[0].piTs;
            } else {
              this.currentItemPointGroup = [];
            }
          }
          this.search();
        })
        .catch(() => {});
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
          this.ptgPointss = this.ptgPoints = data.ptgPoints;
          this.oldData = JSON.stringify(data.ptgPoints);
          this.pointGroup = data.pointGroup;
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
            padding: 20px 60px 20px 20px;
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
                width: 353px;
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
              .content-left {
                width: 70px;
              }
              .content-right {
                width: 353px;
                display: flex;
                align-items: center;
                flex-direction: row;
                .el-icon-folder-add {
                  font-size: 32px;
                }
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
  width: 318px;
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
