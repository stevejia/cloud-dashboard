<template>
  <div class="position3D">
    <div class="title">{{ title }}</div>
    <div class="content">
      <div
        class="input-item"
        v-for="(item, index) in config.labels"
        :key="index"
      >
        {{ item }}
        <input
          type="number"
          v-model.number="config.values[index]"
          @change="onChange"
          @input="onChange"
          @blur="onFinalChange(index)"
          @keyup.enter="onFinalChange(index)"
        />
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
  methods: {
    onFinalChange(index) {
      console.log(index);
      //   //检测value 0是否有变化
      //   if (type === 0) {
      //     let nValue0 = this.config.value[0];
      //     if (this.oValue0 !== nValue0) {
      //       this.onChange(null, true);
      //     }
      //     this.oValue0 = nValue0;
      //   } else if (type === 1) {
      //     //检测value 1是否变化
      //     let nValue1 = this.config.value[1];
      //     if (this.oValue1 !== nValue1) {
      //       this.onChange(null, true);
      //     }
      //     this.oValue1 = nValue1;
      //   }
    }
  }
};
</script>
<style lang="less" scoped>
.content {
  display: flex;
  justify-content: space-between;
  .input-item {
    width: 30%;
    display: flex;
    justify-content: center;
    align-items: center;
    input {
      width: 50px;
    }
  }
}
</style>
