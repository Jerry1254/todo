'use client'

import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff } from 'lucide-react'
import { useToast } from "@/components/ui/use-toast"

interface RegisterPageProps {
  onSuccess: () => void
}

export function RegisterPage({ onSuccess }: RegisterPageProps) {
  const { toast } = useToast()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!username.trim()) {
      toast({
        variant: "destructive",
        title: "验证失败",
        description: "请输入用户名"
      })
      return
    }

    if (username.length < 3) {
      toast({
        variant: "destructive",
        title: "验证失败",
        description: "用户名至少需要3个字符"
      })
      return
    }

    if (!password.trim()) {
      toast({
        variant: "destructive",
        title: "验证失败",
        description: "请输入密码"
      })
      return
    }

    if (password.length < 6) {
      toast({
        variant: "destructive",
        title: "验证失败",
        description: "密码至少需要6个字符"
      })
      return
    }

    if (password !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "验证失败",
        description: "两次输入的密码不一致"
      })
      return
    }

    setIsLoading(true)
    // 模拟注册
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    toast({
      title: "注册成功",
      description: "欢迎加入！"
    })
    onSuccess()
    setIsLoading(false)
  }

  return (
    <div className="bg-gradient-to-b from-blue-50 to-white p-8 rounded-lg">
      <div className="max-w-md mx-auto space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">用户注册</h1>
          <p className="text-gray-500">注册一个账号继续！</p>
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

          <div className="space-y-2">
            <div className="relative">
              <Input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="请再次输入密码"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                disabled={isLoading}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700"
            disabled={isLoading}
          >
            {isLoading ? '注册中...' : '注册'}
          </Button>
        </form>
      </div>
    </div>
  )
}

