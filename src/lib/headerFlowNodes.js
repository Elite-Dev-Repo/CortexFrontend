// Hero demo tree – source top-center, targets bottom row
// Edges: source Bottom -> target Top (same handles as MajorNode/FeatureNode default)
export const nodes = [
  {
    id: "project",
    data: {
      name: "Cortex Platform",
      description: "Plan features before you code",
      kind: "Project",
    },
    position: { x: 285, y: 14 },
    type: "headerSource",
  },
  {
    id: "f1",
    data: {
      name: "User Authentication",
      description: "OAuth, session & role guards",
      status: "in_progress",
      tags: ["auth", "security"],
    },
    position: { x: 45, y: 125 },
    type: "headerTarget",
  },
  {
    id: "f2",
    data: {
      name: "Team Collaboration",
      description: "WebSocket rooms & presence",
      status: "pending",
      tags: ["realtime", "websocket"],
    },
    position: { x: 285, y: 125 },
    type: "headerTarget",
  },
  {
    id: "f3",
    data: {
      name: "File Workspace",
      description: "Drag-drop boards & sync",
      status: "completed",
      tags: ["ui", "collab"],
    },
    position: { x: 525, y: 125 },
    type: "headerTarget",
  },
];

export const edges = [
  {
    id: "e-p-f1",
    source: "project",
    target: "f1",
    sourceHandle: "bottom",
    targetHandle: "top",
    animated: true,
    type: "default",
    style: { stroke: "#2e2e2e", strokeWidth: 1.5 },
  },
  {
    id: "e-p-f2",
    source: "project",
    target: "f2",
    sourceHandle: "bottom",
    targetHandle: "top",
    animated: true,
    type: "default",
    style: { stroke: "#2e2e2e", strokeWidth: 1.5 },
  },
  {
    id: "e-p-f3",
    source: "project",
    target: "f3",
    sourceHandle: "bottom",
    targetHandle: "top",
    animated: true,
    type: "default",
    style: { stroke: "#2e2e2e", strokeWidth: 1.5 },
  },
];
