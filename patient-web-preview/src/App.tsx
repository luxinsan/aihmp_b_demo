import { useEffect, useMemo, useRef, useState } from "react";
import { LineChart } from "echarts/charts";
import { GridComponent, MarkLineComponent, TooltipComponent } from "echarts/components";
import * as echarts from "echarts/core";
import type { EChartsCoreOption } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { patientMiniappHealthPlanPageData } from "../../shared/adapters/patient-app";

echarts.use([LineChart, GridComponent, MarkLineComponent, TooltipComponent, CanvasRenderer]);

type PatientPreviewTab = "home" | "health-plan" | "mine";

type HealthPlanSubPage = "plan" | "weekly-summary" | "weekly-summary-charts";

type HealthPlanTaskTab = "health-task" | "checkin-task" | "summary-evaluation";

type PreviewSurface = "phone-launcher" | "wechat-list" | "miniapp";

const tabs: Array<{ id: PatientPreviewTab; label: string }> = [
  { id: "home", label: "首页" },
  { id: "health-plan", label: "健康计划" },
  { id: "mine", label: "我的" },
];

const teamOptions = ["瑞宁慢病管理团队", "康衡随访管理团队", "嘉和术后康复团队"];

type PatientOption = {
  id: "p-001" | "p-002" | "p-003";
  name: string;
  gender: string;
  age: number;
  relation: string;
};

type HealthTask = {
  id: string;
  title: string;
  desc: string;
  status: string;
};

const patientOptions: PatientOption[] = [
  { id: "p-001", name: "张三", gender: "男", age: 58, relation: "本人" },
  { id: "p-002", name: "李四", gender: "女", age: 63, relation: "配偶" },
  { id: "p-003", name: "王五", gender: "男", age: 71, relation: "父亲" },
];

const defaultPatient: PatientOption = patientOptions[0]!;

const healthServices = [
  { id: "pre-consult", name: "预问诊", icon: "问" },
  { id: "priority", name: "精准加号", icon: "号" },
  { id: "package", name: "健康服务包", icon: "包" },
  { id: "assessment", name: "健康评估", icon: "评" },
];

const healthMetrics = [
  { id: "weight", name: "体重", value: "68.5", unit: "kg" },
  { id: "glucose", name: "血糖", value: "5.8", unit: "mmol/L" },
  { id: "pressure", name: "血压", value: "126/82", unit: "mmHg" },
];

const healthTasksByPatientId: Record<PatientOption["id"], HealthTask[]> = {
  "p-001": [
    { id: "task-001", title: "早餐后血糖记录", desc: "今日 09:30 前完成一次录入", status: "待完成" },
    { id: "task-002", title: "降压药服药确认", desc: "午间用药后确认服药状态", status: "进行中" },
    { id: "task-003", title: "本周随访问卷", desc: "还剩 4 个问题待填写", status: "未开始" },
  ],
  "p-002": [
    { id: "task-004", title: "晨起血压打卡", desc: "今日需补充晨间血压数据", status: "待完成" },
    { id: "task-005", title: "饮食记录上传", desc: "晚餐后补充今日饮食照片", status: "进行中" },
    { id: "task-006", title: "步行训练提醒", desc: "建议完成 20 分钟轻量步行", status: "未开始" },
  ],
  "p-003": [
    { id: "task-007", title: "空腹血糖复测", desc: "明早 08:00 前完成并上传", status: "待完成" },
    { id: "task-008", title: "睡前血压确认", desc: "睡前补充一次血压测量", status: "未开始" },
    { id: "task-009", title: "康复训练反馈", desc: "今日训练后记录体感反馈", status: "进行中" },
  ],
};

type SummaryTrendPoint = {
  label: string;
  value: number;
};

type SummaryTrendBand = {
  label: string;
  from: number;
  to: number;
  color: string;
};

type SummaryTrendConfig = {
  id: string;
  title: string;
  unit: string;
  currentValue: string;
  deltaValue: string;
  targetValue: string;
  targetLabel: string;
  points: SummaryTrendPoint[];
  min: number;
  max: number;
  lineColor: string;
  areaColor: string;
  pointColor: string;
  bands?: SummaryTrendBand[];
};

