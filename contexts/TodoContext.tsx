'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { v4 as uuidv4 } from 'uuid'

export type Category = {
  name: string
  count: number
  color: string
  textColor: string
  icon: any
}

export type TodoItem = {
  id: string
  text: string
  category: string
  completed: boolean
  date: string // 添加日期
  startTime?: string // 添加开始时间
  duration?: number // 添加持续时间（小时）
  subtasks?: TodoItem[]
}

type TodoContextType = {
  todos: TodoItem[]
  categories: Category[]
  addTodo: (text: string, category: string, parentId?: string) => void
  toggleTodo: (id: string) => void
  updateCategoryCounts: () => void
  clearTodos: () => void
  deleteTodo: (id: string) => void  // 添加删除方法
}

const TodoContext = createContext<TodoContextType | undefined>(undefined)

const initialCategories: Category[] = [
  { name: 'Health', count: 2, color: 'bg-[#7990f8]/10', textColor: 'text-[#7990f8]', icon: 'heart-fill' },
  { name: 'Work', count: 1, color: 'bg-[#46cf8b]/10', textColor: 'text-[#46cf8b]', icon: 'briefcase' },
  { name: 'Mental Health', count: 3, color: 'bg-[#bc5ead]/10', textColor: 'text-[#bc5ead]', icon: 'brain' },
  { name: 'Others', count: 0, color: 'bg-[#d6d6d6]', textColor: 'text-[#908986]', icon: 'folder' },
]

const initialTodos: TodoItem[] = [
  { 
    id: '1', 
    text: '喝八杯水', 
    category: 'Health', 
    completed: false,
    date: '2024-01-04',
    startTime: '06:00',
    duration: 1
  },
  { 
    id: '2', 
    text: '编辑PDF文件', 
    category: 'Work', 
    completed: false,
    date: '2024-01-04',
    startTime: '10:00',
    duration: 4
  },
  { 
    id: '3', 
    text: '写感恩日记', 
    category: 'Mental Health', 
    completed: false,
    date: '2024-01-04',
    startTime: '09:00',
    duration: 1,
    subtasks: [
      { 
        id: '3.1', 
        text: '买一个笔记本', 
        category: 'Mental Health', 
        completed: false,
        date: '2024-01-04',
        startTime: '09:00',
        duration: 1
      }
    ]
  }
]

export function TodoProvider({ children }: { children: ReactNode }) {
  const [todos, setTodos] = useState<TodoItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('todos')
      return saved ? JSON.parse(saved) : initialTodos
    }
    return initialTodos
  })

  const [categories, setCategories] = useState<Category[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('categories')
      return saved ? JSON.parse(saved) : initialCategories
    }
    return initialCategories
  })

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos))
    updateCategoryCounts()
  }, [todos])

  useEffect(() => {
    localStorage.setItem('categories', JSON.stringify(categories))
  }, [categories])

  const addTodo = (text: string, category: string, parentId?: string) => {
    const newTodo = {
      id: uuidv4(),
      text,
      category,
      completed: false,
      date: new Date().toISOString().slice(0, 10), // 添加日期
      startTime: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), // 添加开始时间
      duration: 1 // 添加持续时间
    }

    setTodos(prevTodos => {
      if (!parentId) {
        return [...prevTodos, newTodo]
      }

      return prevTodos.map(todo => {
        if (todo.id === parentId) {
          return {
            ...todo,
            subtasks: [...(todo.subtasks || []), newTodo]
          }
        }
        return todo
      })
    })
  }

  const toggleTodo = (id: string) => {
    setTodos(prevTodos => {
      // 首先找到并更新要切换状态的任务
      const toggleTodoItem = (items: TodoItem[]): TodoItem[] => {
        return items.map(todo => {
          if (todo.id === id) {
            return { ...todo, completed: !todo.completed }
          }
          if (todo.subtasks) {
            return {
              ...todo,
              subtasks: toggleTodoItem(todo.subtasks)
            }
          }
          return todo
        })
      }
    
      const updatedTodos = toggleTodoItem(prevTodos)
    
      // 然后重新排序：未完成的在前，已完成的在后
      return updatedTodos.sort((a, b) => {
        if (a.completed === b.completed) return 0
        return a.completed ? 1 : -1
      })
    })
  }

  const updateCategoryCounts = () => {
    const counts: { [key: string]: number } = {}
    
    const countTodos = (items: TodoItem[]) => {
      items.forEach(todo => {
        if (!todo.completed) { // 只统计未完成的任务
          counts[todo.category] = (counts[todo.category] || 0) + 1
        }
        if (todo.subtasks) {
          countTodos(todo.subtasks)
        }
      })
    }

    countTodos(todos)

    setCategories(prevCategories =>
      prevCategories.map(cat => ({
        ...cat,
        count: counts[cat.name] || 0
      }))
    )
  }

  const clearTodos = () => {
    setTodos([])
    updateCategoryCounts()
  }

  const deleteTodo = (id: string) => {
    setTodos(prevTodos => {
      const deleteTodoItem = (items: TodoItem[]): TodoItem[] => {
        return items.filter(todo => {
          if (todo.id === id) {
            return false
          }
          if (todo.subtasks) {
            todo.subtasks = deleteTodoItem(todo.subtasks)
          }
          return true
        })
      }
      return deleteTodoItem(prevTodos)
    })
  }

  return (
    <TodoContext.Provider value={{ 
      todos, 
      categories, 
      addTodo, 
      toggleTodo, 
      updateCategoryCounts,
      clearTodos,
      deleteTodo  // 添加到 Provider 中
    }}>
      {children}
    </TodoContext.Provider>
  )
}

export const useTodo = () => {
  const context = useContext(TodoContext)
  if (context === undefined) {
    throw new Error('useTodo must be used within a TodoProvider')
  }
  return context
}

