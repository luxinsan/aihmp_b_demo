import { startTransition, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeftOutlined,
  ApartmentOutlined,
  CalendarOutlined,
  EyeOutlined,
  FileTextOutlined,
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
import Select from "antd/es/select";
import type { DefaultOptionType } from "antd/es/select";
import {
  healthPlanCheckInLibrary,
  healthPlanEditorBaselineOptions,
  healthPlanEditorPatientTagOptions,
  healthPlanEditorTeamOptions,
  healthPlanTaskLibrary,
} from "../../../data/healthPlanEditor";
import type {
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
  onPreview: (draft: HealthPlanEditorDraft) => void;
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

const sidebarTabs: { key: HealthPlanEditorSidebarTab; label: string }[] = [
  { key: "plan-info", label: "方案信息" },
  { key: "task-components", label: "任务组件" },
  { key: "daily-checkins", label: "日常打卡" },
];

const teamOptions: DefaultOptionType[] = healthPlanEditorTeamOptions.map((item) => ({ label: item, value: item }));
const patientTagOptions: DefaultOptionType[] = healthPlanEditorPatientTagOptions.map((item) => ({
  label: item,
  value: item,
}));
const baselineOptions: DefaultOptionType[] = healthPlanEditorBaselineOptions.map((item) => ({
  label: item,
  value: item,
}));

const quickCreateTaskCategories = new Set(["follow-up", "education", "return-visit", "summary-report"]);
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
const SUMMARY_NODE_BASE_HEIGHT = 402;
const SUMMARY_NODE_EXTRA_ROW_HEIGHT = 28;
const CONDITION_NODE_HEADER_HEIGHT = 64;
const CONDITION_NODE_LIST_TOP_OFFSET = 12;
const CONDITION_NODE_ITEM_HEIGHT = 28;
const CONDITION_NODE_ITEM_GAP = 8;

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
    height: node.data.repeatEnabled ? TASK_NODE_REPEAT_HEIGHT : TASK_NODE_COMPACT_HEIGHT,
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

export function PatientHealthPlanEditorStage({
  draft,
  onBack,
  onPreview,
  onSave,
}: PatientHealthPlanEditorStageProps) {
  const [sidebarTab, setSidebarTab] = useState<HealthPlanEditorSidebarTab>("plan-info");
  const [meta, setMeta] = useState(draft.meta);
  const [nodes, setNodes] = useState(draft.nodes);
  const [edges, setEdges] = useState(draft.edges);
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);
  const [zoomPercent, setZoomPercent] = useState(71);
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
  const quickCreateItems = useMemo(
    () => healthPlanTaskLibrary.filter((item) => item.kind === "task" && quickCreateTaskCategories.has(item.category ?? "")),
    [],
  );

  useEffect(() => {
    setMeta(draft.meta);
    setNodes(draft.nodes);
    setEdges(draft.edges);
    setSelectedEdgeId(null);
    setPendingConnectionMenu(null);
    undoStackRef.current = [];
    redoStackRef.current = [];
  }, [draft]);

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
      startTransition(() => {
        setMeta((current) => ({ ...current, ...patch }));
      });
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

      connectCompletedRef.current = true;
      setPendingConnectionMenu(null);
      commitSnapshot();
      const nextEdge = createEdge(connection);
      setSelectedEdgeId(nextEdge.id);
      setEdges((current) => addEdge(nextEdge, current));
    },
    [commitSnapshot],
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

  const saveCurrentDraft = useCallback(() => ({ meta, nodes, edges }), [edges, meta, nodes]);
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

  return (
    <section className="panel health-plan-editor-stage" aria-label="健康计划编辑器">
      <header className="health-plan-editor-topbar">
        <div className="health-plan-editor-topbar-main">
          <button className="health-plan-editor-back-button" type="button" onClick={onBack}>
            <ArrowLeftOutlined />
          </button>
          <div className="health-plan-editor-title-wrap">
            <h2>{meta.name}</h2>
            <p>患者档案健康管理计划编排</p>
          </div>
        </div>

        <div className="health-plan-editor-topbar-actions">
          <Button className="ds-antd-health-action-button" icon={<EyeOutlined />} onClick={() => onPreview(saveCurrentDraft())}>
            预览
          </Button>
          <Button icon={<SaveOutlined />} type="primary" onClick={() => onSave(saveCurrentDraft())}>
            保存方案
          </Button>
        </div>
      </header>

      <div className="health-plan-editor-shell">
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

          {sidebarTab === "plan-info" ? (
            <div className="health-plan-editor-form">
              <section className="health-plan-editor-form-group">
                <label>方案名称</label>
                <Input value={meta.name} onChange={(event) => handleMetaChange({ name: event.target.value })} />
              </section>
              <section className="health-plan-editor-form-group">
                <label>方案别名</label>
                <Input value={meta.alias} onChange={(event) => handleMetaChange({ alias: event.target.value })} />
              </section>
              <section className="health-plan-editor-form-group">
                <label>方案描述</label>
                <Input value={meta.description} onChange={(event) => handleMetaChange({ description: event.target.value })} />
              </section>
              <section className="health-plan-editor-form-group">
                <label>所属团队</label>
                <Select options={teamOptions} value={meta.team} onChange={(value) => handleMetaChange({ team: value })} />
              </section>
              <section className="health-plan-editor-form-group">
                <label>患者画像</label>
                <Select
                  options={patientTagOptions}
                  value={meta.patientTag}
                  onChange={(value) => handleMetaChange({ patientTag: value })}
                />
              </section>
              <section className="health-plan-editor-form-group">
                <label>基准时间类型</label>
                <Select
                  options={baselineOptions}
                  value={meta.baselineType}
                  onChange={(value) => handleMetaChange({ baselineType: value })}
                />
              </section>
            </div>
          ) : null}

          {sidebarTab === "task-components" ? (
            <div className="health-plan-editor-library">
              {healthPlanTaskLibrary.map((item) => (
                <article className="health-plan-editor-library-card" key={item.id}>
                  <div className="health-plan-editor-library-copy">
                    <strong>{item.title}</strong>
                    <p>{item.description}</p>
                  </div>
                  <button type="button" onClick={() => handleAddLibraryItem(item)}>
                    添加到画布
                  </button>
                </article>
              ))}
            </div>
          ) : null}

          {sidebarTab === "daily-checkins" ? (
            <div className="health-plan-editor-library">
              {healthPlanCheckInLibrary.map((item) => (
                <article className="health-plan-editor-library-card" key={item.id}>
                  <div className="health-plan-editor-library-copy">
                    <strong>{item.title}</strong>
                    <p>{item.description}</p>
                  </div>
                  <button type="button" onClick={() => handleAddLibraryItem(item)}>
                    添加到画布
                  </button>
                </article>
              ))}
            </div>
          ) : null}
        </aside>

        <div className="health-plan-editor-canvas-shell" ref={canvasShellRef}>
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
            edges={flowEdges}
            edgesReconnectable
            fitView
            fitViewOptions={{ padding: 0.16 }}
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
            {selectedNode ? `当前选中：${selectedNode.type === "conditionNode" ? "条件判断节点" : selectedNode.data.kind === "task" ? selectedNode.data.headerTitle : "开始节点"}` : "拖拽节点以编排执行顺序，连线定义任务流转关系"}
          </div>
        </div>
      </div>
    </section>
  );
}
