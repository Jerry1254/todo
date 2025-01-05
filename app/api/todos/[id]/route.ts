import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import TodoModel from '@/models/Todo'
import { getSession } from '@/lib/session'

// 获取单个 todo
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect()
    const session = await getSession()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: '未登录' },
        { status: 401 }
      )
    }

    const todo = await TodoModel.findOne({
      _id: params.id,
      userId: session.user.id,
    })

    if (!todo) {
      return NextResponse.json(
        { error: '任务不存在' },
        { status: 404 }
      )
    }

    return NextResponse.json(todo)
  } catch (error) {
    console.error('获取todo失败:', error)
    const errorMessage = error instanceof Error ? error.message : '未知错误';
    return NextResponse.json(
      { error: '服务器错误', details: errorMessage },
      { status: 500 }
    )
  }
}

// 更新 todo
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect()
    const session = await getSession()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: '未登录' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const todo = await TodoModel.findOneAndUpdate(
      {
        _id: params.id,
        userId: session.user.id,
      },
      body,
      { new: true }
    )

    if (!todo) {
      return NextResponse.json(
        { error: '任务不存在' },
        { status: 404 }
      )
    }

    return NextResponse.json(todo)
  } catch (error) {
    console.error('更新todo失败:', error)
    const errorMessage = error instanceof Error ? error.message : '未知错误';
    return NextResponse.json(
      { error: '服务器错误', details: errorMessage },
      { status: 500 }
    )
  }
}

// 更新 todo（部分更新）
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    console.log('开始处理 PATCH 请求:', params.id);
    await dbConnect();
    const session = await getSession();
    
    if (!session?.user?.id) {
      console.log('用户未登录');
      return NextResponse.json(
        { error: '未登录' },
        { status: 401 }
      );
    }

    const body = await request.json();
    console.log('更新内容:', body);

    const todo = await TodoModel.findOneAndUpdate(
      {
        _id: params.id,
        userId: session.user.id,
      },
      { $set: body },
      { new: true }
    );

    if (!todo) {
      console.log('任务不存在');
      return NextResponse.json(
        { error: '任务不存在' },
        { status: 404 }
      );
    }

    console.log('更新成功:', todo);
    return NextResponse.json(todo);
  } catch (error) {
    console.error('更新todo失败:', error)
    const errorMessage = error instanceof Error ? error.message : '未知错误';
    return NextResponse.json(
      { error: '服务器错误', details: errorMessage },
      { status: 500 }
    );
  }
}

// 删除 todo
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect()
    const session = await getSession()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: '未登录' },
        { status: 401 }
      )
    }

    const todo = await TodoModel.findOneAndDelete({
      _id: params.id,
      userId: session.user.id,
    })

    if (!todo) {
      return NextResponse.json(
        { error: '任务不存在' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('删除todo失败:', error)
    const errorMessage = error instanceof Error ? error.message : '未知错误';
    return NextResponse.json(
      { error: '服务器错误', details: errorMessage },
      { status: 500 }
    )
  }
}
