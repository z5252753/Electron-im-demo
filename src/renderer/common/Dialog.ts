// window.open打开子窗口逻辑
// 主要封装原因是，完们不知道子窗口什么时候创建加载成功了。
// 所以我们要自己封装一个事件，在我们的业务代码真正执行完成时，手动发射这个事件。
// 告知主窗口：“现在子窗口已经加载成功了，可以给我发消息了”

// url: 打开的路由地址，config，当前窗口的配置值
export let createDialog = (url: string, config: any): Promise<Window> => {
    return new Promise((resolve, reject) => {
     // window.open打开子窗口
      let windowProxy : any = window.open(url, "_blank", JSON.stringify(config));

      // 处理监听到的消息内容
      let readyHandler = (e: any) => {
        let msg = e.data;
        if (msg["msgName"] === `__dialogReady`) {
          window.removeEventListener("message", readyHandler);
          resolve(windowProxy);
        }
      };
      // 监听子窗口发来的消息
      window.addEventListener("message", readyHandler);
    });
  };
  

  // 当子窗口完成了必要的业务逻辑后，就可以调用执行这个方法，通知父窗口已经加载成功了。
  export let dialogReady = () => {
    let msg = { msgName: `__dialogReady` };
    // 向父窗口发送一个消息。
    window.opener.postMessage(msg);
  };