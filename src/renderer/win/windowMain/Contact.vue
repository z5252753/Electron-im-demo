<script setup lang="ts">
import { db } from "../../../common/db"; // 引入数据库实例
import { ModelChat } from "../../../model/ModelChat";
import { ModelMessage } from "../../../model/ModelMessage";
import BarTop from "../../components/BarTop.vue";

// 插入一条数据
let insertData = async () => {
  // 引入model
  let model = new ModelChat();
  // 设置数据
  model.fromName = "聊天对象";
  model.sendTime = Date.now();
  model.lastMsg = "这是此会话的最后一条消息";
  model.avatar = `https://pic3.zhimg.com/v2-306cd8f07a20cba46873209739c6395d_im.jpg?source=32738c0c`;
  // 新增一条数据
  await db("Chat").insert(model);
};


// 插入多条数据
let insertMultiData = async () => {
  let result = [];
  for (let i = 0; i < 10; i++) {
    let model = new ModelChat();
    model.fromName = "聊天对象" + i;
    model.sendTime = Date.now();
    model.lastMsg = "这是此会话的最后一条消息" + i;
    model.avatar = `https://pic3.zhimg.com/v2-306cd8f07a20cba46873209739c6395d_im.jpg?source=32738c0c`;
    result.push(model);
  }
  result[5].isSelected = true;
  // 插入一堆数据
  await db("Chat").insert(result);
};

// 数据查询
// first() 代表第返回数据列表的第一行，因为knex无法知道数据的返回结果，任何查询都将返回
// 查询其它方法 查询官网
let selectData = async () => {
  let data = await db("Chat").where({id: `256d6532-fcfe-4b81-a3f8-ee940f2de3e3`}).first();
  console.log(data);
}

// 修改数据
let updateData = async () => {
  let data = await db("Chat").update({ fromName: "三岛由纪夫", lastMsg: "就在刀刃猛然刺入腹部的瞬间，一轮红日在眼睑背面粲然升了上来。" }).where({ id: `256d6532-fcfe-4b81-a3f8-ee940f2de3e3` });
  console.log(data) // 行数
}

// 删除数据
let deleteData  = async () => {
  let data = await db("Chat").where({id: '256d6532-fcfe-4b81-a3f8-ee940f2de3e3'}).delete();
  console.log(data) // 行数
}

// knex提交事务代码
// 也可以简写成  await db("Message").insert(message).transacting(trx);
let transaction = async () => {
  try {
    await db.transaction(async (trx) =>{
      let chat = new ModelChat();
      chat.fromName = '聊天对象';
      chat.sendTime = Date.now(),
      chat.lastMsg = '这是此会话的最后一条消息';
      chat.avatar = `https://pic3.zhimg.com/v2-306cd8f07a20cba46873209739c6395d_im.jpg?source=32738c0c`;
      await trx('Chat').insert(chat); // trx 就是knex为我们封装的数据库事务对象。

      // 
      let message = new ModelMessage();
      message.fromName = "聊天对象";
      message.chatId = chat.id;
      message.createTime = Date.now();
      message.isInMsg = true;
      message.messageContent = "这是我发给你的消息";
      message.receiveTime = Date.now();
      message.avatar = `https://pic3.zhimg.com/v2-306cd8f07a20cba46873209739c6395d_im.jpg?source=32738c0c`;
      await trx("Message").insert(message);// trx 就是knex为我们封装的数据库事务对象。

    })
  }catch (error){
    console.error(error)
  }
}


// 分页查询数据
let currentPageIndex = 0;// 当前是第几页
let rowCountPerPage = 6; // 每页数据行数
let pageCount = -1; // 总页数
// 获取某一页的数据
let getOnePageData = async () => {
  let data = await db('Chat')
  .orderBy('sendTime', 'desc')
  .offset(currentPageIndex * rowCountPerPage)  // 方法是跳过 n 行的意思
  .limit(rowCountPerPage);  // 确保返回的结果中不多于 n 行的意思
  console.log(data)
}

// 获取第一页的数据
let getFirstPage = async () => {
  if (pageCount === -1) {
    let { count } = await db("Chat").count("id as count").first(); // 获取总数据行
    count = count as number;
    pageCount = count / rowCountPerPage; // 计算总页数
  }
  currentPageIndex = 0; // 设置当前页为第一页
  await getOnePageData();
};

// 获取下一页的数据
let getNextPage = async () => {
  if (currentPageIndex + 1 >= pageCount) { // 判断当前页码是不是达到了最后一页。
    // 如果是最后一页，那就总页数取整数 - 1
    currentPageIndex = Math.ceil(pageCount) - 1;
  } else {
    // 如果没有达到最后一页，那就当前页数 + 1  获取下一页
    currentPageIndex = currentPageIndex + 1;
  }
  await getOnePageData();
};

// 获取上一页的数据
let getPrevPage = async () => {
  if (currentPageIndex - 1 < 0) {  // 判断页面是不是第一页
    currentPageIndex = 0; // 如果是那就页数归零
  } else {
    // 如果不是，那就- 1 查询上页
    currentPageIndex = currentPageIndex - 1;
  }
  await getOnePageData();
};

// 获取最后一页的数据
let getLastPage = async () => {
  // 取整获取最后一页数据
  currentPageIndex = Math.ceil(pageCount) - 1;
  await getOnePageData();
};


</script>
<template>
  <div>联系人</div>
  <div class="ContactBoard">
    <BarTop />
  </div>
</template>
<style scoped lang="scss">
.ContactBoard {
  flex: 1;
}
</style>
