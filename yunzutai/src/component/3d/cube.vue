<template>
<div class="cube-3d">
    <div id="canvas-frame"></div>
</div>
</template>

<script>
import ChintThree from "@/util/threejs/three.js";
export default {
    data() {
        return {
            baisicConfig: {
                尺寸: {
                    type: "widthHeight",
                    label: ["宽度", "高度"],
                    value: [0, 0]
                },
                位置: {
                    type: "widthHeight",
                    label: ["横轴", "纵轴"],
                    value: [0, 0]
                },
                旋转角度: {
                    type: "slider",
                    status: 1,
                    range: [0, 360],
                    value: 0
                },
                相机: {
                    type: "position3D",
                    labels: ["X", "Y", "Z"],
                    values: [0, 300, 1000]
                },
                目标: {
                    type: "position3D",
                    labels: ["X", "Y", "Z"],
                    values: [0, 0, 0]
                }
            }
        };
    },
    mounted() {
        let element = this.$el.querySelector("#canvas-frame");
        this.three = new ChintThree(element);
    },
    methods: {
        resetComp(bool) {
            if (!bool) {
                // this.three.render3D();

                let element = this.$el.querySelector("#canvas-frame");
                this.three.init(element);
            }
        },
        initStyle() {
            // this.three.render3D();

            let element = this.$el.querySelector("#canvas-frame");
            this.three.init(element);
        }
    }
};
</script>

<style lang="less">
.cube-3d {
    width: 100%;
    height: 100%;

    #canvas-frame {
        width: 100%;
        height: 100%;
    }
}
</style>
