<template>
  <div class="comps">
    <div v-for="(item, index) in config.list" :key="index">
      <div>
        <p class="titles" style="margin-top:0">
          散点名称
        </p>
        <input
          :disabled="disabled"
          type="text"
          placeholder="请输入散点名称"
          v-model.number="item.name"
          @change="onChange"
          @blur="onFinalChange(0)"
          @keyup.enter="onFinalChange(0)"
          style="text-align: left;"
        />
      </div>
      <div>
        <p class="titles">
          散点描述
        </p>
        <input
          :disabled="disabled"
          type="text"
          placeholder="请输入散点描述"
          v-model.number="item.subDistricts"
          @change="onChange"
          @blur="onFinalChange(0)"
          @keyup.enter="onFinalChange(0)"
          style="text-align: left;"
        />
      </div>

      <div>
        <p class="titles">
          散点坐标(经度，纬度)
        </p>
        <div class="body">
          <span>
            <input
              :disabled="disabled"
              type="number"
              v-model.number="item.center[0]"
              @change="onChange"
              @blur="onFinalChange(0)"
              @keyup.enter="onFinalChange(0)"
            />
          </span>
          <span>
            <input
              :disabled="disabled"
              type="number"
              v-model.number="item.center[1]"
              @change="onChange"
              @blur="onFinalChange(1)"
              @keyup.enter="onFinalChange(1)"
            />
          </span>
        </div>
      </div>
      <div style="margin:10px 0">
        <div class="btn-wrapper" v-if="item.status != 1">
          <span
            class="btn btn-add"
            v-if="
              index === config.list.length - 1 && index < config.limtLength - 1
            "
            @click="addDate(index)"
          >
            <i class="iconfont icontianjia"></i>
          </span>
          <span
            class="btn iconfont iconshanchu"
            v-if="config.list.length > 1"
            @click="delData(index, item)"
          ></span>
        </div>
        <packLine></packLine>
      </div>
    </div>
  </div>
</template>

<script>
import packLine from "./line.vue";
export default {
  props: {
    title: String,
    config: Object,
    onChange: Function
  },
  components: {
    packLine
  },
  data() {
    return {
      disabled: false,
      oValue0: null,
      oValue1: null
    };
  },
  mounted() {},
  // watch: {
  //   "config.value"(newVal) {
  //     console.log(newVal);
  //   }
  // },
  methods: {
    addDate() {
      console.log("开发中");
    },
    delData() {
      console.log("开发中");
    },
    onFinalChange(type) {
      //检测value 0是否有变化
      if (type === 0) {
        let nValue0 = this.config.value[0];
        if (this.oValue0 !== nValue0) {
          this.onChange(null, true);
        }
        this.oValue0 = nValue0;
      } else if (type === 1) {
        //检测value 1是否变化
        let nValue1 = this.config.value[1];
        if (this.oValue1 !== nValue1) {
          this.onChange(null, true);
        }
        this.oValue1 = nValue1;
      }
    }
  }
};
</script>
<style lang="less" scoped>
.body {
  display: flex;
  justify-content: space-between;
}
.footer {
  margin-top: 10px;
  display: flex;
  justify-content: space-around;
}
input {
  outline: none;
  width: 100%;
  color: #282828;
  border: 1px solid #cccccc;
  background-color: #fff;
  border-radius: 4px;
  border: 1px solid rgba(40, 40, 40, 1);
  font-family: microsoft yahei;
  font-size: 14px;
  text-align: center;
  box-sizing: border-box;
  height: 30px;
}
.techsel-checkbox__wrapper {
  display: flex;
  align-items: center;
  width: 100%;
  height: 30px;
  margin-bottom: 10px;
}
.margin__right {
  margin-left: 10px;
}
.margin__left {
  margin-right: 10px;
}
.techsel-checkbox__checked {
  transform: scaleY(1) !important;
}
.btn-wrapper {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  .btn {
    margin-left: 20px;
    font-size: 24px;
    &:hover {
      opacity: 0.8;
    }
    &.iconshanchu {
      color: red;
    }
    &.btn-add {
      height: 24px;
      width: 24px;
      line-height: 20px;
      text-align: center;
      border-radius: 50%;
      background-color: rgb(255, 255, 255);
    }
    .icontianjia {
      color: #333;
    }
  }
}
</style>
