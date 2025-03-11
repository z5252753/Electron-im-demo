<template>
  <div class="MessageBord">
    <BarTop />
    <div class="MessageList">
      <MessageItem :data="item" v-for="item in messageStore.data" :key="item.id" />
    </div>
  </div>
</template>
<script setup lang="ts">
// import { ModelChat } from "../../../../model/ModelChat";
import BarTop from "../../../components/BarTop.vue";
// import { useChatStore } from "../../../store/useChatStore";
import { useMessageStore } from "../../../store/useMessageStore";
//@ts-ignore
import MessageItem from "./MessageItem.vue";
// let chatStore = useChatStore();
// 将chatStore数据改成直接从全局中进行数据获取
let messageStore = useMessageStore();
// let curId = "";
//订阅Store内数据的变化
// chatStore.$subscribe((mutations, state) => {
//   let item = state.data.find((v) => v.isSelected) as ModelChat;
//   if (item.id != curId) {
//     messageStore.initData(item);
//     curId = item.id;
//   }
// });
</script>
<style scoped lang="scss">
.MessageBord {
  height: 100%;
  display: flex;
  flex: 1;
  flex-direction: column;
}
.MessageList {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  background: rgb(245, 245, 245);
}
</style>