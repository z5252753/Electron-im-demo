// src\main\mainEntry.ts
import { app, BrowserWindow } from "electron";
  
import { CustomScheme } from './CustomScheme'

import { CommonWindowEvent } from "./CommonWindowEvent";


process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = "true"; // 关闭渲染竞争开发者调试工具的警告

// 每当有一个窗口被创建之后，这个事件就会被触发
// 这个事件的第二个参数就是窗口对象
app.on("browser-window-created", (e, win) => {
  CommonWindowEvent.regWinEvent(win);
});

let mainWindow: BrowserWindow;
// app.commandLine.appendSwitch('lang', 'en-US');
// Menu.setApplicationMenu(null)  // window下隐藏系统上的导航栏目
// app.dock.hide() // 隐藏系统顶部菜单 mac下是电脑左上角
// 判断在app准备好的时候去执行
app.whenReady().then(() => {
  let config: Electron.BrowserWindowConstructorOptions = {
    frame: false,  // 设置无边框
    titleBarStyle: 'hidden',// 隐藏title
    // transparent: true, // 创建透明窗口
    webPreferences: {
      webviewTag: false,   // 打开控制台
      nodeIntegration: true, // 集成node环境到渲染进程中
      webSecurity: false,
      allowRunningInsecureContent: true, 
      contextIsolation: false, // 配置在同一个js上下文中使用electronAPI，其它配置项与本文主旨无关。
      spellcheck: false,
      experimentalFeatures:false,
      disableHtmlFullscreenWindowResize: true,
    },
  };
  mainWindow = new BrowserWindow(config);
  // 判断当前环境，如果有第个参数，那就使用第二个参数。
  // devPlugin 中 httpAddress 的位置就是
  if (process.argv[2]) {
    mainWindow.loadURL(process.argv[2]);
    mainWindow.webContents.openDevTools(); // 打开控制台
  } else {
    // 如果没有第二个参数（dev启动时候的本地地址），那就走打包后的静态文件地址
    // 引入CustomScheme
    CustomScheme.registerScheme();
    mainWindow.loadURL(`app://index.html`);
  }
  CommonWindowEvent.listen();
});