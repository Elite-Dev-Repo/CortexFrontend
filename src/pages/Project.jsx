import { useEffect, useState, useCallback, useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import { getProjectDataasNodes, MAIN_NODE_POS } from "@/lib/reactflowConstants";
import "@xyflow/react/dist/style.css";
import {
  SidebarLeftIcon,
  LayoutDashboard,
  Setting07Icon,
  Logout05Icon,
  ChartAnalysisIcon,
  HelpCircleIcon,
  WorkIcon,
  Folder02Icon,
  Add01Icon,
  Layers01Icon,
  Refresh03Icon,
  SaveIcon,
  Undo03Icon,
} from "@hugeicons/core-free-icons";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { getErrorMessage } from "@/lib/errors";
import { getProject, updateProject, deleteProject } from "@/lib/projectsApi";
import { createFeature, deleteFeature } from "@/lib/featuresApi";
import { getDashboardData } from "@/lib/dashboardApi";
import { AppModal, Field, Input, Textarea } from "@/components/ui/app-modal";

import {
  ReactFlow,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  addEdge,
} from "@xyflow/react";
import MajorNode from "@/components/MajorNode";
import FeatureNode from "@/components/FeatureNode";
import { createEdge, getEdges, deleteEdge } from "@/lib/edgeApi";
import { syncPositions } from "@/lib/syncApi";

const STATUS_COLORS = {
  pending: {
    bg: "bg-yellow-500/10",
    text: "text-yellow-400",
    dot: "bg-yellow-400",
  },
  in_progress: {
    bg: "bg-blue-500/10",
    text: "text-blue-400",
    dot: "bg-blue-400",
  },
  completed: {
    bg: "bg-green-500/10",
    text: "text-green-400",
    dot: "bg-green-400",
  },
};

const Project = () => {
  const { uuid, projectUuid } = useParams();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [project, setProject] = useState(null);
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSidebar, setShowSidebar] = useState(true);
  const [showCreateFeature, setShowCreateFeature] = useState(false);
  const [featureForm, setFeatureForm] = useState({
    name: "",
    description: "",
    tags: "",
  });
  const [creatingFeature, setCreatingFeature] = useState(false);
  const [editingStatus, setEditingStatus] = useState(false);
  const [featureMenu, setFeatureMenu] = useState(null);
  const [dashboardData, setDashboardData] = useState({});
  const [baseNodes, setBaseNodes] = useState([]);
  const [baseEdges, setBaseEdges] = useState([]);
  const [syncing, setSyncing] = useState(false);

  const fetchProject = async () => {
    try {
      const projectData = await getProject(projectUuid);
      setProject(projectData);
      setFeatures(projectData.features || []);
    } catch {
      toast.error("Project not found");
      navigate(`/workspace/${uuid}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchDashboard = async () => {
    try {
      const res = await getDashboardData();
      setDashboardData(res);
    } catch {
      // silent
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      await updateProject(projectUuid, { status: newStatus });
      setProject((prev) => ({ ...prev, status: newStatus }));
      setEditingStatus(false);
      toast.success(`Status set to ${newStatus.replace("_", " ")}`);
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleCreateFeature = async (e) => {
    e.preventDefault();
    setCreatingFeature(true);
    try {
      const tags = featureForm.tags
        ? featureForm.tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : [];
      // compute proper grid position for new feature (next free cell) - below fixed top-center main node
      const featureCount = nodes.filter((n) => n.type === "featureNode").length;
      const col = featureCount % 2;
      const row = Math.floor(featureCount / 2);
      const nextPos = { x: 240 + col * 320, y: 180 + row * 160 };
      const feature = await createFeature({
        name: featureForm.name,
        description: featureForm.description || undefined,
        tags,
        project: projectUuid,
        position: nextPos,
      });
      setFeatures((prev) => [...prev, feature]);
      const pos = feature.position && feature.position.x !== 0 && feature.position.y !== 0 ? feature.position : nextPos;
      setNodes((prev) => [
        ...prev,
        {
          id: String(feature.id),
          data: {
            name: feature.name,
            description: feature.description,
            tags: feature.tags,
            status: feature.status,
          },
          position: pos,
          type: "featureNode",
        },
      ]);
      setShowCreateFeature(false);
      setFeatureForm({ name: "", description: "", tags: "" });
      toast.success("Feature created");
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to create feature"));
    } finally {
      setCreatingFeature(false);
    }
  };

  const handleDeleteFeature = async (id) => {
    if (!confirm("Delete this feature and all its tasks?")) return;
    try {
      await deleteFeature(id);
      setFeatures((prev) => prev.filter((f) => f.id !== id));
      setNodes((prev) => prev.filter((n) => String(n.id) !== String(id)));
      toast.success("Feature deleted");
    } catch {
      toast.error("Failed to delete feature");
    }
  };

  const handleDeleteProject = async () => {
    if (!confirm("Delete this project and all its data?")) return;
    try {
      await deleteProject(projectUuid);
      toast.success("Project deleted");
      navigate(`/workspace/${uuid}`);
    } catch {
      toast.error("Failed to delete project");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/auth", { replace: true });
  };

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const handleLocalSave = () => {
    try {
      localStorage.setItem(`cortex:project:${projectUuid}:nodes`, JSON.stringify(nodes));
      localStorage.setItem(`cortex:project:${projectUuid}:edges`, JSON.stringify(edges));
      toast.success("Saved locally");
    } catch {
      toast.error("Local save failed");
    }
  };

  const handleRevert = () => {
    if (baseNodes.length) setNodes(baseNodes);
    if (baseEdges.length) setEdges(baseEdges);
    toast.success("Reverted to last DB state");
  };

  const handleDbSync = async () => {
    if (!nodes.length) return toast.error("No nodes to sync");
    setSyncing(true);
    try {
      const positions = nodes.map((n) => ({
        id: n.id,
        model: String(n.id) === String(projectUuid) ? "project" : "feature",
        position: { x: Math.round(n.position.x), y: Math.round(n.position.y) },
      }));
      const res = await syncPositions(positions);
      setBaseNodes(nodes);
      const count = res?.updated?.length ?? positions.length;
      if (res?.errors?.length) toast.warning(`Synced ${count} with ${res.errors.length} errors`);
      else toast.success(`Synced ${count} positions to DB`);
    } catch (err) {
      toast.error(getErrorMessage(err, "DB sync failed"));
    } finally {
      setSyncing(false);
    }
  };

  const navActions = [
    { text: "Local save", icon: <HugeiconsIcon icon={SaveIcon} size={18} />, onClick: handleLocalSave },
    { text: "revert", icon: <HugeiconsIcon icon={Undo03Icon} size={18} />, onClick: handleRevert },
    {
      text: syncing ? "Syncing..." : "DB sync",
      icon: <HugeiconsIcon icon={Refresh03Icon} size={18} className={syncing ? "animate-spin" : ""} />,
      onClick: handleDbSync,
      disabled: syncing,
    },
  ];

  const fetchInitialNodes = async (id) => {
    try {
      const res = await getProjectDataasNodes(id);
      setBaseNodes(res);
      setNodes(res);
    } catch (e) {
      console.error("fetchInitialNodes failed", e);
    }
  };

  const fetchInitialEdges = async () => {
    try {
      const res = await getEdges(projectUuid);
      const list = Array.isArray(res) ? res : res ? [res] : [];
      // Normalize to React Flow Edge shape + String IDs (fixes target:"10" vs 10)
      const normalized = list
        .filter((e) => e?.source && e?.target)
        .map((e) => ({
          id: String(e.id),
          source: String(e.source),
          target: String(e.target),
          sourceHandle: e.sourceHandle ?? null,
          targetHandle: e.targetHandle ?? null,
          animated: e.animated ?? true,
          // keep extra style so edges are visible even without CSS
          style: e.style ?? { stroke: "#2e2e2e", strokeWidth: 1.5 },
          type: e.type ?? "default",
        }));
      setBaseEdges(normalized);
      setEdges(normalized);
    } catch (e) {
      console.error("fetchInitialEdges failed", e);
    }
  };

  useEffect(() => {
    fetchProject();
    fetchDashboard();
    fetchInitialNodes(projectUuid);
    fetchInitialEdges();
  }, [projectUuid]);

  // keep nodes in sync if baseNodes is updated elsewhere (e.g. refetch)
  useEffect(() => {
    if (baseNodes.length) setNodes(baseNodes);
  }, [baseNodes]);

  // keep edges in sync if baseEdges is updated (fixes previous missing sync)
  useEffect(() => {
    if (baseEdges.length) setEdges(baseEdges);
  }, [baseEdges]);

  const onConnect = useCallback(
    async (connection) => {
      // enforce bottom -> top mapping for main->child (fallback if user drags from any handle)
      const srcIsMain = String(connection.source) === String(projectUuid);
      const edge = {
        ...connection,
        sourceHandle: connection.sourceHandle ?? (srcIsMain ? "bottom" : "bottom"),
        targetHandle: connection.targetHandle ?? "top",
        animated: true,
        id: crypto.randomUUID(),
        style: { stroke: "#2e2e2e", strokeWidth: 1.5 },
      };
      setEdges((prev) => addEdge(edge, prev));
      // persist to DB with BOTH handles (fixes missing sourceHandle)
      try {
        await createEdge({
          id: edge.id,
          source: String(edge.source),
          target: String(edge.target),
          sourceHandle: edge.sourceHandle ?? null,
          targetHandle: edge.targetHandle ?? null,
          animated: edge.animated ?? true,
          project: projectUuid,
        });
        toast.success("Edge saved");
      } catch (err) {
        toast.error(getErrorMessage(err, "Failed to save edge"));
        // rollback optimistic edge on failure
        setEdges((prev) => prev.filter((e) => e.id !== edge.id));
      }
    },
    [projectUuid],
  );

  // Enforce fixed top-center for main project node - clamp position changes and keep draggable false
  const handleNodesChange = useCallback(
    (changes) => {
      const filtered = changes.map((c) => {
        if (c.type === "position" && String(c.id) === String(projectUuid) && c.position) {
          return { ...c, position: MAIN_NODE_POS };
        }
        if (c.type === "position" && c.position) {
          // prevent accidental drag of main node via other change shapes
          const nodeId = c.id;
          if (String(nodeId) === String(projectUuid)) return { ...c, position: MAIN_NODE_POS };
        }
        return c;
      });
      onNodesChange(filtered);
      // extra safety: if any change tried to move main, force correct pos in next tick
      const movedMain = changes.some((c) => c.type === "position" && String(c.id) === String(projectUuid));
      if (movedMain) {
        setNodes((prev) => prev.map((n) => (String(n.id) === String(projectUuid) ? { ...n, position: MAIN_NODE_POS, draggable: false } : n)));
      }
    },
    [onNodesChange, projectUuid],
  );

  // keep main node pinned even if baseNodes sync or external update tries to offset it
  useEffect(() => {
    setNodes((prev) => prev.map((n) => (String(n.id) === String(projectUuid) ? { ...n, position: MAIN_NODE_POS, draggable: false } : n)));
  }, [projectUuid]);

  const handleEdgesChange = useCallback(
    (changes) => {
      const removed = changes.filter((c) => c.type === "remove");
      removed.forEach((c) => {
        deleteEdge(c.id).catch((e) => console.error("deleteEdge failed", e));
      });
      onEdgesChange(changes);
    },
    [onEdgesChange],
  );

  const nodeTypes = useMemo(
    () => ({
      projectNode: MajorNode,
      featureNode: FeatureNode,
    }),
    [],
  );

  //
  //
  //Nodes END

  const sc = project
    ? STATUS_COLORS[project.status] || STATUS_COLORS.pending
    : STATUS_COLORS.pending;

  if (loading) {
    return (
      <section className="w-screen min-h-screen p-5 bg-foreground">
        <div className="w-full h-full flex items-center justify-center min-h-[calc(100vh-40px)] bg-foreground rounded-lg">
          <div className="w-12 h-12 bg-secondary animate-spin flex items-center justify-center text-white">
            <HugeiconsIcon icon={LayoutDashboard} size={28} />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full min-h-screen min-h-[100dvh] p-2 sm:p-3 lg:p-5 bg-foreground">
      <div className="w-full min-h-[calc(100vh-16px)] min-h-[calc(100dvh-16px)] sm:min-h-[calc(100vh-24px)] lg:min-h-[calc(100vh-40px)] flex gap-2 sm:gap-3 text-secondary relative">
        {showSidebar && <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-30 lg:hidden" onClick={() => setShowSidebar(false)} />}
        <div
          className={`flex flex-col bg-secondary text-background rounded-xl lg:rounded-lg z-40 transition-all duration-300 shrink-0
            fixed lg:static inset-y-2 lg:inset-auto left-2 lg:left-auto
            ${showSidebar ? "w-[78vw] max-w-[280px] lg:w-60 translate-x-0" : "w-[78vw] max-w-[280px] lg:w-16 -translate-x-[calc(100%+16px)] lg:translate-x-0"}
            min-h-[calc(100vh-16px)] lg:min-h-full max-h-[calc(100vh-16px)] lg:max-h-none overflow-hidden
          `}
        >
          <div className="w-full h-20 p-3 flex items-center justify-between border-b border-background/20">
            {showSidebar && (
              <Link to={"/"}>
                <div className="flex items-center justify-start gap-3">
                  <HugeiconsIcon icon={LayoutDashboard} />
                  <p className="text-sm font-bold tracking-wide">Cortex</p>
                </div>
              </Link>
            )}
            <div
              onClick={() => setShowSidebar(!showSidebar)}
              className="rounded-lg hover:bg-secondary/5 cursor-pointer p-2 flex items-center justify-center"
            >
              <HugeiconsIcon icon={SidebarLeftIcon} size={20} />
            </div>
          </div>

          <div className=" flex flex-col w-full max-h-[calc(100vh-11em)] items-start justify-start gap-5 overflow-scroll scrollbar-none">
            {/* Main */}
            <div className="w-full flex flex-col items-start justify-center gap-4">
              {showSidebar ? (
                <h4 className="font-semibold text-[13px] uppercase pl-6 text-background/60">
                  Main
                </h4>
              ) : (
                <div className="pl-4">
                  <HugeiconsIcon icon={WorkIcon} size={20} />
                </div>
              )}
              {showSidebar && (
                <div className="w-full flex flex-col items-start justify-center gap-2">
                  <div
                    onClick={() => navigate("/dashboard")}
                    className="w-full border-l-3 border-transparent hover:border-primary flex items-center justify-start gap-3 px-4 py-2 hover:bg-primary/10 cursor-pointer"
                  >
                    <HugeiconsIcon
                      icon={LayoutDashboard}
                      size={16}
                      strokeWidth={1.6}
                    />
                    <p className="text-sm font-medium">Dashboard</p>
                  </div>
                  <div
                    onClick={() => navigate(`/workspace/${uuid}`)}
                    className="w-full border-l-3 border-transparent hover:border-primary flex items-center justify-start gap-3 px-4 py-2 hover:bg-primary/10 cursor-pointer"
                  >
                    <HugeiconsIcon
                      icon={Folder02Icon}
                      size={16}
                      strokeWidth={1.6}
                    />
                    <p className="text-sm font-medium truncate">
                      {project?.workspace_name || "Workspace"}
                    </p>
                  </div>
                  <div className="w-full border-l-3 border-primary flex items-center justify-start gap-3 px-4 py-2 bg-primary/10">
                    <HugeiconsIcon
                      icon={Layers01Icon}
                      size={16}
                      strokeWidth={1.6}
                    />
                    <p className="text-sm font-medium truncate">
                      {project?.name || "Project"}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Features */}
            <div className="w-full flex flex-col items-start justify-center gap-4">
              {showSidebar ? (
                <div className="flex w-full justify-between items-center pr-4">
                  <h4 className="font-semibold text-[13px] uppercase pl-6 text-background/60">
                    Features
                  </h4>
                  <button
                    onClick={() => setShowCreateFeature(true)}
                    className="p-1 rounded hover:bg-secondary/5"
                  >
                    <HugeiconsIcon icon={Add01Icon} size={14} />
                  </button>
                </div>
              ) : (
                <div className="pl-4">
                  <HugeiconsIcon icon={Layers01Icon} size={20} />
                </div>
              )}
              {showSidebar && (
                <div className="w-full flex flex-col items-start justify-center gap-2">
                  {features.length === 0 ? (
                    <p className="text-xs text-background/40 px-6 py-1">
                      No features yet
                    </p>
                  ) : (
                    features.slice(0, 5).map((f) => (
                      <div
                        key={f.id}
                        onClick={() =>
                          navigate(
                            `/workspace/${uuid}/project/${projectUuid}/feature/${f.id}`,
                          )
                        }
                        className="w-full border-l-3 border-transparent hover:border-primary flex items-center justify-start gap-3 px-4 py-2 hover:bg-primary/10 cursor-pointer"
                      >
                        <HugeiconsIcon
                          icon={Layers01Icon}
                          size={16}
                          strokeWidth={1.6}
                        />
                        <p className="text-sm font-medium truncate">{f.name}</p>
                      </div>
                    ))
                  )}
                  {features.length > 5 && (
                    <p className="text-xs text-background/30 px-6">
                      +{features.length - 5} more
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* General */}
            <div className="w-full flex flex-col items-start justify-center gap-4">
              {showSidebar ? (
                <h4 className="font-semibold text-[13px] uppercase pl-6 text-background/60">
                  General
                </h4>
              ) : (
                <div className="pl-4">
                  <HugeiconsIcon icon={SidebarLeftIcon} size={20} />
                </div>
              )}
              <div className="w-full border-l-3 border-transparent hover:border-primary flex items-center justify-start gap-3 px-4 py-2 hover:bg-primary/10 cursor-pointer">
                <HugeiconsIcon
                  icon={ChartAnalysisIcon}
                  size={18}
                  strokeWidth={2}
                />
                {showSidebar && (
                  <p className="text-sm font-medium">Analytics</p>
                )}
              </div>
              <div className="w-full border-l-3 border-transparent hover:border-primary flex items-center justify-start gap-3 px-4 py-2 hover:bg-primary/10 cursor-pointer">
                <HugeiconsIcon
                  icon={HelpCircleIcon}
                  size={18}
                  strokeWidth={2}
                />
                {showSidebar && <p className="text-sm font-medium">Help</p>}
              </div>
            </div>
          </div>

          <div className="w-full px-5 py-3 flex items-center justify-between gap-3 border-t border-background/20">
            {showSidebar ? (
              <>
                <HugeiconsIcon
                  icon={Setting07Icon}
                  size={22}
                  className="cursor-pointer"
                />
                <p className="truncate text-[14px]">
                  {dashboardData.email || ""}
                </p>
                <div
                  onClick={handleLogout}
                  className="cursor-pointer hover:text-primary"
                >
                  <HugeiconsIcon icon={Logout05Icon} size={18} />
                </div>
              </>
            ) : (
              <>
                <HugeiconsIcon icon={Setting07Icon} size={22} />
              </>
            )}
          </div>
        </div>

        {/* MAIN */}
        <div className="flex-1 min-w-0 min-h-[calc(100vh-16px)] lg:min-h-[calc(100vh-40px)] h-[calc(100vh-16px)] lg:h-[calc(100vh-40px)] flex flex-col rounded-xl lg:rounded-lg bg-background overflow-hidden relative">
          {!showSidebar && (
            <button onClick={() => setShowSidebar(true)} className="lg:hidden absolute top-3 right-3 z-20 h-9 w-9 bg-secondary text-white rounded-lg flex items-center justify-center shadow-lg">
              <HugeiconsIcon icon={SidebarLeftIcon} size={18} />
            </button>
          )}
          <div className="h-8 w-full bg-white/60 shadow-sm">
            <div className="w-full h-full flex items-center gap-2 sm:gap-4 justify-start px-3 sm:px-6">
              {navActions.map((action, i) => {
                return (
                  <button
                    key={i}
                    onClick={action.onClick}
                    disabled={action.disabled}
                    title={action.text}
                    className="relative p-2 hover:bg-foreground group cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {action.icon}
                    <p className="group-hover:block top-8 text-[12px] absolute bg-white/80 hidden px-4 py-2 whitespace-nowrap z-10 shadow">
                      {action.text}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
          <div className="h-full w-full flex-1 flex flex-col gap-3  overflow-hidden">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={handleNodesChange}
              onEdgesChange={handleEdgesChange}
              onConnect={onConnect}
              nodeTypes={nodeTypes}
              fitView
              fitViewOptions={{ padding: 0.2 }}
              nodesDraggable={true}
              nodesConnectable={true}
              elementsSelectable={true}
              style={{ width: "100%", height: "100%" }}
              className="border border-secondary/10 rounded-lg bg-[#fcfcf9]"
              defaultEdgeOptions={{
                animated: true,
                style: { stroke: "#2e2e2e", strokeWidth: 1.5 },
              }}
            >
              <Background />
              <Controls className="!bg-white !border !border-secondary/10 !shadow-lg !rounded-sm [&>button]:!bg-white [&>button]:!border-secondary/10 [&>button]:!text-secondary hover:[&>button]:!bg-secondary hover:[&>button]:!text-white" />
            </ReactFlow>
          </div>
        </div>
      </div>

      <AppModal
        open={showCreateFeature}
        onClose={() => setShowCreateFeature(false)}
        title="Map a Feature"
        description="Features break your project into buildable pieces. Tags help you filter later."
        icon={<HugeiconsIcon icon={Add01Icon} size={16} />}
      >
        <form onSubmit={handleCreateFeature} className="p-6 space-y-4">
          <Field label="Name" required hint={`${featureForm.name.length}/40`}>
            <Input autoFocus value={featureForm.name} onChange={(e) => setFeatureForm((p) => ({ ...p, name: e.target.value }))} placeholder="User Authentication" maxLength={40} required />
          </Field>
          <Field label="Description" hint={`${featureForm.description.length}/160`}>
            <Textarea value={featureForm.description} onChange={(e) => setFeatureForm((p) => ({ ...p, description: e.target.value }))} placeholder="What does this feature do?" rows={3} maxLength={160} />
          </Field>
          <Field label="Tags" hint="comma separated">
            <Input value={featureForm.tags} onChange={(e) => setFeatureForm((p) => ({ ...p, tags: e.target.value }))} placeholder="backend, auth, security" />
            <p className="text-[11px] text-secondary/40">e.g. frontend, api, v2 — we’ll split on commas.</p>
          </Field>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setShowCreateFeature(false)} className="flex-1 py-2.5 rounded-lg text-sm font-medium border border-secondary/10 hover:bg-secondary/5">Cancel</button>
            <button type="submit" disabled={creatingFeature || !featureForm.name.trim()} className="flex-1 py-2.5 rounded-lg text-sm font-semibold bg-secondary text-white hover:bg-secondary/90 disabled:opacity-50 flex items-center justify-center gap-2">
              {creatingFeature ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Create Feature"}
            </button>
          </div>
        </form>
      </AppModal>
    </section>
  );
};

export default Project;
