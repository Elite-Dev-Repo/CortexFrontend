import { getProject } from "./projectsApi";
import { getFeature } from "./featuresApi";

let data;

const isValidPos = (pos) => pos && typeof pos === "object" && "x" in pos && "y" in pos && pos.x !== null && pos.y !== null;
const isZeroSentinel = (pos) => isValidPos(pos) && Number(pos.x) === 0 && Number(pos.y) === 0;

const normalizePos = (pos, fallback) => {
  if (!isValidPos(pos) || isZeroSentinel(pos)) return fallback;
  const x = Math.max(0, Math.min(32767, Math.round(Number(pos.x) || 0)));
  const y = Math.max(0, Math.min(32767, Math.round(Number(pos.y) || 0)));
  // treat explicit 0,0 as uninitialized (legacy) -> fallback
  if (x === 0 && y === 0) return fallback;
  return { x, y };
};

export const MAIN_NODE_POS = { x: 400, y: 20 };
// Child grid sits below the main node (gap ~140px) and centered under it.
// For 2 cols: cols at 240 and 560 -> midpoint 400 (MAIN_NODE_POS.x)
const CHILD_GRID_BASE_X = 240;
const CHILD_GRID_BASE_Y = 180;

const gridPos = (idx, baseX = CHILD_GRID_BASE_X, baseY = CHILD_GRID_BASE_Y, colW = 320, rowH = 160, cols = 2) => {
  const col = idx % cols;
  const row = Math.floor(idx / cols);
  return { x: baseX + col * colW, y: baseY + row * rowH };
};

export const getProjectDataasNodes = async (projectUUid) => {
  const res = await getProject(projectUUid);
  data = await res;

  const nodes = [
    {
      id: String(res.id),
      data: { name: res.name, description: res.description, status: res.status, kind: "Project" },
      // fixed top-center: ignore stale DB zero/legacy pos, always use MAIN_NODE_POS
      position: MAIN_NODE_POS,
      type: "projectNode",
      draggable: false,
      selectable: true,
      deletable: false,
    },
    ...(res.features?.map((feature, idx) => ({
      id: String(feature.id),
      data: {
        name: feature.name,
        description: feature.description,
        tags: feature.tags,
        status: feature.status,
      },
      position: normalizePos(feature.position, gridPos(idx)),
      type: "featureNode",
    })) ?? []),
  ];

  return nodes;
};

export const getFeatureDataAsNodes = async (featureUuid) => {
  const res = await getFeature(featureUuid);
  data = await res;

  const nodes = [
    {
      id: String(res.id),
      data: { name: res.name, description: res.description, status: res.status, tags: res.tags, kind: "Feature" },
      // fixed top-center
      position: MAIN_NODE_POS,
      type: "projectNode",
      draggable: false,
      selectable: true,
      deletable: false,
    },
    ...(res.tasks?.map((task, idx) => ({
      id: String(task.id),
      data: {
        name: task.name,
        description: task.description,
        status: task.status,
        tags: task.tags,
      },
      position: normalizePos(task.position, gridPos(idx)),
      type: "featureNode",
    })) ?? []),
  ];

  return nodes;
};
