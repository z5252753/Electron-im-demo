<script setup lang="ts">
import { onMounted } from "vue";
import ChatSearch from "./ChatSearch.vue";
import ChatItem from "./ChatItem.vue";
import { useChatStore } from "../../../store/useChatStore";

// 导入聊天数据
let store = useChatStore();

onMounted(() => {
  //选中第七个会话
  // store的数据说全局实时响应的数据，所以当我们修改了此处的数据选中之后，其实数据做了处理。
  store.selectItem(store.data[6]);
});
</script>
<template>
   <div class="ChatList">
    <ChatSearch />
    <div class="ListBox">
      <ChatItem :data="item" v-for="item in store.data" :key="item.id" />
    </div>
  </div>
</template>
<style scoped lang="scss">
.ChatList {
  width: 250px;
  display: flex;
  flex-direction: column;
  height: 100%;
  box-sizing: border-box;
}
.ListBox {
  background: rgb(230, 229, 229);
  background-image: linear-gradient(to bottom right, rgb(235, 234, 233), rgb(240, 240, 240));
  flex: 1;
  overflow-y: auto;
  box-sizing: border-box;

  border-right: 1px solid rgb(214, 214, 214);
}
</style>
