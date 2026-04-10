import type { EditableSection, ReportDocumentDraft } from "../../../types/documentDraft";

export type SectionCompletionTone = "empty" | "partial" | "complete";
export type RevisionPriorityTone = "high" | "medium" | "low";
export type SectionFilterMode =
  | "all"
  | "collapsed"
  | "expanded"
  | "empty"
  | "incomplete"
  | "priority-high"
  | "complete";

export type RevisionQueueItem = {
  completion: ReturnType<typeof getSectionCompletion>;
  contentCount: number;
  index: number;
  isActive: boolean;
  priority: ReturnType<typeof getRevisionPriority>;
  section: EditableSection;
};

export function getSectionContentCount(section: EditableSection) {
  return section.paragraphs.length + section.bullets.length + section.widgets.length;
}

export function getSectionLead(section: EditableSection) {
  return section.paragraphs[0] ?? section.bullets[0] ?? section.widgets[0]?.title ?? "空章节";
}

export function getSectionCompletion(section: EditableSection) {
  const contentCount = getSectionContentCount(section);

  if (contentCount === 0) {
    return {
      label: "待补充",
      progress: 0,
      tone: "empty" as const,
    };
  }

  if (contentCount < 3) {
    return {
      label: "完善中",
      progress: 0.5,
      tone: "partial" as const,
    };
  }

  return {
    label: "结构完整",
    progress: 1,
    tone: "complete" as const,
  };
}

export function getSectionCompletionPercent(section: EditableSection) {
  return Math.round(getSectionCompletion(section).progress * 100);
}

export function getRevisionPriority(section: EditableSection) {
  const completion = getSectionCompletion(section);

  if (completion.tone === "empty") {
    return {
      label: "高优先级",
      tone: "high" as const,
      weight: 0,
    };
  }

  if (completion.tone === "partial") {
    return {
      label: "中优先级",
      tone: "medium" as const,
      weight: 1,
    };
  }

  return {
    label: "低优先级",
    tone: "low" as const,
    weight: 2,
  };
}

export function getDraftStructureSummary(
  draft: ReportDocumentDraft,
  collapsedSectionIds: string[] = [],
) {
  const collapsedSet = new Set(collapsedSectionIds);
  const paragraphCount = draft.sections.reduce((count, section) => count + section.paragraphs.length, 0);
  const bulletCount = draft.sections.reduce((count, section) => count + section.bullets.length, 0);
  const widgetCount = draft.sections.reduce((count, section) => count + section.widgets.length, 0);
  const emptySectionCount = draft.sections.filter((section) => getSectionContentCount(section) === 0).length;
  const partialSectionCount = draft.sections.filter(
    (section) => getSectionCompletion(section).tone === "partial",
  ).length;
  const collapsedCount = draft.sections.filter((section) => collapsedSet.has(section.id)).length;
  const completeSectionCount = draft.sections.length - emptySectionCount - partialSectionCount;
  const completedProgress = draft.sections.reduce(
    (total, section) => total + getSectionCompletion(section).progress,
    0,
  );
  const completionRate = draft.sections.length ? Math.round((completedProgress / draft.sections.length) * 100) : 0;

  return {
    bulletCount,
    collapsedCount,
    completionRate,
    completeSectionCount,
    contentCount: paragraphCount + bulletCount + widgetCount,
    emptySectionCount,
    expandedCount: draft.sections.length - collapsedCount,
    paragraphCount,
    partialSectionCount,
    sectionCount: draft.sections.length,
    widgetCount,
  };
}

export function findNextSectionByTones(
  sections: EditableSection[],
  activeSectionId: string | null,
  tones: SectionCompletionTone[],
) {
  const toneSet = new Set(tones);
  const matchesTone = (section: EditableSection) => toneSet.has(getSectionCompletion(section).tone);

  if (!sections.length) {
    return null;
  }

  if (!activeSectionId) {
    return sections.find(matchesTone) ?? null;
  }

  const activeIndex = sections.findIndex((section) => section.id === activeSectionId);
  if (activeIndex === -1) {
    return sections.find(matchesTone) ?? null;
  }

  return (
    sections.slice(activeIndex + 1).find(matchesTone) ??
    sections.slice(0, activeIndex + 1).find(matchesTone) ??
    null
  );
}

export function findNextEmptySection(
  sections: EditableSection[],
  activeSectionId: string | null,
) {
  return findNextSectionByTones(sections, activeSectionId, ["empty"]);
}

export function getRevisionQueue(
  sections: EditableSection[],
  activeSectionId: string | null,
) {
  const queue: RevisionQueueItem[] = sections
    .map((section, index): RevisionQueueItem => {
      const completion = getSectionCompletion(section);
      const priority = getRevisionPriority(section);

      return {
        completion,
        contentCount: getSectionContentCount(section),
        index,
        isActive: section.id === activeSectionId,
        priority,
        section,
      };
    })
    .filter((item) => item.completion.tone !== "complete");

  return [...queue].sort((left: RevisionQueueItem, right: RevisionQueueItem) => {
      if (left.isActive !== right.isActive) {
        return left.isActive ? -1 : 1;
      }

      if (left.priority.weight !== right.priority.weight) {
        return left.priority.weight - right.priority.weight;
      }

      if (left.contentCount !== right.contentCount) {
        return left.contentCount - right.contentCount;
      }

      return left.index - right.index;
    });
}

export function matchesSectionFilter(
  section: EditableSection,
  filter: SectionFilterMode,
  collapsedSectionIds: Set<string>,
) {
  const isCollapsed = collapsedSectionIds.has(section.id);
  const contentCount = getSectionContentCount(section);
  const completion = getSectionCompletion(section);
  const priority = getRevisionPriority(section);

  if (filter === "all") {
    return true;
  }

  if (filter === "collapsed") {
    return isCollapsed;
  }

  if (filter === "expanded") {
    return !isCollapsed;
  }

  if (filter === "empty") {
    return contentCount === 0;
  }

  if (filter === "incomplete") {
    return completion.tone !== "complete";
  }

  if (filter === "priority-high") {
    return priority.tone === "high";
  }

  if (filter === "complete") {
    return completion.tone === "complete";
  }

  return true;
}
