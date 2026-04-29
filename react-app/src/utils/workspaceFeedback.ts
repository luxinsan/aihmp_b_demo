type ConfirmAction = "toggle-publish" | "delete";

export function getGenerationCompletedMessage(reportTitle: string) {
  void reportTitle;
  return "已完成";
}

export function getGenerationStartedMessage(reportTitle: string) {
  void reportTitle;
  return "已开始";
}

export function getGenerationStoppedMessage() {
  return "已停止";
}

export function getGenerationReturnedMessage(reportTitle: string, completed: boolean) {
  void reportTitle;
  return completed ? "已保存" : "已返回";
}

export function getGenerationBackgroundedMessage(reportTitle: string) {
  void reportTitle;
  return "已转后台";
}

export function getGenerationDismissedMessage(reportTitle: string) {
  void reportTitle;
  return "已移除";
}

export function getGenerationClearedMessage(count: number) {
  void count;
  return "已清理";
}

export function getEnteredEditMessage(reportTitle: string) {
  void reportTitle;
  return "已进入编辑";
}

export function getSavedEditMessage(reportTitle: string) {
  void reportTitle;
  return "已保存";
}

export function getClosedEditMessage(reportTitle: string) {
  void reportTitle;
  return "已退出";
}

export function getDiscardedEditMessage(reportTitle: string) {
  void reportTitle;
  return "已放弃";
}

export function getLockedConfirmMessage(reportTitle: string, action: ConfirmAction) {
  void reportTitle;
  void action;
  return "操作受限";
}

export function getPublishedMessage(reportTitle: string, nextStatus: string) {
  void reportTitle;
  return nextStatus === "已发布" ? "已发布" : "已撤销";
}

export function getDeletedMessage(reportTitle: string, hasDirtyDraft: boolean, hasGenerationRecord: boolean) {
  void reportTitle;
  void hasDirtyDraft;
  void hasGenerationRecord;
  return "已删除";
}
