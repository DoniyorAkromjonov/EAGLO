import React, { useEffect } from 'react'
import styles from './Notification.module.css'

export default function Notification({ message, onClose, duration = 3000 }) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration)
    return () => clearTimeout(timer)
  }, [onClose, duration])

  return (
    <div className={styles.notification}>
      <span>{message}</span>
      <button onClick={onClose} className={styles.closeBtn}>×</button>
    </div>
  )
}