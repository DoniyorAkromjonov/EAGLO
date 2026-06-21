import { useEffect, useRef } from 'react'
import styles from './ResultScreen.module.css'

export default function ResultScreen({ result, onRestart, onClose }) {
  const { wpm, rawWpm, acc, correct, wrong, elapsed, history } = result
  const svgRef = useRef(null)

  useEffect(() => {
    if (!svgRef.current || !history.length) return
    const W = 600, H = 80
    const max = Math.max(...history, 1)
    const pts = history.map((v, i) => {
      const x = (i / (history.length - 1 || 1)) * W
      const y = H - (v / max) * (H - 12) - 6
      return `${x},${y}`
    }).join(' ')
    const circles = history.map((v, i) => {
      const x = (i / (history.length - 1 || 1)) * W
      const y = H - (v / max) * (H - 12) - 6
      return `<circle cx="${x}" cy="${y}" r="2.5" fill="#e2b714"/>`
    }).join('')
    svgRef.current.innerHTML = `
      <polyline points="${pts}" fill="none" stroke="#e2b714" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      ${circles}
      <line x1="0" y1="${H}" x2="${W}" y2="${H}" stroke="#333" stroke-width="0.5"/>
    `
  }, [history])

  return (
    <div className={styles.screen}>
      <div className={styles.main}>
        <div className={styles.bigStat}>
          <div className={styles.bigVal}>{wpm}</div>
          <div className={styles.bigLabel}>wpm</div>
        </div>
        <div className={styles.secondary}>
          <div className={styles.secItem}>
            <div className={styles.secVal}>{acc}%</div>
            <div className={styles.secLabel}>acc</div>
          </div>
          <div className={styles.secItem}>
            <div className={styles.secVal}>{rawWpm}</div>
            <div className={styles.secLabel}>raw</div>
          </div>
          <div className={styles.secItem}>
            <div className={styles.secVal}>{correct}/{wrong}</div>
            <div className={styles.secLabel}>chars</div>
          </div>
          <div className={styles.secItem}>
            <div className={styles.secVal}>{elapsed}s</div>
            <div className={styles.secLabel}>time</div>
          </div>
        </div>
      </div>

      <svg
        ref={svgRef}
        className={styles.chart}
        viewBox="0 0 600 80"
        preserveAspectRatio="none"
      />

      <div style={{ display: 'flex', gap: '16px' }}>
        <button className={styles.restartBtn} onClick={onRestart}>
          ↺ &nbsp;restart test
        </button>
        <button className={styles.restartBtn} onClick={() => onClose(result)}>
          ← &nbsp;exit
        </button>
      </div>
    </div>
  )
}