<template>
  <div class="lefter" :style="wholeStyle">
    <div class="routes">
      <ul class="routesUl" :style="fontStyle" v-if="routes.length">
        <li
          @click.stop="selectRoute(item)"
          v-for="item in routes"
          :class="[
            'routesLi ' + (item.id === currentSelectRoute ? 'active' : ''),
            {
              isOpened:
                (currentSelectRoute === item.id || !item.linkPage) &&
                item.isOpened
            },
            { disabled: item.disabled }
          ]"
          :style="{
            color:
              item.id === currentSelectRoute
                ? config['选中的字体颜色'].value
                : '',
            background:
              item.id === currentSelectRoute
                ? config['选中的条目颜色'].value
                : ''
          }"
          :key="item.name"
        >
          <div class="routesDiv" :style="spaceColor">
            <span :class="item.icon"></span>
            <span class="title">{{ item.name }}</span>
            <span
              class="icon-arrow el-icon-arrow-right"
              v-if="item.children.length"
            ></span>
          </div>
          <ul class="subMenu" v-if="item.children.length && item.isOpened">
            <li
              v-for="subItem in item.children"
              :key="subItem.name"
              :class="[
                'routesLi ' +
                  (subItem.id === currentSelectRoute ? 'active' : ''),
                { disabled: subItem.disabled }
              ]"
              @click.stop="selectRoute(subItem)"
              :style="{
                color:
                  subItem.id === currentSelectRoute
                    ? config['选中的字体颜色'].value
                    : '',
                background:
                  subItem.id === currentSelectRoute
                    ? config['选中的条目颜色'].value
                    : ''
              }"
            >
              <div class="routesDiv" :style="spaceColor">
                <span :class="subItem.icon"></span>
                <span class="title">{{ subItem.name }}</span>
              </div>
            </li>
          </ul>
        </li>
      </ul>
      <div class="views" v-else>菜单列表</div>
    </div>
  </div>
</template>

<script>
import { packFont } from '@/util/common.js'

export default {
  props: {
    config: Object,
  },
  data() {
    return {
      operateTarget: null,
      dialogType: null,
      wholeStyle: {},
      fontStyle: {},
      spaceColor: {}, //线条颜色
      routes: this.$store.state.config.routeConfig.routes,
      currentSelectRoute: this.$store.state.config.routeConfig
        .currentSelectRoute,
      routesLinkPages: [],
      pages: this.$store.state.config.routeConfig.pages,
      currentSelectPage: '',
      subMenuPid: null,
    }
  },
  created() {
    let self = this
    let currentRoute = self.routes.find(route => {
      return route.id === self.currentSelectRoute
    })
    this.openedId = self.routes[0].id
    if (currentRoute) {
      this.selectPage(currentRoute.linkPage)
    }
    this.initStyle()
  },
  methods: {
    //初始化样式
    initStyle() {
      this.fontStyle = packFont(this.config['字体样式'].value)
      this.wholeStyle = {
        background: this.config['背景色'].value,
        boxShadow: this.config['边框发光色'].value + ' 0px 0px 10px 0px inset',
      }
      let color = this.config['间隔线色'].value
      let linear = this.config['间隔线的渐变范围'].value
      let pre = `linear-gradient(90deg, transparent ${50 -
        linear[0]}%, ${color}, transparent ${50 +
        linear[0]}%) 1 0 / 1 / 0 stretch`
      let borderImage = linear[1] ? 'none 100% / 1 / 0 stretch' : pre
      this.spaceColor = {
        borderImage: borderImage,
        borderColor: color,
      }
    },
    selectRoute(item) {
      //路由切换

      if (item.disabled) return

      if (this.currentSelectRoute !== item.id) {
        if (item.pid === this.currentSelectRoute) {
          //点击子菜单
          this.subMenuPid = item.pid
        }
        if (!item.pid && !this.subMenuPid) {
          this.routes.map(r => {
            if (r.id === this.currentSelectRoute) {
              r.isOpened = false
            }
          })
        } else if (
          this.subMenuPid !== item.id &&
          item.pid !== this.subMenuPid
        ) {
          this.routes.map(r => {
            if (r.id === this.subMenuPid) {
              r.isOpened = false
              this.subMenuPid = null
            }
          })
        }
      }

      if (!item.linkPage) {
        if (item.children.length > 0) {
          item.isOpened = !item.isOpened
        } else {
          item.isOpened = true
        }
      }
      this.selectPage(item.linkPage)
      this.currentSelectRoute = item.id
    },
    selectPage(item) {
      //页面切换
      if (typeof item === 'string') {
        this.currentSelectPage = item
        this.$nextTick(() => {
          this.$drag.$vm.linkId = item
        })
      } else {
        this.currentSelectPage = item.id
        this.$nextTick(() => {
          this.$drag.$vm.linkId = item.id
        })
      }
    },
  },
}
</script>
<style lang="less" scoped>
.lefter {
  background: rgb(36, 37, 42);
  display: flex;
  flex-direction: column;
  padding: 8px 4px;
  box-sizing: border-box;
  position: relative;
  .views {
    height: calc(100%);
    width: calc(100%);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    color: rgb(183, 192, 205);
    opacity: 0.3;
  }
  .typeDialog {
    position: absolute;
    z-index: 1;
    ul {
      background: white;
      background-clip: padding-box;
      border-radius: 0.25rem;
      border: 1px solid rgba(0, 0, 0, 0.15);
      margin: 0;
      padding: 10px 0;
      .item {
        box-sizing: border-box;
        padding: 0 20px;
        width: 150px;
        height: 30px;
        line-height: 30px;
      }
    }
  }
  .routes {
    position: relative;
    height: calc(50% - 3px);
    width: calc(100% - 4px);
    .routesUl {
      .routesLi {
        cursor: pointer;
        &.isOpened {
          .routesDiv {
            .icon-arrow {
              transform: rotate(90deg);
            }
          }
        }
        &.disabled {
          cursor: not-allowed;
          color: #aaa;
        }
        &.disabled:hover {
          span {
            color: #aaa;
          }
        }
        .routesDiv {
          height: 45px;
          line-height: 45px;
          box-sizing: border-box;
          border-bottom: 1px solid #2b2e37;
          padding: 0 20px 0 17px;
          display: flex;
          align-items: center;
          transition: 0.18s;
          .title {
            margin-left: 10px;
          }
          .icon-arrow {
            margin-left: auto;
            transform: rotate(0deg);
            transition: transform 0.18s;
          }
        }
        .subMenu {
          background: rgb(36, 37, 42);
          li {
            padding-left: 20px;
            color: rgb(183, 192, 205);
            &.disabled {
              color: #aaa;
            }
          }
        }
      }
      /* > .routesLi {
        &:nth-last-child(2) {
          cursor: not-allowed;
          color: #aaa;
        }
        &:nth-last-child(2):hover {
          span {
            cursor: not-allowed;
            color: #aaa;
          }
        }
      } */
      .routesLi.active {
        .routesDiv {
          &:hover {
            color: inherit;
          }
        }
      }
    }
  }
  .spaceLine {
    width: calc(100%);
    height: 3px;
  }
  .pages {
    position: relative;
    width: calc(100%);
    height: calc(50%);
    .pagesUl {
      font-size: 14px;
      color: rgb(183, 192, 205);
      .pagesLi {
        cursor: pointer;
        .pagesDiv {
          height: 45px;
          line-height: 45px;
          box-sizing: border-box;
          padding: 0 20px 0 17px;
          transition: 0.18s;
        }
      }
    }
  }
}
</style>
