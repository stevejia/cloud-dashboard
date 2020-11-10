<template>
  <div>
    <div class="title">{{ title }}</div>
    <el-select
      class="page_select"
      v-model="config.timeType"
      placeholder="请选择"
      @change="onChange(title, true)"
      clearable
      :popper-append-to-body="false"
    >
      <el-option
        v-for="item in labels"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      >
      </el-option>
    </el-select>
    <div v-show="config.timeType != 'r'">
      <div class="title">数据类型</div>
      <el-select
        :disabled="config.currentItem === ''"
        v-model="config.statisticsType"
        placeholder="请选择"
        @change="onChange(null, true)"
        clearable
      >
        <el-option
          v-for="item in dataType"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
    </div>
  </div>
</template>
<script>
import { dataType2 } from "./common";
export default {
  props: {
    title: String,
    config: Object,
    onChange: Function
  },
  data() {
    return {
      labels: [
        {
          label: "实时",
          value: "r"
        },
        {
          label: "当日",
          value: "cd"
        },
        {
          label: "本周",
          value: "cw"
        },
        {
          label: "当月",
          value: "cM"
        },
        {
          label: "当季",
          value: "cq"
        },
        {
          label: "当年",
          value: "cy"
        },
        {
          label: "上时",
          value: "lh"
        },
        {
          label: "上日",
          value: "ld"
        },
        {
          label: "上周",
          value: "lw"
        },
        {
          label: "上月",
          value: "lM"
        },
        {
          label: "上季",
          value: "lq"
        },
        {
          label: "上年",
          value: "ly"
        }
      ],
      dataType: dataType2
    };
  }
};
</script>
<style lang="less" scoped>
.page_select {
  width: 100%;
}
</style>
