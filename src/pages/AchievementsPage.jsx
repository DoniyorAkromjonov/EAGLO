import React from 'react'
import mainImage from '../assets/main.png'
import { ACHIEVEMENTS } from '../data/achievements.js'
import styles from '../styles/AchievementsPage.module.css'

export default function AchievementsPage({ stats }) {
  const unlocked = ACHIEVEMENTS.filter(a => a.condition(stats))

  return (
    <div className="screen">
      <div className={styles.header}>
        <img src={mainImage} alt="Eaglo" className={styles.headerImage} />
        <h2 className={styles.title}>Достижения</h2>
        <p className={styles.sub}>
          <span style={{ color: 'var(--green-main)', fontWeight: 800 }}>{unlocked.length}</span>
          {' '}из {ACHIEVEMENTS.length} открыто
        </p>
      </div>

      <div className={styles.grid}>
        {ACHIEVEMENTS.map(a => {
          const isUnlocked = a.condition(stats)
          return (
            <div key={a.id} className={`${styles.achCard} ${isUnlocked ? '' : styles.lockedAch}`}>
              <div className={styles.achIcon}>
                <img 
                  src={a.icon} 
                  alt={a.name} 
                  className={styles.achImage}
                  loading="lazy"
                  decoding="async"
                  onError={(e) => {
                    e.target.style.display = 'none'
                  }}
                />
              </div>
              <div className={styles.achName}>{a.name}</div>
              <div className={styles.achDesc}>{a.desc}</div>
              {isUnlocked && (
                <div className={styles.unlockedBadge}>✓ Открыто</div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
