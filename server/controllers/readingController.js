// server/controllers/readingController.js
import ReadingSession from '../models/ReadingSession.model.js'
import User from '../models/User.model.js'

export const saveProgress = async (req, res) => {
  try {
    const { userId, textId, progress } = req.body
    
    const session = new ReadingSession({
      userId,
      textId,
      ...progress,
      updatedAt: Date.now()
    })
    
    await session.save()
    
    // Update user stats
    await User.findOneAndUpdate(
      { supabaseId: userId },
      { 
        $inc: { 
          'stats.totalTextsRead': progress.completed ? 1 : 0,
          'stats.totalReadingTime': progress.duration || 0
        },
        $set: { 
          'stats.lastReadingDate': new Date(),
          updatedAt: Date.now()
        }
      },
      { upsert: true }
    )
    
    res.json({ success: true, session })
  } catch (error) {
    console.error('Error saving reading progress:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

export const getReadingHistory = async (req, res) => {
  try {
    const { userId } = req.params
    const { page = 1, limit = 20 } = req.query
    
    const sessions = await ReadingSession.find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
    
    const total = await ReadingSession.countDocuments({ userId })
    
    res.json({
      sessions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching reading history:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

export const getReadingStats = async (req, res) => {
  try {
    const { userId } = req.params
    
    const user = await User.findOne({ supabaseId: userId })
    
    if (!user) {
      return res.json({
        totalTextsRead: 0,
        totalReadingTime: 0,
        readingStreak: 0,
        averageSessionTime: 0
      })
    }
    
    // Calculate additional stats
    const sessions = await ReadingSession.find({ userId })
    const averageSessionTime = sessions.length > 0 
      ? sessions.reduce((acc, session) => acc + (session.duration || 0), 0) / sessions.length
      : 0
    
    res.json({
      ...user.stats,
      averageSessionTime: Math.round(averageSessionTime)
    })
  } catch (error) {
    console.error('Error fetching reading stats:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

export const updateReadingStreak = async (req, res) => {
  try {
    const { userId } = req.params
    
    const user = await User.findOne({ supabaseId: userId })
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    
    const today = new Date()
    const lastReading = user.stats.lastReadingDate
    
    let newStreak = user.stats.readingStreak || 0
    
    if (lastReading) {
      const daysDiff = Math.floor((today - lastReading) / (1000 * 60 * 60 * 24))
      
      if (daysDiff === 1) {
        // Consecutive day
        newStreak += 1
      } else if (daysDiff > 1) {
        // Streak broken
        newStreak = 1
      }
      // Same day, no change
    } else {
      // First reading
      newStreak = 1
    }
    
    await User.findOneAndUpdate(
      { supabaseId: userId },
      { 
        $set: {
          'stats.readingStreak': newStreak,
          'stats.lastReadingDate': today,
          updatedAt: Date.now()
        }
      }
    )
    
    res.json({ streak: newStreak })
  } catch (error) {
    console.error('Error updating reading streak:', error)
    res.status(500).json({ message: 'Server error' })
  }
}