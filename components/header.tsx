'use client'

import { useState } from 'react'
import { Calendar, Menu } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Sidebar } from './sidebar'

export function Header() {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const today = new Date()
  const date = today.getDate()
  const month = today.toLocaleString('default', { month: 'short' })

  const goToHistory = () => {
    router.push('/history')
  }

  return (
    <header className="px-4 py-6">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-transparent p-0"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu className="h-8 w-8 text-[#908986]" />
        </Button>
        <h1 className="text-4xl font-bold flex items-center gap-2 flex-1 justify-center">
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-transparent p-0"
            onClick={goToHistory}
          >
            <Calendar className="h-8 w-8 text-[#908986]" />
          </Button>
          Today{" "}
          <span 
            className="text-[#908986] cursor-pointer" 
            onClick={goToHistory}
          >
            {date} {month}
          </span>
        </h1>
        <div className="w-8" /> {/* 为了保持标题居中的占位元素 */}
      </div>
      <Sidebar 
        open={sidebarOpen}
        onOpenChange={setSidebarOpen}
      />
    </header>
  )
}

