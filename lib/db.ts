import { User } from '@/types/auth'
import dbConnect from './mongodb'
import UserModel from '@/models/User'
import { hash, compare } from 'bcrypt'

const SALT_ROUNDS = 10

export async function createUser(username: string, password: string): Promise<User> {
  await dbConnect()

  // 检查用户是否已存在
  const existingUser = await UserModel.findOne({ username })
  if (existingUser) {
    throw new Error('用户名已存在')
  }

  // 对密码进行加密
  const hashedPassword = await hash(password, SALT_ROUNDS)

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
  
  const isValid = await compare(password, user.password)
  if (!isValid) {
    throw new Error('密码错误')
  }

  return user.toJSON()
}
