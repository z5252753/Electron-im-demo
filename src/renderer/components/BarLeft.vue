<script setup lang="ts">
import { ref, watch } from "vue";
import { useRoute } from "vue-router";
import { createDialog } from "../common/Dialog";

let mainWindowRoutes = ref([
  { path: `/windowMain/Chat`, isSelected: true, icon: `icon-chat`, iconSelected: `icon-chat` },
  { path: `/windowMain/Contact`, isSelected: false, icon: `icon-tongxunlu1`, iconSelected: `icon-tongxunlu` },
  { path: `/windowMain/Collection`, isSelected: false, icon: `icon-shoucang1`, iconSelected: `icon-shoucang` },
]);
let route = useRoute();
watch(
  () => route,
  () => mainWindowRoutes.value.forEach((v) => (v.isSelected = v.path === route.fullPath)),
  {
    immediate: true,
    deep: true,
  }
);

// 打开子窗口 -》 是一个弹窗
  let openSettingWindow = async () => {
    // show：true， 可以手动的控制当前窗口是否显示
    // modal 为模态框
    // let config = { modal: true,show: true ,  width: 2002, webPreferences: { webviewTag: false } };
    // window.open(`/WindowSetting/AccountSetting`, "_blank", JSON.stringify(config));

    let config = { modal: false, width: 800, webPreferences: { webviewTag: false } };
    let dialog = await createDialog(`/WindowSetting/AccountSetting`, config);
    let msg = { msgName: "hello", value: "msg from your parent" };
    dialog.postMessage(msg);

    const Database = require("better-sqlite3");
    const db = new Database("db.db", { verbose: console.log, nativeBinding: "./node_modules/better-sqlite3/build/Release/better_sqlite3.node" });


  let native = require(process.cwd()+ '/node/addon.node');
  let paths = native.readFilePaths();

  console.log(paths);
  };
  window.addEventListener("message", (e) => {
    console.log(e.data);
  });

</script>
<template>
  <div class="BarLeft">
    <div class="userIcon">
      <img src="../assets/avatar.jpg" alt="" />
    </div>
    <div class="menu">
      <router-link v-for="item in mainWindowRoutes" :to="item.path" :class="[`menuItem`, { selected: item.isSelected }]">
        <i :class="[`icon`, item.isSelected ? item.iconSelected : item.icon]"></i>
      </router-link>
    </div>
    <div class="setting">
      <div class="menuItem" @click="openSettingWindow">
        <i class="icon icon-setting"></i>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.BarLeft {
  width: 65px;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: rgb(46, 46, 46);
  -webkit-app-region: drag;
}
.userIcon {
  height: 84px;
  padding-top: 36px;
  box-sizing: border-box;
  img {
    width: 34px;
    height: 34px;
    margin-left: 10px;
  }
}
.menu {
  flex: 1;
}
.menuItem {
  height: 44px;
  line-height: 44px;
  text-align: center;
  padding-left: 12px;
  padding-right: 12px;
  display: block;
  text-decoration: none;
  color: rgb(126, 126, 126);
  cursor: pointer;
  -webkit-app-region: no-drag;
  i {
    font-size: 22px;
  }
  &:hover {
    color: rgb(141, 141, 141);
  }
}
.selected {
  color: rgb(7, 193, 96);
  &:hover {
    color: rgb(7, 193, 96);
  }
}
.setting {
  margin-bottom: 5px;
}
</style>
