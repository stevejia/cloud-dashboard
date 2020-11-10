<template>
  <div class="compDialog">
    <el-dialog
      :visible.sync="dialogVisible"
      title="编辑场景"
      width="1058px"
      :close-on-click-modal="false"
      :before-close="cancel"
    >
      <div class="body">
        <div class="title"></div>
        <div class="content">
          <div class="content-title">
            <div class="title1">组合选择：</div>
            <div class="title2">
              <el-select
                class="selectClass"
                v-model="scenesPointId"
                @change="scenesSelect"
                placeholder="请选择组合"
              >
                <el-option
                  v-for="item in ptgPoints"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
              <i
                title="全选组合"
                @click="scenesSelectAll"
                class="el-icon-folder-add"
              ></i>
            </div>
            <div class="title3">场景名称：</div>
            <div class="title4">
              <input
                class="labelInputs labelInput"
                placeholder="请输入内容"
                v-model="sceneConfig.customSceneName"
                type="text"
              />
            </div>
          </div>
          <div class="content-ul">
            <div class="content-div">
              <ul class="ul-content" v-if="sceneConfig.ptgPonitsList.length">
                <li
                  v-for="(item, index) in sceneConfig.ptgPonitsList"
                  :key="index"
                >
                  <div class="liBody">
                    <div class="label">{{ getPtgName(item.id) }}</div>
                    <input
                      class="labelInput"
                      placeholder="请输入数值"
                      v-model="item.value"
                    />
                    <div class="icon" @mousedown="deletePtgPoint(index)">
                      <span class="el-icon-close"></span>
                    </div>
                  </div>
                </li>
              </ul>
              <div class="no-data" v-else>暂无数据</div>
            </div>
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
export default {
  data() {
    return {
      pointId: null, //组件选中点位组id
      compId: null, //组件
      scenesPointId: null, //点位选择id
      pointGroup: [], //点位组列表
      sceneList: [], //场景列表
      sceneConfig: { ptgPonitsList: [], customSceneName: "" },
      ptgPoints: [], //组合列表
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
    getPtgName(id) {
      let item = this.ptgPoints.find(_item => {
        return _item.id === id;
      });
      if (item) {
        return item.name;
      }
      return id;
    },
    //删除场景列表
    deletePtgPoint(index) {
      this.$confirm("此操作将删除该组合，是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        closeOnClickModal: false
      })
        .then(() => {
          if (this.sceneConfig.ptgPonitsList[index].id === this.scenesPointId) {
            this.scenesPointId = "";
          }
          this.sceneConfig.ptgPonitsList.splice(index, 1);
        })
        .catch(() => {});
    },
    //点位选择
    scenesSelect() {
      let index = this.sceneConfig.ptgPonitsList.findIndex(item => {
        return item.id === this.scenesPointId;
      });
      if (index === -1) {
        this.sceneConfig.ptgPonitsList.push({
          id: this.scenesPointId,
          value: ""
        });
      }
    },
    //点位全选
    scenesSelectAll() {
      this.$prompt("", "全选组合", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPlaceholder: "请输入批量设置值",
        closeOnClickModal: false
      })
        .then(({ value }) => {
          for (var i = 0; i < this.ptgPoints.length; i++) {
            let val = this.ptgPoints[i];
            let index = this.sceneConfig.ptgPonitsList.findIndex(item => {
              return item.id === val.id;
            });
            if (index === -1) {
              this.sceneConfig.ptgPonitsList.push({
                id: val.id,
                value: value
              });
            }
          }
          this.$message({
            type: "success",
            message: "添加成功!"
          });
        })
        .catch(() => {});
    },
    cancel() {
      if (this.oldData !== JSON.stringify(this.sceneConfig)) {
        this.$confirm("数据尚未保存,是否退出?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          closeOnClickModal: false
        })
          .then(() => {
            this.scenesPointId = "";
            this.dialogVisible = false;
          })
          .catch(() => {});
      } else {
        this.scenesPointId = "";
        this.dialogVisible = false;
      }
    },
    sure() {
      for (var i = 0; i < this.sceneConfig.ptgPonitsList.length; i++) {
        let val = this.sceneConfig.ptgPonitsList[i];
        if (val.value === "") {
          this.$message({
            type: "warning",
            message: this.getPtgName(val.id) + "未输入数值!"
          });
          return;
        }
      }
      let bool = true;
      this.sceneList = this.sceneList.map(item => {
        if (item.id === this.sceneConfig.id) {
          bool = false;
          return this.sceneConfig;
        }
        return item;
      });
      if (bool) {
        this.sceneList.push(this.sceneConfig);
      }
      setPointsData({
        ...this.$store.state.pointGroup,
        sceneList: this.sceneList
      }).then(() => {
        this.$drag.operComp.$refs.comp.rename(this.sceneConfig.customSceneName);
        // if (this.sceneConfig.customSceneName !== "") {
        //   this.$drag.operComp.$refs.comp.baisicConfig[
        //     "名称"
        //   ].value = this.sceneConfig.customSceneName;
        // }

        this.scenesPointId = "";
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
        this.sceneConfig = this.sceneList.find(item => {
          return item.id === "scenes_" + this.compId;
        }) || {
          customSceneName: "",
          id: "scenes_" + this.compId,
          name: "场景",
          ptgPonitsList: []
        };
        this.oldData = JSON.stringify(this.sceneConfig);
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
          this.pointGroup = data.pointGroup;
          this.ptgPoints = data.ptgPoints; //组合列表
          this.sceneList = data.sceneList;
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
        height: 350px;
        border: 1px solid #556174;
        background-color: #373e4a;
        .title {
          width: calc(100%);
          border-bottom: 1px solid #556174;
          background-color: #556174;
          height: 34px;
          box-sizing: border-box;
        }
        .content {
          height: calc(100% - 34px);
          padding: 20px 35px;
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
              width: calc(100% - 80px);
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
            .title1,
            .title3 {
              width: 70px;
              padding-right: 10px;
            }
            .title4 {
              .labelInputs {
                background: transparent;
                width: 305px;
              }
            }
            .title2 {
              flex: 1;
              display: flex;
              align-items: center;
              flex-direction: row;
              .el-icon-folder-add {
                cursor: pointer;
                font-size: 24px;
                padding-left: 5px;
              }
            }
          }
        }
        .no-data {
          height: calc(100%);
          width: calc(100%);
          display: flex;
          justify-content: center;
          align-items: center;
          color: #8c96a5;
          font-size: 16px;
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
.selectClass {
  width: 220px;
}
.selectClass /deep/ .el-input__inner {
  background-color: #353c48;
  border-color: #556174;
  color: #fff;
  width: 220px;
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
</style>
