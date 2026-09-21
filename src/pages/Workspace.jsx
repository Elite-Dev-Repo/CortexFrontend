import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  SidebarLeftIcon,
  LayoutDashboard,
  Setting07Icon,
  Logout05Icon,
  ChartAnalysisIcon,
  HelpCircleIcon,
  WorkIcon,
  UserGroup03Icon,
  Folder02Icon,
  Add01Icon,
  ArrowLeft01Icon,
  Layers01Icon,
  MoreHorizontalIcon,
  PencilEdit02Icon,
  Delete02Icon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { getErrorMessage } from "@/lib/errors";
import {
  getWorkspace,
  updateWorkspace,
  deleteWorkspace,
} from "@/lib/workspacesApi";
import { createProject, deleteProject } from "@/lib/projectsApi";
import { getDashboardData } from "@/lib/dashboardApi";
import { AppModal, Field, Input, Textarea } from "@/components/ui/app-modal";

const Workspace = () => {
  const { uuid } = useParams();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [workspace, setWorkspace] = useState(null);
  const [dashboardData, setDashboardData] = useState({});
  const [loading, setLoading] = useState(true);
  const [showSidebar, setShowSidebar] = useState(true);
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [projectForm, setProjectForm] = useState({ name: "", description: "" });
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", description: "" });
  const [menuOpen, setMenuOpen] = useState(null);

  const fetchWorkspace = async () => {
    try {
      const data = await getWorkspace(uuid);
      setWorkspace(data);
      setEditForm({ name: data.name, description: data.description || "" });
    } catch {
      toast.error("Workspace not found");
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const fetchDashboard = async () => {
    try {
      const res = await getDashboardData();
      setDashboardData(res);
    } catch {
      // silent - sidebar will still work with workspace data
    }
  };

  useEffect(() => {
    fetchWorkspace();
    fetchDashboard();
  }, [uuid]);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      const project = await createProject({ ...projectForm, workspace: uuid });
      setWorkspace((prev) => ({
        ...prev,
        projects: [...(prev.projects || []), project],
      }));
      setShowCreateProject(false);
      setProjectForm({ name: "", description: "" });
      toast.success("Project created");
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to create project"));
    } finally {
      setCreating(false);
    }
  };

  const handleUpdateWorkspace = async (e) => {
    e.preventDefault();
    try {
      const updated = await updateWorkspace(uuid, editForm);
      setWorkspace((prev) => ({ ...prev, ...updated }));
      setEditing(false);
      toast.success("Workspace updated");
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to update workspace"));
    }
  };

  const handleDeleteWorkspace = async () => {
    if (!confirm("Delete this workspace and all its projects?")) return;
    try {
      await deleteWorkspace(uuid);
      toast.success("Workspace deleted");
      navigate("/dashboard");
    } catch {
      toast.error("Failed to delete workspace");
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (!confirm("Delete this project?")) return;
    try {
      await deleteProject(projectId);
      setWorkspace((prev) => ({
        ...prev,
        projects: (prev.projects || []).filter((p) => p.id !== projectId),
      }));
      toast.success("Project deleted");
    } catch {
      toast.error("Failed to delete project");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/auth", { replace: true });
  };

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

  const projects = workspace?.projects || [];

  return (
    <section className="w-full min-h-screen p-2 sm:p-3 lg:p-5 bg-background">
      <div className="w-full min-h-[calc(100vh-16px)] sm:min-h-[calc(100vh-24px)] lg:min-h-[calc(100vh-40px)] flex gap-2 sm:gap-3 text-secondary relative">
        {showSidebar && (
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-30 lg:hidden"
            onClick={() => setShowSidebar(false)}
          />
        )}
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

          <div className="flex flex-col w-full h-full items-start justify-start gap-5 overflow-scroll scrollbar-none">
            {/* Main */}
            <div className="w-full flex flex-col items-start justify-center gap-4 pt-3">
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
                  <div className="w-full border-l-3 border-primary flex items-center justify-start gap-3 px-4 py-2 bg-primary/10">
                    <HugeiconsIcon
                      icon={Folder02Icon}
                      size={16}
                      strokeWidth={1.6}
                    />
                    <p className="text-sm font-medium truncate">
                      {workspace?.name || "Workspace"}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Projects */}
            <div className="w-full flex flex-col items-start justify-center gap-4">
              {showSidebar ? (
                <div className="flex w-full justify-between items-center pr-4">
                  <h4 className="font-semibold text-[13px] uppercase pl-6 text-background/60">
                    Projects
                  </h4>
                  <button
                    onClick={() => setShowCreateProject(true)}
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
                  {projects.length === 0 ? (
                    <p className="text-xs text-secondary/40 px-6 py-1">
                      No projects yet
                    </p>
                  ) : (
                    projects.slice(0, 5).map((p) => (
                      <div
                        key={p.id}
                        onClick={() =>
                          navigate(`/workspace/${uuid}/project/${p.id}`)
                        }
                        className="w-full border-l-3 border-transparent hover:border-primary flex items-center justify-start gap-3 px-4 py-2 hover:bg-primary/10 cursor-pointer"
                      >
                        <HugeiconsIcon
                          icon={Layers01Icon}
                          size={16}
                          strokeWidth={1.6}
                        />
                        <p className="text-sm font-medium truncate">{p.name}</p>
                      </div>
                    ))
                  )}
                  {projects.length > 5 && (
                    <p className="text-xs text-secondary/30 px-6">
                      +{projects.length - 5} more
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Workspaces (from dashboard) */}
            {dashboardData.workspace && showSidebar && (
              <div className="w-full flex flex-col items-start justify-center gap-4">
                <h4 className="font-semibold text-[13px] uppercase pl-6 text-background/60">
                  Workspaces
                </h4>
                <div className="w-full flex flex-col items-start justify-center gap-2">
                  {dashboardData.workspace.slice(0, 3).map((w) => (
                    <div
                      key={w.id}
                      onClick={() => navigate(`/workspace/${w.id}/`)}
                      className={`w-full border-l-3 flex items-center justify-start gap-3 px-4 py-2 hover:bg-primary/10 cursor-pointer ${String(w.id) === String(uuid) ? "border-primary bg-primary/10" : "border-transparent hover:border-primary"}`}
                    >
                      <HugeiconsIcon
                        icon={Folder02Icon}
                        size={16}
                        strokeWidth={1.6}
                      />
                      <p className="text-sm font-medium truncate">{w.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

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
        <div className="flex-1 min-w-0 h-full flex flex-col gap-3 rounded-xl lg:rounded-lg bg-foreground overflow-hidden relative">
          {!showSidebar && (
            <button
              onClick={() => setShowSidebar(true)}
              className="lg:hidden absolute top-3 right-3 z-20 h-9 w-9 bg-secondary text-white rounded-lg flex items-center justify-center shadow-lg"
            >
              <HugeiconsIcon icon={SidebarLeftIcon} size={18} />
            </button>
          )}
          {/* Top block – Workspace header + Projects */}
          <div className="w-full flex-1 flex flex-col gap-3 rounded-lg p-4 sm:p-5">
            {/* Workspace title row */}
            <div className="w-full flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-4">
              <div className="flex items-start gap-3 min-w-0">
                <button
                  onClick={() => navigate("/dashboard")}
                  className="hidden sm:flex h-9 w-9 shrink-0 items-center justify-center rounded-sm border border-primary/20 bg-primary/3 hover:border-primary/40 transition-colors"
                >
                  <HugeiconsIcon icon={ArrowLeft01Icon} size={18} />
                </button>
                <div className="min-w-0">
                  <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-semibold tracking-tight truncate">
                      {workspace?.name}
                    </h2>
                    <div className="hidden sm:flex w-fit px-3 py-1 rounded-full bg-primary text-secondary">
                      <p className="text-[10px] uppercase tracking-wider font-semibold">
                        {workspace?.workspace_type || "Workspace"} ·{" "}
                        {projects.length} projects
                      </p>
                    </div>
                  </div>
                  {workspace?.description ? (
                    <p className="text-sm leading-6 text-muted-foreground line-clamp-2 max-w-2xl mt-1">
                      {workspace.description}
                    </p>
                  ) : (
                    <p className="text-sm text-muted-foreground/60 mt-1">
                      No description
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <button
                  onClick={() => setEditing(true)}
                  className="h-9 w-9 flex items-center justify-center rounded-lg border border-secondary/10 bg-white hover:bg-secondary hover:text-white transition-colors text-secondary"
                  title="Edit workspace"
                >
                  <HugeiconsIcon icon={PencilEdit02Icon} size={16} />
                </button>
                <button
                  onClick={handleDeleteWorkspace}
                  className="hidden sm:flex h-9 w-9 items-center justify-center rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 text-red-500 transition-colors"
                  title="Delete workspace"
                >
                  <HugeiconsIcon icon={Delete02Icon} size={16} />
                </button>
                <button
                  onClick={() => setShowCreateProject(true)}
                  className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-secondary text-white rounded-lg text-sm font-semibold hover:bg-secondary/90 transition-all"
                >
                  <HugeiconsIcon icon={Add01Icon} size={16} />
                  <span>New Project</span>
                </button>
              </div>
            </div>

            {/* Projects grid – dashboard card style */}
            {projects.length === 0 ? (
              <div className="w-full flex-1 flex flex-col items-center justify-center py-12 sm:py-16 px-4 border border-dashed border-secondary/10 rounded-xl bg-white/60 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-sm border border-primary/30 bg-primary/3 text-secondary mb-4">
                  <HugeiconsIcon icon={Layers01Icon} size={24} />
                </div>
                <h3 className="text-lg font-semibold tracking-tight">
                  No projects yet
                </h3>
                <p className="text-sm text-muted-foreground mt-1 max-w-xs text-center">
                  Projects help you organize features within this workspace.
                </p>
                <button
                  onClick={() => setShowCreateProject(true)}
                  className="mt-6 flex items-center gap-2 px-5 py-2.5 bg-primary text-secondary rounded-sm text-sm font-semibold hover:bg-primary/90 transition-all"
                >
                  <HugeiconsIcon icon={Add01Icon} size={16} />
                  Create Project
                </button>
              </div>
            ) : (
              <div className="w-full h-full">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-widest text-secondary/60">
                    Projects ({projects.length})
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
                  {projects.map((project) => (
                    <div
                      key={project.id}
                      onClick={() =>
                        navigate(`/workspace/${uuid}/project/${project.id}`)
                      }
                      className="group relative flex flex-col items-start h-fit max-h-50 min-w-0 rounded-sm border border-primary/20 bg-white p-5 transition-all duration-300 hover:border-primary/50 hover:bg-primary/6 cursor-pointer"
                    >
                      {/* Header */}
                      <div className="w-full flex items-start justify-between gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm border border-primary/30 bg-secondary text-primary">
                          <HugeiconsIcon icon={Layers01Icon} size={21} />
                        </div>
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-fit px-3 py-1 rounded-full ${
                              project.status === "completed"
                                ? "bg-green-600 text-background"
                                : project.status === "in_progress"
                                  ? "bg-blue-600 text-background"
                                  : "bg-primary text-secondary"
                            }`}
                          >
                            <p className="text-[10px] uppercase tracking-wider font-semibold">
                              {(project.status || "pending").replace("_", " ")}
                            </p>
                          </div>
                          <div className="relative">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setMenuOpen(
                                  menuOpen === project.id ? null : project.id,
                                );
                              }}
                              className="h-8 w-8 flex items-center justify-center rounded-full border border-primary/20 hover:border-primary hover:bg-primary hover:text-secondary transition-all opacity-0 group-hover:opacity-100"
                            >
                              <HugeiconsIcon
                                icon={MoreHorizontalIcon}
                                size={16}
                              />
                            </button>
                            {menuOpen === project.id && (
                              <div className="absolute right-0 top-9 w-36 bg-foreground border border-primary/10 rounded-sm shadow-xl py-1 z-20">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteProject(project.id);
                                    setMenuOpen(null);
                                  }}
                                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-primary/5"
                                >
                                  <HugeiconsIcon
                                    icon={Delete02Icon}
                                    size={14}
                                  />
                                  Delete
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="w-full mt-4">
                        <p className="text-lg font-semibold tracking-tight truncate">
                          {project.name}
                        </p>
                        <p className="text-sm leading-6 text-muted-foreground line-clamp-1 mt-1">
                          {project.description || "No description"}
                        </p>
                      </div>

                      {/* Footer */}
                      <div className="w-full mt-auto pt-4 border-t border-primary/10 flex items-end justify-between">
                        <div>
                          <p className="text-[10px] flex items-center gap-2 uppercase tracking-widest font-medium text-muted-foreground">
                            Created
                            <span className="text-xs font-semibold text-secondary">
                              {new Date(
                                project.created_at,
                              ).toLocaleDateString()}
                            </span>
                          </p>
                        </div>
                        <div className="h-8 w-8 flex items-center justify-center rounded-full border border-primary/20 transition-all duration-300 group-hover:border-primary group-hover:bg-primary group-hover:text-secondary">
                          <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Bottom block – Analytics / Workspace meta like Dashboard's second block */}
          <div className="flex-1 rounded-lg">
            <div className="w-full flex-1 flex flex-col gap-3 rounded-lg p-4 sm:p-5">
              <h2 className="text-xl sm:text-2xl font-semibold">Overview</h2>
              <div className="w-full h-full p-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="group relative flex-1 flex flex-col items-start h-full min-w-0 rounded-sm border border-primary/20 bg-white p-5 transition-all duration-300 hover:border-primary/50 hover:bg-primary/6">
                  <div className="w-full flex items-start justify-between gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm border border-primary/30 bg-secondary text-primary">
                      <HugeiconsIcon icon={Folder02Icon} size={21} />
                    </div>
                    <div className="w-fit px-3 py-1 rounded-full bg-primary text-secondary">
                      <p className="text-[10px] uppercase tracking-wider font-semibold">
                        {workspace?.workspace_type || "PERSONAL"}
                      </p>
                    </div>
                  </div>
                  <div className="w-full mt-3">
                    <p className="text-lg font-semibold tracking-tight truncate">
                      {workspace?.name}
                    </p>
                    <p className="text-sm leading-6 text-muted-foreground line-clamp-3">
                      {workspace?.description ||
                        "No description provided for this workspace."}
                    </p>
                  </div>
                  <div className="w-full mt-auto pt-4 border-t border-primary/10 flex items-end justify-between">
                    <div>
                      <p className="text-[10px] flex items-center gap-2 uppercase tracking-widest font-medium text-muted-foreground">
                        Projects{" "}
                        <span className="text-lg font-semibold text-secondary">
                          {projects.length}
                        </span>
                      </p>
                    </div>
                    <button
                      onClick={handleDeleteWorkspace}
                      className="h-8 px-3 flex items-center justify-center rounded-full border border-red-200 text-red-500 text-xs font-medium hover:bg-red-50 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <div className="group relative flex-1 flex flex-col items-start h-full min-w-0 rounded-sm border border-primary/20 bg-white p-5 transition-all duration-300 hover:border-primary/50 hover:bg-primary/6">
                  <div className="w-full flex items-start justify-between gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm border border-primary/30 bg-secondary text-primary">
                      <HugeiconsIcon icon={ChartAnalysisIcon} size={21} />
                    </div>
                    <div className="w-fit px-3 py-1 rounded-full bg-primary text-secondary">
                      <p className="text-[10px] uppercase tracking-wider font-semibold">
                        Analytics
                      </p>
                    </div>
                  </div>
                  <div className="w-full mt-3">
                    <p className="text-lg font-semibold tracking-tight">
                      Activity
                    </p>
                    <p className="text-sm leading-6 text-muted-foreground line-clamp-3">
                      Track project progress, recent tasks and workspace health
                      in one place.
                    </p>
                  </div>
                  <div className="w-full mt-auto pt-4 border-t border-primary/10 flex items-end justify-between">
                    <div>
                      <p className="text-[10px] flex items-center gap-2 uppercase tracking-widest font-medium text-muted-foreground">
                        Total{" "}
                        <span className="text-lg font-semibold text-secondary">
                          {projects.length} projects
                        </span>
                      </p>
                    </div>
                    <div className="h-8 w-8 flex items-center justify-center rounded-full border border-primary/20 transition-all duration-300 group-hover:border-primary group-hover:bg-primary group-hover:text-secondary">
                      →
                    </div>
                  </div>
                </div>

                <div className="hidden lg:flex group relative flex-1 flex flex-col items-start h-full min-w-0 rounded-sm border border-primary/20 bg-white p-5 transition-all duration-300 hover:border-primary/50 hover:bg-primary/6">
                  <div className="w-full flex items-start justify-between gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm border border-primary/30 bg-secondary text-primary">
                      <HugeiconsIcon icon={Layers01Icon} size={21} />
                    </div>
                    <div className="w-fit px-3 py-1 rounded-full bg-primary text-secondary">
                      <p className="text-[10px] uppercase tracking-wider font-semibold">
                        Quick Action
                      </p>
                    </div>
                  </div>
                  <div className="w-full mt-3">
                    <p className="text-lg font-semibold tracking-tight">
                      Create Project
                    </p>
                    <p className="text-sm leading-6 text-muted-foreground line-clamp-3">
                      Start a new project to organize features and tasks.
                    </p>
                  </div>
                  <div className="w-full mt-auto pt-4 border-t border-primary/10 flex items-end justify-between">
                    <p className="text-[10px] uppercase tracking-widest font-medium text-muted-foreground">
                      Get started
                    </p>
                    <button
                      onClick={() => setShowCreateProject(true)}
                      className="h-8 w-8 flex items-center justify-center rounded-full border border-primary/20 transition-all duration-300 group-hover:border-primary group-hover:bg-primary group-hover:text-secondary"
                    >
                      <HugeiconsIcon icon={Add01Icon} size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AppModal
        open={editing}
        onClose={() => setEditing(false)}
        title="Edit Workspace"
        description="Update workspace details. Changes are saved to your account."
        icon={<HugeiconsIcon icon={PencilEdit02Icon} size={16} />}
      >
        <form onSubmit={handleUpdateWorkspace} className="p-6 space-y-4">
          <Field label="Name" required hint={`${editForm.name.length}/40`}>
            <Input
              autoFocus
              value={editForm.name}
              onChange={(e) =>
                setEditForm((p) => ({ ...p, name: e.target.value }))
              }
              placeholder="Product Workspace"
              maxLength={40}
              required
            />
          </Field>
          <Field
            label="Description"
            hint={`${editForm.description.length}/160`}
          >
            <Textarea
              value={editForm.description}
              onChange={(e) =>
                setEditForm((p) => ({ ...p, description: e.target.value }))
              }
              placeholder="What's this workspace for?"
              rows={3}
              maxLength={160}
            />
          </Field>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="flex-1 py-2.5 rounded-lg text-sm font-medium border border-secondary/10 hover:bg-secondary/5"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-lg text-sm font-semibold bg-secondary text-white hover:bg-secondary/90"
            >
              Save Changes
            </button>
          </div>
        </form>
      </AppModal>

      <AppModal
        open={showCreateProject}
        onClose={() => setShowCreateProject(false)}
        title="Create Project"
        description="Projects organize features. Add one to this workspace."
        icon={<HugeiconsIcon icon={Add01Icon} size={16} />}
      >
        <form onSubmit={handleCreateProject} className="p-6 space-y-4">
          <Field label="Name" required hint={`${projectForm.name.length}/40`}>
            <Input
              autoFocus
              value={projectForm.name}
              onChange={(e) =>
                setProjectForm((p) => ({ ...p, name: e.target.value }))
              }
              placeholder="My Project"
              maxLength={40}
              required
            />
          </Field>
          <Field
            label="Description"
            hint={`${projectForm.description.length}/160`}
          >
            <Textarea
              value={projectForm.description}
              onChange={(e) =>
                setProjectForm((p) => ({ ...p, description: e.target.value }))
              }
              placeholder="What's this project about?"
              rows={3}
              maxLength={160}
            />
          </Field>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowCreateProject(false)}
              className="flex-1 py-2.5 rounded-lg text-sm font-medium border border-secondary/10 hover:bg-secondary/5"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={creating || !projectForm.name.trim()}
              className="flex-1 py-2.5 rounded-lg text-sm font-semibold bg-secondary text-white hover:bg-secondary/90 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {creating ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                "Create Project"
              )}
            </button>
          </div>
        </form>
      </AppModal>
    </section>
  );
};

export default Workspace;
