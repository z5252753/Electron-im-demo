<script setup lang="ts">
import { onMounted } from "vue";
import BarTop from "../components/BarTop.vue";
import { dialogReady } from "../common/Dialog";


let msgHandler = (e: any) => {
  console.log(e.data);
  window.opener.postMessage({ msgName: "hello", value: "I am your son." });
};
window.addEventListener("message", msgHandler);

onMounted(() => {
  console.log("ready", Date.now());
  // 向父级发送消息
  // 准备就绪
  dialogReady();
});

</script>
<template>
  <BarTop title="设置" />
  <div class="settingBody">
    <div class="menuBox">
      <div class="menuItem">账号设置</div>
      <div class="menuItem">消息通知</div>
      <div class="menuItem">通用设置</div>
      <div class="menuItem">文件管理</div>
      <div class="menuItem">快捷键</div>
      <div class="menuItem">关于微信</div>
    </div>
    <div class="pageBox">
      <router-view />
    </div>
  </div>
</template>
<style lang="scss">
#app {
  flex-direction: column;
  background: rgb(245, 245, 245);
}
</style>
<style scoped lang="scss">
.settingBody {
  display: flex;
  flex: 1;
  box-sizing: border-box;
  padding-top: 50px;
}
.menuBox {
  width: 120px;
  border-right: 1px solid rgb(227, 227, 227);
  .menuItem {
    height: 32px;
    line-height: 32px;
    text-align: center;
  }
}
.pageBox {
  flex: 1;
}
</style>
