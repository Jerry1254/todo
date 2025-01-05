import mongoose from 'mongoose';

// 子任务的 Schema
const subTaskSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, '请输入任务描述'],
    trim: true,
  },
  category: {
    type: String,
    required: [true, '请选择类别'],
  },
  completed: {
    type: Boolean,
    default: false,
  },
  date: {
    type: String,
    required: [true, '请选择日期'],
  },
  startTime: String,
  duration: Number,
});

// Todo 的 Schema
const todoSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  text: {
    type: String,
    required: [true, '请输入任务描述'],
    trim: true,
  },
  category: {
    type: String,
    required: [true, '请选择类别'],
  },
  completed: {
    type: Boolean,
    default: false,
  },
  date: {
    type: String,
    required: [true, '请选择日期'],
  },
  startTime: String,
  duration: Number,
  subtasks: [subTaskSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// 转换为 JSON 时的处理
todoSchema.set('toJSON', {
  transform: function(doc, ret, options) {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    if (ret.subtasks) {
      ret.subtasks = ret.subtasks.map((subtask: any) => ({
        ...subtask,
        id: subtask._id.toString(),
        _id: undefined,
        __v: undefined,
      }));
    }
    return ret;
  },
});

export default mongoose.models.Todo || mongoose.model('Todo', todoSchema);
