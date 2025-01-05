'use client'

import { Plus } from 'lucide-react'
import { Button } from "@/components/ui/button"

interface AddButtonProps {
  onClick: () => void
}

export function AddButton({ onClick }: AddButtonProps) {
  return (
    <Button
      onClick={onClick}
      className="fixed bottom-6 right-6 w-12 h-12 rounded-xl bg-[#393433] hover:bg-[#393433]/90"
      size="icon"
    >
      <Plus className="w-6 h-6" />
      <span className="sr-only">Add new task</span>
    </Button>
  )
}