const weightSummaryDetail = {
  title: "每周总结",
  cycleLabel: "周报",
  cycleRange: "2026.04.15 - 2026.04.21",
  manageDays: 28,
  initialWeight: "65.1 kg",
  targetWeight: "58.0 kg",
  currentWeight: "59.8 kg",
  completionStatus: "偏高",
  checkInCount: 18,
  dietCheckInCount: 8,
  dietCommentCount: 5,
  exerciseCheckInCount: 6,
  trendCharts: [
    {
      id: "weight",
      title: "体重变化",
      unit: "kg",
      currentValue: "59.8",
      deltaValue: "-1.1",
      targetValue: "58.0",
      targetLabel: "目标",
      min: 58,
      max: 67,
      lineColor: "#2f8cff",
      areaColor: "rgba(47, 140, 255, 0.14)",
      pointColor: "#2f8cff",
      points: [
        { label: "03.27", value: 66.4 },
        { label: "04.02", value: 65.8 },
        { label: "04.08", value: 64.9 },
        { label: "04.14", value: 64.1 },
        { label: "04.21", value: 63.6 },
        { label: "04.28", value: 62.7 },
        { label: "05.05", value: 61.9 },
        { label: "05.12", value: 61.2 },
        { label: "05.19", value: 60.3 },
        { label: "05.26", value: 59.8 },
      ],
    },
    {
      id: "bmi",
      title: "BMI变化",
      unit: "kg/m²",
      currentValue: "26.5",
      deltaValue: "-0.8",
      targetValue: "24.0",
      targetLabel: "达标线",
      min: 22,
      max: 32,
      lineColor: "#31b26f",
      areaColor: "rgba(49, 178, 111, 0.12)",
      pointColor: "#31b26f",
      bands: [
        { label: "未达标", from: 28, to: 32, color: "rgba(255, 110, 110, 0.14)" },
        { label: "未达标", from: 24, to: 28, color: "rgba(255, 194, 64, 0.14)" },
        { label: "达标", from: 22, to: 24, color: "rgba(84, 201, 118, 0.12)" },
      ],
      points: [
        { label: "03.27", value: 29.8 },
        { label: "04.02", value: 29.3 },
        { label: "04.08", value: 28.9 },
        { label: "04.14", value: 28.4 },
        { label: "04.21", value: 28.1 },
        { label: "04.28", value: 27.7 },
        { label: "05.05", value: 27.3 },
        { label: "05.12", value: 27.0 },
        { label: "05.19", value: 26.8 },
        { label: "05.26", value: 26.5 },
      ],
    },
    {
      id: "fat-rate",
      title: "体脂率变化",
      unit: "%",
      currentValue: "31.2",
      deltaValue: "-1.5",
      targetValue: "28.0",
      targetLabel: "目标",
      min: 26,
      max: 35,
      lineColor: "#7a63ff",
      areaColor: "rgba(122, 99, 255, 0.12)",
      pointColor: "#7a63ff",
      points: [
        { label: "03.27", value: 34.1 },
        { label: "04.02", value: 33.7 },
        { label: "04.08", value: 33.5 },
        { label: "04.14", value: 33.1 },
        { label: "04.21", value: 32.8 },
        { label: "04.28", value: 32.5 },
        { label: "05.05", value: 32.2 },
        { label: "05.12", value: 31.9 },
        { label: "05.19", value: 31.5 },
        { label: "05.26", value: 31.2 },
      ],
    },
  ] satisfies SummaryTrendConfig[],
  review:
    "本周期体重与 BMI 持续下降，整体执行节奏稳定，饮食控制与运动配合较为积极。当前距离目标体重仍有 1.8kg，体脂率下降速度略慢，说明减重质量仍需继续优化。",
  suggestions: [
    "饮食建议：继续维持晚餐减量和高蛋白早餐搭配，减少外卖与夜宵频次。",
    "运动建议：每周至少完成 4 次 30 分钟快走或骑行，并增加 2 次轻力量训练。",
    "管理建议：保持每周总结查看与复盘，重点关注体脂率与饮食打卡连续性。",
  ],
};

function useInitialTab(): PatientPreviewTab {
  return useMemo(() => {
    if (typeof window === "undefined") {
      return "home";
    }

    const currentTab = new URLSearchParams(window.location.search).get("tab");
    return currentTab === "health-plan" || currentTab === "mine" ? currentTab : "home";
  }, []);
}

function TabIcon({ tabId, active }: { tabId: PatientPreviewTab; active: boolean }) {
  if (tabId === "home") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        {active ? (
          <>
            <path d="M5.75 10.25 12 5l6.25 5.25v7a1.5 1.5 0 0 1-1.5 1.5h-9.5a1.5 1.5 0 0 1-1.5-1.5v-7Z" />
            <path d="M9.75 18.75v-4.35a.9.9 0 0 1 .9-.9h2.7a.9.9 0 0 1 .9.9v4.35" />
          </>
        ) : (
          <>
            <path d="M5.75 10.25 12 5l6.25 5.25v7a1.5 1.5 0 0 1-1.5 1.5h-9.5a1.5 1.5 0 0 1-1.5-1.5v-7Z" />
            <path d="M9.5 18.75v-4.5a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v4.5" />
          </>
        )}
      </svg>
    );
  }

  if (tabId === "health-plan") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        {active ? (
          <>
            <rect x="6" y="4.75" width="12" height="14.5" rx="2.25" />
            <path d="M9 9h6" />
            <path d="M9 12.25h6" />
            <path d="M9 15.5h3.5" />
          </>
        ) : (
          <>
            <rect x="6" y="4.75" width="12" height="14.5" rx="2.25" />
            <path d="M9 9h6" />
            <path d="M9 12.25h6" />
            <path d="M9 15.5h3.5" />
          </>
        )}
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      {active ? (
        <>
          <circle cx="12" cy="8.75" r="3.45" />
          <path d="M6.6 18.25c0-2.65 2.42-4.8 5.4-4.8s5.4 2.15 5.4 4.8" />
        </>
      ) : (
        <>
          <circle cx="12" cy="9" r="3.25" />
          <path d="M6.75 18a5.25 5.25 0 0 1 10.5 0" />
        </>
      )}
    </svg>
  );
}

