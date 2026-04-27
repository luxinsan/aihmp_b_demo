import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeftOutlined,
  ApartmentOutlined,
  CalendarOutlined,
  DeleteOutlined,
  EditOutlined,
  FileTextOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PlusOutlined,
  PhoneOutlined,
  SaveOutlined,
  ShrinkOutlined,
  UndoOutlined,
  RedoOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
} from "@ant-design/icons";
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  BackgroundVariant,
  ConnectionLineType,
  ConnectionMode,
  ReactFlow,
  type Connection,
  type Edge,
  type EdgeChange,
  type Node,
  type NodeChange,
  type ReactFlowInstance,
  type XYPosition,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import Button from "antd/es/button";
import Input from "antd/es/input";
import InputNumber from "antd/es/input-number";
import message from "antd/es/message";
import Modal from "antd/es/modal";
import Radio from "antd/es/radio";
import Select from "antd/es/select";
import type { DefaultOptionType } from "antd/es/select";
import Switch from "antd/es/switch";
import TimePicker from "antd/es/time-picker";
import dayjs from "dayjs";
import {
  healthPlanEditorBaselineOptions,
  healthPlanEditorPatientTagOptions,
  healthPlanEditorTeamOptions,
  healthPlanTaskLibrary,
} from "../../../data/healthPlanEditor";
import type {
  HealthPlanEditorCheckInFrequency,
  HealthPlanEditorCheckInPlanItem,
  HealthPlanEditorCheckInType,
  HealthPlanEditorConditionNodeData,
  HealthPlanEditorDraft,
  HealthPlanEditorEdge,
  HealthPlanEditorLibraryItem,
  HealthPlanEditorNode,
  HealthPlanEditorPlanMeta,
  HealthPlanEditorSidebarTab,
  HealthPlanEditorTaskNodeData,
} from "../../../types/healthPlanEditor";
import { healthPlanEditorNodeTypes } from "./health-plan-editor/HealthPlanEditorNodes";

type DraftSnapshot = {
  meta: HealthPlanEditorPlanMeta;
  nodes: HealthPlanEditorNode[];
  edges: HealthPlanEditorEdge[];
};

type PatientHealthPlanEditorStageProps = {
  draft: HealthPlanEditorDraft;
  onBack: () => void;
  onSave: (draft: HealthPlanEditorDraft) => void;
};

type PendingConnectionMenuState = {
  menuPosition: XYPosition;
  source: string;
  sourceHandle: string | null;
};

type CanvasViewport = {
  x: number;
  y: number;
  zoom: number;
};

type SidebarPlanItem = {
  id: string;
  title: string;
  description: string;
};

type CheckInType = HealthPlanEditorCheckInType;
type CheckInFrequency = HealthPlanEditorCheckInFrequency;
type CheckInPlanItem = HealthPlanEditorCheckInPlanItem;

type CheckInDraft = {
  name: string;
  type: CheckInType;
  description: string;
  startDay: number | null;
  endDay: number | null;
  frequency: CheckInFrequency;
  timesPerPeriod: number;
  pushEnabled: boolean;
  pushDays: number[];
  pushTimes: string[];
};

const sidebarTabs: { key: HealthPlanEditorSidebarTab; label: string }[] = [
  { key: "basic-info", label: "基础信息" },
  { key: "health-checkins", label: "健康打卡" },
  { key: "summary-report", label: "阶段总结" },
];

const teamOptions: DefaultOptionType[] = healthPlanEditorTeamOptions.map((item) => ({ label: item, value: item }));
const baselineOptions: DefaultOptionType[] = healthPlanEditorBaselineOptions.map((item) => ({
  label: item,
  value: item,
}));
const { TextArea } = Input;

const quickCreateTaskCategories = new Set(["education", "follow-up", "return-visit"]);
const NODE_COLLISION_GAP = 24;
const CONNECT_MENU_VIEWPORT_MARGIN = 16;
const TEXT_EDIT_SESSION_MS = 800;
const START_NODE_SIZE = 40;
const TASK_NODE_WIDTH = 332;
const CONDITION_NODE_WIDTH = 272;
const CONDITION_NODE_BASE_HEIGHT = 160;
const CONDITION_NODE_ITEM_STEP = 44;
const TASK_NODE_COMPACT_HEIGHT = 300;
const TASK_NODE_REPEAT_HEIGHT = 412;
const TASK_NODE_PUSH_COLLAPSED_HEIGHT = 52;
const TASK_NODE_PUSH_EXPANDED_HEIGHT = 90;
const SUMMARY_NODE_BASE_HEIGHT = 402;
const SUMMARY_NODE_EXTRA_ROW_HEIGHT = 28;
const CONDITION_NODE_HEADER_HEIGHT = 64;
const CONDITION_NODE_LIST_TOP_OFFSET = 12;
const CONDITION_NODE_ITEM_HEIGHT = 28;
const CONDITION_NODE_ITEM_GAP = 8;
const CHECKIN_DESCRIPTION_MAX_LENGTH = 40;

const checkInTypeOptions: Array<{ id: CheckInType; label: string }> = [
  { id: "diet", label: "饮食" },
  { id: "water", label: "饮水" },
  { id: "exercise", label: "运动" },
  { id: "sleep", label: "睡眠记录" },
  { id: "psychology", label: "心理" },
  { id: "nutrition", label: "营养素" },
  { id: "weight", label: "量体重" },
  { id: "waist", label: "量腰围" },
  { id: "hip", label: "量臀围" },
  { id: "bodyFat", label: "量体脂率" },
  { id: "bloodPressure", label: "量血压" },
];

const checkInTagOptions: Partial<Record<CheckInType, string[]>> = {
  diet: ["早餐", "午餐", "晚餐", "加餐"],
  exercise: ["慢跑", "快跑", "打球", "其他（支持输入）"],
  psychology: ["正念", "冥想", "呼吸训练"],
  weight: ["晨起空腹体重"],
  bloodPressure: ["日常居家血压"],
};

const checkInFrequencyOptions: Array<{ id: CheckInFrequency; label: string }> = [
  { id: "daily", label: "每天" },
  { id: "weekly", label: "每周（每7天）" },
];

const checkInWeeklyDayOptions = Array.from({ length: 7 }, (_, index) => ({
  label: `第${index + 1}天`,
  value: index + 1,
}));

const defaultCheckInDraft: CheckInDraft = {
  name: "饮食打卡",
  type: "diet",
  description: "",
  startDay: null,
  endDay: null,
  frequency: "daily",
  timesPerPeriod: 1,
  pushEnabled: false,
  pushDays: [1],
  pushTimes: [""],
};

type NodeBounds = {
  left: number;
  top: number;
  right: number;
  bottom: number;
};

type MeasuredSize = {
  width: number;
  height: number;
};

type TargetAnchorCandidate = {
  target?: string | null;
  targetHandle?: string | null;
};

function cloneSnapshot(snapshot: DraftSnapshot): DraftSnapshot {
  if (typeof structuredClone === "function") {
    return structuredClone(snapshot);
  }

  return JSON.parse(JSON.stringify(snapshot)) as DraftSnapshot;
}

function createSnapshot(meta: HealthPlanEditorPlanMeta, nodes: HealthPlanEditorNode[], edges: HealthPlanEditorEdge[]): DraftSnapshot {
  return cloneSnapshot({ meta, nodes, edges });
}

function createEdge(connection: Connection): Edge {
  return {
    ...connection,
    id: `edge-${connection.source}-${connection.sourceHandle ?? "main"}-${connection.target}-${connection.targetHandle ?? "main"}-${Date.now()}`,
    style: {
      stroke: "#b8c2d6",
      strokeWidth: 2.2,
    },
    type: "bezier",
  };
}

function getTargetAnchorKey(connection: TargetAnchorCandidate) {
  return `${connection.target ?? ""}:${connection.targetHandle ?? "left-target"}`;
}

function hasOccupiedTargetAnchor(connection: TargetAnchorCandidate, edges: HealthPlanEditorEdge[]) {
  const targetAnchorKey = getTargetAnchorKey(connection);
  return edges.some((edge) => getTargetAnchorKey(edge) === targetAnchorKey);
}

function keepUniqueTargetAnchorEdges(edges: HealthPlanEditorEdge[]) {
  const occupiedTargetAnchors = new Set<string>();

  return edges.filter((edge) => {
    const targetAnchorKey = getTargetAnchorKey(edge);
    if (occupiedTargetAnchors.has(targetAnchorKey)) {
      return false;
    }

    occupiedTargetAnchors.add(targetAnchorKey);
    return true;
  });
}

