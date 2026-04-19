import {
  checkInRecords,
  healthPlanCheckIns,
  healthPlanHeader,
  healthPlanTasks,
  initialReports,
  patientProfile,
} from "../mock";

export const patientMiniappProfile = {
  name: patientProfile.identity.name,
  maskedName: patientProfile.identity.maskedName,
  avatar: patientProfile.identity.avatar,
  gender: patientProfile.identity.gender,
  age: patientProfile.identity.age,
  patientCode: patientProfile.identity.code,
  phone: patientProfile.identity.phone,
};

export const patientMiniappHomePageData = {
  profile: patientMiniappProfile,
  welcomeTitle: "患者健康空间",
  welcomeSummary: "查看最近健康计划、打卡执行情况和健康提醒。",
  stats: [
    {
      id: "plan-progress",
      label: "计划进度",
      value: `${healthPlanTasks.filter((task) => task.status === "已完成").length}/${healthPlanTasks.length}`,
      helper: "已完成任务",
    },
    {
      id: "active-checkins",
      label: "执行中打卡",
      value: String(healthPlanCheckIns.filter((item) => item.status === "执行中").length),
      helper: "当前进行中",
    },
    {
      id: "recent-records",
      label: "最近打卡",
      value: String(checkInRecords.length),
      helper: "累计 mock 记录",
    },
  ],
  upcomingCheckIns: healthPlanCheckIns.slice(0, 3).map((item) => ({
    id: item.id,
    title: item.title,
    schedule: item.schedule,
    status: item.status,
  })),
  latestCheckIn: checkInRecords[0]
    ? {
        id: checkInRecords[0].id,
        title: checkInRecords[0].title,
        type: checkInRecords[0].type,
        submittedAt: checkInRecords[0].submittedAt,
        summary: checkInRecords[0].summary,
      }
    : null,
  latestReports: initialReports.slice(0, 2).map((report) => ({
    id: report.id,
    title: report.title,
    date: report.date,
    status: report.status,
  })),
};

export const patientMiniappHealthPlanPageData = {
  profile: patientMiniappProfile,
  overview: {
    title: healthPlanHeader.title,
    status: healthPlanHeader.status,
    manager: healthPlanHeader.manager,
    description: healthPlanHeader.description,
    summary: healthPlanHeader.summary,
    progressText: `已完成 ${healthPlanTasks.filter((task) => task.status === "已完成").length} / ${healthPlanTasks.length}`,
  },
  checkIns: healthPlanCheckIns.map((item) => ({
    id: item.id,
    title: item.title,
    description: item.description,
    schedule: item.schedule,
    status: item.status,
  })),
  tasks: healthPlanTasks.map((task) => ({
    id: task.id,
    category: task.category,
    categoryTone: task.categoryTone,
    title: task.title,
    dateRange: task.dateRange,
    status: task.status,
    detail: task.detail ?? "",
  })),
};

export const patientMiniappCheckInPageData = {
  profile: patientMiniappProfile,
  summary: {
    total: checkInRecords.length,
    dietCount: checkInRecords.filter((record) => record.type === "饮食打卡").length,
    exerciseCount: checkInRecords.filter((record) => record.type === "运动打卡").length,
    medicationCount: checkInRecords.filter((record) => record.type === "用药打卡").length,
    vitalsCount: checkInRecords.filter((record) => record.type === "体征打卡").length,
  },
  records: checkInRecords.map((record) => ({
    id: record.id,
    date: record.date,
    submittedAt: record.submittedAt,
    title: record.title,
    type: record.type,
    summary: record.summary,
    detail:
      record.type === "饮食打卡"
        ? record.doctorComment
        : record.type === "运动打卡"
          ? record.coachComment
          : record.type === "用药打卡"
            ? record.effectFeedback
            : record.note,
  })),
};
