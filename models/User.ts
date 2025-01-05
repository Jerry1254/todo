import mongoose from 'mongoose';
import { User } from '@/types/auth';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, '请输入用户名'],
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, '请输入密码'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// 转换为普通 JavaScript 对象时去除密码字段，并将 _id 转换为 id
userSchema.set('toJSON', {
  transform: function(doc, ret, options) {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    delete ret.password;
    return ret;
  },
});

export default mongoose.models.User || mongoose.model('User', userSchema);
