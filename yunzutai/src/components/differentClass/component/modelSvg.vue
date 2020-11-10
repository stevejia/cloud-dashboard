<template>
  <ul class="masonry">
    <li
      v-for="item in list"
      :key="item.type"
      :title="item.name"
      @mousedown="selectSymbol(item)"
      :data-config="JSON.stringify(item)"
      :class="[currentItem.type === item.type ? 'active imgDiv' : 'imgDiv']"
    >
      <img :src="item.imUrl" alt="" @mousedown.prevent="" />
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
.masonry {
  -webkit-column-count: 2;
  column-count: 2;
  -moz-column-gap: 10px;
  -webkit-column-gap: 10px;
  column-gap: 10px;
  margin: 10px auto;
}

.imgDiv {
  width: 82px;
  padding: 10px;
  margin-bottom: 5px;
  -moz-page-break-inside: avoid;
  -webkit-column-break-inside: avoid;
  page-break-inside: avoid;
  break-inside: avoid;
  border: 1px solid transparent;
  text-align: center;
  cursor: move;
  &.active {
    border: 1px solid white;
  }
  img {
    vertical-align: top;
    max-width: 100%;
  }
}
</style>
