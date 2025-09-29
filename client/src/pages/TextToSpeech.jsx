// client/src/pages/TextToSpeech.jsx
import React, { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Play, Pause, Square, Upload, Volume2, Settings, Download, Copy, RotateCcw, Sliders } from 'lucide-react'
import { ttsService } from '../utils/textToSpeech'
import { useUser } from '../context/UserContext'

const TextToSpeech = () => {
  const { saveReadingProgress } = useUser()
  const [text, setText] = useState('')
  const [isPlaying, setIsPlaying] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [voices, setVoices] = useState([])
  const [selectedVoice, setSelectedVoice] = useState('')
  const [rate, setRate] = useState(1.0)
  const [pitch, setPitch] = useState(1.0)
  const [volume, setVolume] = useState(1.0)
  const [showSettings, setShowSettings] = useState(false)
  const [currentPosition, setCurrentPosition] = useState(0)
  const [highlightedText, setHighlightedText] = useState('')
  const fileInputRef = useRef(null)

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = ttsService.getVoices()
      setVoices(availableVoices)
      if (availableVoices.length > 0 && !selectedVoice) {
        setSelectedVoice(availableVoices[0].name)
      }
    }

    loadVoices()
    const interval = setInterval(loadVoices, 100)
    setTimeout(() => clearInterval(interval), 1000)
  }, [])

  const handleSpeak = () => {
    if (!text.trim()) return

    const options = {
      rate,
      pitch,
      volume,
      voice: selectedVoice,
      onStart: () => {
        setIsPlaying(true)
        setIsPaused(false)
      },
      onEnd: () => {
        setIsPlaying(false)
        setIsPaused(false)
        setCurrentPosition(0)
        // Save reading progress
        saveReadingProgress(`tts-${Date.now()}`, {
          text: text.substring(0, 100),
          completed: true,
          duration: Date.now()
        })
      },
      onPause: () => setIsPaused(true),
      onResume: () => setIsPaused(false),
      onError: (error) => {
        console.error('TTS Error:', error)
        setIsPlaying(false)
        setIsPaused(false)
      }
    }

    ttsService.speak(text, options)
  }

  const handlePause = () => {
    if (isPlaying && !isPaused) {
      ttsService.pause()
    } else if (isPaused) {
      ttsService.resume()
    }
  }

  const handleStop = () => {
    ttsService.stop()
    setIsPlaying(false)
    setIsPaused(false)
    setCurrentPosition(0)
  }

  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (file && file.type === 'text/plain') {
      const reader = new FileReader()
      reader.onload = (e) => {
        setText(e.target.result)
      }
      reader.readAsText(file)
    }
  }

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(text)
    } catch (err) {
      console.error('Failed to copy text:', err)
    }
  }

  const handleClear = () => {
    setText('')
    handleStop()
  }

  const sampleTexts = [
    {
      title: "Welcome to VOXA",
      content: "VOXA is designed to make reading more accessible and enjoyable for everyone. Our text-to-speech feature uses advanced AI to provide natural-sounding voices that can help you consume content in a whole new way."
    },
    {
      title: "Reading Benefits",
      content: "Regular reading improves vocabulary, enhances focus, reduces stress, and stimulates mental activity. With VOXA's accessibility features, everyone can enjoy these benefits regardless of reading challenges."
    },
    {
      title: "Technology and Learning",
      content: "Modern technology has revolutionized the way we learn and process information. Tools like text-to-speech, real-time translation, and focus modes are breaking down barriers to education and making knowledge more accessible than ever before."
    }
  ]

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)] py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl mb-4">
            <Volume2 className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)] dyslexia-text mb-2">
            Text to Speech
          </h1>
          <p className="text-[var(--text-secondary)] dyslexia-text">
            Convert any text into natural-sounding speech with customizable voice settings
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Text Input */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[var(--bg-primary)] rounded-xl p-6 border border-[var(--border-color)]"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-[var(--text-primary)] dyslexia-text">
                  Enter Text
                </h2>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2 bg-[var(--bg-secondary)] text-[var(--text-secondary)] rounded-lg hover:text-[var(--text-primary)] hover:bg-primary-100 dark:hover:bg-primary-800 transition-colors"
                    title="Upload file"
                  >
                    <Upload className="h-4 w-4" />
                  </button>
                  <button
                    onClick={handleCopyText}
                    className="p-2 bg-[var(--bg-secondary)] text-[var(--text-secondary)] rounded-lg hover:text-[var(--text-primary)] hover:bg-primary-100 dark:hover:bg-primary-800 transition-colors"
                    title="Copy text"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                  <button
                    onClick={handleClear}
                    className="p-2 bg-[var(--bg-secondary)] text-[var(--text-secondary)] rounded-lg hover:text-[var(--text-primary)] hover:bg-primary-100 dark:hover:bg-primary-800 transition-colors"
                    title="Clear text"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste or type your text here, or upload a text file..."
                className="w-full h-64 p-4 border border-[var(--border-color)] rounded-lg bg-[var(--bg-primary)] text-[var(--text-primary)] dyslexia-text resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                style={{
                  lineHeight: '1.8',
                  letterSpacing: '0.05em'
                }}
              />
              
              <input
                ref={fileInputRef}
                type="file"
                accept=".txt"
                onChange={handleFileUpload}
                className="hidden"
              />
              
              <div className="flex items-center justify-between mt-4">
                <span className="text-sm text-[var(--text-secondary)] dyslexia-text">
                  {text.length} characters
                </span>
                <div className="text-sm text-[var(--text-secondary)] dyslexia-text">
                  Estimated reading time: {Math.ceil(text.split(' ').length / 200)} min
                </div>
              </div>
            </motion.div>

            {/* Sample Texts */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-[var(--bg-primary)] rounded-xl p-6 border border-[var(--border-color)]"
            >
              <h3 className="text-lg font-semibold text-[var(--text-primary)] dyslexia-text mb-4">
                Try Sample Texts
              </h3>
              <div className="space-y-3">
                {sampleTexts.map((sample, index) => (
                  <button
                    key={index}
                    onClick={() => setText(sample.content)}
                    className="w-full text-left p-3 bg-[var(--bg-secondary)] rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
                  >
                    <div className="font-medium text-[var(--text-primary)] dyslexia-text mb-1">
                      {sample.title}
                    </div>
                    <div className="text-sm text-[var(--text-secondary)] dyslexia-text line-clamp-2">
                      {sample.content.substring(0, 100)}...
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Controls */}
          <div className="space-y-6">
            {/* Playback Controls */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-[var(--bg-primary)] rounded-xl p-6 border border-[var(--border-color)]"
            >
              <h3 className="text-lg font-semibold text-[var(--text-primary)] dyslexia-text mb-4">
                Playback Controls
              </h3>
              
              <div className="flex items-center justify-center space-x-4 mb-6">
                <motion.button
                  onClick={handleSpeak}
                  disabled={!text.trim() || (isPlaying && !isPaused)}
                  className="flex items-center justify-center w-12 h-12 bg-primary-600 text-white rounded-full hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Play className="h-6 w-6" />
                </motion.button>
                
                <motion.button
                  onClick={handlePause}
                  disabled={!isPlaying}
                  className="flex items-center justify-center w-12 h-12 bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-full hover:bg-primary-100 dark:hover:bg-primary-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Pause className="h-6 w-6" />
                </motion.button>
                
                <motion.button
                  onClick={handleStop}
                  disabled={!isPlaying && !isPaused}
                  className="flex items-center justify-center w-12 h-12 bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-full hover:bg-red-100 dark:hover:bg-red-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Square className="h-6 w-6" />
                </motion.button>
              </div>

              <div className="text-center mb-4">
                <div className="text-sm text-[var(--text-secondary)] dyslexia-text">
                  {isPlaying ? (isPaused ? 'Paused' : 'Playing') : 'Stopped'}
                </div>
              </div>
            </motion.div>

            {/* Voice Settings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-[var(--bg-primary)] rounded-xl p-6 border border-[var(--border-color)]"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-[var(--text-primary)] dyslexia-text">
                  Voice Settings
                </h3>
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                >
                  <Sliders className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Voice Selection */}
                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)] dyslexia-text mb-2">
                    Voice
                  </label>
                  <select
                    value={selectedVoice}
                    onChange={(e) => setSelectedVoice(e.target.value)}
                    className="w-full p-3 border border-[var(--border-color)] rounded-lg bg-[var(--bg-primary)] text-[var(--text-primary)] dyslexia-text focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    {voices.map((voice) => (
                      <option key={voice.name} value={voice.name}>
                        {voice.name} ({voice.lang})
                      </option>
                    ))}
                  </select>
                </div>

                {showSettings && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="space-y-4"
                  >
                    {/* Speed */}
                    <div>
                      <label className="block text-sm font-medium text-[var(--text-primary)] dyslexia-text mb-2">
                        Speed: {rate.toFixed(1)}x
                      </label>
                      <input
                        type="range"
                        min="0.5"
                        max="2"
                        step="0.1"
                        value={rate}
                        onChange={(e) => setRate(parseFloat(e.target.value))}
                        className="w-full"
                      />
                    </div>

                    {/* Pitch */}
                    <div>
                      <label className="block text-sm font-medium text-[var(--text-primary)] dyslexia-text mb-2">
                        Pitch: {pitch.toFixed(1)}
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="2"
                        step="0.1"
                        value={pitch}
                        onChange={(e) => setPitch(parseFloat(e.target.value))}
                        className="w-full"
                      />
                    </div>

                    {/* Volume */}
                    <div>
                      <label className="block text-sm font-medium text-[var(--text-primary)] dyslexia-text mb-2">
                        Volume: {Math.round(volume * 100)}%
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={volume}
                        onChange={(e) => setVolume(parseFloat(e.target.value))}
                        className="w-full"
                      />
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TextToSpeech