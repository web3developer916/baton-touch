import React from "react";
import { format, parseISO, isPast } from "date-fns";
import { ja } from "date-fns/locale";
import {
  Check as CheckIcon,
  Calendar as CalendarIcon,
  Users as UsersIcon,
  Trash as TrashIcon,
} from "lucide-react";

const TaskItem = ({ task, onClick, onCompletion, onDelete }) => {
  console.log(task, "ttt");

  const formatDate = (dateString) => {
    return format(parseISO(dateString), "M月d日(E)", { locale: ja });
  };

  const isOverdue = (task) => {
    if (!task.dueDate || task.completed) return false;
    return isPast(parseISO(task.dueDate));
  };

  const getPriorityClass = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-700";
      case "medium":
        return "bg-yellow-100 text-yellow-700";
      case "low":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getPriorityText = (priority) => {
    switch (priority) {
      case "high":
        return "高";
      case "medium":
        return "中";
      case "low":
        return "低";
      default:
        return "中";
    }
  };

  const getChecklistProgress = (task) => {
    if (!task.checklist?.length) return 0;
    const completed = task.checklist.filter((item) => item.completed).length;
    return Math.round((completed / task.checklist.length) * 100);
  };

  const getCompletedChecklistItems = (task) => {
    return task.checklist?.filter((item) => item.completed).length || 0;
  };

  return (
    <div
      className="group bg-white rounded-lg hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-start p-3 relative">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onCompletion();
          }}
          className={`mt-1 w-5 h-5 rounded-full border-2 flex-shrink-0 transition-colors ${
            task.completed
              ? "border-primary-500 bg-primary-500"
              : "border-gray-300 hover:border-primary-500"
          }`}
        >
          {task.completed && (
            <CheckIcon className="w-3 h-3 text-white m-auto" />
          )}
        </button>

        <div className="flex-1 ml-3">
          <div className="flex items-start justify-between">
            <div>
              <p
                className={`text-gray-900 ${
                  task.completed ? "line-through text-gray-500" : ""
                }`}
              >
                {task.title}
              </p>
              <div className="flex flex-col space-y-1 mt-1">
                {task.dueDate && (
                  <div
                    className={`flex items-center text-sm ${
                      isOverdue(task) ? "text-red-500" : "text-gray-500"
                    }`}
                  >
                    <CalendarIcon className="w-4 h-4 mr-1" />
                    {formatDate(task.dueDate)}
                    {task.dueTime && <span>{task.dueTime}</span>}
                  </div>
                )}
                {task.task_assignees?.length > 0 && (
                  <div className="flex items-center text-sm text-gray-500">
                    <UsersIcon className="w-4 h-4 mr-1" />
                    <span className="mr-2">
                      {task.task_assignees
                        .map((assignee) => assignee.name)
                        .join(", ")}
                    </span>
                    <span className="text-gray-500">優先度:</span>
                    <span
                      className={`ml-1 inline-block px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${getPriorityClass(
                        task.priority
                      )}`}
                    >
                      {getPriorityText(task.priority)}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                className="p-1.5 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* チェックリスト進捗 */}
          {task.task_checklist?.length > 0 && (
            <div className="mt-2">
              <div className="flex items-center space-x-2">
                <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary-500 transition-all"
                    style={{ width: `${getChecklistProgress(task)}%` }}
                  ></div>
                </div>
                <span className="text-xs text-gray-500">
                  {getCompletedChecklistItems(task)}/
                  {task.task_checklist.length}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskItem;
