import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Focus, Play, Pause, Square, Settings as SettingsIcon, X, ArrowLeft, Sliders } from 'lucide-react'
import { useUser } from '../context/UserContext.jsx'
import { useNavigate } from 'react-router-dom'

const FocusMode = () => {
  const { settings, saveReadingProgress } = useUser()
  const navigate = useNavigate()
  const [text, setText] = useState('')
  const [isPlaying, setIsPlaying] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [words, setWords] = useState([])
  const [showSettings, setShowSettings] = useState(false)
  const [speed, setSpeed] = useState(settings?.focusModeSpeed || 200)
  const [pauseTime, setPauseTime] = useState(settings?.focusPauseTime || 500)
  const [wordByWord, setWordByWord] = useState(settings?.focusWordByWord || false)
  const intervalRef = useRef(null)
  const startTimeRef = useRef(null)

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  const handleStart = () => {
    if (!text.trim()) return

    const textWords = text.split(' ').filter(w => w.trim())
    setWords(textWords)
    setCurrentIndex(0)
    setIsPlaying(true)
    setIsPaused(false)
    startTimeRef.current = Date.now()

    intervalRef.current = setInterval(() => {
      setCurrentIndex(prev => {
        const nextIndex = prev + 1
        if (nextIndex >= textWords.length) {
          handleStop()
          return prev
        }
        return nextIndex
      })
    }, 60000 / speed)
  }

  const handlePause = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setIsPaused(true)
    setIsPlaying(false)
  }

  const handleResume = () => {
    setIsPaused(false)
    setIsPlaying(true)

    intervalRef.current = setInterval(() => {
      setCurrentIndex(prev => {
        const nextIndex = prev + 1
        if (nextIndex >= words.length) {
          handleStop()
          return prev
        }
        return nextIndex
      })
    }, 60000 / speed)
  }

  const handleStop = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setIsPlaying(false)
    setIsPaused(false)

    // Save reading progress
    if (startTimeRef.current && currentIndex > 0) {
      const duration = Date.now() - startTimeRef.current
      saveReadingProgress(`focus-${Date.now()}`, {
        text: text.substring(0, 100),
        completed: currentIndex >= words.length - 1,
        duration,
        sessionType: 'focus-mode',
        progress: (currentIndex / words.length) * 100
      })
    }

    setCurrentIndex(0)
  }

  const getDisplayText = () => {
    if (words.length === 0) return ''

    if (wordByWord) {
      return words[currentIndex] || ''
    } else {
      const wordsPerLine = 5
      const startIdx = Math.max(0, currentIndex - 2)
      const endIdx = Math.min(words.length, startIdx + wordsPerLine)
      return words.slice(startIdx, endIdx).map((word, idx) => {
        const wordIdx = startIdx + idx
        if (wordIdx === currentIndex) {
          return `<span class="current-word">${word}</span>`
        } else if (wordIdx < currentIndex) {
          return `<span class="completed-word">${word}</span>`
        } else {
          return `<span class="upcoming-word">${word}</span>`
        }
      }).join(' ')
    }
  }

  const progress = words.length > 0 ? (currentIndex / words.length) * 100 : 0

  const sampleTexts = [
    {
      title: "Focus Exercise",
      content: "Reading in focus mode helps improve concentration and comprehension. By displaying words one at a time, your brain can process information more effectively without distractions."
    },
    {
      title: "Quick Practice",
      content: "This is a short practice text for testing focus mode. Try different speeds to find what works best for you."
    }
  ]

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
                <Focus className="h-5 w-5" />
              </div>
              <h1 className="text-xl font-bold dyslexia-text">Focus Mode</h1>
            </div>
          </div>

          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <SettingsIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-gray-800 border-b border-gray-700 px-4 py-6"
          >
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold dyslexia-text">Focus Mode Settings</h2>
                <button
                  onClick={() => setShowSettings(false)}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2 dyslexia-text">
                    Reading Speed: {speed} WPM
                  </label>
                  <input
                    type="range"
                    min="100"
                    max="400"
                    step="25"
                    value={speed}
                    onChange={(e) => setSpeed(parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 dyslexia-text">
                    Pause Between Lines: {pauseTime}ms
                  </label>
                  <input
                    type="range"
                    min="200"
                    max="2000"
                    step="100"
                    value={pauseTime}
                    onChange={(e) => setPauseTime(parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={wordByWord}
                      onChange={(e) => setWordByWord(e.target.checked)}
                      className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500"
                    />
                    <span className="dyslexia-text">Word-by-Word Mode</span>
                  </label>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Input Section */}
        {!isPlaying && !isPaused && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h2 className="text-lg font-semibold mb-4 dyslexia-text">Enter Text</h2>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste your text here to begin reading in focus mode..."
                className="w-full h-48 p-4 bg-gray-900 border border-gray-700 rounded-lg text-white dyslexia-text resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
                style={{
                  lineHeight: '1.8',
                  letterSpacing: '0.05em'
                }}
              />

              <div className="flex items-center justify-between mt-4">
                <span className="text-sm text-gray-400 dyslexia-text">
                  {text.split(' ').filter(w => w.trim()).length} words
                </span>
                <button
                  onClick={handleStart}
                  disabled={!text.trim()}
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors dyslexia-text"
                >
                  <Play className="h-5 w-5 mr-2" />
                  Start Focus Reading
                </button>
              </div>
            </div>

            {/* Sample Texts */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4 dyslexia-text">Sample Texts</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sampleTexts.map((sample, index) => (
                  <button
                    key={index}
                    onClick={() => setText(sample.content)}
                    className="text-left p-4 bg-gray-800 rounded-lg hover:bg-gray-750 transition-colors border border-gray-700"
                  >
                    <div className="font-medium text-white dyslexia-text mb-2">
                      {sample.title}
                    </div>
                    <div className="text-sm text-gray-400 dyslexia-text line-clamp-2">
                      {sample.content.substring(0, 100)}...
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Reading Display */}
        {(isPlaying || isPaused) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center min-h-[60vh]"
          >
            <div className="w-full max-w-4xl">
              {/* Progress Bar */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400 dyslexia-text">
                    Progress: {currentIndex + 1} / {words.length}
                  </span>
                  <span className="text-sm text-gray-400 dyslexia-text">
                    {Math.round(progress)}%
                  </span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Word Display */}
              <div className="bg-gray-800 rounded-2xl p-12 border border-gray-700 min-h-[300px] flex items-center justify-center">
                <div
                  className="text-4xl md:text-6xl font-bold text-center dyslexia-text"
                  style={{
                    lineHeight: '1.6',
                    letterSpacing: '0.05em'
                  }}
                  dangerouslySetInnerHTML={{ __html: getDisplayText() }}
                />
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center space-x-4 mt-8">
                {!isPaused ? (
                  <button
                    onClick={handlePause}
                    className="flex items-center justify-center w-14 h-14 bg-yellow-600 text-white rounded-full hover:bg-yellow-700 transition-colors"
                  >
                    <Pause className="h-6 w-6" />
                  </button>
                ) : (
                  <button
                    onClick={handleResume}
                    className="flex items-center justify-center w-14 h-14 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors"
                  >
                    <Play className="h-6 w-6" />
                  </button>
                )}

                <button
                  onClick={handleStop}
                  className="flex items-center justify-center w-14 h-14 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                >
                  <Square className="h-6 w-6" />
                </button>
              </div>

              <div className="text-center mt-4">
                <span className="text-sm text-gray-400 dyslexia-text">
                  {isPaused ? 'Paused' : 'Reading...'}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      <style>{`
        .current-word {
          background: rgba(168, 85, 247, 0.3);
          padding: 8px 16px;
          border-radius: 8px;
          animation: pulse 1s infinite;
        }

        .completed-word {
          opacity: 0.5;
        }

        .upcoming-word {
          opacity: 0.3;
        }

        @keyframes pulse {
          0%, 100% { background: rgba(168, 85, 247, 0.3); }
          50% { background: rgba(168, 85, 247, 0.5); }
        }
      `}</style>
    </div>
  )
}

export default FocusMode
