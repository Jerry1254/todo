'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import type { User, AuthState } from '@/types/auth'
import { useToast } from "@/components/ui/use-toast"

interface AuthContextType extends AuthState {
  login: (username: string, password: string) => Promise<void>
  register: (username: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true
  })
  const { toast } = useToast()

  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      try {
        setState({
          user: JSON.parse(savedUser),
          isLoading: false
        })
      } catch (error) {
        console.error('Failed to parse saved user:', error)
        localStorage.removeItem('user')
        setState({ user: null, isLoading: false })
      }
    } else {
      setState(prev => ({ ...prev, isLoading: false }))
    }
  }, [])

  const login = async (username: string, password: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || '登录失败，请稍后重试')
      }

      if (!data.id || !data.username) {
        throw new Error('服务器返回的用户数据无效')
      }

      localStorage.setItem('user', JSON.stringify(data))
      setState({ user: data, isLoading: false })
      
      toast({
        title: "登录成功",
        description: `欢迎回来，${data.username}！`
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : '登录失败，请稍后重试'
      toast({
        variant: "destructive",
        title: "登录失败",
        description: message
      })
      throw error
    }
  }

  const register = async (username: string, password: string) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || '注册失败，请稍后重试')
      }

      if (!data.id || !data.username) {
        throw new Error('服务器返回的用户数据无效')
      }

      localStorage.setItem('user', JSON.stringify(data))
      setState({ user: data, isLoading: false })
      
      toast({
        title: "注册成功",
        description: `欢迎，${data.username}！`
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : '注册失败，请稍后重试'
      toast({
        variant: "destructive",
        title: "注册失败",
        description: message
      })
      throw error
    }
  }

  const logout = async () => {
    localStorage.removeItem('user')
    setState({ user: null, isLoading: false })
    toast({
      title: "已退出登录",
      description: "期待您的再次访问！"
    })
  }

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

