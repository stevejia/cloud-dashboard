<template>
  <div class="comps">
    <template v-if="!!config.imgType">
      <div class="title">背景图样式</div>
      <el-select
        style="margin-bottom:15px"
        v-model="config.imgType"
        placeholder="请选择"
        @change="change"
      >
        <el-option label="铺满" value="100% 100%"></el-option>
        <el-option label="居中" value="center center"></el-option>
        <el-option label="适应图片" value="cover"></el-option>
      </el-select>
    </template>
    <explain style="margin-bottom:15px" :title="'添加响应'"></explain>
    <el-checkbox v-model="config.sameStatus">统一位号</el-checkbox>
    <div class="bodys" :key="index" v-for="(item, index) in config.value">
      <el-cascader
        popper-class="rightattr-cascader"
        v-model="item.pointId"
        :props="props"
        clearable
      ></el-cascader>
      <el-select
        v-model="item.sourceValue"
        placeholder="请选择"
        @change="onChange(null, true)"
      >
        <el-option
          v-for="item in sourceData"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <div class="row rowend">
        <select v-model="item.oper" @change="onChange(null, true)">
          <option
            v-for="item in operList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></option>
        </select>
        <input v-model="item.value" />
      </div>
      <div v-if="item.sourceValue == 0">
        <p>上传背景图</p>
        <el-upload
          class="img-uploader"
          :action="uploadUrl + 'api/file/uploadfile'"
          accept=".jpg, .jpeg, .png, .gif"
          :show-file-list="false"
          :on-success="
            (response, file, fileList) =>
              imgSuccess(response, file, fileList, item)
          "
          :headers="headerMsg"
          :before-upload="beforeImgUpload"
          :on-progress="onProgress"
        >
          <el-progress
            v-show="uploading"
            type="circle"
            :percentage="uploadPercent"
          ></el-progress>
          <img v-if="item.imgUrl" :src="item.imgUrl" class="img-preview" />
          <i v-else class="el-icon-plus img-uploader-icon"></i>
          <div class="img-del-icon" v-if="item.imgUrl">
            <i class="el-icon-delete" @mousedown="delBgImage(item)"></i>
          </div>
        </el-upload>
      </div>
      <div v-if="item.sourceValue == 1">
        <p>选择背景图</p>
        <div class="img-uploader onlineImg" @click="showOnlineImg(index)">
          <img v-if="item.imgUrl" :src="item.imgUrl" class="img-preview" />
          <i v-else class="el-icon-plus img-uploader-icon"></i>
          <div class="img-del-icon" v-if="item.imgUrl">
            <i class="el-icon-delete" @mousedown="delBgImage(item)"></i>
          </div>
        </div>
      </div>
      <div class="divFlex">
        <div
          @click="adds(index)"
          v-show="index + 1 === config.value.length"
          class="add"
        >
          <i class="iconfont icontianjia"></i>
        </div>
        <div
          @click="deletes(index)"
          v-show="config.value.length !== 1"
          class="delete"
        >
          <i class="btn iconfont iconshanchu"></i>
        </div>
      </div>
    </div>
    <div>
      <!-- 不能删外层div，防止el-dialog的append-to-body 与 上面v-for引起的页面问题 -->
      <el-dialog
        custom-class="dialogs"
        title="图库预览"
        width="50%"
        :visible.sync="imgVisible"
        append-to-body
      >
        <div>
          <div>
            <el-select
              v-model="imgType"
              placeholder="请选择"
              @change="imgTypeChange"
            >
              <el-option
                v-for="(item, index) in mapList"
                :key="index"
                :label="item.name"
                :value="index"
              ></el-option>
            </el-select>
            <el-select v-model="deviceIndex" placeholder="请选择">
              <el-option
                v-for="(item, index) in mapList[imgType].children"
                :key="index"
                :label="item.name"
                :value="index"
              ></el-option>
            </el-select>
          </div>
          <div class="dialog-map">
            <ul class="masonry">
              <li
                v-for="(item, index) in mapList[imgType].children[deviceIndex]
                  .children"
                :key="index"
                class="item"
                :class="{ active: curImgInx === index }"
                @click="selectImg(index)"
              >
                <img :src="item.imUrl" class="img" />
              </li>
            </ul>
          </div>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="confirmImg">确 定</el-button>
          <el-button @click="showOnlineImg">取 消</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import explain from "./explain.vue";