function PlaceholderPage({ title }: { title: string }) {
  return (
    <>
      <section className="miniapp-preview-card">
        <p className="miniapp-preview-kicker">Container Only</p>
        <h2>{title}</h2>
        <p>当前仅保留页面骨架，这个 tab 的具体内容后续再单独构建。</p>
      </section>
      <section className="miniapp-preview-card miniapp-preview-card-large" />
      <section className="miniapp-preview-card" />
    </>
  );
}

function normalizePatientMetricStatus(status: string) {
  return status === "达标" ? "达标" : "未达标";
}

function ChevronLeftIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m14.5 6.5-5 5 5 5" />
    </svg>
  );
}

function TrendChartCard({ chart }: { chart: SummaryTrendConfig }) {
  return (
    <section className="miniapp-preview-summary-chart-card">
      <div className="miniapp-preview-summary-chart-head">
        <div>
          <p className="miniapp-preview-summary-chart-label">{chart.title}</p>
          <div className="miniapp-preview-summary-chart-value-row">
            <strong>{chart.currentValue}</strong>
            <span>{chart.unit}</span>
          </div>
        </div>
        <div className="miniapp-preview-summary-chart-meta">
          <span>周期变化 {chart.deltaValue}</span>
          <span>
            {chart.targetLabel} {chart.targetValue}
          </span>
        </div>
      </div>

      <div className="miniapp-preview-summary-chart-plot">
        {chart.bands?.map((band) => {
          const range = chart.max - chart.min || 1;
          const top = ((chart.max - band.to) / range) * 100;
          const height = ((band.to - band.from) / range) * 100;

          return (
            <div
              className="miniapp-preview-summary-chart-band"
              key={band.label}
              style={{
                backgroundColor: band.color,
                height: `${height}%`,
                top: `${top}%`,
              }}
            >
              <span>{band.label}</span>
            </div>
          );
        })}
        <div
          className="miniapp-preview-summary-chart-current-badge"
          style={{ backgroundColor: chart.pointColor }}
        >
          {chart.currentValue}
        </div>
        <EChartsTrendLine chart={chart} />
      </div>
    </section>
  );
}

function EChartsTrendLine({ chart }: { chart: SummaryTrendConfig }) {
  const chartRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!chartRef.current) {
      return;
    }

    const instance = echarts.init(chartRef.current, undefined, { renderer: "canvas" });
    const targetValue = Number(chart.targetValue);
    const lastIndex = chart.points.length - 1;
    const option: EChartsCoreOption = {
      animation: true,
      color: [chart.lineColor],
      grid: {
        left: 34,
        right: 16,
        top: 12,
        bottom: 28,
      },
      tooltip: {
        trigger: "axis",
        confine: true,
        axisPointer: {
          type: "line",
          lineStyle: {
            color: "rgba(143, 163, 191, 0.45)",
            type: "dashed",
          },
        },
        formatter: (params: unknown) => {
          const [item] = Array.isArray(params) ? params : [params];
          const point = item as { axisValue?: unknown; value?: unknown };
          return `${point.axisValue ?? ""}<br/>${chart.title}: ${point.value ?? ""} ${chart.unit}`;
        },
      },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: chart.points.map((point) => point.label),
        axisTick: { show: false },
        axisLine: { show: false },
        axisLabel: {
          color: "#8b98aa",
          fontSize: 10,
          hideOverlap: true,
          interval: "auto",
        },
      },
      yAxis: {
        type: "value",
        min: chart.min,
        max: chart.max,
        splitNumber: 4,
        axisTick: { show: false },
        axisLine: { show: false },
        axisLabel: {
          color: "#8b98aa",
          fontSize: 10,
        },
        splitLine: {
          lineStyle: {
            color: "rgba(143, 163, 191, 0.24)",
            type: "dashed",
          },
        },
      },
      series: [
        {
          type: "line",
          data: chart.points.map((point, index) => ({
            value: point.value,
            symbolSize: index === lastIndex ? 8 : 4,
          })),
          smooth: true,
          symbol: "circle",
          lineStyle: {
            width: 3.5,
            color: chart.lineColor,
            shadowColor: "rgba(31, 111, 235, 0.18)",
            shadowBlur: 8,
            shadowOffsetY: 4,
          },
          itemStyle: {
            color: chart.pointColor,
            borderColor: "#ffffff",
            borderWidth: 2,
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: chart.areaColor },
              { offset: 1, color: "rgba(255, 255, 255, 0)" },
            ]),
          },
          markLine: Number.isFinite(targetValue)
            ? {
                symbol: "none",
                silent: true,
                data: [
                  {
                    yAxis: targetValue,
                    name: chart.targetLabel,
                    label: {
                      formatter: `${chart.targetLabel} ${chart.targetValue}`,
                      position: "insideStartTop",
                      color: "#d47a00",
                      fontSize: 10,
                      fontWeight: 700,
                    },
                    lineStyle: {
                      color: "#ff9f1c",
                      type: "dashed",
                      width: 1.5,
                    },
                  },
                ],
              }
            : undefined,
        },
      ],
    };

    instance.setOption(option);

    const resize = () => instance.resize();
    const resizeObserver =
      typeof ResizeObserver === "undefined" ? null : new ResizeObserver(() => instance.resize());
    resizeObserver?.observe(chartRef.current);
    window.addEventListener("resize", resize);

    return () => {
      resizeObserver?.disconnect();
      window.removeEventListener("resize", resize);
      instance.dispose();
    };
  }, [chart]);

  return <div className="miniapp-preview-summary-chart-canvas" ref={chartRef} />;
}

