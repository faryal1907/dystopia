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
  const [settings, setSettings] = useState({
    fontSize: 'medium',
    lineHeight: 'normal',
    letterSpacing: 'normal',
    readingSpeed: 1.0,
    voice: 'default'
  })

  useEffect(() => {
    if (user) {
      fetchUserData()
    } else {
      setUserProfile(null)
      setReadingProgress([])
      setAchievements([])
    }
  }, [user])

  const fetchUserData = async () => {
    try {
      const [profileRes, progressRes, achievementsRes, settingsRes] = await Promise.all([
        api.get(`/users/profile/${user.id}`),
        api.get(`/users/progress/${user.id}`),
        api.get(`/users/achievements/${user.id}`),
        api.get(`/users/settings/${user.id}`)
      ])

      setUserProfile(profileRes.data)
      setReadingProgress(progressRes.data)
      setAchievements(achievementsRes.data)
      setSettings({ ...settings, ...settingsRes.data })
    } catch (error) {
      console.error('Error fetching user data:', error)
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
      return { success: true, data: response.data }
    } catch (error) {
      console.error('Error updating settings:', error)
      return { success: false, error }
    }
  }

  const saveReadingProgress = async (textId, progress) => {
    try {
      const response = await api.post('/reading/progress', {
        userId: user.id,
        textId,
        progress
      })
      fetchUserData() // Refresh data
      return { success: true, data: response.data }
    } catch (error) {
      console.error('Error saving progress:', error)
      return { success: false, error }
    }
  }

  const value = {
    userProfile,
    readingProgress,
    achievements,
    settings,
    updateUserProfile,
    updateSettings,
    saveReadingProgress,
    fetchUserData
  }

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  )
}