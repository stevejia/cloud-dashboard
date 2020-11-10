<!--弹窗组件-->
<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    :width="width"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="closeDialog"
    :append-to-body="true"
    :class="['Tethys-dialog-style', { 'Theme-black': theme }]"
  >
    <slot name="content"></slot>

    <span slot="footer" class="dialog-footer" v-if="isShowBtn">
      <el-button @click="closeDialog">取 消</el-button>
      <el-button type="primary" @click="defineHandle">提 交</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: "customDialog",
  props: {
    title: {
      type: String,
      default: "提示"
    },
    visible: {
      type: Boolean,
      default: false
    },
    width: {
      width: String,
      default: "30%"
    },
    isShowBtn: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {};
  },

  components: {},

  computed: {
    dialogVisible: {
      get() {
        return this.visible;
      },
      set(val) {
        this.$emit("update:visible", val);
      }
    },
    theme() {
      return this.$store.getters.theme === "black";
    }
  },

  mounted() {},

  methods: {
    //关闭
    closeDialog() {
      this.$emit("update:visible", false);
    },
    //确定执行操作
    defineHandle() {
      this.$emit("submitAction");
    }
  }
};
</script>
<style lang="less" scoped>
.Tethys-dialog-style {
  /deep/.el-dialog__body {
    padding: 20px 20px 5px;
  }
  /deep/.el-dialog {
    border-radius: 6px;
  }
  /deep/.el-dialog__footer {
    padding: 15px 20px;
    /deep/.el-button {
      padding: 9px 20px;
      border-radius: 2px;
    }
    /deep/.el-button--primary {
      background: #237ae4 !important;
      border-color: #237ae4 !important;
    }
  }
  &.Theme-black {
    /deep/.el-dialog {
      background: #1b1d24;
      border-radius: 6px;
      border: 1px solid #373b47;
    }
    /deep/.el-dialog__header {
      border-bottom: 1px solid;
      .el-dialog__title {
        color: #fff;
        font-size: 16px;
      }
      .el-dialog__headerbtn .el-dialog__close {
        color: #fff;
      }
    }

    /deep/.el-dialog__footer {
      border-top: 1px solid #373b47;
      .el-button {
        background: transparent;
        border-color: #30333a;
        color: #fff;
      }
    }
  }
}
</style>
