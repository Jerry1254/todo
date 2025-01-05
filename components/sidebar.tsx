'use client'

import { useState } from 'react'
import { Sheet, SheetContent, SheetHeader } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Menu, Home, Settings, HelpCircle, LogOut } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'

interface SidebarProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function Sidebar({ open, onOpenChange }: SidebarProps) {
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    await logout()
    router.push('/login')
  }

  const menuItems = [
    { icon: Home, label: '首页', onClick: () => router.push('/') },
    { icon: Settings, label: '设置', onClick: () => router.push('/settings') },
    { icon: HelpCircle, label: '帮助', onClick: () => router.push('/help') },
  ]

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <SheetHeader className="pb-6">
          <div className="flex flex-col items-center gap-4 pt-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback>
                {user?.username?.[0]?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="text-center">
              <h2 className="text-xl font-bold">{user?.username || '用户'}</h2>
              <p className="text-sm text-gray-500">Todo App</p>
            </div>
          </div>
        </SheetHeader>
        <div className="space-y-4">
          {menuItems.map((item) => (
            <Button
              key={item.label}
              variant="ghost"
              className="w-full justify-start gap-2"
              onClick={item.onClick}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Button>
          ))}
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 text-red-500 hover:text-red-600 hover:bg-red-50"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
            退出登录
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}

