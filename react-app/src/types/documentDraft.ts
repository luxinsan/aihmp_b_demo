import type { ContentWidget } from "./contentWidget";

export type SectionParagraphItem = {
  id: string;
  type: "paragraph";
  text: string;
  tagName?: "p" | "h1" | "h2" | "h3";
};

export type SectionBulletItem = {
  id: string;
  type: "bullet";
  text: string;
};

export type SectionWidgetItem = {
  id: string;
  type: "widget";
  widget: ContentWidget;
};

export type SectionContentItem =
  | SectionParagraphItem
  | SectionBulletItem
  | SectionWidgetItem;

export type EditableSection = {
  id: string;
  title: string;
  paragraphs: string[];
  bullets: string[];
  widgets: ContentWidget[];
  contentItems: SectionContentItem[];
};

export type ReportDocumentDraft = {
  title: string;
  coverLine: string;
  coverEn: string;
  bodyIntro: string;
  inputScope: string;
  category: string;
  date: string;
  sections: EditableSection[];
};
