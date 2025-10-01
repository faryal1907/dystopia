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
      { code: 'la', name: 'Latin' }
    ]
    
    // Mock translation database for demo purposes
    this.mockTranslations = {
      'en-es': {
        'Hello, how are you today?': 'Hola, ¿cómo estás hoy?',
        'Technology is changing the world rapidly.': 'La tecnología está cambiando el mundo rápidamente.',
        'Reading is a fundamental skill for learning.': 'La lectura es una habilidad fundamental para el aprendizaje.',
        'Good morning': 'Buenos días',
        'Good afternoon': 'Buenas tardes',
        'Good evening': 'Buenas noches',
        'Thank you': 'Gracias',
        'Please': 'Por favor',
        'Excuse me': 'Disculpe',
        'I love reading books': 'Me encanta leer libros'
      },
      'en-fr': {
        'Hello, how are you today?': 'Bonjour, comment allez-vous aujourd\'hui?',
        'Technology is changing the world rapidly.': 'La technologie change rapidement le monde.',
        'Reading is a fundamental skill for learning.': 'La lecture est une compétence fondamentale pour l\'apprentissage.',
        'Good morning': 'Bonjour',
        'Good afternoon': 'Bon après-midi',
        'Good evening': 'Bonsoir',
        'Thank you': 'Merci',
        'Please': 'S\'il vous plaît',
        'Excuse me': 'Excusez-moi',
        'I love reading books': 'J\'adore lire des livres'
      },
      'en-de': {
        'Hello, how are you today?': 'Hallo, wie geht es dir heute?',
        'Technology is changing the world rapidly.': 'Die Technologie verändert die Welt schnell.',
        'Reading is a fundamental skill for learning.': 'Lesen ist eine grundlegende Fähigkeit zum Lernen.',
        'Good morning': 'Guten Morgen',
        'Good afternoon': 'Guten Tag',
        'Good evening': 'Guten Abend',
        'Thank you': 'Danke',
        'Please': 'Bitte',
        'Excuse me': 'Entschuldigung',
        'I love reading books': 'Ich liebe es, Bücher zu lesen'
      },
      'en-it': {
        'Hello, how are you today?': 'Ciao, come stai oggi?',
        'Technology is changing the world rapidly.': 'La tecnologia sta cambiando rapidamente il mondo.',
        'Reading is a fundamental skill for learning.': 'La lettura è un\'abilità fondamentale per l\'apprendimento.',
        'Good morning': 'Buongiorno',
        'Good afternoon': 'Buon pomeriggio',
        'Good evening': 'Buonasera',
        'Thank you': 'Grazie',
        'Please': 'Per favore',
        'Excuse me': 'Scusi',
        'I love reading books': 'Amo leggere libri'
      },
      'en-pt': {
        'Hello, how are you today?': 'Olá, como você está hoje?',
        'Technology is changing the world rapidly.': 'A tecnologia está mudando o mundo rapidamente.',
        'Reading is a fundamental skill for learning.': 'A leitura é uma habilidade fundamental para o aprendizado.',
        'Good morning': 'Bom dia',
        'Good afternoon': 'Boa tarde',
        'Good evening': 'Boa noite',
        'Thank you': 'Obrigado',
        'Please': 'Por favor',
        'Excuse me': 'Com licença',
        'I love reading books': 'Eu amo ler livros'
      }
    }
  }

  async translateText(text, targetLanguage, sourceLanguage = 'auto') {
    try {
      // Try API first
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
      console.log('API translation failed, using mock translation:', error.message)
      
      // Fallback to mock translation
      const detectedLang = sourceLanguage === 'auto' ? 'en' : sourceLanguage
      const translationKey = `${detectedLang}-${targetLanguage}`
      const mockTranslation = this.mockTranslations[translationKey]?.[text]
      
      if (mockTranslation) {
        return {
          success: true,
          translatedText: mockTranslation,
          detectedLanguage: detectedLang
        }
      }
      
      // Simple mock translation if no exact match
      return {
        success: true,
        translatedText: `[${targetLanguage.toUpperCase()}] ${text}`,
        detectedLanguage: detectedLang
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
      console.log('API language detection failed, using mock detection:', error.message)
      
      // Simple mock language detection
      const commonWords = {
        en: ['the', 'and', 'is', 'in', 'to', 'of', 'a', 'that', 'it', 'with'],
        es: ['el', 'la', 'de', 'que', 'y', 'a', 'en', 'un', 'es', 'se'],
        fr: ['le', 'de', 'et', 'à', 'un', 'il', 'être', 'et', 'en', 'avoir'],
        de: ['der', 'die', 'und', 'in', 'den', 'von', 'zu', 'das', 'mit', 'sich'],
        it: ['il', 'di', 'che', 'e', 'la', 'per', 'un', 'in', 'con', 'del']
      }
      
      const words = text.toLowerCase().split(/\s+/)
      let bestMatch = 'en'
      let bestScore = 0
      
      for (const [lang, commonWordsArray] of Object.entries(commonWords)) {
        const score = words.filter(word => commonWordsArray.includes(word)).length
        if (score > bestScore) {
          bestScore = score
          bestMatch = lang
        }
      }
      
      return {
        success: true,
        language: bestMatch,
        confidence: Math.min(0.95, bestScore / words.length + 0.5)
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

  // Add more mock translations for common phrases
  addMockTranslation(sourceText, targetLang, translatedText, sourceLang = 'en') {
    const key = `${sourceLang}-${targetLang}`
    if (!this.mockTranslations[key]) {
      this.mockTranslations[key] = {}
    }
    this.mockTranslations[key][sourceText] = translatedText
  }
}

export const translationService = new TranslationService()

// Add some additional mock translations for better demo experience
translationService.addMockTranslation('Welcome to VOXA', 'es', 'Bienvenido a VOXA')
translationService.addMockTranslation('Welcome to VOXA', 'fr', 'Bienvenue à VOXA')
translationService.addMockTranslation('Welcome to VOXA', 'de', 'Willkommen bei VOXA')
translationService.addMockTranslation('Welcome to VOXA', 'it', 'Benvenuto in VOXA')
translationService.addMockTranslation('Welcome to VOXA', 'pt', 'Bem-vindo ao VOXA')

translationService.addMockTranslation('This is a test sentence for translation.', 'es', 'Esta es una oración de prueba para traducción.')
translationService.addMockTranslation('This is a test sentence for translation.', 'fr', 'Ceci est une phrase de test pour la traduction.')
translationService.addMockTranslation('This is a test sentence for translation.', 'de', 'Dies ist ein Testsatz für die Übersetzung.')
translationService.addMockTranslation('This is a test sentence for translation.', 'it', 'Questa è una frase di prova per la traduzione.')
translationService.addMockTranslation('This is a test sentence for translation.', 'pt', 'Esta é uma frase de teste para tradução.')