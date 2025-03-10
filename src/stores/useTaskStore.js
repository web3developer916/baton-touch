import { create } from "zustand";
import { persist } from "zustand/middleware";
import { supabase } from "../lib/supabase";

export const useTaskStore = create(
  persist(
    (set, get) => ({
      tasks: [],
      filters: {
        status: "incomplete",
        dueDate: "all",
        assignee: "all",
        priority: "all",
      },
      loading: false,
      error: null,

      // フィルターの更新
      updateFilter: (key, value) =>
        set((state) => ({
          filters: { ...state.filters, [key]: value },
        })),

      // タスク一覧を取得
      fetchTasks: async (familyGroupId) => {
        try {
          set({ loading: true, error: null });
          const { data, error } = await supabase
            .from("tasks")
            .select(
              `
              *,
               task_assignees (
                user_id,
                name
              ),
              task_checklist (
                id,
                text,
                completed
              )
            `
            )
            .eq("family_group_id", familyGroupId)
            .order("created_at", { ascending: false });

          if (error) throw error;

          set({
            tasks: data,
            loading: false,
          });
        } catch (error) {
          console.error("Error fetching tasks:", error);
          set({
            error: error.message,
            loading: false,
          });
        }
      },

      // タスクを追加
      addTask: async (taskData) => {
        try {
          console.log(taskData, "taskData");

          set({ loading: true, error: null });

          // 日付のバリデーション
          const taskFields = {
            title: taskData.title,
            notes: taskData.notes,
            priority: taskData.priority,
            family_group_id: taskData.familyGroupId,
            created_by: taskData.userId,
            attachments: taskData.attachments,
            reminder: taskData.reminder,
            linkedNoteIds: taskData.linkedNoteIds,
          };

          // 期限日が設定されている場合のみ追加
          if (taskData.dueDate?.trim()) {
            taskFields.dueDate = taskData.dueDate;
          }

          // 時間が設定されている場合のみ追加
          if (taskData.dueTime?.trim()) {
            taskFields.dueTime = taskData.dueTime;
          }

          // タスクを作成
          const { data: task, error: taskError } = await supabase
            .from("tasks")
            .insert([taskFields])
            .select()
            .single();

          if (taskError) throw taskError;

          // 担当者を追加
          if (taskData.assignees?.length) {
            const { error: assigneeError } = await supabase
              .from("task_assignees")
              .insert(
                taskData.assignees.map((assignee) => ({
                  task_id: task.id,
                  user_id: assignee.user_id,
                  name: assignee.name,
                }))
              );
            if (assigneeError) throw assigneeError;
          }

          // チェックリストを追加
          if (taskData.checklist?.length) {
            const { error: checklistError } = await supabase
              .from("task_checklist")
              .insert(
                taskData.checklist.map((item) => ({
                  task_id: task.id,
                  text: item.text,
                  completed: item.completed || false,
                }))
              );
            if (checklistError) throw checklistError;
          }

          // 最新のタスク情報を取得;
          const { data: updatedTask, error: fetchError } = await supabase
            .from("tasks")
            .select(
              `
              *,
              task_assignees (
                user_id,
                name
              ),
              task_checklist (
                id,
                text,
                completed
              )
            `
            )
            .eq("id", task.id)
            .single();

          if (fetchError) throw fetchError;

          set((state) => ({
            tasks: [updatedTask, ...state.tasks],
            loading: false,
          }));
        } catch (error) {
          console.error("Error adding task:", error);
          set({
            error: error.message,
            loading: false,
          });
        }
      },

      // タスクを更新
      updateTask: async (taskId, updates) => {
        try {
          set({ loading: true, error: null });
          // タスクを更新
          const { error: taskError } = await supabase
            .from("tasks")
            .update({
              title: updates.title,
              notes: updates.notes,
              dueDate: updates.dueDate,
              dueTime: updates.dueTime,
              priority: updates.priority,
              status: updates.status,
              attachments: updates.attachments,
              reminder: updates.reminder,
              linkedNoteIds: updates.linkedNoteIds,
              family_group_id: updates.familyGroupId,
              created_by: updates.userId,
            })
            .eq("id", taskId);

          if (taskError) throw taskError;

          // 担当者を更新
          if (updates.assignees) {
            // 既存の担当者を削除
            const { error: deleteError } = await supabase
              .from("task_assignees")
              .delete()
              .eq("task_id", taskId);

            if (deleteError) throw deleteError;

            // 新しい担当者を追加
            if (updates.assignees.length > 0) {
              const { error: assigneeError } = await supabase
                .from("task_assignees")
                .insert(
                  updates.assignees.map((assignee) => ({
                    task_id: taskId,
                    user_id: assignee.user_id,
                    name: assignee.name,
                  }))
                );
              if (assigneeError) throw assigneeError;
            }
          }

          // チェックリストを更新
          if (updates.checklist) {
            // 既存のチェックリストを削除
            const { error: deleteError } = await supabase
              .from("task_checklist")
              .delete()
              .eq("task_id", taskId);

            if (deleteError) throw deleteError;

            // 新しいチェックリストを追加
            if (updates.checklist.length > 0) {
              const { error: checklistError } = await supabase
                .from("task_checklist")
                .insert(
                  updates.checklist.map((item) => ({
                    task_id: taskId,
                    text: item.text,
                    completed: item.completed || false,
                  }))
                );
              if (checklistError) throw checklistError;
            }
          }

          // 最新のタスク情報を取得
          const { data: updatedTask, error: fetchError } = await supabase
            .from("tasks")
            .select(
              `
              *,
              task_assignees (
                user_id,
                name
              ),
              task_checklist (
                id,
                text,
                completed
              )
            `
            )
            .eq("id", taskId)
            .single();

          if (fetchError) throw fetchError;

          set((state) => ({
            tasks: state.tasks.map((task) =>
              task.id === taskId ? updatedTask : task
            ),
            loading: false,
          }));
        } catch (error) {
          console.error("Error updating task:", error);
          set({
            error: error.message,
            loading: false,
          });
        }
      },

      // タスクを削除
      deleteTask: async (taskId) => {
        try {
          set({ loading: true, error: null });
          const { error } = await supabase
            .from("tasks")
            .delete()
            .eq("id", taskId);

          if (error) throw error;

          set((state) => ({
            tasks: state.tasks.filter((task) => task.id !== taskId),
            loading: false,
          }));
        } catch (error) {
          console.error("Error deleting task:", error);
          set({
            error: error.message,
            loading: false,
          });
        }
      },

      // チェックリストアイテムの完了状態を切り替え
      toggleChecklistItem: async (taskId, itemId) => {
        try {
          const item = get()
            .tasks.find((t) => t.id === taskId)
            ?.task_checklist.find((i) => i.id === itemId);

          if (!item) return;

          const { error } = await supabase
            .from("task_checklist")
            .update({ completed: !item.completed })
            .eq("id", itemId);

          if (error) throw error;

          set((state) => ({
            tasks: state.tasks.map((task) => {
              if (task.id === taskId) {
                return {
                  ...task,
                  task_checklist: task.task_checklist.map((item) =>
                    item.id === itemId
                      ? { ...item, completed: !item.completed }
                      : item
                  ),
                };
              }
              return task;
            }),
          }));
        } catch (error) {
          console.error("Error toggling checklist item:", error);
        }
      },

      // フィルター適用後のタスク
      get filteredTasks() {
        const state = get();
        const { tasks, filters } = state;
        console.log(tasks, "tasks");

        const { status } = filters;

        return tasks.filter((task) => {
          // ステータスでフィルター
          if (status === "completed" && task.status !== "completed")
            return false;
          if (status === "incomplete" && task.status === "completed")
            return false;

          // 期限でフィルター
          if (filters.dueDate !== "all" && task.due_date) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const dueDate = new Date(task.due_date);
            dueDate.setHours(0, 0, 0, 0);

            if (filters.dueDate === "today" && dueDate > today) return false;
            if (filters.dueDate === "week") {
              const weekLater = new Date(today);
              weekLater.setDate(weekLater.getDate() + 7);
              if (dueDate > weekLater) return false;
            }
            if (filters.dueDate === "overdue" && dueDate >= today) return false;
          }

          // 担当者でフィルター
          if (
            filters.assignee !== "all" &&
            !task.task_assignees?.some((a) => a.user_id === filters.assignee)
          ) {
            return false;
          }

          // 優先度でフィルター
          if (
            filters.priority !== "all" &&
            task.priority !== filters.priority
          ) {
            return false;
          }

          return true;
        });
      },

      // タスクの並び替え
      get sortedTasks() {
        const state = get();
        const filteredTasks = state.filteredTasks;

        return [...filteredTasks].sort((a, b) => {
          // 完了済みタスクは後ろに
          if (a.status !== b.status) {
            return a.status === "completed" ? 1 : -1;
          }

          // 優先度順
          const priorityOrder = { high: 0, medium: 1, low: 2 };
          if (a.priority !== b.priority) {
            return priorityOrder[a.priority] - priorityOrder[b.priority];
          }

          // 期限順
          if (a.due_date && b.due_date) {
            return new Date(a.due_date) - new Date(b.due_date);
          }
          return 0;
        });
      },
    }),
    {
      name: "task-store",
    }
  )
);
