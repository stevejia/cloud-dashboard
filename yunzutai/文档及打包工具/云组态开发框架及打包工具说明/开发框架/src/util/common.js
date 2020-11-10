import Texts from "@/component/base/text.vue";
import Numbers from "@/component/base/number.vue";
import Rects from "@/component/base/rect.vue";
import Animations from "@/component/base/animation.vue";
import Sharps from "@/component/base/sharp.vue";
import Webviews from "@/component/base/webview.vue";
import Containers from "@/component/base/container.vue";
import Circles from "@/component/base/circle.vue";
import SwitchBtns from "@/component/sub/switchBtn.vue";
//生成唯一id
export function guid() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
//组装样式
export function packFont(val) {
  return {
    fontSize: val[0],
    fontFamily: val[1],
    fontWeight: val[2],
    color: val[3]
  };
}

//获取页面列表
export function getPages(that) {
  return [
    {
      label: "系统页面",
      options: [
        {
          value: "用户管理",
          label: "用户管理"
        },
        {
          value: "操作日志",
          label: "操作日志"
        }
      ]
    },
    {
      label: "本地页面",
      options: that.$drag.$left.pages.map(item => {
        return {
          lable: item.name,
          value: item.id
        };
      })
    }
  ];
}

//获取组件
export function getComp(type) {
  let comp = null;
  switch (type) {
    case "text":
      comp = Texts;
      break;
    case "number":
      comp = Numbers;
      break;
    case "circle":
      comp = Circles;
      break;
    case "animation":
      comp = Animations;
      break;
    case "rect":
      comp = Rects;
      break;
    case "container":
      comp = Containers;
      break;
    case "webview":
      comp = Webviews;
      break;
    case "sharp":
      comp = Sharps;
      break;
    case "开关按钮":
      comp = SwitchBtns;
      break;
    default:
      break;
  }
  return comp;
}
