//plugins\buildPlugin.ts
//@ts-ignore
import path from "path";
//@ts-ignore
import * as fs from 'fs-extra'; // 修改: 使用 fs-extra 替代 fs

export let buildPlugin = () => {
    return {
      name: "build-plugin",
      closeBundle: () => {
        let buildObj = new BuildObj();
        buildObj.buildMain(); // 编译主进程代码
        buildObj.preparePackageJson(); // 一个入口文件，这个文件是以当前项目的package.json文件为蓝本进行制作而成的。
        buildObj.buildInstaller();
        buildObj.prepareSqlite(); // 第一：把开发环境的node_modules\better-sqlite3目录下有用的文件拷贝到dist\node_modules\better-sqlite3目录下，并为这个模块自制了一个简单的package.json。
                                   // 第二：完全自己制作了一个bindings模块，把这个模块放置在dist\node_modules\bindings目录下。
        buildObj.prepareKnexjs();          
      },              
    };
  };

class BuildObj {
  //编译主进程代码
  buildMain() {
    //@ts-ignore
    require("esbuild").buildSync({
      entryPoints: ["./src/main/mainEntry.ts"], // 文件入口
      bundle: true,
      platform: "node", // 使用node
      minify: true,
      outfile: "./dist/mainEntry.js", // 输出文件
      external: ["electron"], // 执行命令
    });
  }
  //为生产环境准备package.json
  preparePackageJson() {
    //@ts-ignore
    let pkgJsonPath = path.join(process.cwd(), "package.json"); // 读取package.json文件
    let localPkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, "utf-8")); // 转换成 utf-8
    let electronConfig = localPkgJson.devDependencies.electron.replace("^", "");
    localPkgJson.main = "mainEntry.js";
    delete localPkgJson.scripts;
    delete localPkgJson.devDependencies;
    // 确保 dependencies 对象存在
    if (!localPkgJson.dependencies) {
      localPkgJson.dependencies = {};
    }
    localPkgJson.dependencies["better-sqlite3"] = "*";
    localPkgJson.dependencies["bindings"] = "*";   //这里bindings模块是better-sqlite3模块依赖的一个模块，它的作用仅仅是确定原生模块文件better_sqlite3.node的路径。
    let tarJsonPath = path.join(process.cwd(), "dist", "package.json");
    fs.writeFileSync(tarJsonPath, JSON.stringify(localPkgJson));
    fs.mkdirpSync(path.join(process.cwd(), "dist/node_modules")); // 修改: 使用 fs.mkdirpSync 替代 fs.mkdirSync

    // 检查必要的字段是否存在
    const errors: string[] = [];
    if (!localPkgJson.name) {
      errors.push("Missing 'name' field in package.json");
    }
    if (!localPkgJson.version) {
      errors.push("Missing 'version' field in package.json");
    }
    if (!localPkgJson.main) {
      errors.push("Missing 'main' field in package.json");
    }
    if (errors.length > 0) {
      // @ts-ignore
      throw new InvalidConfigurationError(errors.join("\n"));
    }
  }
  //使用electron-builder制成安装包
  // extraResources：
  // 可以让开发者为安装包指定额外的资源文件，electron-builder 打包应用时会把这些资源文件附加到安装包内，当用户安装应用程序时，这些资源会释放在安装目录的 resources\子目录下。
  buildInstaller() {
    let options = {
      config: {
        extraResources: [{ from: `./src/common/db.db`, to: `./` }], // 将数据库文件打包安装到安装包内。
        directories: {
          //@ts-ignore
          output: path.join(process.cwd(), "release"), // 安装包输出位置
          //@ts-ignore
          app: path.join(process.cwd(), "dist"),// app应用内容输出位置
        },
        files: ["**"], // 所有文件
        extends: null,
        productName: "JueJin", // 项目名称
        appId: "com.juejin.desktop", // appid
        asar: true,  //是否压缩为一个文件
        nsis: { // nsis打包相关配置，electron-builder会使用nsis为安装程序的可执行文件和卸载程序的可执行文件进行签名，。
          oneClick: true,
          perMachine: true,
          allowToChangeInstallationDirectory: false,
          createDesktopShortcut: true,
          createStartMenuShortcut: true,
          shortcutName: "juejinDesktop",
        },
        publish: [{ provider: "generic", url: "http://localhost:5500/" }], // 本地环境地质
      },
      //@ts-ignore
      project: process.cwd(),
    };
    //@ts-ignore
    return require("electron-builder").build(options);
  }

  // 编译sqllite
    async prepareSqlite() {
      //拷贝better-sqlite3
      let srcDir = path.join(process.cwd(), `node_modules/better-sqlite3`);
      let destDir = path.join(process.cwd(), `dist/node_modules/better-sqlite3`);
      fs.ensureDirSync(destDir);
      fs.copySync(srcDir, destDir, {
        filter: (src, dest) => {
          if (src.endsWith("better-sqlite3") || src.endsWith("build") || src.endsWith("Release") || src.endsWith("better_sqlite3.node")) return true;
          else if (src.includes("node_modules\\better-sqlite3\\lib")) return true;
          else return false;
        },
      });
    
      let pkgJson = `{"name": "better-sqlite3","main": "lib/index.js"}`;
      let pkgJsonPath = path.join(process.cwd(), `dist/node_modules/better-sqlite3/package.json`);
      fs.writeFileSync(pkgJsonPath, pkgJson);
      //制作bindings模块
      let bindingPath = path.join(process.cwd(), `dist/node_modules/bindings/index.js`);
      fs.ensureFileSync(bindingPath);
      let bindingsContent = `module.exports = () => {
    let addonPath = require("path").join(__dirname, '../better-sqlite3/build/Release/better_sqlite3.node');
    return require(addonPath);
    };`;
      fs.writeFileSync(bindingPath, bindingsContent);
    
      pkgJson = `{"name": "bindings","main": "index.js"}`;
      pkgJsonPath = path.join(process.cwd(), `dist/node_modules/bindings/package.json`);
      fs.writeFileSync(pkgJsonPath, pkgJson);
    }

      // 编译knex.js
      //plugins\buildPlugin.ts
      prepareKnexjs() {
        let pkgJsonPath = path.join(process.cwd(), `dist/node_modules/knex`);
        fs.ensureDirSync(pkgJsonPath);
        require("esbuild").buildSync({ // esbuild编译knex.js。
          entryPoints: ["./node_modules/knex/knex.js"],
          bundle: true,
          platform: "node",
          format: "cjs",
          minify: true,
          outfile: "./dist/node_modules/knex/index.js",
          external: ["oracledb", "pg-query-stream", "pg", "sqlite3", "tedious", "mysql", "mysql2", "better-sqlite3"],
        });
        let pkgJson = `{"name": "bindings","main": "index.js"}`;
        pkgJsonPath = path.join(process.cwd(), `dist/node_modules/knex/package.json`);
        fs.writeFileSync(pkgJsonPath, pkgJson);
      }

      
}
