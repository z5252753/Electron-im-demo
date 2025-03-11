import { createApp } from 'vue'
import App from './App.vue'
import { router } from './router'
import "./assets/style.css";
import "./assets/icon/iconfont.css";
import { createPinia } from 'pinia' // 引入pinia 插件
import { db } from '../common/db'

// 检索Chat表的数据
db("Chat")
  .first()
  .then((obj) => {
    console.log(obj);
  });

createApp(App).use(createPinia()).use(router).mount('#app')
