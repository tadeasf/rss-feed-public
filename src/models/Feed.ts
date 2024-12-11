import mongoose from 'mongoose'
import { TorrentCategory, BaseTorrent } from '@/types/torrent'

export interface FeedItem extends BaseTorrent {
  _id: string
}

const feedSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  magnet: {
    type: String,
    required: true,
  },
  size: {
    type: String,
    required: true,
  },
  seeders: {
    type: Number,
    required: true,
  },
  leechers: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    enum: Object.values(TorrentCategory),
    required: true,
  },
  uploadDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  provider: {
    type: String,
    required: true,
  }
})

export const Feed = mongoose.models.Feed || mongoose.model('Feed', feedSchema) 