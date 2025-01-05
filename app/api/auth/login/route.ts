import { NextResponse } from 'next/server'
import bcrypt from 'bcrypt'
import dbConnect from '@/lib/mongodb'
import UserModel from '@/models/User'
import { validateUser } from '@/lib/db'

export async function POST(request: Request) {
  try {
    console.log('开始处理登录请求');
    await dbConnect();
    console.log('数据库连接成功');
    
    const body = await request.json();
    console.log('请求体:', { ...body, password: '***' }); // 隐藏密码
    
    if (!body) {
      console.log('无效的请求数据');
      return NextResponse.json(
        { error: '无效的请求数据' },
        { status: 400 }
      );
    }

    const { username, password } = body;

    if (!username || !password) {
      console.log('用户名或密码为空');
      return NextResponse.json(
        { error: '用户名和密码不能为空' },
        { status: 400 }
      );
    }

    try {
      const user = await validateUser(username, password);
      console.log('用户验证成功:', { ...user, password: '***' });

      // 创建用户会话
      const userSession = {
        id: user.id,
        username: user.username,
        createdAt: user.createdAt,
      };

      // 设置 cookie
      const response = NextResponse.json({ user: userSession });
      response.cookies.set('user', JSON.stringify(userSession), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
      });

      console.log('登录成功，返回响应');
      return response;
    } catch (error) {
      console.error('用户验证失败:', error.message);
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('登录过程中发生错误:', error);
    return NextResponse.json(
      { error: '登录失败，请稍后重试', details: error.message },
      { status: 500 }
    );
  }
}
