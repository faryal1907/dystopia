// client/src/pages/Settings.jsx
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Settings as SettingsIcon, 
  User, 
  Eye, 
  Volume2, 
  Languages, 
  Palette,
  Save,
  RotateCcw
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useUser } from '../context/UserContext'
import { useTheme } from '../context/ThemeContext'

const Settings = () => {
  const { user } = useAuth()
  const { settings, updateSettings } = useUser()
  const { isDark, toggleTheme, highContrast, toggleHighContrast } = useTheme()
  const [loading, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const [formSettings, setFormSettings] = useState({
    fontSize: settings.fontSize || 'medium',
    lineHeight: settings.lineHeight || 'normal',
    letterSpacing: settings.letterSpacing || 'normal',
    readingSpeed: settings.readingSpeed || 1.0,
    voice: settings.voice || 'default',
    autoPlay: settings.autoPlay || false,
    highlightReading: settings.highlightReading || true,
    showProgress: settings.showProgress || true,
    language: settings.language || 'en'
  })

  const handleInputChange = (key, value) => {
    setFormSettings(prev => ({ ...prev, [key]: value }))
    setSaved(false)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const result = await updateSettings(formSettings)
      if (result.success) {
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
      }
    } catch (error) {
      console.error('Error saving settings:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleReset = () => {
    const defaultSettings = {
      fontSize: 'medium',
      lineHeight: 'normal',
      letterSpacing: 'normal',
      readingSpeed: 1.0,
      voice: 'default',
      autoPlay: false,
      highlightReading: true,
      showProgress: true,
      language: 'en'
    }
    setFormSettings(defaultSettings)
    setSaved(false)
  }

  const settingsSections = [
    {
      title: 'Typography',
      icon: Eye,
      settings: [
        {
          key: 'fontSize',
          label: 'Font Size',
          type: 'select',
          options: [
            { value: 'small', label: 'Small' },
            { value: 'medium', label: 'Medium' },
            { value: 'large', label: 'Large' },
            { value: 'xl', label: 'Extra Large' },
            { value: 'xxl', label: 'Double XL' }
          ]
        },
        {
          key: 'lineHeight',
          label: 'Line Height',
          type: 'select',
          options: [
            { value: 'tight', label: 'Tight' },
            { value: 'normal', label: 'Normal' },
            { value: 'relaxed', label: 'Relaxed' },
            { value: 'loose', label: 'Loose' }
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
          type: 'checkbox'
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
          type: 'checkbox'
        },
        {
          key: 'showProgress',
          label: 'Show Reading Progress',
          type: 'checkbox'
        }
      ]
    },
    {
      title: 'Language',
      icon: Languages,
      settings: [
        {
          key: 'language',
          label: 'Interface Language',
          type: 'select',
          options: [
            { value: 'en', label: 'English' },
            { value: 'es', label: 'Spanish' },
            { value: 'fr', label: 'French' },
            { value: 'de', label: 'German' },
            { value: 'it', label: 'Italian' }
          ]
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