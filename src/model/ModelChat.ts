
// 定义好的数据模型
import { ModelBase } from "./ModelBase";
export class ModelChat extends ModelBase {
  fromName?: string;
  sendTime?: number | string;
  isSelected = false;
  lastMsg?: string;
  avatar?: string;
  /**
   * 0单聊，1群聊，2公众号，3文件传输助手
   */
  chatType?: number;
}
