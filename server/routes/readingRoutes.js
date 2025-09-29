// server/routes/readingRoutes.js
import express from 'express'
import { authenticateUser, optionalAuth } from '../middlewares/auth.js'
import {
  saveProgress,
  getReadingHistory,
  getReadingStats,
  updateReadingStreak
} from '../controllers/readingController.js'

const router = express.Router()

// Reading progress routes
router.post('/progress', authenticateUser, saveProgress)
router.get('/history/:userId', optionalAuth, getReadingHistory)
router.get('/stats/:userId', optionalAuth, getReadingStats)
router.put('/streak/:userId', authenticateUser, updateReadingStreak)

export default router