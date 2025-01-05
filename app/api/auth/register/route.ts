import { NextResponse } from 'next/server'
import { createUser } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log('Register request body:', { ...body, password: '****' });

    const { username, password } = body

    // 验证输入
    if (!username || !password) {
      console.log('Registration failed: Missing username or password');
      return NextResponse.json(
        { error: '用户名和密码不能为空' },
        { status: 400 }
      )
    }

    if (username.length < 3) {
      console.log('Registration failed: Username too short');
      return NextResponse.json(
        { error: '用户名至少需要3个字符' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      console.log('Registration failed: Password too short');
      return NextResponse.json(
        { error: '密码至少需要6个字符' },
        { status: 400 }
      )
    }

    console.log('Creating new user...');
    const user = await createUser(username, password)
    console.log('User created successfully:', { ...user, password: undefined });
    return NextResponse.json(user)
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    )
  }
}
