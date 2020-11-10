<template>
  <div class="comps">
    <div class="title">
      <el-checkbox
        v-model="config.value[2]"
        @change="onChange(null, true)"
      ></el-checkbox>
      <span>{{ title }}</span>
    </div>
    <div class="title">高度占比</div>
    <el-slider
      v-model="config.num"
      :min="0"
      :max="100"
      @change="onChange(null, true)"
      @input="onChange"
      show-input
    ></el-slider>
    <div class="bodys" v-show="!config.value.hidden">
      <el-checkbox v-model="config.value[1]" @change="changege"></el-checkbox>
      <span style="margin-left:10px;">启动自定义Logo</span>
      <el-upload
        v-show="config.value[1]"
        class="img-uploader"
        :action="uploadUrl + 'api/file/uploadfile'"
        :show-file-list="false"
        :on-success="
          (response, file, fileList) => imgSuccess(response, file, fileList)
        "
        :headers="headerMsg"
        :before-upload="beforeImgUpload"
      >
        <img v-if="dialogImageUrl" :src="dialogImageUrl" class="img-preview" />
        <i v-else class="el-icon-plus img-uploader-icon"></i>
        <div class="img-del-icon" v-if="dialogImageUrl">
          <i class="el-icon-delete" @mousedown="delBgImage"></i>
        </div>
      </el-upload>
    </div>
  </div>
</template>

<script>
import logoBlack from "@/assets/image/chnt-b.svg";
import logoWhite from "@/assets/image/chnt-w.svg";
export default {
  props: {
    title: String,
    config: Object,
    onChange: Function
  },
  data() {
    return {
      dialogImageUrl: "",
      uploadUrl: window.config.uploadUrl + "/",
      headerMsg: {
        accesstoken: "adcf40f89d4acd38bddb9",
        app: "cloudconfigure"
      },
      img: null,
      width: null,
      height: null
    };
  },
  created() {
    this.dialogImageUrl =
      this.config.value[0] ||
      (this.$store.getters.theme === "black" ? logoBlack : logoWhite);
  },
  methods: {
    changege() {
      if (!this.config.value[1]) {
        this.dialogImageUrl =
          this.$store.getters.theme === "black" ? logoBlack : logoWhite;
        this.config.value[0] = this.dialogImageUrl;
        this.onChange(null, true);
      }
      this.onChange(null, true);
    },
    beforeImgUpload(file) {
      let spl = file.name.split(".");
      this.headerMsg.ext = `.${spl[spl.length - 1]}`;
    },
    imgSuccess(res) {
      this.dialogImageUrl = res.data;
      this.config.value[0] = res.data;
      this.img = new Image();
      this.img.src = res.data;
      this.img.onload = () => {
        this.width = Math.round(this.img.width);
        this.height = Math.round(this.img.height);
        this.onChange();
      };
    },
    delBgImage() {
      this.config.value[0] = "";
      this.dialogImageUrl = "";
      this.onChange();
    }
  }
};
</script>
<style lang="less" scoped>
.bodys {
  flex-direction: column;
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

.img-uploader-icon {
  font-size: 28px;
  color: #8c939d;
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
      .el-icon-delete {
        padding: 2px;
        color: #fff;
        font-size: 24px;
      }
      &:hover {
        opacity: 1;
      }
    }
  }
}
</style>
