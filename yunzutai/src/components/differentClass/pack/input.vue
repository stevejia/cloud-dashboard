<template>
  <div>
    <div class="title">{{ title }}</div>
    <el-input
      v-model="config.value"
      placeholder="请输入"
      @input="onChange"
      @change="onChange"
      :type="inputType"
      @blur="onFinalChange"
      @keyup.enter="onFinalChange"
    ></el-input>
  </div>
</template>
<script>
export default {
  data() {
    return {
      inputType: "text",
      oValue: null
    };
  },
  props: {
    title: String,
    config: Object,
    onChange: Function
  },

  created() {
    this.inputType = this.config.inputType ? this.config.inputType : "text";
  },
  mounted() {
    if (this.config) {
      this.oValue = this.config.value;
    }
  },
  methods: {
    onFinalChange() {
      console.log("finalChange");
      let nValue = this.config.value;
      if (nValue !== this.oValue) {
        console.log("changed");
        this.onChange(null, true);
      }
    }
  }
};
</script>
