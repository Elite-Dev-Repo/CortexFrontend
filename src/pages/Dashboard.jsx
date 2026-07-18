import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Blocks, Plus, Folder, X, LogOut, LayoutDashboard, Menu, Settings, Users, BarChart3 } from "lucide-react"
import { toast } from "sonner"
import { ACCESS } from "@/lib/constants"
import { getWorkspaces, createWorkspace } from "@/lib/workspacesApi"

const Dashboard = () => {
  const navigate = useNavigate()
  const [workspaces, setWorkspaces] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [form, setForm] = useState({ name: "", description: "" })
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem(ACCESS)) {
      navigate("/auth")
      return
    }
    fetchWorkspaces()
  }, [])

  const fetchWorkspaces = async () => {
    try {
      const data = await getWorkspaces()
      setWorkspaces(data)
    } catch {
      toast.error("Failed to load workspaces")
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    setCreating(true)
    try {
      const workspace = await createWorkspace(form)
      setWorkspaces((prev) => [workspace, ...prev])
      setShowCreate(false)
      setForm({ name: "", description: "" })
      toast.success("Workspace created")
    } catch (err) {
      const msg = err.response?.data?.name?.[0] || err.response?.data?.detail || "Failed to create workspace"
      toast.error(msg)
    } finally {
      setCreating(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem(ACCESS)
    localStorage.removeItem("refresh")
    navigate("/auth")
  }

  return (
    <div className="min-h-screen bg-background text-white flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-30 w-64 bg-foreground border-r border-white/10 transform transition-transform duration-200 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } flex flex-col`}
      >
        <div className="flex items-center gap-2 px-6 h-16 border-b border-white/10">
          <Blocks size={22} />
          <span className="tracking-wider font-light">Cortex</span>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <div className="text-[11px] text-white/20 uppercase tracking-wider px-4 mb-2">Main</div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg bg-white/10 text-sm font-medium"
          >
            <LayoutDashboard size={18} />
            Dashboard
          </button>

          {workspaces.length > 0 && (
            <>
              <div className="text-[11px] text-white/20 uppercase tracking-wider px-4 mb-2 mt-4">Workspaces</div>
              {workspaces.slice(0, 5).map((ws) => (
                <button
                  key={ws.id}
                  onClick={() => { navigate(`/workspace/${ws.id}`); setSidebarOpen(false) }}
                  className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm text-white/40 hover:text-white hover:bg-white/5 transition-all"
                >
                  <Folder size={14} />
                  <span className="truncate">{ws.name}</span>
                </button>
              ))}
            </>
          )}

          <div className="text-[11px] text-white/20 uppercase tracking-wider px-4 mb-2 mt-4">General</div>
          <button
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-white/40 hover:text-white hover:bg-white/5 transition-all cursor-not-allowed opacity-50"
            disabled
          >
            <Users size={18} />
            Team
          </button>
          <button
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-white/40 hover:text-white hover:bg-white/5 transition-all cursor-not-allowed opacity-50"
            disabled
          >
            <BarChart3 size={18} />
            Analytics
          </button>
          <button
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-white/40 hover:text-white hover:bg-white/5 transition-all cursor-not-allowed opacity-50"
            disabled
          >
            <Settings size={18} />
            Settings
          </button>
        </nav>

        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/5 transition-all"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0">
        {/* Top bar */}
        <header className="h-16 border-b border-white/10 flex items-center justify-between px-4 lg:px-8 bg-background/80 backdrop-blur-sm sticky top-0 z-10">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 -ml-2 hover:bg-white/5 rounded-lg"
          >
            <Menu size={20} />
          </button>

          <h1 className="text-lg font-semibold hidden sm:block">Dashboard</h1>

          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white text-background rounded-lg text-sm font-semibold hover:bg-white/90 transition-all"
          >
            <Plus size={16} />
            <span className="hidden sm:inline">New Workspace</span>
          </button>
        </header>

        {/* Content */}
        <div className="flex-1 p-4 lg:p-8 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
            </div>
          ) : workspaces.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <Folder size={48} className="text-white/20 mb-4" />
              <h2 className="text-xl font-semibold mb-2">No workspaces yet</h2>
              <p className="text-white/40 text-sm mb-6 max-w-xs">
                Create your first workspace to start organizing your projects.
              </p>
              <button
                onClick={() => setShowCreate(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-white text-background rounded-lg text-sm font-semibold hover:bg-white/90 transition-all"
              >
                <Plus size={16} />
                Create Workspace
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {workspaces.map((ws, i) => (
                <motion.div
                  key={ws.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  className="group bg-foreground border border-white/10 rounded-xl p-5 hover:border-white/20 transition-all cursor-pointer"
                  onClick={() => navigate(`/workspace/${ws.id}`)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="p-2.5 bg-white/5 rounded-lg">
                      <Folder size={20} className="text-white/60" />
                    </div>
                  </div>
                  <h3 className="font-semibold mb-1 truncate">{ws.name}</h3>
                  <p className="text-sm text-white/40 line-clamp-2 mb-3">
                    {ws.description || "No description"}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-white/30">
                    <span>{new Date(ws.created_at).toLocaleDateString()}</span>
                    {ws.projects && (
                      <>
                        <span>·</span>
                        <span>{ws.projects.length} project{ws.projects.length !== 1 ? "s" : ""}</span>
                      </>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create workspace modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowCreate(false)} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full max-w-md bg-foreground border border-white/10 rounded-2xl p-6 sm:p-8"
          >
            <button
              onClick={() => setShowCreate(false)}
              className="absolute top-4 right-4 p-1.5 hover:bg-white/5 rounded-lg text-white/40 hover:text-white"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-white/5 rounded-lg">
                <Plus size={18} />
              </div>
              <h2 className="text-lg font-semibold">Create Workspace</h2>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="text-sm text-white/60 mb-1.5 block">Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  placeholder="My Workspace"
                  className="w-full bg-background border border-white/10 rounded-lg py-2.5 px-4 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/30 transition-all"
                  required
                />
              </div>
              <div>
                <label className="text-sm text-white/60 mb-1.5 block">Description (optional)</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                  placeholder="What's this workspace about?"
                  rows={3}
                  className="w-full bg-background border border-white/10 rounded-lg py-2.5 px-4 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/30 transition-all resize-none"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreate(false)}
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

export default Dashboard
