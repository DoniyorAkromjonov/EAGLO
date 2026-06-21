import React from 'react'
import styles from '../styles/SettingsPage.module.css'

const themes = [
  { id: 'light', label: '☀️', name: 'Светлая' },
  { id: 'dark', label: '🌙', name: 'Темная' },
  { id: 'green', label: '💚', name: 'Зелёная' },
  { id: 'red', label: '❤️', name: 'Красная' },
  { id: 'blue', label: '💙', name: 'Синяя' },
  { id: 'night', label: '🌑', name: 'Ночная' },
  { id: 'forest', label: '🌲', name: 'Лесная' },
  { id: 'sunset', label: '🌅', name: 'Закат' },
]

const iconSizes = [
  { id: 'small', label: 'Маленькие', scale: 0.8 },
  { id: 'medium', label: 'Средние', scale: 1 },
  { id: 'large', label: 'Большие', scale: 1.2 },
]

const fonts = [
  { id: 'default', label: 'Nunito', family: 'Nunito, sans-serif' },
  { id: 'serif', label: 'Times New Roman', family: 'Times New Roman, serif' },
  { id: 'mono', label: 'Monospace', family: 'Courier New, monospace' },
]

export default function SettingsPage({ theme, setTheme, iconSize, setIconSize, font, setFont }) {
  return (
    <div className="screen">
      <div className={styles.settingsContainer}>
        <h1 className={styles.title}>Настройки</h1>

        <div className={styles.settingGroup}>
          <h2 className={styles.groupTitle}>🎨 Тема</h2>
          <div className={styles.optionsGrid}>
            {themes.map(t => (
              <button
                key={t.id}
                className={`${styles.optionBtn} ${theme === t.id ? styles.active : ''}`}
                onClick={() => setTheme(t.id)}
              >
                <span className={styles.optionIcon}>{t.label}</span>
                <span className={styles.optionLabel}>{t.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className={styles.settingGroup}>
          <h2 className={styles.groupTitle}>📏 Размер иконок</h2>
          <div className={styles.optionsGrid}>
            {iconSizes.map(size => (
              <button
                key={size.id}
                className={`${styles.optionBtn} ${iconSize === size.id ? styles.active : ''}`}
                onClick={() => setIconSize(size.id)}
              >
                <span className={styles.optionIcon} style={{ transform: `scale(${size.scale})` }}>🏠</span>
                <span className={styles.optionLabel}>{size.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className={styles.settingGroup}>
          <h2 className={styles.groupTitle}>🔤 Шрифт</h2>
          <div className={styles.optionsGrid}>
            {fonts.map(f => (
              <button
                key={f.id}
                className={`${styles.optionBtn} ${font === f.id ? styles.active : ''}`}
                onClick={() => setFont(f.id)}
                style={{ fontFamily: f.family }}
              >
                <span className={styles.optionIcon}>Aa</span>
                <span className={styles.optionLabel}>{f.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}