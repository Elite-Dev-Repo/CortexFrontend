import { useEffect, useState, useCallback, useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import { getFeatureDataAsNodes, MAIN_NODE_POS } from "@/lib/reactflowConstants";
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
import { getFeature, deleteFeature } from "@/lib/featuresApi";
import { createTask, deleteTask } from "@/lib/tasksApi";
import { getProject } from "@/lib/projectsApi";
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

const Feature = () => {
  const { uuid, projectUuid, featureUuid } = useParams();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [feature, setFeature] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSidebar, setShowSidebar] = useState(true);
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [taskForm, setTaskForm] = useState({
    name: "",
    description: "",
  });
  const [creatingTask, setCreatingTask] = useState(false);
  const [dashboardData, setDashboardData] = useState({});
  const [baseNodes, setBaseNodes] = useState([]);
  const [baseEdges, setBaseEdges] = useState([]);
  const [syncing, setSyncing] = useState(false);

  const fetchFeature = async () => {
    try {
      const featureData = await getFeature(featureUuid);
      setFeature(featureData);
      setTasks(featureData.tasks || []);
    } catch {
      toast.error("Feature not found");
      navigate(`/workspace/${uuid}/project/${projectUuid}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchProject = async () => {
    try {
      const data = await getProject(projectUuid);
      setProject(data);
    } catch {
      // silent
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

  const handleCreateTask = async (e) => {
    e.preventDefault();
    setCreatingTask(true);
    try {
      const taskCount = nodes.filter((n) => n.type === "featureNode").length;
      const col = taskCount % 2;
      const row = Math.floor(taskCount / 2);
      const nextPos = { x: 240 + col * 320, y: 180 + row * 160 };
      const task = await createTask({
        name: taskForm.name,
        description: taskForm.description || undefined,
        feature: featureUuid,
        position: nextPos,
      });
      setTasks((prev) => [...prev, task]);
      const pos = task.position && !(task.position.x === 0 && task.position.y === 0) ? task.position : nextPos;
      setNodes((prev) => [
        ...prev,
        {
          id: String(task.id),
          data: {
            name: task.name,
            description: task.description,
            status: task.status,
            tags: task.tags,
          },
          position: pos,
          type: "featureNode",
        },
      ]);
      setShowCreateTask(false);
      setTaskForm({ name: "", description: "" });
      toast.success("Task created");
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to create task"));
    } finally {
      setCreatingTask(false);
    }
  };

  const handleDeleteTask = async (id) => {
    if (!confirm("Delete this task?")) return;
    try {
      await deleteTask(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
      setNodes((prev) => prev.filter((n) => String(n.id) !== String(id)));
      toast.success("Task deleted");
    } catch {
      toast.error("Failed to delete task");
    }
  };

  const handleDeleteFeature = async () => {
    if (!confirm("Delete this feature and all its tasks?")) return;
    try {
      await deleteFeature(featureUuid);
      toast.success("Feature deleted");
      navigate(`/workspace/${uuid}/project/${projectUuid}`);
    } catch {
      toast.error("Failed to delete feature");
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
      localStorage.setItem(`cortex:feature:${featureUuid}:nodes`, JSON.stringify(nodes));
      localStorage.setItem(`cortex:feature:${featureUuid}:edges`, JSON.stringify(edges));
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
        model: String(n.id) === String(featureUuid) ? "feature" : "task",
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
      const res = await getFeatureDataAsNodes(id);
      setBaseNodes(res);
      setNodes(res);
    } catch (e) {
      console.error("fetchInitialNodes failed", e);
    }
  };

  const fetchInitialEdges = async () => {
    try {
      // try feature-scoped edges first, fall back to project edges filtered to current nodes
      let res = [];
      try {
        res = await getEdges(featureUuid);
      } catch {
        res = await getEdges(projectUuid);
      }
      const list = Array.isArray(res) ? res : res ? [res] : [];
      const normalized = list
        .filter((e) => e?.source && e?.target)
        .map((e) => ({
          id: String(e.id),
          source: String(e.source),
          target: String(e.target),
          sourceHandle: e.sourceHandle ?? null,
          targetHandle: e.targetHandle ?? null,
          animated: e.animated ?? true,
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
    fetchFeature();
    fetchProject();
    fetchDashboard();
    fetchInitialNodes(featureUuid);
    fetchInitialEdges();
  }, [featureUuid]);

  useEffect(() => {
    if (baseNodes.length) setNodes(baseNodes);
  }, [baseNodes]);

  useEffect(() => {
    if (baseEdges.length) setEdges(baseEdges);
  }, [baseEdges]);

  const onConnect = useCallback(
    async (connection) => {
      const srcIsMain = String(connection.source) === String(featureUuid);
      const edge = {
        ...connection,
        sourceHandle: connection.sourceHandle ?? (srcIsMain ? "bottom" : "bottom"),
        targetHandle: connection.targetHandle ?? "top",
        animated: true,
        id: crypto.randomUUID(),
        style: { stroke: "#2e2e2e", strokeWidth: 1.5 },
      };
      setEdges((prev) => addEdge(edge, prev));
      try {
        await createEdge({
          id: edge.id,
          source: String(edge.source),
          target: String(edge.target),
          sourceHandle: edge.sourceHandle ?? null,
          targetHandle: edge.targetHandle ?? null,
          animated: edge.animated ?? true,
          project: projectUuid,
          feature: featureUuid,
        });
        toast.success("Edge saved");
      } catch (err) {
        toast.error(getErrorMessage(err, "Failed to save edge"));
        setEdges((prev) => prev.filter((e) => e.id !== edge.id));
      }
    },
    [projectUuid, featureUuid],
  );

  const handleNodesChange = useCallback(
    (changes) => {
      const filtered = changes.map((c) => {
        if (c.type === "position" && String(c.id) === String(featureUuid) && c.position) {
          return { ...c, position: MAIN_NODE_POS };
        }
        if (c.type === "position" && c.position && String(c.id) === String(featureUuid)) {
          return { ...c, position: MAIN_NODE_POS };
        }
        return c;
      });
      onNodesChange(filtered);
      const movedMain = changes.some((c) => c.type === "position" && String(c.id) === String(featureUuid));
      if (movedMain) {
        setNodes((prev) => prev.map((n) => (String(n.id) === String(featureUuid) ? { ...n, position: MAIN_NODE_POS, draggable: false } : n)));
      }
    },
    [onNodesChange, featureUuid],
  );

  useEffect(() => {
    setNodes((prev) => prev.map((n) => (String(n.id) === String(featureUuid) ? { ...n, position: MAIN_NODE_POS, draggable: false } : n)));
  }, [featureUuid]);

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
                  <div
                    onClick={() =>
                      navigate(`/workspace/${uuid}/project/${projectUuid}`)
                    }
                    className="w-full border-l-3 border-transparent hover:border-primary flex items-center justify-start gap-3 px-4 py-2 hover:bg-primary/10 cursor-pointer"
                  >
                    <HugeiconsIcon
                      icon={Layers01Icon}
                      size={16}
                      strokeWidth={1.6}
                    />
                    <p className="text-sm font-medium truncate">
                      {project?.name || "Project"}
                    </p>
                  </div>
                  <div className="w-full border-l-3 border-primary flex items-center justify-start gap-3 px-4 py-2 bg-primary/10">
                    <HugeiconsIcon
                      icon={Layers01Icon}
                      size={16}
                      strokeWidth={1.6}
                    />
                    <p className="text-sm font-medium truncate">
                      {feature?.name || "Feature"}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Tasks */}
            <div className="w-full flex flex-col items-start justify-center gap-4">
              {showSidebar ? (
                <div className="flex w-full justify-between items-center pr-4">
                  <h4 className="font-semibold text-[13px] uppercase pl-6 text-background/60">
                    Tasks
                  </h4>
                  <button
                    onClick={() => setShowCreateTask(true)}
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
                  {tasks.length === 0 ? (
                    <p className="text-xs text-background/40 px-6 py-1">
                      No tasks yet
                    </p>
                  ) : (
                    tasks.slice(0, 5).map((t) => (
                      <div
                        key={t.id}
                        className="w-full border-l-3 border-transparent hover:border-primary flex items-center justify-start gap-3 px-4 py-2 hover:bg-primary/10 cursor-pointer"
                      >
                        <HugeiconsIcon
                          icon={Layers01Icon}
                          size={16}
                          strokeWidth={1.6}
                        />
                        <p className="text-sm font-medium truncate">{t.name}</p>
                      </div>
                    ))
                  )}
                  {tasks.length > 5 && (
                    <p className="text-xs text-background/30 px-6">
                      +{tasks.length - 5} more
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

        {/* MAIN – Flow like Project page */}
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
        open={showCreateTask}
        onClose={() => setShowCreateTask(false)}
        title="Add a Task"
        description="Break your feature into actionable steps. Keep it small and clear."
        icon={<HugeiconsIcon icon={Add01Icon} size={16} />}
      >
        <form onSubmit={handleCreateTask} className="p-6 space-y-4">
          <Field label="Name" required hint={`${taskForm.name.length}/60`}>
            <Input autoFocus value={taskForm.name} onChange={(e) => setTaskForm((p) => ({ ...p, name: e.target.value }))} placeholder="Design DB schema" maxLength={60} required />
          </Field>
          <Field label="Description" hint={`${taskForm.description.length}/200`}>
            <Textarea value={taskForm.description} onChange={(e) => setTaskForm((p) => ({ ...p, description: e.target.value }))} placeholder="What needs to be done?" rows={3} maxLength={200} />
          </Field>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setShowCreateTask(false)} className="flex-1 py-2.5 rounded-lg text-sm font-medium border border-secondary/10 hover:bg-secondary/5">Cancel</button>
            <button type="submit" disabled={creatingTask || !taskForm.name.trim()} className="flex-1 py-2.5 rounded-lg text-sm font-semibold bg-secondary text-white hover:bg-secondary/90 disabled:opacity-50 flex items-center justify-center gap-2">
              {creatingTask ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Create Task"}
            </button>
          </div>
        </form>
      </AppModal>
    </section>
  );
};

export default Feature;
