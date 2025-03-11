<template>
  <BarLeft />
  <div class="pageBox">
    <router-view />
  </div>
</template>
<script setup lang="ts">
import { onMounted } from "vue";
import BarLeft from "../components/BarLeft.vue";
import { ipcRenderer } from "electron";

onMounted(() => {
  ipcRenderer.invoke('showWindow')
});
</script>


<style scoped lang="scss">
.pageBox {
  flex: 1;
  height: 100%;
  border-top: 1px solid #e6e6e6;
  box-sizing: border-box;
  display: flex;
  margin-top: -1px;
}
</style>
