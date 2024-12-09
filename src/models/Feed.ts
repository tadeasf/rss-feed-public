import mongoose from 'mongoose'

const FeedSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
})

export type FeedItem = mongoose.InferSchemaType<typeof FeedSchema> & {
  _id: string
}

export const Feed = mongoose.models.Feed || mongoose.model('Feed', FeedSchema) 