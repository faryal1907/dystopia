// client/src/pages/FocusMode.jsx
import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Focus, 
  X, 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Settings,
  Eye,
  Type,
  Palette
} from 'lucide-react'
import { ttsService } from '../utils/textToSpeech'

const FocusMode = () => {
  const [text, setText] = useState('')
  const [isFocusMode, setIsFocusMode] = useState(false)
  const [currentLineIndex, setCurrentLineIndex] = useState(0)
  const [isReading, setIsReading] = useState(false)
  const [readingSpeed, setReadingSpeed] = useState(200) // words per minute
  const [focusSettings, setFocusSettings] = useState({
    fontSize: 'large',
    lineHeight: 'relaxed',
    backgroundColor: 'dark',
    highlightColor: 'blue',
    showProgress: true,
    autoAdvance: false
  })
  const [showSettings, setShowSettings] = useState(false)
  const [lines, setLines] = useState([])
  
  const intervalRef = useRef(null)
  const focusRef = useRef(null)

  useEffect(() => {
    if (text) {
      // Split text into sentences for better focus reading
      const sentences = text.split(/[.!?]+/).filter(sentence => sentence.trim())
      setLines(sentences)
      setCurrentLineIndex(0)
    }
  }, [text])

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  const startFocusMode = () => {
    if (!text.trim()) return
    setIsFocusMode(true)
    setCurrentLineIndex(0)
  }

  const exitFocusMode = () => {
    setIsFocusMode(false)
    setIsReading(false)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    ttsService.stop()
  }

  const startReading = () => {
    if (focusSettings.autoAdvance) {
      setIsReading(true)
      const wordsInCurrentLine = lines[currentLineIndex]?.split(' ').length || 0
      const timePerLine = (wordsInCurrentLine / readingSpeed) * 60 * 1000 // milliseconds

      intervalRef.current = setInterval(() => {
        setCurrentLineIndex(prev => {
          if (prev < lines.length - 1) {
            return prev + 1
          } else {
            setIsReading(false)
            clearInterval(intervalRef.current)
            return prev
          }
        })
      }, timePerLine)
    }

    // Start text-to-speech
    if (lines[currentLineIndex]) {
      ttsService.speak(lines[currentLineIndex], {
        rate: readingSpeed / 200,
        onEnd: () => {
          if (!focusSettings.autoAdvance && currentLineIndex < lines.length - 1) {
            setCurrentLineIndex(prev => prev + 1)
          }
        }
      })
    }
  }

  const pauseReading = () => {
    setIsReading(false)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    ttsService.pause()
  }

  const nextLine = () => {
    if (currentLineIndex < lines.length - 1) {
      setCurrentLineIndex(prev => prev + 1)
      ttsService.stop()
    }
  }

  const prevLine = () => {
    if (currentLineIndex > 0) {
      setCurrentLineIndex(prev => prev - 1)
      ttsService.stop()
    }
  }

  const getFontSizeClass = (size) => {
    switch (size) {
      case 'small': return 'text-lg'
      case 'medium': return 'text-xl'
      case 'large': return 'text-2xl'
      case 'xl': return 'text-3xl'
      case 'xxl': return 'text-4xl'
      default: return 'text-xl'
    }
  }

  const getLineHeightClass = (height) => {
    switch (height) {
      case 'tight': return 'leading-tight'
      case 'normal': return 'leading-normal'
      case 'relaxed': return 'leading-relaxed'
      case 'loose': return 'leading-loose'
      default: return 'leading-relaxed'
    }
  }

  const getBackgroundClass = (bg) => {
    switch (bg) {
      case 'dark': return 'bg-gray-900 text-white'
      case 'sepia': return 'bg-yellow-50 text-gray-900'
      case 'high-contrast': return 'bg-black text-white'
      case 'blue': return 'bg-blue-900 text-blue-50'
      default: return 'bg-gray-900 text-white'
    }
  }

  const getHighlightClass = (color) => {
    switch (color) {
      case 'blue': return 'bg-blue-500/30 border-blue-500'
      case 'green': return 'bg-green-500/30 border-green-500'
      case 'yellow': return 'bg-yellow-500/30 border-yellow-500'
      case 'purple': return 'bg-purple-500/30 border-purple-500'
      default: return 'bg-blue-500/30 border-blue-500'
    }
  }

  const sampleText = `The benefits of reading are numerous and well-documented. Regular reading improves vocabulary, enhances cognitive function, and reduces stress levels. It also stimulates the brain, improves focus and concentration, and enhances empathy by allowing readers to experience different perspectives. For individuals with dyslexia or reading difficulties, tools like text-to-speech and focus mode can make reading more accessible and enjoyable. Technology has opened new doors for inclusive learning, ensuring that everyone can benefit from the joy and knowledge that reading provides. With proper tools and techniques, reading can become a lifelong passion rather than a challenge.`

  if (!isFocusMode) {
    return (
      <div className="min-h-screen bg-[var(--bg-secondary)] py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="inline-flex p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl mb-4">
              <Focus className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-[var(--text-primary)] dyslexia-text mb-2">
              Focus Mode
            </h1>
            <p className="text-[var(--text-secondary)] dyslexia-text">
              Distraction-free reading with line-by-line highlighting and customizable settings
            </p>
          </motion.div>

          {/* Text Input */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-[var(--bg-primary)] rounded-xl p-6 border border-[var(--border-color)] mb-8"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-[var(--text-primary)] dyslexia-text">
                Enter Text for Focus Reading
              </h2>
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] rounded-lg transition-colors"
              >
                <Settings className="h-5 w-5" />
              </button>
            </div>

            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste your text here or try the sample text below..."
              className="w-full h-48 p-4 border border-[var(--border-color)] rounded-lg bg-[var(--bg-primary)] text-[var(--text-primary)] dyslexia-text resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent mb-4"
              style={{
                lineHeight: '1.8',
                letterSpacing: '0.05em'
              }}
            />

            <div className="flex items-center justify-between">
              <button
                onClick={() => setText(sampleText)}
                className="px-4 py-2 bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-lg hover:bg-primary-100 dark:hover:bg-primary-800 transition-colors dyslexia-text"
              >
                Use Sample Text
              </button>
              <button
                onClick={startFocusMode}
                disabled={!text.trim()}
                className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors dyslexia-text"
              >
                <Focus className="h-5 w-5 mr-2" />
                Enter Focus Mode
              </button>
            </div>
          </motion.div>

          {/* Settings Panel */}
          <AnimatePresence>
            {showSettings && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-[var(--bg-primary)] rounded-xl p-6 border border-[var(--border-color)] mb-8"
              >
                <h3 className="text-lg font-semibold text-[var(--text-primary)] dyslexia-text mb-6">
                  Focus Mode Settings
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Typography Settings */}
                  <div>
                    <h4 className="font-medium text-[var(--text-primary)] dyslexia-text mb-4 flex items-center">
                      <Type className="h-4 w-4 mr-2" />
                      Typography
                    </h4>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm text-[var(--text-secondary)] dyslexia-text mb-2">
                          Font Size
                        </label>
                        <select
                          value={focusSettings.fontSize}
                          onChange={(e) => setFocusSettings(prev => ({ ...prev, fontSize: e.target.value }))}
                          className="w-full p-2 border border-[var(--border-color)] rounded-lg bg-[var(--bg-primary)] text-[var(--text-primary)] dyslexia-text"
                        >
                          <option value="small">Small</option>
                          <option value="medium">Medium</option>
                          <option value="large">Large</option>
                          <option value="xl">Extra Large</option>
                          <option value="xxl">Double XL</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm text-[var(--text-secondary)] dyslexia-text mb-2">
                          Line Height
                        </label>
                        <select
                          value={focusSettings.lineHeight}
                          onChange={(e) => setFocusSettings(prev => ({ ...prev, lineHeight: e.target.value }))}
                          className="w-full p-2 border border-[var(--border-color)] rounded-lg bg-[var(--bg-primary)] text-[var(--text-primary)] dyslexia-text"
                        >
                          <option value="tight">Tight</option>
                          <option value="normal">Normal</option>
                          <option value="relaxed">Relaxed</option>
                          <option value="loose">Loose</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Visual Settings */}
                  <div>
                    <h4 className="font-medium text-[var(--text-primary)] dyslexia-text mb-4 flex items-center">
                      <Palette className="h-4 w-4 mr-2" />
                      Visual
                    </h4>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm text-[var(--text-secondary)] dyslexia-text mb-2">
                          Background Theme
                        </label>
                        <select
                          value={focusSettings.backgroundColor}
                          onChange={(e) => setFocusSettings(prev => ({ ...prev, backgroundColor: e.target.value }))}
                          className="w-full p-2 border border-[var(--border-color)] rounded-lg bg-[var(--bg-primary)] text-[var(--text-primary)] dyslexia-text"
                        >
                          <option value="dark">Dark</option>
                          <option value="sepia">Sepia</option>
                          <option value="high-contrast">High Contrast</option>
                          <option value="blue">Blue Night</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm text-[var(--text-secondary)] dyslexia-text mb-2">
                          Highlight Color
                        </label>
                        <select
                          value={focusSettings.highlightColor}
                          onChange={(e) => setFocusSettings(prev => ({ ...prev, highlightColor: e.target.value }))}
                          className="w-full p-2 border border-[var(--border-color)] rounded-lg bg-[var(--bg-primary)] text-[var(--text-primary)] dyslexia-text"
                        >
                          <option value="blue">Blue</option>
                          <option value="green">Green</option>
                          <option value="yellow">Yellow</option>
                          <option value="purple">Purple</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex items-center space-x-6">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={focusSettings.showProgress}
                      onChange={(e) => setFocusSettings(prev => ({ ...prev, showProgress: e.target.checked }))}
                      className="mr-2"
                    />
                    <span className="text-[var(--text-primary)] dyslexia-text">Show Progress</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={focusSettings.autoAdvance}
                      onChange={(e) => setFocusSettings(prev => ({ ...prev, autoAdvance: e.target.checked }))}
                      className="mr-2"
                    />
                    <span className="text-[var(--text-primary)] dyslexia-text">Auto Advance</span>
                  </label>
                </div>

                <div className="mt-4">
                  <label className="block text-sm text-[var(--text-secondary)] dyslexia-text mb-2">
                    Reading Speed: {readingSpeed} WPM
                  </label>
                  <input
                    type="range"
                    min="100"
                    max="400"
                    step="25"
                    value={readingSpeed}
                    onChange={(e) => setReadingSpeed(parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`fixed inset-0 z-50 ${getBackgroundClass(focusSettings.backgroundColor)} flex flex-col focus-mode`}
      ref={focusRef}
    >
      {/* Header Controls */}
      <div className="flex items-center justify-between p-6 border-b border-white/10">
        <div className="flex items-center space-x-4">
          <button
            onClick={exitFocusMode}
            className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
          
          <div className="text-white/70 dyslexia-text">
            Focus Mode
          </div>
        </div>

        {focusSettings.showProgress && (
          <div className="flex items-center space-x-4">
            <div className="text-white/70 dyslexia-text">
              {currentLineIndex + 1} / {lines.length}
            </div>
            <div className="w-32 bg-white/20 rounded-full h-2">
              <div 
                className="bg-white h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentLineIndex + 1) / lines.length) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Main Reading Area */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-4xl w-full">
          {lines.map((line, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0.3 }}
              animate={{ 
                opacity: index === currentLineIndex ? 1 : 0.3,
                scale: index === currentLineIndex ? 1 : 0.95
              }}
              className={`p-6 mb-4 rounded-lg dyslexia-text transition-all duration-300 ${
                index === currentLineIndex 
                  ? `${getHighlightClass(focusSettings.highlightColor)} border-2 reading-line`
                  : 'border-2 border-transparent'
              } ${getFontSizeClass(focusSettings.fontSize)} ${getLineHeightClass(focusSettings.lineHeight)}`}
              style={{
                letterSpacing: '0.05em',
                wordSpacing: '0.1em'
              }}
            >
              {line.trim()}.
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="flex items-center justify-center p-6 border-t border-white/10">
        <div className="flex items-center space-x-4">
          <button
            onClick={prevLine}
            disabled={currentLineIndex === 0}
            className="p-3 text-white/70 hover:text-white hover:bg-white/10 rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <SkipBack className="h-6 w-6" />
          </button>
          
          <button
            onClick={isReading ? pauseReading : startReading}
            className="p-4 bg-white/20 text-white hover:bg-white/30 rounded-full transition-colors"
          >
            {isReading ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
          </button>
          
          <button
            onClick={nextLine}
            disabled={currentLineIndex === lines.length - 1}
            className="p-3 text-white/70 hover:text-white hover:bg-white/10 rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <SkipForward className="h-6 w-6" />
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default FocusMode