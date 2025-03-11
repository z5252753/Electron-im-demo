import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { devPlugin,getReplacer } from "./plugins/devPlugin";
//@ts-ignore
import optimizer from "vite-plugin-optimizer";
import { buildPlugin } from './plugins/buildPlugin'

// https://vite.dev/config/
export default defineConfig({
  plugins: [optimizer(getReplacer()),devPlugin(), vue()],
  // 项目build的时候进行打包
  build:{
    rollupOptions:{
      plugins: [buildPlugin()] // 打包使用手动的第三方插件进行打包
    }
  }
})
