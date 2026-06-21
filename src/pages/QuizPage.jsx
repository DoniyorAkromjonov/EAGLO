import React, { useState } from 'react'
import rightImage from '../assets/right_1.png'
import wrongImage from '../assets/wrong_2.png'
import waitingImage from '../assets/wrong_1.png'
import styles from '../styles/QuizPage.module.css'

export default function QuizPage({ lesson, onComplete, onBack }) {
  const [idx, setIdx] = useState(0)
  const [selected, setSelected] = useState(null)
  const [mistakes, setMistakes] = useState(0)
  const [hearts, setHearts] = useState(3)
  const [eagloMood, setEagloMood] = useState('happy')

  const q = lesson.questions[idx]
  const answered = selected !== null
  const isCorrect = selected === q.answer
  const progress = (idx / lesson.questions.length) * 100

  function handleSelect(i) {
    if (answered) return
    setSelected(i)
    if (i === q.answer) {
      setEagloMood('celebrate')
    } else {
      setEagloMood('wrong')
      setMistakes(m => m + 1)
      setHearts(h => Math.max(0, h - 1))
    }
  }

  function handleNext() {
    if (idx + 1 >= lesson.questions.length) {
      onComplete({ mistakes, perfect: mistakes === 0 })
    } else {
      setIdx(i => i + 1)
      setSelected(null)
      setEagloMood('happy')
    }
  }

  return (
    <div className={styles.quizScreen}>
      {/* Top bar */}
      <div className={styles.topBar}>
        <button className={styles.closeBtn} onClick={onBack}>✕</button>
        <div className="progress-bar-wrap" style={{ flex: 1 }}>
          <div className="progress-bar-fill" style={{ width: progress + '%' }} />
        </div>
        <div className="hearts">
          {[0, 1, 2].map(i => (
            <span key={i} className="heart">{i < hearts ? '❤️' : '🖤'}</span>
          ))}
        </div>
      </div>

      {/* Eaglo */}
      <div className={eagloMood === 'celebrate' ? 'eaglo-celebrate' : eagloMood === 'wrong' ? 'eaglo-shake' : 'eaglo-bounce'}>
        <img
          src={eagloMood === 'celebrate' ? rightImage : eagloMood === 'wrong' ? wrongImage : waitingImage}
          alt="Eaglo"
          className={styles.eagloImage}
        />
      </div>

      {/* Question card */}
      <div className={styles.questionCard}>
        <span className={styles.qLabel}>
          Вопрос {idx + 1} из {lesson.questions.length}
        </span>
        <p className={styles.qText}>{q.q}</p>
        <p className={styles.qHint}>{q.hint}</p>
      </div>

      {/* Options */}
      <div className={styles.optionsGrid}>
        {q.options.map((opt, i) => {
          let cls = styles.optionBtn
          if (answered) {
            if (i === q.answer) cls = `${styles.optionBtn} ${styles.correct}`
            else if (i === selected) cls = `${styles.optionBtn} ${styles.wrong}`
          }
          return (
            <button
              key={i}
              className={cls}
              onClick={() => handleSelect(i)}
              disabled={answered}
            >
              {opt}
            </button>
          )
        })}
      </div>

      {/* Feedback */}
      {answered && (
        <div className={`feedback-box ${isCorrect ? 'correct' : 'wrong'}`}>
          <span className="fb-icon">{isCorrect ? '🎉' : '😅'}</span>
          <div className="fb-text">
            <strong>{isCorrect ? 'Отлично!' : 'Не совсем...'}</strong>
            <span>
              {isCorrect
                ? 'Так держать, орёл!'
                : `Правильно: ${q.options[q.answer]}`}
            </span>
          </div>
        </div>
      )}

      {/* Continue */}
      <button
        className="btn-primary"
        style={{ marginTop: 'auto' }}
        onClick={answered ? handleNext : undefined}
        disabled={!answered}
      >
        {idx + 1 >= lesson.questions.length ? '🏁 Завершить урок' : 'Продолжить →'}
      </button>
    </div>
  )
}
