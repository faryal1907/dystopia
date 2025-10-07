export const analyticsService = {
  /**
   * Calculate reading statistics
   */
  calculateStats(sessions) {
    if (!sessions || sessions.length === 0) {
      return {
        totalSessions: 0,
        totalWords: 0,
        totalMinutes: 0,
        avgWordsPerMinute: 0,
        completionRate: 0,
        favoriteFeature: 'None'
      }
    }

    const totalSessions = sessions.length
    const totalWords = sessions.reduce((sum, s) => sum + (s.wordsRead || 0), 0)
    const totalMinutes = sessions.reduce((sum, s) => sum + (s.duration || 0), 0) / 60000
    const completedSessions = sessions.filter(s => s.completed).length
    
    // Calculate feature usage
    const featureCount = {}
    sessions.forEach(s => {
      const type = s.sessionType || 'unknown'
      featureCount[type] = (featureCount[type] || 0) + 1
    })
    
    const favoriteFeature = Object.keys(featureCount).reduce((a, b) => 
      featureCount[a] > featureCount[b] ? a : b, 'None'
    )

    return {
      totalSessions,
      totalWords,
      totalMinutes: Math.round(totalMinutes),
      avgWordsPerMinute: totalMinutes > 0 ? Math.round(totalWords / totalMinutes) : 0,
      completionRate: Math.round((completedSessions / totalSessions) * 100),
      favoriteFeature: this.formatFeatureName(favoriteFeature),
      featureBreakdown: featureCount
    }
  },

  /**
   * Generate AI-powered insights
   */
  generateInsights(stats, sessions) {
    const insights = []

    // Reading speed insight
    if (stats.avgWordsPerMinute > 0) {
      if (stats.avgWordsPerMinute < 150) {
        insights.push({
          type: 'speed',
          icon: '🐢',
          title: 'Take Your Time',
          message: `Your reading speed is ${stats.avgWordsPerMinute} WPM. Focus on comprehension over speed!`,
          color: 'blue'
        })
      } else if (stats.avgWordsPerMinute > 250) {
        insights.push({
          type: 'speed',
          icon: '🚀',
          title: 'Speed Reader!',
          message: `Impressive ${stats.avgWordsPerMinute} WPM! You're reading faster than average.`,
          color: 'green'
        })
      } else {
        insights.push({
          type: 'speed',
          icon: '✨',
          title: 'Great Pace',
          message: `Your ${stats.avgWordsPerMinute} WPM is perfect for comprehension and speed.`,
          color: 'purple'
        })
      }
    }

    // Completion rate insight
    if (stats.completionRate < 50) {
      insights.push({
        type: 'completion',
        icon: '🎯',
        title: 'Finish What You Start',
        message: `You complete ${stats.completionRate}% of sessions. Try shorter texts to build the habit!`,
        color: 'orange'
      })
    } else if (stats.completionRate > 80) {
      insights.push({
        type: 'completion',
        icon: '🏆',
        title: 'Dedicated Reader',
        message: `${stats.completionRate}% completion rate! Your consistency is outstanding.`,
        color: 'green'
      })
    }

    // Feature usage insight
    if (stats.favoriteFeature !== 'None') {
      insights.push({
        type: 'feature',
        icon: '⭐',
        title: 'Favorite Feature',
        message: `You love using ${stats.favoriteFeature}! Try other features for variety.`,
        color: 'purple'
      })
    }

    // Activity insight
    if (stats.totalSessions < 5) {
      insights.push({
        type: 'activity',
        icon: '🌱',
        title: 'Just Getting Started',
        message: 'Keep going! Reading regularly improves comprehension and focus.',
        color: 'green'
      })
    } else if (stats.totalSessions > 50) {
      insights.push({
        type: 'activity',
        icon: '🔥',
        title: 'Power User',
        message: `${stats.totalSessions} sessions! You're a VOXA champion!`,
        color: 'red'
      })
    }

    return insights
  },

  /**
   * Format feature names
   */
  formatFeatureName(feature) {
    const names = {
      'text-to-speech': 'Text-to-Speech',
      'translation': 'Translation',
      'focus-mode': 'Focus Mode',
      'summarization': 'AI Summarization',
      'unknown': 'General Reading'
    }
    return names[feature] || feature
  },

  /**
   * Get weekly activity data for charts
   */
  getWeeklyActivity(sessions) {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const today = new Date()
    const weekData = []

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dayName = days[date.getDay()]
      
      const daySessions = sessions.filter(s => {
        const sessionDate = new Date(s.timestamp || s.createdAt)
        return sessionDate.toDateString() === date.toDateString()
      })

      weekData.push({
        day: dayName,
        sessions: daySessions.length,
        words: daySessions.reduce((sum, s) => sum + (s.wordsRead || 0), 0),
        minutes: Math.round(daySessions.reduce((sum, s) => sum + (s.duration || 0), 0) / 60000)
      })
    }

    return weekData
  },

  /**
   * Calculate reading streak
   */
  calculateStreak(sessions) {
    if (!sessions || sessions.length === 0) return 0

    const dates = sessions
      .map(s => new Date(s.timestamp || s.createdAt).toDateString())
      .filter((date, index, self) => self.indexOf(date) === index)
      .sort((a, b) => new Date(b) - new Date(a))

    let streak = 0
    const today = new Date().toDateString()
    const yesterday = new Date(Date.now() - 86400000).toDateString()

    // Must have read today or yesterday to have an active streak
    if (dates[0] !== today && dates[0] !== yesterday) return 0

    for (let i = 0; i < dates.length; i++) {
      const expectedDate = new Date(Date.now() - (i * 86400000)).toDateString()
      if (dates[i] === expectedDate) {
        streak++
      } else {
        break
      }
    }

    return streak
  }
}
