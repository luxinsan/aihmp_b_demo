import { startTransition, useMemo, useState } from "react";
import { ArrowLeftOutlined, LeftOutlined, RightOutlined } from "@ant-design/icons";
import Button from "antd/es/button";
import Image from "antd/es/image";
import { checkInRecords, type CheckInRecord } from "../../../data/checkInRecords";

const WEEKDAY_LABELS = ["日", "一", "二", "三", "四", "五", "六"];
const MONTH_LABELS = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];
const QUICK_FILTERS = [
  { id: "all", label: "全部" },
  { id: "today", label: "今天" },
  { id: "recent7", label: "近7天" },
  { id: "month", label: "本月" },
] as const;
const TYPE_SORT_ORDER: CheckInRecord["type"][] = ["饮食打卡", "运动打卡", "用药打卡", "体征打卡"];

type QuickFilterId = (typeof QUICK_FILTERS)[number]["id"] | "custom";

function createMonthDate(dateText: string) {
  const date = new Date(`${dateText}T00:00:00`);
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function formatDateLabel(dateText: string) {
  const date = new Date(`${dateText}T00:00:00`);
  return `${date.getMonth() + 1}月${date.getDate()}日`;
}

function formatSubmissionLabel(submittedAt: string) {
  const [dateText = "", timeText = ""] = submittedAt.split(" ");
  return `${dateText ? formatDateLabel(dateText) : ""} ${timeText}`.trim();
}

function formatFullDateLabel(dateText: string) {
  const date = new Date(`${dateText}T00:00:00`);
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
}

function formatDateRangeLabel(startDateText: string, endDateText: string) {
  return `${formatFullDateLabel(startDateText)} ～ ${formatFullDateLabel(endDateText)}`;
}

function toDateKey(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function shiftMonth(date: Date, offset: number) {
  return new Date(date.getFullYear(), date.getMonth() + offset, 1);
}

function shiftDay(dateText: string, offset: number) {
  const nextDate = new Date(`${dateText}T00:00:00`);
  nextDate.setDate(nextDate.getDate() + offset);
  return toDateKey(nextDate);
}

function getCalendarGrid(date: Date) {
  const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
  const gridStart = new Date(monthStart);
  gridStart.setDate(monthStart.getDate() - monthStart.getDay());

  return Array.from({ length: 42 }, (_, index) => {
    const cellDate = new Date(gridStart);
    cellDate.setDate(gridStart.getDate() + index);
    return cellDate;
  });
}

function getTypeTone(type: CheckInRecord["type"]) {
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

function isDateSelected(dateKey: string, quickFilter: QuickFilterId, selectedDate: string, todayDate: string) {
  if (quickFilter === "today") {
    return dateKey === todayDate;
  }

  if (quickFilter === "custom") {
    return dateKey === selectedDate;
  }

  return false;
}

function getDietMetricToneClass(tone: "orange" | "blue" | "amber" | "green") {
  return `tone-${tone}`;
}

function CheckInRecordDetail({ record }: { record: CheckInRecord }) {
  if (record.type === "饮食打卡") {
    return (
      <div className="checkin-detail-layout">
        <section className="diet-detail-card">
          <Image.PreviewGroup>
            <div className="diet-image-gallery">
              {record.meals.map((meal) => (
                <div className="diet-image-frame" key={meal.id}>
                  <Image
                    alt={`${record.title}打卡图`}
                    className="diet-gallery-image"
                    preview={{ mask: "查看大图" }}
                    src={meal.image}
                  />
                </div>
              ))}
            </div>
          </Image.PreviewGroup>

          <section className="diet-analysis-block">
            <div className="checkin-detail-section-head">
              <h3>AI分析结果概述</h3>
            </div>
            <p>{record.aiOverview}</p>
          </section>

          <section className="diet-analysis-block">
            <div className="checkin-detail-section-head">
              <h3>营养分析</h3>
            </div>
            <div className="diet-nutrition-grid">
              {record.nutritionMetrics.map((metric) => (
                <article className={`diet-nutrition-card ${getDietMetricToneClass(metric.tone)}`} key={metric.id}>
                  <strong>
                    {metric.value}
                    <span>{metric.unit}</span>
                  </strong>
                  <em>{metric.label}</em>
                </article>
              ))}
            </div>
          </section>

          <section className="diet-analysis-block doctor-review-block">
            <div className="checkin-detail-section-head">
              <h3>医生评价</h3>
            </div>
            <p>{record.doctorComment}</p>
          </section>
        </section>
      </div>
    );
  }

  if (record.type === "运动打卡") {
    return (
      <div className="checkin-detail-layout">
        <section className="checkin-detail-meta-grid">
          <article>
            <span>训练时长</span>
            <strong>{record.duration}</strong>
          </article>
          <article>
            <span>训练强度</span>
            <strong>{record.intensity}</strong>
          </article>
          <article>
            <span>消耗热量</span>
            <strong>{record.caloriesBurned}</strong>
          </article>
          <article>
            <span>心率区间</span>
            <strong>{record.heartRateRange}</strong>
          </article>
        </section>
        <section className="checkin-detail-block">
          <div className="checkin-detail-section-head">
            <h3>训练内容</h3>
            <p>展示本次运动拆解和执行情况</p>
          </div>
          <ul className="checkin-detail-bullet-list">
            {record.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
        <section className="checkin-detail-note-panel">
          <span>管理建议</span>
          <p>{record.coachComment}</p>
        </section>
      </div>
    );
  }

  if (record.type === "用药打卡") {
    return (
      <div className="checkin-detail-layout">
        <section className="checkin-detail-meta-grid">
          <article>
            <span>依从性</span>
            <strong>{record.adherence}</strong>
          </article>
          <article>
            <span>风险提示</span>
            <strong>{record.riskFlag}</strong>
          </article>
        </section>
        <section className="checkin-detail-block">
          <div className="checkin-detail-section-head">
            <h3>用药明细</h3>
            <p>按时间点展示本次确认结果</p>
          </div>
          <div className="checkin-medication-table">
            {record.items.map((item) => (
              <article className="checkin-medication-row" key={item.id}>
                <strong>{item.name}</strong>
                <span>{item.dose}</span>
                <span>{item.time}</span>
                <em>{item.status}</em>
              </article>
            ))}
          </div>
        </section>
        <section className="checkin-detail-note-panel">
          <span>反馈记录</span>
          <p>{record.effectFeedback}</p>
        </section>
      </div>
    );
  }

  return (
    <div className="checkin-detail-layout">
      <section className="checkin-detail-meta-grid">
        <article>
          <span>测量时段</span>
          <strong>{record.measurementWindow}</strong>
        </article>
        <article>
          <span>趋势判断</span>
          <strong>{record.trend}</strong>
        </article>
      </section>
      <section className="checkin-detail-block">
        <div className="checkin-detail-section-head">
          <h3>指标详情</h3>
          <p>用于查看单次体征打卡的关键数据</p>
        </div>
        <div className="checkin-vitals-grid">
          {record.metrics.map((metric) => (
            <article className="checkin-vitals-card" key={metric.id}>
              <span>{metric.label}</span>
              <strong>{metric.value}</strong>
              <em>{metric.status}</em>
            </article>
          ))}
        </div>
      </section>
      <section className="checkin-detail-note-panel">
        <span>随访建议</span>
        <p>{record.note}</p>
      </section>
    </div>
  );
}

export function PatientCheckInRecordsStage({ onBack }: { onBack: () => void }) {
  const initialRecord =
    checkInRecords[0] ?? {
      id: "",
      date: "2026-04-01",
      title: "",
      type: "饮食打卡" as const,
      summary: "",
      submittedAt: "2026-04-01 00:00",
      period: "",
      aiOverview: "",
      doctorComment: "",
      nutritionMetrics: [],
      meals: [],
    };
  const [selectedMonth, setSelectedMonth] = useState(() => createMonthDate(initialRecord.date));
  const [selectedDate, setSelectedDate] = useState(initialRecord.date);
  const [selectedRecordId, setSelectedRecordId] = useState(initialRecord.id);
  const [quickFilter, setQuickFilter] = useState<QuickFilterId>("all");

  const dateRecordMap = useMemo(() => {
    const grouped = new Map<string, CheckInRecord[]>();
    checkInRecords.forEach((record) => {
      const list = grouped.get(record.date) ?? [];
      list.push(record);
      grouped.set(record.date, list);
    });

    return grouped;
  }, []);

  const allRecordsSorted = useMemo(
    () =>
      [...checkInRecords].sort((left, right) =>
        `${right.date} ${right.submittedAt.slice(11)}`.localeCompare(`${left.date} ${left.submittedAt.slice(11)}`),
      ),
    [],
  );

  const todayDate = allRecordsSorted[0]?.date ?? initialRecord.date;
  const recent7StartDate = shiftDay(todayDate, -6);
  const monthStartDate = `${todayDate.slice(0, 8)}01`;

  const filteredRecords = useMemo(() => {
    switch (quickFilter) {
      case "today":
        return allRecordsSorted.filter((record) => record.date === todayDate);
      case "recent7":
        return allRecordsSorted.filter((record) => record.date >= recent7StartDate && record.date <= todayDate);
      case "month":
        return allRecordsSorted.filter((record) => record.date >= monthStartDate && record.date <= todayDate);
      case "custom":
        return allRecordsSorted.filter((record) => record.date === selectedDate);
      case "all":
      default:
        return allRecordsSorted;
    }
  }, [allRecordsSorted, monthStartDate, quickFilter, recent7StartDate, selectedDate, todayDate]);

  const summaryHeading = useMemo(() => {
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
  }, [monthStartDate, quickFilter, recent7StartDate, selectedDate, todayDate]);

  const visibleMonthKey = `${selectedMonth.getFullYear()}-${selectedMonth.getMonth()}`;

  const monthDates = useMemo(
    () =>
      Array.from(dateRecordMap.keys())
        .filter((dateText) => {
          const date = new Date(`${dateText}T00:00:00`);
          return `${date.getFullYear()}-${date.getMonth()}` === visibleMonthKey;
        })
        .sort((left, right) => right.localeCompare(left)),
    [dateRecordMap, visibleMonthKey],
  );

  const activeRecord = filteredRecords.find((item) => item.id === selectedRecordId) ?? filteredRecords[0] ?? null;
  const groupedRecords = useMemo(() => {
    const grouped = new Map<CheckInRecord["type"], CheckInRecord[]>();

    TYPE_SORT_ORDER.forEach((type) => {
      grouped.set(type, []);
    });

    filteredRecords.forEach((record) => {
      const list = grouped.get(record.type) ?? [];
      list.push(record);
      grouped.set(record.type, list);
    });

    return TYPE_SORT_ORDER.map((type) => ({
      type,
      records: grouped.get(type) ?? [],
    })).filter((group) => group.records.length > 0);
  }, [filteredRecords]);
  const calendarGrid = useMemo(() => getCalendarGrid(selectedMonth), [selectedMonth]);

  function syncSelectionWithRecords(records: CheckInRecord[]) {
    const nextRecord = records[0] ?? null;
    setSelectedRecordId(nextRecord?.id ?? "");
    if (nextRecord) {
      setSelectedDate(nextRecord.date);
      setSelectedMonth(createMonthDate(nextRecord.date));
    }
  }

  function handleMonthChange(offset: number) {
    startTransition(() => {
      const nextMonth = shiftMonth(selectedMonth, offset);
      const nextMonthKey = `${nextMonth.getFullYear()}-${nextMonth.getMonth()}`;
      const nextMonthDates = Array.from(dateRecordMap.keys())
        .filter((dateText) => {
          const date = new Date(`${dateText}T00:00:00`);
          return `${date.getFullYear()}-${date.getMonth()}` === nextMonthKey;
        })
        .sort((left, right) => right.localeCompare(left));

      setSelectedMonth(nextMonth);
      setSelectedDate(nextMonthDates[0] ?? toDateKey(nextMonth));
      setSelectedRecordId(nextMonthDates[0] ? (dateRecordMap.get(nextMonthDates[0])?.[0]?.id ?? "") : "");
    });
  }

  function handleQuickFilterChange(filterId: QuickFilterId) {
    startTransition(() => {
      setQuickFilter(filterId);

      if (filterId === "all") {
        syncSelectionWithRecords(allRecordsSorted);
        return;
      }

      if (filterId === "today") {
        syncSelectionWithRecords(allRecordsSorted.filter((record) => record.date === todayDate));
        return;
      }

      if (filterId === "recent7") {
        syncSelectionWithRecords(
          allRecordsSorted.filter((record) => record.date >= recent7StartDate && record.date <= todayDate),
        );
        return;
      }

      if (filterId === "month") {
        syncSelectionWithRecords(
          allRecordsSorted.filter((record) => record.date >= monthStartDate && record.date <= todayDate),
        );
      }
    });
  }

  function handleSelectDate(dateText: string) {
    const nextRecords = dateRecordMap.get(dateText) ?? [];
    startTransition(() => {
      setQuickFilter("custom");
      setSelectedMonth(createMonthDate(dateText));
      setSelectedDate(dateText);
      setSelectedRecordId(nextRecords[0]?.id ?? "");
    });
  }

  return (
    <section className="document-panel panel checkin-records-stage" aria-label="打卡记录">
      <header className="page-section-header panel-head checkin-records-head">
        <div className="page-section-header-main">
          <div className="page-section-header-title-wrap checkin-records-title-wrap">
            <Button
              className="ds-antd-health-action-button checkin-records-back-button"
              icon={<ArrowLeftOutlined />}
              type="default"
              onClick={onBack}
            >
              返回
            </Button>
            <h2 className="page-section-header-title">查看打卡记录</h2>
          </div>
        </div>
      </header>

      <div className="checkin-records-shell">
        <aside className="checkin-records-sidebar">
          <section className="checkin-calendar-panel">
            <div className="checkin-calendar-head">
              <strong>
                {selectedMonth.getFullYear()}年{MONTH_LABELS[selectedMonth.getMonth()]}
              </strong>
              <div className="checkin-calendar-actions">
                <button aria-label="上个月" type="button" onClick={() => handleMonthChange(-1)}>
                  <LeftOutlined />
                </button>
                <button aria-label="下个月" type="button" onClick={() => handleMonthChange(1)}>
                  <RightOutlined />
                </button>
              </div>
            </div>

            <div className="checkin-calendar-weekdays">
              {WEEKDAY_LABELS.map((label) => (
                <span key={label}>{label}</span>
              ))}
            </div>

            <div className="checkin-calendar-grid">
              {calendarGrid.map((date) => {
                const dateKey = toDateKey(date);
                const dayRecords = dateRecordMap.get(dateKey) ?? [];
                const isCurrentMonth = date.getMonth() === selectedMonth.getMonth();
                const isSelected = isDateSelected(dateKey, quickFilter, selectedDate, todayDate);

                return (
                  <button
                    className={`checkin-calendar-cell${isCurrentMonth ? "" : " is-outside"}${dayRecords.length ? " has-record" : ""}${isSelected ? " is-selected" : ""}`}
                    key={dateKey}
                    type="button"
                    onClick={() => handleSelectDate(dateKey)}
                  >
                    <span>{date.getDate()}</span>
                    {dayRecords.length ? <em>{dayRecords.length}</em> : null}
                  </button>
                );
              })}
            </div>
          </section>

          <section className="checkin-summary-panel">
            <div className="checkin-filter-bar" aria-label="日期快捷筛选">
              {QUICK_FILTERS.map((filter) => (
                <button
                  className={`checkin-filter-chip${quickFilter === filter.id ? " is-active" : ""}`}
                  key={filter.id}
                  type="button"
                  onClick={() => handleQuickFilterChange(filter.id)}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            <div className="checkin-summary-head">
              <div>
                {summaryHeading ? <strong>{summaryHeading}</strong> : null}
                <p>共 {filteredRecords.length} 条打卡记录</p>
              </div>
            </div>

            <div className="checkin-summary-list">
                {groupedRecords.length ? (
                groupedRecords.map((group) => (
                  <section className="checkin-summary-group" key={group.type}>
                    <div className="checkin-summary-group-head">
                      <strong>
                        <i className={`checkin-summary-group-dot tone-${getTypeTone(group.type)}`} />
                        {group.type}
                      </strong>
                    </div>
                    <div className="checkin-summary-group-list">
                      {group.records.map((record) => (
                        <button
                          className={`checkin-summary-item${activeRecord?.id === record.id ? " is-active" : ""}`}
                          key={record.id}
                          type="button"
                          onClick={() => setSelectedRecordId(record.id)}
                        >
                          <div className="checkin-summary-item-top">
                            <strong>{record.title}</strong>
                            <span className={`checkin-type-pill tone-${getTypeTone(record.type)}`}>{record.type}</span>
                          </div>
                          <em>{formatSubmissionLabel(record.submittedAt)}</em>
                        </button>
                      ))}
                    </div>
                  </section>
                ))
              ) : (
                <div className="checkin-summary-empty">
                  <strong>当天暂无打卡记录</strong>
                  <p>切换其他日期查看已完成的饮食、运动、用药或体征数据。</p>
                </div>
              )}
            </div>
          </section>
        </aside>

        <section className="checkin-detail-panel">
          {activeRecord ? (
            <>
              <header className="checkin-detail-head">
                <div className="checkin-detail-title-wrap">
                  <div className={`checkin-detail-kicker tone-${getTypeTone(activeRecord.type)}`}>
                    {activeRecord.type}
                  </div>
                  <h2>{activeRecord.title}</h2>
                  <p>{activeRecord.summary}</p>
                </div>
                <div className="checkin-detail-date-chip">{formatFullDateLabel(activeRecord.date)}</div>
              </header>

              <CheckInRecordDetail record={activeRecord} />
            </>
          ) : (
            <div className="checkin-detail-empty">
              <strong>请选择左侧有记录的日期</strong>
              <p>右侧会根据打卡类型展示对应的详情结构。</p>
            </div>
          )}
        </section>
      </div>
    </section>
  );
}
