// 从 cookie 获取用户会话信息
import { cookies } from 'next/headers'

export async function getSession() {
  const cookieStore = cookies()
  const userCookie = cookieStore.get('user')
  
  if (!userCookie) {
    return null
  }

  try {
    return {
      user: JSON.parse(userCookie.value)
    }
  } catch (error) {
    console.error('解析用户信息失败:', error)
    return null
  }
}
