<template>
  <div
    class="contextmenu"
    @contextmenu.prevent.stop
    :style="styles"
    v-show="showMenu"
  >
    <ul class="menuUl">
      <li class="bottomLine" v-show="showMenu.indexOf(',4,') !== -1">
        <div class="iconBlock" @click.stop="otherOper">
          <div title="水平左对齐" class="block h-left" data-content="1">
            <i class="iconfont iconzuoduiqi h-left" data-content="1"></i>
          </div>
          <div title="水平居中对齐" class="block h-center" data-content="2">
            <i class="iconfont iconjuzhongduiqi h-center" data-content="2"></i>
          </div>
          <div title="水平右对齐" class="block h-right" data-content="3">
            <i class="iconfont iconyouduiqi h-right" data-content="3"></i>
          </div>
          <div title="垂直顶对齐" class="block v-top" data-content="4">
            <i class="iconfont icondingduiqi v-top" data-content="4"></i>
          </div>
          <div title="垂直底对齐" class="block v-bottom" data-content="5">
            <i class="iconfont icondibuduiqi v-bottom" data-content="5"></i>
          </div>
          <div title="垂直居中" class="block v-center" data-content="6">
            <i class="iconfont iconshuipingduiqi v-center" data-content="6"></i>
          </div>
          <div title="水平等间距" class="block h" data-content="7">
            <i class="iconfont icondengjianju1" data-content="7"></i>
          </div>
          <div title="垂直等间距" class="block v" data-content="8">
            <i class="iconfont icondengjianju2" data-content="8"></i>
          </div>
          <div class="block"></div>
          <div title="等宽" class="block width" data-content="10">
            <i class="iconfont icondengkuan width" data-content="10"></i>
          </div>
          <div title="等高" class="block height" data-content="11">
            <i class="iconfont icondenggao height" data-content="11"></i>
          </div>
          <div title="等宽等高" class="block width height" data-content="12">
            <i
              class="iconfont icondenggaodengkuan width height"
              data-content="12"
            ></i>
          </div>
        </div>
      </li>
      <li class="bottomLine" v-show="showMenu.indexOf(',61,') !== -1">
        <div class="menu" @click.stop>
          <div class="lefts">新建</div>
          <div class="rights icon">
            <i class="el-icon-caret-right"></i>
          </div>
        </div>
        <div class="itemMenu">
          <div class="menu" @click.stop="createSub('子集')">
            <div class="lefts">子集</div>
          </div>
          <div class="menu" @click.stop="createSub('子项')">
            <div class="lefts">子项</div>
          </div>
        </div>
      </li>

      <li class="bottomLine" v-show="showMenu.indexOf(',681,') !== -1">
        <div class="menu" @click.stop="createPage">
          <div class="lefts">新建页面</div>
        </div>
      </li>
      <li class="bottomLine" v-show="showMenu.indexOf(',682,') !== -1">
        <div class="menu" @click.stop="createUploadPage">
          <div class="lefts">上传页面</div>
        </div>
      </li>
      <li class="bottomLine" v-show="showMenu.indexOf(',683,') !== -1">
        <div class="menu" @click.stop="editPage">
          <div class="lefts">编辑页面</div>
        </div>
      </li>
      <li class="bottomLine" v-show="showMenu.indexOf(',684,') !== -1">
        <div class="menu" @click.stop="deletePage">
          <div class="lefts">删除页面</div>
        </div>
      </li>
      <li class="bottomLine" v-show="showMenu.indexOf(',685,') !== -1">
        <div class="menu" @click.stop="copyLien">
          <div class="lefts">创建页面引用</div>
        </div>
      </li>
      <li class="bottomLine" v-show="showMenu.indexOf(',691,') !== -1">
        <div class="menu" @click.stop="createRoute">
          <div class="lefts">新建菜单</div>
        </div>
      </li>
      <li class="bottomLine" v-show="showMenu.indexOf(',692,') !== -1">
        <div class="menu" @click.stop="createRoute">
          <div class="lefts">新建二级菜单</div>
        </div>
      </li>
      <li class="bottomLine" v-show="showMenu.indexOf(',693,') !== -1">
        <div class="menu" @click.stop="editRoute">
          <div class="lefts">编辑菜单</div>
        </div>
      </li>
      <li class="bottomLine" v-show="showMenu.indexOf(',694,') !== -1">
        <div class="menu" @click.stop="deleteRoute">
          <div class="lefts">删除菜单</div>
        </div>
      </li>
      <li class="bottomLine" v-show="showMenu.indexOf(',695,') !== -1">
        <div class="menu" @click.stop="editRoute">
          <div class="lefts">编辑二级菜单</div>
        </div>
      </li>
      <li class="bottomLine" v-show="showMenu.indexOf(',696,') !== -1">
        <div class="menu" @click.stop="deleteRoute">
          <div class="lefts">删除二级菜单</div>
        </div>
      </li>

      <li class="bottomLine" v-show="showMenu.indexOf(',62,') !== -1">
        <div class="menu" @click.stop="treeCopy">
          <div class="lefts">复制添加</div>
        </div>
      </li>
      <li class="bottomLine" v-show="showMenu.indexOf(',631,') !== -1">
        <div class="menu" @click.stop="treeChangeTypeFloder">
          <div class="lefts">更改为子集</div>
        </div>
      </li>
      <li class="bottomLine" v-show="showMenu.indexOf(',632,') !== -1">
        <div
          :class="showMenu.indexOf(',6321,') !== -1 ? 'menu ' : 'menu diabled'"
          @click.stop="treeChangeTypeFile"
        >
          <div class="lefts">更改为子项</div>
        </div>
      </li>

      <li class="bottomLine" v-show="showMenu.indexOf(',671,') !== -1">
        <div class="menu" @click.stop="editScenes">
          <div class="lefts">编辑场景</div>
        </div>
      </li>
      <li class="bottomLine" v-show="showMenu.indexOf(',673,') !== -1">
        <div class="menu" @click.stop="editTimer">
          <div class="lefts">编辑定时</div>
        </div>
      </li>
      <li class="bottomLine" v-show="showMenu.indexOf(',674,') !== -1">
        <div class="menu" @click.stop="editAps">
          <div class="lefts">编辑排程</div>
        </div>
      </li>
      <li class="bottomLine" v-show="showMenu.indexOf(',672,') !== -1">
        <div class="menu" @click.stop="editCompose">
          <div class="lefts">编辑组合</div>
        </div>
      </li>

      <li class="bottomLine" v-show="showMenu.indexOf(',64,') !== -1">
        <div
          :class="showMenu.indexOf(',641,') !== -1 ? 'menu ' : 'menu diabled'"
          @click.stop="treeSort"
        >
          <div class="lefts">排序</div>
        </div>
      </li>
      <li class="bottomLine" v-show="showMenu.indexOf(',65,') !== -1">
        <div class="menu" @click.stop="treeRename">
          <div class="lefts">重命名</div>
        </div>
      </li>
      <li class="bottomLine" v-show="showMenu.indexOf(',66,') !== -1">
        <div class="menu" @click.stop="treeDelete">
          <div class="lefts">删除</div>
        </div>
      </li>

      <li class="bottomLine" v-show="showMenu.indexOf(',41,') !== -1">
        <div class="menu" @click.stop="compose">
          <div class="lefts">组合</div>
        </div>
      </li>
      <li class="bottomLine" v-show="showMenu.indexOf(',42,') !== -1">
        <div class="menu" @click.stop="uncompose">
          <div class="lefts">取消组合</div>
        </div>
      </li>
      <li class="bottomLine" v-show="showMenu.indexOf(',421,') !== -1">
        <div class="menu" @click.stop="composeToVms">
          <div class="lefts">新增组件</div>
        </div>
      </li>
      <li class="bottomLine" v-show="showMenu.indexOf(',5,') !== -1">
        <div class="menu" @click.stop="endCopy">
          <div class="lefts">粘贴</div>
          <div class="rights">Ctrl+V</div>
        </div>
      </li>
      <li class="bottomLine" v-show="showMenu.indexOf(',1,') !== -1">
        <div class="menu" @click.stop="startCopy">
          <div class="lefts">复制</div>
          <div class="rights">Ctrl+C</div>
        </div>
      </li>
      <li class="bottomLine" v-show="showMenu.indexOf(',img,') !== -1">
        <div class="menu" @click.stop>
          <div class="lefts">图像设置</div>
          <div class="rights icon">
            <i class="el-icon-caret-right"></i>
          </div>
        </div>
        <div class="itemMenu">
          <div class="menu" @click.stop="imgRemember">
            <div class="lefts">设置默认形状</div>
          </div>
          <div
            :class="
              showMenu.indexOf(',imgCancel,') !== -1 ? 'menu ' : 'menu diabled'
            "
            @click.stop="imgCancel(showMenu.indexOf(',imgCancel,') !== -1)"
          >
            <div class="lefts">取消默认形状</div>
          </div>
          <div class="menu" @click.stop="imgResume">
            <div class="lefts">恢复默认形状</div>
          </div>
        </div>
      </li>
      <li class="bottomLine" v-show="showMenu.indexOf(',21,') !== -1">
        <div class="menu" @click.stop="lock">
          <div class="lefts">锁定</div>
        </div>
      </li>
      <li class="bottomLine" v-show="showMenu.indexOf(',22,') !== -1">
        <div class="menu" @click.stop="unlock">
          <div class="lefts">解锁</div>
        </div>
      </li>
      <li class="bottomLine" v-show="showMenu.indexOf(',1,') !== -1">
        <div class="menu" @click.stop="hVCenter">
          <div class="lefts">快速居中</div>
          <div class="rights icon">
            <i class="el-icon-caret-right"></i>
          </div>
        </div>
        <div class="itemMenu">
          <div class="menu" @click.stop="hCenter">
            <div class="lefts">水平居中</div>
          </div>
          <div class="menu" @click.stop="vCenter">
            <div class="lefts">垂直居中</div>
          </div>
        </div>
      </li>
      <li class="bottomLine" v-show="showMenu.indexOf(',3,') !== -1">
        <div
          :class="showMenu.indexOf(',31,') !== -1 ? 'menu ' : 'menu diabled'"
          @click.stop="moveNext(showMenu.indexOf(',31,') !== -1)"
        >
          <div class="lefts">上移一层</div>
        </div>
        <div
          :class="showMenu.indexOf(',32,') !== -1 ? 'menu ' : 'menu diabled'"
          @click.stop="movePre(showMenu.indexOf(',32,') !== -1)"
        >
          <div class="lefts">下移一层</div>
        </div>
        <div
          :class="showMenu.indexOf(',33,') !== -1 ? 'menu ' : 'menu diabled'"
          @click.stop="moveTop(showMenu.indexOf(',33,') !== -1)"
        >
          <div class="lefts">置于顶层</div>
        </div>
        <div
          :class="showMenu.indexOf(',34,') !== -1 ? 'menu ' : 'menu diabled'"
          @click.stop="moveBottom(showMenu.indexOf(',34,') !== -1)"
        >
          <div class="lefts">置于底层</div>
        </div>
      </li>
      <li v-show="showMenu.indexOf(',1,') !== -1">
        <div class="menu" @click.stop="deleteVm">
          <div class="lefts">删除</div>
          <div class="rights">Del</div>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
