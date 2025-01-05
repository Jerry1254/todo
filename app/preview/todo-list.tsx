'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Header } from '@/components/header'
import { CategoryGrid } from '@/components/category-grid'
import { TodoItem } from '@/components/todo-item'
import { AddButton } from '@/components/add-button'
import { AddTodoForm } from '@/components/add-todo-form'
import { TodoProvider } from '@/contexts/TodoContext'

interface TodoListProps {
  onLogout: () => void
}

export function TodoList({ onLogout }: TodoListProps) {
  const [showAddTodo, setShowAddTodo] = useState(false)

  return (
    <TodoProvider>
      <div className="min-h-screen bg-white pb-20">
        <Header />
        <CategoryGrid />
        <div className="mt-6">
          <div className="px-4">
            <Button 
              variant="outline" 
              onClick={onLogout}
              className="text-red-500 hover:text-red-600"
            >
              退出登录
            </Button>
          </div>
        </div>
        <AddButton onClick={() => setShowAddTodo(true)} />
        <AddTodoForm
          isOpen={showAddTodo}
          onClose={() => setShowAddTodo(false)}
        />
      </div>
    </TodoProvider>
  )
}

