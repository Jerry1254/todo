'use client'

import { HeartIcon as HeartFill, Briefcase, Brain, Folder } from 'lucide-react'
import { useTodo } from '../contexts/TodoContext'

const categoryIcons = {
  'heart-fill': HeartFill,
  'briefcase': Briefcase,
  'brain': Brain,
  'folder': Folder,
}

export function CategoryGrid() {
  const { categories } = useTodo()

  return (
    <div className="grid grid-cols-2 gap-4 px-4 mb-6">
      {categories.map((category) => {
        const Icon = categoryIcons[category.icon as keyof typeof categoryIcons]
        return (
          <div
            key={category.name}
            className={`${category.color} rounded-xl p-4 flex flex-col gap-2`}
          >
            <Icon className={`w-6 h-6 ${category.textColor} fill-current`} />
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold">{category.count}</span>
              <span className="text-[#908986]">{category.name}</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

