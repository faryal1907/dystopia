export const speedReadingService = {
  /**
   * Training levels with descriptions
   */
  levels: [
    { 
      id: 1, 
      name: 'Beginner', 
      wpm: 150, 
      description: 'Comfortable pace for comprehension',
      icon: '🌱'
    },
    { 
      id: 2, 
      name: 'Intermediate', 
      wpm: 250, 
      description: 'Average reading speed',
      icon: '📖'
    },
    { 
      id: 3, 
      name: 'Advanced', 
      wpm: 350, 
      description: 'Fast reader pace',
      icon: '⚡'
    },
    { 
      id: 4, 
      name: 'Expert', 
      wpm: 450, 
      description: 'Speed reading territory',
      icon: '🚀'
    },
    { 
      id: 5, 
      name: 'Master', 
      wpm: 600, 
      description: 'Elite speed reader',
      icon: '🔥'
    }
  ],

  /**
   * Speed reading techniques
   */
  techniques: [
    {
      id: 'chunking',
      name: 'Word Chunking',
      description: 'Read groups of words at once instead of individual words',
      tip: 'Try to see 3-5 words as a single unit'
    },
    {
      id: 'peripheral',
      name: 'Peripheral Vision',
      description: 'Use your peripheral vision to capture more words',
      tip: 'Focus on the center but be aware of words around it'
    },
    {
      id: 'no-subvocalization',
      name: 'Reduce Subvocalization',
      description: 'Avoid saying words in your head as you read',
      tip: 'Try humming quietly or counting to suppress inner voice'
    },
    {
      id: 'pointer',
      name: 'Visual Guide',
      description: 'Use your finger or cursor as a pacer',
      tip: 'Move smoothly across lines to maintain speed'
    }
  ],

  /**
   * Calculate WPM from reading session
   */
  calculateWPM(wordCount, durationMs) {
    const minutes = durationMs / 60000
    return Math.round(wordCount / minutes)
  },

  /**
   * Get level for WPM
   */
  getLevelForWPM(wpm) {
    for (let i = this.levels.length - 1; i >= 0; i--) {
      if (wpm >= this.levels[i].wpm) {
        return this.levels[i]
      }
    }
    return this.levels[0]
  },

  /**
   * Get next level
   */
  getNextLevel(currentWPM) {
    const currentLevel = this.getLevelForWPM(currentWPM)
    const currentIndex = this.levels.findIndex(l => l.id === currentLevel.id)
    
    if (currentIndex < this.levels.length - 1) {
      return this.levels[currentIndex + 1]
    }
    return null
  },

  /**
   * Generate practice text at specific level
   */
  getPracticeText(level) {
    const texts = {
      1: "Speed reading is a skill that can be learned with practice. Start by reading at a comfortable pace. Focus on understanding what you read rather than rushing through it. Good comprehension is more important than speed. As you practice, you'll naturally become faster while maintaining understanding.",
      
      2: "Effective speed reading combines several techniques. First, eliminate subvocalization - the habit of saying words in your head. Second, use your peripheral vision to capture groups of words. Third, minimize backtracking by focusing on forward movement. With practice, these techniques become natural and your reading speed increases significantly.",
      
      3: "Advanced readers use chunking to process multiple words simultaneously. Instead of reading word-by-word, they perceive phrases as units. This reduces the number of eye fixations needed per line. Combined with reduced subvocalization and strategic skimming, expert readers can achieve speeds of 500+ words per minute while maintaining excellent comprehension.",
      
      4: "Elite speed readers develop metacognitive awareness of their reading process. They adjust their speed based on content difficulty and purpose. Technical material requires slower, careful reading, while narrative text allows faster processing. They use previewing and skimming strategically, identifying key information quickly. This flexible approach maximizes both speed and comprehension.",
      
      5: "Master speed readers integrate advanced cognitive strategies with physical eye movement optimization. They've trained their visual span to capture 4-6 words per fixation. Saccadic movements are minimized through practice. They use contextual prediction to anticipate content, allowing faster processing. Their working memory is trained to hold larger chunks of information, enabling complex text comprehension at extraordinary speeds."
    }
    
    return texts[level] || texts[1]
  },

  /**
   * Get comprehension questions for text
   */
  getComprehensionQuestions(level) {
    const questions = {
      1: [
        {
          question: "What is more important than speed in reading?",
          options: ["Comprehension", "Speed", "Technique", "Practice"],
          correct: 0
        },
        {
          question: "What happens as you practice reading?",
          options: ["Speed increases", "Understanding decreases", "Both A and B", "Nothing changes"],
          correct: 0
        }
      ],
      2: [
        {
          question: "What is subvocalization?",
          options: ["Reading aloud", "Saying words in your head", "Skipping words", "Using a pointer"],
          correct: 1
        },
        {
          question: "How many techniques are mentioned?",
          options: ["Two", "Three", "Four", "Five"],
          correct: 1
        }
      ],
      3: [
        {
          question: "What is chunking?",
          options: ["Reading slowly", "Processing multiple words at once", "Backtracking", "Skimming"],
          correct: 1
        },
        {
          question: "What speed can expert readers achieve?",
          options: ["300+ WPM", "400+ WPM", "500+ WPM", "600+ WPM"],
          correct: 2
        }
      ],
      4: [
        {
          question: "What is metacognitive awareness?",
          options: ["Reading fast", "Being aware of your reading process", "Skipping words", "Using techniques"],
          correct: 1
        },
        {
          question: "When should you read slower?",
          options: ["Always", "For technical material", "For stories", "Never"],
          correct: 1
        }
      ],
      5: [
        {
          question: "How many words per fixation do masters capture?",
          options: ["1-2", "2-3", "3-4", "4-6"],
          correct: 3
        },
        {
          question: "What do masters use to anticipate content?",
          options: ["Speed", "Contextual prediction", "Techniques", "Memory"],
          correct: 1
        }
      ]
    }
    
    return questions[level] || questions[1]
  },

  /**
   * Calculate improvement percentage
   */
  calculateImprovement(oldWPM, newWPM) {
    if (oldWPM === 0) return 0
    return Math.round(((newWPM - oldWPM) / oldWPM) * 100)
  },

  /**
   * Get personalized recommendation
   */
  getRecommendation(wpm, comprehension) {
    if (comprehension < 70) {
      return {
        type: 'slow-down',
        icon: '🎯',
        message: 'Focus on comprehension first. Speed will come with practice.',
        action: 'Try a slower pace to improve understanding'
      }
    } else if (wpm < 200) {
      return {
        type: 'increase-speed',
        icon: '⚡',
        message: 'Great comprehension! Ready to increase speed.',
        action: 'Try the next level to challenge yourself'
      }
    } else if (wpm < 350) {
      return {
        type: 'learn-techniques',
        icon: '🧠',
        message: 'Learn speed reading techniques to break through.',
        action: 'Practice chunking and reduce subvocalization'
      }
    } else {
      return {
        type: 'maintain',
        icon: '🔥',
        message: 'Excellent speed! Maintain this with regular practice.',
        action: 'Challenge yourself with difficult texts'
      }
    }
  }
}
