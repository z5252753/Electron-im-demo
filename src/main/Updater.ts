import { dialog } from "electron";
// @ts-ignore
import { autoUpdater } from "electron-updater";
export class Updater {
  static check() {
    autoUpdater.checkForUpdates();
    autoUpdater.on("update-downloaded", async () => {
      await dialog.showMessageBox({
        message: "有可用的升级",
      });
      autoUpdater.quitAndInstall();
    });
  }
}
