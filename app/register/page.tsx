'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from "@/components/ui/use-toast"

export default function RegisterPage() {
  const router = useRouter()
  const { register } = useAuth()
  const { toast } = useToast()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const validateForm = () => {
    console.log('Validating form...', { username, password, confirmPassword });
    
    if (!username) {
      console.log('Validation failed: Username is empty');
      toast({
        variant: "destructive",
        title: "验证失败",
        description: "请输入用户名"
      })
      return false
    }

    if (username.length < 3) {
      console.log('Validation failed: Username too short');
      toast({
        variant: "destructive",
        title: "验证失败",
        description: "用户名至少需要3个字符"
      })
      return false
    }

    if (!password) {
      console.log('Validation failed: Password is empty');
      toast({
        variant: "destructive",
        title: "验证失败",
        description: "请输入密码"
      })
      return false
    }

    if (password.length < 6) {
      console.log('Validation failed: Password too short');
      toast({
        variant: "destructive",
        title: "验证失败",
        description: "密码至少需要6个字符"
      })
      return false
    }

    if (password !== confirmPassword) {
      console.log('Validation failed: Passwords do not match');
      toast({
        variant: "destructive",
        title: "验证失败",
        description: "两次输入的密码不一致"
      })
      return false
    }

    console.log('Form validation passed');
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    console.log('Form submitted');
    e.preventDefault()
    if (!validateForm()) {
      console.log('Form validation failed');
      return
    }

    console.log('Starting registration...');
    setIsLoading(true)
    try {
      await register(username, password)
      console.log('Registration successful');
      router.push('/')
    } catch (error) {
      console.error('Registration failed:', error)
      toast({
        variant: "destructive",
        title: "注册失败",
        description: error instanceof Error ? error.message : "注册失败，请稍后重试"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white px-4 py-12">
      <div className="max-w-md mx-auto space-y-8">
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          返回
        </button>

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
            />
          </div>

          <div className="space-y-2">
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="请输入密码"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
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
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
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
