// server/routes/translationRoutes.js
import express from 'express'
import { optionalAuth, authenticateUser } from '../middlewares/auth.js'
import {
  translateText,
  detectLanguage,
  getTranslationHistory
} from '../controllers/translationController.js'

const router = express.Router()

// Translation routes
router.post('/translate', optionalAuth, translateText)
router.post('/detect', optionalAuth, detectLanguage)
router.get('/history', authenticateUser, getTranslationHistory)

export default router