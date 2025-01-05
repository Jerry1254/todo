'use client'

import { useMemo } from 'react'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { useTodo } from '../contexts/TodoContext'
import { motion, AnimatePresence } from "framer-motion"

interface TimelineViewProps {
  selectedDate: Date
}

export function TimelineView({ selectedDate }: TimelineViewProps) {
  const { todos } = useTodo()
  
  const timeSlots = Array.from({ length: 14 }, (_, i) => {
    const hour = i + 6
    return `${hour}:00`
  })

  const todayTodos = useMemo(() => {
    return todos.filter(todo => todo.date === format(selectedDate, 'yyyy-MM-dd'))
  }, [todos, selectedDate])

  const getCategoryStyle = (category: string) => {
    switch (category.toLowerCase()) {
      case 'health':
        return 'bg-[#7990f8]/10'
      case 'work':
        return 'bg-[#46cf8b]/10'
      case 'mental health':
        return 'bg-[#bc5ead]/10'
      default:
        return 'bg-gray-100'
    }
  }

  const getCategoryDotStyle = (category: string) => {
    switch (category.toLowerCase()) {
      case 'health':
        return 'bg-[#7990f8]'
      case 'work':
        return 'bg-[#46cf8b]'
      case 'mental health':
        return 'bg-[#bc5ead]'
      default:
        return 'bg-gray-400'
    }
  }

  return (
    <div className="px-4 mt-6">
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedDate.toISOString()}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          className="space-y-6"
        >
          {timeSlots.map(time => {
            const todoAtTime = todayTodos.find(todo => todo.startTime === time)
            
            return (
              <div key={time} className="flex items-start gap-4">
                <div className="w-16 text-sm text-gray-500">{time}</div>
                {todoAtTime ? (
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`flex-1 p-4 rounded-lg ${getCategoryStyle(todoAtTime.category)}`}
                    style={{ height: `${(todoAtTime.duration || 1) * 80}px` }}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${getCategoryDotStyle(todoAtTime.category)}`} />
                      <span className="text-lg">{todoAtTime.text}</span>
                    </div>
                    <span className="text-sm text-gray-500 ml-4">{todoAtTime.duration}小时</span>
                  </motion.div>
                ) : (
                  <div className="flex-1 border-l-2 border-dashed border-gray-100 h-20" />
                )}
              </div>
            )
          })}
          {todayTodos.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8 text-gray-500"
            >
              今天暂无任务
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

