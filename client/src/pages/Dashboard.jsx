// client/src/pages/Dashboard.jsx
import React, { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BookOpen, Volume2, Languages, Focus, TrendingUp, Award, Clock, Target, BarChart3, Calendar, Plus, ArrowRight } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useUser } from '../context/UserContext'

const Dashboard = () => {
  const { user } = useAuth()
  const { userProfile, readingProgress, achievements, settings } = useUser()
  const [greeting, setGreeting] = useState('')

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) setGreeting('Good morning')
    else if (hour < 17) setGreeting('Good afternoon')
    else setGreeting('Good evening')
  }, [])

  if (!user) {
    return <Navigate to="/login" replace />
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

  const stats = [
    {
      label: 'Texts Read',
      value: readingProgress?.length || 0,
      icon: BookOpen,
      change: '+12%'
    },
    {
      label: 'Reading Time',
      value: '2.4h',
      icon: Clock,
      change: '+8%'
    },
    {
      label: 'Achievements',
      value: achievements?.length || 0,
      icon: Award,
      change: '+3'
    },
    {
      label: 'Streak',
      value: '7 days',
      icon: Target,
      change: '+1'
    }
  ]

  const recentAchievements = [
    { title: 'First Steps', description: 'Completed your first reading session', earned: '2 days ago' },
    { title: 'Speed Reader', description: 'Read 5 texts in one day', earned: '5 days ago' },
    { title: 'Multilingual', description: 'Used translation feature', earned: '1 week ago' }
  ]

  const recentActivity = [
    { text: 'The Great Gatsby Chapter 1', progress: 100, time: '2 hours ago' },
    { text: 'Spanish Article: Technology', progress: 75, time: '5 hours ago' },
    { text: 'Scientific Paper: Climate Change', progress: 45, time: '1 day ago' }
  ]

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[var(--bg-primary)] rounded-2xl p-6 border border-[var(--border-color)] bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20"
          >
            <h1 className="text-2xl lg:text-3xl font-bold text-[var(--text-primary)] dyslexia-text mb-2">
              {greeting}, {user.email?.split('@')[0] || 'Reader'}!
            </h1>
            <p className="text-[var(--text-secondary)] dyslexia-text">
              Ready to continue your reading journey? Let's make today count!
            </p>
          </motion.div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-[var(--bg-primary)] rounded-xl p-4 lg:p-6 border border-[var(--border-color)] hover:shadow-lg transition-all duration-200"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-primary-800 dark:to-secondary-800 rounded-lg">
                    <Icon className="h-4 w-4 lg:h-5 lg:w-5 text-primary-600 dark:text-primary-400" />
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
              </motion.div>
            )
          })}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-[var(--text-primary)] dyslexia-text mb-4 flex items-center">
            <Plus className="h-5 w-5 mr-2" />
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickActions.map((action, index) => {
              const Icon = action.icon
              return (
                <motion.div
                  key={action.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
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
                </motion.div>
              )
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-[var(--bg-primary)] rounded-xl p-6 border border-[var(--border-color)]"
          >
            <h2 className="text-xl font-semibold text-[var(--text-primary)] dyslexia-text mb-6 flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Recent Activity
            </h2>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-[var(--bg-secondary)] rounded-lg">
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
              ))}
            </div>
          </motion.div>

          {/* Achievements */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-[var(--bg-primary)] rounded-xl p-6 border border-[var(--border-color)]"
          >
            <h2 className="text-xl font-semibold text-[var(--text-primary)] dyslexia-text mb-6 flex items-center">
              <Award className="h-5 w-5 mr-2" />
              Recent Achievements
            </h2>
            <div className="space-y-4">
              {recentAchievements.map((achievement, index) => (
                <div key={index} className="flex items-start space-x-4 p-4 bg-[var(--bg-secondary)] rounded-lg">
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
                      {achievement.earned}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Reading Goal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-xl p-6 text-white"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold dyslexia-text">
              Weekly Reading Goal
            </h2>
            <div className="text-right">
              <div className="text-2xl font-bold dyslexia-text">5/7</div>
              <div className="text-sm text-primary-100 dyslexia-text">days</div>
            </div>
          </div>
          <div className="bg-white/20 rounded-full h-3 mb-4">
            <div 
              className="bg-white h-3 rounded-full transition-all duration-300"
              style={{ width: '71%' }}
            />
          </div>
          <p className="text-primary-100 dyslexia-text">
            Great progress! Keep it up to reach your weekly goal.
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export default Dashboard