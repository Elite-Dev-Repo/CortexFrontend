import TaskCard from "./TaskCard"

const Tasks = ({ tasks, onDelete, taskMenu, setTaskMenu }) => {
  if (tasks.length === 0) {
    return (
      <div className="flex items-center justify-center h-20 text-xs text-white/20">
        No tasks
      </div>
    )
  }
  return (
    <>
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onDelete={onDelete}
          taskMenu={taskMenu}
          setTaskMenu={setTaskMenu}
        />
      ))}
    </>
  )
}

export default Tasks
