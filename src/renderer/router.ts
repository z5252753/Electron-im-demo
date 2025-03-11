//src/renderer/router.ts
import * as VueRouter from "vue-router"; // 引入router组件
//路由规则描述数组
const routes: any = [
  { path: "/", redirect: "/windowMain/Chat" }, // 路由列表
  {
    path: "/WindowMain",
    component: () => import("./win/windowMain.vue"),
    children: [
      { path: "Chat", component: () => import("./win/windowMain/Chat.vue") },
      { path: "Contact", component: () => import("./win/windowMain/Contact.vue") },
      { path: "Collection", component: () => import("./win/windowMain/Collection.vue") },
    ],
  },
  {
    path: "/WindowSetting",
    component: () => import("./win/windowSetting.vue"),
    children: [{ path: "AccountSetting", component: () => import("./win/windowSetting/AccountSetting.vue") }],
  },
  {
    path: "/WindowUserInfo",
    component: () => import("./win/windowUseInfo.vue"),
  },
];
//导出路由对象
export let router = VueRouter.createRouter({
  history: VueRouter.createWebHistory(),
  routes,
});
