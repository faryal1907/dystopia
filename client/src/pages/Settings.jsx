// client/src/pages/Settings.jsx
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Settings as SettingsIcon, 
  User, 
  Eye, 
  Volume2, 
  Languages, 
  Palette, 
  Save, 
  RotateCcw, 
  Type, 
  Zap,
  Globe
} from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import { useUser } from '../context/UserContext.jsx'
import { useTheme } from '../context/ThemeContext.jsx'

const Settings = () => {
  const { user } = useAuth()
  const { settings: userSettings, updateSettings } = useUser()
  const { isDark, toggleTheme, highContrast, toggleHighContrast } = useTheme()
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  // Supported languages for translation
  const supportedLanguages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'it', name: 'Italian' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'ru', name: 'Russian' },
    { code: 'ja', name: 'Japanese' },
    { code: 'ko', name: 'Korean' },
    { code: 'zh', name: 'Chinese' },
    { code: 'ar', name: 'Arabic' },
    { code: 'hi', name: 'Hindi' },
    { code: 'nl', name: 'Dutch' },
    { code: 'pl', name: 'Polish' },
    { code: 'tr', name: 'Turkish' }
  ]

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
    autoTranslate: false,

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
        // Also save to localStorage for immediate access
        localStorage.setItem('voxa-settings', JSON.stringify(formSettings))
        setTimeout(() => setSaved(false), 3000)
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
      autoTranslate: false,
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
      icon: Globe,
      settings: [
        {
          key: 'preferredTranslationLanguage',
          label: 'Preferred Translation Language',
          type: 'select',
          description: 'Your preferred language for translations',
          options: supportedLanguages.map(lang => ({
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
    },
    {
      title: 'Interface Language',
      icon: Languages,
      settings: [
        {
          key: 'language',
          label: 'Interface Language',
          type: 'select',
          description: 'Language for menus and interface elements',
          options: supportedLanguages.map(lang => ({
            value: lang.code,
            label: lang.name
          }))
        }
      ]
    }
  ]

  return (
    <div className={`min-h-screen py-8 transition-colors duration-300 ${
      isDark 
        ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900' 
        : 'bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50'
    }`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className={`inline-flex p-4 rounded-2xl mb-4 shadow-lg ${
            isDark 
              ? 'bg-gradient-to-br from-orange-600 to-red-600' 
              : 'bg-gradient-to-br from-orange-500 to-red-500'
          }`}>
            <SettingsIcon className="h-10 w-10 text-white" />
          </div>
          <h1 className={`text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r ${
            isDark 
              ? 'from-orange-400 to-red-300' 
              : 'from-orange-600 to-red-600'
          } bg-clip-text text-transparent`}>
            Settings
          </h1>
          <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Customize your reading experience and accessibility preferences
          </p>
        </motion.div>

        {/* Theme Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`rounded-xl p-6 border mb-8 shadow-xl ${
            isDark 
              ? 'bg-gray-800/50 border-gray-700 backdrop-blur-lg' 
              : 'bg-white/80 border-gray-200 backdrop-blur-lg'
          }`}
        >
          <h2 className={`text-xl font-semibold mb-6 flex items-center ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            <Palette className="h-5 w-5 mr-2" />
            Appearance
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className={`flex items-center justify-between p-4 rounded-lg ${
              isDark ? 'bg-gray-700/50' : 'bg-gray-50'
            }`}>
              <div>
                <div className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Dark Mode
                </div>
                <div className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Switch between light and dark themes
                </div>
              </div>
              <button
                onClick={toggleTheme}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  isDark ? 'bg-orange-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isDark ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className={`flex items-center justify-between p-4 rounded-lg ${
              isDark ? 'bg-gray-700/50' : 'bg-gray-50'
            }`}>
              <div>
                <div className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  High Contrast
                </div>
                <div className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Increase contrast for better readability
                </div>
              </div>
              <button
                onClick={toggleHighContrast}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  highContrast ? 'bg-orange-600' : 'bg-gray-200'
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
                transition={{ delay: 0.2 + sectionIndex * 0.05 }}
                className={`rounded-xl p-6 border shadow-xl ${
                  isDark 
                    ? 'bg-gray-800/50 border-gray-700 backdrop-blur-lg' 
                    : 'bg-white/80 border-gray-200 backdrop-blur-lg'
                }`}
              >
                <h2 className={`text-xl font-semibold mb-6 flex items-center ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  <Icon className="h-5 w-5 mr-2" />
                  {section.title}
                </h2>

                <div className="space-y-6">
                  {section.settings.map((setting) => (
                    <div key={setting.key} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex-1">
                        <label className={`block font-medium mb-1 ${
                          isDark ? 'text-white' : 'text-gray-900'
                        }`}>
                          {setting.label}
                        </label>
                        {setting.description && (
                          <p className={`text-sm ${
                            isDark ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            {setting.description}
                          </p>
                        )}
                      </div>

                      <div className="sm:min-w-[200px]">
                        {setting.type === 'select' && (
                          <select
                            value={formSettings[setting.key]}
                            onChange={(e) => handleInputChange(setting.key, e.target.value)}
                            className={`w-full p-3 border rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                              isDark 
                                ? 'bg-gray-700 border-gray-600 text-white' 
                                : 'bg-white border-gray-300 text-gray-900'
                            }`}
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
                              className="w-full accent-orange-600"
                            />
                            <div className={`text-center text-sm mt-1 ${
                              isDark ? 'text-gray-400' : 'text-gray-600'
                            }`}>
                              {formSettings[setting.key]}{setting.suffix || ''}
                            </div>
                          </div>
                        )}

                        {setting.type === 'checkbox' && (
                          <label className="flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formSettings[setting.key]}
                              onChange={(e) => handleInputChange(setting.key, e.target.checked)}
                              className="w-5 h-5 text-orange-600 bg-transparent border-gray-400 rounded focus:ring-orange-500 focus:ring-2"
                            />
                            <span className={`ml-3 ${
                              isDark ? 'text-white' : 'text-gray-900'
                            }`}>
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
          className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 mt-8"
        >
          <button
            onClick={handleReset}
            className={`inline-flex items-center px-6 py-3 border rounded-xl transition-all shadow-md hover:shadow-lg w-full sm:w-auto justify-center ${
              isDark 
                ? 'bg-gray-700 text-white border-gray-600 hover:bg-gray-600' 
                : 'bg-white text-gray-900 border-gray-300 hover:bg-gray-50'
            }`}
          >
            <RotateCcw className="h-5 w-5 mr-2" />
            Reset to Defaults
          </button>

          <button
            onClick={handleSave}
            disabled={loading}
            className={`inline-flex items-center px-6 py-3 rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto justify-center ${
              saved
                ? 'bg-green-600 text-white'
                : isDark
                ? 'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white'
                : 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white'
            }`}
          >
            <Save className="h-5 w-5 mr-2" />
            {loading ? 'Saving...' : saved ? 'Saved Successfully!' : 'Save Settings'}
          </button>
        </motion.div>

        {/* Info Message */}
        {saved && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`mt-6 p-4 rounded-xl border text-center ${
              isDark 
                ? 'bg-green-900/30 border-green-700 text-green-300' 
                : 'bg-green-50 border-green-200 text-green-700'
            }`}
          >
            ✨ Your settings have been saved and will apply across all pages!
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default Settings
