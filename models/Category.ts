import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: [true, '请输入类别名称'],
    trim: true,
  },
  color: {
    type: String,
    required: [true, '请选择颜色'],
    default: 'bg-[#d6d6d6]',
  },
  textColor: {
    type: String,
    required: [true, '请选择文字颜色'],
    default: 'text-[#908986]',
  },
  icon: {
    type: String,
    required: [true, '请选择图标'],
    default: 'folder',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// 转换为 JSON 时的处理
categorySchema.set('toJSON', {
  transform: function(doc, ret, options) {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export default mongoose.models.Category || mongoose.model('Category', categorySchema);