function StageSummaryChartsPage() {
  const primaryChart = weightSummaryDetail.trendCharts[0]!;

  return (
    <div className="miniapp-preview-summary-chart-page">
      <section className="miniapp-preview-trend-overview">
        <div className="miniapp-preview-trend-overview-head">
          <span>减重周期：6个月</span>
          <button type="button">去记录</button>
        </div>
        <div className="miniapp-preview-trend-overview-main">
          <div>
            <strong>{primaryChart.currentValue}</strong>
            <span>{primaryChart.unit}</span>
          </div>
          <div className="miniapp-preview-trend-overview-delta">
            <strong>{primaryChart.deltaValue} kg</strong>
            <span>目标：{primaryChart.targetValue}kg</span>
          </div>
        </div>
        <div className="miniapp-preview-trend-overview-tags">
          <span>BMI 23.8</span>
          <em>{normalizePatientMetricStatus(weightSummaryDetail.completionStatus)}</em>
          <span>较目标 +1.8kg</span>
        </div>
      </section>

      <section className="miniapp-preview-trend-chart-panel">
        <div className="miniapp-preview-trend-chart-panel-head">
          <strong>体重变化趋势图</strong>
          <span>kg 公斤</span>
        </div>
        <div className="miniapp-preview-summary-chart-list is-trend-page">
          {weightSummaryDetail.trendCharts.map((chart) => (
            <TrendChartCard key={chart.id} chart={chart} />
          ))}
        </div>
        <p className="miniapp-preview-trend-update-time">数据更新于：2026.04.21 20:30</p>
      </section>
    </div>
  );
}

