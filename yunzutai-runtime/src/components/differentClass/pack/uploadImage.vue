<template>
  <div class="comps">
    <div class="title">{{ title }}</div>
    <template v-if="title == 'Logo'">
      <span class="warn-tip">
        <i class="el-icon-warning-outline"></i> 宽度不超过 580像素(px)
      </span>
      <span class="warn-tip">
        <i class="el-icon-warning-outline"></i> 高度不超过 320像素(px)
      </span>
    </template>
    <el-upload
      class="img-uploader"
      :action="uploadUrl + 'api/file/uploadfile'"
      accept=".jpg, .jpeg, .png, .gif"
      :show-file-list="false"
      :on-success="imgSuccess"
      :headers="headerMsg"
      :before-upload="beforeImgUpload"
      :on-progress="onProgress"
    >
      <el-progress
        v-show="uploading"
        type="circle"
        :percentage="uploadPercent"
      ></el-progress>
      <img v-if="backgroundImage" :src="backgroundImage" class="img-preview" />
      <i v-else class="el-icon-plus img-uploader-icon"></i>
      <div class="img-del-icon" v-if="backgroundImage">
        <i class="el-icon-delete" @mousedown="delBgImage($event)"></i>
      </div>
    </el-upload>
    <el-select
      v-show="config.value.fash"
      v-model="config.value.fash"
      placeholder="请选择"
      @change="change"
    >
      <el-option label="铺满" value="100% 100%"></el-option>
      <el-option label="居中" value="center center"></el-option>
      <el-option label="适应图片" value="cover"></el-option>
    </el-select>
  </div>
</template>

<script>
export default {
  data() {
    return {
      backgroundImage: this.config.value.imgUrl,
      uploadUrl: window.config.uploadUrl + "/",
      headerMsg: {
        accesstoken: "adcf40f89d4acd38bddb9",
        app: "cloudconfigure"
      },
      img: null,
      width: null,
      height: null,
      uploadPercent: 0,
      uploading: false
    };
  },
  watch: {
    config: {
      handler() {
        this.backgroundImage = this.config.value.imgUrl;
      },
      deep: true
    }
  },
  methods: {
    beforeImgUpload(file) {
      let spl = file.name.split(".");
      this.headerMsg.ext = `.${spl[spl.length - 1]}`;
      this.uploading = true;
    },
    change() {
      if (this.config.value.fash === "cover") {
        let widthHeight = this.$parent.config["尺寸"];
        if (widthHeight) {
          widthHeight.value = [this.width, this.height];
        }
      }

      this.onChange(null, true);
    },
    imgSuccess(res) {
      this.backgroundImage = res.data;
      this.config.value.imgUrl = res.data;
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
    delBgImage() {
      this.backgroundImage = "";
      this.config.value.imgUrl = "";
      this.onChange(null, true);
    },
    onProgress(e) {
      this.uploadPercent = ((e.loaded / e.total) * 100) | 0;
    }
  },
  props: {
    title: String,
    config: Object,
    onChange: Function
  }
};
</script>
<style></style>
<style lang="less" scoped>
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
  font-size: 46px;
  color: hsla(0, 0%, 100%, 0.6);
  width: 150px;
  height: 150px;
  line-height: 150px;
  text-align: center;
}

.comps {
  & /deep/ .el-upload.el-upload--text {
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
      font-size: 20px;
      .el-icon-delete {
        padding: 2px;
        color: #fff;
      }
      &:hover {
        opacity: 1;
      }
    }
  }
  .warn-tip {
    font-size: 13px;
    color: #e6a23c;
    margin-bottom: 6px;
    display: inline-block;
  }
}
</style>
