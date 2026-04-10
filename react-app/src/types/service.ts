import type { ContentWidget } from "./contentWidget";

export type ServiceBlock = {
  title: string;
  paragraphs?: string[];
  bullets?: string[];
  widgets?: ContentWidget[];
};

export type ServiceDefinition = {
  label: string;
  category: string;
  description: string;
  brief: string;
  coverLine: string;
  coverEn: string;
  bodyIntro: string;
  blocks: ServiceBlock[];
};
