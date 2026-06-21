import React, { useState, useEffect, useRef } from 'react'
import BottomNav from './components/BottomNav.jsx'
import HomePage from './pages/HomePage.jsx'
import QuizPage from './pages/QuizPage.jsx'
import ResultPage from './pages/ResultPage.jsx'
import AchievementsPage from './pages/AchievementsPage.jsx'
import RanksPage from './pages/RanksPage.jsx'
import ClansPage from './pages/ClansPage.jsx'
import SkinsPage from './pages/SkinsPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import SettingsPage from './pages/SettingsPage.jsx'
import TypingTestPage from './pages/TypingTestPage.jsx'
import AuthPage from './pages/AuthPage.jsx'
import Notification from './components/Notification.jsx'
import { ACHIEVEMENTS } from './data/achievements.js'
import { RANKS } from './data/ranks.js'
import { AVATAR_FRAME_PRICE, AVATAR_FRAMES } from './data/avatarFrames.js'

function readOwnedAvatarFrames() {
  try {
    const parsed = JSON.parse(localStorage.getItem('ownedAvatarFrames') || '[]')
    return Array.isArray(parsed) ? parsed : []
  } catch (err) {
    return []
  }
}

const INITIAL_STATS = {
  xp: 0,
  coins: 0,
  streak: 1,
  lessonsCompleted: 0,
  perfectLessons: 0,
  ieltsLessons: 0,
  satLessons: 0,
  listeningStreak: 0,
  readingStreak: 0,
  writingStreak: 0,
  speakingStreak: 0,
  satMathCorrect: 0,
  satReadingCorrect: 0,
  satWritingPercent: 0,
  maxWpm: 0,
}

