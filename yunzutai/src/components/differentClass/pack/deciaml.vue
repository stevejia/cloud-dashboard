<template>
  <div class="comps">
    <div class="block">
      <div class="title">进制</div>
      <el-select
        v-model="config.value[0].value"
        placeholder="请选择"
        @change="change(1, true)"
      >
        <el-option
          v-for="item in config.value[0].label"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
    </div>
    <div class="block" v-show="config.value[0].value == 10">
      <div class="title">小数位</div>
      <el-select
        v-model="config.value[1].value"
        placeholder="请选择"
        @change="change(2, true)"
      >
        <el-option
          v-for="item in config.value[1].label"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
    </div>
    <div class="block">
      <div class="title">单位</div>
      <el-input
        v-model="config.value[2]"
        placeholder="请输入内容"
        @input="change(3)"
        @change="change(3)"
        @blur="change(5, true)"
        @keyup.enter.native="change(5, true)"
      ></el-input>
    </div>
    <div class="block">
      <div class="title">缺省值</div>
      <el-input
        v-model="config.value[3]"
        placeholder="请输入内容"
        @input="change(4)"
        @change="change(4)"
        @blur="change(6, true)"
        @keyup.enter.native="change(6, true)"
      ></el-input>
      <div
        style="line-height: 20px;color: #f56c6c;font-size: 12px;"
        v-show="status"
      >
        当前数值不合法!
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: String,
    config: Object,
    onChange: Function
  },
  data() {
    return {
      status: false,
      oval2: this.config.value[2],
      oval3: this.config.value[3]
    };
  },
  methods: {
    checkNum() {
      let dec = this.config.value[1].value;
      let val = this.config.value[3] + "";
      let index =
        val.split(".")[1] === undefined ? 0 : val.split(".")[1].length;
      let bool = !val.startsWith("0") || val.startsWith("0.") || val === "0";
      if (!isNaN(val) && index <= dec && bool && !val.endsWith(".")) {
        this.status = false;
      } else {
        this.status = true;
      }
    },
    change(type, finalChange) {
      switch (type) {
        case 1:
          break;
        case 2:
          this.checkNum();
          break;
        case 3:
          break;
        case 4:
          this.checkNum();
          break;
        case 5:
          if (this.oval2 === this.config.value[2]) {
            finalChange = false;
          }
          this.oval2 = this.config.value[2];
          break;
        case 6:
          if (this.oval3 === this.config.value[3]) {
            finalChange = false;
          }
          this.oval3 = this.config.value[3];
          break;
        default:
          break;
      }
      this.onChange(null, finalChange);
    }
  }
};
</script>
