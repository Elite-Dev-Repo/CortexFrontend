import StatusColumn from "./StatusColumn"

const STATUS_COLUMNS = [
  {
    key: "pending",
    label: "Pending",
    color: "border-t-yellow-500",
    dot: "bg-yellow-400",
  },
  {
    key: "in_progress",
    label: "In Progress",
    color: "border-t-blue-500",
    dot: "bg-blue-400",
  },
  {
    key: "completed",
    label: "Completed",
    color: "border-t-green-500",
    dot: "bg-green-400",
  },
]

const Columns = ({ tasks, onUpdateStatus, onDelete, taskMenu, setTaskMenu }) => {
  return (
    <div className="flex gap-4 h-full min-h-[400px]">
      {STATUS_COLUMNS.map((col) => (
        <StatusColumn
          key={col.key}
          column={col}
          tasks={tasks.filter((t) => t.status === col.key)}
          onUpdateStatus={onUpdateStatus}
          onDelete={onDelete}
          taskMenu={taskMenu}
          setTaskMenu={setTaskMenu}
        />
      ))}
    </div>
  )
}

export default Columns
