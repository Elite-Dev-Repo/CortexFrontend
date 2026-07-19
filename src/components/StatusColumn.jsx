import Tasks from "./Tasks"

const StatusColumn = ({ column, tasks, onUpdateStatus, onDelete, taskMenu, setTaskMenu }) => {
  return (
    <div className={`flex-1 min-w-[250px] bg-foreground border border-white/10 rounded-xl border-t-2 ${column.color} flex flex-col`}>
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${column.dot}`} />
          <span className="text-sm font-medium text-white/80">{column.label}</span>
        </div>
        <span className="text-xs text-white/30">{tasks.length}</span>
      </div>
      <div className="flex-1 p-3 space-y-2 overflow-y-auto">
        <Tasks
          tasks={tasks}
          onUpdateStatus={onUpdateStatus}
          onDelete={onDelete}
          taskMenu={taskMenu}
          setTaskMenu={setTaskMenu}
        />
      </div>
    </div>
  )
}

export default StatusColumn
