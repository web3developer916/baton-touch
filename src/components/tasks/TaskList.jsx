import React from 'react'
import TaskItem from './TaskItem'

const TaskList = ({ tasks, onTaskClick, onTaskCompletion, onTaskDelete }) => {
  return (
    <div className="space-y-2">
      {tasks.map(task => (
        <TaskItem
          key={task.id}
          task={task}
          onClick={() => onTaskClick(task)}
          onCompletion={() => onTaskCompletion(task)}
          onDelete={() => onTaskDelete(task.id)}
        />
      ))}
    </div>
  )
}

export default TaskList