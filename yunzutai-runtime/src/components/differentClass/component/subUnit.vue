<template>
  <ul class="rightattribute-list clearfix">
    <li
      v-for="item in list"
      :key="item.type"
      :data-config="JSON.stringify(item)"
      :class="[currentItem.type === item.type ? 'active imgDiv' : 'imgDiv']"
    >
      <svg
        :class="'icon-ali imgDiv' + item.imUrl"
        aria-hidden="true"
        version="1.1"
        preserveAspectRatio="xMinYMin meet"
      >
        <use :xlink:href="`#${item.imUrl}`"></use>
      </svg>

      <div style="margin-top:10px">
        {{ item.name }}
      </div>
      <div
        class="markView"
        @mousedown="selectSymbol(item)"
        :title="item.name"
      ></div>
    </li>
  </ul>
</template>
<script>
export default {
  props: {
    list: {
      type: Array
    },
    currentItem: Object
  },
  methods: {
    selectSymbol(item) {
      this.$parent.selectSymbol(item);
    }
  }
};
</script>
<style lang="less" scoped>
.rightattribute-list {
  padding: 10px 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  position: relative;
}
.clearfix {
  zoom: 1;
}
.imgDiv {
  position: relative;
  width: 105px;
  height: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: move;
  box-sizing: border-box;
  margin: 8px 0 0 0;
  box-sizing: border-box;
  border: 1px solid transparent;
  overflow: hidden;
  &.active {
    border: 1px solid white;
  }
  .iconfont {
    cursor: move;
    font-size: 46px;
  }
  .icon-ali {
    width: 46px;
    height: 46px;
    fill: currentColor;
    overflow: hidden;
    display: block;
    margin-top: 10px;
  }
}
</style>
