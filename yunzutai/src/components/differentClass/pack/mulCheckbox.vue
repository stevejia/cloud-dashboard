<template>
  <div class="comps">
    <div class="title">{{ title }}</div>
    <div class="compps">
      <div
        :class="config.value.indexOf(item) !== -1 ? 'item active' : 'item'"
        @mousedown="changes(item)"
        v-for="item in config.label"
        :key="item"
      >
        {{ item }}
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
    changes(item) {
      let index = this.config.value.indexOf(item);
      if (index !== -1) {
        this.config.value.splice(index, 1);
      } else {
        this.config.value.push(item);
      }
      this.onChange(null, true);
    }
  }
};
</script>
<style lang="less" scoped>
.comps {
  .compps {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    .item {
      line-height: 28px;
      background: #fff;
      color: #282828;
      height: 28px;
      width: 70px;
      box-sizing: border-box;
      text-align: center;
      position: relative;
      cursor: pointer;
      &.active {
        background: #409eff;
        color: white;
      }
      &:first-child {
        border-top-left-radius: 4px;
        border-bottom-left-radius: 4px;
      }
      &:last-child {
        border-top-right-radius: 4px;
        border-bottom-right-radius: 4px;
      }

      &:not(:last-child)::after {
        position: absolute;
        right: 0px;
        top: 2px;
        content: " ";
        width: 1px;
        height: 24px;
        border-left: 1px solid #ccc;
      }
    }
  }
}
</style>
