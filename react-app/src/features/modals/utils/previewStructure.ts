import type { ResolvedPreviewDocument } from "./resolvePreviewDocument";

export function getSectionContentCount(section: ResolvedPreviewDocument["sections"][number]) {
  return (
    (section.paragraphs?.length ?? 0) +
    (section.bullets?.length ?? 0) +
    (section.widgets?.length ?? 0)
  );
}

export function getDocumentStructureSummary(document: ResolvedPreviewDocument) {
  const totalSections = document.sections.length;
  const totalWidgets = document.sections.reduce((count, section) => count + (section.widgets?.length ?? 0), 0);
  const totalContentItems = document.sections.reduce(
    (count, section) => count + getSectionContentCount(section),
    0,
  );

  return {
    totalContentItems,
    totalSections,
    totalWidgets,
  };
}
