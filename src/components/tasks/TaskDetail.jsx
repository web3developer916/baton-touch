import React, { useState } from "react";
import { format, parseISO } from "date-fns";
import { ja } from "date-fns/locale";
import {
  X as XIcon,
  PencilIcon,
  Check as CheckIcon,
  Calendar as CalendarIcon,
  Users as UsersIcon,
  Plus as PlusIcon,
  Play as PlayIcon,
  Search as SearchIcon,
} from "lucide-react";
import { useFamilyStore } from "../../stores/useFamilyStore";

const TaskDetail = ({
  task,
  notes,
  onClose,
  onEdit,
  onToggleCompletion,
  onToggleChecklistItem,
  onDeleteChecklistItem,
  onAddComment,
  onEditComment,
  onDeleteComment,
}) => {
  const [newComment, setNewComment] = useState("");
  const [noteSearchQuery, setNoteSearchQuery] = useState("");
  const [showNoteDropdown, setShowNoteDropdown] = useState(false);
  const familyStore = useFamilyStore();
  const selectedFamily = familyStore.families.find(
    (family) => family.id === familyStore.selectedFamilyId
  );
  // const familyMembers = ['ママ', 'パパ', '祖父母']
  const familyMembers = selectedFamily?.family_members.map((member) => ({
    id: member.id, // IDを追加
    name: member.profiles.name, // 名前を追加
  }));

  const formatDate = (dateString) => {
    return format(parseISO(dateString), "M月d日(E)", { locale: ja });
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

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header flex justify-between items-start">
          <div className="flex-1 pr-16">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => onToggleCompletion(task)}
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                  task.completed
                    ? "border-primary-500 bg-primary-500"
                    : "border-gray-300 hover:border-primary-500"
                }`}
              >
                {task.completed && <CheckIcon className="w-4 h-4 text-white" />}
              </button>
              <h3 className="text-xl font-bold">{task.title}</h3>
            </div>
            <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-x-2 sm:space-y-0 mt-2">
              {task.dueDate && (
                <div className="flex items-center text-sm text-gray-500">
                  <CalendarIcon className="w-4 h-4 mr-1" />
                  {formatDate(task.dueDate)}
                  {task.dueTime && <span>{task.dueTime}</span>}
                </div>
              )}
              <div className="flex items-center space-x-2">
                {task.task_assignees?.length > 0 && (
                  <div className="flex items-center text-sm text-gray-500">
                    <UsersIcon className="w-4 h-4 mr-1" />
                    {task.task_assignees
                      .map((assignee) => assignee.name)
                      .join(", ")}
                  </div>
                )}
                <span
                  className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${getPriorityClass(
                    task.priority
                  )}`}
                >
                  {getPriorityText(task.priority)}
                </span>
              </div>
            </div>
          </div>
          <div className="absolute top-3 right-3 flex items-center space-x-1">
            <button
              onClick={() => onEdit(task)}
              className="p-1.5 text-gray-400 hover:text-primary-500"
            >
              <PencilIcon className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-gray-500"
            >
              <XIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="modal-body">
          {/* チェックリスト */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              チェックリスト
            </h4>
            <div className="space-y-2">
              {task.task_checklist?.map((item) => (
                <div key={item.id} className="flex items-start space-x-2">
                  <input
                    type="checkbox"
                    checked={item.completed}
                    onChange={() => onToggleChecklistItem(task.id, item.id)}
                    className="input mt-1"
                  />
                  <span
                    className={`flex-1 ${
                      item.completed ? "line-through text-gray-400" : ""
                    }`}
                  >
                    {item.text}
                  </span>
                  <button
                    onClick={() => onDeleteChecklistItem(task.id, item.id)}
                    className="p-1 text-gray-400 hover:text-red-500"
                  >
                    <XIcon className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
          {/* 詳細メモ */}
          {/* {task.notes && (
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                詳細メモ
              </h4>
              <p className="whitespace-pre-wrap text-gray-600">{task.notes}</p>
            </div>
          )} */}

          {/* チェックリスト */}
          {/* {task.task_checklist?.length > 0 && (
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-sm font-medium text-gray-700">
                  チェックリスト
                </h4>
                <button
                  onClick={() => {}}
                  className="p-1 text-primary-600 hover:text-primary-700"
                >
                  <PlusIcon className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-2">
                {task.task_checklist.map((item) => (
                  <div key={item.id} className="flex items-start space-x-2">
                    <input
                      type="checkbox"
                      checked={item.completed}
                      onChange={() => onToggleChecklistItem(task.id, item.id)}
                      className="input mt-1"
                    />
                    <span
                      className={`flex-1 ${
                        item.completed ? "line-through text-gray-400" : ""
                      }`}
                    >
                      {item.text}
                    </span>
                    <button
                      onClick={() => onDeleteChecklistItem(task.id, item.id)}
                      className="p-1 text-gray-400 hover:text-red-500"
                    >
                      <XIcon className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )} */}

          {/* 添付ファイル */}
          {task.attachments?.length > 0 && (
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                添付ファイル
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {task.attachments.map((file, index) => (
                  <div key={index} className="relative group">
                    {file.type.startsWith("image/") ? (
                      <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
                        <img
                          src={file.url}
                          alt={file.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : file.type.startsWith("video/") ? (
                      <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
                        <video
                          src={file.url}
                          className="w-full h-full object-cover"
                        />
                        <PlayIcon
                          className="w-8 h-8 text-white absolute top-1/2 left-1/2 
                                       -translate-x-1/2 -translate-y-1/2"
                        />
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 期限と時間 */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">期限</h4>
              <p>{task.dueDate || "未設定"}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">時間</h4>
              <p>{task.dueTime || "未設定"}</p>
            </div>
          </div>

          {/* 担当者 */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 mb-2">担当者</h4>
            <div className="space-y-2">
              {familyMembers.map((member) => (
                <div key={member.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    // taskForm.assignees.some(
                    //   (assignee) => assignee.id === member.id
                    // )
                    checked={task.task_assignees?.some(
                      (assignee) => assignee.user_id === member.id
                    )}
                    readOnly
                    className="input"
                  />
                  <span>{member.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 優先度 */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 mb-2">優先度</h4>
            <p>{getPriorityText(task.priority)}</p>
          </div>

          {/* 詳細メモ */}
          {task.notes && (
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                詳細メモ
              </h4>
              <p className="whitespace-pre-wrap">{task.notes}</p>
            </div>
          )}

          {/* リマインダー */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              リマインダー
            </h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={task.reminder?.beforeDay}
                  readOnly
                  className="input"
                />
                <span>前日に通知</span>
                {task.reminder?.beforeDay && task.reminder?.beforeDayTime && (
                  <span className="text-gray-500">
                    ({task.reminder.beforeDayTime})
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={task.reminder?.onDay}
                  readOnly
                  className="input"
                />
                <span>当日に通知</span>
                {task.reminder?.onDay && task.reminder?.onDayTime && (
                  <span className="text-gray-500">
                    ({task.reminder.onDayTime})
                  </span>
                )}
              </div>
              {/* <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={task.reminder?.beforeHour}
                  readOnly
                  className="input"
                />
                <span>1時間前に通知</span>
              </div> */}
            </div>
          </div>

          {/* コメント */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-700">コメント</h4>
            <div className="space-y-3">
              {task.comments?.map((comment) => (
                <div key={comment.id} className="bg-gray-50 rounded-lg p-3">
                  <div className="flex justify-between items-start">
                    <p className="whitespace-pre-wrap">{comment.text}</p>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onEditComment(comment)}
                        className="p-1 text-gray-400 hover:text-primary-500"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeleteComment(task.id, comment.id)}
                        className="p-1 text-gray-400 hover:text-red-500"
                      >
                        <XIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatDate(comment.createdAt)}
                  </p>
                </div>
              ))}
            </div>
            {/* コメント入力 */}
            <div className="flex items-start space-x-2">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="input flex-1 resize-none"
                rows="2"
                placeholder="コメントを入力..."
              ></textarea>
              <button
                onClick={() => {
                  if (newComment.trim()) {
                    onAddComment(task.id, newComment);
                    setNewComment("");
                  }
                }}
                className="btn btn-primary"
              >
                送信
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetail;
