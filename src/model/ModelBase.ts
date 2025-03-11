// src\model\ModelBase.ts
import crypto from "crypto";
export class ModelBase {
  id: string;
    // 只有Modelbase 中实例化的时候才会创建。
  constructor() {
    this.id = crypto.randomUUID();
  }
}