import { guid } from "@/util/common";
import map from "./differentClassJson/map.json";
import { getToken } from "../api/api.js";
export default {
  data() {
    return {
      left: 0,
      top: 0,
      showMenu: "",
      homeEl: {
        scrollLeft: 0,
        scrollTop: 0
      }
      /**
       * ,1,显示复制，快速居中，删除
       * ,21,显示锁定
       * ,22,显示解锁
       * ,31,显示上移一层
       * ,32,显示下移一层
       * ,33,显示置于顶层
       * ,34,显示置于底层
       * ,4,显示图标
       * ,41,显示组合
       * ,42,显示取消组合
       * ,5,显示粘贴
       * ,61,显示新建
       * ,62,复制添加
       * ,631,更改为子集
       * ,632,更改为子项
       * ,64,排序
       * ,65,重命名
       * ,66,删除
       */
    };
  },
  mounted() {
    this.homeEl = document.querySelector(".home");
  },
  methods: {
    //图像记忆
    imgRemember() {
      let { vms } = this.getInfo();
      this.$drag.imgRemember.set(vms.type, {
        width: vms.width,
        height: vms.height
      });
      this.showMenu = "";
    },
    //撤销
    imgCancel(bool) {
      if (bool) {
        let { vms } = this.getInfo();
        this.$drag.imgRemember.delete(vms.type);
      }
      this.showMenu = "";
    },
    //恢复原始形状
    imgResume() {
      let { vms } = this.getInfo();
      let [index1, index2, index3] = vms.$data._myIndex.split("-");
      let config;
      if (index1 == 0) {
        config = map[index1].children[index2].children[index3];
      } else {
        config = this.currentItem = map[index1].children[index2];
      }
      vms.width = config.width;
      vms.height = config.height;
      this.showMenu = "";
    },

    //创建路由
    createRoute() {
      let operComp = this.$drag.operComp;
      let routes = this.$drag.$left.$refs.routes;
      // if (operComp) {
      routes.operateRoute = operComp;
      // }
      routes.createRoute();
      this.showMenu = "";
    },
    //编辑路由
    editRoute() {
      let operComp = this.$drag.operComp;
      let routes = this.$drag.$left.$refs.routes;
      routes.routes.forEach(item => {
        if (item === operComp) {
          routes.operateRoute = operComp;
          routes.operateChildRoute = null;
        }
        if (item.children) {
          item.children.forEach(_item => {
            if (_item === operComp) {
              routes.operateChildRoute = _item;
              routes.operateRoute = item;
            }
          });
        }
      });

      routes.editRoute();
      this.showMenu = "";
    },
    //删除路由
    deleteRoute() {
      let operComp = this.$drag.operComp;
      let routes = this.$drag.$left.$refs.routes;
      routes.routes.forEach(item => {
        if (item === operComp) {
          routes.operateChildRoute = null;
          routes.operateRoute = operComp;
        }
        if (item.children) {
          item.children.forEach(_item => {
            if (_item === operComp) {
              routes.operateChildRoute = _item;
              routes.operateRoute = item;
            }
          });
        }
      });
      routes.deleteRoute();
      this.showMenu = "";
    },
    //创建页面
    createPage() {
      this.$drag.$left.$refs.pages.createPage();
      this.showMenu = "";
    },
    //上传页面
    createUploadPage() {
      this.$drag.$left.$refs.pages.createUploadPage();
      this.showMenu = "";
    },
    //编辑页面
    editPage() {
      this.$drag.$left.$refs.pages.operatePage = this.$drag.operComp;
      this.$drag.$left.$refs.pages.editPage();
      this.showMenu = "";
    },
    //删除页面
    deletePage() {
      this.$drag.$left.$refs.pages.operatePage = this.$drag.operComp;
      this.$drag.$left.$refs.pages.deletePage();
      this.showMenu = "";
    },
    // 创建页面应用
    copyLien() {
      var Input = document.createElement("input"); //创建一个隐藏input（重要！）
      let pageId = this.$drag.operComp.id;
      let SubProjectId = window.sessionStorage.getItem("SubProjectId");
      let ProjectId = window.sessionStorage.getItem("ProjectId");
      getToken({ projectId: ProjectId, subProjectId: SubProjectId }).then(
        res => {
          let token = res.data;
          let Domain = sessionStorage.getItem("Domain");
          Input.value = `http://${Domain}/#/home?shareToken=${token}&sharePageId=${pageId}&SubProjectId=${SubProjectId}&ProjectId=${ProjectId}&shareAll=0`; //赋值
          document.body.appendChild(Input);
          Input.select(); // 选择对象
          document.execCommand("Copy"); // 执行浏览器复制命令
          Input.className = "oInput";
          Input.style.display = "none";
          this.$message({ message: "复制成功", type: "success" });
          this.showMenu = "";
        }
      );
      // let token =
      //   "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJwZXJtaXNzaW9uVHlwZSI6MCwicm9sZUlkcyI6W10sImF1dGhvcml0eSI6IlBST0pFQ1RfQURNSU4iLCJ0ZW5hbnRJZCI6ImQxOGU4NTkwNDA0OTQ2MDBiNDEwY2Y4ZDgzMDQ0NmZkIiwiaWQiOiI5YTRlZThlYzMzMWM0NzExYTQ5ODE1ZmZhODRiMTAyYyIsInRva2VuVHlwZSI6InRva2VuIiwiZXhwIjoxNjM0MTAxMDc4LCJwcm9qZWN0SWQiOiIxZWE2Mzc0MzlmZTEzNTBhNzc4Y2RjY2EzNTM0NGY5IiwiaWF0IjoxNjAyNTY1MDc4LCJ1c2VybmFtZSI6ImFkbWluIn0.ijU8kuU8dDImW7P-6nmF7Mq6huT_papa_2a4UtS9jws6Ub0-D8j3zBey65WeH5YtGsC6pkDVGyL1eWuXXB8fNB_hMvCXJ3QNhIU7Oi_R9JjaQjTi4yGw92lRMW7aDsnphUOIhABlzzmxmsOyjyqGYFeyL_snJDeFs_qjRCKVgyI";
    },
    //获取当前元素基本信息
    getInfo() {
      return {
        vms: this.$drag.vms, //操作的元素，数组
        targetVm: this.$drag.targetVm, //图标类操作，主元素
        isArray: this.$drag.vms instanceof Array, //是否为数组
        vmIndex: this.$drag.curentVmIndex, //当前元素在关联数组中位置，上下使用
        linkVms: this.$drag.linkVms, //跟当前操作数组挂钩的元素，上下移动使用
        copyConfig: this.$drag.copyConfig //复制过的元素信息配置
      };
    },
    //新建子集
    createSub(type) {
      this.$prompt(`请输入新建${type}名称`, `新建${type}`, {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputValidator: this.$drag.checkNameRepect.bind(this.$drag),
        closeOnClickModal: false
      })
        .then(({ value }) => {
          this.$drag.addTree(value, type);
        })
        .catch(() => {});
      this.showMenu = "";
    },
    treeCopy() {
      this.$prompt(`请输入新的名称`, `复制添加`, {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPlaceholder: this.$drag.operTreeItem.name,
        inputValidator: this.$drag.checkNameRepect.bind(this.$drag),
        closeOnClickModal: false
      })
        .then(({ value }) => {
          this.$drag.treeCopy(value);
        })
        .catch(() => {});
      this.showMenu = "";
    },
    treeChangeTypeFloder() {
      this.$drag.treeChangeTypeFloder();
      this.showMenu = "";
    },
    treeChangeTypeFile() {
      this.$drag.treeChangeTypeFile();
      this.showMenu = "";
    },
    treeSort() {
      this.$drag.treeSort();
      this.showMenu = "";
    },
    treeRename() {
      let treeItem = this.$drag.operTreeItem;
      let type = treeItem.type === "file" ? "子项" : "子集";
      this.$prompt(`请输入新建${type}名称`, `编辑`, {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputValue: treeItem.name,
        inputValidator: this.$drag.checkNameRepect.bind(this.$drag),
        closeOnClickModal: false
      })
        .then(({ value }) => {
          this.$drag.treeRename(value);
        })
        .catch(() => {});
      this.showMenu = "";
    },
    treeDelete() {
      this.$drag.treeDelete();
      this.showMenu = "";
    },
    //编辑场景
    editScenes() {
      let pointId = this.$drag.operComp.$refs.comp.highConfig["点位组关联"]
        .value;
      if (!pointId) {
        this.$message({
          type: "error",
          message: "当前组件未绑定点位组!"
        });
        this.showMenu = "";
        return;
      }
      this.$parent.$refs.dialogScenes.dialogVisible = true;
      this.showMenu = "";
    },
    //编辑定时
    editTimer() {
      let pointId = this.$drag.operComp.$refs.comp.highConfig["点位组关联"]
        .value;
      if (!pointId) {
        this.$message({
          type: "error",
          message: "当前组件未绑定点位组!"
        });
        this.showMenu = "";
        return;
      }
      this.$parent.$refs.dialogTimer.dialogVisible = true;
      this.showMenu = "";
    },
    //编辑排程
    editAps() {
      let pointId = this.$drag.operComp.$refs.comp.highConfig["点位组关联"]
        .value;
      if (!pointId) {
        this.$message({
          type: "error",
          message: "当前组件未绑定点位组!"
        });
        this.showMenu = "";
        return;
      }
      this.$parent.$refs.dialogAps.dialogVisible = true;
      this.showMenu = "";
    },
    //编辑组合
    editCompose() {
      let pointId = this.$drag.operComp.$refs.comp.highConfig["点位组关联"]
        .value;
      if (!pointId) {
        this.$message({
          type: "error",
          message: "当前组件未绑定点位组!"
        });
        this.showMenu = "";
        return;
      }
      this.$parent.$refs.dialogCompose.dialogVisible = true;
      this.showMenu = "";
    },
    //组合
    compose() {
      this.$drag.startCompose();

      this.showMenu = "";
      this.$drag.$history.setHistory(1);
    },
    //解组
    uncompose() {
      this.$drag.unCompose(true);
      this.showMenu = "";
      this.$drag.$history.setHistory(1);
    },
    //添加到常用组件
    composeToVms() {
      this.$drag.composeToVms();
      this.showMenu = "";
    },
    //左对齐等按钮
    otherOper() {
      let { vms, targetVm } = this.getInfo();
      let type = event.target.getAttribute("data-content");
      switch (type) {
        case "1":
          //水平左对齐
          vms.forEach(vm => {
            vm.left = targetVm.left;
            vm.resetStyle();
          });
          break;
        case "2":
          //水平居中对齐
          vms.forEach(vm => {
            let num = targetVm.left - vm.width / 2 + targetVm.width / 2;
            vm.left = num;
            vm.resetStyle();
          });
          break;
        case "3":
          //水平右对齐
          vms.forEach(vm => {
            let num = targetVm.left - vm.width + targetVm.width;
            vm.left = num;
            vm.resetStyle();
          });
          break;
        case "4":
          //垂直顶对齐
          vms.forEach(vm => {
            vm.top = targetVm.top;
            vm.resetStyle();
          });
          break;
        case "5":
          //垂直底对齐
          vms.forEach(vm => {
            let len = targetVm.top - vm.height + targetVm.height;
            vm.top = len;
            vm.resetStyle();
          });
          break;
        case "6":
          //垂直居中
          vms.forEach(vm => {
            let len = targetVm.top - vm.height / 2 + targetVm.height / 2;
            vm.top = len;
            vm.resetStyle();
          });
          break;
        case "7":
          //水平等间距
          var operVms = this.$drag.vms;
          if (operVms.length <= 2) {
            this.$message({
              type: "warning",
              message: "最少选中三个元素"
            });
            return;
          }
          operVms.sort((a, b) => {
            return a.left - b.left;
          });
          var space =
            operVms[operVms.length - 1].left -
            operVms[0].left -
            operVms[0].width;
          var centerVms = operVms.slice(1, -1);
          var sum = centerVms.reduce((pre, cur) => {
            return pre + cur.width;
          }, 0);
          var jun = parseInt((space - sum) / (centerVms.length + 1));
          centerVms.forEach((item, index) => {
            let myLen = operVms[0].left + operVms[0].width + jun * (index + 1);
            item.left = myLen;
            item.resetStyle();
          });
          break;
        case "8":
          //垂直等间距
          var _operVms = this.$drag.vms;
          if (_operVms.length <= 2) {
            this.$message({
              type: "warning",
              message: "最少选中三个元素"
            });
            return;
          }
          _operVms.sort((a, b) => {
            return a.top - b.top;
          });
          var _space =
            _operVms[_operVms.length - 1].top -
            _operVms[0].top -
            _operVms[0].height;
          var _centerVms = _operVms.slice(1, -1);
          var _sum = _centerVms.reduce((pre, cur) => {
            return pre + cur.height;
          }, 0);
          var _jun = parseInt((_space - _sum) / (_centerVms.length + 1));
          _centerVms.forEach((item, index) => {
            let myLen =
              _operVms[0].top + _operVms[0].height + _jun * (index + 1);
            item.top = myLen;
            item.resetStyle();
          });
          break;
        case "9":
          break;
        case "10":
          //等宽
          vms.forEach(vm => {
            vm.width = targetVm.width;
            vm.resetStyle();
          });
          break;
        case "11":
          //等高
          vms.forEach(vm => {
            vm.height = targetVm.height;
            vm.resetStyle();
          });
          break;
        case "12":
          //等宽等高
          vms.forEach(vm => {
            vm.width = targetVm.width;
            vm.height = targetVm.height;
            vm.resetStyle();
          });
          break;
        default:
          break;
      }
      this.showMenu = "";
      this.$drag.$history.setHistory(1);
    },
    startCopy() {
      let { vms, isArray } = this.getInfo();
      this._startCopy(vms, isArray, true);
    },
    //复制
    _startCopy(vms, isArray, bool) {
      let _copyConfig = [];
      if (isArray) {
        vms.forEach(instance => {
          if (instance.type === "compose") {
            _copyConfig.push(instance.getConfig());
          } else if (instance.type === "container") {
            _copyConfig.push(instance.getConfig());
          } else {
            let myconfig = instance.$refs.comp
              ? instance.$refs.comp.returnConfig
                ? instance.$refs.comp.returnConfig()
                : instance.$refs.comp.$data
              : instance.$data;
            _copyConfig.push({
              ...instance.$data,
              currentComp: null,
              compConfig: myconfig
            });
          }
        });
        if (bool) {
          this.$drag.copyVms = vms;
        }
      } else {
        if (vms.type === "compose") {
          _copyConfig.push(vms.getConfig());
        } else if (vms.type === "container") {
          _copyConfig.push(vms.getConfig());
        } else {
          let myconfig = vms.$refs.comp
            ? vms.$refs.comp.returnConfig
              ? vms.$refs.comp.returnConfig()
              : vms.$refs.comp.$data
            : vms.$data;
          _copyConfig.push({
            ...vms.$data,
            currentComp: null,
            compConfig: myconfig
          });
        }
        if (bool) {
          this.$drag.copyVms = [vms];
        }
      }
      if (bool) {
        this.$drag.copyConfig = _copyConfig;
      }

      this.showMenu = "";
      return _copyConfig;
    },
    //粘贴
    endCopy() {
      let { copyConfig } = this.getInfo();
      let vms = this.$drag.copyVms;
      let len = copyConfig.length;
      let { left, top } = this.$drag.getMulOption(vms);
      let backVms = [];
      copyConfig.forEach((conf, index) => {
        let _vms = conf._linkComp;
        conf = Object.assign({}, conf);
        conf._linkComp = null;
        let addLeft = len >= 2 ? vms[index].left - left : 0;
        let addTop = len >= 2 ? vms[index].top - top : 0;
        if (conf.type === "compose") {
          // let comps = this.$drag.centerConfigs[this.$drag.currentPageId].comps;
          // let _vms = conf.linkCompIndexs.map(index => {
          //   return comps[index];
          // });
          let _copyConfig = this._startCopy(_vms, true);
          _vms = [];
          _copyConfig.forEach(cc => {
            cc = JSON.parse(JSON.stringify(cc));
            let vm = this.$drag.checkCreateSymbol(
              {
                clientX: this.$drag.copyEvent.clientX + addLeft + cc.left,
                clientY: this.$drag.copyEvent.clientY + addTop + cc.top
              },
              {
                ...cc,
                id: guid()
              },
              true
            );
            if (!vm) {
              vm = this.$drag.createSymbol(
                {
                  ...cc,
                  id: guid()
                },
                {
                  x: this.$drag.copyEvent.clientX + addLeft + cc.left,
                  y: this.$drag.copyEvent.clientY + addTop + cc.top
                },
                true
              );
            }

            _vms.push(vm);
            this.$nextTick(() => {
              vm.resetStyle(false);
              if (len === 1) {
                this.$drag.showMenu(vm);
              }
            });
          });
          let composeVm = this.$drag.startCompose(_vms);
          backVms.push(composeVm);
        } else {
          if (conf.type === "container") {
            conf.compConfig.comps = conf.compConfig.compconfigs.map(() => {
              return [];
            });
          }
          conf = JSON.parse(JSON.stringify(conf));
          let vm = this.$drag.checkCreateSymbol(
            {
              clientX: this.$drag.copyEvent.clientX + addLeft,
              clientY: this.$drag.copyEvent.clientY + addTop
            },
            {
              ...conf,
              id: guid()
            },
            true
          );
          if (!vm) {
            //过滤一些树形
            let highConfig = conf.compConfig.highConfig;
            let _comps =
              _comps ||
              this.$drag.centerConfigs[this.$drag.currentPageId].comps;
            let _comp = _comps.find(comp => {
              if (comp.id === conf.id) {
                return true;
              }
            });
            if (conf.type === "日期选择器") {
              conf.compConfig.linkVmIds = [];
            }
            if (conf.type === "树形关联图") {
              conf.compConfig.linkVmIds = [];
            }
            if (highConfig && !_comp) {
              if (highConfig["树形图"]) {
                highConfig["树形图"] = {
                  type: "dependtree",
                  value: ""
                };
              }
            }
            vm = this.$drag.createSymbol(
              {
                ...conf,
                id: guid()
              },
              {
                x: this.$drag.copyEvent.clientX + addLeft,
                y: this.$drag.copyEvent.clientY + addTop
              },
              true
            );
          }

          backVms.push(vm);
          this.$nextTick(() => {
            vm.resetStyle(false);
            if (len === 1) {
              this.$drag.showMenu(vm);
            }
          });
        }
      });
      this.$drag.clearVms();
      if (len >= 2) {
        this.$drag.vms = backVms;
        this.$drag.setMultOperation();
      } else {
        this.$drag.vms = backVms[0];
        this.$drag.setOperation(backVms[0]);
      }
      this.showMenu = "";
      this.$drag.$history.setHistory(1);
    },
    //快速居中
    hVCenter() {
      this.hCenter();
      this.vCenter();
    },
    //水平居中
    hCenter() {
      let { vms } = this.getInfo();
      if (vms instanceof Array) {
        let { left, width } = this.$drag.getMulOption();
        let _left = vms[0].$parentEl.offsetWidth / 2 - left - width / 2;
        _left = parseInt(_left);
        vms.forEach(vm => {
          vm.left = vm.left + _left;
          vm.resetStyle();
        });
      } else {
        let left = vms.$parentEl.offsetWidth / 2 - vms.width / 2;
        left = parseInt(left);
        vms.left = left;
        vms.resetStyle();
        this.$drag.showMenu(vms);
      }
      this.$drag.$history.setHistory(1);
      this.showMenu = "";
    },
    //垂直居中
    vCenter() {
      let { vms } = this.getInfo();
      if (vms instanceof Array) {
        let { top, height } = this.$drag.getMulOption();
        let _top = vms[0].$parentEl.offsetHeight / 2 - top - height / 2;
        _top = parseInt(_top);
        vms.forEach(vm => {
          vm.top = vm.top + _top;
          vm.resetStyle();
        });
      } else {
        let top = vms.$parentEl.offsetHeight / 2 - vms.height / 2;
        top = parseInt(top);
        vms.top = top;
        vms.resetStyle();
        this.$drag.showMenu(vms);
      }
      this.$drag.$history.setHistory(1);
      this.showMenu = "";
    },
    //上移一层
    moveNext(bool) {
      if (!bool) return;
      let { vms, vmIndex, linkVms } = this.getInfo();
      let nextVm = linkVms[vmIndex + 1];
      let zIndex = vms.zIndex;
      vms.zIndex = nextVm.zIndex;
      nextVm.zIndex = zIndex;
      this.showMenu = "";
      this.$drag.$history.setHistory(1);
    },
    //下移一层
    movePre(bool) {
      if (!bool) return;
      let { vms, vmIndex, linkVms } = this.getInfo();
      let preVm = linkVms[vmIndex - 1];
      let zIndex = vms.zIndex;
      vms.zIndex = preVm.zIndex;
      preVm.zIndex = zIndex;
      this.showMenu = "";
      this.$drag.$history.setHistory(1);
    },
    //置于顶层
    moveTop(bool) {
      if (!bool) return;
      let { vms, linkVms } = this.getInfo();
      let topVm = linkVms[linkVms.length - 1];
      let zIndex = vms.zIndex;
      vms.zIndex = topVm.zIndex;
      topVm.zIndex = zIndex;
      this.showMenu = "";
      this.$drag.$history.setHistory(1);
    },
    //置于底层
    moveBottom(bool) {
      if (!bool) return;
      let { vms, linkVms } = this.getInfo();
      let bottomVm = linkVms[0];
      let zIndex = vms.zIndex;
      vms.zIndex = bottomVm.zIndex;
      bottomVm.zIndex = zIndex;
      this.showMenu = "";
      this.$drag.$history.setHistory(1);
    },
    lock() {
      let { vms, isArray } = this.getInfo();
      if (isArray) {
        vms.forEach(vm => {
          vm.locked = true;
        });
      } else {
        vms.locked = true;
      }
      this.$drag.$history.setHistory(1);
      this.showMenu = "";
    },
    unlock() {
      let { vms, isArray } = this.getInfo();
      if (isArray) {
        vms.forEach(vm => {
          vm.locked = false;
        });
      } else {
        vms.locked = false;
      }
      this.showMenu = "";
      this.$drag.$history.setHistory(1);
    },
    _deletevm(vm) {
      if (vm.type === "compose") {
        let linkComps = [];
        linkComps = this.$drag.unCompose(true, vm);
        if (linkComps.length) {
          this.$nextTick(() => {
            this.deleteVm(linkComps);
          });
        }
      } else {
        let comps, targetIndex;
        if (vm.$parent.type === "container") {
          //如果该图元是放在容器中，则由容器负责删除改元素
          let compVm = vm.$parent.$refs.comp;
          let container = compVm.baisicConfig["容器"];
          comps = compVm.comps[container.currentTabIndex];
          targetIndex = this.$drag.getTargetIndex(vm, comps);
        } else {
          if (vm.type === "container") {
            if (this.$drag.isNeedContainer(vm)) {
              this.$message("被绑定的容器不能被删除!");
              return;
            }
          } else if (vm.type === "日期选择器") {
            if (this.$drag.isNeedDateSelect(vm)) {
              this.$message("被绑定的日期不能被删除!");
              return;
            }
          } else if (vm.type === "树形关联图") {
            if (this.$drag.isNeedTree(vm)) {
              this.$message("被绑定的树不能被删除!");
              return;
            }
          }
          this.$drag.removeLink(vm);
          targetIndex = this.$drag.getTargetIndex(vm);
          comps = this.$drag.centerConfigs[this.$drag.currentPageId].comps;
        }
        let comp = comps[targetIndex];
        if (vm.type !== "树形关联图") {
          //vm不能destroy 为了记录历史记录
          vm.deleted = true;
          // comp[0].$destroy();
        } else {
          this.$drag.isDeleteTree(comp);
        }
      }
    },
    //删除图元
    deleteVm(linkVms) {
      let { vms } = this.getInfo();
      if (linkVms && !linkVms.target) {
        vms = linkVms;
      }
      if (!vms) {
        return;
      }
      if (vms instanceof Array) {
        vms.forEach(vm => {
          this._deletevm(vm);
        });
      } else {
        this.$drag.showMenu({
          classes: vms.classes,
          type: vms.type,
          $data: {
            _myIndex: vms.$data._myIndex
          }
        });
        this._deletevm(vms);
      }
      this.$drag.clearVms();

      this.showMenu = "";
      this.$drag.$history.setHistory(1);
    }
  },
  computed: {
    styles() {
      let scrollLeft = this.homeEl.scrollLeft;
      let scrollTop = this.homeEl.scrollTop;
      return {
        left: this.left - scrollLeft + "px",
        top: this.top - scrollTop + "px"
      };
    }
  }
};
</script>
<style lang="less" scoped>
.contextmenu {
  z-index: 100000;
  position: absolute;
  background-color: #fff;
  background-clip: padding-box;
  border-radius: 5px;
  width: 160px;
  box-sizing: border-box;
  padding: 10px 0;
  top: 50px;
  left: 50px;
  .menuUl {
    margin: 0;

    box-sizing: border-box;
    .bottomLine {
      border-bottom: 1px solid #dfe2e9;
      box-sizing: border-box;
      position: relative;
      .itemMenu {
        display: none;
        width: 160px;
        background: white;
        position: absolute;
        left: 160px;
        border-radius: 5px;
        top: 0px;
        padding: 10px 0;
      }
      &:hover,
      &:active {
        .itemMenu {
          display: block;
        }
      }
    }
    .iconBlock {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      padding: 0 10px 10px 10px;
      box-sizing: border-box;
      .block {
        cursor: pointer;
        width: 33.3%;
        height: 30px;
        text-align: center;
        line-height: 35px;
        &:hover {
          cursor: pointer;
          background-color: #dfe2e9;
          color: #24252a;
        }
      }
    }
    .menu {
      cursor: pointer;
      padding: 0 10px;
      box-sizing: border-box;
      line-height: 35px;
      height: 35px;
      display: flex;
      justify-content: space-between;
      &.diabled {
        cursor: no-drop;
        .lefts {
          color: #bfc5d1;
        }
      }
      &:hover {
        background-color: #f2f6fc;
      }
      .lefts {
        font-weight: 400;
        color: #212529;
      }
      .rights {
        color: #bfc5d1;
        &.icon {
          color: #212529;
        }
      }
    }
  }
}
</style>
