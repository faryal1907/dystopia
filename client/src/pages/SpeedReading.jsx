import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, Play, Pause, CheckCircle, Trophy, TrendingUp, Target, BookOpen, Award, Clock, BarChart3 } from 'lucide-react'
import { speedReadingService } from '../services/speedReadingService'
import { useUser } from '../context/UserContext'
import { Line } from 'recharts'
import { LineChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useTheme } from '../context/ThemeContext'

const SpeedReading = () => {
  const { isDark } = useTheme()
  const { saveReadingProgress } = useUser()
  const [mode, setMode] = useState('home') // home, test, train, results
  const [selectedLevel, setSelectedLevel] = useState(1)
  const [isReading, setIsReading] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [words, setWords] = useState([])
  const [startTime, setStartTime] = useState(null)
  const [testResults, setTestResults] = useState(null)
  const [showQuiz, setShowQuiz] = useState(false)
  const [quizAnswers, setQuizAnswers] = useState([])
  const [history, setHistory] = useState([])
  
  const intervalRef = useRef(null)

  // Load history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('speed-reading-history')
    if (saved) {
      try {
        setHistory(JSON.parse(saved))
      } catch (e) {
        console.error('Error loading history:', e)
      }
    }
  }, [])

  const startTest = (level) => {
    const text = speedReadingService.getPracticeText(level)
    const textWords = text.split(' ')
    setWords(textWords)
    setCurrentWordIndex(0)
    setSelectedLevel(level)
    setMode('train')
    setStartTime(null)
    setIsReading(false)
    setIsPaused(false)
  }

  const handleStart = () => {
    if (!startTime) {
      setStartTime(Date.now())
    }
    setIsReading(true)
    setIsPaused(false)

    const wpm = speedReadingService.levels.find(l => l.id === selectedLevel)?.wpm || 200
    const msPerWord = 60000 / wpm

    intervalRef.current = setInterval(() => {
      setCurrentWordIndex(prev => {
        if (prev >= words.length - 1) {
          handleFinish()
          return prev
        }
        return prev + 1
      })
    }, msPerWord)
  }

  const handlePause = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    setIsPaused(true)
    setIsReading(false)
  }

  const handleFinish = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    
    const duration = Date.now() - startTime
    const wpm = speedReadingService.calculateWPM(words.length, duration)
    
    setTestResults({
      wpm,
      duration,
      wordCount: words.length,
      level: selectedLevel
    })
    
    setIsReading(false)
    setShowQuiz(true)
  }

  const handleQuizComplete = async (answers) => {
    const questions = speedReadingService.getComprehensionQuestions(selectedLevel)
    const correct = answers.filter((a, i) => a === questions[i].correct).length
    const comprehension = Math.round((correct / questions.length) * 100)

    const result = {
      ...testResults,
      comprehension,
      correct,
      total: questions.length,
      date: new Date().toISOString()
    }

    // Save to history
    const newHistory = [result, ...history.slice(0, 19)]
    setHistory(newHistory)
    localStorage.setItem('speed-reading-history', JSON.stringify(newHistory))

    // Save to reading progress
    try {
      await saveReadingProgress(`speed-reading-${Date.now()}`, {
        text: words.join(' ').substring(0, 100),
        completed: true,
        duration: result.duration,
        sessionType: 'speed-reading',
        progress: 100
      })
    } catch (error) {
      console.warn('Could not save progress:', error)
    }

    setMode('results')
    setShowQuiz(false)
  }

  const getProgressData = () => {
    return history.slice(0, 10).reverse().map((h, i) => ({
      session: i + 1,
      wpm: h.wpm,
      comprehension: h.comprehension
    }))
  }

  const averageWPM = history.length > 0
    ? Math.round(history.reduce((sum, h) => sum + h.wpm, 0) / history.length)
    : 0

  const bestWPM = history.length > 0
    ? Math.max(...history.map(h => h.wpm))
    : 0

  // Home Screen
  if (mode === 'home') {
    return (
      <div className="min-h-screen bg-[var(--bg-secondary)] py-8">
        <div className="max-w-6xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="inline-flex p-3 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl mb-4"
            >
              <Zap className="h-8 w-8 text-white" />
            </motion.div>
            <h1 className="text-3xl font-bold text-[var(--text-primary)] dyslexia-text mb-2">
              Speed Reading Trainer
            </h1>
            <p className="text-[var(--text-secondary)] dyslexia-text">
              Improve your reading speed while maintaining comprehension
            </p>
          </div>

          {/* Stats */}
          {history.length > 0 && (
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-[var(--bg-primary)] rounded-xl p-6 border border-[var(--border-color)]">
                <Trophy className="h-6 w-6 text-yellow-600 mb-2" />
                <div className="text-2xl font-bold text-[var(--text-primary)] dyslexia-text">
                  {bestWPM}
                </div>
                <div className="text-sm text-[var(--text-secondary)] dyslexia-text">
                  Best WPM
                </div>
              </div>
              <div className="bg-[var(--bg-primary)] rounded-xl p-6 border border-[var(--border-color)]">
                <TrendingUp className="h-6 w-6 text-green-600 mb-2" />
                <div className="text-2xl font-bold text-[var(--text-primary)] dyslexia-text">
                  {averageWPM}
                </div>
                <div className="text-sm text-[var(--text-secondary)] dyslexia-text">
                  Average WPM
                </div>
              </div>
              <div className="bg-[var(--bg-primary)] rounded-xl p-6 border border-[var(--border-color)]">
                <BarChart3 className="h-6 w-6 text-blue-600 mb-2" />
                <div className="text-2xl font-bold text-[var(--text-primary)] dyslexia-text">
                  {history.length}
                </div>
                <div className="text-sm text-[var(--text-secondary)] dyslexia-text">
                  Sessions
                </div>
              </div>
            </div>
          )}

          {/* Training Levels */}
          <div className="bg-[var(--bg-primary)] rounded-xl p-6 border border-[var(--border-color)] mb-8">
            <h2 className="text-xl font-bold text-[var(--text-primary)] dyslexia-text mb-6">
              Choose Your Level
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {speedReadingService.levels.map((level) => (
                <motion.button
                  key={level.id}
                  onClick={() => startTest(level.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="text-left p-6 bg-[var(--bg-secondary)] rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all border-2 border-transparent hover:border-orange-500"
                >
                  <div className="text-4xl mb-3">{level.icon}</div>
                  <h3 className="text-lg font-bold text-[var(--text-primary)] dyslexia-text mb-2">
                    {level.name}
                  </h3>
                  <div className="text-2xl font-bold text-orange-600 mb-2">
                    {level.wpm} WPM
                  </div>
                  <p className="text-sm text-[var(--text-secondary)] dyslexia-text">
                    {level.description}
                  </p>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Progress Chart */}
          {history.length > 2 && (
            <div className="bg-[var(--bg-primary)] rounded-xl p-6 border border-[var(--border-color)]">
              <h2 className="text-xl font-bold text-[var(--text-primary)] dyslexia-text mb-6">
                Your Progress
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={getProgressData()}>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#374151' : '#e5e7eb'} />
                  <XAxis 
                    dataKey="session" 
                    stroke={isDark ? '#9ca3af' : '#6b7280'}
                    label={{ value: 'Session', position: 'insideBottom', offset: -5 }}
                  />
                  <YAxis stroke={isDark ? '#9ca3af' : '#6b7280'} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: isDark ? '#1f2937' : '#ffffff',
                      border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
                      borderRadius: '8px'
                    }}
                  />
                  <Line type="monotone" dataKey="wpm" stroke="#f97316" strokeWidth={2} name="WPM" />
                  <Line type="monotone" dataKey="comprehension" stroke="#8b5cf6" strokeWidth={2} name="Comprehension %" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Training Screen
  if (mode === 'train') {
    const level = speedReadingService.levels.find(l => l.id === selectedLevel)
    const progress = words.length > 0 ? (currentWordIndex / words.length) * 100 : 0

    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
        <div className="max-w-4xl w-full">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold dyslexia-text mb-1">
                {level.name} Level • {level.wpm} WPM
              </h2>
              <p className="text-gray-400 dyslexia-text">
                Word {currentWordIndex + 1} of {words.length}
              </p>
            </div>
            <button
              onClick={() => {
                if (intervalRef.current) clearInterval(intervalRef.current)
                setMode('home')
              }}
              className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Exit
            </button>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-800 rounded-full h-2 mb-8">
            <motion.div
              className="bg-gradient-to-r from-orange-500 to-amber-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* Word Display */}
          <div className="bg-gray-800 rounded-2xl p-16 mb-8 min-h-[300px] flex items-center justify-center">
            <motion.div
              key={currentWordIndex}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="text-6xl font-bold text-center dyslexia-text"
            >
              {words[currentWordIndex]}
            </motion.div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center space-x-4">
            {!isReading && !isPaused && (
              <button
                onClick={handleStart}
                className="flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all font-bold text-lg"
              >
                <Play className="h-6 w-6" />
                <span>Start Reading</span>
              </button>
            )}

            {isReading && (
              <button
                onClick={handlePause}
                className="flex items-center space-x-2 px-8 py-4 bg-yellow-600 text-white rounded-xl hover:bg-yellow-700 transition-all font-bold text-lg"
              >
                <Pause className="h-6 w-6" />
                <span>Pause</span>
              </button>
            )}

            {isPaused && (
              <>
                <button
                  onClick={handleStart}
                  className="flex items-center space-x-2 px-8 py-4 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all font-bold text-lg"
                >
                  <Play className="h-6 w-6" />
                  <span>Resume</span>
                </button>
                <button
                  onClick={handleFinish}
                  className="flex items-center space-x-2 px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-bold text-lg"
                >
                  <CheckCircle className="h-6 w-6" />
                  <span>Finish</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Quiz Modal */}
        {showQuiz && (
          <SpeedReadingQuiz
            questions={speedReadingService.getComprehensionQuestions(selectedLevel)}
            onComplete={handleQuizComplete}
          />
        )}
      </div>
    )
  }

  // Results Screen
  if (mode === 'results' && testResults) {
    const level = speedReadingService.getLevelForWPM(testResults.wpm)
    const nextLevel = speedReadingService.getNextLevel(testResults.wpm)
    const recommendation = speedReadingService.getRecommendation(testResults.wpm, testResults.comprehension)

    return (
      <div className="min-h-screen bg-[var(--bg-secondary)] py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-[var(--bg-primary)] rounded-2xl p-8 border border-[var(--border-color)]">
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="inline-flex p-4 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full mb-4"
              >
                <Trophy className="h-12 w-12 text-white" />
              </motion.div>
              <h2 className="text-3xl font-bold text-[var(--text-primary)] dyslexia-text mb-2">
                Session Complete!
              </h2>
              <p className="text-[var(--text-secondary)] dyslexia-text">
                Here's how you did
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="text-center p-4 bg-[var(--bg-secondary)] rounded-lg">
                <div className="text-3xl font-bold text-orange-600 dyslexia-text">
                  {testResults.wpm}
                </div>
                <div className="text-sm text-[var(--text-secondary)] dyslexia-text">
                  Words/Min
                </div>
              </div>
              <div className="text-center p-4 bg-[var(--bg-secondary)] rounded-lg">
                <div className="text-3xl font-bold text-purple-600 dyslexia-text">
                  {testResults.comprehension}%
                </div>
                <div className="text-sm text-[var(--text-secondary)] dyslexia-text">
                  Comprehension
                </div>
              </div>
              <div className="text-center p-4 bg-[var(--bg-secondary)] rounded-lg">
                <div className="text-3xl font-bold text-blue-600 dyslexia-text">
                  {Math.round(testResults.duration / 1000)}s
                </div>
                <div className="text-sm text-[var(--text-secondary)] dyslexia-text">
                  Time
                </div>
              </div>
              <div className="text-center p-4 bg-[var(--bg-secondary)] rounded-lg">
                <div className="text-3xl dyslexia-text">
                  {level.icon}
                </div>
                <div className="text-sm text-[var(--text-secondary)] dyslexia-text">
                  {level.name}
                </div>
              </div>
            </div>

            {/* Recommendation */}
            <div className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-lg p-6 mb-8 border-2 border-orange-200 dark:border-orange-800">
              <div className="flex items-start space-x-4">
                <div className="text-4xl">{recommendation.icon}</div>
                <div>
                  <h3 className="text-lg font-bold text-[var(--text-primary)] dyslexia-text mb-2">
                    {recommendation.message}
                  </h3>
                  <p className="text-[var(--text-secondary)] dyslexia-text">
                    {recommendation.action}
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => setMode('home')}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-lg hover:from-orange-700 hover:to-amber-700 transition-all font-medium dyslexia-text"
              >
                Back to Home
              </button>
              {nextLevel && (
                <button
                  onClick={() => startTest(nextLevel.id)}
                  className="flex-1 px-6 py-3 bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/20 transition-all font-medium dyslexia-text border-2 border-orange-500"
                >
                  Try {nextLevel.name} ({nextLevel.wpm} WPM)
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return null
}

// Simple Quiz Component
const SpeedReadingQuiz = ({ questions, onComplete }) => {
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState([])
  const [selected, setSelected] = useState(null)

  const handleNext = () => {
    const newAnswers = [...answers, selected]
    
    if (currentQ < questions.length - 1) {
      setAnswers(newAnswers)
      setCurrentQ(currentQ + 1)
      setSelected(null)
    } else {
      onComplete(newAnswers)
    }
  }

  const question = questions[currentQ]

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-2xl w-full">
        <h3 className="text-xl font-bold text-[var(--text-primary)] dyslexia-text mb-6">
          Question {currentQ + 1} of {questions.length}
        </h3>
        <p className="text-lg text-[var(--text-primary)] dyslexia-text mb-6">
          {question.question}
        </p>
        <div className="space-y-3 mb-6">
          {question.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className={`w-full text-left p-4 rounded-lg border-2 transition-all dyslexia-text ${
                selected === i
                  ? 'bg-orange-100 dark:bg-orange-900/30 border-orange-500'
                  : 'bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:border-orange-500'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
        <button
          onClick={handleNext}
          disabled={selected === null}
          className="w-full px-6 py-3 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-lg hover:from-orange-700 hover:to-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium dyslexia-text"
        >
          {currentQ < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
        </button>
      </div>
    </div>
  )
}

export default SpeedReading
