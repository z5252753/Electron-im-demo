//src\renderer\store\useChatStore.ts
import { defineStore } from "pinia";
import { type Ref, ref } from "vue";
import { ModelChat } from "../../model/ModelChat";
import { useMessageStore } from "./useMessageStore";

//初始化模拟数据
// 模拟了10条消息
let prepareData = () => {
  let result = [];
  for (let i = 0; i < 10; i++) {
    let model = new ModelChat();
    model.fromName = "聊天对象" + i;
    model.sendTime = "昨天";
    model.lastMsg = "这是此会话的最后一条消息" + i;
    model.avatar = `https://pic3.zhimg.com/v2-306cd8f07a20cba46873209739c6395d_im.jpg?source=32738c0c`;
    result.push(model);
  }
  return result;
};

//定义一个Store，这个商店名字叫： chat。
// 执行 useChatStore 这个的实例，会访问到 Chat 的实例。
// defineStore(name, function) 创建一个store。
export const useChatStore = defineStore("chat", () => {
   // 以ref的形式创建了data数据
   // 类似于state
  let data: Ref<ModelChat[]> = ref(prepareData());
    // 类似于 action
  let selectItem = (item: ModelChat) => {
    if (item.isSelected) return;
    data.value.forEach((v) => (v.isSelected = false));
    item.isSelected = true;
    let messageStore = useMessageStore(); //新增的行
    messageStore.initData(item); //新增的行
  };
  return { data, selectItem };
});
