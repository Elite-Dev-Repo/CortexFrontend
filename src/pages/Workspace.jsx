import React, { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import {
  Plus, Folder, X, LayoutDashboard, Menu,
  ArrowLeft, SquareStack, MoreHorizontal, Pencil, Trash2,
  Settings, ChevronRight
} from "lucide-react"
import { toast } from "sonner"
import { ACCESS } from "@/lib/constants"
import { getWorkspace, updateWorkspace, deleteWorkspace } from "@/lib/workspacesApi"
import { createProject, deleteProject } from "@/lib/projectsApi"
import Sidebar from "@/components/Sidebar"

const Workspace = () => {
  const { uuid } = useParams()
  const navigate = useNavigate()
  const [workspace, setWorkspace] = useState(null)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showCreateProject, setShowCreateProject] = useState(false)
  const [projectForm, setProjectForm] = useState({ name: "", description: "" })
  const [creating, setCreating] = useState(false)
  const [editing, setEditing] = useState(false)
  const [editForm, setEditForm] = useState({ name: "", description: "" })
  const [menuOpen, setMenuOpen] = useState(null)

  useEffect(() => {
    if (!localStorage.getItem(ACCESS)) {
      navigate("/auth")
      return
    }
    fetchWorkspace()
  }, [uuid])

  const fetchWorkspace = async () => {
    try {
      const data = await getWorkspace(uuid)
      setWorkspace(data)
      setEditForm({ name: data.name, description: data.description || "" })
    } catch {
      toast.error("Workspace not found")
      navigate("/dashboard")
    } finally {
      setLoading(false)
    }
  }

  const handleCreateProject = async (e) => {
    e.preventDefault()
    setCreating(true)
    try {
      const project = await createProject({ ...projectForm, workspace: uuid })
      setWorkspace((prev) => ({
        ...prev,
        projects: [...(prev.projects || []), project],
      }))
      setShowCreateProject(false)
      setProjectForm({ name: "", description: "" })
      toast.success("Project created")
    } catch (err) {
      const msg = err.response?.data?.name?.[0] || err.response?.data?.detail || "Failed to create project"
      toast.error(msg)
    } finally {
      setCreating(false)
    }
  }

  const handleUpdateWorkspace = async (e) => {
    e.preventDefault()
    try {
      const updated = await updateWorkspace(uuid, editForm)
      setWorkspace((prev) => ({ ...prev, ...updated }))
      setEditing(false)
      toast.success("Workspace updated")
    } catch (err) {
      toast.error("Failed to update workspace")
    }
  }

  const handleDeleteWorkspace = async () => {
    if (!confirm("Delete this workspace and all its projects?")) return
    try {
      await deleteWorkspace(uuid)
      toast.success("Workspace deleted")
      navigate("/dashboard")
    } catch {
      toast.error("Failed to delete workspace")
    }
  }

  const handleDeleteProject = async (projectId) => {
    if (!confirm("Delete this project?")) return
    try {
      await deleteProject(projectId)
      setWorkspace((prev) => ({
        ...prev,
        projects: (prev.projects || []).filter((p) => p.id !== projectId),
      }))
      toast.success("Project deleted")
    } catch {
      toast.error("Failed to delete project")
    }
  }

  const handleLogout = () => {
    localStorage.removeItem(ACCESS)
    localStorage.removeItem("refresh")
    navigate("/auth")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-white flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
      </div>
    )
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
              { icon: LayoutDashboard, label: "Dashboard", onClick: () => navigate("/dashboard") },
              { icon: Folder, label: workspace?.name || "Workspace", active: true },
            ],
          },
          ...(workspace?.projects?.length > 0
            ? [
                {
                  tag: "Projects",
                  items: workspace.projects.slice(0, 5).map((p) => ({
                    icon: SquareStack,
                    label: p.name,
                    onClick: () => navigate(`/workspace/${uuid}/project/${p.id}`),
                  })),
                },
              ]
            : []),
          {
            tag: "General",
            items: [{ icon: Settings, label: "Settings", disabled: true }],
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
              onClick={() => navigate("/dashboard")}
              className="p-2 -ml-2 hover:bg-white/5 rounded-lg hidden sm:block shrink-0"
            >
              <ArrowLeft size={18} />
            </button>
            <h1 className="text-lg font-semibold truncate">{workspace?.name}</h1>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setEditing(true)}
              className="p-2 hover:bg-white/5 rounded-lg text-white/40 hover:text-white"
            >
              <Pencil size={16} />
            </button>
            <button
              onClick={() => setShowCreateProject(true)}
              className="flex items-center gap-2 px-3 lg:px-4 py-2 bg-white text-background rounded-lg text-sm font-semibold hover:bg-white/90 transition-all"
            >
              <Plus size={16} />
              <span className="hidden sm:inline">New Project</span>
            </button>
          </div>
        </header>

        <div className="flex-1 p-4 lg:p-8 overflow-y-auto">
          {workspace?.description && (
            <p className="text-sm text-white/40 mb-6 max-w-2xl">{workspace.description}</p>
          )}

          {(!workspace?.projects || workspace.projects.length === 0) ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <SquareStack size={48} className="text-white/20 mb-4" />
              <h2 className="text-xl font-semibold mb-2">No projects yet</h2>
              <p className="text-white/40 text-sm mb-6 max-w-xs">
                Projects help you organize features within this workspace.
              </p>
              <button
                onClick={() => setShowCreateProject(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-white text-background rounded-lg text-sm font-semibold hover:bg-white/90 transition-all"
              >
                <Plus size={16} />
                Create Project
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {workspace.projects.map((project, i) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  className="group bg-foreground border border-white/10 rounded-xl p-5 hover:border-white/20 hover:bg-white/[0.02] transition-all cursor-pointer relative"
                  onClick={() => navigate(`/workspace/${uuid}/project/${project.id}`)}
                >
                  <div className="absolute top-3 right-3">
                    <button
                      onClick={(e) => { e.stopPropagation(); setMenuOpen(menuOpen === project.id ? null : project.id) }}
                      className="p-1 hover:bg-white/5 rounded-lg text-white/30 hover:text-white opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <MoreHorizontal size={16} />
                    </button>
                    {menuOpen === project.id && (
                      <div className="absolute right-0 top-8 w-32 bg-foreground border border-white/10 rounded-lg shadow-xl py-1 z-20">
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDeleteProject(project.id); setMenuOpen(null) }}
                          className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-red-400 hover:bg-white/5"
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="flex items-start gap-3 mb-3">
                    <div className="p-2 bg-white/5 rounded-lg shrink-0">
                      <SquareStack size={18} className="text-white/60" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold truncate">{project.name}</h3>
                      <span className={`inline-block mt-1 text-[11px] px-2 py-0.5 rounded-full font-medium capitalize ${
                        project.status === "completed" ? "bg-green-500/10 text-green-400" :
                        project.status === "in_progress" ? "bg-blue-500/10 text-blue-400" :
                        "bg-white/5 text-white/40"
                      }`}>
                        {project.status.replace("_", " ")}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-white/40 line-clamp-2 mb-3">
                    {project.description || "No description"}
                  </p>

                  <div className="flex items-center gap-2 text-xs text-white/30">
                    <span>{new Date(project.created_at).toLocaleDateString()}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Edit workspace modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setEditing(false)} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full max-w-md bg-foreground border border-white/10 rounded-2xl p-6 sm:p-8"
          >
            <button
              onClick={() => setEditing(false)}
              className="absolute top-4 right-4 p-1.5 hover:bg-white/5 rounded-lg text-white/40 hover:text-white"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-white/5 rounded-lg">
                <Pencil size={18} />
              </div>
              <h2 className="text-lg font-semibold">Edit Workspace</h2>
            </div>

            <form onSubmit={handleUpdateWorkspace} className="space-y-4">
              <div>
                <label className="text-sm text-white/60 mb-1.5 block">Name</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm((p) => ({ ...p, name: e.target.value }))}
                  className="w-full bg-background border border-white/10 rounded-lg py-2.5 px-4 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/30 transition-all"
                  required
                />
              </div>
              <div>
                <label className="text-sm text-white/60 mb-1.5 block">Description</label>
                <textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm((p) => ({ ...p, description: e.target.value }))}
                  rows={3}
                  className="w-full bg-background border border-white/10 rounded-lg py-2.5 px-4 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/30 transition-all resize-none"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="flex-1 py-2.5 rounded-lg text-sm border border-white/10 hover:bg-white/5 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-lg text-sm font-semibold bg-white text-background hover:bg-white/90 transition-all"
                >
                  Save
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Create project modal */}
      {showCreateProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowCreateProject(false)} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full max-w-md bg-foreground border border-white/10 rounded-2xl p-6 sm:p-8"
          >
            <button
              onClick={() => setShowCreateProject(false)}
              className="absolute top-4 right-4 p-1.5 hover:bg-white/5 rounded-lg text-white/40 hover:text-white"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-white/5 rounded-lg">
                <Plus size={18} />
              </div>
              <h2 className="text-lg font-semibold">Create Project</h2>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-4">
              <div>
                <label className="text-sm text-white/60 mb-1.5 block">Name</label>
                <input
                  type="text"
                  value={projectForm.name}
                  onChange={(e) => setProjectForm((p) => ({ ...p, name: e.target.value }))}
                  placeholder="My Project"
                  className="w-full bg-background border border-white/10 rounded-lg py-2.5 px-4 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/30 transition-all"
                  required
                />
              </div>
              <div>
                <label className="text-sm text-white/60 mb-1.5 block">Description (optional)</label>
                <textarea
                  value={projectForm.description}
                  onChange={(e) => setProjectForm((p) => ({ ...p, description: e.target.value }))}
                  placeholder="What's this project about?"
                  rows={3}
                  className="w-full bg-background border border-white/10 rounded-lg py-2.5 px-4 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/30 transition-all resize-none"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateProject(false)}
                  className="flex-1 py-2.5 rounded-lg text-sm border border-white/10 hover:bg-white/5 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="flex-1 py-2.5 rounded-lg text-sm font-semibold bg-white text-background hover:bg-white/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {creating ? (
                    <span className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin" />
                  ) : (
                    "Create"
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default Workspace
