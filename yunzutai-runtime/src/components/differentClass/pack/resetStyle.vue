<template>
  <div class="comps">
    <el-button type="primary" size="small" @click="onChanges">
      {{ title }}
    </el-button>
  </div>
</template>

<script>
import { getComp } from "@/util/common.js";
export default {
  props: {
    title: String,
    config: Object,
    onChange: Function
  },
  methods: {
    onChanges() {
      if (this.$drag.vms) {
        let comp = getComp(this.$drag.vms.type).data();
        this.$parent.$parent.bool = false;
        this.$parent.$parent.baisicConfig = null;
        this.$drag.vms.$refs.comp.resetStyle(comp);
        this.$drag.layout.$refs.righters.currentVm = null;
        this.$drag.showMenu(this.$drag.vms);
        this.$nextTick(() => {
          this.$parent.$parent.bool = true;
        });
      }
      this.onChange("resetStyle", true);
    }
  }
};
</script>
