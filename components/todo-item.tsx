'use client'

import { useState, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Plus, Check, X } from 'lucide-react'
import { useTodo } from '../contexts/TodoContext'
import { AddTodoForm } from './add-todo-form'

interface TodoItemProps {
  id: string
  text: string
  category: string
  completed: boolean
  subtasks?: Array<{
    id: string
    text: string
    category: string
    completed: boolean
  }>
}

export function TodoItem({ id, text, category, completed, subtasks }: TodoItemProps) {
  const { toggleTodo, deleteTodo } = useTodo()
  const [showAddSubtask, setShowAddSubtask] = useState(false)
  const [isSliding, setIsSliding] = useState(false)
  const [slideX, setSlideX] = useState(0)
  const touchStart = useRef(0)

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStart.current = e.touches[0].clientX
    setIsSliding(true)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isSliding) return
    const currentX = e.touches[0].clientX
    const diff = currentX - touchStart.current
    // 允许在 -100 到 0 之间滑动
    if (diff <= 0 && diff >= -100) {
      setSlideX(diff)
    } else if (diff > 0 && slideX < 0) {
      // 允许向右滑动，但不超过初始位置
      const newSlideX = slideX + diff/2
      setSlideX(newSlideX > 0 ? 0 : newSlideX)
    }
  }

  const handleTouchEnd = () => {
    setIsSliding(false)
    if (slideX < -50) {
      setSlideX(-100) // 完全展开
    } else {
      setSlideX(0) // 恢复原位
    }
  }

  const handleDelete = () => {
    deleteTodo(id)
  }

  const getCategoryStyle = (category: string) => {
    switch (category.toLowerCase()) {
      case 'health':
        return 'bg-[#7990f8]/10 text-[#7990f8]'
      case 'work':
        return 'bg-[#46cf8b]/10 text-[#46cf8b]'
      case 'mental health':
        return 'bg-[#bc5ead]/10 text-[#bc5ead]'
      default:
        return 'bg-[#d6d6d6] text-[#908986]'
    }
  }

  return (
    <>
      <div className="relative overflow-hidden">
        <div 
          className="flex items-start gap-4 px-4 py-3 border-b border-[#f9f9f9] bg-white"
          style={{ 
            transform: `translateX(${slideX}px)`,
            transition: !isSliding ? 'transform 0.3s ease' : 'none'
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onClick={() => {
            if (slideX < 0) {
              setSlideX(0)
            }
          }}
        >
          <div className="flex flex-col gap-2 flex-1">
            <span className={`text-lg ${completed ? 'line-through text-gray-400' : ''}`}>
              {text}
            </span>
            <div className="flex items-center gap-2">
              <span className={`inline-flex px-2 py-1 rounded-md text-sm font-medium ${getCategoryStyle(category)}`}>
                {category.toUpperCase()}
              </span>
              {!subtasks?.length && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2"
                  onClick={() => setShowAddSubtask(true)}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add subtask
                </Button>
              )}
            </div>
          </div>
          <div 
            className="absolute right-0 top-0 h-full flex items-center gap-1 px-2"
            style={{ transform: `translateX(${slideX + 100}px)` }}
          >
            <Button
              size="sm"
              className="h-10 w-10 bg-green-500 hover:bg-green-600"
              onClick={() => toggleTodo(id)}
            >
              <Check className="w-5 h-5" />
            </Button>
            <Button
              size="sm"
              className="h-10 w-10 bg-red-500 hover:bg-red-600"
              onClick={handleDelete}  // 更改为删除功能
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
      <AddTodoForm
        isOpen={showAddSubtask}
        onClose={() => setShowAddSubtask(false)}
        parentId={id}
      />
    </>
  )
}

