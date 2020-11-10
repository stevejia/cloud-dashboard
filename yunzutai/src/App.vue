<template>
<div id="app">
    <router-view />
</div>
</template>

<script>
export default {
    created() {
        prompt("请输入X,Y");
    }
}
</script>

<style lang="less">
.iconfont {
    cursor: pointer;
    font-family: "chint" !important;
    font-size: 16px;
    font-style: normal;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    height: 100%;
    width: 100%;
}

#nav {
    padding: 30px;

    a {
        font-weight: bold;
        color: #2c3e50;

        &.router-link-exact-active {
            color: #42b983;
        }
    }
}

.el-select,
.el-cascader {
    width: 100%;
}
</style>
