'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { TodoList } from '@/components/todo-list-view'
import { Todo } from '@/types/todo'

export default function HomePage() {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const [todos, setTodos] = useState<Todo[]>([])
  const [status, setStatus] = useState('all')
  const [newTodo, setNewTodo] = useState('')

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login')
    } else if (user) {
      fetch('/api/todos')
        .then((response) => response.json())
        .then((data) => {
          console.log('获取的待办事项:', data)
          // 确保设置的是数组
          const todoArray = Array.isArray(data) ? data : []
          setTodos(todoArray)
        })
        .catch((error) => {
          console.error('获取待办事项失败:', error)
          setTodos([])
        })
    }
  }, [user, isLoading, router])

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus)
  }

  const handleNewTodoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodo(event.target.value)
  }

  const handleAddTodo = async () => {
    if (newTodo.trim() !== '') {
      const currentDate = new Date().toISOString().split('T')[0];
      try {
        const response = await fetch('/api/todos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: newTodo,
            category: 'default',
            date: currentDate,
          }),
        });

        const data = await response.json();
        
        if (!response.ok) {
          console.error('添加待办事项失败:', data.error, data.details);
          alert(`添加待办事项失败: ${data.error}`);
          return;
        }

        console.log('服务器响应:', data);
        setTodos(prev => Array.isArray(prev) ? [...prev, data] : [data]);
        setNewTodo('');
      } catch (error) {
        console.error('添加待办事项时发生错误:', error);
        alert('添加待办事项时发生错误，请查看控制台获取详细信息');
      }
    }
  }

  const handleToggleTodo = (id: string) => {
    const todo = todos.find((t) => t.id === id)
    if (!todo) return

    fetch(`/api/todos/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: !todo.completed }),
    })
      .then((response) => response.json())
      .then((data) => {
        setTodos(prev => 
          Array.isArray(prev) 
            ? prev.map((t) => (t.id === id ? data : t))
            : []
        )
      })
      .catch((error) => console.error('切换待办事项状态失败:', error))
  }

  const handleDeleteTodo = (id: string) => {
    fetch(`/api/todos/${id}`, {
      method: 'DELETE',
    })
      .then(() => {
        setTodos(prev => 
          Array.isArray(prev) 
            ? prev.filter((t) => t.id !== id)
            : []
        )
      })
      .catch((error) => console.error('删除待办事项失败:', error))
  }

  if (isLoading) {
    return <div>加载中...</div>
  }

  if (!user) {
    return null
  }

  const filteredTodos = Array.isArray(todos) 
    ? todos.filter((todo) => {
        if (status === 'all') return true
        if (status === 'active') return !todo.completed
        if (status === 'completed') return todo.completed
        return true
      })
    : []

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          value={newTodo}
          onChange={handleNewTodoChange}
          placeholder="添加新待办事项"
          className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleAddTodo}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          添加
        </button>
      </div>
      <select
        value={status}
        onChange={(e) => handleStatusChange(e.target.value)}
        className="mb-6 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="all">所有</option>
        <option value="active">未完成</option>
        <option value="completed">已完成</option>
      </select>
      <TodoList
        todos={filteredTodos}
        onToggleTodo={handleToggleTodo}
        onDeleteTodo={handleDeleteTodo}
      />
    </div>
  )
}
