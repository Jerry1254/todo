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
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [categories, setCategories] = useState<Category[]>(initialCategories);

  // 获取所有待办事项
  const fetchTodos = async () => {
    try {
      const response = await fetch('/api/todos');
      if (!response.ok) {
        throw new Error('获取待办事项失败');
      }
      const data = await response.json();
      setTodos(data);
      updateCategoryCounts();
    } catch (error) {
      console.error('获取待办事项失败:', error);
    }
  };

  // 在组件加载时获取待办事项
  useEffect(() => {
    fetchTodos();
  }, []);

  // 添加待办事项
  const addTodo = async (text: string, category: string, parentId?: string) => {
    try {
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          category,
          date: new Date().toISOString().slice(0, 10),
          startTime: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
          duration: 1,
        }),
      });

      if (!response.ok) {
        throw new Error('添加待办事项失败');
      }

      const newTodo = await response.json();
      setTodos(prevTodos => [...prevTodos, newTodo]);
      updateCategoryCounts();
    } catch (error) {
      console.error('添加待办事项失败:', error);
    }
  };

  // 切换待办事项状态
  const toggleTodo = async (id: string) => {
    try {
      const todo = todos.find(t => t.id === id);
      if (!todo) return;

      const response = await fetch(`/api/todos/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          completed: !todo.completed,
        }),
      });

      if (!response.ok) {
        throw new Error('更新待办事项失败');
      }

      const updatedTodo = await response.json();
      setTodos(prevTodos =>
        prevTodos.map(t => (t.id === id ? updatedTodo : t))
      );
      updateCategoryCounts();
    } catch (error) {
      console.error('更新待办事项失败:', error);
    }
  };

  // 删除待办事项
  const deleteTodo = async (id: string) => {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('删除待办事项失败');
      }

      setTodos(prevTodos => prevTodos.filter(t => t.id !== id));
      updateCategoryCounts();
    } catch (error) {
      console.error('删除待办事项失败:', error);
    }
  };

  const updateCategoryCounts = () => {
    const counts = todos.reduce((acc, todo) => {
      acc[todo.category] = (acc[todo.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    setCategories(prevCategories =>
      prevCategories.map(cat => ({
        ...cat,
        count: counts[cat.name] || 0,
      }))
    );
  };

  const clearTodos = () => {
    setTodos([]);
    updateCategoryCounts();
  };

  return (
    <TodoContext.Provider
      value={{
        todos,
        categories,
        addTodo,
        toggleTodo,
        updateCategoryCounts,
        clearTodos,
        deleteTodo,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
}

export const useTodo = () => {
  const context = useContext(TodoContext)
  if (context === undefined) {
    throw new Error('useTodo must be used within a TodoProvider')
  }
  return context
}
