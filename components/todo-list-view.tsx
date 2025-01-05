'use client'

import { Todo } from '@/types/todo'

interface TodoListProps {
  todos: Todo[]
  onToggleTodo: (id: string) => void
  onDeleteTodo: (id: string) => void
}

export function TodoList({ todos, onToggleTodo, onDeleteTodo }: TodoListProps) {
  return (
    <div className="space-y-4">
      {todos.map((todo) => (
        <div
          key={todo.id}
          className="flex items-center justify-between p-4 bg-white rounded-lg shadow"
        >
          <div className="flex items-center space-x-4">
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => onToggleTodo(todo.id)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span
              className={`${
                todo.completed ? 'line-through text-gray-500' : 'text-gray-900'
              }`}
            >
              {todo.text}
            </span>
          </div>
          <button
            onClick={() => onDeleteTodo(todo.id)}
            className="text-red-500 hover:text-red-700"
          >
            删除
          </button>
        </div>
      ))}
    </div>
  )
}
