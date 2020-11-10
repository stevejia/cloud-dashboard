<template>
  <div class="comps">
    <div class="title">{{ title }}</div>
    <el-select
      v-model="config.value[0]"
      placeholder="请选择"
      clearable
      @visible-change="changes"
    >
      <el-option
        v-for="(item, index) in containers"
        :key="index"
        :label="item.label"
        :value="item.value"
      >
        <span style="float: left">{{ item.label }}</span>
        <span @click.stop style="float: right; color: #8492a6; font-size: 13px">
          <el-checkbox
            v-model="item.status"
            @change="onChanges(item.vm, item.status)"
          ></el-checkbox>
        </span>
      </el-option>
    </el-select>
    <el-checkbox v-model="config.value[1]" @change="onChangess"></el-checkbox>
    <span style="margin-left:10px">全部显示</span>
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
      containers: []
    };
  },
  methods: {
    getData() {
      for (let key in this.$drag.containerVms) {
        let arr = this.$drag.containerVms[key];
        let newArr = arr.map(item => {
          return {
            label: item.$refs.comp.baisicConfig["名称"].value,
            value: item.id,
            status: item.$el.style.display === "none" ? false : true,
            vm: item
          };
        });
        this.containers = this.containers.concat(newArr);
        let index = this.containers.findIndex(item => {
          return item.value === this.config.value[0];
        });
        if (index === -1) {
          this.config.value[0] = "";
          this.onChange();
        }
      }
    },
    changes(val) {
      if (val) {
        this.containers = [];
        this.$nextTick(() => {
          this.getData();
        });
      }
    },
    onChangess() {
      let bool = this.config.value[1];
      this.containers.forEach(item => {
        item.vm.$el.style.display = bool ? "" : "none";
      });
      this.onChange(null, true);
      // this.getData(true);
    },
    onChanges(vm, status) {
      vm.$el.style.display = status ? "" : "none";
      this.onChange(null, true);
      // this.getData(true);
    }
  }
};
</script>
