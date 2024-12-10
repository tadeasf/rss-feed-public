import mongoose from 'mongoose'

declare global {
  // eslint-disable-next-line no-var
  var mongoose: {
    conn: mongoose.Mongoose | null
    promise: Promise<mongoose.Mongoose> | null
  } | undefined
}

const MONGODB_URI = process.env.MONGODB_URI!

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable')
}

const cached = global.mongoose ?? (global.mongoose = { conn: null, promise: null })

async function connectDB(): Promise<mongoose.Mongoose> {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    }

    cached.promise = mongoose.connect(MONGODB_URI, opts)
  }

  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null
    throw e
  }

  return cached.conn
}

export default connectDB 