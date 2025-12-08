import React, { useState, useRef, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  BookOpen, Menu, X, Sun, Moon, Settings, LogOut, User, 
  Volume2, Languages, Focus, FileText, Brain, Zap, Bookmark, 
  Eye, Target, ChevronDown, Sparkles, LayoutDashboard
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { useEyeComfort } from '../context/EyeComfortContext'

const Navbar = () => {
  const { user, signOut } = useAuth()
  const { isDark, toggleTheme } = useTheme()
  const { isActive, timeRemaining, getFormattedTime } = useEyeComfort()
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showFeaturesDropdown, setShowFeaturesDropdown] = useState(false)
  const dropdownRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowFeaturesDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const features = [
    {
      name: 'Text to Speech',
      href: '/text-to-speech',
      icon: Volume2,
      description: 'Convert text to natural voice',
      gradient: 'from-blue-500 to-cyan-500',
      color: 'text-blue-600 dark:text-blue-400'
    },
    {
      name: 'Translation',
      href: '/translation',
      icon: Languages,
      description: 'Translate to any language',
      gradient: 'from-green-500 to-emerald-500',
      color: 'text-green-600 dark:text-green-400'
    },
    {
      name: 'Focus Mode',
      href: '/focus-mode',
      icon: Focus,
      description: 'Distraction-free reading',
      gradient: 'from-purple-500 to-pink-500',
      color: 'text-purple-600 dark:text-purple-400'
    },
    {
      name: 'AI Summarize',
      href: '/summarize',
      icon: FileText,
      description: 'Extract key points instantly',
      gradient: 'from-pink-500 to-rose-500',
      color: 'text-pink-600 dark:text-pink-400'
    },
    {
      name: 'Quiz',
      href: '/quiz',
      icon: Brain,
      description: 'Test comprehension',
      gradient: 'from-indigo-500 to-purple-500',
      color: 'text-indigo-600 dark:text-indigo-400'
    },
    {
      name: 'Speed Reading',
      href: '/speed-reading',
      icon: Zap,
      description: 'Train reading speed',
      gradient: 'from-orange-500 to-amber-500',
      color: 'text-orange-600 dark:text-orange-400'
    },
    {
      name: 'Collections',
      href: '/collections',
      icon: Bookmark,
      description: 'Save & organize texts',
      gradient: 'from-cyan-500 to-blue-500',
      color: 'text-cyan-600 dark:text-cyan-400'
    },
    {
      name: 'Reading Goals',
      href: '/goals',
      icon: Target,
      description: 'Track your progress',
      gradient: 'from-green-500 to-teal-500',
      color: 'text-green-600 dark:text-green-400'
    }
  ]

  const handleSignOut = async () => {
    await signOut()
    setShowUserMenu(false)
  }

  return (
    <nav className="bg-[var(--bg-primary)]/80 backdrop-blur-xl border-b border-[var(--border-color)] sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <Link to="/" className="flex items-center gap-3">
            {/* Animated Logo */}
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 bg-gradient-to-br from-primary-500 via-secondary-500 to-purple-600 rounded-xl shadow-lg"
            >
              <svg
                className="h-6 w-6 text-white"
                fill="currentColor"
                viewBox="0 0 32 32"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g id="Layer_2" data-name="Layer 2">
                  <path d="M7,14a3,3,0,0,0,3,3,2.73,2.73,0,0,0,.4-.05L14.46,26H13.21A2.21,2.21,0,0,0,11,28.21V30a1,1,0,0,0,1,1h8a1,1,0,0,0,1-1V28.21A2.21,2.21,0,0,0,18.79,26H16.65L12.18,16a2.92,2.92,0,0,0,.1-3.95l4.35-6.25,2.21-.73a3.07,3.07,0,0,0,.7,1l.19.18a3.45,3.45,0,0,0-.22,1.24,3.3,3.3,0,0,0,1,2.3l1.24,1.19a1,1,0,0,0,.69.28h0a1,1,0,0,0,.7-.31l5.55-5.76a1,1,0,0,0,0-1.41L27.46,2.68a3.27,3.27,0,0,0-2.34-.92A3.43,3.43,0,0,0,23.89,2l-.18-.18A3,3,0,0,0,18.79,3h-.11l-3,1a1,1,0,0,0-.5.38l-4.62,6.64A2.68,2.68,0,0,0,10,11,3,3,0,0,0,7,14ZM19,28.21V29H13v-.79a.21.21,0,0,1,.21-.21h5.58A.21.21,0,0,1,19,28.21ZM25.18,3.76a1.28,1.28,0,0,1,.89.36l.52.49L22.42,8.94l-.51-.5a1.29,1.29,0,0,1-.4-.9,1.28,1.28,0,0,1,.36-.91l2.39-2.48A1.26,1.26,0,0,1,25.18,3.76ZM20.9,3.31A1,1,0,0,1,21.62,3a1,1,0,0,1,.7.28L20.93,4.72a1,1,0,0,1-.31-.7A1,1,0,0,1,20.9,3.31ZM9,14a1,1,0,0,1,1-1,1,1,0,0,1,.47.11A1,1,0,0,1,10,15,1,1,0,0,1,9,14Z" />
                </g>
              </svg>
            </motion.div>

            {/* Logo Text */}
            <div className="flex flex-col">
              <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent dyslexia-text"
>
                DYSTOPIA
              </span>
              <span className="text-[9px] text-[var(--text-secondary)] -mt-1 tracking-wider">
                AI Reading Assistant
              </span>
            </div>
          </Link>


          {/* Desktop Navigation */}
          {user && (
            <div className="hidden md:flex items-center space-x-2">
              {/* Dashboard */}
              <Link
                to="/dashboard"
                className={`px-4 py-2 rounded-xl text-sm font-medium dyslexia-text transition-all duration-200 flex items-center space-x-2 ${
                  location.pathname === '/dashboard'
                    ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]'
                }`}
              >
                <LayoutDashboard className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>

              {/* Features Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowFeaturesDropdown(!showFeaturesDropdown)}
                  className="px-4 py-2 rounded-xl text-sm font-medium dyslexia-text transition-all duration-200 flex items-center space-x-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] group"
                >
                  <Sparkles className="h-4 w-4 group-hover:text-primary-500 transition-colors" />
                  <span>Features</span>
                  <ChevronDown 
                    className={`h-4 w-4 transition-transform duration-200 ${
                      showFeaturesDropdown ? 'rotate-180' : ''
                    }`} 
                  />
                </button>

                {/* Features Mega Dropdown */}
                <AnimatePresence>
                  {showFeaturesDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute left-0 mt-2 w-[600px] bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-2xl shadow-2xl overflow-hidden"
                    >
                      {/* Header */}
                      <div className="bg-gradient-to-r from-primary-500 to-secondary-500 p-4">
                        <h3 className="text-white font-bold text-lg dyslexia-text flex items-center">
                          <Sparkles className="h-5 w-5 mr-2" />
                          Explore Features
                        </h3>
                        <p className="text-white/80 text-xs dyslexia-text mt-1">
                          AI-powered tools to enhance your reading experience
                        </p>
                      </div>

                      {/* Features Grid */}
                      <div className="grid grid-cols-2 gap-2 p-3">
                        {features.map((feature) => {
                          const Icon = feature.icon
                          const isActive = location.pathname === feature.href

                          return (
                            <Link
                              key={feature.href}
                              to={feature.href}
                              onClick={() => setShowFeaturesDropdown(false)}
                              className={`group p-4 rounded-xl transition-all duration-200 ${
                                isActive
                                  ? 'bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 border-2 border-primary-500'
                                  : 'hover:bg-[var(--bg-secondary)] border-2 border-transparent'
                              }`}
                            >
                              <div className="flex items-start space-x-3">
                                <div className={`p-2 bg-gradient-to-br ${feature.gradient} rounded-lg group-hover:scale-110 transition-transform`}>
                                  <Icon className="h-5 w-5 text-white" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className={`font-semibold text-sm dyslexia-text mb-1 ${feature.color}`}>
                                    {feature.name}
                                  </h4>
                                  <p className="text-xs text-[var(--text-secondary)] dyslexia-text line-clamp-2">
                                    {feature.description}
                                  </p>
                                </div>
                              </div>
                            </Link>
                          )
                        })}
                      </div>

                      {/* Footer */}
                      <div className="bg-[var(--bg-secondary)] p-3 border-t border-[var(--border-color)]">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-[var(--text-secondary)] dyslexia-text">
                            💡 New features added weekly
                          </span>
                          <Link 
                            to="/settings" 
                            onClick={() => setShowFeaturesDropdown(false)}
                            className="text-primary-600 hover:text-primary-700 dyslexia-text font-medium"
                          >
                            Settings →
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Settings Link */}
              <Link
                to="/settings"
                className={`px-4 py-2 rounded-xl text-sm font-medium dyslexia-text transition-all duration-200 flex items-center space-x-2 ${
                  location.pathname === '/settings'
                    ? 'bg-primary-100 text-primary-700 dark:bg-primary-800 dark:text-primary-200'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]'
                }`}
              >
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </Link>
            </div>
          )}

          {/* Right side controls */}
          <div className="flex items-center space-x-3">
            {/* Eye Comfort Timer Indicator */}
            {user && isActive && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="hidden md:flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-xl border border-blue-200 dark:border-blue-800"
              >
                <Eye className="h-4 w-4 text-blue-600 dark:text-blue-400 animate-pulse" />
                <span className="text-xs text-blue-700 dark:text-blue-300 dyslexia-text font-semibold">
                  {getFormattedTime(timeRemaining)}
                </span>
              </motion.div>
            )}

            {/* Theme toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-[var(--bg-secondary)] text-[var(--text-primary)] hover:bg-gradient-to-br hover:from-primary-100 hover:to-secondary-100 dark:hover:from-primary-900/20 dark:hover:to-secondary-900/20 transition-all shadow-sm"
              aria-label="Toggle theme"
            >
              <motion.div
                initial={false}
                animate={{ rotate: isDark ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {isDark ? (
                  <Sun className="h-5 w-5 text-amber-500" />
                ) : (
                  <Moon className="h-5 w-5 text-indigo-600" />
                )}
              </motion.div>
            </motion.button>

            {/* User menu */}
            {user ? (
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="p-2.5 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 text-white hover:from-primary-600 hover:to-secondary-600 transition-all shadow-lg"
                >
                  <User className="h-5 w-5" />
                </motion.button>

                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-64 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl shadow-2xl overflow-hidden z-50"
                    >
                      {/* User Info */}
                      <div className="bg-gradient-to-r from-primary-500 to-secondary-500 p-4">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-white/20 rounded-lg">
                            <User className="h-6 w-6 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-white font-semibold text-sm dyslexia-text truncate">
                              {user.email?.split('@')[0] || 'User'}
                            </p>
                            <p className="text-white/70 text-xs dyslexia-text truncate">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="p-2">
                        <Link
                          to="/dashboard"
                          className="flex items-center px-3 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] rounded-lg transition-colors dyslexia-text"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <LayoutDashboard className="h-4 w-4 mr-3 text-primary-600" />
                          Dashboard
                        </Link>
                        <Link
                          to="/settings"
                          className="flex items-center px-3 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] rounded-lg transition-colors dyslexia-text"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <Settings className="h-4 w-4 mr-3 text-blue-600" />
                          Settings
                        </Link>
                        <Link
                          to="/goals"
                          className="flex items-center px-3 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] rounded-lg transition-colors dyslexia-text"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <Target className="h-4 w-4 mr-3 text-green-600" />
                          My Goals
                        </Link>
                      </div>

                      {/* Sign Out */}
                      <div className="border-t border-[var(--border-color)] p-2">
                        <button
                          onClick={handleSignOut}
                          className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors dyslexia-text"
                        >
                          <LogOut className="h-4 w-4 mr-3" />
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-[var(--text-primary)] hover:text-primary-600 transition-colors dyslexia-text"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2 text-sm font-medium bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-xl hover:from-primary-700 hover:to-secondary-700 transition-all shadow-lg dyslexia-text"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-lg text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && user && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden py-4 border-t border-[var(--border-color)]"
            >
              <div className="flex flex-col space-y-2">
                {/* Dashboard */}
                <Link
                  to="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-3 rounded-xl text-sm font-medium dyslexia-text transition-all flex items-center space-x-3 bg-[var(--bg-secondary)]"
                >
                  <LayoutDashboard className="h-5 w-5 text-primary-600" />
                  <span>Dashboard</span>
                </Link>

                {/* Features */}
                <div className="px-2 py-2 text-xs font-semibold text-[var(--text-secondary)] dyslexia-text">
                  FEATURES
                </div>
                {features.map((feature) => {
                  const Icon = feature.icon
                  const isActive = location.pathname === feature.href

                  return (
                    <Link
                      key={feature.href}
                      to={feature.href}
                      onClick={() => setIsOpen(false)}
                      className={`px-4 py-3 rounded-xl text-sm font-medium dyslexia-text transition-all flex items-center space-x-3 ${
                        isActive
                          ? 'bg-gradient-to-r from-primary-100 to-secondary-100 dark:from-primary-900/20 dark:to-secondary-900/20'
                          : 'hover:bg-[var(--bg-secondary)]'
                      }`}
                    >
                      <div className={`p-1.5 bg-gradient-to-br ${feature.gradient} rounded-lg`}>
                        <Icon className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className={feature.color}>{feature.name}</div>
                        <div className="text-xs text-[var(--text-secondary)]">{feature.description}</div>
                      </div>
                    </Link>
                  )
                })}

                {/* Settings */}
                <Link
                  to="/settings"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-3 rounded-xl text-sm font-medium dyslexia-text transition-all flex items-center space-x-3 bg-[var(--bg-secondary)] mt-2"
                >
                  <Settings className="h-5 w-5 text-gray-600" />
                  <span>Settings</span>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  )
}

export default Navbar
