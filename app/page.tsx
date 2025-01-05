'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { TodoList } from '@/components/todo-list' // Updated import path

export default function HomePage() {
  const router = useRouter()
  const { user, isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login')
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return <div>加载中...</div>
  }

  if (!user) {
    return null
  }

  return <TodoList />
}