function buildAutoLayout(nodes: HealthPlanEditorNode[], edges: HealthPlanEditorEdge[]) {
  const layoutColumnGap = 168;
  const layoutRowGap = 132;
  const layoutCenterY = 360;
  const levelMap = new Map<string, number>();
  const childrenMap = new Map<string, string[]>();
  const indegreeMap = new Map<string, number>();

  nodes.forEach((node) => {
    childrenMap.set(node.id, []);
    indegreeMap.set(node.id, 0);
  });

  edges.forEach((edge) => {
    const children = childrenMap.get(edge.source) ?? [];
    children.push(edge.target);
    childrenMap.set(edge.source, children);
    indegreeMap.set(edge.target, (indegreeMap.get(edge.target) ?? 0) + 1);
  });

  const queue = nodes.filter((node) => (indegreeMap.get(node.id) ?? 0) === 0).map((node) => node.id);
  queue.forEach((nodeId) => levelMap.set(nodeId, 0));

  while (queue.length) {
    const currentId = queue.shift()!;
    const currentLevel = levelMap.get(currentId) ?? 0;
    const children = childrenMap.get(currentId) ?? [];

    children.forEach((childId) => {
      const nextLevel = Math.max(levelMap.get(childId) ?? 0, currentLevel + 1);
      levelMap.set(childId, nextLevel);
      indegreeMap.set(childId, (indegreeMap.get(childId) ?? 1) - 1);
      if ((indegreeMap.get(childId) ?? 0) <= 0) {
        queue.push(childId);
      }
    });
  }

  const groupedNodes = new Map<number, HealthPlanEditorNode[]>();
  const columnWidthMap = new Map<number, number>();
  const columnHeightMap = new Map<number, number>();
  nodes.forEach((node) => {
    const level = levelMap.get(node.id) ?? 0;
    const group = groupedNodes.get(level) ?? [];
    group.push(node);
    groupedNodes.set(level, group);
    if (node.type !== "startNode") {
      const nodeWidth = getNodeSize(node).width;
      columnWidthMap.set(level, Math.max(columnWidthMap.get(level) ?? 0, nodeWidth));
    }
  });

  const sortedLevels = [...groupedNodes.keys()].sort((left, right) => left - right);
  const columnStartMap = new Map<number, number>();
  let nextColumnX = 140;

  sortedLevels.forEach((level, index) => {
    if (index === 0) {
      columnStartMap.set(level, nextColumnX);
      return;
    }

    const previousLevel = sortedLevels[index - 1];
    if (previousLevel == null) {
      columnStartMap.set(level, nextColumnX);
      return;
    }

    nextColumnX += (columnWidthMap.get(previousLevel) ?? TASK_NODE_WIDTH) + layoutColumnGap;
    columnStartMap.set(level, nextColumnX);
  });

  sortedLevels.forEach((level) => {
    const columnNodes = [...(groupedNodes.get(level) ?? [])]
      .filter((node) => node.type !== "startNode")
      .sort((left, right) => left.position.y - right.position.y);

    const columnHeight = columnNodes.reduce((total, node, index) => {
      return total + getNodeSize(node).height + (index > 0 ? layoutRowGap : 0);
    }, 0);

    columnHeightMap.set(level, columnHeight);
  });

  return nodes.map((node) => {
    if (node.type === "startNode") {
      return {
        ...node,
        position: { x: 12, y: 244 },
      };
    }

    const level = levelMap.get(node.id) ?? 0;
    const columnNodes = groupedNodes.get(level) ?? [];
    const sortedColumn = [...columnNodes].sort((left, right) => left.position.y - right.position.y);
    const row = Math.max(0, sortedColumn.findIndex((item) => item.id === node.id));
    const previousRowsHeight = sortedColumn
      .slice(0, row)
      .reduce((total, currentNode) => total + getNodeSize(currentNode).height + layoutRowGap, 0);
    const columnHeight = columnHeightMap.get(level) ?? getNodeSize(node).height;
    const columnStartY = Math.max(120, layoutCenterY - columnHeight / 2);

    return {
      ...node,
      position: {
        x: columnStartMap.get(level) ?? 140,
        y: columnStartY + previousRowsHeight,
      },
    };
  });
}

function getDefaultNodeType(item: HealthPlanEditorLibraryItem) {
  return item.kind === "condition" ? "conditionNode" : "taskNode";
}

function getPointerClientPosition(event: MouseEvent | TouchEvent | PointerEvent) {
  if ("changedTouches" in event && event.changedTouches.length > 0) {
    const touch = event.changedTouches[0];
    if (touch) {
      return { x: touch.clientX, y: touch.clientY };
    }
  }

  if ("clientX" in event && "clientY" in event) {
    return { x: event.clientX, y: event.clientY };
  }

  return { x: 0, y: 0 };
}

function getSourceHandleFlowPosition(node: HealthPlanEditorNode, handleId: string | null) {
  const { width, height } = getNodeSize(node);

  if (node.type === "startNode" || node.data.kind === "start") {
    return {
      x: node.position.x + width,
      y: node.position.y + height / 2,
    };
  }

  if (node.data.kind === "condition" && handleId?.startsWith("source-")) {
    const conditionId = handleId.replace("source-", "");
    const conditionIndex = Math.max(0, node.data.conditions.findIndex((condition) => condition.id === conditionId));

    return {
      x: node.position.x + width,
      y:
        node.position.y +
        CONDITION_NODE_HEADER_HEIGHT +
        CONDITION_NODE_LIST_TOP_OFFSET +
        conditionIndex * (CONDITION_NODE_ITEM_HEIGHT + CONDITION_NODE_ITEM_GAP) +
        CONDITION_NODE_ITEM_HEIGHT / 2,
    };
  }

  return {
    x: node.position.x + width,
    y: node.position.y + height / 2,
  };
}

function getQuickCreateItemIcon(item: HealthPlanEditorLibraryItem) {
  switch (item.category) {
    case "education":
    case "summary-report":
      return { icon: <FileTextOutlined />, tone: "violet" as const };
    case "return-visit":
      return { icon: <CalendarOutlined />, tone: "orange" as const };
    case "follow-up":
    default:
      return { icon: <PhoneOutlined />, tone: "green" as const };
  }
}

function getCheckInTypeLabel(type: CheckInType) {
  return checkInTypeOptions.find((option) => option.id === type)?.label ?? "打卡";
}

function CheckInTypeIcon({ type }: { type: CheckInType }) {
  switch (type) {
    case "diet":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M7 3v8" />
          <path d="M4.5 3v4.5a2.5 2.5 0 0 0 5 0V3" />
          <path d="M7 11v10" />
          <path d="M15 3v18" />
          <path d="M15 3c3 1.5 4.5 4.5 4 8h-4" />
        </svg>
      );
    case "water":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 3s6 6.7 6 11a6 6 0 0 1-12 0c0-4.3 6-11 6-11Z" />
          <path d="M9.5 15.5a3 3 0 0 0 4 1.8" />
        </svg>
      );
    case "exercise":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="13" cy="5" r="2" />
          <path d="m8 21 3-6" />
          <path d="m16 21-2-5-4-3 2-4" />
          <path d="m7 10 4-1 3 3 4 1" />
        </svg>
      );
    case "sleep":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M18 15.5A7 7 0 0 1 8.5 6a7.5 7.5 0 1 0 9.5 9.5Z" />
        </svg>
      );
    case "psychology":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 4c-2.8 2.2-4 4.5-4 7a4 4 0 0 0 8 0c0-2.5-1.2-4.8-4-7Z" />
          <path d="M6 20h12" />
          <path d="M12 15v5" />
        </svg>
      );
    case "nutrition":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M8 13a4 4 0 1 1 8 0c0 2.5-2 4-4 6-2-2-4-3.5-4-6Z" />
          <path d="M12 9v5" />
          <path d="M9.5 11.5h5" />
        </svg>
      );
    case "bloodPressure":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M7 12a5 5 0 0 1 10 0v3a5 5 0 0 1-10 0v-3Z" />
          <path d="M12 7v10" />
          <path d="M16 20c2.2-.8 3.5-2.6 3.5-5" />
          <path d="M8 20c-2.2-.8-3.5-2.6-3.5-5" />
        </svg>
      );
    case "weight":
    case "waist":
    case "hip":
    case "bodyFat":
    default:
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M5 9a7 7 0 0 1 14 0v9H5V9Z" />
          <path d="M9 9a3 3 0 0 1 6 0" />
          <path d="M12 9l2-2" />
        </svg>
      );
  }
}

