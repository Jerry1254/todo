import { User } from '@/types/auth'
import dbConnect from './mongodb'
import UserModel from '@/models/User'
import { createHash } from 'crypto'

function hashPassword(password: string): string {
  return createHash('sha256').update(password).digest('hex')
}

export async function createUser(username: string, password: string): Promise<User> {
  await dbConnect()

  // 检查用户是否已存在
  const existingUser = await UserModel.findOne({ username })
  if (existingUser) {
    throw new Error('用户名已存在')
  }

  // 对密码进行加密
  const hashedPassword = hashPassword(password)

  // 创建新用户
  const user = await UserModel.create({
    username,
    password: hashedPassword,
  })

  // 返回不包含密码的用户信息
  return user.toJSON()
}

export async function validateUser(username: string, password: string): Promise<User> {
  await dbConnect()

  const user = await UserModel.findOne({ username })
  
  if (!user) {
    throw new Error('用户不存在')
  }
  
  const hashedPassword = hashPassword(password)
  if (hashedPassword !== user.password) {
    throw new Error('密码错误')
  }

  return user.toJSON()
}
