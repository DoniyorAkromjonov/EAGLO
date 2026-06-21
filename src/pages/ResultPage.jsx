import React from 'react'
import endLessonImage from '../assets/end_lesson.png'
import Confetti from '../components/Confetti.jsx'
import styles from '../styles/ResultPage.module.css'

export default function ResultPage({ lesson, mistakes, perfect, xpEarned, coinsEarned, onHome }) {
  const correct = lesson.questions.length - mistakes

  return (
    <>
      <Confetti />
      <div className={styles.resultScreen}>
        <div className={perfect ? 'eaglo-celebrate' : 'eaglo-bounce'}>
          <img
            src={endLessonImage}
            alt="Eaglo"
            className={styles.resultImage}
          />
        </div>

        <h2 className={styles.title}>
          {perfect ? '🏆 Идеально!' : '✅ Урок пройден!'}
        </h2>
        <p className={styles.subtitle}>
          {perfect
            ? 'Ни одной ошибки — орлиный результат!'
            : 'Продолжай практиковаться, орёл!'}
        </p>

        {/* XP banner */}
        <div className={styles.xpBanner}>
          <div>
            <span className={styles.xpBig}>+{xpEarned} XP</span>
            {perfect && <span className={styles.xpBonus}>× 2 бонус за идеал!</span>}
          </div>
          <div className={styles.coinsBig}>+{coinsEarned} 🪙</div>
        </div>

        {/* Stats */}
        <div className={styles.statsRow}>
          <div className={styles.statCard}>
            <span className={styles.statN}>{correct}</span>
            <span className={styles.statL}>Правильно</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statN}>{mistakes}</span>
            <span className={styles.statL}>Ошибки</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statN}>{Math.round((correct / lesson.questions.length) * 100)}%</span>
            <span className={styles.statL}>Точность</span>
          </div>
        </div>

        <button className="btn-primary" onClick={onHome}>
          На главную 🏠
        </button>
      </div>
    </>
  )
}
