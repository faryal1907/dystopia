// server/controllers/translationController.js
import Translation from '../models/Translation.model.js'

// Mock translation service - in production, integrate with Google Translate API or similar
const mockTranslate = async (text, targetLang, sourceLang = 'auto') => {
  // This is a mock implementation
  // In production, integrate with actual translation service
  const translations = {
    'en-es': {
      'Hello, how are you today?': 'Hola, ¿cómo estás hoy?',
      'Technology is changing the world rapidly.': 'La tecnología está cambiando el mundo rápidamente.',
      'Reading is a fundamental skill for learning.': 'La lectura es una habilidad fundamental para el aprendizaje.'
    },
    'en-fr': {
      'Hello, how are you today?': 'Bonjour, comment allez-vous aujourd\'hui?',
      'Technology is changing the world rapidly.': 'La technologie change rapidement le monde.',
      'Reading is a fundamental skill for learning.': 'La lecture est une compétence fondamentale pour l\'apprentissage.'
    }
  }
  
  const key = `${sourceLang === 'auto' ? 'en' : sourceLang}-${targetLang}`
  const translatedText = translations[key]?.[text] || `[Translated: ${text}]`
  
  return {
    translatedText,
    detectedLanguage: sourceLang === 'auto' ? 'en' : sourceLang,
    confidence: 0.95
  }
}

export const translateText = async (req, res) => {
  try {
    const { text, targetLanguage, sourceLanguage = 'auto' } = req.body
    const userId = req.user?.id
    
    if (!text || !targetLanguage) {
      return res.status(400).json({ message: 'Text and target language are required' })
    }
    
    // Check for cached translation
    let cachedTranslation = await Translation.findOne({
      originalText: text,
      sourceLanguage: sourceLanguage === 'auto' ? { $exists: true } : sourceLanguage,
      targetLanguage
    })
    
    if (cachedTranslation) {
      return res.json({
        translatedText: cachedTranslation.translatedText,
        detectedLanguage: cachedTranslation.detectedLanguage,
        cached: true
      })
    }
    
    // Perform translation
    const result = await mockTranslate(text, targetLanguage, sourceLanguage)
    
    // Save translation to cache
    if (userId) {
      const translation = new Translation({
        userId,
        originalText: text,
        translatedText: result.translatedText,
        sourceLanguage: result.detectedLanguage,
        targetLanguage,
        detectedLanguage: result.detectedLanguage,
        confidence: result.confidence,
        cached: false
      })
      await translation.save()
    }
    
    res.json({
      translatedText: result.translatedText,
      detectedLanguage: result.detectedLanguage,
      cached: false
    })
  } catch (error) {
    console.error('Translation error:', error)
    res.status(500).json({ message: 'Translation service error' })
  }
}

export const detectLanguage = async (req, res) => {
  try {
    const { text } = req.body
    
    if (!text) {
      return res.status(400).json({ message: 'Text is required' })
    }
    
    // Mock language detection
    // In production, use actual language detection service
    const detectedLanguage = 'en'
    const confidence = 0.95
    
    res.json({
      language: detectedLanguage,
      confidence
    })
  } catch (error) {
    console.error('Language detection error:', error)
    res.status(500).json({ message: 'Language detection service error' })
  }
}

export const getTranslationHistory = async (req, res) => {
  try {
    const userId = req.user?.id
    const { page = 1, limit = 20 } = req.query
    
    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' })
    }
    
    const translations = await Translation.find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-__v')
    
    const total = await Translation.countDocuments({ userId })
    
    res.json({
      translations,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching translation history:', error)
    res.status(500).json({ message: 'Server error' })
  }
}