function StageSummaryDetailPage({
  onOpenCharts,
}: {
  onOpenCharts: () => void;
}) {
  return (
    <div className="miniapp-preview-summary-detail">
      <p className="miniapp-preview-summary-plan-name">
        {patientMiniappHealthPlanPageData.overview.title}
      </p>

      <section className="miniapp-preview-summary-hero">
        <div className="miniapp-preview-summary-hero-copy">
          <h2>{weightSummaryDetail.title}</h2>
          <span>
            {weightSummaryDetail.cycleLabel} · {weightSummaryDetail.cycleRange}
          </span>
          <em>基于近 7 天健康管理情况进行分析总结</em>
        </div>
      </section>

      <section className="miniapp-preview-summary-section is-goal-aligned">
        <div className="miniapp-preview-goal-card-head">
          <div>
            <strong>体重</strong>
            <span>kg</span>
          </div>
          <em>{normalizePatientMetricStatus(weightSummaryDetail.completionStatus)}</em>
        </div>

        <div className="miniapp-preview-goal-card-metrics">
          <div>
            <span>初始</span>
            <strong>{weightSummaryDetail.initialWeight.replace(" kg", "")}</strong>
          </div>
          <div>
            <span>目标线</span>
            <strong>{weightSummaryDetail.targetWeight.replace(" kg", "")}</strong>
          </div>
          <div>
            <span>当前</span>
            <strong>{weightSummaryDetail.currentWeight.replace(" kg", "")}</strong>
          </div>
        </div>

        <button className="miniapp-preview-goal-trend-link" type="button" onClick={onOpenCharts}>
          <span>查看更多指标趋势</span>
          <em>›</em>
        </button>
      </section>

      <section className="miniapp-preview-summary-section">
        <div className="miniapp-preview-summary-section-head">
          <strong>打卡情况</strong>
        </div>
        <div className="miniapp-preview-summary-stat-grid compact is-two">
          <article className="miniapp-preview-summary-stat-card">
            <span>参与管理天数</span>
            <strong>{weightSummaryDetail.manageDays} 天</strong>
          </article>
          <article className="miniapp-preview-summary-stat-card">
            <span>完成打卡次数</span>
            <strong>{weightSummaryDetail.checkInCount} 次</strong>
          </article>
        </div>

        <div className="miniapp-preview-summary-checkin-list">
          <article className="miniapp-preview-summary-checkin-item">
            <strong>饮食打卡</strong>
            <p>
              完成打卡{weightSummaryDetail.dietCheckInCount}次，医师点评
              {weightSummaryDetail.dietCommentCount}次
            </p>
          </article>
          <article className="miniapp-preview-summary-checkin-item">
            <strong>运动打卡</strong>
            <p>完成打卡{weightSummaryDetail.exerciseCheckInCount}次</p>
          </article>
        </div>
      </section>

      <section className="miniapp-preview-summary-section">
        <div className="miniapp-preview-summary-section-head">
          <strong>指标变化图</strong>
          <span>关联体重管理目标</span>
        </div>
        <button className="miniapp-preview-summary-chart-entry" type="button" onClick={onOpenCharts}>
          <div>
            <span>体重变化趋势图</span>
            <strong>体重 / BMI / 体脂率</strong>
            <p>查看近 30 天指标变化、目标线和当前数据位置</p>
          </div>
          <em>查看图表</em>
        </button>
      </section>

      <section className="miniapp-preview-summary-section">
        <div className="miniapp-preview-summary-section-head">
          <strong>总结评价</strong>
          <span>回顾与建议</span>
        </div>
        <div className="miniapp-preview-summary-evaluation">
          <article className="miniapp-preview-summary-evaluation-card">
            <span>回顾评价</span>
            <p>{weightSummaryDetail.review}</p>
          </article>

          <article className="miniapp-preview-summary-evaluation-card">
            <span>建议</span>
            <div className="miniapp-preview-summary-suggestion-list">
              {weightSummaryDetail.suggestions.map((suggestion) => (
                <p key={suggestion}>{suggestion}</p>
              ))}
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}

function HealthPlanPage({
  subPage,
  onOpenSubPage,
  activeTaskTab,
  taskTabs,
  onSelectTaskTab,
}: {
  subPage: HealthPlanSubPage;
  onOpenSubPage: (subPage: HealthPlanSubPage) => void;
  activeTaskTab: HealthPlanTaskTab;
  taskTabs: Array<{ id: HealthPlanTaskTab; label: string }>;
  onSelectTaskTab: (tab: HealthPlanTaskTab) => void;
}) {
  const [tasks, setTasks] = useState(patientMiniappHealthPlanPageData.tasks);
  const healthTasks = tasks.filter((task) => task.category !== "阶段总结");
  const summaryTasks = tasks.filter((task) => task.category === "阶段总结");

  function handleCompleteTask(taskId: string) {
    setTasks((currentTasks) =>
      currentTasks.map((task) => {
        if (task.id !== taskId || task.status === "已完成" || task.status === "已终止") {
          return task;
        }

        return {
          ...task,
          status: "已完成",
        };
      }),
    );
  }

  if (subPage === "weekly-summary-charts") {
    return <StageSummaryChartsPage />;
  }

  if (subPage === "weekly-summary") {
    return (
      <StageSummaryDetailPage
        onOpenCharts={() => onOpenSubPage("weekly-summary-charts")}
      />
    );
  }

  return (
    <>
      <section className="miniapp-preview-plan-summary">
        <div className="miniapp-preview-plan-summary-head">
          <div className="miniapp-preview-plan-summary-copy">
            <p className="miniapp-preview-plan-kicker">健康管理计划</p>
            <h2>{patientMiniappHealthPlanPageData.overview.title}</h2>
            <p>{patientMiniappHealthPlanPageData.overview.description}</p>
          </div>
          <span className="miniapp-preview-plan-status">{patientMiniappHealthPlanPageData.overview.status}</span>
        </div>

      </section>

      <div className="miniapp-preview-plan-task-tabs is-inline" role="tablist" aria-label="健康计划任务分类">
        {taskTabs.map((tab) => (
          <button
            className={`miniapp-preview-plan-task-tab${activeTaskTab === tab.id ? " active" : ""}`}
            key={tab.id}
            type="button"
            onClick={() => onSelectTaskTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <section className="miniapp-preview-plan-task-section">
        <div className="miniapp-preview-plan-task-list">
          {activeTaskTab === "health-task" ? healthTasks.map((task) => {
            const isViewOnly = task.status === "待查看" || task.category === "阶段总结";
            const isDone = task.status === "已完成";
            const isStopped = task.status === "已终止";
            const canComplete = !isViewOnly && !isDone && !isStopped;

            return (
              <article className="miniapp-preview-plan-task-card" key={task.id}>
                <div className="miniapp-preview-plan-task-top">
                  <div className="miniapp-preview-plan-task-main">
                    <div className="miniapp-preview-plan-task-meta">
                      <span className={`miniapp-preview-plan-category tone-${task.categoryTone}`}>{task.category}</span>
                      <span className={`miniapp-preview-plan-task-status status-${task.status}`}>{task.status}</span>
                    </div>
                    <strong className="miniapp-preview-plan-task-title">{task.title}</strong>
                  </div>

                  <button
                    className={`miniapp-preview-plan-task-action${canComplete || isViewOnly ? "" : " disabled"}${isViewOnly ? " secondary" : ""}`}
                    type="button"
                    disabled={!canComplete && !isViewOnly}
                    onClick={() => {
                      if (canComplete) {
                        handleCompleteTask(task.id);
                      }

                      if (isViewOnly && task.id === "weekly-summary") {
                        onOpenSubPage("weekly-summary");
                      }
                    }}
                  >
                    {isViewOnly ? "查看" : isDone ? "已完成" : isStopped ? "已终止" : "完成"}
                  </button>
                </div>
                <div className="miniapp-preview-plan-task-foot">
                  <p className="miniapp-preview-plan-task-date">{task.dateRange}</p>
                  {isViewOnly && task.detail ? <p className="miniapp-preview-plan-task-detail">{task.detail}</p> : null}
                </div>
              </article>
            );
          }) : null}

          {activeTaskTab === "checkin-task"
            ? patientMiniappHealthPlanPageData.checkIns.map((checkIn) => (
                <article className="miniapp-preview-plan-task-card" key={checkIn.id}>
                  <div className="miniapp-preview-plan-task-top">
                    <div className="miniapp-preview-plan-task-main">
                      <div className="miniapp-preview-plan-task-meta">
                        <span className="miniapp-preview-plan-category tone-green">打卡</span>
                        <span className={`miniapp-preview-plan-task-status status-${checkIn.status}`}>
                          {checkIn.status}
                        </span>
                      </div>
                      <strong className="miniapp-preview-plan-task-title">{checkIn.title}</strong>
                    </div>
                  </div>
                  <div className="miniapp-preview-plan-task-foot">
                    <p className="miniapp-preview-plan-task-date">{checkIn.schedule}</p>
                    <p className="miniapp-preview-plan-task-detail">{checkIn.description}</p>
                  </div>
                </article>
              ))
            : null}

          {activeTaskTab === "summary-evaluation"
            ? summaryTasks.map((task) => (
                <article className="miniapp-preview-plan-task-card" key={task.id}>
                  <div className="miniapp-preview-plan-task-top">
                    <div className="miniapp-preview-plan-task-main">
                      <div className="miniapp-preview-plan-task-meta">
                        <span className={`miniapp-preview-plan-category tone-${task.categoryTone}`}>{task.category}</span>
                        <span className={`miniapp-preview-plan-task-status status-${task.status}`}>{task.status}</span>
                      </div>
                      <strong className="miniapp-preview-plan-task-title">{task.title}</strong>
                    </div>

                    <button
                      className="miniapp-preview-plan-task-action secondary"
                      type="button"
                      onClick={() => onOpenSubPage("weekly-summary")}
                    >
                      查看
                    </button>
                  </div>
                  <div className="miniapp-preview-plan-task-foot">
                    <p className="miniapp-preview-plan-task-date">{task.dateRange}</p>
                    {task.detail ? <p className="miniapp-preview-plan-task-detail">{task.detail}</p> : null}
                  </div>
                </article>
              ))
            : null}
        </div>
      </section>
    </>
  );
}

type HomePageProps = {
  teamIndex: number;
  onOpenTeamSheet: () => void;
};

function HomePage({ teamIndex, onOpenTeamSheet }: HomePageProps) {
  const [activePatientId, setActivePatientId] = useState<PatientOption["id"]>("p-001");
  const activePatient = patientOptions.find((patient) => patient.id === activePatientId) ?? defaultPatient;
  const activePatientTasks = healthTasksByPatientId[activePatient.id];

  return (
    <>
      <div className="miniapp-preview-floating-filter">
        <button className="miniapp-preview-team-switch" type="button" onClick={onOpenTeamSheet}>
          <span>{teamOptions[teamIndex]}</span>
          <span>∨</span>
        </button>
      </div>

      <section className="miniapp-preview-card miniapp-preview-patient-switcher" />
      <section className="miniapp-preview-ai-inline">
        <div className="miniapp-preview-ai-inline-input">
          <div className="miniapp-preview-ai-inline-label">
            <div className="miniapp-preview-ai-assistant-badge">AI</div>
            <strong>AI 助手</strong>
          </div>
          <div className="miniapp-preview-ai-inline-row">
            <span>请输入你想咨询的问题</span>
            <div className="miniapp-preview-ai-inline-send">➤</div>
          </div>
        </div>
      </section>
      <section className="miniapp-preview-service-section">
        <div className="miniapp-preview-service-header">
          <strong>健康服务</strong>
        </div>
        <div className="miniapp-preview-service-grid">
          {healthServices.map((service) => (
            <div className="miniapp-preview-service-item" key={service.id}>
              <div className="miniapp-preview-service-icon">{service.icon}</div>
              <span>{service.name}</span>
            </div>
          ))}
        </div>
      </section>
      <div className="miniapp-preview-patient-chip-list miniapp-preview-data-patient-list">
        {patientOptions.map((patient) => {
          const isActive = patient.id === activePatientId;

          return (
            <button
              className={`miniapp-preview-patient-chip miniapp-preview-patient-chip-compact${isActive ? " active" : ""}`}
              key={patient.id}
              type="button"
              onClick={() => setActivePatientId(patient.id)}
            >
              <div className="miniapp-preview-patient-chip-avatar">{patient.name.slice(0, 1)}</div>
              <div className="miniapp-preview-patient-chip-text">
                <strong>{patient.name}</strong>
                {isActive ? <span>{patient.gender} {patient.age}岁</span> : null}
              </div>
            </button>
          );
        })}
      </div>
      <section className="miniapp-preview-service-section">
        <div className="miniapp-preview-service-header">
          <strong>健康数据</strong>
        </div>
        <div className="miniapp-preview-data-grid">
          {healthMetrics.map((metric) => (
            <div className="miniapp-preview-data-card" key={metric.id}>
              <span className="miniapp-preview-data-label">{metric.name}</span>
              <div className="miniapp-preview-data-value-row">
                <strong className="miniapp-preview-data-value">{metric.value}</strong>
                <span className="miniapp-preview-data-unit">{metric.unit}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="miniapp-preview-service-section miniapp-preview-task-section">
        <div className="miniapp-preview-service-header miniapp-preview-task-header">
          <div className="miniapp-preview-task-heading">
            <strong>健康任务</strong>
            <p>{activePatient.name}的当前待跟进任务</p>
          </div>
        </div>
        <div className="miniapp-preview-task-list">
          {activePatientTasks.map((task) => (
            <div className="miniapp-preview-task-card" key={task.id}>
              <div className="miniapp-preview-task-card-top">
                <strong>{task.title}</strong>
                <span>{task.status}</span>
              </div>
              <p>{task.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

function WechatBackIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m15 5-7 7 7 7" />
    </svg>
  );
}

function PhoneLauncherPage({ onOpenWechat }: { onOpenWechat: () => void }) {
  return (
    <>
      <section className="phone-launcher-screen">
        <div className="phone-launcher-status">
          <span>14:20</span>
          <span>5G 100%</span>
        </div>
        <button className="phone-launcher-app" type="button" onClick={onOpenWechat}>
          <span className="phone-launcher-wechat-icon">
            <span />
            <span />
          </span>
          <strong>微信</strong>
        </button>
      </section>
      <div className="miniapp-preview-home-indicator" aria-hidden="true" />
    </>
  );
}

function WechatConversationListPage({
  onBack,
  onOpenMiniapp,
}: {
  onBack: () => void;
  onOpenMiniapp: () => void;
}) {
  return (
    <>
      <section className="wechat-session-nav">
        <div className="miniapp-preview-status-spacer" />
        <header className="wechat-session-header">
          <button type="button" aria-label="返回应用菜单" onClick={onBack}>
            <WechatBackIcon />
          </button>
          <h1>微信</h1>
          <span aria-hidden="true">···</span>
        </header>
      </section>

      <section className="wechat-list-body">
        <div className="wechat-list-search">搜索</div>
        <button className="wechat-list-miniapp-entry" type="button" onClick={onOpenMiniapp}>
          <div className="wechat-list-miniapp-icon">健</div>
          <div>
            <strong>健康管理</strong>
            <span>小程序</span>
          </div>
          <em>›</em>
        </button>
      </section>

      <section className="wechat-list-tabbar">
        {["微信", "通讯录", "发现", "我"].map((item) => (
          <button className={item === "微信" ? "active" : ""} key={item} type="button">
            <span />
            <strong>{item}</strong>
          </button>
        ))}
      </section>
      <div className="miniapp-preview-home-indicator" aria-hidden="true" />
    </>
  );
}

export default function App() {
  const initialTab = useInitialTab();
  const initialSurface: PreviewSurface =
    typeof window !== "undefined" && new URLSearchParams(window.location.search).get("surface") === "miniapp"
      ? "miniapp"
      : "phone-launcher";
  const [previewSurface, setPreviewSurface] = useState<PreviewSurface>(initialSurface);
  const [activeTab, setActiveTab] = useState<PatientPreviewTab>(initialTab);
  const [activeTaskTab, setActiveTaskTab] = useState<HealthPlanTaskTab>("health-task");
  const [healthPlanSubPage, setHealthPlanSubPage] = useState<HealthPlanSubPage>("plan");
  const [teamIndex, setTeamIndex] = useState(0);
  const [isTeamSheetOpen, setIsTeamSheetOpen] = useState(false);
  const [isTaskTabsPinned, setIsTaskTabsPinned] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const isHealthPlanNestedPage = activeTab === "health-plan" && healthPlanSubPage !== "plan";
  const canPinTaskTabs =
    previewSurface === "miniapp" && activeTab === "health-plan" && healthPlanSubPage === "plan";
  const taskTabs: Array<{ id: HealthPlanTaskTab; label: string }> = [
    { id: "health-task", label: "健康任务" },
    { id: "checkin-task", label: "打卡任务" },
    { id: "summary-evaluation", label: "总结评估" },
  ];
  const currentTitle =
    activeTab === "health-plan" && healthPlanSubPage === "weekly-summary"
      ? "每周总结"
      : activeTab === "health-plan" && healthPlanSubPage === "weekly-summary-charts"
        ? "体重变化趋势图"
        : activeTab === "health-plan" || activeTab === "home"
          ? "健康管理"
          : tabs.find((tab) => tab.id === activeTab)?.label ?? "首页";

  function handleHeaderBack() {
    if (activeTab !== "health-plan") {
      return;
    }

    if (healthPlanSubPage === "weekly-summary-charts") {
      setHealthPlanSubPage("weekly-summary");
      return;
    }

    setHealthPlanSubPage("plan");
  }

  function handleSelectTab(tabId: PatientPreviewTab) {
    setActiveTab(tabId);

    if (tabId !== "health-plan") {
      setHealthPlanSubPage("plan");
    }
  }

  function handleOpenMiniappFromWechat() {
    setPreviewSurface("miniapp");
    setActiveTab("home");
    setHealthPlanSubPage("plan");
  }

  function handleCloseMiniapp() {
    setPreviewSurface("wechat-list");
    setHealthPlanSubPage("plan");
  }

  function updateTaskTabsPinned(scrollElement = scrollRef.current) {
    if (!canPinTaskTabs || !scrollElement) {
      setIsTaskTabsPinned(false);
      return;
    }

    const inlineTabs = scrollElement.querySelector<HTMLElement>(".miniapp-preview-plan-task-tabs.is-inline");
    if (!inlineTabs) {
      setIsTaskTabsPinned(false);
      return;
    }

    setIsTaskTabsPinned(scrollElement.scrollTop >= inlineTabs.offsetTop - 100);
  }

  useEffect(() => {
    setIsTaskTabsPinned(false);
    const animationFrame = window.requestAnimationFrame(() => updateTaskTabsPinned());

    return () => window.cancelAnimationFrame(animationFrame);
  }, [previewSurface, activeTab, healthPlanSubPage]);

  return (
    <main className="miniapp-preview-shell">
      <section className="miniapp-preview-phone">
        <div className="miniapp-preview-notch" aria-hidden="true" />
        {previewSurface === "phone-launcher" ? (
          <PhoneLauncherPage onOpenWechat={() => setPreviewSurface("wechat-list")} />
        ) : previewSurface === "wechat-list" ? (
          <WechatConversationListPage
            onBack={() => setPreviewSurface("phone-launcher")}
            onOpenMiniapp={handleOpenMiniappFromWechat}
          />
        ) : (
          <>
            <section className="miniapp-preview-nav">
              <div className="miniapp-preview-status-spacer" />
              <header className="miniapp-preview-header">
                {isHealthPlanNestedPage ? (
                  <button className="miniapp-preview-header-back" type="button" aria-label="返回" onClick={handleHeaderBack}>
                    <ChevronLeftIcon />
                  </button>
                ) : null}
                <h1>{currentTitle}</h1>
                <div className="miniapp-preview-capsule">
                  <button className="miniapp-preview-capsule-more" type="button" aria-label="更多">
                    <i />
                    <i />
                    <i />
                  </button>
                  <span className="miniapp-preview-capsule-divider" />
                  <button
                    className="miniapp-preview-capsule-close"
                    type="button"
                    aria-label="关闭"
                    onClick={handleCloseMiniapp}
                  />
                </div>
              </header>
            </section>

            <section className="miniapp-preview-body">
              <div
                className="miniapp-preview-scroll"
                ref={scrollRef}
                onScroll={(event) => updateTaskTabsPinned(event.currentTarget)}
              >
                {activeTab === "home" ? (
                  <HomePage teamIndex={teamIndex} onOpenTeamSheet={() => setIsTeamSheetOpen(true)} />
                ) : activeTab === "health-plan" ? (
                  <HealthPlanPage
                    subPage={healthPlanSubPage}
                    onOpenSubPage={setHealthPlanSubPage}
                    activeTaskTab={activeTaskTab}
                    taskTabs={taskTabs}
                    onSelectTaskTab={setActiveTaskTab}
                  />
                ) : (
                  <PlaceholderPage title={currentTitle} />
                )}
                <div className="miniapp-preview-scroll-spacer" aria-hidden="true" />
              </div>
            </section>

            {isTaskTabsPinned ? (
              <div className="miniapp-preview-plan-task-tabs is-floating" role="tablist" aria-label="健康计划任务分类">
                {taskTabs.map((tab) => (
                  <button
                    className={`miniapp-preview-plan-task-tab${activeTaskTab === tab.id ? " active" : ""}`}
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTaskTab(tab.id)}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            ) : null}

            {activeTab === "home" && isTeamSheetOpen ? (
              <section className="miniapp-preview-team-sheet">
                <button className="miniapp-preview-team-sheet-mask" type="button" aria-label="关闭团队选择" onClick={() => setIsTeamSheetOpen(false)} />
                <div className="miniapp-preview-team-sheet-panel">
                  <div className="miniapp-preview-team-sheet-handle" aria-hidden="true" />
                  <h2>切换管理团队</h2>
                  <div className="miniapp-preview-team-sheet-list">
                    {teamOptions.map((team, index) => (
                      <button
                        className={`miniapp-preview-team-sheet-item${index === teamIndex ? " active" : ""}`}
                        key={team}
                        type="button"
                        onClick={() => {
                          setTeamIndex(index);
                          setIsTeamSheetOpen(false);
                        }}
                      >
                        <span>{team}</span>
                        {index === teamIndex ? <strong>✓</strong> : null}
                      </button>
                    ))}
                  </div>
                </div>
              </section>
            ) : null}

            {activeTab === "home" ? (
              <button className="miniapp-preview-record-fab" type="button">
                <span className="miniapp-preview-record-fab-icon">＋</span>
                <span className="miniapp-preview-record-fab-label">记录</span>
              </button>
            ) : null}

            <nav className="miniapp-preview-tabbar" aria-label="患者端预览导航">
          {tabs.map((tab) => (
            <button
              className={`miniapp-preview-tab${tab.id === activeTab ? " active" : ""}`}
              key={tab.id}
              type="button"
              onClick={() => handleSelectTab(tab.id)}
            >
              <span className="miniapp-preview-tab-icon" aria-hidden="true">
                <TabIcon tabId={tab.id} active={tab.id === activeTab} />
              </span>
              <span>{tab.label}</span>
            </button>
          ))}
            </nav>
            <div className="miniapp-preview-home-indicator" aria-hidden="true" />
          </>
        )}
      </section>
    </main>
  );
}
