import { BrowserWindow, ipcMain, app } from "electron";

export class CommonWindowEvent {
  private static getWin(event: any) {
    return BrowserWindow.fromWebContents(event.sender);
  }
  public static listen() {
    ipcMain.handle("minimizeWindow", (e) => {
      this.getWin(e)?.minimize();
    });

    ipcMain.handle("maxmizeWindow", (e) => {
      this.getWin(e)?.maximize();
    });

    ipcMain.handle("unmaximizeWindow", (e) => {
      this.getWin(e)?.unmaximize();
    });

    ipcMain.handle("hideWindow", (e) => {
      this.getWin(e)?.hide();
    });

    ipcMain.handle("showWindow", (e) => {
      this.getWin(e)?.show();
    });

    ipcMain.handle("closeWindow", (e) => {
      this.getWin(e)?.close();
    });
    ipcMain.handle("resizable", (e) => {
      return this.getWin(e)?.isResizable();
    });
    ipcMain.handle("getPath", (e: any, name: any) => {
      return app.getPath(name);
    });
  }
  public static regWinEvent(win: BrowserWindow) {
    win.on("maximize", () => {
      win.webContents.send("windowMaximized");
    });
    win.on("unmaximize", () => {
      win.webContents.send("windowUnmaximized");
    });

    // 注册打开子窗口的回调函数
    win.webContents.setWindowOpenHandler((param) => {
      // 子窗口的config 配置文件
      // config与主进程的config是相同的，这里是可以拆除出去。
      let config: any = {
        frame: false,
        show: true,
        webPreferences: {
          nodeIntegration: true,
          webSecurity: false,
          allowRunningInsecureContent: true,
          contextIsolation: false,
          webviewTag: true,
          spellcheck: false,
          disableHtmlFullscreenWindowResize: true,
          nativeWindowOpen: true,
        },
      };
      //开发者自定义窗口配置对象
      // params是由渲染进程传递过来，是一个字符串。
      let features = JSON.parse(param.features);
      for (let p in features) {
        if (p === "webPreferences") {
          for (let p2 in features.webPreferences) {
            config.webPreferences[p2] = features.webPreferences[p2];
          }
        } else {
          config[p] = features[p];
        }
      }
      // 如果配置的modal是一个true的话，则说明渲染进程希望子窗口为一个模态窗口。
      // 这时候我们要为子窗口提供父窗口的配置项：parent，这个配置项的值就是当前窗口。
      if (config["modal"] === true) config.parent = win;
      //允许打开窗口，并传递窗口配置对象
      return { action: "allow", overrideBrowserWindowOptions: config };
    });
  }
}
