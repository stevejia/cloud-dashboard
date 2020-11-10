<template>
  <div
    :class="[
      theme === 'white' ? 'Theme-white' : 'Theme-black',
      'Tethys-user-manage-style'
    ]"
  >
    <el-tabs
      v-model="activeName"
      type="card"
      @tab-click="handleClick"
      class="Tethys-tab-style"
    >
      <el-tab-pane
        v-for="tab in tabs"
        :key="tab.id"
        :label="tab.name"
        :name="tab.id"
      ></el-tab-pane>
    </el-tabs>
    <component
      :is="activeName"
      :curPage="activeName"
      :subId="subId"
      ref="workOrders"
    ></component>
  </div>
</template>

<script>
import roleManage from "./Role.vue";
import userManage from "./User.vue";
export default {
  data() {
    return {
      tabs: [
        {
          name: "角色管理",
          id: "roleManage"
        },
        {
          name: "用户管理",
          id: "userManage"
        }
      ],
      subId: window.sessionStorage.getItem("SubProjectId"),
      activeName: "roleManage"
    };
  },

  components: {
    roleManage,
    userManage
  },

  computed: {
    theme() {
      return this.$store.getters.theme;
    }
  },

  mounted() {},

  methods: {
    handleClick(tab) {
      this.activeName = tab.name;
    }
  }
};
</script>
<style lang="less">
.add-role-btn-style {
  background: #237ae4;
  border-radius: 2px;
  border: none;
  color: #fff;
  margin-top: 20px;
  padding: 9px 11px;
  /deep/ span.el-icon-plus {
    font-size: 12px;
    padding-right: 6px;
  }
  &:hover,
  &:focus {
    background: #237ae4;
    color: #fff;
  }
}
.Tethys-userManage-style-form {
  /deep/.el-form-item {
    /deep/.el-input__inner,
    /deep/.el-textarea__inner {
      border-radius: 2px;
    }
    /deep/.el-textarea .el-input__count {
      background: transparent;
    }
    /deep/input::-webkit-input-placeholder,
    /deep/textarea::-webkit-input-placeholder {
      font-size: 12px;
      font-family: "Mirosoft YaHei";
      color: #f7f9ff !important;
    }
  }
}
.Theme-black {
  .Tethys-userManage-style-form {
    /deep/.el-form-item {
      /deep/.el-input__inner,
      /deep/.el-textarea__inner {
        background: #121212;
        border: 1px solid #30333a;
        color: #dfe8ff;
      }
      /deep/.el-textarea.el-input__count {
        background: transparent;
      }
      /deep/.el-input.is-disabled .el-input__inner {
        background: #30333a;
      }
      /deep/.el-radio__label,
      /deep/.el-checbox__label {
        color: #abb4c3;
      }
      /deep/input::-webkit-input-placeholder,
      /deep/textarea::-webkit-input-placeholder {
        color: #f7f9ff;
      }
    }
    /deep/.el-form-item__label {
      color: #abb4c3;
    }
  }
}
.black-theme-select-style {
  background: #1b1d24;
  border: 1px solid #30333a;
  .selected {
    background: #237ae4 !important;
    color: #fff !important;
  }
  .selected:hover {
    background: #237ae4 !important;
    color: #fff !important;
  }
  li {
    background: #1b1d24 !important;
    color: #dfe8ff;
  }
  .popper__arrow {
    border-bottom-color: #5c6586 !important;
  }
  .popper__arrow::after {
    border-bottom-color: #343842 !important;
  }
  .el-select-dropdown_item.hover,
  .el-select-dropdown__item:hover {
    background: rgba(27, 33, 50, 0.7);
  }
  .el-select .el-input {
    background: #343842 !important;
    border: 1px solid #5c6586;
    color: #dfe8ff;
  }
  .el-popper[x-placement^="top"] .popper__arrow::after {
    border-top-color: #343842 !important;
  }
}
</style>
<style lang="less" scoped>
.Tethys-user-manage-style {
  width: 99%;
  margin: 10px auto 0;

  &.Theme-black {
    .Tethys-tab-style {
      &.el-tabs--card {
        /deep/.el-tabs__header {
          border-bottom: 1px solid #5c6586;
          .el-tabs__nav {
            border: none;
          }
        }
        /deep/.el-tabs__header .el-tabs__item {
          background: rgba(0, 0, 0, 0.15);
          border-radius: 6px 6px 0px 0px;
          margin-right: 5px;
          color: #d8e1f8;
          border-left: none;
          &.is-active {
            background: #2e3036 !important;
            border-bottom-color: #5c6586;
            border-width: 1px 1px 0 1px;
            border-style: solid;
            border-color: rgba(92, 101, 134, 1);
            height: 41px;
          }
        }
      }
    }
  }
  &.Theme-white {
    background: #fff;
    padding: 15px;
    box-sizing: border-box;
  }
}
</style>
