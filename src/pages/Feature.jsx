import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Plus, X, ArrowLeft, SquareStack, Trash2, LogOut } from "lucide-react";
import { toast } from "sonner";
import { ACCESS } from "@/lib/constants";
import { getFeature, deleteFeature } from "@/lib/featuresApi";
import { createTask, updateTask, deleteTask } from "@/lib/tasksApi";
import Columns from "@/components/Columns";

const Feature = () => {
  const { uuid, projectUuid, featureUuid } = useParams();
  const navigate = useNavigate();

  const [feature, setFeature] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTaskName, setNewTaskName] = useState("");
  const [creatingTask, setCreatingTask] = useState(false);
  const [taskMenu, setTaskMenu] = useState(null);

  useEffect(() => {
    if (!localStorage.getItem(ACCESS)) {
      navigate("/auth");
      return;
    }
    fetchFeature();
  }, [featureUuid]);

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

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTaskName.trim()) return;
    setCreatingTask(true);
    try {
      const task = await createTask({
        name: newTaskName.trim(),
        feature: featureUuid,
      });
      setTasks((prev) => [...prev, task]);
      setNewTaskName("");
      setShowAddTask(false);
      toast.success("Task added");
    } catch {
      toast.error("Failed to add task");
    } finally {
      setCreatingTask(false);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const updated = await updateTask(taskId, { status: newStatus });
      setTasks((prev) => prev.map((t) => (t.id === taskId ? updated : t)));
    } catch {
      toast.error("Failed to update task");
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await deleteTask(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
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
    localStorage.removeItem(ACCESS);
    localStorage.removeItem("refresh");
    navigate("/auth");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-white flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-white flex flex-col">
      {/* Header */}
      <header className="h-16 border-b border-white/10 flex items-center justify-between px-4 lg:px-8 bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() =>
              navigate(`/workspace/${uuid}/project/${projectUuid}`)
            }
            className="p-2 -ml-2 hover:bg-white/5 rounded-lg shrink-0"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="flex items-center gap-2 min-w-0">
            <SquareStack size={16} className="text-white/40 shrink-0" />
            <h1 className="text-lg font-semibold truncate">{feature?.name}</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {feature?.tags?.length > 0 && (
            <div className="hidden sm:flex items-center gap-1.5">
              {feature.tags.map((tag, ti) => (
                <span
                  key={ti}
                  className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-white/50 font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          <button
            onClick={handleDeleteFeature}
            className="p-2 hover:bg-white/5 rounded-lg text-white/30 hover:text-red-400 transition-all"
          >
            <Trash2 size={16} />
          </button>
          <button
            onClick={handleLogout}
            className="p-2 hover:bg-white/5 rounded-lg text-white/30 hover:text-white/60 transition-all"
          >
            <LogOut size={16} />
          </button>
        </div>
      </header>

      {feature?.description && (
        <div className="px-4 lg:px-8 py-3 border-b border-white/5">
          <p className="text-sm text-white/40">{feature.description}</p>
        </div>
      )}

      {/* Kanban Board */}
      <div className="flex-1 overflow-y-auto p-4 lg:p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider">
            Tasks{" "}
            <span className="text-white/20 font-normal">({tasks.length})</span>
          </h2>
          <button
            onClick={() => setShowAddTask(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-background rounded-lg text-sm font-semibold hover:bg-white/90 transition-all whitespace-nowrap"
          >
            <Plus size={14} /> Add Task
          </button>
        </div>

        <Columns
          tasks={tasks}
          onStatusChange={handleStatusChange}
          onDelete={handleDeleteTask}
          taskMenu={taskMenu}
          setTaskMenu={setTaskMenu}
        />
      </div>

      {/* Add Task Modal */}
      {showAddTask && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-foreground border border-white/10 rounded-xl p-6 w-full max-w-md"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold">New Task</h3>
              <button
                onClick={() => setShowAddTask(false)}
                className="p-1 hover:bg-white/5 rounded-lg text-white/40 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleAddTask} className="space-y-4">
              <input
                autoFocus
                value={newTaskName}
                onChange={(e) => setNewTaskName(e.target.value)}
                placeholder="Task name"
                className="w-full px-3 py-2 bg-background border border-white/10 rounded-lg text-sm text-white placeholder-white/20 focus:outline-none focus:border-white/30"
              />
              <button
                type="submit"
                disabled={creatingTask || !newTaskName.trim()}
                className="w-full py-2 bg-white text-background rounded-lg text-sm font-semibold hover:bg-white/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {creatingTask ? "Adding..." : "Add Task"}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Feature;
