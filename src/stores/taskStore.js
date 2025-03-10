import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { format } from 'date-fns'

const dummyTasks = [
  {
    id: 1,
    title: '離乳食の準備',
    dueDate: '2024-02-16',
    dueTime: '10:00',
    assignees: ['ママ'],
    priority: 'high',
    completed: false,
    checklist: [
      { id: 1, text: '野菜を茹でる', completed: false },
      { id: 2, text: 'ミキサーにかける', completed: false }
    ],
    comments: []
  }
]

export const useTaskStore = defineStore('task', () => {
  const tasks = ref(dummyTasks)
  const taskFilters = ref({
    status: 'all', // all, incomplete, completed
    dueDate: 'all', // all, today, week, overdue, または特定の日付 (yyyy-MM-dd)
    assignee: 'all',
    priority: 'all' // all, high, medium, low
  })

  // タスクの追加
  function addTask(task) {
    tasks.value.push({
      id: Date.now(),
      createdAt: new Date().toISOString(),
      status: 'incomplete',
      comments: [],
      checklist: task.checklist?.map(item => ({
        id: Date.now() + Math.random(),
        text: item,
        completed: false
      })) || [],
      attachments: task.attachments || [], 
      ...task
    })
  }

  // タスクの更新
  function updateTask(taskId, updates) {
    const index = tasks.value.findIndex(t => t.id === taskId)
    if (index !== -1) {
      tasks.value[index] = {
        ...tasks.value[index],
        ...updates,
        updatedAt: new Date().toISOString()
      }
    }
  }

  // タスクの削除
  function deleteTask(taskId) {
    tasks.value = tasks.value.filter(t => t.id !== taskId)
  }

  // チェックリストアイテムの追加
  function addChecklistItem(taskId, text) {
    const task = tasks.value.find(t => t.id === taskId)
    if (task) {
      task.checklist.push({
        id: Date.now(),
        text,
        completed: false
      })
    }
  }

  // チェックリストアイテムの更新
  function updateChecklistItem(taskId, itemId, updates) {
    const task = tasks.value.find(t => t.id === taskId)
    if (task) {
      const item = task.checklist.find(i => i.id === itemId)
      if (item) {
        Object.assign(item, updates)
      }
    }
  }

  // チェックリストアイテムの削除
  function deleteChecklistItem(taskId, itemId) {
    const task = tasks.value.find(t => t.id === taskId)
    if (task) {
      task.checklist = task.checklist.filter(i => i.id !== itemId)
    }
  }

  // コメントの追加
  function addComment(taskId, comment) {
    const task = tasks.value.find(t => t.id === taskId)
    if (task) {
      task.comments.push({
        id: Date.now(),
        text: comment,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
    }
  }

  // コメントの更新
  function updateComment(taskId, commentId, text) {
    const task = tasks.value.find(t => t.id === taskId)
    if (task) {
      const comment = task.comments.find(c => c.id === commentId)
      if (comment) {
        comment.text = text
        comment.updatedAt = new Date().toISOString()
      }
    }
  }

  // コメントの削除
  function deleteComment(taskId, commentId) {
    const task = tasks.value.find(t => t.id === taskId)
    if (task) {
      task.comments = task.comments.filter(c => c.id !== commentId)
    }
  }

  // フィルター適用後のタスク
  const filteredTasks = computed(() => {
    return tasks.value.filter(task => {
      // ステータスでフィルター
      if (taskFilters.value.status !== 'all') {
        if (taskFilters.value.status === 'completed' && !task.completed) return false
        if (taskFilters.value.status === 'incomplete' && task.completed) return false
      }

      // 期限でフィルター
      if (taskFilters.value.dueDate !== 'all') {
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const dueDate = new Date(task.dueDate)
        dueDate.setHours(0, 0, 0, 0)

        if (taskFilters.value.dueDate === 'today' && dueDate > today) return false
        if (taskFilters.value.dueDate === 'week') {
          const weekLater = new Date(today)
          weekLater.setDate(weekLater.getDate() + 7)
          if (dueDate > weekLater) return false
        } else if (taskFilters.value.dueDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
          // 特定の日付が指定されている場合
          return format(dueDate, 'yyyy-MM-dd') === taskFilters.value.dueDate
        }
        if (taskFilters.value.dueDate === 'overdue' && dueDate >= today) return false
      }

      // 担当者でフィルター
      if (taskFilters.value.assignee !== 'all' && 
          !task.assignees.includes(taskFilters.value.assignee)) {
        return false
      }

      // 優先度でフィルター
      if (taskFilters.value.priority !== 'all' && 
          task.priority !== taskFilters.value.priority) {
        return false
      }

      return true
    })
  })

  // タスクの並び替え
  const sortedTasks = computed(() => {
    return [...filteredTasks.value].sort((a, b) => {
      // 完了済みタスクは後ろに
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1
      }
      
      // 優先度順
      const priorityOrder = { high: 0, medium: 1, low: 2 }
      if (a.priority !== b.priority) {
        return priorityOrder[a.priority] - priorityOrder[b.priority]
      }
      
      // 期限順
      return new Date(a.dueDate) - new Date(b.dueDate)
    })
  })

  return {
    tasks,
    taskFilters,
    filteredTasks,
    sortedTasks,
    addTask,
    updateTask,
    deleteTask,
    addChecklistItem,
    updateChecklistItem,
    deleteChecklistItem,
    addComment,
    updateComment,
    deleteComment
  }
})