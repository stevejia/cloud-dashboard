<template>
  <div class="addDel-ul">
    <div class="addDel-li" v-for="(item, index) in list" :key="index">
      <slot name="default" :item="item" :index="index + 1"></slot>
      <div class="divFlex">
        <div class="add" @click="adds()" v-show="index + 1 === list.length">
          +
        </div>
        <div class="del" @click="deletes(index)" v-show="list.length !== 1">
          -
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    list: Array,
    defaultConfig: Object
  },
  methods: {
    adds() {
      this.list.push(JSON.parse(JSON.stringify(this.defaultConfig)));
    },
    deletes(index) {
      this.list.splice(index, 1);
    }
  }
};
</script>

<style lang="less" scoped>
.addDel-ul {
  .addDel-li {
    .divFlex {
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
      align-items: center;
    }
    .add,
    .del {
      width: 40px;
      font-size: 40px;
      text-align: center;
    }
  }
}
</style>
