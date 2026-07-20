import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Plus,
  X,
  LayoutDashboard,
  Menu,
  ArrowLeft,
  SquareStack,
  Tag,
  Folder,
  MoreHorizontal,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { ACCESS } from "@/lib/constants";
import { getProject, updateProject, deleteProject } from "@/lib/projectsApi";
import { createFeature, deleteFeature } from "@/lib/featuresApi";
import Sidebar from "@/components/Sidebar";

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
  const [project, setProject] = useState(null);
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showCreateFeature, setShowCreateFeature] = useState(false);
  const [featureForm, setFeatureForm] = useState({
    name: "",
    description: "",
    tags: "",
  });
  const [creatingFeature, setCreatingFeature] = useState(false);
  const [editingStatus, setEditingStatus] = useState(false);
  const [featureMenu, setFeatureMenu] = useState(null);

  useEffect(() => {
    if (!localStorage.getItem(ACCESS)) {
      navigate("/auth");
      return;
    }
    fetchProject();
  }, [projectUuid]);

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
      setShowCreateFeature(false);
      setFeatureForm({ name: "", description: "", tags: "" });
      toast.success("Feature created");
    } catch (err) {
      toast.error(err.response?.data?.name?.[0] || "Failed to create feature");
    } finally {
      setCreatingFeature(false);
    }
  };

  const handleDeleteFeature = async (id) => {
    if (!confirm("Delete this feature and all its tasks?")) return;
    try {
      await deleteFeature(id);
      setFeatures((prev) => prev.filter((f) => f.id !== id));
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
    localStorage.removeItem(ACCESS);
    localStorage.removeItem("refresh");
    navigate("/auth");
  };

  const sc = project
    ? STATUS_COLORS[project.status] || STATUS_COLORS.pending
    : STATUS_COLORS.pending;

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-white flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-white flex">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        onLogout={handleLogout}
        sections={[
          {
            tag: "Main",
            items: [
              {
                icon: LayoutDashboard,
                label: "Dashboard",
                onClick: () => navigate("/dashboard"),
              },
              {
                icon: Folder,
                label: project?.workspace_name || "Workspace",
                onClick: () => navigate(`/workspace/${uuid}`),
              },
              {
                icon: SquareStack,
                label: project?.name || "Project",
                active: true,
              },
            ],
          },
        ]}
      />

      <div className="flex-1 flex flex-col min-h-screen min-w-0">
        <header className="h-16 border-b border-white/10 flex items-center justify-between px-4 lg:px-8 bg-background/80 backdrop-blur-sm sticky top-0 z-10">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 -ml-2 hover:bg-white/5 rounded-lg shrink-0"
            >
              <Menu size={20} />
            </button>
            <button
              onClick={() => navigate(`/workspace/${uuid}`)}
              className="p-2 -ml-2 hover:bg-white/5 rounded-lg hidden sm:block shrink-0"
            >
              <ArrowLeft size={18} />
            </button>
            <h1 className="text-lg font-semibold truncate">{project?.name}</h1>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleDeleteProject}
              className="p-2 hover:bg-white/5 rounded-lg text-white/30 hover:text-red-400 transition-all"
            >
              <Trash2 size={16} />
            </button>
            <button
              onClick={() => setShowCreateFeature(true)}
              className="flex items-center gap-2 px-3 lg:px-4 py-2 bg-white text-background rounded-lg text-sm font-semibold hover:bg-white/90 transition-all"
            >
              <Plus size={16} />
              <span className="hidden sm:inline">New Feature</span>
            </button>
          </div>
        </header>

        {/* Project meta bar */}
        <div className="border-b border-white/5 px-4 lg:px-8 py-3 flex flex-wrap items-center gap-3">
          <div className="relative">
            <button
              onClick={() => setEditingStatus(!editingStatus)}
              className={`inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-medium ${sc.bg} ${sc.text} hover:opacity-80 transition-all`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
              {project?.status?.replace("_", " ")}
            </button>
            {editingStatus && (
              <div className="absolute top-full left-0 mt-1 w-40 bg-foreground border border-white/10 rounded-lg shadow-xl py-1 z-20">
                {["pending", "in_progress", "completed"].map((s) => {
                  const c = STATUS_COLORS[s];
                  return (
                    <button
                      key={s}
                      onClick={() => handleStatusChange(s)}
                      className={`w-full flex items-center gap-2 px-3 py-1.5 text-sm ${c.text} hover:bg-white/5 ${project?.status === s ? "bg-white/5" : ""}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
                      {s.replace("_", " ")}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
          <span className="text-xs text-white/30">
            {features.length} features
          </span>
          {project?.description && (
            <span className="text-xs text-white/30 truncate max-w-[300px] ml-auto hidden md:block">
              {project.description}
            </span>
          )}
        </div>

        {/* Content area */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 lg:p-8 space-y-8">
            {/* Features section */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider">
                  Features
                </h2>
              </div>
              {features.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-white/10 rounded-xl">
                  <SquareStack size={40} className="text-white/20 mb-3" />
                  <p className="text-sm text-white/40 mb-4">
                    Map your first feature to start breaking down this project.
                  </p>
                  <button
                    onClick={() => setShowCreateFeature(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-white text-background rounded-lg text-sm font-semibold hover:bg-white/90 transition-all"
                  >
                    <Plus size={15} /> Map a Feature
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                  {features.map((feature, i) => (
                    <motion.div
                      key={feature.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.05 }}
                      onClick={() =>
                        navigate(
                          `/workspace/${uuid}/project/${projectUuid}/feature/${feature.id}`,
                        )
                      }
                      className="bg-foreground border border-white/10 rounded-xl p-4 hover:border-white/20 transition-all group cursor-pointer"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <SquareStack
                              size={15}
                              className="text-white/40 shrink-0"
                            />
                            <h3 className="font-semibold text-sm truncate">
                              {feature.name}
                            </h3>
                          </div>
                          {feature.tags?.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-2">
                              {feature.tags.map((tag, ti) => (
                                <span
                                  key={ti}
                                  className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-white/50 font-medium"
                                >
                                  <Tag size={10} /> {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="relative shrink-0">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setFeatureMenu(
                                featureMenu === feature.id ? null : feature.id,
                              );
                            }}
                            className="p-1 hover:bg-white/5 rounded-lg text-white/20 hover:text-white opacity-0 group-hover:opacity-100 transition-all"
                          >
                            <MoreHorizontal size={14} />
                          </button>
                          {featureMenu === feature.id && (
                            <div
                              className="absolute right-0 top-7 w-28 bg-foreground border border-white/10 rounded-lg shadow-xl py-1 z-20"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <button
                                onClick={() => {
                                  handleDeleteFeature(feature.id);
                                  setFeatureMenu(null);
                                }}
                                className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-red-400 hover:bg-white/5"
                              >
                                <Trash2 size={13} /> Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                      {feature.description && (
                        <p className="text-xs text-white/40 mt-2 line-clamp-2">
                          {feature.description}
                        </p>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </div>

      {/* Create Feature modal */}
      {showCreateFeature && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setShowCreateFeature(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full max-w-md bg-foreground border border-white/10 rounded-2xl p-6 sm:p-8"
          >
            <button
              onClick={() => setShowCreateFeature(false)}
              className="absolute top-4 right-4 p-1.5 hover:bg-white/5 rounded-lg text-white/40 hover:text-white"
            >
              <X size={18} />
            </button>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-white/5 rounded-lg">
                <Plus size={18} />
              </div>
              <h2 className="text-lg font-semibold">Map a Feature</h2>
            </div>
            <form onSubmit={handleCreateFeature} className="space-y-4">
              <div>
                <label className="text-sm text-white/60 mb-1.5 block">
                  Name
                </label>
                <input
                  type="text"
                  value={featureForm.name}
                  onChange={(e) =>
                    setFeatureForm((p) => ({ ...p, name: e.target.value }))
                  }
                  placeholder="User Authentication"
                  className="w-full bg-background border border-white/10 rounded-lg py-2.5 px-4 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/30 transition-all"
                  required
                />
              </div>
              <div>
                <label className="text-sm text-white/60 mb-1.5 block">
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
                  className="w-full bg-background border border-white/10 rounded-lg py-2.5 px-4 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/30 transition-all resize-none"
                />
              </div>
              <div>
                <label className="text-sm text-white/60 mb-1.5 block">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={featureForm.tags}
                  onChange={(e) =>
                    setFeatureForm((p) => ({ ...p, tags: e.target.value }))
                  }
                  placeholder="backend, auth, security"
                  className="w-full bg-background border border-white/10 rounded-lg py-2.5 px-4 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/30 transition-all"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateFeature(false)}
                  className="flex-1 py-2.5 rounded-lg text-sm border border-white/10 hover:bg-white/5 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingFeature}
                  className="flex-1 py-2.5 rounded-lg text-sm font-semibold bg-white text-background hover:bg-white/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {creatingFeature ? (
                    <span className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin" />
                  ) : (
                    "Create Feature"
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Project;
