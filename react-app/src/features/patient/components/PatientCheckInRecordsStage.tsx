import { startTransition, useMemo, useState } from "react";
import { ArrowLeftOutlined, LeftOutlined, RightOutlined } from "@ant-design/icons";
import Button from "antd/es/button";
import { checkInRecords, type CheckInRecord } from "../../../data/checkInRecords";
import { CheckInRecordDetail } from "./CheckInRecordDetail";
import {
  QUICK_FILTERS,
  MONTH_LABELS,
  TYPE_SORT_ORDER,
  WEEKDAY_LABELS,
  createMonthDate,
  formatFullDateLabel,
  formatSubmissionLabel,
  getCalendarGrid,
  getEmptyStateCopy,
  getSummaryHeading,
  getTodayDateKey,
  getTypeTone,
  isDateSelected,
  shiftDay,
  shiftMonth,
  toDateKey,
  type QuickFilterId,
} from "../utils/checkInRecordPresentation";

export function PatientCheckInRecordsStage({ onBack }: { onBack: () => void }) {
  const initialRecord =
    checkInRecords[0] ?? {
      id: "",
      date: "2026-04-01",
      title: "",
      type: "饮食打卡" as const,
      summary: "",
      submittedAt: "2026-04-01 00:00",
      aiOverview: "",
      doctorComment: "",
      nutritionMetrics: [],
      images: [],
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
    () => [...checkInRecords].sort((left, right) => right.submittedAt.localeCompare(left.submittedAt)),
    [],
  );

  const todayDate = getTodayDateKey();
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

  const summaryHeading = useMemo(
    () =>
      getSummaryHeading({
        monthStartDate,
        quickFilter,
        recent7StartDate,
        selectedDate,
        todayDate,
      }),
    [monthStartDate, quickFilter, recent7StartDate, selectedDate, todayDate],
  );
  const emptyStateCopy = useMemo(() => getEmptyStateCopy(quickFilter), [quickFilter]);

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
                  <strong>{emptyStateCopy.title}</strong>
                  <p>{emptyStateCopy.description}</p>
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
              <strong>{emptyStateCopy.title}</strong>
              <p>{emptyStateCopy.description}</p>
            </div>
          )}
        </section>
      </div>
    </section>
  );
}
