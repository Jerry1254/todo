import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // 检查是否是 API 请求
  if (request.nextUrl.pathname.startsWith('/api')) {
    // 跳过认证路由
    if (request.nextUrl.pathname.startsWith('/api/auth')) {
      return NextResponse.next()
    }

    // 从 cookie 获取用户信息
    const user = request.cookies.get('user')
    if (!user) {
      return NextResponse.json(
        { error: '未登录' },
        { status: 401 }
      )
    }
  }

  return NextResponse.next()
}
