// 数据库操作
//src\common\db.ts
import knex from "knex";
import fs from "fs";
import path from "path";
let dbInstance;
if (!dbInstance) {
  console.log('项目路径 ----', __dirname)
  console.log('项目路径 ----', process.cwd())
  let dbPath = process.cwd();
  dbPath = path.join(dbPath, "/db.db"); // 获取系统目录
  let dbIsExist = fs.existsSync(dbPath);
  if (!dbIsExist) {  // 检查系统目录的db文件是否存在
    // 如果不存在，就从应用安装目录的resources下的db.db拷贝一份到该路径下。
    let resourceDbPath = path.join(process.execPath, "../resources/db.db");
    fs.copyFileSync(resourceDbPath, dbPath);
    // 我们要提前把数据库设计好，基础数据也要初始化好，制作安装包的时候，把数据库文件打包到安装包里。
  }
  dbInstance = knex({ // 传入了一个配置对象
    client: "better-sqlite3", // 代表使用什么模块访问数据库。mysql、Oracle、SqlServer
    connection: { filename: dbPath }, // 告诉knex我们数据库的本地路径。
    useNullAsDefault: true, // 告诉
  });
}

// 导出了一个数据库访问对象。只有第一次引入这个数据库访问的对象的时候才会执行此对象的初始化逻辑，也就是说
// 无论我们在多少个组件中引入这个数据库访问对象，它只会被初始化一次，但是这个约束只局限在一个进程哪。
// 对于整个应用而言，主进程有一个db实例，渲染进程也有一个db实例，两个实例说完全不同的。这里要注意渲染进程跟主进程的并发问题出现。
export let db = dbInstance;