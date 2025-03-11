//plugins\devPlugin.ts
import { ViteDevServer } from "vite"; // 引入vite
export let devPlugin = () => { // 构建一个函数
  return {
    name: "dev-plugin",
    // 当vite启动http服务的时候，这个configureServer 这个钩子会执行
    // server 代表着我们访问vue页面的http服务地址。
    // 因为我们默认使用的是IPV6，所以地址取localhost即可。
    configureServer( server: ViteDevServer) {
      require("esbuild").buildSync({
        entryPoints: ["./src/main/mainEntry.ts"], // 配置主进程的入口文件
        bundle: true,
        platform: "node",
        outfile: "./dist/mainEntry.js", // 配置主进程输出的文件。
        external: ["electron"],
      });
      // 坚挺server.httpServer的 listening 事件来判断当前服务vue服务是否已经启动起来了。
      // 如果启动成功，那么我们就需要启动electron应用。并给它传递两个命令参数
      // 第一个参数是主进程代码编译后的文件路径，第二个参数是vue页面的http地址。
      server.httpServer?.once("listening", () => {
        let { spawn } = require("child_process");
        // let addressInfo = server.httpServer?.address();// 获取当前vue地址
        let httpAddress = `http://localhost:5173`;//拼接地址
        // 我们通过node的 child_process模块的spawn方法启动electron子进程。
        let electronProcess = spawn(require("electron").toString(), ["./dist/mainEntry.js", httpAddress], {
          cwd: process.cwd(),// 设置当前的工作目录。process.cwd（）返回的是当前的根目录。
          stdio: "inherit",// 设置electron进程在控制台输出，这里设置inherit可以让electron子进程的控制台输出数据同步到主进程控制台。

        });
        electronProcess.on("close", () => {
          server.close(); // 网页服务关闭
          process.exit(); // electron程序退出
        });
      });
    },
  };
}; 

export let getReplacer = () => {
  let externalModels = ["os", "fs", "path", "events", "child_process", "crypto", "http", "buffer", "url", "better-sqlite3", "knex"];
  let result:any = {};
  for (let item of externalModels) {
    result[item] = () => ({
      find: new RegExp(`^${item}$`),
      code: `const ${item} = require('${item}');export { ${item} as default }`,
    });
  }
  result["electron"] = () => {
    let electronModules = ["clipboard", "ipcRenderer", "nativeImage", "shell", "webFrame"].join(",");
    return {
      find: new RegExp(`^electron$`),
      code: `const {${electronModules}} = require('electron');export {${electronModules}}`,
    };
  };
  return result;
};