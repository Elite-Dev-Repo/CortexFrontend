import React, { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import {
  Blocks, Plus, X, LogOut, LayoutDashboard, Menu,
  ArrowLeft, SquareStack, Tag, CheckCircle2, Circle,
  ListChecks, Folder, MoreHorizontal, Trash2
} from "lucide-react"
import { toast } from "sonner"
import { ACCESS } from "@/lib/constants"
import { getProject, updateProject, deleteProject } from "@/lib/projectsApi"
import { getFeatures, createFeature, deleteFeature } from "@/lib/featuresApi"
import { getTasks, createTask, updateTask, deleteTask } from "@/lib/tasksApi"

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
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showCreateFeature, setShowCreateFeature] = useState(false)
  const [featureForm, setFeatureForm] = useState({ name: "", description: "", tags: "" })
  const [creatingFeature, setCreatingFeature] = useState(false)
  const [editingStatus, setEditingStatus] = useState(false)
  const [featureMenu, setFeatureMenu] = useState(null)
  const [showAddTask, setShowAddTask] = useState(false)
  const [newTaskName, setNewTaskName] = useState("")
  const [newTaskFeature, setNewTaskFeature] = useState("")
  const [creatingTask, setCreatingTask] = useState(false)
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
      const [projectData, featuresData, tasksData] = await Promise.all([
        getProject(projectUuid),
        getFeatures(),
        getTasks(),
      ])
      setProject(projectData)
      setFeatures(featuresData.filter((f) => f.project === projectUuid))
      setTasks(tasksData.filter((t) => {
        const feature = featuresData.find((f) => f.id === t.feature)
        return feature && feature.project === projectUuid
      }))
    } catch {
      toast.error("Project not found")
      navigate(`/workspace/${uuid}`)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (newStatus) => {
    try {
      await updateProject(projectUuid, { status: newStatus })
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
      setTasks((prev) => prev.filter((t) => t.feature !== id))
      toast.success("Feature deleted")
    } catch {
      toast.error("Failed to delete feature")
    }
  }

  const handleAddTask = async (e) => {
    e.preventDefault()
    if (!newTaskName.trim() || !newTaskFeature) return
    setCreatingTask(true)
    try {
      const task = await createTask({ name: newTaskName.trim(), feature: newTaskFeature })
      setTasks((prev) => [...prev, task])
      setShowAddTask(false)
      setNewTaskName("")
      setNewTaskFeature("")
      toast.success("Task added")
    } catch (err) {
      toast.error(err.response?.data?.name?.[0] || "Failed to add task")
    } finally {
      setCreatingTask(false)
    }
  }

  const handleToggleTask = async (task) => {
    const newStatus = task.status === "completed" ? "pending" : "completed"
    try {
      const updated = await updateTask(task.id, { status: newStatus })
      setTasks((prev) => prev.map((t) => (t.id === task.id ? updated : t)))
    } catch {
      toast.error("Failed to update task")
    }
  }

  const handleDeleteTask = async (taskId) => {
    try {
      await deleteTask(taskId)
      setTasks((prev) => prev.filter((t) => t.id !== taskId))
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
  const grouped = features.reduce((acc, f) => {
    acc[f.id] = { feature: f, tasks: tasks.filter((t) => t.feature === f.id) }
    return acc
  }, {})

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
          <span className="text-xs text-white/30">{features.length} features</span>
          <span className="text-xs text-white/30">{tasks.length} tasks</span>
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
                <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider">Features</h2>
              </div>
              {features.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-white/10 rounded-xl">
                  <SquareStack size={40} className="text-white/20 mb-3" />
                  <p className="text-sm text-white/40 mb-4">Map your first feature to start breaking down this project.</p>
                  <button onClick={() => setShowCreateFeature(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-white text-background rounded-lg text-sm font-semibold hover:bg-white/90 transition-all">
                    <Plus size={15} /> Map a Feature
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                  {features.map((feature, i) => {
                    const count = tasks.filter((t) => t.feature === feature.id).length
                    return (
                      <motion.div
                        key={feature.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: i * 0.05 }}
                        className="bg-foreground border border-white/10 rounded-xl p-4 hover:border-white/20 transition-all group"
                      >
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
                              className="p-1 hover:bg-white/5 rounded-lg text-white/20 hover:text-white opacity-0 group-hover:opacity-100 transition-all">
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
                          <p className="text-xs text-white/40 mt-2 line-clamp-2">{feature.description}</p>
                        )}
                        <div className="flex items-center gap-1.5 mt-3 text-[11px] text-white/30">
                          <ListChecks size={12} />
                          <span>{count} task{count !== 1 ? "s" : ""}</span>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              )}
            </section>

            {/* Tasks section - separate from features */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider">
                  Tasks <span className="text-white/20 font-normal">({tasks.length})</span>
                </h2>
                {features.length > 0 && (
                  <button onClick={() => { setShowAddTask(true); setNewTaskFeature(features[0]?.id || "") }}
                    className="flex items-center gap-1.5 text-xs text-white/50 hover:text-white transition-all">
                    <Plus size={14} /> Add Task
                  </button>
                )}
              </div>

              {tasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-white/10 rounded-xl">
                  <ListChecks size={40} className="text-white/20 mb-3" />
                  <p className="text-sm text-white/40 mb-4">
                    {features.length === 0
                      ? "Create a feature first, then add tasks to it."
                      : "No tasks yet. Break your features down into actionable tasks."}
                  </p>
                  {features.length > 0 && (
                    <button onClick={() => { setShowAddTask(true); setNewTaskFeature(features[0]?.id || "") }}
                      className="flex items-center gap-2 px-4 py-2 bg-white text-background rounded-lg text-sm font-semibold hover:bg-white/90 transition-all">
                      <Plus size={15} /> Add Task
                    </button>
                  )}
                </div>
              ) : (
                <div className="bg-foreground border border-white/10 rounded-xl overflow-hidden">
                  <div className="divide-y divide-white/5">
                    {features.map((feature) => {
                      const featureTasks = tasks.filter((t) => t.feature === feature.id)
                      if (featureTasks.length === 0) return null
                      return (
                        <div key={feature.id}>
                          <div className="px-4 py-2 bg-white/[0.02] flex items-center gap-2">
                            <SquareStack size={13} className="text-white/30" />
                            <span className="text-xs font-medium text-white/50">{feature.name}</span>
                            <span className="text-[11px] text-white/20">{featureTasks.length}</span>
                          </div>
                          <div className="divide-y divide-white/5">
                            {featureTasks.map((task) => (
                              <div key={task.id}
                                className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/[0.02] transition-all group/task">
                                <button onClick={() => handleToggleTask(task)} className="shrink-0">
                                  {task.status === "completed" ? (
                                    <CheckCircle2 size={16} className="text-green-400" />
                                  ) : (
                                    <Circle size={16} className="text-white/30 group-hover/task:text-white/50" />
                                  )}
                                </button>
                                <span className={`text-sm flex-1 ${task.status === "completed" ? "text-white/30 line-through" : "text-white/80"}`}>
                                  {task.name}
                                </span>
                                <div className="relative shrink-0">
                                  <button
                                    onClick={() => setTaskMenu(taskMenu === task.id ? null : task.id)}
                                    className="p-1 hover:bg-white/5 rounded text-white/10 hover:text-white/40 opacity-0 group-hover/task:opacity-100 transition-all">
                                    <MoreHorizontal size={13} />
                                  </button>
                                  {taskMenu === task.id && (
                                    <div className="absolute right-0 top-7 w-24 bg-foreground border border-white/10 rounded-lg shadow-xl py-1 z-20">
                                      <button onClick={() => { handleDeleteTask(task.id); setTaskMenu(null) }}
                                        className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-red-400 hover:bg-white/5">
                                        <Trash2 size={11} /> Delete
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </section>
          </div>
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

      {/* Add Task modal */}
      {showAddTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowAddTask(false)} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full max-w-md bg-foreground border border-white/10 rounded-2xl p-6 sm:p-8"
          >
            <button onClick={() => setShowAddTask(false)}
              className="absolute top-4 right-4 p-1.5 hover:bg-white/5 rounded-lg text-white/40 hover:text-white">
              <X size={18} />
            </button>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-white/5 rounded-lg"><ListChecks size={18} /></div>
              <h2 className="text-lg font-semibold">Add Task</h2>
            </div>
            <form onSubmit={handleAddTask} className="space-y-4">
              <div>
                <label className="text-sm text-white/60 mb-1.5 block">Feature</label>
                <select value={newTaskFeature}
                  onChange={(e) => setNewTaskFeature(e.target.value)}
                  className="w-full bg-background border border-white/10 rounded-lg py-2.5 px-4 text-sm text-white focus:outline-none focus:border-white/30 transition-all appearance-none cursor-pointer"
                  required>
                  {features.map((f) => (
                    <option key={f.id} value={f.id} className="bg-foreground">{f.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm text-white/60 mb-1.5 block">Task name</label>
                <input type="text" value={newTaskName}
                  onChange={(e) => setNewTaskName(e.target.value)}
                  placeholder="Implement login endpoint"
                  className="w-full bg-background border border-white/10 rounded-lg py-2.5 px-4 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/30 transition-all" required />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowAddTask(false)}
                  className="flex-1 py-2.5 rounded-lg text-sm border border-white/10 hover:bg-white/5 transition-all">Cancel</button>
                <button type="submit" disabled={creatingTask}
                  className="flex-1 py-2.5 rounded-lg text-sm font-semibold bg-white text-background hover:bg-white/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                  {creatingTask ? (
                    <span className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin" />
                  ) : "Add Task"}
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
