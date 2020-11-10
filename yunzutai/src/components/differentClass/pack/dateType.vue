<template>
  <div class="comps">
    <div class="dateTitle" size="small">{{ config.name || "日期类型" }}</div>
    <div style="margin-top: 5px;">
      <el-checkbox-group v-model="checkList" :min="2" @change="onCheckChange">
        <el-row>
          <el-col :span="8" v-for="(item, index) in config.label" :key="index">
            <el-checkbox :label="item"></el-checkbox>
          </el-col>
        </el-row>
      </el-checkbox-group>
    </div>
  </div>
</template>

<script>
// dateType组件config数据结构如下
// {
//   type: "dateType",
//   values: [true, true, false, true, false, false],
//   value: data[prop],
//   label: ["小时", "日", "周", "月", "季度", "年"]
// };
export default {
  props: {
    title: String,
    config: Object,
    onChange: Function
  },
  data() {
    return {
      checkList: []
    };
  },
  mounted() {
    let ins = this;
    this.checkList = this.config.label.filter(function(label, index) {
      if (label) {
        let isChecked = ins.config.values[index];
        return isChecked;
      }
    });
  },
  methods: {
    onCheckChange(newList) {
      let newDateTypes = this.config.label.map(label => {
        return newList.indexOf(label) > -1;
      });
      this.config.values = newDateTypes;
      this.onChange(newList, true);
    }
  }
};
</script>
<style lang="less" scoped>
.dateTitle {
  width: 100%;
  height: 28px;
  line-height: 28px;
  background: #1d87e5;
  border-radius: 2px;
  text-align: center;
}
</style>
