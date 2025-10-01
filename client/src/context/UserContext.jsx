// src/context/UserContext.jsx
import React, { createContext, useContext, useState, useEffect, useRef } from 'react'
import { useAuth } from './AuthContext'
import { api } from '../utils/api'

const UserContext = createContext({})

export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}

export const UserProvider = ({ children }) => {
  const { user } = useAuth()
  const [userProfile, setUserProfile] = useState(null)
  const [readingProgress, setReadingProgress] = useState([])
  const [achievements, setAchievements] = useState([])
  const [stats, setStats] = useState({
    totalTextsRead: 0,
    totalReadingTime: 0,
    readingStreak: 0,
    averageSessionTime: 0
  })
  const [settings, setSettings] = useState({
    fontSize: 'medium',
    lineHeight: 'normal',
    letterSpacing: 'normal',
    readingSpeed: 1.0,
    voice: 'default',
    autoPlay: false,
    highlightReading: true,
    showProgress: true,
    language: 'en'
  })
  const [loading, setLoading] = useState(false)

  // Rate limiting: track last fetch time
  const lastFetchRef = useRef({
    profile: 0,
    progress: 0,
    achievements: 0,
    settings: 0,
    stats: 0
  })

  // Minimum time between requests (5 minutes)
  const MIN_FETCH_INTERVAL = 5 * 60 * 1000

  useEffect(() => {
    if (user) {
      fetchUserData()
    } else {
      resetUserData()
    }
  }, [user])

  const resetUserData = () => {
    setUserProfile(null)
    setReadingProgress([])
    setAchievements([])
    setStats({
      totalTextsRead: 0,
      totalReadingTime: 0,
      readingStreak: 0,
      averageSessionTime: 0
    })
  }

  const shouldFetch = (key) => {
    const now = Date.now()
    const lastFetch = lastFetchRef.current[key]
    return now - lastFetch > MIN_FETCH_INTERVAL
  }

  const updateLastFetch = (key) => {
    lastFetchRef.current[key] = Date.now()
  }

  const fetchUserData = async () => {
    if (!user) return

    setLoading(true)
    try {
      const promises = []

      // Only fetch if enough time has passed
      if (shouldFetch('profile')) {
        promises.push(
          api.get(`/users/profile/${user.id}`)
            .then(res => {
              setUserProfile(res.data)
              updateLastFetch('profile')
              return res
            })
            .catch(() => ({ data: null }))
        )
      }

      if (shouldFetch('progress')) {
        promises.push(
          api.get(`/reading/activity/${user.id}?limit=10`)
            .then(res => {
              setReadingProgress(Array.isArray(res.data) ? res.data : [])
              updateLastFetch('progress')
              return res
            })
            .catch(() => ({ data: [] }))
        )
      }

      if (shouldFetch('achievements')) {
        promises.push(
          api.get(`/users/achievements/${user.id}`)
            .then(res => {
              setAchievements(Array.isArray(res.data) ? res.data : [])
              updateLastFetch('achievements')
              return res
            })
            .catch(() => ({ data: [] }))
        )
      }

      if (shouldFetch('settings')) {
        promises.push(
          api.get(`/users/settings/${user.id}`)
            .then(res => {
              if (res.data) setSettings(prev => ({ ...prev, ...res.data }))
              updateLastFetch('settings')
              return res
            })
            .catch(() => ({ data: {} }))
        )
      }

      if (shouldFetch('stats')) {
        promises.push(
          api.get(`/reading/stats/${user.id}`)
            .then(res => {
              if (res.data) setStats(prev => ({ ...prev, ...res.data }))
              updateLastFetch('stats')
              return res
            })
            .catch(() => ({ data: {} }))
        )
      }

      await Promise.allSettled(promises)
    } catch (error) {
      console.error('Error fetching user data:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateUserProfile = async (profileData) => {
    try {
      const response = await api.put(`/users/profile/${user.id}`, profileData)
      setUserProfile(response.data)
      return { success: true, data: response.data }
    } catch (error) {
      console.error('Error updating profile:', error)
      return { success: false, error }
    }
  }

  const updateSettings = async (newSettings) => {
    try {
      const response = await api.put(`/users/settings/${user.id}`, newSettings)
      setSettings(response.data)
      applySettingsToDocument(response.data)
      updateLastFetch('settings')
      return { success: true, data: response.data }
    } catch (error) {
      console.error('Error updating settings:', error)
      return { success: false, error }
    }
  }

  const applySettingsToDocument = (newSettings) => {
    const root = document.documentElement

    const fontSizeMap = {
      small: '14px',
      medium: '16px',
      large: '18px',
      xl: '20px',
      xxl: '24px'
    }
    root.style.setProperty('--base-font-size', fontSizeMap[newSettings.fontSize] || '16px')

    const lineHeightMap = {
      tight: '1.25',
      normal: '1.5',
      relaxed: '1.75',
      loose: '2'
    }
    root.style.setProperty('--base-line-height', lineHeightMap[newSettings.lineHeight] || '1.5')

    const letterSpacingMap = {
      tight: '-0.025em',
      normal: '0',
      wide: '0.025em',
      wider: '0.05em'
    }
    root.style.setProperty('--base-letter-spacing', letterSpacingMap[newSettings.letterSpacing] || '0')
  }

  const saveReadingProgress = async (textId, progress) => {
    try {
      const response = await api.post('/reading/progress', {
        userId: user.id,
        textId,
        ...progress
      })

      // Update local state immediately for better UX
      setStats(prev => ({
        ...prev,
        totalTextsRead: progress.completed ? prev.totalTextsRead + 1 : prev.totalTextsRead,
        totalReadingTime: prev.totalReadingTime + (progress.duration || 0)
      }))

      // Only fetch fresh stats if enough time has passed
      if (shouldFetch('stats')) {
        const statsRes = await api.get(`/reading/stats/${user.id}`).catch(() => ({ data: {} }))
        if (statsRes.data) {
          setStats(prev => ({ ...prev, ...statsRes.data }))
          updateLastFetch('stats')
        }
      }

      // Only fetch fresh activity if enough time has passed
      if (shouldFetch('progress')) {
        const activityRes = await api.get(`/reading/activity/${user.id}?limit=10`).catch(() => ({ data: [] }))
        if (activityRes.data) {
          setReadingProgress(Array.isArray(activityRes.data) ? activityRes.data : [])
          updateLastFetch('progress')
        }
      }

      return { success: true, data: response.data }
    } catch (error) {
      console.error('Error saving progress:', error)
      return { success: false, error }
    }
  }

  const addAchievement = async (achievement) => {
    try {
      const response = await api.post(`/users/achievements/${user.id}`, achievement)
      setAchievements(response.data)
      updateLastFetch('achievements')
      return { success: true, data: response.data }
    } catch (error) {
      console.error('Error adding achievement:', error)
      return { success: false, error }
    }
  }

  const updateReadingStreak = async () => {
    try {
      const response = await api.put(`/reading/streak/${user.id}`)
      setStats(prev => ({ ...prev, readingStreak: response.data.streak }))
      updateLastFetch('stats')
      return { success: true, data: response.data }
    } catch (error) {
      console.error('Error updating streak:', error)
      return { success: false, error }
    }
  }

  const value = {
    userProfile,
    readingProgress,
    achievements,
    stats,
    settings,
    loading,
    updateUserProfile,
    updateSettings,
    saveReadingProgress,
    addAchievement,
    updateReadingStreak,
    fetchUserData
  }

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  )
}
