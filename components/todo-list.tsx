'use client'

import { useState } from 'react'
import { Header } from './header'
import { CategoryGrid } from './category-grid'
import { TodoItem } from './todo-item'
import { AddButton } from './add-button'
import { AddTodoForm } from './add-todo-form'
import { useTodo } from '../contexts/TodoContext'
import { Button } from "@/components/ui/button"

export function TodoList() {
  const { todos, clearTodos } = useTodo()
  const [showAddTodo, setShowAddTodo] = useState(false)

  return (
    <div className="min-h-screen bg-white pb-20">
      <Header />
      <CategoryGrid />
      {todos.length > 0 && (
        <div className="px-4 mt-4">
          <Button 
            variant="outline" 
            onClick={clearTodos}
            className="text-red-500 hover:text-red-600"
          >
            清空所有任务
          </Button>
        </div>
      )}
      <div className="mt-6">
        {todos.map(todo => (
          <div key={todo.id}>
            <TodoItem
              id={todo.id}
              text={todo.text}
              category={todo.category}
              completed={todo.completed}
              subtasks={todo.subtasks}
            />
            {todo.subtasks?.map(subtask => (
              <div key={subtask.id} className="ml-12">
                <TodoItem
                  id={subtask.id}
                  text={subtask.text}
                  category={subtask.category}
                  completed={subtask.completed}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
      <AddButton onClick={() => setShowAddTodo(true)} />
      <AddTodoForm
        isOpen={showAddTodo}
        onClose={() => setShowAddTodo(false)}
      />
    </div>
  )
}

