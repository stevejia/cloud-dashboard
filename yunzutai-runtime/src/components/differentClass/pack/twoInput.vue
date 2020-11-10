<template>
  <div class="comps">
    <div class="title" v-if="config.title">
      {{ config.title }}
    </div>
    <div class="body">
      <span>
        {{ config.label[0] }}
        <input
          type="number"
          v-model.number="config.value[0]"
          @change="change"
          @input="onChange(title)"
        /> </span
      >&nbsp;&nbsp;&nbsp;
      <span>
        {{ config.label[1] }}
        <input
          type="number"
          v-model.number="config.value[1]"
          @change="change"
          @input="onChange(title)"
        />
      </span>
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
    change() {
      this.onChange(this.title, true);
    }
  }
};
</script>
<style lang="less" scoped>
.body {
  display: flex;
  justify-content: space-between;
}
input {
  outline: none;
  width: 68px;
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
</style>
