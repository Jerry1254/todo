import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import CategoryModel from '@/models/Category'
import { getSession } from '@/lib/session'

// 获取所有分类
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

    const categories = await CategoryModel.find({ userId: session.user.id })
    return NextResponse.json(categories)
  } catch (error) {
    console.error('获取categories失败:', error)
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    )
  }
}

// 创建新分类
export async function POST(request: Request) {
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
    const category = await CategoryModel.create({
      ...body,
      userId: session.user.id,
    })

    return NextResponse.json(category)
  } catch (error) {
    console.error('创建category失败:', error)
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    )
  }
}
