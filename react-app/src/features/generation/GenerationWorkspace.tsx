import { useEffect, useMemo, useRef, useState } from "react";
import type { ChangeEvent } from "react";
import { GenerationEditorCanvas } from "./components/GenerationEditorCanvas";
import type {
  EditableSection,
  ReportDocumentDraft,
  SectionContentItem,
  SectionWidgetItem,
} from "../../types/documentDraft";
import type { GenerationSession } from "../../types/generationSession";
import type { ContentWidgetMetric } from "../../types/contentWidget";
import { createWidgetBlock } from "../../utils/documentDraft";
import { PreviewDocument } from "../modals/components/PreviewDocument";
import type { SectionTemplateMode } from "../../data/sectionTemplates";
import {
  buildLogGroups,
  decorateEditableBlock,
  getLogStatusIcon,
} from "./generationPresentation";

function buildContentItemId(sectionId: string, kind: string) {
  return `${sectionId}-${kind}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function createParagraphItem(sectionId: string, text = "", tagName: "p" | "h1" | "h2" | "h3" = "p"): SectionContentItem {
  return {
    id: buildContentItemId(sectionId, "paragraph"),
    type: "paragraph",
    text,
    tagName,
  };
}

function createBulletItem(sectionId: string, text = ""): SectionContentItem {
  return {
    id: buildContentItemId(sectionId, "bullet"),
    type: "bullet",
    text,
  };
}

function createWidgetItem(sectionId: string, type: "image" | "table" | "radar-chart", index: number): SectionWidgetItem {
  return {
    id: buildContentItemId(sectionId, "widget"),
    type: "widget",
    widget: createWidgetBlock(type, `${sectionId}-${type}-${index}`),
  };
}

function isEmptyParagraphItem(item: SectionContentItem) {
  return item.type === "paragraph" && !item.text.trim();
}

function ensureTrailingParagraph(sectionId: string, items: SectionContentItem[]) {
  if (!items.length) {
    return [createParagraphItem(sectionId)];
  }

  const lastItem = items[items.length - 1];
  if (lastItem && isEmptyParagraphItem(lastItem)) {
    return items;
  }

  return [...items, createParagraphItem(sectionId)];
}

function deriveLegacyFields(contentItems: SectionContentItem[]) {
  return {
    paragraphs: contentItems
      .filter((item): item is Extract<SectionContentItem, { type: "paragraph" }> => item.type === "paragraph")
      .map((item) => item.text.trim())
      .filter(Boolean),
    bullets: contentItems
      .filter((item): item is Extract<SectionContentItem, { type: "bullet" }> => item.type === "bullet")
      .map((item) => item.text.trim())
      .filter(Boolean),
    widgets: contentItems
      .filter((item): item is SectionWidgetItem => item.type === "widget")
      .map((item) => item.widget),
  };
}

function buildContentItemsFromLegacy(section: EditableSection) {
  return ensureTrailingParagraph(section.id, [
    ...section.paragraphs.map((paragraph) => createParagraphItem(section.id, paragraph)),
    ...section.bullets.map((bullet) => createBulletItem(section.id, bullet)),
    ...section.widgets.map((widget) => ({
      id: buildContentItemId(section.id, "widget"),
      type: "widget" as const,
      widget,
    })),
  ]);
}

type GenerationWorkspaceProps = {
  documentDraft?: ReportDocumentDraft;
  session: GenerationSession;
  onDraftChange?: (nextDraft: ReportDocumentDraft) => void;
  onBackground: () => void;
  onClose: () => void;
  onOpenPreview: () => void;
  onReturnToList: (draft?: ReportDocumentDraft, contentHtml?: string) => void;
  onStop: () => void;
};

export function GenerationWorkspace({
  documentDraft,
  session,
  onDraftChange,
  onBackground,
  onClose,
  onOpenPreview,
  onReturnToList,
  onStop,
}: GenerationWorkspaceProps) {
  const [briefOpen, setBriefOpen] = useState(true);
  const [styleMenuOpen, setStyleMenuOpen] = useState(false);
  const [alignMenuOpen, setAlignMenuOpen] = useState(false);
  const [blockMenuOpen, setBlockMenuOpen] = useState(false);
  const [textStyleLabel, setTextStyleLabel] = useState("正文");
  const [alignLabel, setAlignLabel] = useState("左对齐");
  const [selectionToolbarState, setSelectionToolbarState] = useState({
    visible: false,
    left: 0,
    top: 0,
  });
  const [blockInserterState, setBlockInserterState] = useState({
    visible: false,
    left: 0,
    top: 0,
  });
  const [tableToolbarState, setTableToolbarState] = useState({
    visible: false,
    left: 0,
    top: 0,
  });
  const [chartEditor, setChartEditor] = useState<{
    sectionId: string;
    widgetId: string;
  } | null>(null);
  const [saveConfirmOpen, setSaveConfirmOpen] = useState(false);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(
    documentDraft?.sections[0]?.id ?? null,
  );
  const [collapsedSectionIds, setCollapsedSectionIds] = useState<string[]>([]);
  const documentCanvasRef = useRef<HTMLElement | null>(null);
  const activeEditableBlockRef = useRef<HTMLElement | null>(null);
  const activeInsertionBlockRef = useRef<HTMLElement | null>(null);
  const activeTableCellRef = useRef<HTMLElement | null>(null);
  const imageUploadInputRef = useRef<HTMLInputElement | null>(null);
  const pendingImageSectionIdRef = useRef<string | undefined>(undefined);
  const pendingImageItemIdRef = useRef<string | undefined>(undefined);
  const selectionRangeRef = useRef<Range | null>(null);
  const isComplete = session.status === "completed";
  const generationView = isComplete || session.progress >= 90 ? "editing" : "processing";
  const generationModeLabel = session.modeLabel;
  const editingDraft = documentDraft;
  const logGroups = useMemo(
    () => buildLogGroups(session.logs, session.updatedAt, session.createdAt),
    [session.createdAt, session.logs, session.updatedAt],
  );
  const handleExit = () => {
    if (isComplete) {
      onReturnToList(editingDraft, documentCanvasRef.current?.innerHTML);
      return;
    }

    onStop();
    onClose();
  };

  function updateDraft(nextDraft: ReportDocumentDraft) {
    if (!onDraftChange) {
      return;
    }

    onDraftChange(nextDraft);
  }

  function updateSection(
    sectionId: string,
    patch: Partial<ReportDocumentDraft["sections"][number]>,
  ) {
    if (!editingDraft) {
      return;
    }

    updateDraft({
      ...editingDraft,
      sections: editingDraft.sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              ...patch,
            }
          : section,
      ),
    });
    setActiveSectionId(sectionId);
  }

  function updateWidget(
    sectionId: string,
    widgetId: string,
    patch: Partial<ReportDocumentDraft["sections"][number]["widgets"][number]>,
  ) {
    updateContentItems(sectionId, (items) =>
      items.map((item) =>
        item.type === "widget" && item.widget.id === widgetId
          ? {
              ...item,
              widget: {
                ...item.widget,
                ...patch,
              },
            }
          : item,
      ),
    );
  }

  function updateDraftSection(
    sectionId: string | undefined,
    transform: (section: ReportDocumentDraft["sections"][number]) => ReportDocumentDraft["sections"][number],
  ) {
    if (!editingDraft) {
      return;
    }

    const targetSectionId = sectionId ?? editingDraft.sections[editingDraft.sections.length - 1]?.id;
    if (!targetSectionId) {
      return;
    }

    updateDraft({
      ...editingDraft,
      sections: editingDraft.sections.map((section) =>
        section.id === targetSectionId ? transform(section) : section,
      ),
    });
    setActiveSectionId(targetSectionId);
  }

  function updateContentItems(
    sectionId: string,
    transform: (items: SectionContentItem[], section: EditableSection) => SectionContentItem[],
  ) {
    if (!editingDraft) {
      return;
    }

    updateDraft({
      ...editingDraft,
      sections: editingDraft.sections.map((section) => {
        if (section.id !== sectionId) {
          return section;
        }

        const nextContentItems = ensureTrailingParagraph(
          sectionId,
          transform(section.contentItems?.length ? section.contentItems : buildContentItemsFromLegacy(section), section),
        );

        return {
          ...section,
          ...deriveLegacyFields(nextContentItems),
          contentItems: nextContentItems,
        };
      }),
    });
    setActiveSectionId(sectionId);
  }

  function focusInsertionBlock(sectionId: string) {
    window.requestAnimationFrame(() => {
      const block = documentCanvasRef.current?.querySelector(
        `.editor-section-card[data-section-id="${sectionId}"] .generation-empty-block:last-of-type`,
      );
      if (!(block instanceof HTMLElement)) {
        hideBlockInserter();
        return;
      }

      activeEditableBlockRef.current = block;
      activeInsertionBlockRef.current = block;
      block.focus();
      const range = document.createRange();
      range.selectNodeContents(block);
      range.collapse(true);
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);
      updateBlockInserter(block);
    });
  }

  function handleInsertParagraphBlock(sectionId?: string) {
    const targetSectionId = sectionId ?? getSelectedSectionId();
    const anchorItemId = activeInsertionBlockRef.current?.dataset.itemId;
    if (!targetSectionId) {
      return;
    }

    const nextParagraphItem = createParagraphItem(targetSectionId, "新增段落内容");
    const nextEmptyItem = createParagraphItem(targetSectionId);
    updateContentItems(targetSectionId, (items) => {
      const anchorIndex = items.findIndex((item) => item.id === anchorItemId);
      if (anchorIndex >= 0 && items[anchorIndex] && isEmptyParagraphItem(items[anchorIndex])) {
        return [
          ...items.slice(0, anchorIndex),
          nextParagraphItem,
          nextEmptyItem,
          ...items.slice(anchorIndex + 1),
        ];
      }

      return [...items, nextParagraphItem, nextEmptyItem];
    });
    setBlockMenuOpen(false);
    window.requestAnimationFrame(() => {
      const block = documentCanvasRef.current?.querySelector(
        `[data-item-id="${nextEmptyItem.id}"]`,
      );
      if (block instanceof HTMLElement) {
        activeInsertionBlockRef.current = block;
        activeEditableBlockRef.current = block;
        block.focus();
        updateBlockInserter(block);
      }
    });
  }

  function handleInsertBulletBlock(sectionId?: string) {
    const targetSectionId = sectionId ?? getSelectedSectionId();
    const anchorItemId = activeInsertionBlockRef.current?.dataset.itemId;
    if (!targetSectionId) {
      return;
    }

    const nextBulletItem = createBulletItem(targetSectionId, "新增要点内容");
    const nextEmptyItem = createParagraphItem(targetSectionId);
    updateContentItems(targetSectionId, (items) => {
      const anchorIndex = items.findIndex((item) => item.id === anchorItemId);
      if (anchorIndex >= 0 && items[anchorIndex] && isEmptyParagraphItem(items[anchorIndex])) {
        return [
          ...items.slice(0, anchorIndex),
          nextBulletItem,
          nextEmptyItem,
          ...items.slice(anchorIndex + 1),
        ];
      }

      return [...items, nextBulletItem, nextEmptyItem];
    });
    setBlockMenuOpen(false);
    window.requestAnimationFrame(() => {
      const block = documentCanvasRef.current?.querySelector(
        `[data-item-id="${nextEmptyItem.id}"]`,
      );
      if (block instanceof HTMLElement) {
        activeInsertionBlockRef.current = block;
        activeEditableBlockRef.current = block;
        block.focus();
        updateBlockInserter(block);
      }
    });
  }

  function noopSectionTemplate(_template: Exclude<SectionTemplateMode, "blank">) {}
  function noopSectionTemplateApply(
    _sectionId: string,
    _template: Exclude<SectionTemplateMode, "blank">,
  ) {}
  function noopSectionAction(_sectionId: string) {}

  function commitTrailingParagraph(sectionId: string, value: string) {
    const itemId = activeEditableBlockRef.current?.dataset.itemId;
    if (!itemId) {
      return;
    }

    updateContentItems(sectionId, (items) =>
      items.map((item) =>
        item.id === itemId && item.type === "paragraph"
          ? {
              ...item,
              text: value,
            }
          : item,
      ),
    );
  }

  function handleInsertWidgetBlock(type: "image" | "table" | "radar-chart", sectionId?: string) {
    const targetSectionId = sectionId ?? getSelectedSectionId();
    const anchorItemId = activeInsertionBlockRef.current?.dataset.itemId;
    if (!targetSectionId) {
      return;
    }

    const nextWidgetItem = createWidgetItem(targetSectionId, type, Date.now());
    const nextEmptyItem = createParagraphItem(targetSectionId);
    updateContentItems(targetSectionId, (items, section) => {
      const anchorIndex = items.findIndex((item) => item.id === anchorItemId);
      if (anchorIndex >= 0 && items[anchorIndex] && isEmptyParagraphItem(items[anchorIndex])) {
        return [
          ...items.slice(0, anchorIndex),
          nextWidgetItem,
          nextEmptyItem,
          ...items.slice(anchorIndex + 1),
        ];
      }

      return [...items, nextWidgetItem, nextEmptyItem];
    });
    setBlockMenuOpen(false);
    window.requestAnimationFrame(() => {
      if (type === "table") {
        const firstCell = documentCanvasRef.current?.querySelector(
          `[data-widget-id="${nextWidgetItem.widget.id}"][data-row-index="1"][data-column-index="0"]`,
        );
        if (firstCell instanceof HTMLElement) {
          activeTableCellRef.current = firstCell;
          activeEditableBlockRef.current = firstCell;
          firstCell.focus();
          updateTableToolbar(firstCell);
          hideBlockInserter();
          return;
        }
      }

      const block = documentCanvasRef.current?.querySelector(`[data-item-id="${nextEmptyItem.id}"]`);
      if (block instanceof HTMLElement) {
        activeInsertionBlockRef.current = block;
        activeEditableBlockRef.current = block;
        block.focus();
        updateBlockInserter(block);
      }
    });
  }

  function handleActivateInsertionPoint(sectionId: string, itemId: string) {
    setActiveSectionId(sectionId);
    setBlockMenuOpen(false);
    window.requestAnimationFrame(() => {
      const block = documentCanvasRef.current?.querySelector(
        `[data-item-id="${itemId}"]`,
      );
      if (!(block instanceof HTMLElement)) {
        return;
      }

      activeEditableBlockRef.current = block;
      activeInsertionBlockRef.current = block;
      block.focus();
      updateBlockInserter(block);
    });
  }

  function handleUpdateParagraphItem(sectionId: string, itemId: string, value: string) {
    updateContentItems(sectionId, (items) =>
      items.map((item) =>
        item.id === itemId && item.type === "paragraph"
          ? {
              ...item,
              text: value,
            }
          : item,
      ),
    );
  }

  function handleUpdateBulletItem(sectionId: string, itemId: string, value: string) {
    updateContentItems(sectionId, (items) =>
      items.map((item) =>
        item.id === itemId && item.type === "bullet"
          ? {
              ...item,
              text: value,
            }
          : item,
      ),
    );
  }

  function handleUpdateSectionTitle(sectionId: string, title: string) {
    updateSection(sectionId, { title });
  }

  function getClosestEditableBlock(target: EventTarget | null) {
    if (!(target instanceof Node)) {
      return null;
    }

    const element = target instanceof HTMLElement ? target : target.parentElement;
    return element?.closest(".editable-block") as HTMLElement | null;
  }

  function getSelectedSectionId() {
    const sectionElement =
      activeInsertionBlockRef.current?.closest(".editor-section-card") ??
      activeEditableBlockRef.current?.closest(".editor-section-card");
    return sectionElement instanceof HTMLElement ? sectionElement.dataset.sectionId ?? undefined : undefined;
  }

  function isEditableBlock(target?: HTMLElement | null) {
    return Boolean(
      target &&
        target.classList.contains("editable-block") &&
        target.getAttribute("contenteditable") === "true",
    );
  }

  function isEmptyEditableBlock(target?: HTMLElement | null) {
    return Boolean(
      isEditableBlock(target) &&
        !(target?.querySelector("img, svg, table")) &&
        !(target?.textContent ?? "").replace(/\s+/g, " ").trim(),
    );
  }

  function canShowBlockInserter(target?: HTMLElement | null) {
    return Boolean(
      isEmptyEditableBlock(target) &&
        target &&
        /^(P|H1|H2|H3)$/.test(target.tagName) &&
        !target.closest(".editor-table"),
    );
  }

  function getBlockStyleValue(target?: HTMLElement | null) {
    if (!target) {
      return "p";
    }

    const tag = target.tagName.toLowerCase();
    return ["p", "h1", "h2", "h3"].includes(tag) ? tag : "p";
  }

  function getTextStyleLabel(value: string) {
    return (
      {
        p: "正文",
        h1: "一级标题",
        h2: "二级标题",
        h3: "三级标题",
      }[value] || "正文"
    );
  }

  function getAlignLabel(value: string) {
    return (
      {
        left: "左对齐",
        center: "居中对齐",
        right: "右对齐",
      }[value] || "左对齐"
    );
  }

  function syncSelectionLabels(target?: HTMLElement | null) {
    setTextStyleLabel(getTextStyleLabel(getBlockStyleValue(target)));
    setAlignLabel(getAlignLabel(target?.style.textAlign || "left"));
  }

  function hideSelectionToolbar() {
    setSelectionToolbarState((current) => ({ ...current, visible: false }));
    setStyleMenuOpen(false);
    setAlignMenuOpen(false);
  }

  function hideBlockInserter(preserveAnchor = false) {
    setBlockInserterState((current) => ({ ...current, visible: false }));
    setBlockMenuOpen(false);
    if (!preserveAnchor) {
      activeInsertionBlockRef.current = null;
    }
  }

  function hideTableToolbar() {
    activeTableCellRef.current = null;
    setTableToolbarState((current) => ({ ...current, visible: false }));
  }

  function updateBlockInserter(target?: HTMLElement | null) {
    if (!isComplete) {
      hideBlockInserter();
      return;
    }

    const block = target ?? activeInsertionBlockRef.current ?? activeEditableBlockRef.current;
    if (!block || !documentCanvasRef.current?.contains(block) || !canShowBlockInserter(block)) {
      hideBlockInserter();
      return;
    }

    activeInsertionBlockRef.current = block;
    const rect = block.getBoundingClientRect();
    setBlockInserterState({
      visible: true,
      left: Math.max(18, rect.left - 52),
      top: Math.max(88, rect.top + rect.height / 2 - 18),
    });
  }

  function updateTableToolbar(target?: HTMLElement | null) {
    if (!isComplete) {
      hideTableToolbar();
      return;
    }

    const cell = target ?? activeTableCellRef.current;
    if (!cell || !documentCanvasRef.current?.contains(cell)) {
      hideTableToolbar();
      return;
    }

    const table = cell.closest(".editor-table");
    if (!(table instanceof HTMLElement)) {
      hideTableToolbar();
      return;
    }

    const rect = table.getBoundingClientRect();
    activeTableCellRef.current = cell;
    setTableToolbarState({
      visible: true,
      left: Math.max(18, rect.left + rect.width / 2 - 150),
      top: Math.max(88, rect.top - 56),
    });
  }

  function positionSelectionToolbar() {
    if (!isComplete) {
      hideSelectionToolbar();
      return;
    }

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0 || selection.isCollapsed) {
      hideSelectionToolbar();
      updateBlockInserter();
      return;
    }

    const range = selection.getRangeAt(0);
    const canvas = documentCanvasRef.current;
    if (!canvas || !canvas.contains(range.commonAncestorContainer)) {
      hideSelectionToolbar();
      return;
    }

    const rect = range.getBoundingClientRect();
    if (!rect.width && !rect.height) {
      hideSelectionToolbar();
      return;
    }

    const anchorNode = selection.anchorNode;
    const anchorBlock = getClosestEditableBlock(anchorNode);
    syncSelectionLabels(anchorBlock);

    setSelectionToolbarState({
      visible: true,
      left: Math.max(12, rect.left + rect.width / 2 - 170),
      top: Math.max(88, rect.top - 54),
    });
    selectionRangeRef.current = range.cloneRange();
    hideBlockInserter(true);
  }

  function execCommand(command: string, value?: string) {
    document.execCommand("styleWithCSS", false, "true");
    document.execCommand(command, false, value);
    positionSelectionToolbar();
  }

  function isFloatingEditorUiTarget(target: EventTarget | null) {
    if (!(target instanceof HTMLElement)) {
      return false;
    }

    return Boolean(
      target.closest(
        "#selectionToolbar, #blockInserter, #tableToolbar, #chartDataModal, #saveConfirmModal",
      ),
    );
  }

  useEffect(() => {
    if (!isComplete) {
      hideSelectionToolbar();
      hideBlockInserter();
      return undefined;
    }

    function handleSelectionChange() {
      positionSelectionToolbar();
    }

    function handlePointerDown(event: PointerEvent) {
      const target = event.target;
      if (isFloatingEditorUiTarget(target)) {
        return;
      }

      const editableBlock = getClosestEditableBlock(target);
      if (editableBlock) {
        activeEditableBlockRef.current = editableBlock;
        setActiveSectionId(editableBlock.closest(".editor-section-card")?.getAttribute("data-section-id") ?? null);
        syncSelectionLabels(editableBlock);
        const tableCell = editableBlock.closest(".editor-table td, .editor-table th");
        if (tableCell instanceof HTMLElement) {
          activeTableCellRef.current = tableCell;
          updateTableToolbar(tableCell);
        } else {
          hideTableToolbar();
        }
        if (canShowBlockInserter(editableBlock)) {
          activeInsertionBlockRef.current = editableBlock;
          updateBlockInserter(editableBlock);
          setBlockMenuOpen(false);
        } else {
          hideBlockInserter();
        }
        return;
      }

      hideSelectionToolbar();
      hideBlockInserter();
      hideTableToolbar();
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        hideSelectionToolbar();
        hideBlockInserter();
        hideTableToolbar();
      }
    }

    function handleViewportChange() {
      if (selectionToolbarState.visible && selectionRangeRef.current) {
        const selection = window.getSelection();
        if (selection) {
          selection.removeAllRanges();
          selection.addRange(selectionRangeRef.current);
        }
        positionSelectionToolbar();
      } else if (blockInserterState.visible) {
        updateBlockInserter(activeInsertionBlockRef.current);
      }

      if (tableToolbarState.visible) {
        updateTableToolbar(activeTableCellRef.current);
      }
    }

    document.addEventListener("selectionchange", handleSelectionChange);
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("scroll", handleViewportChange, true);
    window.addEventListener("resize", handleViewportChange);
    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange);
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("scroll", handleViewportChange, true);
      window.removeEventListener("resize", handleViewportChange);
    };
  }, [blockInserterState.visible, isComplete, selectionToolbarState.visible, tableToolbarState.visible]);

  function getActiveTableContext() {
    const cell = activeTableCellRef.current;
    const sectionId = cell?.closest(".editor-section-card")?.getAttribute("data-section-id");
    const widgetId = cell?.getAttribute("data-widget-id");
    const rowIndex = Number(cell?.getAttribute("data-row-index"));
    const columnIndex = Number(cell?.getAttribute("data-column-index"));

    if (!sectionId || !widgetId || Number.isNaN(rowIndex) || Number.isNaN(columnIndex) || !editingDraft) {
      return null;
    }

    const section = editingDraft.sections.find((item) => item.id === sectionId);
    const widget = section?.widgets.find((item) => item.id === widgetId);
    if (!section || !widget || widget.type !== "table") {
      return null;
    }

    return { section, widget, sectionId, widgetId, rowIndex, columnIndex };
  }

  function refocusTableCell(widgetId: string, rowIndex: number, columnIndex: number) {
    window.requestAnimationFrame(() => {
      const nextCell = documentCanvasRef.current?.querySelector(
        `[data-widget-id="${widgetId}"][data-row-index="${rowIndex}"][data-column-index="${columnIndex}"]`,
      );
      if (!(nextCell instanceof HTMLElement)) {
        return;
      }

      activeTableCellRef.current = nextCell;
      activeEditableBlockRef.current = nextCell;
      nextCell.focus();
      const range = document.createRange();
      range.selectNodeContents(nextCell);
      range.collapse(false);
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);
      updateTableToolbar(nextCell);
      hideBlockInserter();
    });
  }

  function handleAddTableRow() {
    const context = getActiveTableContext();
    if (!context) {
      return;
    }

    const columns = context.widget.columns ?? [];
    const rows = context.widget.rows ?? [];
    const columnCount = columns.length || rows[0]?.length || 2;
    const insertIndex = Math.max(0, context.rowIndex - 1);
    const nextRows = [...rows];
    nextRows.splice(insertIndex + 1, 0, Array.from({ length: columnCount }, () => ""));
    updateWidget(context.sectionId, context.widgetId, { rows: nextRows });
    refocusTableCell(context.widgetId, insertIndex + 2, 0);
  }

  function handleAddTableColumn() {
    const context = getActiveTableContext();
    if (!context) {
      return;
    }

    const columns = context.widget.columns ?? [];
    const rows = context.widget.rows ?? [];
    const insertIndex = context.columnIndex;
    const nextColumns = columns.length
      ? [...columns.slice(0, insertIndex + 1), `新增列 ${columns.length + 1}`, ...columns.slice(insertIndex + 1)]
      : [];
    const nextRows = rows.map((row) => {
      const nextRow = [...row];
      nextRow.splice(insertIndex + 1, 0, "");
      return nextRow;
    });
    updateWidget(context.sectionId, context.widgetId, {
      columns: nextColumns,
      rows: nextRows,
    });
    refocusTableCell(context.widgetId, context.rowIndex, insertIndex + 1);
  }

  function handleDeleteTableRow() {
    const context = getActiveTableContext();
    if (!context) {
      return;
    }

    const rows = context.widget.rows ?? [];
    if (rows.length <= 1 || context.rowIndex === 0) {
      return;
    }

    updateWidget(context.sectionId, context.widgetId, {
      rows: rows.filter((_, index) => index !== context.rowIndex - 1),
    });
    refocusTableCell(
      context.widgetId,
      Math.max(1, context.rowIndex - 1),
      Math.min(context.columnIndex, (rows[0]?.length ?? 1) - 1),
    );
  }

  function handleDeleteTableColumn() {
    const context = getActiveTableContext();
    if (!context) {
      return;
    }

    const rows = context.widget.rows ?? [];
    const columnCount = rows[0]?.length ?? 0;
    if (columnCount <= 1) {
      return;
    }

    const columns = context.widget.columns ?? [];
    updateWidget(context.sectionId, context.widgetId, {
      columns: columns.length
        ? columns.filter((_, index) => index !== context.columnIndex)
        : [],
      rows: rows.map((row) => row.filter((_, index) => index !== context.columnIndex)),
    });
    refocusTableCell(
      context.widgetId,
      context.rowIndex,
      Math.max(0, context.columnIndex - (context.columnIndex >= columnCount - 1 ? 1 : 0)),
    );
  }

  function handleMergeTableCellRight() {
    const context = getActiveTableContext();
    const cell = activeTableCellRef.current;
    if (!context || !cell) {
      return;
    }

    const rows = context.widget.rows ?? [];
    const columns = context.widget.columns ?? [];
    const columnCount = rows[context.rowIndex - 1]?.length ?? columns.length;
    if (context.rowIndex === 0 || context.columnIndex >= columnCount - 1) {
      return;
    }

    const rowIndex = context.rowIndex - 1;
    const row = rows[rowIndex];
    if (!row) {
      return;
    }

    const currentValue = row[context.columnIndex] ?? "";
    const nextValue = row[context.columnIndex + 1] ?? "";
    const divider = currentValue && nextValue ? " / " : "";
    const nextRows = rows.map((rowItem, currentRowIndex) =>
      currentRowIndex === rowIndex
        ? rowItem.filter((_, index) => index !== context.columnIndex + 1).map((item, index) =>
            index === context.columnIndex ? `${currentValue}${divider}${nextValue}`.trim() : item,
          )
        : rowItem.filter((_, index) => index !== context.columnIndex + 1),
    );

    updateWidget(context.sectionId, context.widgetId, {
      columns: columns.length
        ? columns.filter((_, index) => index !== context.columnIndex + 1)
        : [],
      rows: nextRows,
    });
    refocusTableCell(context.widgetId, context.rowIndex, context.columnIndex);
  }

  function handleImageSelected(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    const sectionId = pendingImageSectionIdRef.current;
    const itemId = pendingImageItemIdRef.current;
    reader.addEventListener("load", () => {
      const assetSrc = reader.result;
      if (typeof assetSrc !== "string") {
        return;
      }

      if (!sectionId) {
        return;
      }

      const nextWidgetItem = createWidgetItem(sectionId, "image", Date.now());
      nextWidgetItem.widget = {
        ...nextWidgetItem.widget,
        assetLabel: file.name,
        assetSrc,
      };
      const nextEmptyItem = createParagraphItem(sectionId);

      updateContentItems(sectionId, (items) => {
        const anchorIndex = items.findIndex((item) => item.id === itemId);
        if (anchorIndex >= 0 && items[anchorIndex] && isEmptyParagraphItem(items[anchorIndex])) {
          return [
            ...items.slice(0, anchorIndex),
            nextWidgetItem,
            nextEmptyItem,
            ...items.slice(anchorIndex + 1),
          ];
        }

        return [...items, nextWidgetItem, nextEmptyItem];
      });

      window.requestAnimationFrame(() => {
        const block = documentCanvasRef.current?.querySelector(
          `[data-item-id="${nextEmptyItem.id}"]`,
        );
        if (block instanceof HTMLElement) {
          activeInsertionBlockRef.current = block;
          activeEditableBlockRef.current = block;
          block.focus();
          updateBlockInserter(block);
        }
      });
    });
    reader.readAsDataURL(file);
    event.target.value = "";
    pendingImageSectionIdRef.current = undefined;
    pendingImageItemIdRef.current = undefined;
    setBlockMenuOpen(false);
  }

  const activeChartWidget =
    chartEditor && editingDraft
      ? editingDraft.sections
          .find((section) => section.id === chartEditor.sectionId)
          ?.widgets.find(
            (widget) => widget.id === chartEditor.widgetId && widget.type === "radar-chart",
          ) ?? null
      : null;

  function updateChartMetrics(nextMetrics: ContentWidgetMetric[]) {
    if (!chartEditor || !activeChartWidget) {
      return;
    }

    updateWidget(chartEditor.sectionId, chartEditor.widgetId, {
      metrics: nextMetrics,
    });
  }

  function handleChartMetricChange(index: number, value: string) {
    if (!activeChartWidget?.metrics) {
      return;
    }

    const normalized = value.trim();
    updateChartMetrics(
      activeChartWidget.metrics.map((metric, metricIndex) =>
        metricIndex === index
          ? {
              ...metric,
              value: normalized === "" ? null : Math.max(0, Math.min(100, Number(normalized) || 0)),
            }
          : metric,
      ),
    );
  }

  function handleExtractChartData() {
    if (!activeChartWidget?.metrics) {
      return;
    }

    const extractedValues: Record<string, number> = {
      饮食: 72,
      身体活动: 58,
      烟草暴露: 75,
      睡眠健康: 64,
      体重: 70,
      血脂: 68,
      血糖: 74,
      血压: 62,
    };

    updateChartMetrics(
      activeChartWidget.metrics.map((metric) => ({
        ...metric,
        value: extractedValues[metric.label] ?? metric.value ?? 60,
      })),
    );
  }

  function handleExtractChartDataForWidget(sectionId: string, widgetId: string) {
    const section = editingDraft?.sections.find((item) => item.id === sectionId);
    const widget = section?.widgets.find(
      (item) => item.id === widgetId && item.type === "radar-chart",
    );
    if (!widget?.metrics) {
      return;
    }

    const extractedValues: Record<string, number> = {
      饮食: 72,
      身体活动: 58,
      烟草暴露: 75,
      睡眠健康: 64,
      体重: 70,
      血脂: 68,
      血糖: 74,
      血压: 62,
    };

    updateWidget(sectionId, widgetId, {
      metrics: widget.metrics.map((metric) => ({
        ...metric,
        value: extractedValues[metric.label] ?? metric.value ?? 60,
      })),
    });
    setActiveSectionId(sectionId);
  }

  useEffect(() => {
    if (!isComplete) {
      return;
    }

    const canvas = documentCanvasRef.current;
    if (!canvas) {
      return;
    }

    function handleCanvasClick(event: MouseEvent) {
      const target = event.target as HTMLElement | null;
      const editableBlock = target?.closest(".editable-block") as HTMLElement | null;
      if (editableBlock) {
        activeEditableBlockRef.current = editableBlock;
        if (canShowBlockInserter(editableBlock)) {
          activeInsertionBlockRef.current = editableBlock;
        }
        setActiveSectionId(
          editableBlock.closest(".editor-section-card")?.getAttribute("data-section-id") ?? null,
        );
        syncSelectionLabels(editableBlock);
        if (canShowBlockInserter(editableBlock)) {
          updateBlockInserter(editableBlock);
          setBlockMenuOpen(false);
        } else {
          hideBlockInserter();
        }

        const tableCell = editableBlock.closest(".editor-table td, .editor-table th");
        if (tableCell instanceof HTMLElement) {
          activeTableCellRef.current = tableCell;
          updateTableToolbar(tableCell);
        } else {
          hideTableToolbar();
        }
      }
    }

    function handleCanvasFocusIn(event: FocusEvent) {
      const target = event.target as HTMLElement | null;
      const editableBlock = target?.closest(".editable-block") as HTMLElement | null;
      if (!editableBlock) {
        return;
      }

      activeEditableBlockRef.current = editableBlock;
      if (canShowBlockInserter(editableBlock)) {
        activeInsertionBlockRef.current = editableBlock;
      }
      setActiveSectionId(
        editableBlock.closest(".editor-section-card")?.getAttribute("data-section-id") ?? null,
      );
      syncSelectionLabels(editableBlock);
      if (canShowBlockInserter(editableBlock)) {
        updateBlockInserter(editableBlock);
        setBlockMenuOpen(false);
      } else {
        hideBlockInserter();
      }
    }

    function handleCanvasInput(event: Event) {
      const target = event.target as HTMLElement | null;
      const editableBlock = target?.closest(".editable-block") as HTMLElement | null;
      if (!editableBlock) {
        return;
      }

      activeEditableBlockRef.current = editableBlock;
      if (canShowBlockInserter(editableBlock)) {
        activeInsertionBlockRef.current = editableBlock;
      }
      if (canShowBlockInserter(editableBlock)) {
        updateBlockInserter(editableBlock);
        setBlockMenuOpen(false);
      } else {
        hideBlockInserter();
      }

      const tableCell = editableBlock.closest(".editor-table td, .editor-table th");
      if (tableCell instanceof HTMLElement) {
        activeTableCellRef.current = tableCell;
        updateTableToolbar(tableCell);
      }
    }

    function handleCanvasKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      const editableBlock = target?.closest(".editable-block") as HTMLElement | null;
      if (
        !editableBlock ||
        editableBlock.closest(".editor-table") ||
        event.key !== "Enter" ||
        event.shiftKey
      ) {
        return;
      }

      event.preventDefault();
      const sectionId = editableBlock.closest(".editor-section-card")?.getAttribute("data-section-id");
      const currentItemId = editableBlock.dataset.itemId;
      if (!sectionId || !currentItemId) {
        return;
      }

      const nextEmptyItem = createParagraphItem(sectionId);
      updateContentItems(sectionId, (items) => {
        const anchorIndex = items.findIndex((item) => item.id === currentItemId);
        if (anchorIndex < 0) {
          return [...items, nextEmptyItem];
        }

        return [
          ...items.slice(0, anchorIndex + 1),
          nextEmptyItem,
          ...items.slice(anchorIndex + 1),
        ];
      });

      window.requestAnimationFrame(() => {
        const nextBlock = documentCanvasRef.current?.querySelector(
          `[data-item-id="${nextEmptyItem.id}"]`,
        );
        if (!(nextBlock instanceof HTMLElement)) {
          return;
        }

        activeEditableBlockRef.current = nextBlock;
        activeInsertionBlockRef.current = nextBlock;
        nextBlock.focus();
        const range = document.createRange();
        range.selectNodeContents(nextBlock);
        range.collapse(true);
        const selection = window.getSelection();
        selection?.removeAllRanges();
        selection?.addRange(range);
        updateBlockInserter(nextBlock);
        setBlockMenuOpen(false);
      });
    }

    canvas.addEventListener("click", handleCanvasClick);
    canvas.addEventListener("focusin", handleCanvasFocusIn);
    canvas.addEventListener("input", handleCanvasInput);
    canvas.addEventListener("keydown", handleCanvasKeyDown);

    return () => {
      canvas.removeEventListener("click", handleCanvasClick);
      canvas.removeEventListener("focusin", handleCanvasFocusIn);
      canvas.removeEventListener("input", handleCanvasInput);
      canvas.removeEventListener("keydown", handleCanvasKeyDown);
    };
  }, [isComplete, editingDraft]);

  useEffect(() => {
    if (!isComplete || !documentCanvasRef.current) {
      return;
    }

    documentCanvasRef.current.querySelectorAll(".editable-block").forEach((node) => {
      if (!(node instanceof HTMLElement)) {
        return;
      }

      if (document.activeElement === node) {
        return;
      }

      decorateEditableBlock(node);
    });
  }, [editingDraft, isComplete]);

  return (
    <section className="generation-screen" id="generationScreen" data-view={generationView}>
      <header className="generation-shell-header">
        <div className="generation-shell-left">
          <button
            className="generation-exit"
            id="backToList"
            type="button"
            onClick={handleExit}
          >
            <span aria-hidden="true">×</span>
            <span>退出</span>
          </button>
          <div className="generation-shell-title">
            <h2 id="generationTitle">{session.reportTitle}</h2>
            <p id="generationMeta" hidden>
              全屏展示模型处理过程、多智能体协同轨迹与流式文档输出。
            </p>
          </div>
        </div>

        <div className="generation-shell-actions">
          <button
            className="primary-button"
            id="saveDocument"
            type="button"
            disabled={!isComplete}
            onClick={isComplete ? () => setSaveConfirmOpen(true) : undefined}
          >
            保存
          </button>
        </div>
      </header>

      <div className="review-shell-body">
        <aside className="review-sidebar">
          <section className="review-card review-status-card" id="thinkingPanel">
            <div className="review-status-top">
              <div className="thinking-status-group">
                <div className="thinking-status-pill">
                  <span className={`thinking-pulse${isComplete ? " is-still" : ""}`} aria-hidden="true" />
                  <span id="generationModeLabel">{generationModeLabel}</span>
                </div>
                <button
                  className="thinking-stop"
                  id="stopGeneration"
                  type="button"
                  hidden={isComplete}
                  disabled={session.status !== "processing"}
                  onClick={onStop}
                >
                  终止生成
                </button>
              </div>
              <p className="thinking-notice">
                采用 AI 模型智能生成报告文档，仅供参考，请校对确认。
              </p>
            </div>

            <button
              className="thinking-brief"
              id="thinkingBriefToggle"
              type="button"
              aria-expanded={briefOpen}
              aria-controls="thinkingBriefDetail"
              onClick={() => setBriefOpen((current) => !current)}
            >
              <div className="thinking-brief-copy">
                <strong>需求理解</strong>
                <p id="thinkingBriefText">{session.briefText}</p>
              </div>
              <span className="thinking-brief-action">{briefOpen ? "收起" : "展开"}</span>
            </button>

            <div className="thinking-brief-detail" id="thinkingBriefDetail" hidden={!briefOpen}>
                <div className="review-progress-head">
                  <strong>协同进度</strong>
                  <span id="overallStatusText">{session.overallStatus}</span>
              </div>
              <div className="overview-progress">
                <span id="overallProgressBar" style={{ width: `${session.progress}%` }} />
              </div>
              <strong className="thinking-progress-number" id="overallProgressText">{session.progress}%</strong>
              <div className="stage-strip" id="stageStrip">
                {session.stages.map((stage) => (
                  <span className="stage-card" data-status={stage.status} key={stage.id}>
                    <strong>{stage.label}</strong>
                    <span>{stage.desc}</span>
                  </span>
                ))}
              </div>
            </div>
          </section>

          <section className="review-card reference-card">
            <div className="reference-section">
              <div className="reference-patient">
                <div className="avatar small">{session.patientAvatar}</div>
                <div className="reference-patient-copy">
                  <div className="reference-patient-inline">
                    <strong id="generationPatientName">{session.patientName}</strong>
                    <em id="generationPatientMeta">{session.patientMeta}</em>
                  </div>
                </div>
              </div>
            </div>
            <div className="reference-section">
              <span className="reference-section-label">输入数据</span>
              <div className="reference-source-list" id="referenceSources">
                {session.selectedSources.map((source) => (
                  <span className="reference-source-chip" key={source}>
                    {source}
                  </span>
                ))}
              </div>
            </div>
          </section>

          <section className="review-card log-card">
            <div className="review-card-head">
              <strong>生成信息链</strong>
              <span>多智能体协同与生成过程</span>
            </div>
            <ul className="process-log" id="processLog">
              {logGroups.map((entry) => (
                <li
                  className="log-entry"
                  data-kind={entry.kind}
                  key={entry.id}
                >
                  <span className="log-marker" aria-hidden="true"></span>
                  <div className="log-entry-body">
                    <div className="log-entry-head">
                      <div className="log-entry-meta">
                        <span className="log-source">{entry.source}</span>
                      </div>
                      <strong className="log-entry-time">{entry.time}</strong>
                    </div>
                    <ul className="log-entry-tasks">
                      {entry.bodies.map((body, bodyIndex) => (
                        <li className="log-entry-copy-item" key={`${entry.id}-${bodyIndex}`}>
                          <span
                            className="log-entry-copy-status"
                            data-kind={entry.kind}
                            aria-label={entry.label}
                            title={entry.label}
                          >
                            {getLogStatusIcon(entry.kind)}
                          </span>
                          <span className="log-entry-copy-text">{body}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </aside>

        <section className="editor-pane">
          <div className="editor-pane-head">
            <div>
              <strong>报告草稿</strong>
              <p>左侧可核对原始数据，右侧可直接编辑 AI 生成内容。</p>
            </div>
          </div>

          <div className="editor-surface">
            <article className="document-canvas" id="documentCanvas" ref={documentCanvasRef}>
              {generationView === "processing" ? (
                <div className="document-placeholder">
                  <div className="placeholder-line wide"></div>
                  <div className="placeholder-line"></div>
                  <div className="placeholder-line short"></div>
                  <div className="placeholder-line wide"></div>
                  <div className="placeholder-line"></div>
                </div>
              ) : editingDraft ? (
                <GenerationEditorCanvas
                  activeSectionId={activeSectionId}
                  draft={editingDraft}
                  onActivateInsertionPoint={handleActivateInsertionPoint}
                  onExtractChartData={handleExtractChartDataForWidget}
                  onOpenChartData={(sectionId, widgetId) => setChartEditor({ sectionId, widgetId })}
                  onDraftChange={updateDraft}
                  onUpdateBulletItem={handleUpdateBulletItem}
                  onUpdateParagraphItem={handleUpdateParagraphItem}
                  onUpdateSectionTitle={handleUpdateSectionTitle}
                  onUpdateWidget={updateWidget}
                />
              ) : (
                <PreviewDocument
                  report={{
                    id: session.reportId,
                    title: session.reportTitle,
                    subtitle: "",
                    date: session.reportDate,
                    serviceId: session.serviceId,
                    selectedSources: session.selectedSources,
                    status: "未发布",
                    tone: "unpublished",
                    content: "",
                  }}
                  documentDraft={documentDraft}
                />
              )}
            </article>
          </div>

          <div
            className="selection-toolbar"
            id="selectionToolbar"
            hidden={!isComplete || !selectionToolbarState.visible}
            style={{ left: selectionToolbarState.left, top: selectionToolbarState.top }}
            onMouseDown={(event) => event.preventDefault()}
          >
            <div className="selection-tool-group selection-tool-dropdown">
              <button
                className="selection-dropdown-trigger"
                id="textStyleTrigger"
                type="button"
                aria-haspopup="true"
                aria-expanded={styleMenuOpen}
                aria-label="文本样式"
                onClick={() => {
                  setStyleMenuOpen((current) => !current);
                  setAlignMenuOpen(false);
                }}
              >
                <span className="selection-prefix text-style-glyph" aria-hidden="true">T</span>
                <span className="selection-dropdown-label" id="textStyleLabel">{textStyleLabel}</span>
                <span className="selection-caret" aria-hidden="true"></span>
              </button>
              <div className="selection-dropdown-menu" id="textStyleMenu" hidden={!styleMenuOpen}>
                <button className="selection-menu-item" data-style-value="p" type="button" onClick={() => execCommand("formatBlock", "p")}>
                  <span className="selection-menu-icon">T</span>
                  <span className="selection-menu-copy">正文</span>
                  <span className="selection-menu-check" aria-hidden="true">✓</span>
                </button>
                <button className="selection-menu-item" data-style-value="h1" type="button" onClick={() => execCommand("formatBlock", "h1")}>
                  <span className="selection-menu-icon">H1</span>
                  <span className="selection-menu-copy">一级标题</span>
                  <span className="selection-menu-check" aria-hidden="true">✓</span>
                </button>
                <button className="selection-menu-item" data-style-value="h2" type="button" onClick={() => execCommand("formatBlock", "h2")}>
                  <span className="selection-menu-icon">H2</span>
                  <span className="selection-menu-copy">二级标题</span>
                  <span className="selection-menu-check" aria-hidden="true">✓</span>
                </button>
                <button className="selection-menu-item" data-style-value="h3" type="button" onClick={() => execCommand("formatBlock", "h3")}>
                  <span className="selection-menu-icon">H3</span>
                  <span className="selection-menu-copy">三级标题</span>
                  <span className="selection-menu-check" aria-hidden="true">✓</span>
                </button>
              </div>
            </div>

            <div className="selection-tool-group selection-tool-dropdown">
              <button
                className="selection-dropdown-trigger"
                id="alignTrigger"
                type="button"
                aria-haspopup="true"
                aria-expanded={alignMenuOpen}
                aria-label="对齐方式"
                onClick={() => {
                  setAlignMenuOpen((current) => !current);
                  setStyleMenuOpen(false);
                }}
              >
                <span className="selection-prefix align-glyph" aria-hidden="true"></span>
                <span className="selection-dropdown-label" id="alignLabel">{alignLabel}</span>
                <span className="selection-caret" aria-hidden="true"></span>
              </button>
              <div className="selection-dropdown-menu" id="alignMenu" hidden={!alignMenuOpen}>
                <button className="selection-menu-item" data-align-value="left" type="button" onClick={() => execCommand("justifyLeft")}>
                  <span className="selection-menu-icon">≡</span>
                  <span className="selection-menu-copy">左对齐</span>
                  <span className="selection-menu-check" aria-hidden="true">✓</span>
                </button>
                <button className="selection-menu-item" data-align-value="center" type="button" onClick={() => execCommand("justifyCenter")}>
                  <span className="selection-menu-icon">≣</span>
                  <span className="selection-menu-copy">居中对齐</span>
                  <span className="selection-menu-check" aria-hidden="true">✓</span>
                </button>
                <button className="selection-menu-item" data-align-value="right" type="button" onClick={() => execCommand("justifyRight")}>
                  <span className="selection-menu-icon">☰</span>
                  <span className="selection-menu-copy">右对齐</span>
                  <span className="selection-menu-check" aria-hidden="true">✓</span>
                </button>
              </div>
            </div>

            <div className="selection-tool-group">
              <div className="selection-tool-row">
                <button className="selection-tool icon" id="orderedList" type="button" aria-label="有序列表" onClick={() => execCommand("insertOrderedList")}>
                  <span className="selection-list-icon ordered" aria-hidden="true"></span>
                </button>
                <button className="selection-tool icon" id="unorderedList" type="button" aria-label="无序列表" onClick={() => execCommand("insertUnorderedList")}>
                  <span className="selection-list-icon unordered" aria-hidden="true"></span>
                </button>
              </div>
            </div>

            <label className="selection-tool-group selection-tool-dropdown color-tool">
              <span className="selection-prefix text-tone" aria-hidden="true">A</span>
              <select className="selection-select" id="textColorSelect" defaultValue="" onChange={(event) => {
                if (event.target.value) {
                  execCommand("foreColor", event.target.value);
                  event.target.value = "";
                }
              }}>
                <option value="">默认</option>
                <option value="#d49a00">黄</option>
                <option value="#e67e22">橙</option>
                <option value="#356dff">蓝</option>
                <option value="#17a668">绿</option>
                <option value="#e53935">红</option>
                <option value="#7b8798">灰</option>
              </select>
            </label>

            <label className="selection-tool-group selection-tool-dropdown color-tool">
              <span className="selection-prefix highlight-tone" aria-hidden="true">▇</span>
              <select className="selection-select" id="highlightColorSelect" defaultValue="" onChange={(event) => {
                if (event.target.value) {
                  execCommand("hiliteColor", event.target.value);
                  event.target.value = "";
                }
              }}>
                <option value="">无</option>
                <option value="#fff1a8">黄</option>
                <option value="#ffe0bf">橙</option>
                <option value="#dce8ff">蓝</option>
                <option value="#ddf6e8">绿</option>
                <option value="#ffd9d6">红</option>
                <option value="#eceff4">灰</option>
              </select>
            </label>
          </div>

          <div
            className="block-inserter"
            id="blockInserter"
            hidden={!isComplete || !blockInserterState.visible}
            style={{ left: blockInserterState.left, top: blockInserterState.top }}
            onMouseDown={(event) => event.preventDefault()}
          >
            <button
              className="block-inserter-toggle"
              id="blockInserterToggle"
              type="button"
              aria-label="添加内容"
              aria-expanded={blockMenuOpen}
              onClick={() => setBlockMenuOpen((current) => !current)}
            >
              +
            </button>
            <div className="block-inserter-menu" id="blockInserterMenu" hidden={!blockMenuOpen}>
              <button
                className="block-inserter-item"
                data-insert="image"
                type="button"
                onClick={() => {
                  pendingImageSectionIdRef.current = getSelectedSectionId();
                  pendingImageItemIdRef.current = activeInsertionBlockRef.current?.dataset.itemId;
                  imageUploadInputRef.current?.click();
                }}
              >
                插入图片
              </button>
              <button className="block-inserter-item" data-insert="table" type="button" onClick={() => handleInsertWidgetBlock("table", getSelectedSectionId())}>
                插入表格
              </button>
              <button className="block-inserter-item" data-insert="radar-chart" type="button" onClick={() => handleInsertWidgetBlock("radar-chart", getSelectedSectionId())}>
                生活方式评估图
              </button>
            </div>
          </div>

          <div
            className="table-toolbar"
            id="tableToolbar"
            hidden={!isComplete || !tableToolbarState.visible}
            style={{ left: tableToolbarState.left, top: tableToolbarState.top }}
            onMouseDown={(event) => event.preventDefault()}
          >
            <button className="selection-tool" id="addRow" type="button" onClick={handleAddTableRow}>
              加行
            </button>
            <button className="selection-tool" id="addCol" type="button" onClick={handleAddTableColumn}>
              加列
            </button>
            <button className="selection-tool" id="deleteRow" type="button" onClick={handleDeleteTableRow}>
              删行
            </button>
            <button className="selection-tool" id="deleteCol" type="button" onClick={handleDeleteTableColumn}>
              删列
            </button>
            <button className="selection-tool" id="mergeCell" type="button" onClick={handleMergeTableCellRight}>
              合并右侧
            </button>
          </div>
          <input id="imageUploadInput" ref={imageUploadInputRef} type="file" accept="image/*" hidden onChange={handleImageSelected} />
        </section>
      </div>

      <div
        className="modal-backdrop"
        id="chartDataModal"
        hidden={!chartEditor || !activeChartWidget}
        onClick={() => setChartEditor(null)}
      >
        <div
          className="chart-data-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="chartDataTitle"
          onClick={(event) => event.stopPropagation()}
        >
          <header className="chart-data-modal-header">
            <div className="chart-data-head">
              <h2 id="chartDataTitle">编辑图表数据</h2>
              <p>支持直接调整各指标分值，留空则显示缺少数据。</p>
            </div>
            <button
              className="modal-close"
              id="chartDataClose"
              type="button"
              aria-label="关闭图表数据弹窗"
              onClick={() => setChartEditor(null)}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M6 6 18 18"></path>
                <path d="M18 6 6 18"></path>
              </svg>
            </button>
          </header>

          <div className="chart-data-modal-body">
            <div className="chart-data-table-wrap">
              <table className="chart-data-table">
                <thead>
                  <tr>
                    <th>指标</th>
                    <th>数值</th>
                  </tr>
                </thead>
                <tbody id="chartDataTableBody">
                  {activeChartWidget?.metrics?.map((metric, index) => (
                    <tr key={`${activeChartWidget.id}-metric-${index}`}>
                      <td>{metric.label}</td>
                      <td>
                        <input
                          className="chart-data-input"
                          type="number"
                          min="0"
                          max="100"
                          step="1"
                          value={metric.value ?? ""}
                          onChange={(event) => handleChartMetricChange(index, event.target.value)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <footer className="chart-data-modal-footer">
            <div className="chart-data-modal-actions">
              <button className="ghost-button" id="chartDataCancel" type="button" onClick={() => setChartEditor(null)}>
                取消
              </button>
              <button className="ghost-button" id="chartDataExtract" type="button" onClick={handleExtractChartData}>
                AI提取患者数据
              </button>
              <button className="primary-button" id="chartDataSave" type="button" onClick={() => setChartEditor(null)}>
                保存
              </button>
            </div>
          </footer>
        </div>
      </div>

      <div
        className="modal-backdrop"
        id="saveConfirmModal"
        hidden={!saveConfirmOpen}
        onClick={() => setSaveConfirmOpen(false)}
      >
        <div
          className="save-confirm-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="saveConfirmTitle"
          onClick={(event) => event.stopPropagation()}
        >
          <header className="save-confirm-header">
            <div className="save-confirm-copy">
              <h2 id="saveConfirmTitle">确认保存</h2>
              <p>确认保存当前编辑内容，并返回报告文档列表？</p>
            </div>
            <button
              className="modal-close"
              id="saveConfirmClose"
              type="button"
              aria-label="关闭保存确认弹窗"
              onClick={() => setSaveConfirmOpen(false)}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M6 6 18 18"></path>
                <path d="M18 6 6 18"></path>
              </svg>
            </button>
          </header>

          <div className="save-confirm-body">
            <p>保存后将同步更新当前文档，并退出编辑页返回列表。</p>
          </div>

          <footer className="save-confirm-footer">
            <div className="save-confirm-actions">
              <button
                className="ghost-button"
                id="saveConfirmCancel"
                type="button"
                onClick={() => setSaveConfirmOpen(false)}
              >
                取消
              </button>
              <button
                className="primary-button"
                id="saveConfirmSubmit"
                type="button"
                onClick={() => {
                  setSaveConfirmOpen(false);
                  onReturnToList(editingDraft, documentCanvasRef.current?.innerHTML);
                }}
              >
                确认保存
              </button>
            </div>
          </footer>
        </div>
      </div>
    </section>
  );
}
