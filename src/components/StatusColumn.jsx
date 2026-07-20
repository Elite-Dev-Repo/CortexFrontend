import { useDroppable } from "@dnd-kit/react";
import Tasks from "./Tasks";

const StatusColumn = ({ column, tasks, onDelete, taskMenu, setTaskMenu }) => {
  const { ref, isDropTarget } = useDroppable({
    id: `column-${column.key}`,
    data: { type: "column", status: column.key },
  });

  return (
    <div
      ref={ref}
      className={`w-full lg:flex-1 lg:min-w-[250px] border bg-primary ${column.border} rounded-xl flex flex-col transition-all ${isDropTarget ? "ring-2 ring-white/20 bg-white/5" : ""} overflow-hidden`}
    >
      <div
        className={`flex items-center justify-between px-4 py-3 ${column.color}`}
      >
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${column.dot}`} />
          <span className="text-sm font-medium text-white">{column.label}</span>
        </div>
        <span className="text-xs text-white/30">{tasks.length}</span>
      </div>
      <div className="flex-1 p-3 space-y-2 overflow-y-auto">
        <Tasks
          tasks={tasks}
          onDelete={onDelete}
          taskMenu={taskMenu}
          setTaskMenu={setTaskMenu}
        />
      </div>
    </div>
  );
};

export default StatusColumn;
