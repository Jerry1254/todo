'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from "@/components/ui/use-toast"

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const { toast } = useToast()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const validateForm = () => {
    if (!username.trim()) {
      toast({
        variant: "destructive",
        title: "验证失败",
        description: "请输入用户名"
      })
      return false
    }

    if (!password.trim()) {
      toast({
        variant: "destructive",
        title: "验证失败",
        description: "请输入密码"
      })
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsLoading(true)
    try {
      await login(username.trim(), password.trim())
      router.push('/')
    } catch (error) {
      console.error('登录失败:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white px-4 py-12">
      <div className="max-w-md mx-auto space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">欢迎登录</h1>
          <p className="text-gray-500">请输入您的用户名和密码</p>
          <p className="text-sm text-gray-400">测试账号: test / 密码: 123456</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              type="text"
              placeholder="请输入用户名"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="请输入密码"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                disabled={isLoading}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                disabled={isLoading}
              />
              <label
                htmlFor="remember"
                className="text-sm text-gray-500 cursor-pointer"
              >
                记住我
              </label>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700"
            disabled={isLoading}
          >
            {isLoading ? '登录中...' : '登录'}
          </Button>
        </form>

        <div className="text-center text-sm text-gray-500">
          没有账号?{' '}
          <Link href="/register" className="text-blue-600 hover:text-blue-800">
            注册
          </Link>
        </div>
      </div>
    </div>
  )
}

