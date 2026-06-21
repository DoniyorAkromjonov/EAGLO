import { useState, useEffect, useRef, useCallback } from 'react'
import { WORDS, PUNCTS } from '../data/words.js'
import styles from './TypingTest.module.css'
import ResultScreen from './ResultScreen.jsx'

const TIME_COUNTS = [15, 30, 60, 120]
const WORD_COUNTS = [10, 25, 50, 100]

function generateWords(count, opts, isTime) {
  const total = isTime ? 200 : count
  const result = []
  for (let i = 0; i < total; i++) {
    let w = WORDS[Math.floor(Math.random() * WORDS.length)]
    if (opts.numbers && Math.random() < 0.15) {
      w = Math.floor(Math.random() * 1000).toString()
    }
    if (opts.punctuation && Math.random() < 0.2) {
      w += PUNCTS[Math.floor(Math.random() * PUNCTS.length)]
    }
    result.push(w)
  }
  return result
}

export default function TypingTest({ onClose }) {
  const [mode, setMode] = useState('words')
  const [count, setCount] = useState(25)
  const [opts, setOpts] = useState({ punctuation: false, numbers: false })
  const [words, setWords] = useState([])
  const [letterStates, setLetterStates] = useState([]) // array of arrays: 'correct'|'wrong'|''
  const [extraLetters, setExtraLetters] = useState([]) // array of arrays of chars
  const [currentWord, setCurrentWord] = useState(0)
  const [currentLetter, setCurrentLetter] = useState(0)
  const [started, setStarted] = useState(false)
  const [finished, setFinished] = useState(false)
  const [timeLeft, setTimeLeft] = useState(30)
  const [liveWpm, setLiveWpm] = useState(null)
  const [result, setResult] = useState(null)
  const [wrapTop, setWrapTop] = useState(0)

  const inputRef = useRef(null)
  const wrapRef = useRef(null)
  const startTimeRef = useRef(0)
  const timerRef = useRef(null)
  const correctCharsRef = useRef(0)
  const wrongCharsRef = useRef(0)
  const wpmHistoryRef = useRef([])
  const tabPressedRef = useRef(false)
  const currentWordRef = useRef(0)
  const currentLetterRef = useRef(0)
  const letterStatesRef = useRef([])
  const extraLettersRef = useRef([])
  const finishedRef = useRef(false)

  const syncScroll = useCallback((wordIdx) => {
    if (!wrapRef.current) return
    const wordEl = wrapRef.current.querySelector(`[data-word="${wordIdx}"]`)
    if (!wordEl) return
    const lineH = 44
    const top = wordEl.offsetTop
    const lines = Math.floor(top / lineH)
    setWrapTop(lines > 1 ? -(lines - 1) * lineH : 0)
  }, [])

  const initTest = useCallback(() => {
    clearInterval(timerRef.current)
    const newWords = generateWords(count, opts, mode === 'time')
    const ls = newWords.map(w => Array(w.length).fill(''))
    const ex = newWords.map(() => [])
    setWords(newWords)
    setLetterStates(ls)
    setExtraLetters(ex)
    letterStatesRef.current = ls.map(a => [...a])
    extraLettersRef.current = ex.map(a => [...a])
    setCurrentWord(0)
    setCurrentLetter(0)
    currentWordRef.current = 0
    currentLetterRef.current = 0
    setStarted(false)
    setFinished(false)
    finishedRef.current = false
    setResult(null)
    setLiveWpm(null)
    setWrapTop(0)
    correctCharsRef.current = 0
    wrongCharsRef.current = 0
    wpmHistoryRef.current = []
    const tl = mode === 'time' ? (count === 10 ? 15 : count === 25 ? 30 : count === 50 ? 60 : 120) : count
    setTimeLeft(tl)
    setTimeout(() => inputRef.current?.focus(), 50)
  }, [count, opts, mode])

  useEffect(() => { initTest() }, [initTest])

  const showResults = useCallback(() => {
    if (finishedRef.current) return
    finishedRef.current = true
    setFinished(true)
    clearInterval(timerRef.current)
    const elapsed = (Date.now() - startTimeRef.current) / 1000
    const mins = elapsed / 60
    const cc = correctCharsRef.current
    const wc = wrongCharsRef.current
    const wpm = Math.round(cc / 5 / Math.max(mins, 0.01))
    const rawWpm = Math.round((cc + wc) / 5 / Math.max(mins, 0.01))
    const total = cc + wc
    const acc = total > 0 ? Math.round(cc / total * 100) : 100
    setResult({ wpm, rawWpm, acc, correct: cc, wrong: wc, elapsed: Math.round(elapsed), history: [...wpmHistoryRef.current] })
  }, [])

  const startTimer = useCallback((wordCountTarget) => {
    startTimeRef.current = Date.now()
    setStarted(true)
    if (mode === 'time') {
      const total = count === 10 ? 15 : count === 25 ? 30 : count === 50 ? 60 : 120
      let left = total
      timerRef.current = setInterval(() => {
        left--
        setTimeLeft(left)
        const elapsed = (Date.now() - startTimeRef.current) / 60000
        const wpm = Math.round(correctCharsRef.current / 5 / Math.max(elapsed, 0.001))
        setLiveWpm(wpm)
        wpmHistoryRef.current.push(wpm)
        if (left <= 0) showResults()
      }, 1000)
    } else {
      timerRef.current = setInterval(() => {
        const elapsed = (Date.now() - startTimeRef.current) / 60000
        const wpm = Math.round(correctCharsRef.current / 5 / Math.max(elapsed, 0.001))
        setLiveWpm(wpm)
        wpmHistoryRef.current.push(wpm)
      }, 500)
    }
  }, [mode, count, showResults])

  const handleKeyDown = useCallback((e) => {
    if (finishedRef.current) return

    if (e.key === 'Tab') { tabPressedRef.current = true; e.preventDefault(); return }
    if (tabPressedRef.current && e.key === 'Enter') { initTest(); return }
    tabPressedRef.current = false

    const cw = currentWordRef.current
    const cl = currentLetterRef.current
    const ws = words

    if (!started && e.key.length === 1) startTimer(ws.length)

    if (e.key === 'Backspace') {
      e.preventDefault()
      if (cl > 0) {
        const newCl = cl - 1
        const ls = letterStatesRef.current.map(a => [...a])
        const ex = extraLettersRef.current.map(a => [...a])
        const wordLen = ws[cw]?.length || 0
        if (newCl >= wordLen) {
          ex[cw].pop()
        } else {
          ls[cw][newCl] = ''
        }
        letterStatesRef.current = ls
        extraLettersRef.current = ex
        setLetterStates(ls)
        setExtraLetters(ex)
        currentLetterRef.current = newCl
        setCurrentLetter(newCl)
      } else if (cw > 0) {
        const ls = letterStatesRef.current.map(a => [...a])
        const prevWordLen = ws[cw - 1]?.length || 0
        const prevExtra = extraLettersRef.current[cw - 1]?.length || 0
        const prevIncomplete = ls[cw - 1].some(s => s === '')
        if (prevIncomplete || prevExtra > 0) {
          const newCw = cw - 1
          const newCl = prevWordLen + prevExtra
          currentWordRef.current = newCw
          currentLetterRef.current = newCl
          setCurrentWord(newCw)
          setCurrentLetter(newCl)
          syncScroll(newCw)
        }
      }
      return
    }

    if (e.key === ' ') {
      e.preventDefault()
      if (cl === 0) return
      const wordLen = ws[cw]?.length || 0
      const ls = letterStatesRef.current.map(a => [...a])
      const remaining = ls[cw].filter(s => s === '').length
      if (remaining > 0) {
        for (let i = cl; i < wordLen; i++) ls[cw][i] = 'wrong'
        letterStatesRef.current = ls
        setLetterStates(ls)
      }
      const word = ws[cw] || ''
      const allCorrect = ls[cw].every(s => s === 'correct') && extraLettersRef.current[cw].length === 0
      if (allCorrect) correctCharsRef.current += word.length + 1
      else wrongCharsRef.current++
      const newCw = cw + 1
      currentWordRef.current = newCw
      currentLetterRef.current = 0
      setCurrentWord(newCw)
      setCurrentLetter(0)
      syncScroll(newCw)
      if (mode === 'words' && newCw >= ws.length) showResults()
      return
    }

    if (e.key.length !== 1) return
    e.preventDefault()

    const word = ws[cw] || ''
    const ls = letterStatesRef.current.map(a => [...a])
    const ex = extraLettersRef.current.map(a => [...a])

    if (cl < word.length) {
      const correct = e.key === word[cl]
      ls[cw][cl] = correct ? 'correct' : 'wrong'
      if (correct) correctCharsRef.current++
      else wrongCharsRef.current++
    } else if (cl < word.length + 10) {
      ex[cw].push(e.key)
      wrongCharsRef.current++
    }

    letterStatesRef.current = ls
    extraLettersRef.current = ex
    setLetterStates(ls)
    setExtraLetters(ex)
    currentLetterRef.current = cl + 1
    setCurrentLetter(cl + 1)
  }, [words, started, mode, startTimer, showResults, initTest, syncScroll])

  const toggleOpt = (key) => setOpts(o => ({ ...o, [key]: !o[key] }))

  const switchMode = (m) => {
    setMode(m)
    setCount(m === 'time' ? 30 : 25)
  }

  if (finished && result) {
    return <ResultScreen result={result} onRestart={initTest} onClose={onClose} />
  }

  return (
    <div className={styles.app}>
      <div className={styles.toolbar}>
        <div className={styles.group}>
          <button className={styles.tbBtn} onClick={onClose}>
            <span className={styles.icon}>←</span> exit
          </button>
        </div>

        <div className={styles.group}>
          <button className={`${styles.tbBtn} ${opts.punctuation ? styles.active : ''}`} onClick={() => toggleOpt('punctuation')}>
            <span className={styles.icon}>@</span> punctuation
          </button>
          <div className={styles.sep} />
          <button className={`${styles.tbBtn} ${opts.numbers ? styles.active : ''}`} onClick={() => toggleOpt('numbers')}>
            <span className={styles.icon}>#</span> numbers
          </button>
        </div>

        <div className={styles.group}>
          <button className={`${styles.tbBtn} ${mode === 'time' ? styles.active : ''}`} onClick={() => switchMode('time')}>
            <span className={styles.icon}>⏱</span> time
          </button>
          <div className={styles.sep} />
          <button className={`${styles.tbBtn} ${mode === 'words' ? styles.active : ''}`} onClick={() => switchMode('words')}>
            <span className={styles.icon}>A</span> words
          </button>
        </div>

        <div className={styles.group}>
          {(mode === 'time' ? TIME_COUNTS : WORD_COUNTS).map(n => (
            <button
              key={n}
              className={`${styles.tbBtn} ${count === n ? styles.active : ''}`}
              onClick={() => setCount(n)}
            >{n}</button>
          ))}
        </div>
      </div>

      <div className={styles.mainArea}>
        <div className={styles.langLabel}>🌐 english</div>

        <div className={styles.statsBar}>
          <div className={styles.statItem}>
            <div className={styles.statVal}>{liveWpm ?? '–'}</div>
            <div className={styles.statLabel}>wpm</div>
          </div>
          {mode === 'time' && (
            <div className={styles.statItem}>
              <div className={styles.statVal}>{timeLeft}</div>
              <div className={styles.statLabel}>time</div>
            </div>
          )}
        </div>

        <div className={styles.wordsContainer} onClick={() => inputRef.current?.focus()}>
          <div className={styles.wordsWrap} ref={wrapRef} style={{ top: wrapTop }}>
            {words.map((word, wi) => (
              <div key={wi} className={styles.word} data-word={wi}>
                {[...word].map((ch, li) => {
                  const state = letterStates[wi]?.[li] || ''
                  const isCursor = wi === currentWord && li === currentLetter
                  return (
                    <span
                      key={li}
                      className={[
                        styles.letter,
                        state === 'correct' ? styles.correct : '',
                        state === 'wrong' ? styles.wrong : '',
                        isCursor ? styles.cursor : '',
                      ].join(' ')}
                    >{ch}</span>
                  )
                })}
                {(extraLetters[wi] || []).map((ch, ei) => {
                  const extraIdx = word.length + ei
                  const isCursor = wi === currentWord && currentLetter === extraIdx
                  return (
                    <span key={`e${ei}`} className={`${styles.letter} ${styles.extra} ${styles.wrong} ${isCursor ? styles.cursor : ''}`}>
                      {ch}
                    </span>
                  )
                })}
                {wi === currentWord && currentLetter >= word.length + (extraLetters[wi]?.length || 0) && (
                  <span className={`${styles.letter} ${styles.cursorEnd}`}>&nbsp;</span>
                )}
              </div>
            ))}
          </div>
        </div>

        <input
          ref={inputRef}
          type="text"
          className={styles.hiddenInput}
          onKeyDown={handleKeyDown}
          readOnly
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
        />

        <div className={styles.hint}>
          <span className={styles.hintKey}>tab</span>
          <span>+</span>
          <span className={styles.hintKey}>enter</span>
          <span className={styles.hintText}>– restart</span>
        </div>
      </div>
    </div>
  )
}