import React from 'react'
import mainImage from '../assets/main.png'
import { RANKS, getCurrentRank, getNextRank } from '../data/ranks.js'
import styles from '../styles/RanksPage.module.css'

export default function RanksPage({ stats }) {
  const current = getCurrentRank(stats.xp)
  const next = getNextRank(stats.xp)

  return (
    <div className="screen">
      <div className={styles.header}>
        <img src={mainImage} alt="Eaglo" className={styles.headerImage} />
        <h2 className={styles.title}>Лиги</h2>
        <div className={styles.currentBadge} style={{ background: current.bgColor, color: current.color }}>
          {current.logo ? <img src={current.logo} alt={current.shortName} className={styles.rankLogoSmall} /> : current.emoji} Ты в {current.name}
        </div>
        {next && (
          <p className={styles.nextHint}>
            До {next.logo ? <img src={next.logo} alt={next.shortName} className={styles.rankLogoSmall} /> : next.emoji} {next.shortName} — ещё {next.minXp - stats.xp} XP
          </p>
        )}
      </div>

      <div className={styles.rankList}>
        {RANKS.map(r => {
          const achieved = stats.xp >= r.minXp
          const isCurrent = current.id === r.id
          return (
            <div
              key={r.id}
              className={`${styles.rankItem} ${isCurrent ? styles.active : ''} ${!achieved ? styles.locked : ''}`}
            >
              <div className={styles.rankLogoWrapper}>
                <img src={r.logo} alt={`${r.name} логотип`} className={styles.rankLogo} />
              </div>
              <div className={styles.rankInfo}>
                <h4 className={styles.rankName}>{r.name}</h4>
                <p className={styles.rankDesc}>{r.desc}</p>
              </div>
              <div className={styles.rankRight}>
                <span className={styles.rankXp} style={{ color: r.color }}>
                  {r.minXp}+ XP
                </span>
                {isCurrent && (
                  <span className={styles.youBadge} style={{ background: r.bgColor, color: r.color }}>
                    Ты здесь
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