import { sourceOrigin, operateList } from "./common";
import mapList from "../../differentClassJson/map.json";
export default {
  components: {
    explain
  },
  props: {
    title: String,
    config: Object,
    onChange: Function
  },
  data() {
    const nameArr = ["", "照明设备", "环境传感", "电子电器", "符号", "其他"];
    let newMapList = JSON.parse(JSON.stringify(mapList));
    for (let i = 1; i < newMapList.length; i++) {
      let item = newMapList[i];
      newMapList[i].children = [
        { children: item.children, name: nameArr[i], _myIndex: item._myIndex }
      ];
    }
    return {
      props: [],
      operList: operateList,
      sourceData: sourceOrigin,
      uploadUrl: window.config.uploadUrl + "/",
      headerMsg: {
        accesstoken: "adcf40f89d4acd38bddb9",
        app: "cloudconfigure"
      },
      img: null,
      width: null,
      height: null,
      imgVisible: false,
      mapList: newMapList,
      imgType: 0,
      deviceIndex: 0,
      curImgInx: "",
      curSelectInx: 0,
      uploadPercent: 0,
      uploading: false
    };
  },
  methods: {
    adds(index) {
      this.config.value.splice(index + 1, 0, {
        pointId: [],
        sourceValue: 1,
        oper: "",
        value: "",
        imgUrl: ""
      });
    },
    deletes(index) {
      this.config.value.splice(index, 1);
    },
    beforeImgUpload(file) {
      let spl = file.name.split(".");
      this.headerMsg.ext = `.${spl[spl.length - 1]}`;
      this.uploading = true;
    },
    change() {
      if (this.config.imgType === "cover") {
        let widthHeight = this.$parent.$parent.baisicConfig["尺寸"];
        if (widthHeight) {
          widthHeight.value = [this.width, this.height];
        }
      }

      this.onChange(null, true);
    },
    imgSuccess(res, file, fileList, item) {
      item.imgUrl = res.data;
      this.config.currentImage = res.data;
      this.img = new Image();
      this.img.src = res.data;
      this.img.onload = () => {
        this.width = Math.round(this.img.width);
        this.height = Math.round(this.img.height);
        this.onChange(null, true);
      };
      // 上传过快时，兼容页面进度条显示
      setTimeout(() => {
        this.uploading = false;
        this.uploadPercent = 0;
      }, 500);
    },
    delBgImage(item) {
      this.config.currentImage = "";
      item.imgUrl = "";
      this.onChange(null, true);
    },
    onProgress(e) {
      this.uploadPercent = ((e.loaded / e.total) * 100) | 0;
    },
    showOnlineImg(index) {
      this.imgVisible = !this.imgVisible;
      if (this.imgVisible) this.curSelectInx = index;
    },
    imgTypeChange() {
      this.deviceIndex = 0;
    },
    selectImg(index) {
      this.curImgInx = index;
    },
    confirmImg() {
      this.config.currentImage = this.config.value[
        this.curSelectInx
      ].imgUrl = this.mapList[this.imgType].children[this.deviceIndex].children[
        this.curImgInx
      ].imUrl;
      this.imgVisible = false;
      this.onChange(null, true);
    }
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
  }
};
</script>
<style lang="less" scoped>
.row {
  padding-top: 5px;
}
.divFlex {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  &:hover {
    opacity: 0.8;
  }
  .iconshanchu {
    font-size: 24px;
    color: red;
  }
}
.add {
  margin-right: 10px;
  width: 24px;
  height: 24px;
  line-height: 24px;
  text-align: center;
  border-radius: 50%;
  background-color: rgb(255, 255, 255);
  color: #333;
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
.img-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.img-uploader .el-upload:hover {
  border-color: #409eff;
}

.img-uploader .el-progress {
  position: absolute;
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.5);
  /deep/.el-progress__text {
    color: rgb(229, 233, 242);
  }
}

.img-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 150px;
  height: 150px;
  line-height: 150px;
  text-align: center;
}

.comps {
  .onlineImg,
  /deep/ .el-upload.el-upload--text {
    border: 1px solid hsla(0, 0%, 100%, 0.6);
    background: hsla(0, 0%, 100%, 0.2);
    border-radius: 4px;
    cursor: pointer;
    overflow: hidden;
    text-align: center;
    position: relative;
    width: 150px;
    height: 150px;
    box-sizing: content-box;
    display: flex;
    justify-content: center;
    align-items: center;
    &:hover {
      border-color: #409eff;
    }
    .img-preview {
      box-sizing: content-box;
      max-width: 100%;
      max-height: 100%;
    }
    .img-del-icon {
      position: absolute;
      top: 0px;
      left: 0px;
      right: 0px;
      bottom: 0px;
      display: flex;
      justify-content: center;
      align-items: center;
      opacity: 0;
      background-color: rgba(0, 0, 0, 0.5);
      .el-icon-delete {
        padding: 2px;
        color: #fff;
        height: 24px;
        width: 24px;
      }
      &:hover {
        opacity: 1;
      }
    }
  }
}

.el-dialog__wrapper {
  /deep/.dialogs {
    background-color: #373e4a;
    .el-dialog__header {
      padding-bottom: 10px;
      border-bottom: 1px solid hsla(0, 0%, 100%, 0.1);
      font-weight: 700;
      .el-dialog__title {
        color: #fff;
      }
    }
    .dialog-map {
      width: 100%;
      max-height: 360px;
      overflow-y: auto;
      margin-top: 10px;
      .masonry {
        column-count: 5;
        column-gap: 10px;
        margin: 10px auto;
        .item {
          width: 82px;
          padding: 2px;
          margin-bottom: 16px;
          page-break-inside: avoid;
          break-inside: avoid;
          border: 1px solid hsla(0, 0%, 100%, 0.4);
          cursor: move;
          text-align: center;
          &:hover {
            border: 1px solid #1d87e5;
          }
          &.active {
            border: 2px solid #1d87e5;
          }
        }
        .img {
          vertical-align: top;
          max-width: 100%;
        }
      }
    }
    .el-select {
      margin-right: 10px;
      width: auto;
    }
  }
}
</style>
