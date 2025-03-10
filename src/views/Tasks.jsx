import React, { useState, useEffect } from "react";
import { useTaskStore } from "../stores/useTaskStore";
import { useNoteStore } from "../stores/useNoteStore";
import { Plus as PlusIcon } from "lucide-react";
import HeaderNotification from "../components/common/HeaderNotification";
import TaskList from "../components/tasks/TaskList";
import TaskForm from "../components/tasks/TaskForm";
import TaskDetail from "../components/tasks/TaskDetail";

const Tasks = () => {
  const taskStore = useTaskStore();
  const noteStore = useNoteStore();
  const filters = taskStore.filters;
  const updateFilter = taskStore.updateFilter;
  const toggleTaskCompletion = taskStore.toggleTaskCompletion;
  // const sortedTasks = taskStore.sortedTasks;
  const task = taskStore.tasks;
  const notes = noteStore.notes || [];
  const [showNewTaskForm, setShowNewTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [activeTab, setActiveTab] = useState("incomplete");
  const [sortedTasks, setSortedTasks] = useState(taskStore.tasks);
  // useEffect(() => {
  //   setSortedTasks(taskStore.sortedTasks);
  // }, [taskStore.sortedTasks]);

  console.log(task, "sortedTasks");

  // タブの状態に応じてフィルターを更新
  React.useEffect(() => {
    updateFilter("status", activeTab);
  }, [activeTab]);

  const editTask = (task) => {
    setEditingTask(task);
    setShowNewTaskForm(true);
    setSelectedTask(null);
  };

  const deleteTask = (id) => {
    if (confirm("このタスクを削除してもよろしいですか？")) {
      taskStore.deleteTask(id);
      setSelectedTask(null);
    }
  };

  const saveTask = (taskData) => {
    const processedData = {
      ...taskData,
      checklist:
        taskData.checklist.length > 0
          ? taskData.checklist
              .filter((item) =>
                typeof item === "string" ? item.trim() : item.text
              )
              .map((item) => {
                if (typeof item === "string") {
                  return {
                    id: Date.now() + Math.random(),
                    text: item,
                    completed: false,
                  };
                }
                return item;
              })
          : [],
    };

    console.log(processedData, "Task saved");
    if (editingTask) {
      taskStore.updateTask(editingTask.id, processedData);
    } else {
      taskStore.addTask(processedData);
    }
    setSortedTasks(taskStore.sortedTasks);
    setShowNewTaskForm(false);
    setEditingTask(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-100 z-10">
        <div className="max-w-3xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between relative">
            <div className="w-10"></div>
            <h1 className="text-base font-medium">タスク</h1>
            <div>
              <HeaderNotification />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 pt-20 pb-24">
        {/* フィルターバー */}
        <div className="flex space-x-2 overflow-x-auto pb-4">
          <select
            value={filters.dueDate}
            onChange={(e) => updateFilter("dueDate", e.target.value)}
            className="input py-1 pl-2 pr-8 text-sm"
          >
            <option value="all">すべての期限</option>
            <option value="today">今日まで</option>
            <option value="week">今週まで</option>
            <option value="overdue">期限超過</option>
          </select>
          <select
            value={filters.assignee}
            onChange={(e) => updateFilter("assignee", e.target.value)}
            className="input py-1 pl-2 pr-8 text-sm"
          >
            <option value="all">すべての担当者</option>
            <option value="ママ">ママ</option>
            <option value="パパ">パパ</option>
            <option value="祖父母">祖父母</option>
          </select>
          <select
            value={filters.priority}
            onChange={(e) => updateFilter("priority", e.target.value)}
            className="input py-1 pl-2 pr-8 text-sm"
          >
            <option value="all">すべての優先度</option>
            <option value="high">高</option>
            <option value="medium">中</option>
            <option value="low">低</option>
          </select>
        </div>

        {/* タブ切り替え */}
        <div className="flex items-center space-x-4 mb-4">
          <button
            onClick={() => setActiveTab("incomplete")}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              activeTab === "incomplete"
                ? "bg-primary-100 text-primary-700"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            未完了
          </button>
          <button
            onClick={() => setActiveTab("completed")}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              activeTab === "completed"
                ? "bg-primary-100 text-primary-700"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            完了済み
          </button>
        </div>

        {/* タスクリスト */}
        <TaskList
          tasks={task}
          onTaskClick={setSelectedTask}
          onTaskCompletion={toggleTaskCompletion}
          onTaskDelete={deleteTask}
        />

        {/* 新規タスク追加ボタン */}
        <button
          onClick={() => setShowNewTaskForm(true)}
          className="fixed bottom-24 right-4 w-14 h-14 bg-primary-500 rounded-full shadow-lg
                         flex items-center justify-center text-white hover:bg-primary-600
                         hover:scale-105 active:scale-95 transition-all"
        >
          <PlusIcon className="w-6 h-6" />
        </button>

        {/* タスク編集モーダル */}
        {showNewTaskForm && (
          <TaskForm
            initialData={editingTask}
            notes={notes}
            onSave={saveTask}
            onCancel={() => {
              setShowNewTaskForm(false);
              setEditingTask(null);
            }}
          />
        )}

        {/* タスク詳細モーダル */}
        {selectedTask && (
          <TaskDetail
            task={selectedTask}
            onClose={() => setSelectedTask(null)}
            onEdit={editTask}
            onToggleCompletion={toggleTaskCompletion}
            onToggleChecklistItem={taskStore.toggleChecklistItem}
            onDeleteChecklistItem={taskStore.deleteChecklistItem}
            onAddComment={taskStore.addComment}
            onEditComment={(comment) => {
              const newText = prompt("コメントを編集", comment.text);
              if (newText !== null) {
                taskStore.updateComment(selectedTask.id, comment.id, newText);
              }
            }}
            onDeleteComment={taskStore.deleteComment}
          />
        )}
      </main>
    </div>
  );
};

export default Tasks;
