import { useEffect, useState, useCallback, useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import { getProjectDataasNodes } from "@/lib/reactflowConstants";
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
  Cancel01Icon,
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

import {
  ReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  addEdge,
} from "@xyflow/react";
import MajorNode from "@/components/MajorNode";
import FeatureNode from "@/components/FeatureNode";

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

const navActions = [
  {
    text: "Local save",
    icon: <HugeiconsIcon icon={SaveIcon} size={18} />,
    action: "g",
  },
  {
    text: "revert",
    icon: <HugeiconsIcon icon={Undo03Icon} size={18} />,
    action: "g",
  },
  {
    text: "DB sync",
    icon: <HugeiconsIcon icon={Refresh03Icon} size={18} />,
    action: "g",
  },
];

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

  const fetchInitialNodes = async (id) => {
    const res = await getProjectDataasNodes(id);
    console.log("NODES ", res);
    setBaseNodes(res);
  };

  useEffect(() => {
    fetchProject();
    fetchDashboard();
    fetchInitialNodes(projectUuid);
  }, [projectUuid]);

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
      const feature = await createFeature({
        name: featureForm.name,
        description: featureForm.description || undefined,
        tags,
        project: projectUuid,
      });
      setFeatures((prev) => [...prev, feature]);
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
          position: {
            x: Math.random() * 340 + 280,
            y: Math.random() * 300 + 80,
          },
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

  const [nodes, setNodes, onNodesChange] = useNodesState(baseNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const onConnect = useCallback((connection) => {
    const edge = { ...connection, animated: true, id: crypto.randomUUID() };
    setEdges((prevEdge) => addEdge(edge, prevEdge));
  }, []);

  const nodeTypes = useMemo(
    () => ({
      projectNode: MajorNode,
      featureNode: FeatureNode,
    }),
    [],
  );

  useEffect(() => {
    setNodes(baseNodes);
  }, [baseNodes]);
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
    <section className="w-screen min-h-screen p-5 bg-foreground">
      <div className="w-full min-h-[calc(100vh-40px)] flex items-stretch justify-between gap-3 text-secondary">
        {/* Sidebar – same as Dashboard/Workspace */}
        <div
          className={`${showSidebar ? "w-60" : "w-fit"}  min-h-full bg-secondary text-background rounded-lg flex flex-col gap-3 items-between justify-start `}
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
                {showSidebar && <p className="text-sm font-medium">Analysis</p>}
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
        <div className="flex-1 min-h-[calc(100vh-40px)] h-[calc(100vh-40px)] flex flex-col rounded-lg bg-background overflow-hidden">
          <div className="h-8 w-full bg-white/60 shadow-sm">
            <div className="w-full h-full flex items-center gap-4 justify-start px-6">
              {navActions.map((action, i) => {
                return (
                  <div
                    key={i}
                    className="relative p-2 hover:bg-foreground group cursor-pointer flex items-center justify-center gap-2"
                  >
                    {action.icon}
                    <p className="group-hover:block top-8  text-[12px] absolute bg-white/80 hidden px-4 py-2">
                      {action.text}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="h-full w-full flex-1 flex flex-col gap-3  overflow-hidden">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
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

      {/* Create Feature modal – dashboard card style */}
      {showCreateFeature && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setShowCreateFeature(false)}
          />
          <div className="relative w-full max-w-md bg-foreground border border-primary/20 rounded-sm p-6 sm:p-8 shadow-xl">
            <button
              onClick={() => setShowCreateFeature(false)}
              className="absolute top-4 right-4 p-1.5 hover:bg-primary/5 rounded-sm text-primary/40 hover:text-primary"
            >
              <HugeiconsIcon icon={Cancel01Icon} size={18} />
            </button>
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-sm border border-primary/30 bg-primary/3 text-secondary">
                <HugeiconsIcon icon={Add01Icon} size={18} />
              </div>
              <h2 className="text-lg font-semibold tracking-tight">
                Map a Feature
              </h2>
            </div>
            <form onSubmit={handleCreateFeature} className="space-y-4">
              <div>
                <label className="text-sm text-secondary/60 mb-1.5 block">
                  Name
                </label>
                <input
                  type="text"
                  value={featureForm.name}
                  onChange={(e) =>
                    setFeatureForm((p) => ({ ...p, name: e.target.value }))
                  }
                  placeholder="User Authentication"
                  className="w-full bg-background border border-primary/10 rounded-sm py-2.5 px-4 text-sm text-primary placeholder-primary/30 focus:outline-none focus:border-primary/30 transition-all"
                  required
                />
              </div>
              <div>
                <label className="text-sm text-secondary/60 mb-1.5 block">
                  Description (optional)
                </label>
                <textarea
                  value={featureForm.description}
                  onChange={(e) =>
                    setFeatureForm((p) => ({
                      ...p,
                      description: e.target.value,
                    }))
                  }
                  placeholder="What does this feature do?"
                  rows={2}
                  className="w-full bg-background border border-primary/10 rounded-sm py-2.5 px-4 text-sm text-primary placeholder-primary/30 focus:outline-none focus:border-primary/30 transition-all resize-none"
                />
              </div>
              <div>
                <label className="text-sm text-secondary/60 mb-1.5 block">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={featureForm.tags}
                  onChange={(e) =>
                    setFeatureForm((p) => ({ ...p, tags: e.target.value }))
                  }
                  placeholder="backend, auth, security"
                  className="w-full bg-background border border-primary/10 rounded-sm py-2.5 px-4 text-sm text-primary placeholder-primary/30 focus:outline-none focus:border-primary/30 transition-all"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateFeature(false)}
                  className="flex-1 py-2.5 rounded-sm text-sm border border-primary/10 hover:bg-primary/5 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingFeature}
                  className="flex-1 py-2.5 rounded-sm text-sm font-semibold bg-primary text-secondary hover:bg-primary/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {creatingFeature ? (
                    <span className="w-4 h-4 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
                  ) : (
                    "Create Feature"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default Project;