function getDefaultCheckInName(type: CheckInType) {
  return `${getCheckInTypeLabel(type)}打卡`;
}

function getCheckInFrequencyLabel(frequency: CheckInFrequency) {
  return checkInFrequencyOptions.find((option) => option.id === frequency)?.label ?? "每天";
}

function getCheckInRepeatCount(frequency: CheckInFrequency, timesPerPeriod: number, startDay: number, endDay: number) {
  const durationDays = Math.max(1, endDay - startDay + 1);
  if (frequency === "weekly") {
    return timesPerPeriod * Math.ceil(durationDays / 7);
  }
  return timesPerPeriod * durationDays;
}

function normalizeCheckInPushTimes(pushTimes: string[], count: number) {
  return Array.from({ length: Math.max(1, count) }, (_, index) => pushTimes[index] ?? "");
}

function normalizeCheckInPushDays(pushDays: number[], count: number) {
  return Array.from({ length: Math.max(1, count) }, (_, index) => pushDays[index] ?? 1);
}

function estimateSummaryTextareaRows(summaryContent?: string) {
  const normalizedContent = summaryContent?.trim() ?? "";
  if (!normalizedContent) {
    return 1;
  }

  const lines = normalizedContent.split(/\r?\n/);
  const estimatedRows = lines.reduce((total, line) => total + Math.max(1, Math.ceil(line.length / 24)), 0);
  return Math.max(1, Math.min(6, estimatedRows));
}

function getNodeSize(node: HealthPlanEditorNode) {
  const measuredWidth = node.measured?.width ?? node.width;
  const measuredHeight = node.measured?.height ?? node.height;

  if (measuredWidth && measuredHeight) {
    return { width: measuredWidth, height: measuredHeight };
  }

  if (node.type === "startNode" || node.data.kind === "start") {
    return { width: START_NODE_SIZE, height: START_NODE_SIZE };
  }

  if (node.data.kind === "condition") {
    const conditionCount = Math.max(1, node.data.conditions.length);
    return {
      width: CONDITION_NODE_WIDTH,
      height: CONDITION_NODE_BASE_HEIGHT + conditionCount * CONDITION_NODE_ITEM_STEP,
    };
  }

  if (node.data.category === "summary-report") {
    const summaryRows = estimateSummaryTextareaRows(node.data.summaryContent);

    return {
      width: TASK_NODE_WIDTH,
      height: SUMMARY_NODE_BASE_HEIGHT + (summaryRows - 1) * SUMMARY_NODE_EXTRA_ROW_HEIGHT,
    };
  }

  return {
    width: TASK_NODE_WIDTH,
    height:
      (node.data.repeatEnabled ? TASK_NODE_REPEAT_HEIGHT : TASK_NODE_COMPACT_HEIGHT) +
      (node.data.pushEnabled ? TASK_NODE_PUSH_EXPANDED_HEIGHT : TASK_NODE_PUSH_COLLAPSED_HEIGHT),
  };
}

function getNodeBounds(node: HealthPlanEditorNode): NodeBounds {
  const size = getNodeSize(node);

  return {
    left: node.position.x,
    top: node.position.y,
    right: node.position.x + size.width,
    bottom: node.position.y + size.height,
  };
}

function boundsOverlap(left: NodeBounds, right: NodeBounds) {
  return (
    left.left < right.right + NODE_COLLISION_GAP &&
    left.right + NODE_COLLISION_GAP > right.left &&
    left.top < right.bottom + NODE_COLLISION_GAP &&
    left.bottom + NODE_COLLISION_GAP > right.top
  );
}

function resolveNodePosition(node: HealthPlanEditorNode, allNodes: HealthPlanEditorNode[]) {
  const otherNodes = allNodes.filter((item) => item.id !== node.id);
  const step = NODE_COLLISION_GAP + 28;
  const candidateOffsets: XYPosition[] = [{ x: 0, y: 0 }];

  for (let ring = 1; ring <= 18; ring += 1) {
    for (let column = -ring; column <= ring; column += 1) {
      for (let row = -ring; row <= ring; row += 1) {
        if (Math.max(Math.abs(column), Math.abs(row)) !== ring) {
          continue;
        }

        candidateOffsets.push({ x: column * step, y: row * step });
      }
    }
  }

  for (const offset of candidateOffsets) {
    const candidate = {
      ...node,
      position: {
        x: node.position.x + offset.x,
        y: node.position.y + offset.y,
      },
    };
    const bounds = getNodeBounds(candidate);

    if (!otherNodes.some((item) => boundsOverlap(bounds, getNodeBounds(item)))) {
      return candidate;
    }
  }

  return node;
}

function preventNodeOverlaps(nodes: HealthPlanEditorNode[], targetIds?: Set<string>) {
  return nodes.reduce<HealthPlanEditorNode[]>((resolved, node) => {
    if (!targetIds?.size || targetIds.has(node.id)) {
      return [...resolved, resolveNodePosition(node, [...resolved, ...nodes.filter((item) => item.id !== node.id && !resolved.some((done) => done.id === item.id))])];
    }

    return [...resolved, node];
  }, []);
}

function getInitialCanvasNodes(nodes: HealthPlanEditorNode[], edges: HealthPlanEditorEdge[]) {
  return preventNodeOverlaps(buildAutoLayout(nodes, edges));
}

