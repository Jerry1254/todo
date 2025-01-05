import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import TodoModel from '@/models/Todo'
import { getSession } from '@/lib/session'

// 获取所有 todos
export async function GET(request: Request) {
  try {
    await dbConnect()
    const session = await getSession()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: '未登录' },
        { status: 401 }
      )
    }

    const todos = await TodoModel.find({ userId: session.user.id })
    return NextResponse.json(todos)
  } catch (error) {
    console.error('获取todos失败:', error)
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    )
  }
}

// 创建新 todo
export async function POST(request: Request) {
  try {
    console.log('开始处理 POST 请求');
    await dbConnect();
    console.log('数据库连接成功');
    
    const session = await getSession();
    console.log('获取会话信息:', session);
    
    if (!session?.user?.id) {
      console.log('用户未登录');
      return NextResponse.json(
        { error: '未登录' },
        { status: 401 }
      );
    }

    const body = await request.json();
    console.log('请求体:', body);
    
    const todo = await TodoModel.create({
      ...body,
      userId: session.user.id,
    });
    console.log('创建的 todo:', todo);

    return NextResponse.json(todo);
  } catch (error) {
    console.error('创建todo失败:', error);
    // 返回更详细的错误信息
    return NextResponse.json(
      { error: '创建待办事项失败', details: error.message },
      { status: 500 }
    );
  }
}
