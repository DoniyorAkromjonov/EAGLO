import React, { useState } from 'react'
import mainImage from '../assets/main.png'
import courseMap from '../assets/map.jpg'
import { COURSES } from '../data/lessons.js'
import { getCurrentRank, getNextRank } from '../data/ranks.js'
import styles from '../styles/HomePage.module.css'

export default function HomePage({ stats, onStartLesson, onStartTyping }) {
  const [selectedCourse, setSelectedCourse] = useState(null)
  const rank = getCurrentRank(stats.xp)
  const next = getNextRank(stats.xp)
  const xpToNext = next ? next.minXp - stats.xp : 0
  const xpProgress = next
    ? ((stats.xp - rank.minXp) / (next.minXp - rank.minXp)) * 100
    : 100
  const islandPositions = {
    ielts: { x: 62, y: 24 },
    sat: { x: 78, y: 54 },
    typing: { x: 33, y: 58 },
    python: { x: 55, y: 83 },
  }

  return (
    <div className={`screen ${styles.homeScreen}`}>
      <div className={styles.homeGrid}>
        <main className={styles.mainPanel}>
          {/* Hero */}
          <div className={styles.hero}>
            <img src={mainImage} alt="Eaglo" className={styles.heroImage} />
            <div className={styles.heroText}>
              <h1 className={styles.logo}>Eaglo</h1>
              <p className={styles.tagline}>Взлетай выше с каждым новым словом!</p>
            </div>
          </div>

          {/* Stats bar */}
          <div className={styles.statsBar}>
            <div className={styles.statPill}>
              <span className={styles.statNum}>{stats.xp}</span>
              <span className={styles.statLbl}>XP</span>
            </div>
            <div className={styles.statPill}>
              <span className={styles.statNum}>{stats.coins}</span>
              <span className={styles.statLbl}>Монеты</span>
            </div>
            <div className={styles.statPill}>
              <span className={styles.statNum}>{stats.streak}</span>
              <span className={styles.statLbl}>Дней</span>
            </div>
            <div className={styles.statPill}>
              {rank.logo ? (
                <img src={rank.logo} alt={rank.shortName} className={styles.rankIcon} />
              ) : (
                <span className={styles.statNum}>{rank.emoji}</span>
              )}
              <span className={styles.statLbl}>{rank.shortName}</span>
            </div>
          </div>

          {/* Rank progress */}
          {next && (
            <div className={styles.rankProgress}>
              <div className={styles.rankProgressTop}>
                <span style={{ color: rank.color, fontWeight: 800 }}>
                  {rank.logo ? <img src={rank.logo} alt={rank.shortName} className={styles.progressRankIcon} /> : rank.emoji} {rank.shortName}
                </span>
                <span className={styles.xpToNext}>еще {xpToNext} XP до {next.logo ? <img src={next.logo} alt={next.shortName} className={styles.progressRankIcon} /> : next.emoji} {next.shortName}</span>
              </div>
              <div className="progress-bar-wrap" style={{ marginTop: 6 }}>
                <div className="progress-bar-fill" style={{ width: xpProgress + '%' }} />
              </div>
            </div>
          )}

          <div className={styles.typingCard} onClick={onStartTyping}>
            <div className={styles.typingCardTop}>
              <span className={styles.typingLabel}>Typing Test</span>
              <span className={styles.typingTag}>Проверить скорость</span>
            </div>
            <h2 className={styles.typingTitle}>Тренировка скорости печати</h2>
            <p className={styles.typingDescription}>Нажми, чтобы начать тест как в MonkeyType и посмотреть свой WPM.</p>
            <div className={styles.typingStatsRow}>
              <div>
                <span className={styles.typingStatValue}>WPM</span>
                <span className={styles.typingStatLabel}>Скорость</span>
              </div>
              <div>
                <span className={styles.typingStatValue}>TIME</span>
                <span className={styles.typingStatLabel}>Время</span>
              </div>
              <div>
                <span className={styles.typingStatValue}>ACC</span>
                <span className={styles.typingStatLabel}>Точность</span>
              </div>
            </div>
          </div>

          {/* Courses map */}
          <section className={styles.courseMapSection}>
            <div className={styles.mapIntro}>
              <div>
                <span className={styles.mapEyebrow}>Learning map</span>
                <h2 className={styles.mapTitle}>Выбирай остров и проходи курс</h2>
              </div>
              <p className={styles.mapHint}>Каждый остров - отдельный путь. Открытые уроки можно запускать прямо с карты.</p>
            </div>

            <div className={styles.mapBoard}>
              <img src={courseMap} alt="Карта островов курсов" className={styles.mapImage} />
              <div className={styles.mapOverlay}>
                {COURSES.map(course => {
                  const position = islandPositions[course.id] || { x: 50, y: 50 }
                  const completedLessons = course.lessons.filter(lesson => !lesson.locked).length

                  return (
                    <button
                      key={course.id}
                      type="button"
                      className={styles.islandMarker}
                      style={{
                        '--island-x': `${position.x}%`,
                        '--island-y': `${position.y}%`,
                        '--course-color': course.color,
                        '--course-border': course.borderColor,
                        '--course-tag': course.tagColor,
                      }}
                      onClick={() => setSelectedCourse(course)}
                    >
                      <div className={styles.islandArt}>
                        <span className={styles.islandMainIcon}>{course.emoji}</span>
                      </div>
                      <div className={styles.islandLabel}>
                        <strong>{course.title}</strong>
                        <span>{completedLessons}/{course.lessons.length} lessons</span>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          </section>

          {selectedCourse && (
            <div className={styles.courseModalBackdrop} onClick={() => setSelectedCourse(null)}>
              <section className={styles.courseModal} onClick={event => event.stopPropagation()}>
                <header className={styles.courseModalHeader}>
                  <div>
                    <h2 className={styles.courseModalTitle}>
                      <span>{selectedCourse.emoji}</span>
                      {selectedCourse.title}
                    </h2>
                    <p className={styles.courseModalDesc}>{selectedCourse.desc}</p>
                  </div>
                  <button
                    type="button"
                    className={styles.courseModalClose}
                    onClick={() => setSelectedCourse(null)}
                    aria-label="Закрыть"
                  >
                    ×
                  </button>
                </header>

                <div className={styles.modalLessonList}>
                  {selectedCourse.lessons.map(lesson => (
                    <button
                      key={lesson.id}
                      type="button"
                      className={`${styles.modalLesson} ${lesson.locked ? styles.modalLessonLocked : ''}`}
                      onClick={() => {
                        if (lesson.locked) return
                        setSelectedCourse(null)
                        onStartLesson(lesson)
                      }}
                      disabled={lesson.locked}
                    >
                      <span className={styles.modalLessonIcon} style={{ background: lesson.color }}>
                        {lesson.emoji}
                      </span>
                      <span className={styles.modalLessonText}>
                        <strong>{lesson.title}</strong>
                        <small>{lesson.desc}</small>
                      </span>
                      <span className={styles.modalLessonBadge}>
                        {lesson.locked ? '\uD83D\uDD12' : `+${lesson.xp} XP`}
                      </span>
                    </button>
                  ))}
                </div>
              </section>
            </div>
          )}
        </main>

        <aside className={styles.sidebar}>
          <div className={styles.sidebarBrand}>
            <div className={styles.sidebarBrandLogo}>E</div>
            <div>
              <div className={styles.sidebarBrandName}>Eaglo</div>
              <div className={styles.sidebarBrandTag}>Обучение на скорости</div>
            </div>
          </div>
          <div className={`${styles.sidebarCard} ${styles.sidebarLeague}`}>
            <div className={styles.sidebarLeagueHead}>
              <div>
                <span className={styles.sidebarLeagueTitle}>Рубиновая лига</span>
                <p className={styles.sidebarLeagueSubtitle}>Текущее место: 5</p>
              </div>
              <span className={styles.sidebarAction}>Обзор</span>
            </div>
            <div className={styles.sidebarLeagueStats}>
              <div className={styles.sidebarMiniStat}>
                <span className={styles.sidebarMiniStatValue}>{stats.coins}</span>
                <span className={styles.sidebarMiniStatLabel}>Монет</span>
              </div>
              <div className={styles.sidebarMiniStat}>
                <span className={styles.sidebarMiniStatValue}>{stats.xp}</span>
                <span className={styles.sidebarMiniStatLabel}>XP</span>
              </div>
            </div>
            <div className={styles.sidebarLeagueInfo}>
              <span className={styles.sidebarBadge}>{rank.shortName}</span>
              <span className={styles.sidebarInfoText}>Еще {xpToNext} XP до {next ? next.shortName : 'макс.'}</span>
            </div>
            <p className={styles.sidebarNote}>Набери больше XP, чтобы удержать место в лиге.</p>
          </div>

          <div className={`${styles.sidebarCard} ${styles.sidebarTasks}`}>
            <div className={styles.sidebarCardHeader}>
              <span className={styles.sidebarTitle}>Задания дня</span>
              <span className={styles.sidebarAction}>Все</span>
            </div>
            <div className={styles.taskItem}>
              <span className={styles.taskIcon}>XP</span>
              <div className={styles.taskInfo}>
                <span className={styles.taskTitle}>Получи 20 очков опыта</span>
                <span className={styles.taskMeta}>0 / 20</span>
                <div className="progress-bar-wrap">
                  <div className="progress-bar-fill" style={{ width: '0%' }} />
                </div>
              </div>
            </div>
            <div className={styles.taskItem}>
              <span className={styles.taskIcon}>S</span>
              <div className={styles.taskInfo}>
                <span className={styles.taskTitle}>Бонус серии: заработай 10 XP</span>
                <span className={styles.taskMeta}>0 / 10</span>
                <div className="progress-bar-wrap">
                  <div className="progress-bar-fill" style={{ width: '0%' }} />
                </div>
              </div>
            </div>
            <div className={styles.taskItem}>
              <span className={styles.taskIcon}>90</span>
              <div className={styles.taskInfo}>
                <span className={styles.taskTitle}>Пройди 2 урока на 90%+</span>
                <span className={styles.taskMeta}>0 / 2</span>
                <div className="progress-bar-wrap">
                  <div className="progress-bar-fill" style={{ width: '0%' }} />
                </div>
              </div>
            </div>
          </div>

          <div className={`${styles.sidebarCard} ${styles.sidebarProgressCard}`}>
            <div className={styles.sidebarCardHeader}>
              <span className={styles.sidebarTitle}>Прогресс до следующей лиги</span>
            </div>
            <div className={styles.sidebarProgressInfo}>
              <span>Еще {xpToNext} XP до {next ? next.shortName : 'максимального ранга'}</span>
            </div>
            <div className="progress-bar-wrap">
              <div className="progress-bar-fill" style={{ width: xpProgress + '%' }} />
            </div>
            <div className={styles.sidebarProgressRow}>
              <span>{rank.shortName}</span>
              <span>{next ? next.shortName : 'Максимум'}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}


