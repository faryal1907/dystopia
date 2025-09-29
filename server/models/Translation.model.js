// server/models/Translation.model.js
import mongoose from 'mongoose'

const translationSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  originalText: {
    type: String,
    required: true
  },
  translatedText: {
    type: String,
    required: true
  },
  sourceLanguage: {
    type: String,
    required: true
  },
  targetLanguage: {
    type: String,
    required: true
  },
  detectedLanguage: String,
  confidence: Number,
  service: {
    type: String,
    default: 'google-translate'
  },
  cached: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

// Index for efficient lookups of cached translations
translationSchema.index({ 
  originalText: 'text', 
  sourceLanguage: 1, 
  targetLanguage: 1 
})

export default mongoose.model('Translation', translationSchema)