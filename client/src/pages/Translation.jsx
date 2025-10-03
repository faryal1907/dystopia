// client/src/pages/Translation.jsx
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Languages, Volume2, Copy, CheckCircle, Loader, Info, Settings as SettingsIcon, BookOpen, Plus } from 'lucide-react'
import { translationService } from '../utils/translation'
import { ttsService } from '../utils/textToSpeech'
import { useUser } from '../context/UserContext.jsx'
import { useNavigate } from 'react-router-dom'

const Translation = () => {
  const { settings, updateSettings } = useUser()
  const navigate = useNavigate()
  const [sourceText, setSourceText] = useState('')
  const [translatedText, setTranslatedText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [preferredLanguage, setPreferredLanguage] = useState('es')
  const [showQuickSettings, setShowQuickSettings] = useState(false)
  const [showDictionary, setShowDictionary] = useState(false)

  const languages = translationService.getSupportedLanguages()

  // Use language from settings
  useEffect(() => {
    if (settings && settings.preferredTranslationLanguage) {
      setPreferredLanguage(settings.preferredTranslationLanguage)
    }
  }, [settings])

  // Auto-translate when text changes (with debounce)
  useEffect(() => {
    if (!settings?.autoTranslate) return

    const timer = setTimeout(() => {
      if (sourceText.trim().length > 0) {
        handleTranslate()
      } else {
        setTranslatedText('')
      }
    }, 1000)

    return () => clearTimeout(timer)
  }, [sourceText, preferredLanguage, settings?.autoTranslate])

  const handleTranslate = async () => {
    if (!sourceText.trim()) return

    setLoading(true)
    setError('')

    try {
      const result = await translationService.translateText(
        sourceText,
        preferredLanguage,
        'auto'
      )

      if (result.success) {
        setTranslatedText(result.translatedText)
      } else {
        setError(result.error || 'Translation failed')
        setTranslatedText('')
      }
    } catch (err) {
      setError('Translation failed. Please try again.')
      setTranslatedText('')
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text:', err)
    }
  }

  const handleSpeak = (text, language) => {
    if (!text) return

    ttsService.speak(text, {
      rate: settings?.readingSpeed || 0.9,
      pitch: 1.0,
      volume: 1.0
    })
  }

  const handleLanguageChange = async (newLanguage) => {
    setPreferredLanguage(newLanguage)

    // Save to settings immediately
    if (settings) {
      await updateSettings({
        ...settings,
        preferredTranslationLanguage: newLanguage
      })
    }

    // Retranslate if there's text
    if (sourceText.trim()) {
      handleTranslate()
    }
  }

  const goToSettings = () => {
    navigate('/settings')
  }

  const currentDictionary = translationService.getDictionary('en', preferredLanguage)
  const dictionaryEntries = Object.entries(currentDictionary).slice(0, 20)

  const sampleTexts = [
    {
      text: "Hello, how are you today?",
      lang: "en"
    },
    {
      text: "Thank you very much for your help.",
      lang: "en"
    },
    {
      text: "Good morning! Welcome to our school.",
      lang: "en"
    },
    {
      text: "Technology is changing the world.",
      lang: "en"
    },
    {
      text: "Reading is a beautiful learning experience.",
      lang: "en"
    },
    {
      text: "I love learning new languages.",
      lang: "en"
    }
  ]

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)] py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl mb-4">
            <Languages className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)] dyslexia-text mb-2">
            Dictionary-Based Translation
          </h1>
          <p className="text-[var(--text-secondary)] dyslexia-text">
            Simple word-by-word translation using built-in dictionaries - no AI required!
          </p>
        </motion.div>

        {/* Quick Settings and Info */}
        <div className="mb-8 space-y-4">
          {/* Info Box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 flex items-start space-x-3"
          >
            <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-blue-700 dark:text-blue-300 dyslexia-text">
                Your preferred translation language is <strong>{translationService.getLanguageName(preferredLanguage)}</strong>.
                {' '}Change it below or in Settings. This translation uses a built-in dictionary for word-by-word translation.
              </p>
            </div>
          </motion.div>

          {/* Quick Language Selector */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-[var(--bg-primary)] rounded-xl p-4 border border-[var(--border-color)]"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[var(--text-primary)] dyslexia-text flex items-center">
                <Languages className="h-5 w-5 mr-2" />
                Translation Language
              </h3>
              <button
                onClick={() => setShowQuickSettings(!showQuickSettings)}
                className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] rounded-lg transition-colors"
              >
                <SettingsIcon className="h-5 w-5" />
              </button>
            </div>

            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <label className="block text-sm text-[var(--text-secondary)] dyslexia-text mb-2">
                  Translate to:
                </label>
                <select
                  value={preferredLanguage}
                  onChange={(e) => handleLanguageChange(e.target.value)}
                  className="w-full p-3 border border-[var(--border-color)] rounded-lg bg-[var(--bg-primary)] text-[var(--text-primary)] dyslexia-text focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {languages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.name}
                    </option>
                  ))}
                </select>
              </div>

              {showQuickSettings && (
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-sm text-[var(--text-secondary)] dyslexia-text mb-2">
                    Auto-Translate:
                  </label>
                  <label className="flex items-center p-3 border border-[var(--border-color)] rounded-lg bg-[var(--bg-primary)] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings?.autoTranslate || false}
                      onChange={(e) => updateSettings({ ...settings, autoTranslate: e.target.checked })}
                      className="w-4 h-4 text-primary-600 bg-[var(--bg-primary)] border-[var(--border-color)] rounded focus:ring-primary-500 focus:ring-2 mr-2"
                    />
                    <span className="text-[var(--text-primary)] dyslexia-text">
                      {settings?.autoTranslate ? 'Enabled' : 'Disabled'}
                    </span>
                  </label>
                </div>
              )}

              <div className="flex items-end space-x-2">
                <button
                  onClick={goToSettings}
                  className="px-4 py-3 bg-primary-100 dark:bg-primary-800 text-primary-700 dark:text-primary-300 rounded-lg hover:bg-primary-200 dark:hover:bg-primary-700 transition-colors dyslexia-text whitespace-nowrap"
                >
                  More Settings
                </button>
                <button
                  onClick={() => setShowDictionary(!showDictionary)}
                  className="px-4 py-3 bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-200 dark:hover:bg-green-700 transition-colors dyslexia-text whitespace-nowrap flex items-center"
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  Dictionary
                </button>
              </div>
            </div>
          </motion.div>

          {/* Dictionary View */}
          <AnimatePresence>
            {showDictionary && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-[var(--bg-primary)] rounded-xl p-6 border border-[var(--border-color)]"
              >
                <h3 className="text-lg font-semibold text-[var(--text-primary)] dyslexia-text mb-4 flex items-center">
                  <BookOpen className="h-5 w-5 mr-2" />
                  Available Translations (English → {translationService.getLanguageName(preferredLanguage)})
                </h3>
                {dictionaryEntries.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {dictionaryEntries.map(([english, translated], index) => (
                      <div
                        key={index}
                        className="p-3 bg-[var(--bg-secondary)] rounded-lg border border-[var(--border-color)]"
                      >
                        <div className="text-sm font-medium text-[var(--text-primary)] dyslexia-text">
                          {english}
                        </div>
                        <div className="text-xs text-[var(--text-secondary)] dyslexia-text mt-1">
                          → {translated}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[var(--text-secondary)] dyslexia-text">
                    No dictionary available for this language pair. Please select a different target language.
                  </p>
                )}
                <p className="text-xs text-[var(--text-secondary)] dyslexia-text mt-4">
                  Showing first 20 entries. More words can be added to the dictionary as needed.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Translation Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Source Text */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-[var(--bg-primary)] rounded-xl p-6 border border-[var(--border-color)]"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[var(--text-primary)] dyslexia-text">
                Enter Text (English)
              </h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleSpeak(sourceText, 'en')}
                  disabled={!sourceText.trim()}
                  className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  title="Listen to text"
                >
                  <Volume2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleCopy(sourceText)}
                  disabled={!sourceText.trim()}
                  className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  title="Copy text"
                >
                  {copied ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <textarea
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
              placeholder="Type or paste your text here to translate..."
              className="w-full h-64 p-4 border border-[var(--border-color)] rounded-lg bg-[var(--bg-primary)] text-[var(--text-primary)] dyslexia-text resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              style={{
                lineHeight: '1.8',
                letterSpacing: '0.05em',
                fontSize: '1.1rem'
              }}
            />

            <div className="flex items-center justify-between mt-4">
              <span className="text-sm text-[var(--text-secondary)] dyslexia-text">
                {sourceText.length} characters
              </span>
              {sourceText.trim().length > 0 && !settings?.autoTranslate && (
                <button
                  onClick={handleTranslate}
                  disabled={loading}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors dyslexia-text"
                >
                  {loading ? 'Translating...' : 'Translate'}
                </button>
              )}
              {settings?.autoTranslate && sourceText.trim().length > 0 && (
                <span className="text-xs text-green-600 dark:text-green-400 dyslexia-text">
                  Auto-translating...
                </span>
              )}
            </div>
          </motion.div>

          {/* Translated Text */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-[var(--bg-primary)] rounded-xl p-6 border border-[var(--border-color)]"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[var(--text-primary)] dyslexia-text">
                Translation ({translationService.getLanguageName(preferredLanguage)})
              </h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleSpeak(translatedText, preferredLanguage)}
                  disabled={!translatedText.trim()}
                  className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  title="Listen to translation"
                >
                  <Volume2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleCopy(translatedText)}
                  disabled={!translatedText.trim()}
                  className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  title="Copy translation"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div
              className="w-full h-64 p-4 border border-[var(--border-color)] rounded-lg bg-[var(--bg-secondary)] text-[var(--text-primary)] dyslexia-text overflow-y-auto"
              style={{
                lineHeight: '1.8',
                letterSpacing: '0.05em',
                fontSize: '1.1rem'
              }}
            >
              {loading ? (
                <div className="flex items-center justify-center h-full text-[var(--text-secondary)]">
                  <Loader className="h-6 w-6 animate-spin mr-2" />
                  Translating...
                </div>
              ) : error ? (
                <div className="flex items-center justify-center h-full text-red-500">
                  {error}
                </div>
              ) : translatedText ? (
                translatedText
              ) : (
                <div className="flex items-center justify-center h-full text-[var(--text-secondary)]">
                  Your translation will appear here
                </div>
              )}
            </div>

            {translatedText && (
              <div className="mt-4 text-sm text-[var(--text-secondary)] dyslexia-text">
                {translatedText.length} characters • Dictionary-based translation
              </div>
            )}
          </motion.div>
        </div>

        {/* Sample Texts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-[var(--bg-primary)] rounded-xl p-6 border border-[var(--border-color)]"
        >
          <h3 className="text-lg font-semibold text-[var(--text-primary)] dyslexia-text mb-4">
            Try Sample Texts
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sampleTexts.map((sample, index) => (
              <button
                key={index}
                onClick={() => setSourceText(sample.text)}
                className="p-4 text-left bg-[var(--bg-secondary)] rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors border border-transparent hover:border-primary-300"
              >
                <div className="text-[var(--text-primary)] dyslexia-text" style={{ lineHeight: '1.6' }}>
                  {sample.text}
                </div>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Help Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 dyslexia-text mb-3">
            How Dictionary Translation Works
          </h3>
          <ul className="space-y-2 text-yellow-700 dark:text-yellow-300 dyslexia-text">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Translates word-by-word using a built-in dictionary of common words and phrases</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Works best with simple sentences containing common words</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Currently supports English to Spanish, French, German, Italian, and Portuguese</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>No AI or internet connection required - all translation happens locally</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>For professional translations, consider using dedicated translation services</span>
            </li>
          </ul>
        </motion.div>
      </div>
    </div>
  )
}

export default Translation
