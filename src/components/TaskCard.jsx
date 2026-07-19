import { useDraggable } from "@dnd-kit/react";
import {
  CalendarCheck,
  CheckCircle2,
  Circle,
  MoreHorizontal,
  Trash2,
} from "lucide-react";
import { motion } from "framer-motion";

const TaskCard = ({ task, onDelete, taskMenu, setTaskMenu }) => {
  const { ref, isDragging } = useDraggable({
    id: `task-${task.id}`,
    data: { type: "task", taskId: task.id, status: task.status },
  });

  return (
    <motion.div
      ref={ref}
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-background border border-white/10 rounded-lg p-3 group/task cursor-grab active:cursor-grabbing ${isDragging ? "opacity-50" : ""}`}
    >
      <div className="flex items-center gap-2">
        <CalendarCheck size={17} className="mt-0.5 shrink-0 text-white/70" />
        <span className={`p-3 text-sm flex-1 wrap-break-word text-white/80`}>
          {task.name}
        </span>
        <div className="relative shrink-0">
          <button
            onClick={() => setTaskMenu(taskMenu === task.id ? null : task.id)}
            className="p-1 hover:bg-white/5 rounded text-white/10 hover:text-white/40 opacity-0 group-hover/task:opacity-100 transition-all"
          >
            <MoreHorizontal size={12} />
          </button>
          {taskMenu === task.id && (
            <div className="absolute right-0 top-6 w-24 bg-foreground border border-white/10 rounded-lg shadow-xl py-1 z-20">
              <button
                onClick={() => {
                  onDelete(task.id);
                  setTaskMenu(null);
                }}
                className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-red-400 hover:bg-white/5"
              >
                <Trash2 size={11} /> Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default TaskCard;
