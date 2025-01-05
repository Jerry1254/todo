import dbConnect from '../lib/mongodb'
import UserModel from '../models/User'

async function viewDatabase() {
  try {
    // 连接数据库
    await dbConnect()
    console.log('Connected to MongoDB')

    // 查询所有用户
    const users = await UserModel.find({})
    console.log('\nUsers in database:')
    console.log(JSON.stringify(users, null, 2))

    // 查询用户总数
    const count = await UserModel.countDocuments()
    console.log(`\nTotal users: ${count}`)

  } catch (error) {
    console.error('Error:', error)
  } finally {
    process.exit()
  }
}

viewDatabase()
