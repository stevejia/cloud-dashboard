# 云组态单页面打包工具
# 1、文件结构

```
project
│   README.md
│   webpack.pro.js
│
└───src
│   │   index.vue
│   │   ...
│   
└───dist
    │   bundle.js
```

1. webpack.pro.js 打包配置文件
2. src=>index.vue 入口文件，其他依赖文件也一并放在src下
3. dist=>bundle.js 打包后最终生成的文件

# 2、项目安装命令
```
npm install
```
# 3、打包命令
```
npm run build
```