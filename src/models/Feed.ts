import mongoose from 'mongoose'

export interface FeedItem {
  _id: string
  title: string
  link: string
  date: Date
}

const feedSchema = new mongoose.Schema({
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

export const Feed = mongoose.models.Feed || mongoose.model('Feed', feedSchema) 