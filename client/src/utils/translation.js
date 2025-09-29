// client/src/utils/translation.js
import { api } from './api'

class TranslationService {
  constructor() {
    this.supportedLanguages = [
      { code: 'en', name: 'English' },
      { code: 'es', name: 'Spanish' },
      { code: 'fr', name: 'French' },
      { code: 'de', name: 'German' },
      { code: 'it', name: 'Italian' },
      { code: 'pt', name: 'Portuguese' },
      { code: 'ru', name: 'Russian' },
      { code: 'zh', name: 'Chinese' },
      { code: 'ja', name: 'Japanese' },
      { code: 'ko', name: 'Korean' },
      { code: 'ar', name: 'Arabic' },
      { code: 'hi', name: 'Hindi' },
    ]
  }

  async translateText(text, targetLanguage, sourceLanguage = 'auto') {
    try {
      const response = await api.post('/translation/translate', {
        text,
        targetLanguage,
        sourceLanguage
      })
      return {
        success: true,
        translatedText: response.data.translatedText,
        detectedLanguage: response.data.detectedLanguage
      }
    } catch (error) {
      console.error('Translation error:', error)
      return {
        success: false,
        error: error.response?.data?.message || 'Translation failed'
      }
    }
  }

  async detectLanguage(text) {
    try {
      const response = await api.post('/translation/detect', { text })
      return {
        success: true,
        language: response.data.language,
        confidence: response.data.confidence
      }
    } catch (error) {
      console.error('Language detection error:', error)
      return {
        success: false,
        error: error.response?.data?.message || 'Language detection failed'
      }
    }
  }

  getSupportedLanguages() {
    return this.supportedLanguages
  }

  getLanguageName(code) {
    const language = this.supportedLanguages.find(lang => lang.code === code)
    return language ? language.name : code
  }
}

export const translationService = new TranslationService()