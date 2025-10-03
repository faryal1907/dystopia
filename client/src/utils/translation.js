// client/src/utils/translation.js

// FIXED: Updated Gemini API endpoint and error handling
const GEMINI_API_KEY = 'AIzaSyDvBQzNc3IUaEnHJ9Ezq0uIYysc7ERbG5M'
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent'

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
      { code: 'zh', name: 'Chinese (Simplified)' },
      { code: 'zh-TW', name: 'Chinese (Traditional)' },
      { code: 'ja', name: 'Japanese' },
      { code: 'ko', name: 'Korean' },
      { code: 'ar', name: 'Arabic' },
      { code: 'hi', name: 'Hindi' },
      { code: 'th', name: 'Thai' },
      { code: 'vi', name: 'Vietnamese' },
      { code: 'tr', name: 'Turkish' },
      { code: 'pl', name: 'Polish' },
      { code: 'nl', name: 'Dutch' },
      { code: 'sv', name: 'Swedish' },
      { code: 'da', name: 'Danish' },
      { code: 'no', name: 'Norwegian' },
      { code: 'fi', name: 'Finnish' },
      { code: 'el', name: 'Greek' },
      { code: 'he', name: 'Hebrew' },
      { code: 'cs', name: 'Czech' },
      { code: 'sk', name: 'Slovak' },
      { code: 'hu', name: 'Hungarian' },
      { code: 'ro', name: 'Romanian' },
      { code: 'bg', name: 'Bulgarian' },
      { code: 'hr', name: 'Croatian' },
      { code: 'sr', name: 'Serbian' },
      { code: 'sl', name: 'Slovenian' },
      { code: 'et', name: 'Estonian' },
      { code: 'lv', name: 'Latvian' },
      { code: 'lt', name: 'Lithuanian' },
      { code: 'uk', name: 'Ukrainian' },
      { code: 'be', name: 'Belarusian' },
      { code: 'ka', name: 'Georgian' },
      { code: 'hy', name: 'Armenian' },
      { code: 'az', name: 'Azerbaijani' },
      { code: 'kk', name: 'Kazakh' },
      { code: 'ky', name: 'Kyrgyz' },
      { code: 'uz', name: 'Uzbek' },
      { code: 'tg', name: 'Tajik' },
      { code: 'mn', name: 'Mongolian' },
      { code: 'my', name: 'Myanmar (Burmese)' },
      { code: 'km', name: 'Khmer' },
      { code: 'lo', name: 'Lao' },
      { code: 'si', name: 'Sinhala' },
      { code: 'ne', name: 'Nepali' },
      { code: 'bn', name: 'Bengali' },
      { code: 'ur', name: 'Urdu' },
      { code: 'fa', name: 'Persian' },
      { code: 'ps', name: 'Pashto' },
      { code: 'sd', name: 'Sindhi' },
      { code: 'gu', name: 'Gujarati' },
      { code: 'pa', name: 'Punjabi' },
      { code: 'ta', name: 'Tamil' },
      { code: 'te', name: 'Telugu' },
      { code: 'kn', name: 'Kannada' },
      { code: 'ml', name: 'Malayalam' },
      { code: 'or', name: 'Odia' },
      { code: 'as', name: 'Assamese' },
      { code: 'mr', name: 'Marathi' },
      { code: 'sa', name: 'Sanskrit' },
      { code: 'cy', name: 'Welsh' },
      { code: 'ga', name: 'Irish' },
      { code: 'gd', name: 'Scottish Gaelic' },
      { code: 'is', name: 'Icelandic' },
      { code: 'mt', name: 'Maltese' },
      { code: 'eu', name: 'Basque' },
      { code: 'ca', name: 'Catalan' },
      { code: 'gl', name: 'Galician' },
      { code: 'af', name: 'Afrikaans' },
      { code: 'sw', name: 'Swahili' },
      { code: 'zu', name: 'Zulu' },
      { code: 'xh', name: 'Xhosa' },
      { code: 'st', name: 'Sesotho' },
      { code: 'tn', name: 'Setswana' },
      { code: 'ss', name: 'Siswati' },
      { code: 've', name: 'Venda' },
      { code: 'ts', name: 'Tsonga' },
      { code: 'nr', name: 'Ndebele' },
      { code: 'nso', name: 'Northern Sotho' },
      { code: 'am', name: 'Amharic' },
      { code: 'ti', name: 'Tigrinya' },
      { code: 'om', name: 'Oromo' },
      { code: 'so', name: 'Somali' },
      { code: 'rw', name: 'Kinyarwanda' },
      { code: 'rn', name: 'Kirundi' },
      { code: 'ny', name: 'Chichewa' },
      { code: 'mg', name: 'Malagasy' },
      { code: 'eo', name: 'Esperanto' },
      { code: 'la', name: 'Latin' },
      { code: 'id', name: 'Indonesian' },
      { code: 'ms', name: 'Malay' },
      { code: 'tl', name: 'Tagalog' }
    ]

    // Translation cache to reduce API calls
    this.cache = new Map()
  }

  getCacheKey(text, targetLanguage, sourceLanguage) {
    return `${sourceLanguage}-${targetLanguage}-${text.substring(0, 50)}`
  }

  async translateText(text, targetLanguage, sourceLanguage = 'auto') {
    try {
      // Check cache first
      const cacheKey = this.getCacheKey(text, targetLanguage, sourceLanguage)
      if (this.cache.has(cacheKey)) {
        console.log('Using cached translation')
        return this.cache.get(cacheKey)
      }

      const targetLangName = this.getLanguageName(targetLanguage)
      const sourceLangName = sourceLanguage === 'auto' ? 'the detected language' : this.getLanguageName(sourceLanguage)

      const prompt = `Translate the following text from ${sourceLangName} to ${targetLangName}. Provide ONLY the translated text without any additional commentary, explanations, or formatting. Make the translation natural and easy to read for people with dyslexia.

Text to translate:
${text}`

      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.1,
            topK: 1,
            topP: 1,
            maxOutputTokens: 2048,
          }
        })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error('Gemini API Error:', errorData)
        throw new Error(`Gemini API request failed: ${response.status}`)
      }

      const data = await response.json()
      const translatedText = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim()

      if (!translatedText) {
        throw new Error('No translation received from API')
      }

      const result = {
        success: true,
        translatedText,
        detectedLanguage: sourceLanguage === 'auto' ? 'en' : sourceLanguage
      }

      // Cache the result
      this.cache.set(cacheKey, result)

      // Limit cache size
      if (this.cache.size > 100) {
        const firstKey = this.cache.keys().next().value
        this.cache.delete(firstKey)
      }

      return result
    } catch (error) {
      console.error('Translation error:', error)
      return {
        success: false,
        error: 'Translation failed. Please check your internet connection and try again.',
        translatedText: text,
        detectedLanguage: sourceLanguage === 'auto' ? 'en' : sourceLanguage
      }
    }
  }

  async detectLanguage(text) {
    try {
      const prompt = `Detect the language of the following text and respond with ONLY the ISO 639-1 language code (e.g., 'en', 'es', 'fr'). Do not provide any explanation or additional text.

Text:
${text}`

      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.1,
            topK: 1,
            topP: 1,
            maxOutputTokens: 10,
          }
        })
      })

      if (!response.ok) {
        throw new Error('Gemini API request failed')
      }

      const data = await response.json()
      const detectedLang = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim().toLowerCase()

      return {
        success: true,
        language: detectedLang || 'en',
        confidence: 0.95
      }
    } catch (error) {
      console.error('Language detection error:', error)
      return {
        success: true,
        language: 'en',
        confidence: 0.5
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

  clearCache() {
    this.cache.clear()
  }
}

export const translationService = new TranslationService()