export default function App() {
  const [tab, setTab] = useState('home')
  const [activeLesson, setActiveLesson] = useState(null)
  const [quizResult, setQuizResult] = useState(null)
  const [stats, setStats] = useState(INITIAL_STATS)
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light'
  })
  const [iconSize, setIconSize] = useState(() => {
    return localStorage.getItem('iconSize') || 'medium'
  })
  const [font, setFont] = useState(() => {
    return localStorage.getItem('font') || 'default'
  })
  const [authMode, setAuthMode] = useState('login')
  const [authToken, setAuthToken] = useState(() => localStorage.getItem('authToken') || '')
  const [user, setUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [localProfile, setLocalProfile] = useState(() => ({
    name: localStorage.getItem('userName') || 'Пользователь',
    avatarUrl: localStorage.getItem('avatarUrl') || '',
    avatarFrameId: localStorage.getItem('avatarFrameId') || '',
    ownedAvatarFrames: readOwnedAvatarFrames(),
  }))
  const [notifications, setNotifications] = useState([])
  const prevStatsRef = useRef()

  useEffect(() => {
    if (prevStatsRef.current) {
      const prevStats = prevStatsRef.current
      // Check for new achievements
      ACHIEVEMENTS.forEach(a => {
        if (a.condition(stats) && !a.condition(prevStats)) {
          addNotification(`🏆 Достижение разблокировано: ${a.name}`)
        }
      })

      // Check for new rank
      const currentRank = RANKS.find(r => stats.xp >= r.minXp) || RANKS[0]
      const prevRank = RANKS.find(r => prevStats.xp >= r.minXp) || RANKS[0]
      if (currentRank.id !== prevRank.id) {
        addNotification(`🎉 Поздравляем! Вы достигли ${currentRank.name}!`)
      }
    }
    prevStatsRef.current = stats
  }, [stats])

  useEffect(() => {
    localStorage.setItem('theme', theme)
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  useEffect(() => {
    localStorage.setItem('iconSize', iconSize)
    const scale = iconSize === 'small' ? 0.8 : iconSize === 'large' ? 1.2 : 1
    document.documentElement.style.setProperty('--icon-scale', scale)
  }, [iconSize])

  useEffect(() => {
    localStorage.setItem('font', font)
    const fontFamily = font === 'serif' ? 'Times New Roman, serif' : font === 'mono' ? 'Courier New, monospace' : 'Nunito, sans-serif'
    document.documentElement.style.setProperty('--font-family', fontFamily)
  }, [font])

  useEffect(() => {
    async function loadUser() {
      if (!authToken) {
        setAuthLoading(false)
        return
      }

      try {
        const response = await fetch('/api/user', {
          headers: { Authorization: `Bearer ${authToken}` },
        })
        if (!response.ok) {
          setAuthToken('')
          localStorage.removeItem('authToken')
          setAuthLoading(false)
          return
        }

        const data = await response.json()
        setUser(data.user)
        setStats({
          xp: data.user.xp,
          coins: data.user.coins,
          streak: data.user.streak,
          lessonsCompleted: data.user.lessonsCompleted,
          perfectLessons: data.user.perfectLessons,
          ieltsLessons: data.user.ieltsLessons,
          satLessons: data.user.satLessons,
          listeningStreak: data.user.listeningStreak || 0,
          readingStreak: data.user.readingStreak || 0,
          writingStreak: data.user.writingStreak || 0,
          speakingStreak: data.user.speakingStreak || 0,
          satMathCorrect: data.user.satMathCorrect || 0,
          satReadingCorrect: data.user.satReadingCorrect || 0,
          satWritingPercent: data.user.satWritingPercent || 0,
          maxWpm: data.user.maxWpm || 0,
        })
        setTheme(data.user.theme || 'light')
        setIconSize(data.user.iconSize || 'medium')
        setFont(data.user.font || 'default')
      } catch (err) {
        setAuthToken('')
        localStorage.removeItem('authToken')
      } finally {
        setAuthLoading(false)
      }
    }

    loadUser()
  }, [authToken])

  useEffect(() => {
    if (!user) return
    async function saveSettings() {
      try {
        await fetch('/api/user', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({ theme, iconSize, font }),
        })
      } catch (err) {
        console.error('Не удалось синхронизировать настройки', err)
      }
    }
    saveSettings()
  }, [theme, iconSize, font, user, authToken])

  const [activeTyping, setActiveTyping] = useState(false)

  function handleStartLesson(lesson) {
    setActiveLesson(lesson)
    setQuizResult(null)
  }

  function handleStartTyping() {
    setActiveTyping(true)
  }

  function handleCloseTyping(result) {
    if (result) {
      const wpm = result.wpm
      setStats((s) => {
        const updated = {
          ...s,
          maxWpm: Math.max(s.maxWpm, wpm),
        }
        if (user) {
          fetch('/api/user/stats', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${authToken}`,
            },
            body: JSON.stringify(updated),
          }).then(() => {}).catch(() => {})
        }
        return updated
      })
    }
    setActiveTyping(false)
    setTab('home')
  }

  function handleLessonComplete({ mistakes, perfect }) {
    const correct = activeLesson.questions.length - mistakes
    const xpEarned = perfect ? activeLesson.xp * 2 : activeLesson.xp
    const coinsEarned = Math.floor(xpEarned / 5)
    const isIelts = activeLesson.id.startsWith('ielts')
    const isSat = activeLesson.id.startsWith('sat')

    setStats((s) => {
      const updated = {
        ...s,
        xp: s.xp + xpEarned,
        coins: s.coins + coinsEarned,
        lessonsCompleted: s.lessonsCompleted + 1,
        perfectLessons: perfect ? s.perfectLessons + 1 : s.perfectLessons,
        ieltsLessons: isIelts ? s.ieltsLessons + 1 : s.ieltsLessons,
        satLessons: isSat ? s.satLessons + 1 : s.satLessons,
      }

      // Update streaks for IELTS parts
      if (activeLesson.id === 'ielts-2') { // Listening
        updated.listeningStreak = s.listeningStreak + 1
      } else if (activeLesson.id === 'ielts-4') { // Reading
        updated.readingStreak = s.readingStreak + 1
      } else if (activeLesson.id === 'ielts-3') { // Writing
        updated.writingStreak = s.writingStreak + 1
      } else if (activeLesson.id === 'ielts-5') { // Speaking
        updated.speakingStreak = s.speakingStreak + 1
      }

      // Update SAT correct answers
      if (activeLesson.id === 'sat-2') { // SAT Math
        updated.satMathCorrect = s.satMathCorrect + correct
      } else if (activeLesson.id === 'sat-1') { // SAT Reading (Vocabulary)
        updated.satReadingCorrect = s.satReadingCorrect + correct
      } else if (activeLesson.id === 'sat-3') { // SAT Writing
        const percent = Math.round((correct / activeLesson.questions.length) * 100)
        updated.satWritingPercent = Math.max(s.satWritingPercent, percent)
      }

      if (user) {
        fetch('/api/user/stats', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify(updated),
        }).then(() => {}).catch(() => {})
      }

      return updated
    })

    setQuizResult({ mistakes, perfect, xpEarned, coinsEarned })
  }

  function handleGoHome() {
    setActiveLesson(null)
    setQuizResult(null)
    setTab('home')
  }

  function handleAuthSuccess(userData, token) {
    setAuthToken(token)
    localStorage.setItem('authToken', token)
    setUser(userData)
    setStats({
      xp: userData.xp,
      coins: userData.coins,
      streak: userData.streak,
      lessonsCompleted: userData.lessonsCompleted,
      perfectLessons: userData.perfectLessons,
      ieltsLessons: userData.ieltsLessons,
      satLessons: userData.satLessons,
      listeningStreak: userData.listeningStreak || 0,
      readingStreak: userData.readingStreak || 0,
      writingStreak: userData.writingStreak || 0,
      speakingStreak: userData.speakingStreak || 0,
      satMathCorrect: userData.satMathCorrect || 0,
      satReadingCorrect: userData.satReadingCorrect || 0,
      satWritingPercent: userData.satWritingPercent || 0,
      maxWpm: userData.maxWpm || 0,
    })
    setTheme(userData.theme || 'light')
    setIconSize(userData.iconSize || 'medium')
    setFont(userData.font || 'default')
  }

  function handleLogout() {
    setUser(null)
    setAuthToken('')
    localStorage.removeItem('authToken')
    setTab('home')
  }

  async function updateUser() {
    if (user && authToken) {
      try {
        const res = await fetch('/api/user', {
          headers: { Authorization: `Bearer ${authToken}` }
        })
        const data = await res.json()
        if (res.ok) {
          setUser(data.user)
          setStats({
            xp: data.user.xp,
            coins: data.user.coins,
            streak: data.user.streak,
            lessonsCompleted: data.user.lessonsCompleted,
            perfectLessons: data.user.perfectLessons,
            ieltsLessons: data.user.ieltsLessons,
            satLessons: data.user.satLessons,
            listeningStreak: data.user.listeningStreak || 0,
            readingStreak: data.user.readingStreak || 0,
            writingStreak: data.user.writingStreak || 0,
            speakingStreak: data.user.speakingStreak || 0,
            satMathCorrect: data.user.satMathCorrect || 0,
            satReadingCorrect: data.user.satReadingCorrect || 0,
            satWritingPercent: data.user.satWritingPercent || 0,
            maxWpm: data.user.maxWpm || 0,
          })
        }
      } catch (err) {
        console.error(err)
      }
    }
  }

  async function handleUpdateProfile(updates) {
    if (user && authToken) {
      try {
        const response = await fetch('/api/user', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify(updates),
        })
        const data = await response.json()
        if (response.ok) {
          setUser(data.user)
          return
        }
      } catch (err) {
        console.error(err)
      }
    }

    const newProfile = {
      ...localProfile,
      ...updates,
    }
    setLocalProfile(newProfile)
    if (updates.name) localStorage.setItem('userName', updates.name)
    if (updates.avatarUrl !== undefined) localStorage.setItem('avatarUrl', updates.avatarUrl)
    if (updates.avatarFrameId !== undefined) localStorage.setItem('avatarFrameId', updates.avatarFrameId)
    if (updates.ownedAvatarFrames !== undefined) {
      localStorage.setItem('ownedAvatarFrames', JSON.stringify(updates.ownedAvatarFrames))
    }
  }

  const activeProfile = user ? user : localProfile

  async function handleApplyFrame(frameId) {
    await handleUpdateProfile({ avatarFrameId: frameId })
  }

  async function handleBuyFrame(frameId) {
    const frameExists = AVATAR_FRAMES.some((frame) => frame.id === frameId)
    const ownedFrames = activeProfile.ownedAvatarFrames || []

    if (!frameExists || ownedFrames.includes(frameId) || stats.coins < AVATAR_FRAME_PRICE) return

    const nextStats = {
      ...stats,
      coins: stats.coins - AVATAR_FRAME_PRICE,
    }
    const profileUpdates = {
      ownedAvatarFrames: [...ownedFrames, frameId],
      avatarFrameId: frameId,
    }

    setStats(nextStats)
    await handleUpdateProfile(profileUpdates)

    if (user && authToken) {
      try {
        const response = await fetch('/api/user/stats', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify(nextStats),
        })
        const data = await response.json()
        if (response.ok) {
          setUser(data.user)
        }
      } catch (err) {
        console.error(err)
      }
    }
  }

  // Quiz flow — no nav
  if (authLoading) {
    return (
      <div className="screen">
        <div style={{ maxWidth: 480, margin: '0 auto', textAlign: 'center' }}>
          <h2>Загрузка...</h2>
          <p>Проверяем учетную запись.</p>
        </div>
      </div>
    )
  }

  if (!user && !authToken) {
    return (
      <AuthPage
        mode={authMode}
        onModeChange={setAuthMode}
        onAuthSuccess={handleAuthSuccess}
      />
    )
  }

  if (activeTyping) {
    return <TypingTestPage onClose={handleCloseTyping} />
  }

  if (activeLesson && !quizResult) {
    return (
      <QuizPage
        lesson={activeLesson}
        onComplete={handleLessonComplete}
        onBack={handleGoHome}
      />
    )
  }

  if (activeLesson && quizResult) {
    return (
      <ResultPage
        lesson={activeLesson}
        {...quizResult}
        onHome={handleGoHome}
      />
    )
  }

  function addNotification(message) {
    const id = Date.now()
    setNotifications((prev) => [...prev, { id, message }])
  }

  function removeNotification(id) {
    setNotifications((prev) => prev.filter(n => n.id !== id))
  }

  return (
    <>
      {notifications.map(n => (
        <Notification
          key={n.id}
          message={n.message}
          onClose={() => removeNotification(n.id)}
        />
      ))}
      {tab === 'home' && (
        <HomePage stats={stats} onStartLesson={handleStartLesson} onStartTyping={handleStartTyping} />
      )}
      {tab === 'achievements' && (
        <AchievementsPage stats={stats} />
      )}
      {tab === 'ranks' && (
        <RanksPage stats={stats} />
      )}
      {tab === 'clans' && (
        <ClansPage user={user} authToken={authToken} onUpdateUser={updateUser} />
      )}
      {tab === 'skins' && (
        <SkinsPage
          stats={stats}
          profile={activeProfile}
          onBuyFrame={handleBuyFrame}
          onApplyFrame={handleApplyFrame}
        />
      )}
      {tab === 'profile' && (
        <ProfilePage
          profile={activeProfile}
          stats={stats}
          onUpdateProfile={handleUpdateProfile}
          onLogout={handleLogout}
        />
      )}
      {tab === 'typing' && <TypingTestPage />}
      {tab === 'settings' && (
        <SettingsPage
          theme={theme}
          setTheme={setTheme}
          iconSize={iconSize}
          setIconSize={setIconSize}
          font={font}
          setFont={setFont}
        />
      )}

      <BottomNav active={tab} onSelect={setTab} />
    </>
  )
}
