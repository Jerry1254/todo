'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LoginPage } from './login'
import { RegisterPage } from './register'
import { TodoList } from './todo-list'
import { AuthProvider } from '@/contexts/AuthContext'
import { TodoProvider } from '@/contexts/TodoContext'
import { Toaster } from "@/components/ui/toaster"

export default function PreviewPage() {
  const [loggedIn, setLoggedIn] = useState(false)
  
  if (loggedIn) {
    return (
      <>
        <TodoList onLogout={() => setLoggedIn(false)} />
        <Toaster />
      </>
    )
  }

  return (
    <AuthProvider>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">预览窗口</h1>
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="login">登录页面</TabsTrigger>
            <TabsTrigger value="register">注册页面</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <LoginPage onSuccess={() => setLoggedIn(true)} />
          </TabsContent>
          <TabsContent value="register">
            <RegisterPage onSuccess={() => setLoggedIn(true)} />
          </TabsContent>
        </Tabs>
      </div>
      <Toaster />
    </AuthProvider>
  )
}

