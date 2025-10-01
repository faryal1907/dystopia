// client/src/pages/Dashboard.jsx
import React, { useEffect, useState, useCallback, useMemo } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { BookOpen, Volume2, Languages, Focus, TrendingUp, Award, Clock, Target, BarChart3, Calendar, Plus, ArrowRight, Zap, Trophy, Flame } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import { useUser } from '../context/UserContext.jsx'

const Dashboard = () => {
  const { user } = useAuth()
  const { userProfile, readingProgress, achievements, stats, fetchUserData } = useUser()
  const [greeting, setGreeting] = useState('')
  const [weeklyGoal, setWeeklyGoal] = useState({ current: 0, target: 7 })
  const [lastFetch, setLastFetch] = useState(0)

  // Memoized recent activity to reduce re-renders
  const recentActivity = useMemo(() => {
    if (readingProgress && readingProgress.length > 0) {
      return readingProgress.slice(0, 5).map((session, index) => ({
        id: session._id || `session-${index}`,
        text: session.title || `Reading Session ${index + 1}`,
        progress: session.progress?.percentage || Math.floor(Math.random() * 100),
        time: formatTimeAgo(session.createdAt || new Date()),
        type: session.sessionType || 'regular'
      }))
    }
    // Fallback mock data when no sessions exist
    return [
      { id: 1, text: 'The Great Gatsby Chapter 1', progress: 100, time: '2 hours ago', type: 'text-to-speech' },
      { id: 2, text: 'Spanish Article: Technology', progress: 75, time: '5 hours ago', type: 'translation' },
      { id: 3, text: 'Scientific Paper: Climate Change', progress: 45, time: '1 day ago', type: 'focus-mode' }
    ]
  }, [readingProgress])

  // Set greeting once on component mount
  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) setGreeting('Good morning')
    else if (hour < 17) setGreeting('Good afternoon')
    else setGreeting('Good evening')
  }, [])

  // Optimized data fetching - only fetch when necessary
  const fetchDataOptimized = useCallback(async () => {
    const now = Date.now()
    // Only fetch if more than 5 minutes have passed since last fetch
    if (now - lastFetch > 300000) { // 5 minutes
      try {
        await fetchUserData()
        setLastFetch(now)
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      }
    }
  }, [fetchUserData, lastFetch])

  useEffect(() => {
    if (user) {
      fetchDataOptimized()
      
      // Reduced frequency: only update when tab is visible and less frequently
      const interval = setInterval(() => {
        if (document.visibilityState === 'visible') {
          fetchDataOptimized()
        }
      }, 300000) // Changed from 10 seconds to 5 minutes
      
      return () => clearInterval(interval)
    }
  }, [user, fetchDataOptimized])

  // Calculate weekly goal progress
  useEffect(() => {
    if (readingProgress) {
      const today = new Date()
      const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()))
      const weeklyProgress = readingProgress.filter(session => {
        const sessionDate = new Date(session.createdAt)
        return sessionDate >= startOfWeek
      }).length
      
      setWeeklyGoal({ current: Math.min(weeklyProgress, 7), target: 7 })
    }
  }, [readingProgress])

  if (!user) {
    return <Navigate to="/login" replace />
  }

  const formatTimeAgo = (date) => {
    const now = new Date()
    const sessionDate = new Date(date)
    const diffInHours = Math.floor((now - sessionDate) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours} hours ago`
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays} days ago`
  }

  const formatReadingTime = (milliseconds) => {
    if (!milliseconds) return '0m'
    const hours = Math.floor(milliseconds / (1000 * 60 * 60))
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60))
    
    if (hours > 0) return `${hours}h ${minutes}m`
    return `${minutes}m`
  }

  const quickActions = [
    {
      title: 'Text to Speech',
      description: 'Convert text to natural speech',
      href: '/text-to-speech',
      icon: Volume2,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Translation',
      description: 'Translate text to any language',
      href: '/translation',
      icon: Languages,
      color: 'from-green-500 to-emerald-500'
    },
    {
      title: 'Focus Mode',
      description: 'Distraction-free reading',
      href: '/focus-mode',
      icon: Focus,
      color: 'from-purple-500 to-pink-500'
    }
  ]

  const dashboardStats = [
    {
      label: 'Texts Read',
      value: stats.totalTextsRead || 0,
      icon: BookOpen,
      change: '+12%',
      color: 'text-blue-600'
    },
    {
      label: 'Reading Time',
      value: formatReadingTime(stats.totalReadingTime || 0),
      icon: Clock,
      change: '+8%',
      color: 'text-green-600'
    },
    {
      label: 'Achievements',
      value: achievements?.length || 0,
      icon: Award,
      change: `+${achievements?.filter(a => {
        const earnedDate = new Date(a.earnedAt)
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        return earnedDate > weekAgo
      }).length || 0}`,
      color: 'text-yellow-600'
    },
    {
      label: 'Streak',
      value: `${stats.readingStreak || 0} days`,
      icon: Flame,
      change: stats.readingStreak > 0 ? '+1' : '0',
      color: 'text-red-600'
    }
  ]

  const recentAchievements = achievements?.slice(-3).reverse() || [
    { id: 1, title: 'First Steps', description: 'Completed your first reading session', earnedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
    { id: 2, title: 'Speed Reader', description: 'Read 5 texts in one day', earnedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) },
    { id: 3, title: 'Multilingual', description: 'Used translation feature', earnedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
  ]

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="bg-[var(--bg-primary)] rounded-2xl p-6 border border-[var(--border-color)] bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-[var(--text-primary)] dyslexia-text mb-2">
                  {greeting}, {user.email?.split('@')[0] || 'Reader'}!
                </h1>
                <p className="text-[var(--text-secondary)] dyslexia-text">
                  Ready to continue your reading journey? Let's make today count!
                </p>
              </div>
              <div className="hidden lg:flex items-center space-x-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-600 dyslexia-text">
                    {stats.readingStreak || 0}
                  </div>
                  <div className="text-sm text-[var(--text-secondary)] dyslexia-text">
                    Day Streak
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-secondary-600 dyslexia-text">
                    {achievements?.length || 0}
                  </div>
                  <div className="text-sm text-[var(--text-secondary)] dyslexia-text">
                    Achievements
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
          {dashboardStats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div
                key={stat.label}
                className="bg-[var(--bg-primary)] rounded-xl p-4 lg:p-6 border border-[var(--border-color)] hover:shadow-lg transition-all duration-200"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-primary-800 dark:to-secondary-800 rounded-lg">
                    <Icon className={`h-4 w-4 lg:h-5 lg:w-5 ${stat.color}`} />
                  </div>
                  <span className="text-xs lg:text-sm text-green-600 dark:text-green-400 font-medium">
                    {stat.change}
                  </span>
                </div>
                <div className="text-xl lg:text-2xl font-bold text-[var(--text-primary)] dyslexia-text mb-1">
                  {stat.value}
                </div>
                <div className="text-xs lg:text-sm text-[var(--text-secondary)] dyslexia-text">
                  {stat.label}
                </div>
              </div>
            )
          })}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-[var(--text-primary)] dyslexia-text mb-4 flex items-center">
            <Zap className="h-5 w-5 mr-2" />
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickActions.map((action, index) => {
              const Icon = action.icon
              return (
                <div
                  key={action.title}
                  className="group"
                >
                  <Link to={action.href}>
                    <div className="bg-[var(--bg-primary)] rounded-xl p-6 border border-[var(--border-color)] hover:shadow-xl transition-all duration-300 group-hover:border-primary-300">
                      <div className={`inline-flex p-3 bg-gradient-to-r ${action.color} rounded-xl mb-4`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2 dyslexia-text">
                        {action.title}
                      </h3>
                      <p className="text-[var(--text-secondary)] dyslexia-text mb-4">
                        {action.description}
                      </p>
                      <div className="flex items-center text-primary-600 font-medium dyslexia-text">
                        Start now
                        <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                </div>
              )
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <div className="bg-[var(--bg-primary)] rounded-xl p-6 border border-[var(--border-color)]">
            <h2 className="text-xl font-semibold text-[var(--text-primary)] dyslexia-text mb-6 flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Recent Activity
            </h2>
            <div className="space-y-4">
              {recentActivity.length > 0 ? recentActivity.map((activity, index) => (
                <div key={activity.id || index} className="flex items-center justify-between p-4 bg-[var(--bg-secondary)] rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-medium text-[var(--text-primary)] dyslexia-text mb-1">
                      {activity.text}
                    </h3>
                    <div className="flex items-center space-x-4">
                      <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${activity.progress}%` }}
                        />
                      </div>
                      <span className="text-sm text-[var(--text-secondary)] dyslexia-text">
                        {activity.progress}%
                      </span>
                    </div>
                  </div>
                  <div className="ml-4 text-xs text-[var(--text-secondary)] dyslexia-text">
                    {activity.time}
                  </div>
                </div>
              )) : (
                <div className="text-center py-8 text-[var(--text-secondary)] dyslexia-text">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No recent activity yet.</p>
                  <p>Start reading to see your progress here!</p>
                </div>
              )}
            </div>
          </div>

          {/* Achievements */}
          <div className="bg-[var(--bg-primary)] rounded-xl p-6 border border-[var(--border-color)]">
            <h2 className="text-xl font-semibold text-[var(--text-primary)] dyslexia-text mb-6 flex items-center">
              <Trophy className="h-5 w-5 mr-2" />
              Recent Achievements
            </h2>
            <div className="space-y-4">
              {recentAchievements.length > 0 ? recentAchievements.map((achievement, index) => (
                <div key={achievement.id || index} className="flex items-start space-x-4 p-4 bg-[var(--bg-secondary)] rounded-lg">
                  <div className="p-2 bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-yellow-800 dark:to-orange-800 rounded-full">
                    <Award className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-[var(--text-primary)] dyslexia-text mb-1">
                      {achievement.title}
                    </h3>
                    <p className="text-sm text-[var(--text-secondary)] dyslexia-text mb-2">
                      {achievement.description}
                    </p>
                    <span className="text-xs text-[var(--text-secondary)] dyslexia-text">
                      {formatTimeAgo(achievement.earnedAt)}
                    </span>
                  </div>
                </div>
              )) : (
                <div className="text-center py-8 text-[var(--text-secondary)] dyslexia-text">
                  <Award className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No achievements yet.</p>
                  <p>Keep reading to unlock rewards!</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Reading Goal */}
        <div className="mt-8 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold dyslexia-text">
              Weekly Reading Goal
            </h2>
            <div className="text-right">
              <div className="text-2xl font-bold dyslexia-text">
                {weeklyGoal.current}/{weeklyGoal.target}
              </div>
              <div className="text-sm text-primary-100 dyslexia-text">days</div>
            </div>
          </div>
          <div className="bg-white/20 rounded-full h-3 mb-4">
            <div 
              className="bg-white h-3 rounded-full transition-all duration-300"
              style={{ width: `${(weeklyGoal.current / weeklyGoal.target) * 100}%` }}
            />
          </div>
          <p className="text-primary-100 dyslexia-text">
            {weeklyGoal.current === weeklyGoal.target 
              ? "🎉 Congratulations! You've reached your weekly goal!" 
              : `Great progress! ${weeklyGoal.target - weeklyGoal.current} more days to reach your weekly goal.`
            }
          </p>
        </div>
      </div>
    </div>
  )
}

export default Dashboard