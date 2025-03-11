var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/main/mainEntry.ts
var import_electron3 = require("electron");

// src/main/CustomScheme.ts
var import_electron = require("electron");
var import_fs = __toESM(require("fs"));
var import_path = __toESM(require("path"));
var schemeConfig = { standard: true, supportFetchAPI: true, bypassCSP: true, corsEnabled: true, stream: true };
import_electron.protocol.registerSchemesAsPrivileged([{ scheme: "app", privileges: schemeConfig }]);
var CustomScheme = class {
  //根据文件扩展名获取mime-type
  static getMimeType(extension) {
    let mimeType = "";
    if (extension === ".js") {
      mimeType = "text/javascript";
    } else if (extension === ".html") {
      mimeType = "text/html";
    } else if (extension === ".css") {
      mimeType = "text/css";
    } else if (extension === ".svg") {
      mimeType = "image/svg+xml";
    } else if (extension === ".json") {
      mimeType = "application/json";
    }
    return mimeType;
  }
  //注册自定义app协议
  static registerScheme() {
    import_electron.protocol.registerStreamProtocol("app", (request, callback) => {
      let pathName = new URL(request.url).pathname;
      let extension = import_path.default.extname(pathName).toLowerCase();
      if (extension == "") {
        pathName = "index.html";
        extension = ".html";
      }
      let tarFile = import_path.default.join(__dirname, pathName);
      callback({
        statusCode: 200,
        headers: { "content-type": this.getMimeType(extension) },
        data: import_fs.default.createReadStream(tarFile)
      });
    });
  }
};

// src/main/CommonWindowEvent.ts
var import_electron2 = require("electron");
var CommonWindowEvent = class {
  static getWin(event) {
    return import_electron2.BrowserWindow.fromWebContents(event.sender);
  }
  static listen() {
    import_electron2.ipcMain.handle("minimizeWindow", (e) => {
      this.getWin(e)?.minimize();
    });
    import_electron2.ipcMain.handle("maxmizeWindow", (e) => {
      this.getWin(e)?.maximize();
    });
    import_electron2.ipcMain.handle("unmaximizeWindow", (e) => {
      this.getWin(e)?.unmaximize();
    });
    import_electron2.ipcMain.handle("hideWindow", (e) => {
      this.getWin(e)?.hide();
    });
    import_electron2.ipcMain.handle("showWindow", (e) => {
      this.getWin(e)?.show();
    });
    import_electron2.ipcMain.handle("closeWindow", (e) => {
      this.getWin(e)?.close();
    });
    import_electron2.ipcMain.handle("resizable", (e) => {
      return this.getWin(e)?.isResizable();
    });
    import_electron2.ipcMain.handle("getPath", (e, name) => {
      return import_electron2.app.getPath(name);
    });
  }
  static regWinEvent(win) {
    win.on("maximize", () => {
      win.webContents.send("windowMaximized");
    });
    win.on("unmaximize", () => {
      win.webContents.send("windowUnmaximized");
    });
    win.webContents.setWindowOpenHandler((param) => {
      let config = {
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
          nativeWindowOpen: true
        }
      };
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
      if (config["modal"] === true) config.parent = win;
      return { action: "allow", overrideBrowserWindowOptions: config };
    });
  }
};

// src/main/mainEntry.ts
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = "true";
import_electron3.app.on("browser-window-created", (e, win) => {
  CommonWindowEvent.regWinEvent(win);
});
var mainWindow;
import_electron3.app.whenReady().then(() => {
  let config = {
    frame: false,
    // 设置无边框
    titleBarStyle: "hidden",
    // 隐藏title
    // transparent: true, // 创建透明窗口
    webPreferences: {
      webviewTag: false,
      // 打开控制台
      nodeIntegration: true,
      // 集成node环境到渲染进程中
      webSecurity: false,
      allowRunningInsecureContent: true,
      contextIsolation: false,
      // 配置在同一个js上下文中使用electronAPI，其它配置项与本文主旨无关。
      spellcheck: false,
      experimentalFeatures: false,
      disableHtmlFullscreenWindowResize: true
    }
  };
  mainWindow = new import_electron3.BrowserWindow(config);
  if (process.argv[2]) {
    mainWindow.loadURL(process.argv[2]);
    mainWindow.webContents.openDevTools();
  } else {
    CustomScheme.registerScheme();
    mainWindow.loadURL(`app://index.html`);
  }
  CommonWindowEvent.listen();
});
