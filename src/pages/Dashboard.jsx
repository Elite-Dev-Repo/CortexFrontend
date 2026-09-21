import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  SidebarLeftIcon,
  LayoutDashboard,
  Loading03Icon,
  Setting07Icon,
  Logout05Icon,
  ChartAnalysisIcon,
  HelpCircleIcon,
  WorkIcon,
  UserGroup03Icon,
  Folder02Icon,
  Add01Icon,
} from "@hugeicons/core-free-icons";
import { toast } from "sonner";
import { getDashboardData } from "@/lib/dashboardApi";
import { createWorkspace } from "@/lib/workspacesApi";
import { getErrorMessage } from "@/lib/errors";
import { useAuth } from "@/hooks/useAuth";
import {
  AppModal,
  Field,
  Input,
  Textarea,
  Select,
} from "@/components/ui/app-modal";

const Dashboard = () => {
  const [data, setData] = useState({ workspace: [] });
  const [showSidebar, setShowSidebar] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateWorkspace, setShowCreateWorkspace] = useState(false);
  const [wsForm, setWsForm] = useState({
    name: "",
    description: "",
    workspace_type: "PERSONAL",
  });
  const [creating, setCreating] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const res = await getDashboardData();
        setData(res);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const toWorkspace = (id) => navigate(`/workspace/${id}/`);
  const handleLogout = () => {
    logout();
    navigate("/auth", { replace: true });
  };

  const handleCreateWorkspace = async (e) => {
    e.preventDefault();
    if (!wsForm.name.trim()) return toast.error("Name is required");
    setCreating(true);
    try {
      const ws = await createWorkspace(wsForm);
      setData((prev) => ({
        ...prev,
        workspace: [...(prev.workspace || []), ws],
      }));
      setShowCreateWorkspace(false);
      setWsForm({ name: "", description: "", workspace_type: "PERSONAL" });
      toast.success("Workspace created");
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to create workspace"));
    } finally {
      setCreating(false);
    }
  };

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
            <div className="w-full flex flex-col items-start justify-center gap-4 pt-3">
              {showSidebar ? (
                <div className="flex w-full justify-between items-center">
                  <h4 className="font-semibold text-[13px] uppercase pl-6 text-background/60">
                    Workspaces
                  </h4>
                  <button
                    onClick={() => setShowCreateWorkspace(true)}
                    className="mr-3 p-1 rounded hover:bg-white/10"
                  >
                    <HugeiconsIcon icon={Add01Icon} size={14} />
                  </button>
                </div>
              ) : (
                <div className="pl-4">
                  <HugeiconsIcon icon={WorkIcon} size={20} />
                </div>
              )}
              {showSidebar && (
                <div className="w-full flex flex-col items-start justify-center gap-2">
                  {isLoading ? (
                    <div className="w-full flex items-center justify-center">
                      <HugeiconsIcon
                        icon={Loading03Icon}
                        className="animate-spin"
                      />
                    </div>
                  ) : data.workspace?.filter(
                      (w) => w.workspace_type === "PERSONAL",
                    ).length ? (
                    data.workspace
                      .filter((w) => w.workspace_type === "PERSONAL")
                      .map((w, i) => (
                        <div
                          key={w.id ?? i}
                          onClick={() => toWorkspace(w.id)}
                          className="w-full border-l-3 border-transparent hover:border-primary flex items-center justify-start gap-3 px-4 py-2 hover:bg-primary/10 cursor-pointer"
                        >
                          <HugeiconsIcon
                            icon={Folder02Icon}
                            size={16}
                            strokeWidth={1.6}
                          />
                          <p className="text-sm font-medium truncate">
                            {w.name}
                          </p>
                        </div>
                      ))
                  ) : (
                    <p className="text-xs text-background/40 px-6 py-1">
                      No personal workspaces
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="w-full flex flex-col items-start justify-center gap-4">
              {showSidebar ? (
                <h4 className="font-semibold text-[13px] uppercase pl-6 text-background/60">
                  Teams
                </h4>
              ) : (
                <div className="pl-4">
                  <HugeiconsIcon icon={UserGroup03Icon} size={20} />
                </div>
              )}
              {isLoading ? (
                <div className="w-full flex items-center justify-center">
                  <HugeiconsIcon
                    icon={Loading03Icon}
                    className="animate-spin"
                  />
                </div>
              ) : (
                showSidebar && (
                  <div className="w-full flex flex-col items-start justify-center gap-2">
                    {data.workspace?.filter((w) => w.workspace_type === "TEAM")
                      .length ? (
                      data.workspace
                        .filter((w) => w.workspace_type === "TEAM")
                        .map((w, i) => (
                          <div
                            key={w.id ?? i}
                            onClick={() => toWorkspace(w.id)}
                            className="w-full border-l-3 border-transparent hover:border-primary flex items-center justify-start gap-3 px-4 py-2 hover:bg-primary/10 cursor-pointer"
                          >
                            <HugeiconsIcon
                              icon={Folder02Icon}
                              size={16}
                              strokeWidth={1.6}
                            />
                            <p className="text-sm font-medium truncate">
                              {w.name}
                            </p>
                          </div>
                        ))
                    ) : (
                      <p className="text-xs text-background/40 px-6 py-1">
                        No teams
                      </p>
                    )}
                  </div>
                )
              )}
            </div>

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
              <div className="w-full border-l-3 border-transparent hover:border-primary flex items-center justify-start gap-3 px-4 py-2 hover:bg-primary/10">
                <HugeiconsIcon
                  icon={ChartAnalysisIcon}
                  size={18}
                  strokeWidth={2}
                />
                {showSidebar && (
                  <p className="text-sm font-medium">Analytics</p>
                )}
              </div>
              <div className="w-full border-l-3 border-transparent hover:border-primary flex items-center justify-start gap-3 px-4 py-2 hover:bg-primary/10">
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
                <HugeiconsIcon icon={Setting07Icon} size={22} />
                <p className="truncate text-[14px]">{data?.email}</p>
                <button onClick={handleLogout} className="hover:text-primary">
                  <HugeiconsIcon icon={Logout05Icon} size={18} />
                </button>
              </>
            ) : (
              <HugeiconsIcon icon={Setting07Icon} size={22} />
            )}
          </div>
        </div>

        <div className="flex-1 min-w-0 min-h-full flex flex-col gap-3 rounded-xl lg:rounded-lg bg-foreground overflow-hidden">
          {/* Mobile sidebar toggle */}
          {!showSidebar && (
            <button
              onClick={() => setShowSidebar(true)}
              className="lg:hidden absolute top-3 left-3 z-20 h-9 w-9 bg-secondary text-white rounded-lg flex items-center justify-center shadow-lg"
            >
              <HugeiconsIcon icon={SidebarLeftIcon} size={18} />
            </button>
          )}
          {isLoading ? (
            <div className="min-h-full w-full flex-1 flex flex-col gap-3 rounded-lg p-4 sm:p-5">
              <h2 className="text-xl sm:text-2xl font-semibold">
                Your Workspaces (0)
              </h2>
              <div className="w-full h-full p-5 flex items-center justify-center gap-4">
                <div className="w-10 h-10 bg-secondary animate-spin flex text-background items-center justify-center">
                  <HugeiconsIcon icon={LayoutDashboard} size={25} />
                </div>
              </div>
            </div>
          ) : (
            <div className="min-h-full w-full flex-1 flex flex-col gap-3 rounded-lg p-4 sm:p-5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                <h2 className="text-xl sm:text-2xl font-semibold truncate">
                  Your Workspaces{" "}
                  {`(${data.workspace ? data.workspace.length : "0"})`}
                </h2>
                <button
                  onClick={() => setShowCreateWorkspace(true)}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 sm:py-2 bg-secondary text-background rounded-lg text-sm font-semibold hover:bg-secondary/90 shrink-0"
                >
                  <HugeiconsIcon icon={Add01Icon} size={16} />{" "}
                  <span className="sm:inline">New Workspace</span>
                </button>
              </div>
              {!data.workspace?.length ? (
                <div className="w-full flex-1 flex flex-col items-center justify-center py-12 sm:py-16 px-4 border border-dashed border-secondary/10 rounded-xl bg-white/60 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary text-primary mb-3">
                    <HugeiconsIcon icon={Folder02Icon} size={22} />
                  </div>
                  <h3 className="text-sm font-semibold">No workspaces yet</h3>
                  <p className="text-xs text-secondary/50 mt-1 max-w-xs">
                    Create your first workspace to start organizing projects.
                  </p>
                  <button
                    onClick={() => setShowCreateWorkspace(true)}
                    className="mt-4 px-4 py-2 bg-secondary text-background rounded-lg text-sm font-medium"
                  >
                    Create Workspace
                  </button>
                </div>
              ) : (
                <div className="w-full h-full p-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                  {data.workspace.map((workspace, i) => (
                    <div
                      key={workspace.id ?? i}
                      onClick={() => toWorkspace(workspace.id)}
                      className="group h-fit max-h-50 w-full min-w-0 relative flex flex-col items-start rounded-xl border border-secondary/10 bg-white p-4 sm:p-5 transition-all hover:border-secondary/20 hover:shadow-lg cursor-pointer"
                    >
                      <div className="w-full flex items-start justify-between gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-secondary/10 bg-secondary text-primary">
                          <HugeiconsIcon icon={Folder02Icon} size={21} />
                        </div>
                        <div className="w-fit px-3 py-1 rounded-full bg-primary text-secondary">
                          <p className="text-[10px] uppercase tracking-wider font-semibold">
                            {workspace.workspace_type}
                          </p>
                        </div>
                      </div>
                      <div className="w-full mt-3">
                        <p className="text-[15px] font-semibold tracking-tight truncate">
                          {workspace.name}
                        </p>
                        <p className="text-xs leading-5 text-secondary/55 line-clamp-2 mt-1">
                          Description: {workspace.description || "—"}
                        </p>
                      </div>
                      <div className="w-full mt-auto border-t border-secondary/8 pt-3 flex items-end justify-between">
                        <p className="text-[10px] flex items-center gap-2 uppercase tracking-widest font-medium text-secondary/50">
                          Projects{" "}
                          <span className="text-sm font-semibold text-secondary">
                            {workspace.projects?.length ?? 0}
                          </span>
                        </p>
                        <div className="h-7 w-7 flex items-center justify-center rounded-full border border-secondary/10 group-hover:bg-secondary group-hover:text-white transition-colors">
                          →
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <AppModal
        open={showCreateWorkspace}
        onClose={() => setShowCreateWorkspace(false)}
        title="Create Workspace"
        description="Workspaces group your projects. Choose a type to get started."
        icon={<HugeiconsIcon icon={Folder02Icon} size={16} />}
      >
        <form onSubmit={handleCreateWorkspace} className="p-6 space-y-4">
          <Field label="Name" required hint={`${wsForm.name.length}/40`}>
            <Input
              autoFocus
              value={wsForm.name}
              onChange={(e) =>
                setWsForm((p) => ({ ...p, name: e.target.value }))
              }
              placeholder="e.g. Personal"
              maxLength={40}
              required
            />
          </Field>
          <Field label="Type" required>
            <Select
              value={wsForm.workspace_type}
              onChange={(e) =>
                setWsForm((p) => ({ ...p, workspace_type: e.target.value }))
              }
            >
              <option value="PERSONAL">Personal</option>
              <option value="TEAM">Team</option>
            </Select>
          </Field>
          <Field label="Description" hint={`${wsForm.description.length}/160`}>
            <Textarea
              value={wsForm.description}
              onChange={(e) =>
                setWsForm((p) => ({ ...p, description: e.target.value }))
              }
              placeholder="What's this workspace for?"
              rows={3}
              maxLength={160}
            />
          </Field>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowCreateWorkspace(false)}
              className="flex-1 py-2.5 rounded-lg text-sm font-medium border border-secondary/10 hover:bg-secondary/5"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={creating || !wsForm.name.trim()}
              className="flex-1 py-2.5 rounded-lg text-sm font-semibold bg-secondary text-white hover:bg-secondary/90 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {creating ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                "Create Workspace"
              )}
            </button>
          </div>
        </form>
      </AppModal>
    </section>
  );
};

export default Dashboard;
