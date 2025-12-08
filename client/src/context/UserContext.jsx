// src/context/UserContext.jsx
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext.jsx';
import { api, cachedApiCall } from '../utils/api';

const UserContext = createContext({});

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within a UserProvider');
  return context;
};

export const UserProvider = ({ children }) => {
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState(null);
  const [readingProgress, setReadingProgress] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [stats, setStats] = useState({
    totalTextsRead: 0,
    totalReadingTime: 0,
    readingStreak: 0,
    averageSessionTime: 0,
  });
  const [settings, setSettings] = useState({
    fontSize: 'medium',
    lineHeight: 'normal',
    letterSpacing: 'normal',
    fontFamily: 'lexend',
    wordSpacing: 'normal',
    readingSpeed: 1.0,
    voice: 'default',
    autoPlay: false,
    highlightReading: true,
    showProgress: true,
    dyslexiaFriendly: true,
    language: 'en',
    focusModeSpeed: 200,
    focusWordByWord: false,
    focusPauseTime: 500,
    preferredTranslationLanguage: 'es',
    autoTranslate: true,
  });
  const [loading, setLoading] = useState(false);

  const lastFetchRef = useRef({});
  const MIN_FETCH_INTERVAL = 10 * 60 * 1000;

  // Load settings from localStorage
  useEffect(() => {
    if (!user) return;
    const saved = localStorage.getItem(`dystopia-settings-${user.id}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSettings(prev => ({ ...prev, ...parsed }));
        applySettingsToDocument(parsed);
      } catch (e) {
        console.error('Error loading settings:', e);
      }
    }
  }, [user]);

  useEffect(() => {
    if (user) fetchUserData();
    else resetUserData();
  }, [user]);

  const resetUserData = () => {
    setUserProfile(null);
    setReadingProgress([]);
    setAchievements([]);
    setStats({
      totalTextsRead: 0,
      totalReadingTime: 0,
      readingStreak: 0,
      averageSessionTime: 0,
    });
  };

  const shouldFetch = key => Date.now() - (lastFetchRef.current[key] || 0) > MIN_FETCH_INTERVAL;
  const updateLastFetch = key => (lastFetchRef.current[key] = Date.now());

  const fetchUserData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const promises = [];

      if (shouldFetch('settings')) {
        promises.push(
          cachedApiCall(`settings-${user.id}`, () => api.get(`/users/settings/${user.id}`))
            .then(data => {
              if (data) {
                setSettings(prev => ({ ...prev, ...data }));
                localStorage.setItem(`dystopia-settings-${user.id}`, JSON.stringify(data));
                applySettingsToDocument(data);
              }
              updateLastFetch('settings');
              return data;
            })
            .catch(() => ({}))
        );
      }

      if (shouldFetch('stats')) {
        promises.push(
          cachedApiCall(`stats-${user.id}`, () => api.get(`/reading/stats/${user.id}`))
            .then(data => { if (data) setStats(prev => ({ ...prev, ...data })); updateLastFetch('stats'); return data; })
            .catch(() => ({}))
        );
      }

      if (shouldFetch('progress')) {
        promises.push(
          cachedApiCall(`progress-${user.id}`, () => api.get(`/reading/activity/${user.id}?limit=10`))
            .then(data => { setReadingProgress(Array.isArray(data) ? data : []); updateLastFetch('progress'); return data; })
            .catch(() => ([]))
        );
      }

      if (shouldFetch('achievements')) {
        promises.push(
          cachedApiCall(`achievements-${user.id}`, () => api.get(`/users/achievements/${user.id}`))
            .then(data => { setAchievements(Array.isArray(data) ? data : []); updateLastFetch('achievements'); return data; })
            .catch(() => ([]))
        );
      }

      if (shouldFetch('profile')) {
        promises.push(
          cachedApiCall(`profile-${user.id}`, () => api.get(`/users/profile/${user.id}`))
            .then(data => { setUserProfile(data); updateLastFetch('profile'); return data; })
            .catch(() => (null))
        );
      }

      await Promise.allSettled(promises);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async newSettings => {
    const merged = { ...settings, ...newSettings };
    setSettings(merged);
    localStorage.setItem(`dystopia-settings-${user.id}`, JSON.stringify(merged));
    applySettingsToDocument(merged);
    api.put(`/users/settings/${user.id}`, merged).catch(console.error);
    return { success: true, data: merged };
  };

  const applySettingsToDocument = newSettings => {
    const root = document.documentElement;
    const fontMap = { small: '14px', medium: '16px', large: '18px', xl: '20px', xxl: '24px' };
    root.style.setProperty('--base-font-size', fontMap[newSettings.fontSize] || '16px');

    const lineMap = { tight: '1.25', normal: '1.5', relaxed: '1.75', loose: '2' };
    root.style.setProperty('--base-line-height', lineMap[newSettings.lineHeight] || '1.5');

    const letterMap = { tight: '-0.025em', normal: '0', wide: '0.025em', wider: '0.05em' };
    root.style.setProperty('--base-letter-spacing', letterMap[newSettings.letterSpacing] || '0');

    const wordMap = { tight: '0', normal: '0.1em', wide: '0.2em', wider: '0.3em' };
    root.style.setProperty('--word-spacing', wordMap[newSettings.wordSpacing] || '0.1em');

    if (newSettings.backgroundOverlay) root.classList.add('background-overlay');
    else root.classList.remove('background-overlay');

    if (newSettings.dyslexiaFriendly) root.classList.add('dyslexia-friendly');
    else root.classList.remove('dyslexia-friendly');
  };

  const value = { userProfile, readingProgress, achievements, stats, settings, loading, updateSettings, fetchUserData };
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
