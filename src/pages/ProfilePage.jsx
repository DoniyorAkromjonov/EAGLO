import React, { useState, useEffect } from 'react'
import { getCurrentRank } from '../data/ranks.js'
import { getAvatarFrame } from '../data/avatarFrames.js'
import styles from '../styles/ProfilePage.module.css'

export default function ProfilePage({ profile, stats, onUpdateProfile, onLogout }) {
  const [userName, setUserName] = useState(profile.name || 'Пользователь')
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl || '')
  const [isEditing, setIsEditing] = useState(false)
  const [tempName, setTempName] = useState(profile.name || 'Пользователь')

  const rank = getCurrentRank(stats.xp)
  const avatarFrame = getAvatarFrame(profile.avatarFrameId)

  useEffect(() => {
    setUserName(profile.name || 'Пользователь')
    setTempName(profile.name || 'Пользователь')
    setAvatarUrl(profile.avatarUrl || '')
  }, [profile])

  function handleSaveName() {
    const updatedName = tempName.trim() || 'Пользователь'
    setUserName(updatedName)
    setIsEditing(false)
    onUpdateProfile?.({ name: updatedName, avatarUrl })
  }

  function handleCancelEdit() {
    setTempName(userName)
    setIsEditing(false)
  }

  return (
    <div className="screen">
      <div className={styles.profileContainer}>
        <div className={styles.profileHeader}>
          <div className={styles.avatar}>
            {avatarUrl ? <img src={avatarUrl} alt="Avatar" className={styles.avatarImage} /> : rank.emoji}
            {avatarFrame && <img src={avatarFrame.image} alt="" className={styles.avatarFrame} />}
          </div>
          <div className={styles.nameSection}>
            {isEditing ? (
              <div className={styles.editName}>
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  className={styles.nameInput}
                  maxLength={20}
                />
                <button onClick={handleSaveName} className={styles.saveBtn}>✓</button>
                <button onClick={handleCancelEdit} className={styles.cancelBtn}>✗</button>
              </div>
            ) : (
              <div className={styles.nameDisplay}>
                <h1 className={styles.userName}>{userName}</h1>
                <button onClick={() => setIsEditing(true)} className={styles.editBtn}>✏️</button>
              </div>
            )}
            <p className={styles.rankTitle}>{rank.emoji} {rank.name}</p>
          </div>
        </div>

        <div className={styles.avatarForm}>
          <label>
            Ссылка на аватарку
            <input
              type="text"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              className={styles.avatarInput}
              placeholder="https://..."
            />
          </label>
          <div className={styles.profileActions}>
            <button onClick={handleSaveName} className={styles.saveAvatarBtn}>Сохранить профиль</button>
            {onLogout && (
              <button type="button" onClick={onLogout} className={styles.logoutBtn}>
                Выйти
              </button>
            )}
          </div>
        </div>

        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <span className={styles.statValue}>{stats.xp}</span>
            <span className={styles.statLabel}>⭐ XP</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statValue}>{stats.coins}</span>
            <span className={styles.statLabel}>🪙 Монеты</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statValue}>{stats.streak}</span>
            <span className={styles.statLabel}>🔥 Дней подряд</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statValue}>{stats.lessonsCompleted}</span>
            <span className={styles.statLabel}>📚 Уроков пройдено</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statValue}>{stats.perfectLessons}</span>
            <span className={styles.statLabel}>🎯 Идеальных уроков</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statValue}>{stats.ieltsLessons}</span>
            <span className={styles.statLabel}>🎓 IELTS уроков</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statValue}>{stats.satLessons}</span>
            <span className={styles.statLabel}>📖 SAT уроков</span>
          </div>
        </div>
      </div>
    </div>
  )
}
