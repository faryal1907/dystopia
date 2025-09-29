// client/src/pages/LandingPage.jsx
import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { BookOpen, Volume2, Languages, Focus, Award, Users, Heart, ArrowRight, CheckCircle, Star, Play } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

gsap.registerPlugin(ScrollTrigger)

const LandingPage = () => {
  const { user } = useAuth()

  useEffect(() => {
    // Hero animation
    gsap.fromTo('.hero-title', 
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, ease: 'power2.out' }
    )

    gsap.fromTo('.hero-subtitle', 
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, delay: 0.2, ease: 'power2.out' }
    )

    gsap.fromTo('.hero-buttons', 
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 1, delay: 0.4, ease: 'power2.out' }
    )

    // Features animation
    gsap.fromTo('.feature-card', 
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.features-section',
          start: 'top 80%',
        }
      }
    )

    // Stats animation
    gsap.fromTo('.stat-item', 
      { opacity: 0, scale: 0.8 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: 'back.out(1.7)',
        scrollTrigger: {
          trigger: '.stats-section',
          start: 'top 80%',
        }
      }
    )
  }, [])

  const features = [
    {
      icon: Volume2,
      title: 'Text-to-Speech',
      description: 'Advanced AI-powered voice synthesis with natural-sounding voices, adjustable speed, and pronunciation controls.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Languages,
      title: 'Real-time Translation',
      description: 'Instant translation to 50+ languages with dyslexia-friendly formatting and pronunciation guides.',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Focus,
      title: 'Focus Mode',
      description: 'Distraction-free reading environment with line-by-line highlighting and customizable backgrounds.',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Award,
      title: 'Gamified Learning',
      description: 'Track progress, earn achievements, and build reading confidence through engaging challenges.',
      color: 'from-orange-500 to-red-500'
    }
  ]

  const benefits = [
    'Dyslexia-friendly fonts and spacing',
    'Adjustable reading speed and voice',
    'High-contrast themes for better visibility',
    'Progress tracking and achievements',
    'Multi-language support',
    'Mobile-responsive design'
  ]

  const stats = [
    { number: '50K+', label: 'Active Users' },
    { number: '1M+', label: 'Texts Read' },
    { number: '25+', label: 'Languages' },
    { number: '98%', label: 'Satisfaction' }
  ]

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Student',
      content: 'VOXA has transformed my reading experience. The text-to-speech feature helps me understand complex texts better.',
      rating: 5
    },
    {
      name: 'Michael Chen',
      role: 'Teacher',
      content: 'I recommend VOXA to all my students with reading difficulties. The accessibility features are outstanding.',
      rating: 5
    },
    {
      name: 'Emma Williams',
      role: 'Parent',
      content: 'My daughter loves using VOXA. The gamification keeps her engaged and motivated to read more.',
      rating: 5
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-50 via-secondary-50 to-accent-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600/10 to-secondary-600/10"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="text-center">
            <motion.h1 
              className="hero-title text-4xl sm:text-5xl lg:text-6xl font-bold dyslexia-text text-[var(--text-primary)] mb-6"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Making Reading
              <span className="block bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                Accessible for Everyone
              </span>
            </motion.h1>
            
            <motion.p 
              className="hero-subtitle text-xl lg:text-2xl text-[var(--text-secondary)] mb-8 max-w-3xl mx-auto dyslexia-text leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              VOXA is an AI-powered platform designed specifically for people with dyslexia and reading disabilities. 
              Experience text-to-speech, real-time translation, and focus mode in one accessible platform.
            </motion.p>
            
            <motion.div 
              className="hero-buttons flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {user ? (
                <Link
                  to="/dashboard"
                  className="inline-flex items-center px-8 py-4 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transform hover:scale-105 transition-all duration-200 shadow-lg dyslexia-text"
                >
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="inline-flex items-center px-8 py-4 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transform hover:scale-105 transition-all duration-200 shadow-lg dyslexia-text"
                  >
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                  <Link
                    to="/text-to-speech"
                    className="inline-flex items-center px-8 py-4 border-2 border-primary-600 text-primary-600 font-semibold rounded-xl hover:bg-primary-50 dark:hover:bg-primary-900/20 transform hover:scale-105 transition-all duration-200 dyslexia-text"
                  >
                    <Play className="mr-2 h-5 w-5" />
                    Try Demo
                  </Link>
                </>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section py-16 bg-[var(--bg-primary)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div 
                key={index}
                className="stat-item text-center"
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-3xl lg:text-4xl font-bold text-primary-600 mb-2 dyslexia-text">
                  {stat.number}
                </div>
                <div className="text-[var(--text-secondary)] dyslexia-text">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section py-20 bg-[var(--bg-secondary)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold dyslexia-text text-[var(--text-primary)] mb-4">
              Powerful Features for Better Reading
            </h2>
            <p className="text-xl text-[var(--text-secondary)] max-w-3xl mx-auto dyslexia-text leading-relaxed">
              Our comprehensive suite of tools is designed to make reading more accessible, 
              engaging, and effective for everyone.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div 
                  key={index}
                  className="feature-card bg-[var(--bg-primary)] p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-[var(--border-color)]"
                  whileHover={{ y: -5 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className={`inline-flex p-3 bg-gradient-to-r ${feature.color} rounded-xl mb-6`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-4 dyslexia-text">
                    {feature.title}
                  </h3>
                  <p className="text-[var(--text-secondary)] dyslexia-text leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-[var(--bg-primary)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold dyslexia-text text-[var(--text-primary)] mb-6">
                Why Choose VOXA?
              </h2>
              <p className="text-xl text-[var(--text-secondary)] mb-8 dyslexia-text leading-relaxed">
                VOXA is built with accessibility at its core, providing a comprehensive reading solution 
                that adapts to your unique needs and preferences.
              </p>
              
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <motion.div 
                    key={index}
                    className="flex items-center space-x-3"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-[var(--text-primary)] dyslexia-text">
                      {benefit}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-primary-900/20 dark:to-secondary-900/20 p-8 rounded-2xl">
                <div className="flex items-center justify-center">
                  <div className="p-6 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full">
                    <Heart className="h-12 w-12 text-white" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-center mt-6 mb-4 text-[var(--text-primary)] dyslexia-text">
                  Designed with Love
                </h3>
                <p className="text-center text-[var(--text-secondary)] dyslexia-text leading-relaxed">
                  Every feature in VOXA is carefully crafted with input from users, educators, 
                  and accessibility experts to ensure the best possible experience.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-[var(--bg-secondary)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold dyslexia-text text-[var(--text-primary)] mb-4">
              What Our Users Say
            </h2>
            <p className="text-xl text-[var(--text-secondary)] max-w-3xl mx-auto dyslexia-text leading-relaxed">
              Join thousands of satisfied users who have improved their reading experience with VOXA.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div 
                key={index}
                className="bg-[var(--bg-primary)] p-6 rounded-2xl shadow-lg border border-[var(--border-color)]"
                whileHover={{ y: -5 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-[var(--text-primary)] mb-4 dyslexia-text leading-relaxed">
                  "{testimonial.content}"
                </p>
                <div>
                  <div className="font-semibold text-[var(--text-primary)] dyslexia-text">
                    {testimonial.name}
                  </div>
                  <div className="text-[var(--text-secondary)] dyslexia-text text-sm">
                    {testimonial.role}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-secondary-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6 dyslexia-text">
            Ready to Transform Your Reading Experience?
          </h2>
          <p className="text-xl text-primary-100 mb-8 dyslexia-text leading-relaxed">
            Join VOXA today and discover how accessible, engaging, and enjoyable reading can be.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
            {user ? (
              <Link
                to="/dashboard"
                className="inline-flex items-center px-8 py-4 bg-white text-primary-600 font-semibold rounded-xl hover:bg-gray-50 transform hover:scale-105 transition-all duration-200 shadow-lg dyslexia-text"
              >
                Go to Dashboard
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="inline-flex items-center px-8 py-4 bg-white text-primary-600 font-semibold rounded-xl hover:bg-gray-50 transform hover:scale-105 transition-all duration-200 shadow-lg dyslexia-text"
                >
                  Start Free Today
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  to="/text-to-speech"
                  className="inline-flex items-center px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white/10 transform hover:scale-105 transition-all duration-200 dyslexia-text"
                >
                  <Play className="mr-2 h-5 w-5" />
                  Try Demo
                </Link>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

export default LandingPage