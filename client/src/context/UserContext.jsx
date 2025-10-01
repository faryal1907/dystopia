// client/src/context/UserContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react'
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

  const fetchUserData = async () => {
    if (!user) return

    setLoading(true)
    try {
      const [profileRes, progressRes, achievementsRes, settingsRes, statsRes] = await Promise.all([
        api.get(`/users/profile/${user.id}`).catch(() => ({ data: null })),
        api.get(`/users/progress/${user.id}`).catch(() => ({ data: [] })),
        api.get(`/users/achievements/${user.id}`).catch(() => ({ data: [] })),
        api.get(`/users/settings/${user.id}`).catch(() => ({ data: {} })),
        api.get(`/reading/stats/${user.id}`).catch(() => ({ data: {} }))
      ])

      if (profileRes.data) setUserProfile(profileRes.data)
      if (progressRes.data) setReadingProgress(Array.isArray(progressRes.data) ? progressRes.data : [])
      if (achievementsRes.data) setAchievements(Array.isArray(achievementsRes.data) ? achievementsRes.data : [])
      if (settingsRes.data) setSettings(prev => ({ ...prev, ...settingsRes.data }))
      if (statsRes.data) setStats(prev => ({ ...prev, ...statsRes.data }))
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
      // Refresh user data
      fetchUserData()
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

      // Update local state immediately
      setStats(prev => ({
        ...prev,
        totalTextsRead: progress.completed ? prev.totalTextsRead + 1 : prev.totalTextsRead,
        totalReadingTime: prev.totalReadingTime + (progress.duration || 0)
      }))

      // Fetch fresh stats only
      const statsRes = await api.get(`/reading/stats/${user.id}`).catch(() => ({ data: {} }))
      if (statsRes.data) setStats(prev => ({ ...prev, ...statsRes.data }))

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