export function PatientHealthPlanEditorStage({
  draft,
  onBack,
  onSave,
}: PatientHealthPlanEditorStageProps) {
  const [sidebarTab, setSidebarTab] = useState<HealthPlanEditorSidebarTab>("basic-info");
  const [meta, setMeta] = useState(draft.meta);
  const [nodes, setNodes] = useState(() => {
    const initialEdges = keepUniqueTargetAnchorEdges(draft.edges);
    return getInitialCanvasNodes(draft.nodes, initialEdges);
  });
  const [edges, setEdges] = useState(() => keepUniqueTargetAnchorEdges(draft.edges));
  const [checkInPlanItems, setCheckInPlanItems] = useState<CheckInPlanItem[]>(draft.checkInPlanItems);
  const [summaryPlanItems, setSummaryPlanItems] = useState<SidebarPlanItem[]>([]);
  const [checkInModalOpen, setCheckInModalOpen] = useState(false);
  const [editingCheckInItemId, setEditingCheckInItemId] = useState<string | null>(null);
  const [checkInDraft, setCheckInDraft] = useState<CheckInDraft>(defaultCheckInDraft);
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [zoomPercent, setZoomPercent] = useState(100);
  const [pendingConnectionMenu, setPendingConnectionMenu] = useState<PendingConnectionMenuState | null>(null);
  const [canvasViewport, setCanvasViewport] = useState<CanvasViewport>({ x: 0, y: 0, zoom: 1 });
  const [connectMenuSize, setConnectMenuSize] = useState<MeasuredSize>({ width: 0, height: 0 });

  const reactFlowRef = useRef<ReactFlowInstance<any, any> | null>(null);
  const canvasShellRef = useRef<HTMLDivElement | null>(null);
  const connectMenuRef = useRef<HTMLDivElement | null>(null);
  const undoStackRef = useRef<DraftSnapshot[]>([]);
  const redoStackRef = useRef<DraftSnapshot[]>([]);
  const connectStartRef = useRef<{ source: string; sourceHandle: string | null } | null>(null);
  const connectCompletedRef = useRef(false);
  const suppressNextPaneClickRef = useRef(false);
  const textEditSessionTimerRef = useRef<number | null>(null);
  const conditionLibraryItem = healthPlanTaskLibrary.find((item) => item.kind === "condition");
  const summaryLibraryItems = useMemo(
    () => healthPlanTaskLibrary.filter((item) => item.category === "summary-report"),
    [],
  );
  const quickCreateItems = useMemo(
    () => healthPlanTaskLibrary.filter((item) => item.kind === "task" && quickCreateTaskCategories.has(item.category ?? "")),
    [],
  );
  const sortedCheckInPlanItems = useMemo(() => {
    const typeOrderMap = new Map(checkInTypeOptions.map((option, index) => [option.id, index]));
    return [...checkInPlanItems.map((item, index) => ({ item, index }))]
      .sort((left, right) => {
        const leftOrder = typeOrderMap.get(left.item.type) ?? Number.MAX_SAFE_INTEGER;
        const rightOrder = typeOrderMap.get(right.item.type) ?? Number.MAX_SAFE_INTEGER;
        return leftOrder === rightOrder ? left.index - right.index : leftOrder - rightOrder;
      })
      .map(({ item }) => item);
  }, [checkInPlanItems]);

  useEffect(() => {
    const menuElement = connectMenuRef.current;
    if (!menuElement || typeof ResizeObserver === "undefined") {
      return;
    }

    const updateSize = () => {
      const nextWidth = menuElement.offsetWidth;
      const nextHeight = menuElement.offsetHeight;
      setConnectMenuSize((current) =>
        current.width === nextWidth && current.height === nextHeight
          ? current
          : { width: nextWidth, height: nextHeight },
      );
    };

    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(menuElement);

    return () => observer.disconnect();
  }, [pendingConnectionMenu]);

  useEffect(
    () => () => {
      if (textEditSessionTimerRef.current != null) {
        window.clearTimeout(textEditSessionTimerRef.current);
      }
    },
    [],
  );

  const selectedNode = useMemo(() => nodes.find((node) => node.selected), [nodes]);

  const commitSnapshot = useCallback(() => {
    undoStackRef.current.push(createSnapshot(meta, nodes, edges));
    if (undoStackRef.current.length > 40) {
      undoStackRef.current.shift();
    }
    redoStackRef.current = [];
  }, [edges, meta, nodes]);

  const commitTextEditSnapshot = useCallback(() => {
    if (textEditSessionTimerRef.current == null) {
      commitSnapshot();
    } else {
      window.clearTimeout(textEditSessionTimerRef.current);
    }

    textEditSessionTimerRef.current = window.setTimeout(() => {
      textEditSessionTimerRef.current = null;
    }, TEXT_EDIT_SESSION_MS);
  }, [commitSnapshot]);

  const handleMetaChange = useCallback(
    (patch: Partial<HealthPlanEditorPlanMeta>) => {
      commitTextEditSnapshot();
      setMeta((current) => ({ ...current, ...patch }));
    },
    [commitTextEditSnapshot],
  );

  const handleTaskNodeChange = useCallback(
    (nodeId: string, patch: Partial<HealthPlanEditorTaskNodeData>) => {
      commitTextEditSnapshot();
      setNodes((current) =>
        preventNodeOverlaps(
          current.map((node) =>
          node.id === nodeId && node.data.kind === "task"
            ? { ...node, data: { ...node.data, ...patch } }
            : node,
          ),
          new Set([nodeId]),
        ),
      );
    },
    [commitTextEditSnapshot],
  );

  const handleConditionLabelChange = useCallback(
    (nodeId: string, conditionId: string, label: string) => {
      commitTextEditSnapshot();
      setNodes((current) =>
        preventNodeOverlaps(
          current.map((node) => {
            if (node.id !== nodeId || node.data.kind !== "condition") {
              return node;
            }

            return {
              ...node,
              data: {
                ...node.data,
                conditions: node.data.conditions.map((condition) =>
                  condition.id === conditionId ? { ...condition, label } : condition,
                ),
              },
            };
          }),
          new Set([nodeId]),
        ),
      );
    },
    [commitTextEditSnapshot],
  );

  const handleAddCondition = useCallback(
    (nodeId: string) => {
      commitSnapshot();
      setNodes((current) =>
        preventNodeOverlaps(
          current.map((node) => {
            if (node.id !== nodeId || node.data.kind !== "condition") {
              return node;
            }

            return {
              ...node,
              data: {
                ...node.data,
                conditions: [
                  ...node.data.conditions,
                  { id: `condition-${Date.now()}`, label: "" },
                ],
              },
            };
          }),
          new Set([nodeId]),
        ),
      );
    },
    [commitSnapshot],
  );

  const handleDeleteCondition = useCallback(
    (nodeId: string, conditionId: string) => {
      commitSnapshot();
      setNodes((current) =>
        preventNodeOverlaps(
          current.map((node) => {
            if (node.id !== nodeId || node.data.kind !== "condition" || node.data.conditions.length < 3) {
              return node;
            }

            return {
              ...node,
              data: {
                ...node.data,
                conditions: node.data.conditions.filter((condition) => condition.id !== conditionId),
              },
            };
          }),
          new Set([nodeId]),
        ),
      );
    },
    [commitSnapshot],
  );

  const handleDeleteNode = useCallback(
    (nodeId: string) => {
      commitSnapshot();
      setNodes((current) => current.filter((node) => node.id !== nodeId));
      setEdges((current) => current.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
    },
    [commitSnapshot],
  );

  const handleAddLibraryItem = useCallback(
    (
      item: HealthPlanEditorLibraryItem,
      options?: {
        connectFrom?: { source: string; sourceHandle: string | null };
        position?: XYPosition;
      },
    ) => {
      commitSnapshot();
      const nextId = `${item.id}-${Date.now()}`;
      const selectedPosition =
        options?.position ??
        (selectedNode && selectedNode.type !== "startNode"
          ? { x: selectedNode.position.x + 110, y: selectedNode.position.y + 110 }
          : item.defaultPosition);

      setNodes((current) => [
        ...preventNodeOverlaps(
          [
            ...current.map((node) => ({ ...node, selected: false })),
            {
              id: nextId,
              type: getDefaultNodeType(item),
              position: selectedPosition,
              selected: true,
              data:
                item.kind === "condition"
                  ? { ...(item.nodeData as HealthPlanEditorConditionNodeData) }
                  : { ...(item.nodeData as HealthPlanEditorTaskNodeData) },
            },
          ],
          new Set([nextId]),
        ),
      ]);

      if (options?.connectFrom) {
        const nextEdge = createEdge({
          source: options.connectFrom.source,
          sourceHandle: options.connectFrom.sourceHandle,
          target: nextId,
          targetHandle: "left-target",
        });
        setSelectedEdgeId(nextEdge.id);
        setEdges((current) => addEdge(nextEdge, current));
      }

      setPendingConnectionMenu(null);
    },
    [commitSnapshot, selectedNode],
  );

  const handleRemoveCheckInPlanItem = useCallback((itemId: string) => {
    setCheckInPlanItems((current) => current.filter((item) => item.id !== itemId));
  }, []);

  const handleOpenCheckInModal = useCallback(() => {
    setEditingCheckInItemId(null);
    setCheckInDraft(defaultCheckInDraft);
    setCheckInModalOpen(true);
  }, []);

  const handleEditCheckInPlanItem = useCallback((item: CheckInPlanItem) => {
    setEditingCheckInItemId(item.id);
    setCheckInDraft({
      name: item.name,
      type: item.type,
      description: item.description,
      startDay: item.startDay,
      endDay: item.endDay,
      frequency: item.frequency,
      timesPerPeriod: item.timesPerPeriod,
      pushEnabled: item.pushEnabled,
      pushDays: normalizeCheckInPushDays(item.pushDays, item.timesPerPeriod),
      pushTimes: normalizeCheckInPushTimes(item.pushTimes, item.timesPerPeriod),
    });
    setCheckInModalOpen(true);
  }, []);

  const handleSaveCheckInConfig = useCallback(() => {
    const normalizedName = checkInDraft.name.trim();
    const normalizedDescription = checkInDraft.description.trim();
    const normalizedTimesPerPeriod = Math.max(1, Number(checkInDraft.timesPerPeriod || 1));
    const normalizedPushTimes = normalizeCheckInPushTimes(checkInDraft.pushTimes, normalizedTimesPerPeriod);

    if (!normalizedName) {
      message.warning("请填写打卡名称");
      return;
    }
    if (!normalizedDescription) {
      message.warning("请填写打卡描述");
      return;
    }
    if (checkInDraft.startDay == null || checkInDraft.endDay == null) {
      message.warning("请填写策略运行周期");
      return;
    }
    if (!normalizedTimesPerPeriod) {
      message.warning("请填写打卡次数");
      return;
    }
    if (checkInDraft.pushEnabled && normalizedPushTimes.some((pushTime) => !pushTime)) {
      message.warning("请填写推送时间");
      return;
    }

    const normalizedStartDay = checkInDraft.startDay;
    const normalizedEndDay = Math.max(normalizedStartDay, checkInDraft.endDay);
    const nextItem: CheckInPlanItem = {
      id: editingCheckInItemId ?? `checkin-${Date.now()}`,
      name: normalizedName,
      type: checkInDraft.type,
      description: normalizedDescription,
      startDay: normalizedStartDay,
      endDay: normalizedEndDay,
      frequency: checkInDraft.frequency,
      timesPerPeriod: normalizedTimesPerPeriod,
      pushEnabled: checkInDraft.pushEnabled,
      pushDays: normalizeCheckInPushDays(checkInDraft.pushDays, normalizedTimesPerPeriod),
      pushTimes: normalizedPushTimes,
    };
    setCheckInPlanItems((current) =>
      editingCheckInItemId == null
        ? [...current, nextItem]
        : current.map((item) => (item.id === editingCheckInItemId ? nextItem : item)),
    );
    setCheckInModalOpen(false);
    setEditingCheckInItemId(null);
  }, [checkInDraft, editingCheckInItemId]);

  const handleAddSummaryPlanItem = useCallback((item: HealthPlanEditorLibraryItem) => {
    setSummaryPlanItems((current) => [
      ...current,
      {
        id: `${item.id}-${Date.now()}`,
        title: item.title,
        description: item.description,
      },
    ]);
  }, []);

  const handleRemoveSummaryPlanItem = useCallback((itemId: string) => {
    setSummaryPlanItems((current) => current.filter((item) => item.id !== itemId));
  }, []);

  const handleNodesChange = useCallback(
    (changes: NodeChange<HealthPlanEditorNode>[]) => {
      const shouldCommit = changes.some((change) => change.type === "remove");
      if (shouldCommit) {
        commitSnapshot();
      }

      setNodes((current) => {
        const nextNodes = applyNodeChanges(changes, current);
        const movedNodeIds = new Set(
          changes
            .filter((change) => change.type === "position" || change.type === "dimensions")
            .map((change) => change.id),
        );

        if (!movedNodeIds.size) {
          return nextNodes;
        }

        return preventNodeOverlaps(nextNodes, movedNodeIds);
      });
    },
    [commitSnapshot],
  );

  const handleEdgesChange = useCallback(
    (changes: EdgeChange<HealthPlanEditorEdge>[]) => {
      const shouldCommit = changes.some((change) => change.type === "remove");
      if (shouldCommit) {
        commitSnapshot();
      }

      const selectionChange = changes.find((change) => change.type === "select");
      if (selectionChange && "selected" in selectionChange) {
        setSelectedEdgeId(selectionChange.selected ? selectionChange.id : null);
      }

      setEdges((current) => applyEdgeChanges(changes, current));
    },
    [commitSnapshot],
  );

  const handleConnect = useCallback(
    (connection: Connection) => {
      if (!connection.source || !connection.target || connection.source === connection.target) {
        return;
      }
      if (hasOccupiedTargetAnchor(connection, edges)) {
        return;
      }

      connectCompletedRef.current = true;
      setPendingConnectionMenu(null);
      commitSnapshot();
      const nextEdge = createEdge(connection);
      setSelectedEdgeId(nextEdge.id);
      setEdges((current) => (hasOccupiedTargetAnchor(connection, current) ? current : addEdge(nextEdge, current)));
    },
    [commitSnapshot, edges],
  );

  const isConnectionValid = useCallback(
    (connection: Connection | Edge) => {
      if (!connection.source || !connection.target || connection.source === connection.target) {
        return false;
      }

      return !hasOccupiedTargetAnchor(connection, edges);
    },
    [edges],
  );

  const handleConnectEnd = useCallback(
    (event: MouseEvent | TouchEvent) => {
      const connectionStart = connectStartRef.current;
      const flow = reactFlowRef.current;
      const shell = canvasShellRef.current;

      if (connectCompletedRef.current || !connectionStart || !flow || !shell) {
        connectStartRef.current = null;
        connectCompletedRef.current = false;
        return;
      }

      const clientPoint = getPointerClientPosition(event);
      const shellRect = shell.getBoundingClientRect();
      const isInsideShell =
        clientPoint.x >= shellRect.left &&
        clientPoint.x <= shellRect.right &&
        clientPoint.y >= shellRect.top &&
        clientPoint.y <= shellRect.bottom;

      if (!isInsideShell) {
        connectStartRef.current = null;
        connectCompletedRef.current = false;
        return;
      }

      const nextMenuState = {
        menuPosition: flow.screenToFlowPosition({
          x: clientPoint.x + 18,
          y: clientPoint.y - 20,
        }),
        source: connectionStart.source,
        sourceHandle: connectionStart.sourceHandle,
      };
      suppressNextPaneClickRef.current = true;
      window.setTimeout(() => {
        suppressNextPaneClickRef.current = false;
      }, 0);

      connectStartRef.current = null;
      connectCompletedRef.current = false;
      window.requestAnimationFrame(() => {
        setPendingConnectionMenu(nextMenuState);
      });
    },
    [],
  );

  useEffect(() => {
    const menuState = pendingConnectionMenu;
    const flow = reactFlowRef.current;
    const shell = canvasShellRef.current;

    if (!menuState || !flow || !shell || connectMenuSize.width <= 0 || connectMenuSize.height <= 0) {
      return;
    }

    const shellRect = shell.getBoundingClientRect();
    const currentLeft = menuState.menuPosition.x * canvasViewport.zoom + canvasViewport.x;
    const currentTop = menuState.menuPosition.y * canvasViewport.zoom + canvasViewport.y;
    const maxLeft = Math.max(
      CONNECT_MENU_VIEWPORT_MARGIN,
      shellRect.width - connectMenuSize.width * canvasViewport.zoom - CONNECT_MENU_VIEWPORT_MARGIN,
    );
    const maxTop = Math.max(
      CONNECT_MENU_VIEWPORT_MARGIN,
      shellRect.height - connectMenuSize.height * canvasViewport.zoom - CONNECT_MENU_VIEWPORT_MARGIN,
    );
    const clampedLeft = Math.min(Math.max(currentLeft, CONNECT_MENU_VIEWPORT_MARGIN), maxLeft);
    const clampedTop = Math.min(Math.max(currentTop, CONNECT_MENU_VIEWPORT_MARGIN), maxTop);

    if (Math.abs(clampedLeft - currentLeft) < 0.5 && Math.abs(clampedTop - currentTop) < 0.5) {
      return;
    }

    const nextPosition = flow.screenToFlowPosition({
      x: shellRect.left + clampedLeft,
      y: shellRect.top + clampedTop,
    });

    setPendingConnectionMenu((current) =>
      current == null
        ? current
        : {
            ...current,
            menuPosition: nextPosition,
          },
    );
  }, [canvasViewport, connectMenuSize, pendingConnectionMenu]);

  const handleAutoLayout = useCallback(() => {
    commitSnapshot();
    setNodes((current) => preventNodeOverlaps(buildAutoLayout(current, edges)));
    queueMicrotask(() => {
      reactFlowRef.current?.fitView({ duration: 250, padding: 0.18 });
    });
  }, [commitSnapshot, edges]);

  const handleUndo = useCallback(() => {
    const previous = undoStackRef.current.pop();
    if (!previous) {
      return;
    }

    redoStackRef.current.push(createSnapshot(meta, nodes, edges));
    setMeta(previous.meta);
    setNodes(previous.nodes);
    setEdges(previous.edges);
  }, [edges, meta, nodes]);

  const handleRedo = useCallback(() => {
    const next = redoStackRef.current.pop();
    if (!next) {
      return;
    }

    undoStackRef.current.push(createSnapshot(meta, nodes, edges));
    setMeta(next.meta);
    setNodes(next.nodes);
    setEdges(next.edges);
  }, [edges, meta, nodes]);

  const saveCurrentDraft = useCallback(
    () => ({ meta, nodes, edges, checkInPlanItems }),
    [checkInPlanItems, edges, meta, nodes],
  );
  const selectedEdge = useMemo(() => edges.find((edge) => edge.id === selectedEdgeId) ?? null, [edges, selectedEdgeId]);

  const flowNodes = useMemo(
    () =>
      nodes.map((node) => {
        const highlightedSourceHandleIds =
          selectedEdge?.source === node.id ? [selectedEdge.sourceHandle ?? (node.type === "startNode" ? "source" : "right-source")] : [];
        const highlightedTargetHandleIds =
          selectedEdge?.target === node.id ? [selectedEdge.targetHandle ?? "left-target"] : [];
        const connectedToSelectedEdge = highlightedSourceHandleIds.length > 0 || highlightedTargetHandleIds.length > 0;

        if (node.data.kind === "task") {
          return {
            ...node,
            data: {
              ...node.data,
              connectedToSelectedEdge,
              highlightedSourceHandleIds,
              highlightedTargetHandleIds,
              onChange: (patch: Partial<HealthPlanEditorTaskNodeData>) => handleTaskNodeChange(node.id, patch),
              onDelete: () => handleDeleteNode(node.id),
            },
          };
        }

        if (node.data.kind === "condition") {
          return {
            ...node,
            data: {
              ...node.data,
              connectedToSelectedEdge,
              highlightedSourceHandleIds,
              highlightedTargetHandleIds,
              onAddCondition: () => handleAddCondition(node.id),
              onChangeCondition: (conditionId: string, label: string) =>
                handleConditionLabelChange(node.id, conditionId, label),
              onDeleteCondition: (conditionId: string) => handleDeleteCondition(node.id, conditionId),
              onDelete: () => handleDeleteNode(node.id),
            },
          };
        }

        return {
          ...node,
          data: {
            ...node.data,
            connectedToSelectedEdge,
            highlightedSourceHandleIds,
          },
        };
      }),
    [handleAddCondition, handleConditionLabelChange, handleDeleteCondition, handleDeleteNode, handleTaskNodeChange, nodes, selectedEdge],
  );

  const flowEdges = useMemo(
    () =>
      edges.map((edge) => ({
        ...edge,
        selected: edge.id === selectedEdgeId,
        style: {
          ...(edge.style ?? {}),
          stroke: edge.id === selectedEdgeId ? "#2f76ff" : "#b8c2d6",
          strokeWidth: edge.id === selectedEdgeId ? 2.8 : 2.2,
        },
      })),
    [edges, selectedEdgeId],
  );

  const backgroundConfig = useMemo(() => {
    const zoom = Math.max(0.35, Math.min(1.45, zoomPercent / 100));
    const gap = Math.round(Math.max(28, Math.min(42, 38 / zoom)));
    const size = Number(Math.max(0.55, Math.min(0.9, 0.72 / Math.sqrt(zoom))).toFixed(2));

    return {
      color: "#d8dee6",
      gap,
      size,
    };
  }, [zoomPercent]);

  const pendingConnectionPreviewPath = useMemo(() => {
    if (!pendingConnectionMenu) {
      return null;
    }

    const sourceNode = nodes.find((node) => node.id === pendingConnectionMenu.source);
    if (!sourceNode) {
      return null;
    }

    const startPoint = getSourceHandleFlowPosition(sourceNode, pendingConnectionMenu.sourceHandle);
    const startX = startPoint.x * canvasViewport.zoom + canvasViewport.x;
    const startY = startPoint.y * canvasViewport.zoom + canvasViewport.y;
    const endX = pendingConnectionMenu.menuPosition.x * canvasViewport.zoom + canvasViewport.x;
    const endY =
      pendingConnectionMenu.menuPosition.y * canvasViewport.zoom + canvasViewport.y + (connectMenuSize.height * canvasViewport.zoom) / 2;
    const controlOffset = Math.max(56, Math.abs(endX - startX) * 0.35);

    return `M ${startX},${startY} C ${startX + controlOffset},${startY} ${endX - controlOffset},${endY} ${endX},${endY}`;
  }, [canvasViewport, connectMenuSize.height, nodes, pendingConnectionMenu]);

  const hasCheckInPeriod = checkInDraft.startDay != null && checkInDraft.endDay != null;
  const normalizedCheckInStartDay = checkInDraft.startDay ?? 0;
  const normalizedCheckInEndDay = hasCheckInPeriod
    ? Math.max(checkInDraft.startDay ?? 0, checkInDraft.endDay ?? 0)
    : null;
  const normalizedCheckInTimesPerPeriod = Math.max(1, Number(checkInDraft.timesPerPeriod || 1));
  const checkInRepeatCount = normalizedCheckInEndDay == null
    ? 0
    : getCheckInRepeatCount(
        checkInDraft.frequency,
        normalizedCheckInTimesPerPeriod,
        normalizedCheckInStartDay,
        normalizedCheckInEndDay,
      );
  const checkInTimesLabel = checkInDraft.frequency === "weekly" ? "每周" : "每天";
  const checkInTags = checkInTagOptions[checkInDraft.type] ?? [];
  const checkInPushDaySlots = normalizeCheckInPushDays(checkInDraft.pushDays, normalizedCheckInTimesPerPeriod);
  const checkInPushTimeSlots = normalizeCheckInPushTimes(checkInDraft.pushTimes, normalizedCheckInTimesPerPeriod);
  const hasRequiredCheckInPushTimes = !checkInDraft.pushEnabled || checkInPushTimeSlots.every(Boolean);
  const canSaveCheckInConfig =
    checkInDraft.name.trim().length > 0 &&
    checkInDraft.description.trim().length > 0 &&
    hasCheckInPeriod &&
    normalizedCheckInTimesPerPeriod > 0 &&
    hasRequiredCheckInPushTimes;
  const checkInStrategySummary = normalizedCheckInEndDay == null
    ? `策略运行周期未配置，${getCheckInFrequencyLabel(checkInDraft.frequency)}打卡${normalizedCheckInTimesPerPeriod}次。`
    : `计划启动后第${normalizedCheckInStartDay}至${normalizedCheckInEndDay}天，${getCheckInFrequencyLabel(checkInDraft.frequency)}打卡${normalizedCheckInTimesPerPeriod}次，共需要打卡${checkInRepeatCount}次。`;

  return (
    <section className="panel health-plan-editor-stage" aria-label="健康计划编辑器">
      <header className="patient-tab-page-header is-align-center health-plan-editor-page-header">
        <div className="patient-tab-page-header-main">
          <div className="patient-tab-page-title-wrap">
            <div className="patient-tab-page-title-row">
              <button className="health-plan-editor-back-button" type="button" onClick={onBack}>
                <ArrowLeftOutlined />
              </button>
              <h2 className="patient-tab-page-title">{meta.name || "新建健康管理计划"}</h2>
            </div>
          </div>
        </div>

        <div className="patient-tab-page-actions health-plan-editor-page-actions">
          <Button icon={<SaveOutlined />} type="primary" onClick={() => onSave(saveCurrentDraft())}>
            保存方案
          </Button>
        </div>
      </header>

      <div className={`health-plan-editor-shell${sidebarCollapsed ? " is-sidebar-collapsed" : ""}`}>
        <aside className="health-plan-editor-sidebar">
          <div className="health-plan-editor-sidebar-tabs" role="tablist" aria-label="编辑器侧栏">
            {sidebarTabs.map((tab) => (
              <button
                aria-selected={sidebarTab === tab.key}
                className={sidebarTab === tab.key ? "is-active" : ""}
                key={tab.key}
                type="button"
                onClick={() => setSidebarTab(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {sidebarTab === "basic-info" ? (
            <div className="health-plan-editor-form">
              <section className="health-plan-editor-form-group">
                <label>方案名称</label>
                <Input value={meta.name} onChange={(event) => handleMetaChange({ name: event.target.value })} />
              </section>
              <section className="health-plan-editor-form-group">
                <label>
                  <span>方案别名</span>
                  <small>在客户端显示该名称</small>
                </label>
                <Input value={meta.alias} onChange={(event) => handleMetaChange({ alias: event.target.value })} />
              </section>
              <section className="health-plan-editor-form-group">
                <label>方案描述</label>
                <Input value={meta.description} onChange={(event) => handleMetaChange({ description: event.target.value })} />
              </section>
              <section className="health-plan-editor-form-group">
                <label>所属团队</label>
                <Select options={teamOptions} value={meta.team || undefined} onChange={(value) => handleMetaChange({ team: value })} />
              </section>
              <section className="health-plan-editor-form-group">
                <label>
                  <span>患者画像</span>
                  <small>自然语言描述客户画像，AI根据画像智能匹配客户</small>
                </label>
                <TextArea
                  autoSize={{ minRows: 3, maxRows: 6 }}
                  value={meta.patientTag}
                  onChange={(event) => handleMetaChange({ patientTag: event.target.value })}
                />
              </section>
              <section className="health-plan-editor-form-group">
                <label>
                  <span>方案启动时间</span>
                  <small>自动根据客户的关键事件自动开始执行方案</small>
                </label>
                <Select
                  options={baselineOptions}
                  value={meta.baselineType || undefined}
                  onChange={(value) => handleMetaChange({ baselineType: value })}
                />
              </section>
            </div>
          ) : null}

          {sidebarTab === "health-checkins" ? (
            <div className="health-plan-checkin-config">
              <div className="health-plan-checkin-config-head">
                <div className="health-plan-checkin-config-title-wrap">
                  <h3>健康打卡</h3>
                  <p>可设置饮食/运动/指标测量等多种打卡任务</p>
                </div>
                <button type="button" onClick={handleOpenCheckInModal}>
                  <PlusOutlined />
                  添加
                </button>
              </div>

              <div className="health-plan-checkin-config-list">
                {checkInPlanItems.length ? (
                  sortedCheckInPlanItems.map((item) => {
                    const repeatCount = getCheckInRepeatCount(item.frequency, item.timesPerPeriod, item.startDay, item.endDay);
                    return (
                      <article className="health-plan-checkin-config-card" key={item.id}>
                        <div className="health-plan-checkin-config-card-head">
                          <div className="health-plan-checkin-config-card-title">
                            <span className={`health-plan-checkin-config-card-icon type-${item.type}`}>
                              <CheckInTypeIcon type={item.type} />
                            </span>
                            <div className="health-plan-checkin-config-card-copy">
                              <strong>{item.name}</strong>
                              <p title={item.description}>{item.description}</p>
                            </div>
                          </div>
                          <div className="health-plan-checkin-config-card-actions">
                            <button
                              type="button"
                              aria-label="编辑打卡"
                              title="编辑"
                              onClick={() => handleEditCheckInPlanItem(item)}
                            >
                              <EditOutlined />
                            </button>
                            <button
                              type="button"
                              aria-label="移除打卡"
                              title="移除"
                              onClick={() => handleRemoveCheckInPlanItem(item.id)}
                            >
                              <DeleteOutlined />
                            </button>
                          </div>
                        </div>
                        <div className="health-plan-checkin-config-card-foot">
                          <span>
                            计划启动后第{item.startDay}至{item.endDay}天，{getCheckInFrequencyLabel(item.frequency)}执行{item.timesPerPeriod}次，共{repeatCount}次
                          </span>
                        </div>
                      </article>
                    );
                  })
                ) : (
                  <div className="health-plan-checkin-config-empty">暂未配置打卡任务</div>
                )}
              </div>
            </div>
          ) : null}

          {sidebarTab === "summary-report" ? (
            <div className="health-plan-editor-library">
              {summaryLibraryItems.map((item) => (
                <article className="health-plan-editor-library-card" key={item.id}>
                  <div className="health-plan-editor-library-copy">
                    <strong>{item.title}</strong>
                    <p>{item.description}</p>
                  </div>
                  <button type="button" onClick={() => handleAddSummaryPlanItem(item)}>
                    添加任务
                  </button>
                </article>
              ))}

              <section className="health-plan-editor-library-list">
                <header>
                  <strong>已配置阶段总结</strong>
                  <span>{summaryPlanItems.length} 项</span>
                </header>
                {summaryPlanItems.length ? (
                  <div className="health-plan-editor-library-list-items">
                    {summaryPlanItems.map((item) => (
                      <article className="health-plan-editor-library-list-item" key={item.id}>
                        <div>
                          <strong>{item.title}</strong>
                          <p>{item.description}</p>
                        </div>
                        <button type="button" onClick={() => handleRemoveSummaryPlanItem(item.id)}>
                          移除
                        </button>
                      </article>
                    ))}
                  </div>
                ) : (
                  <p className="health-plan-editor-library-empty">当前未配置阶段总结</p>
                )}
              </section>
            </div>
          ) : null}
        </aside>

        <div className="health-plan-editor-canvas-shell" ref={canvasShellRef}>
          <button
            aria-label={sidebarCollapsed ? "展开侧窗" : "折叠侧窗"}
            className="health-plan-editor-sidebar-toggle"
            title={sidebarCollapsed ? "展开侧窗" : "折叠侧窗"}
            type="button"
            onClick={() => setSidebarCollapsed((current) => !current)}
          >
            {sidebarCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </button>

          <div className="health-plan-editor-floating-tools">
            <button
              aria-label="快速添加条件节点"
              type="button"
              onClick={() => {
                if (conditionLibraryItem) {
                  handleAddLibraryItem(conditionLibraryItem);
                }
              }}
            >
              <PlusOutlined />
            </button>
            <button aria-label="整理布局" type="button" onClick={handleAutoLayout}>
              <ApartmentOutlined />
            </button>
          </div>

          <div className="health-plan-editor-history-tools">
            <button aria-label="撤销" disabled={!undoStackRef.current.length} type="button" onClick={handleUndo}>
              <UndoOutlined />
            </button>
            <button aria-label="重做" disabled={!redoStackRef.current.length} type="button" onClick={handleRedo}>
              <RedoOutlined />
            </button>
          </div>

          <ReactFlow
            connectionLineStyle={{ stroke: "#2f76ff", strokeWidth: 2.2 }}
            connectionLineType={ConnectionLineType.Bezier}
            connectionMode={ConnectionMode.Loose}
            connectionRadius={48}
            defaultEdgeOptions={{
              style: { stroke: "#b8c2d6", strokeWidth: 2.2 },
              type: "bezier",
            }}
            defaultViewport={{ x: 0, y: 0, zoom: 1 }}
            edges={flowEdges}
            edgesReconnectable
            isValidConnection={isConnectionValid}
            maxZoom={1.45}
            minZoom={0.35}
            nodeTypes={healthPlanEditorNodeTypes}
            nodes={flowNodes}
            nodesConnectable
            panOnDrag={[1]}
            proOptions={{ hideAttribution: true }}
            selectionOnDrag
            onConnectEnd={handleConnectEnd}
            onConnectStart={(_, params) => {
              if (!params.nodeId) {
                connectStartRef.current = null;
                connectCompletedRef.current = false;
                return;
              }

              connectStartRef.current = {
                source: params.nodeId,
                sourceHandle: params.handleId ?? null,
              };
              connectCompletedRef.current = false;
              setPendingConnectionMenu(null);
            }}
            onConnect={handleConnect}
            onEdgeClick={(_, edge) => setSelectedEdgeId(edge.id)}
            onEdgesChange={handleEdgesChange}
            onInit={(instance) => {
              reactFlowRef.current = instance;
              setZoomPercent(Math.round(instance.getZoom() * 100));
              setCanvasViewport(instance.getViewport());
            }}
            onMove={(_, viewport) => setCanvasViewport(viewport)}
            onMoveEnd={(_, viewport) => setZoomPercent(Math.round(viewport.zoom * 100))}
            onNodesChange={handleNodesChange}
            onPaneClick={() => {
              if (suppressNextPaneClickRef.current) {
                return;
              }

              setSelectedEdgeId(null);
              setPendingConnectionMenu(null);
            }}
          >
            <Background
              color={backgroundConfig.color}
              gap={backgroundConfig.gap}
              size={backgroundConfig.size}
              variant={BackgroundVariant.Dots}
            />
          </ReactFlow>

          {pendingConnectionPreviewPath ? (
            <svg className="health-plan-editor-pending-connection">
              <path d={pendingConnectionPreviewPath} />
            </svg>
          ) : null}

          {pendingConnectionMenu ? (
            <div
              className="health-plan-editor-connect-menu"
              ref={connectMenuRef}
              style={{
                left: pendingConnectionMenu.menuPosition.x * canvasViewport.zoom + canvasViewport.x,
                top: pendingConnectionMenu.menuPosition.y * canvasViewport.zoom + canvasViewport.y,
                transform: `scale(${canvasViewport.zoom})`,
                transformOrigin: "top left",
              }}
            >
              <div className="health-plan-editor-connect-menu-head">添加节点</div>
              <div className="health-plan-editor-connect-menu-list">
                {quickCreateItems.map((item) => {
                  const visual = getQuickCreateItemIcon(item);

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() =>
                        handleAddLibraryItem(item, {
                          connectFrom: {
                            source: pendingConnectionMenu.source,
                            sourceHandle: pendingConnectionMenu.sourceHandle,
                          },
                          position: pendingConnectionMenu.menuPosition,
                        })
                      }
                    >
                      <span className={`health-plan-node-icon tone-${visual.tone}`}>{visual.icon}</span>
                      <strong>{item.title}</strong>
                    </button>
                  );
                })}
                {conditionLibraryItem ? (
                  <>
                    <div className="health-plan-editor-connect-menu-divider" />
                    <button
                      type="button"
                      onClick={() =>
                        handleAddLibraryItem(conditionLibraryItem, {
                          connectFrom: {
                            source: pendingConnectionMenu.source,
                            sourceHandle: pendingConnectionMenu.sourceHandle,
                          },
                          position: pendingConnectionMenu.menuPosition,
                        })
                      }
                    >
                      <span className="health-plan-node-icon tone-blue">
                        <ApartmentOutlined />
                      </span>
                      <strong>条件判断</strong>
                    </button>
                  </>
                ) : null}
              </div>
            </div>
          ) : null}

          <div className="health-plan-editor-bottom-toolbar">
            <button className="is-active" type="button">
              <ApartmentOutlined />
            </button>
            <span>{zoomPercent}%</span>
            <button
              className="health-plan-editor-zoom-reset-button"
              type="button"
              onClick={() => {
                reactFlowRef.current?.setViewport({ x: 0, y: 0, zoom: 1 }, { duration: 180 });
                setZoomPercent(100);
              }}
            >
              100%
            </button>
            <button type="button" onClick={() => reactFlowRef.current?.zoomOut({ duration: 160 })}>
              <ZoomOutOutlined />
            </button>
            <button type="button" onClick={() => reactFlowRef.current?.zoomIn({ duration: 160 })}>
              <ZoomInOutlined />
            </button>
            <button type="button" onClick={() => reactFlowRef.current?.fitView({ duration: 240, padding: 0.18 })}>
              <ShrinkOutlined />
            </button>
          </div>

          <div className="health-plan-editor-canvas-hint">
            {selectedNode ? `当前选中：${selectedNode.type === "conditionNode" ? "条件判断节点" : selectedNode.data.kind === "task" ? selectedNode.data.headerTitle : "开始节点"}` : "健康任务（画布）：拖拽节点以编排执行顺序，连线定义任务流转关系"}
          </div>
        </div>
      </div>

      <Modal
        centered
        cancelText="取消"
        className="health-plan-checkin-modal ds-modal-content-viewport"
        okButtonProps={{ disabled: !canSaveCheckInConfig }}
        okText="确定"
        open={checkInModalOpen}
        title={editingCheckInItemId == null ? "添加打卡" : "编辑打卡"}
        width={960}
        onCancel={() => {
          setCheckInModalOpen(false);
          setEditingCheckInItemId(null);
        }}
        onOk={handleSaveCheckInConfig}
      >
        <div className="health-plan-checkin-modal-body">
          <section className="health-plan-checkin-modal-section health-plan-checkin-modal-type-section">
            <label htmlFor="checkin-type"><em>*</em>打卡类型：</label>
            <div className="health-plan-checkin-type-field">
              <Select
                id="checkin-type"
                disabled={editingCheckInItemId != null}
                showSearch
                optionFilterProp="label"
                options={checkInTypeOptions.map((option) => ({ label: option.label, value: option.id }))}
                placeholder="请选择打卡类型"
                style={{ width: 240 }}
                value={checkInDraft.type}
                onChange={(value: CheckInType) =>
                  setCheckInDraft((current) => ({
                    ...current,
                    type: value,
                    name: getDefaultCheckInName(value),
                  }))
                }
              />
              {checkInTags.length ? (
                <p className="health-plan-checkin-tag-copy">
                  客户端小程序打卡时可选：{checkInTags.join("、")}
                </p>
              ) : null}
            </div>
          </section>

          <section className="health-plan-checkin-modal-section">
            <label htmlFor="checkin-name"><em>*</em>打卡名称：</label>
            <Input
              id="checkin-name"
              placeholder="请输入打卡名称"
              value={checkInDraft.name}
              onChange={(event) =>
                setCheckInDraft((current) => ({ ...current, name: event.target.value }))
              }
            />
          </section>

          <section className="health-plan-checkin-modal-section">
            <label htmlFor="checkin-description"><em>*</em>打卡描述：</label>
            <Input
              id="checkin-description"
              maxLength={CHECKIN_DESCRIPTION_MAX_LENGTH}
              placeholder="可描述打卡要求/建议等内容"
              value={checkInDraft.description}
              onChange={(event) =>
                setCheckInDraft((current) => ({ ...current, description: event.target.value }))
              }
            />
          </section>

          <section className="health-plan-checkin-modal-section health-plan-checkin-modal-strategy-section">
            <label><em>*</em>打卡策略：</label>

            <div className="health-plan-checkin-modal-strategy">
              <div className="health-plan-checkin-modal-strategy-row">
                <span className="health-plan-checkin-modal-sub-label">策略运行周期：</span>
                <span>计划启动后第</span>
                <InputNumber
                  controls={false}
                  min={0}
                  value={checkInDraft.startDay}
                  onChange={(value) => {
                    const nextStartDay = value == null ? null : Number(value);
                    setCheckInDraft((current) => ({
                      ...current,
                      startDay: nextStartDay,
                      endDay:
                        nextStartDay == null || current.endDay == null
                          ? current.endDay
                          : Math.max(nextStartDay, current.endDay),
                    }));
                  }}
                />
                <span>至</span>
                <InputNumber
                  controls={false}
                  min={checkInDraft.startDay ?? 0}
                  value={normalizedCheckInEndDay}
                  onChange={(value) =>
                    setCheckInDraft((current) => ({
                      ...current,
                      endDay:
                        value == null
                          ? null
                          : Math.max(current.startDay ?? 0, Number(value)),
                    }))
                  }
                />
                <span>天开放打卡</span>
              </div>

              <div className="health-plan-checkin-modal-strategy-row">
                <span className="health-plan-checkin-modal-sub-label">打卡频率：</span>
                <Radio.Group
                  options={checkInFrequencyOptions.map((option) => ({ label: option.label, value: option.id }))}
                  value={checkInDraft.frequency}
                  onChange={(event) =>
                    setCheckInDraft((current) => ({ ...current, frequency: event.target.value as CheckInFrequency }))
                  }
                />
              </div>

              <div className="health-plan-checkin-modal-strategy-row">
                <span className="health-plan-checkin-modal-sub-label">打卡次数：</span>
                <span>{checkInTimesLabel}需要打卡</span>
                <InputNumber
                  controls={false}
                  min={1}
                  value={checkInDraft.timesPerPeriod}
                  onChange={(value) =>
                    setCheckInDraft((current) => ({
                      ...current,
                      timesPerPeriod: value == null ? 1 : Number(value),
                      pushDays: normalizeCheckInPushDays(current.pushDays, value == null ? 1 : Number(value)),
                      pushTimes: normalizeCheckInPushTimes(current.pushTimes, value == null ? 1 : Number(value)),
                    }))
                  }
                />
                <span>次</span>
              </div>

              <div className="health-plan-checkin-modal-summary">
                <span>打卡策略总结：{checkInStrategySummary}</span>
              </div>
            </div>
          </section>

          <section className="health-plan-checkin-modal-section health-plan-checkin-modal-strategy-section">
            <label><em>*</em>消息推送策略：</label>

            <div className="health-plan-checkin-push-strategy">
              <div className="health-plan-checkin-push-switch-row">
                <span>是否开启推送</span>
                <Switch
                  checked={checkInDraft.pushEnabled}
                  size="small"
                  onChange={(checked) => setCheckInDraft((current) => ({ ...current, pushEnabled: checked }))}
                />
              </div>
              {checkInDraft.pushEnabled ? (
                <>
                  <div className="health-plan-checkin-push-divider" />
                  <p className="health-plan-checkin-push-hint">
                    系统将自动按配置推送打卡提醒消息，实际触达时间可能存在延迟
                  </p>
                  <p className="health-plan-checkin-push-hint">
                    推送次数按每个周期内的打卡次数进行配置
                  </p>
                  <div className="health-plan-checkin-push-time-list">
                    {checkInPushTimeSlots.map((pushTime, index) => (
                      <div className="health-plan-checkin-push-time-row" key={index}>
                        <span>{checkInDraft.frequency === "weekly" ? `第${index + 1}次推送：每周的` : `第${index + 1}次推送：每天`}</span>
                        {checkInDraft.frequency === "weekly" ? (
                          <Select
                            options={checkInWeeklyDayOptions}
                            value={checkInPushDaySlots[index]}
                            style={{ width: 104 }}
                            onChange={(value) => {
                              const nextPushDays = [...checkInPushDaySlots];
                              nextPushDays[index] = value;
                              setCheckInDraft((current) => ({ ...current, pushDays: nextPushDays }));
                            }}
                          />
                        ) : null}
                        <TimePicker
                          format="HH:mm"
                          minuteStep={5}
                          placeholder="选择时间"
                          value={pushTime ? dayjs(pushTime, "HH:mm") : null}
                          onChange={(value) => {
                            const nextPushTimes = [...checkInPushTimeSlots];
                            nextPushTimes[index] = value?.format("HH:mm") ?? "";
                            setCheckInDraft((current) => ({ ...current, pushTimes: nextPushTimes }));
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </>
              ) : null}
            </div>
          </section>
        </div>
      </Modal>
    </section>
  );
}
