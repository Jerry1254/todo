'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTodo } from '../contexts/TodoContext'

interface AddTodoFormProps {
  isOpen: boolean
  onClose: () => void
  parentId?: string
}

export function AddTodoForm({ isOpen, onClose, parentId }: AddTodoFormProps) {
  const [text, setText] = useState('')
  const [category, setCategory] = useState('')
  const { addTodo, categories } = useTodo()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (text && category) {
      addTodo(text, category, parentId)
      setText('')
      setCategory('')
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{parentId ? '添加子任务' : '添加新任务'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="任务描述"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue placeholder="选择类别" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.name} value={cat.name}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              取消
            </Button>
            <Button type="submit">添加</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

