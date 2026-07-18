import React, { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import {
  Blocks, Plus, X, LogOut, LayoutDashboard, Menu,
  ArrowLeft, SquareStack, Tag, CheckCircle2, Circle,
  Clock, ListChecks, Folder, MoreHorizontal, Trash2, Pencil
} from "lucide-react"
import { toast } from "sonner"
import { ACCESS } from "@/lib/constants"
import { getProject, updateProject, deleteProject } from "@/lib/projectsApi"
import { getFeatures, createFeature, updateFeature, deleteFeature } from "@/lib/featuresApi"
import { createTask, updateTask, deleteTask } from "@/lib/tasksApi"

const STATUS_COLORS = {
  pending: { bg: "bg-yellow-500/10", text: "text-yellow-400", dot: "bg-yellow-400" },
  in_progress: { bg: "bg-blue-500/10", text: "text-blue-400", dot: "bg-blue-400" },
  completed: { bg: "bg-green-500/10", text: "text-green-400", dot: "bg-green-400" },
}

const Project = () => {
  const { uuid, projectUuid } = useParams()
  const navigate = useNavigate()
  const [project, setProject] = useState(null)
  const [features, setFeatures] = useState([])
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showCreateFeature, setShowCreateFeature] = useState(false)
  const [featureForm, setFeatureForm] = useState({ name: "", description: "", tags: "" })
  const [creatingFeature, setCreatingFeature] = useState(false)
  const [editingStatus, setEditingStatus] = useState(false)
  const [newTaskText, setNewTaskText] = useState({})
  const [featureMenu, setFeatureMenu] = useState(null)
  const [taskMenu, setTaskMenu] = useState(null)

  useEffect(() => {
    if (!localStorage.getItem(ACCESS)) {
      navigate("/auth")
      return
    }
    fetchProject()
  }, [projectUuid])

  const fetchProject = async () => {
    try {
      const [projectData, featuresData] = await Promise.all([
        getProject(projectUuid),
        getFeatures(),
      ])
      setProject(projectData)
      setFeatures(featuresData.filter((f) => f.project === projectUuid))
    } catch {
      toast.error("Project not found")
      navigate(`/workspace/${uuid}`)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (newStatus) => {
    try {
      const updated = await updateProject(projectUuid, { status: newStatus })
      setProject((prev) => ({ ...prev, status: newStatus }))
      setEditingStatus(false)
      toast.success(`Status set to ${newStatus.replace("_", " ")}`)
    } catch {
      toast.error("Failed to update status")
    }
  }

  const handleCreateFeature = async (e) => {
    e.preventDefault()
    setCreatingFeature(true)
    try {
      const tags = featureForm.tags
        ? featureForm.tags.split(",").map((t) => t.trim()).filter(Boolean)
        : []
      const feature = await createFeature({
        name: featureForm.name,
        description: featureForm.description || undefined,
        tags,
        project: projectUuid,
      })
      setFeatures((prev) => [...prev, feature])
      setShowCreateFeature(false)
      setFeatureForm({ name: "", description: "", tags: "" })
      toast.success("Feature created")
    } catch (err) {
      toast.error(err.response?.data?.name?.[0] || "Failed to create feature")
    } finally {
      setCreatingFeature(false)
    }
  }

  const handleDeleteFeature = async (id) => {
    if (!confirm("Delete this feature and all its tasks?")) return
    try {
      await deleteFeature(id)
      setFeatures((prev) => prev.filter((f) => f.id !== id))
      toast.success("Feature deleted")
    } catch {
      toast.error("Failed to delete feature")
    }
  }

  const handleAddTask = async (featureId) => {
    const text = newTaskText[featureId]?.trim()
    if (!text) return
    try {
      const task = await createTask({ name: text, feature: featureId })
      setFeatures((prev) =>
        prev.map((f) =>
          f.id === featureId
            ? { ...f, tasks: [...(f.tasks || []), task] }
            : f
        )
      )
      setNewTaskText((prev) => ({ ...prev, [featureId]: "" }))
      toast.success("Task added")
    } catch (err) {
      const msg = err.response?.data?.name?.[0] || err.response?.data?.description?.[0] || "Failed to add task"
      toast.error(msg)
    }
  }

  const handleToggleTask = async (task, featureId) => {
    const newStatus = task.status === "completed" ? "pending" : "completed"
    try {
      const updated = await updateTask(task.id, { status: newStatus })
      setFeatures((prev) =>
        prev.map((f) =>
          f.id === featureId
            ? { ...f, tasks: f.tasks.map((t) => (t.id === task.id ? updated : t)) }
            : f
        )
      )
    } catch {
      toast.error("Failed to update task")
    }
  }

  const handleDeleteTask = async (taskId, featureId) => {
    try {
      await deleteTask(taskId)
      setFeatures((prev) =>
        prev.map((f) =>
          f.id === featureId
            ? { ...f, tasks: f.tasks.filter((t) => t.id !== taskId) }
            : f
        )
      )
      toast.success("Task deleted")
    } catch {
      toast.error("Failed to delete task")
    }
  }

  const handleDeleteProject = async () => {
    if (!confirm("Delete this project and all its data?")) return
    try {
      await deleteProject(projectUuid)
      toast.success("Project deleted")
      navigate(`/workspace/${uuid}`)
    } catch {
      toast.error("Failed to delete project")
    }
  }

  const handleLogout = () => {
    localStorage.removeItem(ACCESS)
    localStorage.removeItem("refresh")
    navigate("/auth")
  }

  const sc = project ? STATUS_COLORS[project.status] || STATUS_COLORS.pending : STATUS_COLORS.pending

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-white flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-white flex">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`fixed lg:static inset-y-0 left-0 z-30 w-64 bg-foreground border-r border-white/10 transform transition-transform duration-200 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      } flex flex-col`}>
        <div className="flex items-center gap-2 px-6 h-16 border-b border-white/10">
          <Blocks size={22} />
          <span className="tracking-wider font-light">Cortex</span>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <button onClick={() => navigate("/dashboard")}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/5 transition-all">
            <LayoutDashboard size={18} /> Dashboard
          </button>
          <button onClick={() => navigate(`/workspace/${uuid}`)}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/5 transition-all">
            <Folder size={18} /> {project?.workspace_name || "Workspace"}
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg bg-white/10 text-sm font-medium">
            <SquareStack size={18} /> {project?.name}
          </button>
        </nav>
        <div className="p-4 border-t border-white/10">
          <button onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/5 transition-all">
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-h-screen min-w-0">
        <header className="h-16 border-b border-white/10 flex items-center justify-between px-4 lg:px-8 bg-background/80 backdrop-blur-sm sticky top-0 z-10">
          <div className="flex items-center gap-3 min-w-0">
            <button onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 -ml-2 hover:bg-white/5 rounded-lg shrink-0">
              <Menu size={20} />
            </button>
            <button onClick={() => navigate(`/workspace/${uuid}`)}
              className="p-2 -ml-2 hover:bg-white/5 rounded-lg hidden sm:block shrink-0">
              <ArrowLeft size={18} />
            </button>
            <h1 className="text-lg font-semibold truncate">{project?.name}</h1>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button onClick={handleDeleteProject}
              className="p-2 hover:bg-white/5 rounded-lg text-white/30 hover:text-red-400 transition-all">
              <Trash2 size={16} />
            </button>
            <button onClick={() => setShowCreateFeature(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white text-background rounded-lg text-sm font-semibold hover:bg-white/90 transition-all">
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
                  const c = STATUS_COLORS[s]
                  return (
                    <button
                      key={s}
                      onClick={() => handleStatusChange(s)}
                      className={`w-full flex items-center gap-2 px-3 py-1.5 text-sm ${c.text} hover:bg-white/5 ${project?.status === s ? "bg-white/5" : ""}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
                      {s.replace("_", " ")}
                    </button>
                  )
                })}
              </div>
            )}
          </div>
          <span className="text-xs text-white/30">
            {features.length} feature{features.length !== 1 ? "s" : ""}
          </span>
          <span className="text-xs text-white/30">
            {features.reduce((sum, f) => sum + (f.tasks?.length || 0), 0)} task
            {features.reduce((sum, f) => sum + (f.tasks?.length || 0), 0) !== 1 ? "s" : ""}
          </span>
          {project?.description && (
            <span className="text-xs text-white/30 truncate max-w-[300px] ml-auto hidden md:block">
              {project.description}
            </span>
          )}
        </div>

        {/* Feature grid */}
        <div className="flex-1 p-4 lg:p-8 overflow-y-auto">
          {features.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <SquareStack size={48} className="text-white/20 mb-4" />
              <h2 className="text-xl font-semibold mb-2">No features mapped yet</h2>
              <p className="text-white/40 text-sm mb-6 max-w-sm">
                Features are the building blocks of your project. Add tags to categorize and tasks to break them down.
              </p>
              <button onClick={() => setShowCreateFeature(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-white text-background rounded-lg text-sm font-semibold hover:bg-white/90 transition-all">
                <Plus size={16} /> Map a Feature
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {features.map((feature, i) => (
                <motion.div
                  key={feature.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  className="bg-foreground border border-white/10 rounded-xl overflow-hidden hover:border-white/20 transition-all group"
                >
                  {/* Feature header */}
                  <div className="p-4 pb-3 border-b border-white/5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <SquareStack size={15} className="text-white/40 shrink-0" />
                          <h3 className="font-semibold text-sm truncate">{feature.name}</h3>
                        </div>
                        {feature.tags?.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {feature.tags.map((tag, ti) => (
                              <span key={ti}
                                className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-white/50 font-medium">
                                <Tag size={10} /> {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="relative shrink-0">
                        <button
                          onClick={() => setFeatureMenu(featureMenu === feature.id ? null : feature.id)}
                          className="p-1 hover:bg-white/5 rounded-lg text-white/20 hover:text-white opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <MoreHorizontal size={14} />
                        </button>
                        {featureMenu === feature.id && (
                          <div className="absolute right-0 top-7 w-28 bg-foreground border border-white/10 rounded-lg shadow-xl py-1 z-20">
                            <button onClick={() => { handleDeleteFeature(feature.id); setFeatureMenu(null) }}
                              className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-red-400 hover:bg-white/5">
                              <Trash2 size={13} /> Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    {feature.description && (
                      <p className="text-xs text-white/40 mt-1.5 line-clamp-2">{feature.description}</p>
                    )}
                  </div>

                  {/* Tasks */}
                  <div className="px-4 py-2">
                    <div className="flex items-center gap-1.5 text-[11px] text-white/30 mb-2">
                      <ListChecks size={12} />
                      <span>{feature.tasks?.length || 0} task{(feature.tasks?.length || 0) !== 1 ? "s" : ""}</span>
                    </div>

                    <div className="space-y-1 max-h-48 overflow-y-auto custom-scroll">
                      {(feature.tasks || []).map((task) => (
                        <div key={task.id} className="group/task flex items-center gap-2 py-1 px-1 rounded-md hover:bg-white/5 transition-all relative">
                          <button
                            onClick={() => handleToggleTask(task, feature.id)}
                            className="shrink-0 mt-0.5"
                          >
                            {task.status === "completed" ? (
                              <CheckCircle2 size={14} className="text-green-400" />
                            ) : (
                              <Circle size={14} className="text-white/30 group-hover/task:text-white/50" />
                            )}
                          </button>
                          <span className={`text-xs flex-1 truncate ${task.status === "completed" ? "text-white/30 line-through" : "text-white/70"}`}>
                            {task.name}
                          </span>
                          <button
                            onClick={() => setTaskMenu(taskMenu === task.id ? null : task.id)}
                            className="p-0.5 hover:bg-white/10 rounded text-white/10 hover:text-white/40 opacity-0 group-hover/task:opacity-100 transition-all shrink-0"
                          >
                            <MoreHorizontal size={11} />
                          </button>
                          {taskMenu === task.id && (
                            <div className="absolute right-0 top-6 w-24 bg-foreground border border-white/10 rounded-lg shadow-xl py-1 z-20">
                              <button
                                onClick={() => { handleDeleteTask(task.id, feature.id); setTaskMenu(null) }}
                                className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-red-400 hover:bg-white/5"
                              >
                                <Trash2 size={11} /> Delete
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Add task input */}
                    <div className="flex items-center gap-2 mt-2 pt-2 border-t border-white/5">
                      <input
                        type="text"
                        value={newTaskText[feature.id] || ""}
                        onChange={(e) => setNewTaskText((prev) => ({ ...prev, [feature.id]: e.target.value }))}
                        onKeyDown={(e) => { if (e.key === "Enter") handleAddTask(feature.id) }}
                        placeholder="Add a task..."
                        className="flex-1 bg-transparent text-xs text-white placeholder-white/20 focus:outline-none"
                      />
                      {(newTaskText[feature.id]?.trim() || "") && (
                        <button onClick={() => handleAddTask(feature.id)}
                          className="text-[11px] text-white/40 hover:text-white font-medium shrink-0">
                          Add
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Feature modal */}
      {showCreateFeature && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowCreateFeature(false)} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full max-w-md bg-foreground border border-white/10 rounded-2xl p-6 sm:p-8"
          >
            <button onClick={() => setShowCreateFeature(false)}
              className="absolute top-4 right-4 p-1.5 hover:bg-white/5 rounded-lg text-white/40 hover:text-white">
              <X size={18} />
            </button>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-white/5 rounded-lg"><Plus size={18} /></div>
              <h2 className="text-lg font-semibold">Map a Feature</h2>
            </div>
            <form onSubmit={handleCreateFeature} className="space-y-4">
              <div>
                <label className="text-sm text-white/60 mb-1.5 block">Name</label>
                <input type="text" value={featureForm.name}
                  onChange={(e) => setFeatureForm((p) => ({ ...p, name: e.target.value }))}
                  placeholder="User Authentication" className="w-full bg-background border border-white/10 rounded-lg py-2.5 px-4 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/30 transition-all" required />
              </div>
              <div>
                <label className="text-sm text-white/60 mb-1.5 block">Description (optional)</label>
                <textarea value={featureForm.description}
                  onChange={(e) => setFeatureForm((p) => ({ ...p, description: e.target.value }))}
                  placeholder="What does this feature do?" rows={2}
                  className="w-full bg-background border border-white/10 rounded-lg py-2.5 px-4 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/30 transition-all resize-none" />
              </div>
              <div>
                <label className="text-sm text-white/60 mb-1.5 block">Tags (comma separated)</label>
                <input type="text" value={featureForm.tags}
                  onChange={(e) => setFeatureForm((p) => ({ ...p, tags: e.target.value }))}
                  placeholder="backend, auth, security" className="w-full bg-background border border-white/10 rounded-lg py-2.5 px-4 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/30 transition-all" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowCreateFeature(false)}
                  className="flex-1 py-2.5 rounded-lg text-sm border border-white/10 hover:bg-white/5 transition-all">Cancel</button>
                <button type="submit" disabled={creatingFeature}
                  className="flex-1 py-2.5 rounded-lg text-sm font-semibold bg-white text-background hover:bg-white/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                  {creatingFeature ? (
                    <span className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin" />
                  ) : "Create Feature"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default Project
