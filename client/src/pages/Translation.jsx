// client/src/pages/Translation.jsx
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Languages, ArrowRight, Copy, Volume2, RotateCw, CheckCircle, Loader } from 'lucide-react'
import { translationService } from '../utils/translation'
import { ttsService } from '../utils/textToSpeech'

const Translation = () => {
  const [sourceText, setSourceText] = useState('')
  const [translatedText, setTranslatedText] = useState('')
  const [sourceLanguage, setSourceLanguage] = useState('auto')
  const [targetLanguage, setTargetLanguage] = useState('es')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [detectedLanguage, setDetectedLanguage] = useState('')

  const languages = translationService.getSupportedLanguages()

  const handleTranslate = async () => {
    if (!sourceText.trim()) return

    setLoading(true)
    setError('')
    setDetectedLanguage('')

    try {
      const result = await translationService.translateText(
        sourceText,
        targetLanguage,
        sourceLanguage
      )

      if (result.success) {
        setTranslatedText(result.translatedText)
        if (result.detectedLanguage) {
          setDetectedLanguage(result.detectedLanguage)
        }
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError('Translation failed. Please try again.')
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
      rate: 1.0,
      pitch: 1.0,
      volume: 1.0
    })
  }

  const swapLanguages = () => {
    if (sourceLanguage === 'auto') return
    
    const tempLang = sourceLanguage
    setSourceLanguage(targetLanguage)
    setTargetLanguage(tempLang)
    
    const tempText = sourceText
    setSourceText(translatedText)
    setTranslatedText(tempText)
  }

  const sampleTexts = [
    {
      text: "Hello, how are you today?",
      lang: "en"
    },
    {
      text: "Technology is changing the world rapidly.",
      lang: "en"
    },
    {
      text: "Reading is a fundamental skill for learning.",
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
            Real-Time Translation
          </h1>
          <p className="text-[var(--text-secondary)] dyslexia-text">
            Translate text between multiple languages instantly with dyslexia-friendly formatting
          </p>
        </motion.div>

        {/* Language Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[var(--bg-primary)] rounded-xl p-6 border border-[var(--border-color)] mb-8"
        >
          <div className="flex items-center justify-center space-x-4">
            {/* Source Language */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-[var(--text-primary)] dyslexia-text mb-2">
                From
              </label>
              <select
                value={sourceLanguage}
                onChange={(e) => setSourceLanguage(e.target.value)}
                className="w-full p-3 border border-[var(--border-color)] rounded-lg bg-[var(--bg-primary)] text-[var(--text-primary)] dyslexia-text focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="auto">Auto-detect</option>
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
              {detectedLanguage && (
                <p className="mt-1 text-xs text-[var(--text-secondary)] dyslexia-text">
                  Detected: {translationService.getLanguageName(detectedLanguage)}
                </p>
              )}
            </div>

            {/* Swap Button */}
            <button
              onClick={swapLanguages}
              disabled={sourceLanguage === 'auto'}
              className="mt-6 p-3 bg-[var(--bg-secondary)] text-[var(--text-secondary)] rounded-lg hover:text-[var(--text-primary)] hover:bg-primary-100 dark:hover:bg-primary-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <RotateCw className="h-5 w-5" />
            </button>

            {/* Target Language */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-[var(--text-primary)] dyslexia-text mb-2">
                To
              </label>
              <select
                value={targetLanguage}
                onChange={(e) => setTargetLanguage(e.target.value)}
                className="w-full p-3 border border-[var(--border-color)] rounded-lg bg-[var(--bg-primary)] text-[var(--text-primary)] dyslexia-text focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

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
                Enter Text
              </h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleSpeak(sourceText, sourceLanguage)}
                  disabled={!sourceText.trim()}
                  className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Volume2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleCopy(sourceText)}
                  disabled={!sourceText.trim()}
                  className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {copied ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
            </div>
            
            <textarea
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
              placeholder="Enter text to translate..."
              className="w-full h-48 p-4 border border-[var(--border-color)] rounded-lg bg-[var(--bg-primary)] text-[var(--text-primary)] dyslexia-text resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              style={{
                lineHeight: '1.8',
                letterSpacing: '0.05em'
              }}
            />
            
            <div className="flex items-center justify-between mt-4">
              <span className="text-sm text-[var(--text-secondary)] dyslexia-text">
                {sourceText.length} characters
              </span>
              <button
                onClick={handleTranslate}
                disabled={!sourceText.trim() || loading}
                className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors dyslexia-text"
              >
                {loading ? (
                  <>
                    <Loader className="h-4 w-4 mr-2 animate-spin" />
                    Translating...
                  </>
                ) : (
                  <>
                    Translate
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </button>
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
                Translation
              </h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleSpeak(translatedText, targetLanguage)}
                  disabled={!translatedText.trim()}
                  className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Volume2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleCopy(translatedText)}
                  disabled={!translatedText.trim()}
                  className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <div
              className="w-full h-48 p-4 border border-[var(--border-color)] rounded-lg bg-[var(--bg-secondary)] text-[var(--text-primary)] dyslexia-text overflow-y-auto"
              style={{
                lineHeight: '1.8',
                letterSpacing: '0.05em'
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
                  Translation will appear here
                </div>
              )}
            </div>
            
            {translatedText && (
              <div className="mt-4 text-sm text-[var(--text-secondary)] dyslexia-text">
                {translatedText.length} characters
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {sampleTexts.map((sample, index) => (
              <button
                key={index}
                onClick={() => setSourceText(sample.text)}
                className="p-4 text-left bg-[var(--bg-secondary)] rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
              >
                <div className="text-[var(--text-primary)] dyslexia-text">
                  {sample.text}
                </div>
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Translation