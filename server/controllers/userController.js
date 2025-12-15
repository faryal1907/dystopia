// server/controllers/userController.js
import User from '../models/User.model.js'

export const getProfile = async (req, res) => {
  try {
    const { userId } = req.params
    
    // First, try to find user by supabaseId
    let user = await User.findOne({ supabaseId: userId })
    
    if (!user) {
      // User doesn't exist, create it using upsert to avoid duplicates
      user = await User.findOneAndUpdate(
        { supabaseId: userId },
        {
          supabaseId: userId,
          email: req.user?.email || `user-${userId}@example.com`
        },
        { 
          new: true, 
          upsert: true,
          setDefaultsOnInsert: true
        }
      )
    }
    
    res.json(user)
  } catch (error) {
    // Handle duplicate key errors (email already exists)
    if (error.code === 11000) {
      // Try to find user by email instead
      const existingUser = await User.findOne({ email: req.user?.email })
      if (existingUser) {
        return res.json(existingUser)
      }
      
      return res.status(409).json({ 
        message: 'User with this email already exists',
        error: 'DUPLICATE_EMAIL'
      })
    }
    
    console.error('Error fetching user profile:', error)
    res.status(500).json({ 
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
}

export const updateProfile = async (req, res) => {
  try {
    const { userId } = req.params
    const updates = req.body
    
    const user = await User.findOneAndUpdate(
      { supabaseId: userId },
      { 
        $set: {
          ...updates,
          updatedAt: Date.now()
        }
      },
      { new: true, upsert: true }
    )
    
    res.json(user)
  } catch (error) {
    if (error.code === 11000) {
      // Duplicate key error - try to get existing user
      const existingUser = await User.findOne({ supabaseId: req.params.userId })
      if (existingUser) {
        return res.json(existingUser)
      }
      return res.status(409).json({ 
        message: 'Duplicate entry',
        field: Object.keys(error.keyPattern)[0]
      })
    }
    
    console.error('Error updating user profile:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

export const getSettings = async (req, res) => {
  try {
    const { userId } = req.params
    
    const user = await User.findOne({ supabaseId: userId })
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    
    res.json(user.settings)
  } catch (error) {
    console.error('Error fetching user settings:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

export const updateSettings = async (req, res) => {
  try {
    const { userId } = req.params
    const settings = req.body
    
    const user = await User.findOneAndUpdate(
      { supabaseId: userId },
      { 
        $set: {
          settings: { ...settings },
          updatedAt: Date.now()
        }
      },
      { new: true, upsert: true }
    )
    
    res.json(user.settings)
  } catch (error) {
    if (error.code === 11000) {
      // Duplicate key error - try to get existing user
      const existingUser = await User.findOne({ supabaseId: req.params.userId })
      if (existingUser) {
        // Update settings on existing user
        existingUser.settings = { ...existingUser.settings, ...req.body.settings }
        await existingUser.save()
        return res.json(existingUser.settings)
      }
      return res.status(409).json({ 
        message: 'Duplicate entry',
        field: Object.keys(error.keyPattern)[0]
      })
    }
    
    console.error('Error updating user settings:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

export const getProgress = async (req, res) => {
  try {
    const { userId } = req.params
    
    // This would typically fetch reading sessions
    // For now, return mock data
    const progress = [
      {
        id: '1',
        title: 'Sample Reading',
        progress: 75,
        date: new Date().toISOString()
      }
    ]
    
    res.json(progress)
  } catch (error) {
    console.error('Error fetching user progress:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

export const getAchievements = async (req, res) => {
  try {
    const { userId } = req.params
    
    const user = await User.findOne({ supabaseId: userId })
    
    if (!user) {
      return res.json([])
    }
    
    res.json(user.achievements || [])
  } catch (error) {
    console.error('Error fetching user achievements:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

export const addAchievement = async (req, res) => {
  try {
    const { userId } = req.params
    const achievement = req.body
    
    const user = await User.findOneAndUpdate(
      { supabaseId: userId },
      { 
        $push: {
          achievements: {
            ...achievement,
            earnedAt: new Date()
          }
        },
        $set: { updatedAt: Date.now() }
      },
      { new: true, upsert: true }
    )
    
    res.json(user.achievements)
  } catch (error) {
    if (error.code === 11000) {
      // Duplicate key error - try to get existing user and add achievement
      const existingUser = await User.findOne({ supabaseId: req.params.userId })
      if (existingUser) {
        existingUser.achievements.push({
          ...req.body,
          earnedAt: new Date()
        })
        existingUser.updatedAt = Date.now()
        await existingUser.save()
        return res.json(existingUser.achievements)
      }
      return res.status(409).json({ 
        message: 'Duplicate entry',
        field: Object.keys(error.keyPattern)[0]
      })
    }
    
    console.error('Error adding achievement:', error)
    res.status(500).json({ message: 'Server error' })
  }
}