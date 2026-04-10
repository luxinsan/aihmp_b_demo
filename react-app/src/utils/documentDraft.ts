import { services } from "../data/services";
import type { ContentWidget, ContentWidgetType } from "../types/contentWidget";
import type { ReportRecord } from "../types/report";
import type {
  ReportDocumentDraft,
  SectionContentItem,
  SectionWidgetItem,
} from "../types/documentDraft";

function getInputScope(report: ReportRecord) {
  const promptSource = report.selectedSources?.find((item) => item.startsWith("自然语言描述："));
  if (promptSource) {
    return promptSource.replace("自然语言描述：", "");
  }

  if (report.selectedSources?.length) {
    return report.selectedSources.join("、");
  }

  return "全部档案数据";
}

function cloneWidget(widget: ContentWidget): ContentWidget {
  return {
    ...widget,
    assetSrc: widget.assetSrc,
    columns: widget.columns ? [...widget.columns] : undefined,
    metrics: widget.metrics ? widget.metrics.map((item) => ({ ...item })) : undefined,
    rows: widget.rows ? widget.rows.map((row) => [...row]) : undefined,
  };
}

function createParagraphItem(id: string, text: string): SectionContentItem {
  return {
    id,
    type: "paragraph",
    text,
    tagName: "p",
  };
}

function createBulletItem(id: string, text: string): SectionContentItem {
  return {
    id,
    type: "bullet",
    text,
  };
}

function createWidgetItem(id: string, widget: ContentWidget): SectionWidgetItem {
  return {
    id,
    type: "widget",
    widget,
  };
}

function createSectionContentItems(
  sectionId: string,
  paragraphs: string[],
  bullets: string[],
  widgets: ContentWidget[],
) {
  const items: SectionContentItem[] = [
    ...paragraphs.map((paragraph, index) => createParagraphItem(`${sectionId}-paragraph-${index}`, paragraph)),
    ...bullets.map((bullet, index) => createBulletItem(`${sectionId}-bullet-${index}`, bullet)),
    ...widgets.map((widget, index) =>
      createWidgetItem(`${sectionId}-widget-${index}`, cloneWidget(widget)),
    ),
  ];

  items.push(createParagraphItem(`${sectionId}-paragraph-trailing`, ""));
  return items;
}

export function createWidgetBlock(type: ContentWidgetType, widgetId: string): ContentWidget {
  if (type === "image") {
    return {
      id: widgetId,
      type,
      title: "新增图片",
      caption: "用于放置报告截图、检查影像或关键图示。",
      assetLabel: "等待上传图片素材",
    };
  }

  if (type === "table") {
    return {
      id: widgetId,
      type,
      title: "新增表格",
      caption: "",
      columns: [],
      rows: [
        ["", ""],
        ["", ""],
        ["", ""],
      ],
    };
  }

  return {
    id: widgetId,
    type,
    title: "生活方式评估图",
    caption: "用于展示饮食、运动、睡眠与压力等维度的综合评分。",
    metrics: [
      { label: "饮食", value: null },
      { label: "身体活动", value: null },
      { label: "烟草暴露", value: null },
      { label: "睡眠健康", value: null },
      { label: "体重", value: null },
      { label: "血脂", value: null },
      { label: "血糖", value: null },
      { label: "血压", value: null },
    ],
  };
}

export function createDocumentDraft(report: ReportRecord): ReportDocumentDraft {
  const service = services[report.serviceId];

  return {
    title: report.title,
    coverLine: service.coverLine,
    coverEn: service.coverEn,
    bodyIntro: service.bodyIntro,
    inputScope: getInputScope(report),
    category: service.category,
    date: report.date,
    sections: service.blocks.map((block, index) => ({
      id: `${report.id}-section-${index}`,
      title: block.title,
      paragraphs: [...(block.paragraphs ?? [])],
      bullets: [...(block.bullets ?? [])],
      widgets: (block.widgets ?? []).map(cloneWidget),
      contentItems: createSectionContentItems(
        `${report.id}-section-${index}`,
        [...(block.paragraphs ?? [])],
        [...(block.bullets ?? [])],
        (block.widgets ?? []).map(cloneWidget),
      ),
    })),
  };
}
