<template>
  <div class="comps">
    <div class="title">{{ title }}</div>
    <div class="row">
      <div class="rowDiv">
        <input
          v-model="config.value[0]"
          @blur="onChange(null, true)"
          @keyup.enter="onChange(null, true)"
        />
        <!-- <span>%</span> -->
      </div>
      <div class="rowDivLine">-</div>
      <div class="rowDiv">
        <input
          v-model="config.value[1]"
          @blur="onChange(null, true)"
          @keyup.enter="onChange(null, true)"
        />
        <!-- <span>%</span> -->
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
      props: []
    };
  }
};
</script>
<style lang="less" scoped>
.row {
  width: calc(100%);
  .rowDiv {
    width: calc(40%);
    input {
      width: 70px;
      outline: none;
      font-family: microsoft yahei;
      font-size: 14px;
      text-align: left;
      padding-left: 10px;
      box-sizing: border-box;
      height: 30px;
      color: #282828;
      background-color: #fff;
      border: 1px solid #282828;
    }
  }
  .rowDivLine {
    text-align: center;
    align-self: center;
    font-size: 20px;
    font-weight: bold;
    width: calc(20%);
  }
}
</style>
