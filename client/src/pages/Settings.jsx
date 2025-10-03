// client/src/pages/Settings.jsx
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Settings as SettingsIcon, User, Eye, Volume2, Languages, Palette, Save, RotateCcw, Type, Sliders, Monitor, Zap } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import { useUser } from '../context/UserContext.jsx'
import { useTheme } from '../context/ThemeContext.jsx'
import { translationService } from '../utils/translation'

const Settings = () => {
  const { user } = useAuth()
  const { settings: userSettings, updateSettings } = useUser()
  const { isDark, toggleTheme, highContrast, toggleHighContrast } = useTheme()
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  const [formSettings, setFormSettings] = useState({
    // Typography
    fontSize: 'medium',
    lineHeight: 'normal',
    letterSpacing: 'normal',
    fontFamily: 'lexend',
    wordSpacing: 'normal',

    // Visual
    backgroundColor: 'default',
    backgroundOverlay: false,
    highlightColor: 'blue',

    // Audio
    readingSpeed: 1.0,
    voice: 'default',
    autoPlay: false,

    // Reading Experience
    highlightReading: true,
    showProgress: true,
    dyslexiaFriendly: true,

    // Focus Mode
    focusModeSpeed: 200,
    focusWordByWord: false,
    focusPauseTime: 500,

    // Translation
    preferredTranslationLanguage: 'es',
    autoTranslate: true,

    // Language
    language: 'en'
  })

  useEffect(() => {
    if (userSettings) {
      setFormSettings(prev => ({ ...prev, ...userSettings }))
    }
  }, [userSettings])

  const handleInputChange = (key, value) => {
    setFormSettings(prev => ({ ...prev, [key]: value }))
    setSaved(false)

    // Apply settings immediately for visual feedback
    applySettingsPreview({ ...formSettings, [key]: value })
  }

  const applySettingsPreview = (settings) => {
    const root = document.documentElement

    // Font family
    const fontFamilyMap = {
      lexend: '"Lexend", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      opendyslexic: '"OpenDyslexic", "Comic Sans MS", cursive',
      arial: 'Arial, sans-serif',
      verdana: 'Verdana, sans-serif',
      georgia: 'Georgia, serif'
    }

    if (settings.fontFamily) {
      document.body.style.fontFamily = fontFamilyMap[settings.fontFamily] || fontFamilyMap.lexend
    }

    // Font size
    const fontSizeMap = {
      small: '14px',
      medium: '16px',
      large: '18px',
      xl: '20px',
      xxl: '24px'
    }

    if (settings.fontSize) {
      root.style.setProperty('--base-font-size', fontSizeMap[settings.fontSize])
      document.body.style.fontSize = fontSizeMap[settings.fontSize]
    }

    // Line height
    const lineHeightMap = {
      tight: '1.25',
      normal: '1.5',
      relaxed: '1.75',
      loose: '2'
    }

    if (settings.lineHeight) {
      document.body.style.lineHeight = lineHeightMap[settings.lineHeight]
    }

    // Letter spacing
    const letterSpacingMap = {
      tight: '-0.025em',
      normal: '0',
      wide: '0.025em',
      wider: '0.05em'
    }

    if (settings.letterSpacing) {
      document.body.style.letterSpacing = letterSpacingMap[settings.letterSpacing]
    }

    // Word spacing
    const wordSpacingMap = {
      tight: '0',
      normal: '0.1em',
      wide: '0.2em',
      wider: '0.3em'
    }

    if (settings.wordSpacing) {
      document.body.style.wordSpacing = wordSpacingMap[settings.wordSpacing]
    }

    // Background overlay
    if (settings.backgroundOverlay) {
      root.classList.add('background-overlay')
    } else {
      root.classList.remove('background-overlay')
    }

    // Dyslexia friendly
    if (settings.dyslexiaFriendly) {
      root.classList.add('dyslexia-friendly')
    } else {
      root.classList.remove('dyslexia-friendly')
    }
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      const result = await updateSettings(formSettings)
      if (result.success) {
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
      }
    } catch (error) {
      console.error('Error saving settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    const defaultSettings = {
      fontSize: 'medium',
      lineHeight: 'normal',
      letterSpacing: 'normal',
      fontFamily: 'lexend',
      wordSpacing: 'normal',
      backgroundColor: 'default',
      backgroundOverlay: false,
      highlightColor: 'blue',
      readingSpeed: 1.0,
      voice: 'default',
      autoPlay: false,
      highlightReading: true,
      showProgress: true,
      dyslexiaFriendly: true,
      focusModeSpeed: 200,
      focusWordByWord: false,
      focusPauseTime: 500,
      preferredTranslationLanguage: 'es',
      autoTranslate: true,
      language: 'en'
    }
    setFormSettings(defaultSettings)
    applySettingsPreview(defaultSettings)
    setSaved(false)
  }

  const settingsSections = [
    {
      title: 'Typography',
      icon: Type,
      settings: [
        {
          key: 'fontFamily',
          label: 'Font Family',
          type: 'select',
          options: [
            { value: 'lexend', label: 'Lexend (Recommended for Dyslexia)' },
            { value: 'opendyslexic', label: 'OpenDyslexic' },
            { value: 'arial', label: 'Arial' },
            { value: 'verdana', label: 'Verdana' },
            { value: 'georgia', label: 'Georgia' }
          ]
        },
        {
          key: 'fontSize',
          label: 'Font Size',
          type: 'select',
          options: [
            { value: 'small', label: 'Small (14px)' },
            { value: 'medium', label: 'Medium (16px)' },
            { value: 'large', label: 'Large (18px)' },
            { value: 'xl', label: 'Extra Large (20px)' },
            { value: 'xxl', label: 'Double XL (24px)' }
          ]
        },
        {
          key: 'lineHeight',
          label: 'Line Height',
          type: 'select',
          options: [
            { value: 'tight', label: 'Tight (1.25)' },
            { value: 'normal', label: 'Normal (1.5)' },
            { value: 'relaxed', label: 'Relaxed (1.75)' },
            { value: 'loose', label: 'Loose (2.0)' }
          ]
        },
        {
          key: 'letterSpacing',
          label: 'Letter Spacing',
          type: 'select',
          options: [
            { value: 'tight', label: 'Tight' },
            { value: 'normal', label: 'Normal' },
            { value: 'wide', label: 'Wide' },
            { value: 'wider', label: 'Wider' }
          ]
        },
        {
          key: 'wordSpacing',
          label: 'Word Spacing',
          type: 'select',
          options: [
            { value: 'tight', label: 'Tight' },
            { value: 'normal', label: 'Normal' },
            { value: 'wide', label: 'Wide' },
            { value: 'wider', label: 'Wider' }
          ]
        }
      ]
    },
    {
      title: 'Visual',
      icon: Eye,
      settings: [
        {
          key: 'backgroundColor',
          label: 'Background Theme',
          type: 'select',
          options: [
            { value: 'default', label: 'Default' },
            { value: 'sepia', label: 'Sepia (Warm)' },
            { value: 'dark', label: 'Dark' },
            { value: 'high-contrast', label: 'High Contrast' }
          ]
        },
        {
          key: 'highlightColor',
          label: 'Highlight Color',
          type: 'select',
          options: [
            { value: 'blue', label: 'Blue' },
            { value: 'green', label: 'Green' },
            { value: 'yellow', label: 'Yellow' },
            { value: 'purple', label: 'Purple' },
            { value: 'red', label: 'Red' }
          ]
        },
        {
          key: 'backgroundOverlay',
          label: 'Background Overlay',
          type: 'checkbox',
          description: 'Adds a subtle overlay to reduce eye strain'
        }
      ]
    },
    {
      title: 'Audio',
      icon: Volume2,
      settings: [
        {
          key: 'readingSpeed',
          label: 'Reading Speed',
          type: 'range',
          min: 0.5,
          max: 2.0,
          step: 0.1,
          suffix: 'x'
        },
        {
          key: 'voice',
          label: 'Preferred Voice',
          type: 'select',
          options: [
            { value: 'default', label: 'Default' },
            { value: 'male', label: 'Male Voice' },
            { value: 'female', label: 'Female Voice' }
          ]
        },
        {
          key: 'autoPlay',
          label: 'Auto-play Text',
          type: 'checkbox',
          description: 'Automatically start reading when text is loaded'
        }
      ]
    },
    {
      title: 'Focus Mode',
      icon: Zap,
      settings: [
        {
          key: 'focusModeSpeed',
          label: 'Focus Mode Speed (Words Per Minute)',
          type: 'range',
          min: 100,
          max: 400,
          step: 25,
          suffix: ' WPM'
        },
        {
          key: 'focusPauseTime',
          label: 'Pause Between Lines (milliseconds)',
          type: 'range',
          min: 200,
          max: 2000,
          step: 100,
          suffix: 'ms'
        },
        {
          key: 'focusWordByWord',
          label: 'Word-by-Word Mode',
          type: 'checkbox',
          description: 'Display one word at a time instead of full lines'
        }
      ]
    },
    {
      title: 'Translation',
      icon: Languages,
      settings: [
        {
          key: 'preferredTranslationLanguage',
          label: 'Preferred Translation Language',
          type: 'select',
          description: 'All text will be automatically translated to this language',
          options: translationService.getSupportedLanguages().map(lang => ({
            value: lang.code,
            label: lang.name
          }))
        },
        {
          key: 'autoTranslate',
          label: 'Auto-Translate',
          type: 'checkbox',
          description: 'Automatically translate text as you type'
        }
      ]
    },
    {
      title: 'Reading Experience',
      icon: User,
      settings: [
        {
          key: 'highlightReading',
          label: 'Highlight Current Line',
          type: 'checkbox',
          description: 'Highlights the line being read'
        },
        {
          key: 'showProgress',
          label: 'Show Reading Progress',
          type: 'checkbox',
          description: 'Displays progress bars and reading statistics'
        },
        {
          key: 'dyslexiaFriendly',
          label: 'Dyslexia-Friendly Mode',
          type: 'checkbox',
          description: 'Optimizes text display for dyslexic readers with enhanced spacing'
        }
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)] py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex p-3 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl mb-4">
            <SettingsIcon className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)] dyslexia-text mb-2">
            Settings
          </h1>
          <p className="text-[var(--text-secondary)] dyslexia-text">
            Customize your reading experience and accessibility preferences
          </p>
        </motion.div>

        {/* Theme Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[var(--bg-primary)] rounded-xl p-6 border border-[var(--border-color)] mb-8"
        >
          <h2 className="text-xl font-semibold text-[var(--text-primary)] dyslexia-text mb-6 flex items-center">
            <Palette className="h-5 w-5 mr-2" />
            Appearance
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex items-center justify-between p-4 bg-[var(--bg-secondary)] rounded-lg">
              <div>
                <div className="font-medium text-[var(--text-primary)] dyslexia-text">
                  Dark Mode
                </div>
                <div className="text-sm text-[var(--text-secondary)] dyslexia-text">
                  Switch between light and dark themes
                </div>
              </div>
              <button
                onClick={toggleTheme}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  isDark ? 'bg-primary-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isDark ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-[var(--bg-secondary)] rounded-lg">
              <div>
                <div className="font-medium text-[var(--text-primary)] dyslexia-text">
                  High Contrast
                </div>
                <div className="text-sm text-[var(--text-secondary)] dyslexia-text">
                  Increase contrast for better readability
                </div>
              </div>
              <button
                onClick={toggleHighContrast}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  highContrast ? 'bg-primary-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    highContrast ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Settings Sections */}
        <div className="space-y-8">
          {settingsSections.map((section, sectionIndex) => {
            const Icon = section.icon
            return (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + sectionIndex * 0.1 }}
                className="bg-[var(--bg-primary)] rounded-xl p-6 border border-[var(--border-color)]"
              >
                <h2 className="text-xl font-semibold text-[var(--text-primary)] dyslexia-text mb-6 flex items-center">
                  <Icon className="h-5 w-5 mr-2" />
                  {section.title}
                </h2>

                <div className="space-y-6">
                  {section.settings.map((setting) => (
                    <div key={setting.key} className="flex items-center justify-between">
                      <div className="flex-1 mr-6">
                        <label className="block font-medium text-[var(--text-primary)] dyslexia-text mb-1">
                          {setting.label}
                        </label>
                        {setting.description && (
                          <p className="text-sm text-[var(--text-secondary)] dyslexia-text">
                            {setting.description}
                          </p>
                        )}
                      </div>

                      <div className="min-w-[200px]">
                        {setting.type === 'select' && (
                          <select
                            value={formSettings[setting.key]}
                            onChange={(e) => handleInputChange(setting.key, e.target.value)}
                            className="w-full p-3 border border-[var(--border-color)] rounded-lg bg-[var(--bg-primary)] text-[var(--text-primary)] dyslexia-text focus:outline-none focus:ring-2 focus:ring-primary-500"
                          >
                            {setting.options.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        )}

                        {setting.type === 'range' && (
                          <div>
                            <input
                              type="range"
                              min={setting.min}
                              max={setting.max}
                              step={setting.step}
                              value={formSettings[setting.key]}
                              onChange={(e) => handleInputChange(setting.key, parseFloat(e.target.value))}
                              className="w-full"
                            />
                            <div className="text-center text-sm text-[var(--text-secondary)] dyslexia-text mt-1">
                              {formSettings[setting.key]}{setting.suffix || ''}
                            </div>
                          </div>
                        )}

                        {setting.type === 'checkbox' && (
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={formSettings[setting.key]}
                              onChange={(e) => handleInputChange(setting.key, e.target.checked)}
                              className="w-4 h-4 text-primary-600 bg-[var(--bg-primary)] border-[var(--border-color)] rounded focus:ring-primary-500 focus:ring-2"
                            />
                            <span className="ml-2 text-[var(--text-primary)] dyslexia-text">
                              {formSettings[setting.key] ? 'Enabled' : 'Disabled'}
                            </span>
                          </label>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex items-center justify-center space-x-4 mt-8"
        >
          <button
            onClick={handleReset}
            className="inline-flex items-center px-6 py-3 bg-[var(--bg-secondary)] text-[var(--text-primary)] border border-[var(--border-color)] rounded-lg hover:bg-[var(--bg-primary)] transition-colors dyslexia-text"
          >
            <RotateCcw className="h-5 w-5 mr-2" />
            Reset to Defaults
          </button>

          <button
            onClick={handleSave}
            disabled={loading}
            className={`inline-flex items-center px-6 py-3 rounded-lg transition-colors dyslexia-text ${
              saved
                ? 'bg-green-600 text-white'
                : 'bg-primary-600 text-white hover:bg-primary-700'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <Save className="h-5 w-5 mr-2" />
            {loading ? 'Saving...' : saved ? 'Saved!' : 'Save Settings'}
          </button>
        </motion.div>
      </div>
    </div>
  )
}

export default Settings
