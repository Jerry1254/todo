import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/todo-app';

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env'
  );
}

console.log('MongoDB URI:', MONGODB_URI.replace(/:[^:]*@/, ':****@'));

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    console.log('Using cached database connection');
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    console.log('Establishing new MongoDB connection...');
    try {
      cached.promise = mongoose.connect(MONGODB_URI, opts)
        .then((mongoose) => {
          console.log('MongoDB connected successfully!');
          return mongoose;
        })
        .catch((error) => {
          console.error('MongoDB connection error:', error);
          throw error;
        });
    } catch (error) {
      console.error('Error during MongoDB connection:', error);
      throw error;
    }
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    console.error('Failed to get MongoDB connection:', e);
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnect;
