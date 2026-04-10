type ConfirmAction = "toggle-publish" | "delete";

export function getGenerationCompletedMessage(reportTitle: string) {
  return `${reportTitle} 已生成完成，可继续审阅和编辑。`;
}

export function getGenerationStartedMessage(reportTitle: string) {
  return `${reportTitle} 已进入生成流程。`;
}

export function getGenerationStoppedMessage() {
  return "当前生成流程已停止。";
}

export function getGenerationReturnedMessage(reportTitle: string, completed: boolean) {
  return completed
    ? `${reportTitle} 已保存并返回报告文档列表。`
    : `${reportTitle} 已返回报告文档列表，当前草稿仍然保留。`;
}

export function getGenerationBackgroundedMessage(reportTitle: string) {
  return `${reportTitle} 已转入后台生成。`;
}

export function getGenerationDismissedMessage(reportTitle: string) {
  return `${reportTitle} 的任务记录已移除。`;
}

export function getGenerationClearedMessage(count: number) {
  return `已清理 ${count} 条已完成或已终止的任务记录。`;
}

export function getEnteredEditMessage(reportTitle: string) {
  return `${reportTitle} 已进入编辑。`;
}

export function getSavedEditMessage(reportTitle: string) {
  return `${reportTitle} 已保存，并已返回报告文档列表。`;
}

export function getClosedEditMessage(reportTitle: string) {
  return `${reportTitle} 已退出编辑，当前改动仍保留在草稿中。`;
}

export function getDiscardedEditMessage(reportTitle: string) {
  return `${reportTitle} 的未保存改动已放弃，并返回报告列表。`;
}

export function getLockedConfirmMessage(reportTitle: string, action: ConfirmAction) {
  return `${reportTitle} 当前后台生成仍在进行中，已阻止本次${action === "delete" ? "删除" : "发布状态切换"}操作。`;
}

export function getPublishedMessage(reportTitle: string, nextStatus: string) {
  return `${reportTitle} 状态已更新为 ${nextStatus}。`;
}

export function getDeletedMessage(reportTitle: string, hasDirtyDraft: boolean, hasGenerationRecord: boolean) {
  return `${reportTitle} 已移除${hasDirtyDraft ? "，关联草稿也已同步清理" : ""}${
    hasGenerationRecord ? "，任务记录也已一并移除" : ""
  }。`;
}
