import type { CheckInRecord } from "../../../data/checkInRecords";

export const WEEKDAY_LABELS = ["日", "一", "二", "三", "四", "五", "六"];
export const MONTH_LABELS = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];
export const QUICK_FILTERS = [
  { id: "all", label: "全部" },
  { id: "today", label: "今天" },
  { id: "recent7", label: "近7天" },
  { id: "month", label: "本月" },
] as const;
export const TYPE_SORT_ORDER: CheckInRecord["type"][] = ["饮食打卡", "运动打卡", "用药打卡", "体征打卡"];

export type QuickFilterId = (typeof QUICK_FILTERS)[number]["id"] | "custom";

export function createMonthDate(dateText: string) {
  const date = new Date(`${dateText}T00:00:00`);
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function formatDateLabel(dateText: string) {
  const date = new Date(`${dateText}T00:00:00`);
  return `${date.getMonth() + 1}月${date.getDate()}日`;
}

export function formatSubmissionLabel(submittedAt: string) {
  const [dateText = "", timeText = ""] = submittedAt.split(" ");
  return `${dateText ? formatDateLabel(dateText) : ""} ${timeText}`.trim();
}

export function formatFullDateLabel(dateText: string) {
  const date = new Date(`${dateText}T00:00:00`);
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
}

export function formatDateRangeLabel(startDateText: string, endDateText: string) {
  return `${formatFullDateLabel(startDateText)} ～ ${formatFullDateLabel(endDateText)}`;
}

export function toDateKey(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getTodayDateKey() {
  return toDateKey(new Date());
}

export function shiftMonth(date: Date, offset: number) {
  return new Date(date.getFullYear(), date.getMonth() + offset, 1);
}

export function shiftDay(dateText: string, offset: number) {
  const nextDate = new Date(`${dateText}T00:00:00`);
  nextDate.setDate(nextDate.getDate() + offset);
  return toDateKey(nextDate);
}

export function getCalendarGrid(date: Date) {
  const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
  const gridStart = new Date(monthStart);
  gridStart.setDate(monthStart.getDate() - monthStart.getDay());

  return Array.from({ length: 42 }, (_, index) => {
    const cellDate = new Date(gridStart);
    cellDate.setDate(gridStart.getDate() + index);
    return cellDate;
  });
}

export function getTypeTone(type: CheckInRecord["type"]) {
  switch (type) {
    case "饮食打卡":
      return "diet";
    case "运动打卡":
      return "exercise";
    case "用药打卡":
      return "medication";
    case "体征打卡":
      return "vitals";
    default:
      return "neutral";
  }
}

export function isDateSelected(dateKey: string, quickFilter: QuickFilterId, selectedDate: string, todayDate: string) {
  if (quickFilter === "today") {
    return dateKey === todayDate;
  }

  if (quickFilter === "custom") {
    return dateKey === selectedDate;
  }

  return false;
}

export function getSummaryHeading(params: {
  quickFilter: QuickFilterId;
  selectedDate: string;
  recent7StartDate: string;
  monthStartDate: string;
  todayDate: string;
}) {
  const { monthStartDate, quickFilter, recent7StartDate, selectedDate, todayDate } = params;

  switch (quickFilter) {
    case "today":
    case "custom":
      return formatFullDateLabel(selectedDate);
    case "recent7":
      return formatDateRangeLabel(recent7StartDate, todayDate);
    case "month":
      return formatDateRangeLabel(monthStartDate, todayDate);
    case "all":
    default:
      return "";
  }
}

export function getEmptyStateCopy(quickFilter: QuickFilterId) {
  switch (quickFilter) {
    case "today":
      return {
        title: "今天暂无打卡记录",
        description: "今天还没有新增的饮食、运动、用药或体征记录。",
      };
    case "custom":
      return {
        title: "该日期暂无打卡记录",
        description: "请切换其他日期查看已完成的打卡内容。",
      };
    case "recent7":
    case "month":
      return {
        title: "当前筛选范围暂无打卡记录",
        description: "请切换其他时间范围或日期查看已完成的打卡内容。",
      };
    case "all":
    default:
      return {
        title: "暂无打卡记录",
        description: "当前还没有可展示的打卡内容。",
      };
  }
}
