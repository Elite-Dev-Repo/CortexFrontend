import { DragDropProvider } from "@dnd-kit/react";
import StatusColumn from "./StatusColumn";

const STATUS_COLUMNS = [
  {
    key: "pending",
    label: "Pending",
    color: "bg-yellow-500",
    dot: "bg-yellow-400",
    border: "border-yellow-500/10",
  },
  {
    key: "in_progress",
    label: "In Progress",
    color: "bg-blue-500",
    dot: "bg-blue-400",
    border: "border-blue-500/10",
  },
  {
    key: "completed",
    label: "Completed",
    color: "bg-green-500",
    dot: "bg-green-400",
    border: "border-green-500/10",
  },
];

const Columns = ({
  tasks,
  onStatusChange,
  onDelete,
  taskMenu,
  setTaskMenu,
}) => {
  const handleDragEnd = (event) => {
    const target = event.operation.target;
    const source = event.operation.source;

    if (!target || !source) return;

    const targetData = target.data;
    const sourceData = source.data;

    if (targetData.type !== "column" || sourceData.type !== "task") return;

    const newStatus = targetData.status;
    if (sourceData.status === newStatus) return;

    onStatusChange(sourceData.taskId, newStatus);
  };

  return (
    <DragDropProvider onDragEnd={handleDragEnd}>
      <div className="flex gap-4 h-full min-h-[400px]">
        {STATUS_COLUMNS.map((col) => (
          <StatusColumn
            key={col.key}
            column={col}
            tasks={tasks.filter((t) => t.status === col.key)}
            onDelete={onDelete}
            taskMenu={taskMenu}
            setTaskMenu={setTaskMenu}
          />
        ))}
      </div>
    </DragDropProvider>
  );
};

export default Columns;
