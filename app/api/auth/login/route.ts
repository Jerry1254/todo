import { NextResponse } from 'next/server'
import { validateUser } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    if (!body) {
      return NextResponse.json(
        { error: '无效的请求数据' },
        { status: 400 }
      )
    }

    const { username, password } = body

    if (!username || !password) {
      return NextResponse.json(
        { error: '用户名和密码不能为空' },
        { status: 400 }
      )
    }

    try {
      const user = await validateUser(username, password)
      return NextResponse.json(user)
    } catch (error) {
      const message = error instanceof Error ? error.message : '未知错误'
      return NextResponse.json(
        { error: message },
        { status: 401 }
      )
    }
  } catch (error) {
    console.error('登录处理失败:', error)
    return NextResponse.json(
      { error: '服务器错误，请稍后重试' },
      { status: 500 }
    )
  }
}

