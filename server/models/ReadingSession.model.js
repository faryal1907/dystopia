// server/models/ReadingSession.model.js
import mongoose from 'mongoose'

const readingSessionSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  textId: String,
  title: String,
  content: {
    type: String,
    required: true
  },
  sessionType: {
    type: String,
    enum: ['text-to-speech', 'translation', 'focus-mode', 'regular'],
    default: 'regular'
  },
  settings: {
    fontSize: String,
    readingSpeed: Number,
    voice: String,
    language: String,
    focusMode: Boolean
  },
  progress: {
    startPosition: {
      type: Number,
      default: 0
    },
    endPosition: {
      type: Number,
      default: 0
    },
    percentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    completed: {
      type: Boolean,
      default: false
    }
  },
  duration: {
    type: Number,
    default: 0 // in milliseconds
  },
  wordsRead: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
})

readingSessionSchema.pre('save', function(next) {
  this.updatedAt = Date.now()
  next()
})

export default mongoose.model('ReadingSession', readingSessionSchema)